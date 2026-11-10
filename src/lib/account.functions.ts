import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { detailsSchema, profileSchema, POLICY_VERSION, csvRows } from "./account-rules";
import { encryptValue, decryptValue, fingerprint } from "./account-crypto";
import { collectPages } from "./pagination";
import { requireAdminPermission } from "./admin-contacts";

function authClient(url: string, key: string, token?: string) {
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization"); headers.set("apikey", key); return fetch(input, { ...init, headers }); },
  } });
}
const genericError = { ok: false as const, error: "unavailable" };

export const completeProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ details: detailsSchema, guestToken: z.string().max(4096).optional() }).parse(input))
  .handler(async ({ data, context }) => {
    setResponseHeader("Cache-Control", "no-store");
    try {
      const key = process.env['ACCOUNT_DATA_KEY']; const url = process.env['SUPABASE_URL']; const publicKey = process.env['SUPABASE_PUBLISHABLE_KEY'];
      if (!key || !url || !publicKey) return genericError;
      const current = await context.supabase.auth.getUser();
      const user = current.data.user;
      if (current.error || !user || user.is_anonymous || !user.email) return { ok: false as const, error: "session" };
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const details = data.details; const now = new Date().toISOString();
      const phoneHash = await fingerprint(`phone:${details.phone}`, key);
      const taken = await supabaseAdmin.from("users").select("id").eq("phone_hash", phoneHash).neq("id", user.id).maybeSingle();
      if (taken.error) return genericError;
      if (taken.data) return { ok: false as const, error: "phone_taken" };
      const row = { full_name: details.full_name, phone_hash: phoneHash, phone_encrypted: await encryptValue(details.phone, key), address_encrypted: await encryptValue({ street: details.street, city: details.city, country: details.country }, key), consent_privacy_at: now, consent_sensitive_at: now, policy_version: POLICY_VERSION, last_login: now };
      const existing = await supabaseAdmin.from("users").select("id").eq("id", user.id).maybeSingle();
      if (existing.error) return genericError;
      const saved = existing.data ? await supabaseAdmin.from("users").update(row).eq("id", user.id) : await supabaseAdmin.from("users").insert({ id: user.id, ...row });
      if (saved.error) return genericError;
      const profile = await supabaseAdmin.from("profiles").select("id").eq("id", user.id).maybeSingle();
      if (!profile.data) await supabaseAdmin.from("profiles").insert({ id: user.id, display_name: details.full_name });
      const role = await supabaseAdmin.from("user_roles").select("id").eq("user_id", user.id).eq("role", "seeker").maybeSingle();
      if (!role.data) await supabaseAdmin.from("user_roles").insert({ user_id: user.id, role: "seeker" });
      let transferred = true;
      if (data.guestToken) {
        // Only a verified anonymous device session can hand its progress over.
        const guest = await authClient(url, publicKey, data.guestToken).auth.getUser(data.guestToken);
        if (guest.data.user?.is_anonymous && guest.data.user.id !== user.id) {
          const result = await supabaseAdmin.rpc("transfer_guest_study", { _guest: guest.data.user.id, _user: user.id });
          transferred = !result.error;
        }
      }
      return { ok: true as const, transferred };
    } catch { return genericError; }
  });

export const touchLogin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("users").update({ last_login: new Date().toISOString() }).eq("id", context.userId);
  return { ok: true };
});

export const getAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader("Cache-Control", "no-store");
  const key = process.env['ACCOUNT_DATA_KEY'];
  if (!key) throw new Error("Account temporarily unavailable");
  const row = await context.supabase.from("users").select("*").eq("id", context.userId).maybeSingle();
  if (row.error) throw new Error("Account temporarily unavailable");
  if (!row.data) return null;
  const { phone_encrypted, phone_hash: _hash, address_encrypted, ...record } = row.data;
  return { ...record, phone: await decryptValue<string>(phone_encrypted, key), ...await decryptValue<{ street: string; city: string; country: string }>(address_encrypted, key) };
});

export const updateAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileSchema.parse(input)).handler(async ({ data, context }) => {
    const current = await context.supabase.auth.getUser();
    if (current.error || !current.data.user || current.data.user.is_anonymous) throw new Error("Sign in required");
    const key = process.env['ACCOUNT_DATA_KEY']; if (!key) throw new Error("Account temporarily unavailable");
    const own = await context.supabase.from("users").select("id").eq("id", context.userId).single();
    if (own.error) throw new Error("Account unavailable");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { full_name, phone, ...address } = data;
    const phoneHash = await fingerprint(`phone:${phone}`, key);
    const taken = await supabaseAdmin.from("users").select("id").eq("phone_hash", phoneHash).neq("id", context.userId).maybeSingle();
    if (taken.data) throw new Error("Phone number already used");
    const result = await supabaseAdmin.from("users").update({ full_name, phone_hash: phoneHash, phone_encrypted: await encryptValue(phone, key), address_encrypted: await encryptValue(address, key) }).eq("id", context.userId);
    if (result.error) throw new Error("Could not save account");
    await context.supabase.from("profiles").update({ display_name: full_name }).eq("id", context.userId);
    return { ok: true };
  });

export const adminUsersCsv = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader("Cache-Control", "no-store");
  const permission = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  requireAdminPermission(permission);
  const key = process.env['ACCOUNT_DATA_KEY']; if (!key) throw new Error("Export unavailable");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const rows: Record<string, unknown>[] = [];
  for (let offset = 0; ; offset += 500) {
    const result = await supabaseAdmin.from("users").select("*").order("created_at").range(offset, offset + 499);
    if (result.error) throw new Error("Export unavailable");
    for (const r of result.data ?? []) rows.push({ id: r.id, full_name: r.full_name, phone: await decryptValue<string>(r.phone_encrypted, key), ...await decryptValue<Record<string, string>>(r.address_encrypted, key), created_at: r.created_at, last_login: r.last_login, consent_privacy_at: r.consent_privacy_at, consent_sensitive_at: r.consent_sensitive_at, policy_version: r.policy_version });
    if ((result.data?.length ?? 0) < 500) break;
  }
  return { csv: csvRows(rows), count: rows.length };
});

export const getAdminContacts = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader("Cache-Control", "no-store");
  requireAdminPermission(await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }));
  const key = process.env['ACCOUNT_DATA_KEY'];
  if (!key) throw new Error("Directory unavailable");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const rows = await collectPages(async (from, to) => {
    const result = await supabaseAdmin.from("users").select("id, full_name, phone_encrypted, address_encrypted, created_at, last_login, consent_announcements_at").order("created_at", { ascending: false }).order("id").range(from, to);
    if (result.error) throw new Error("Directory unavailable");
    return result.data ?? [];
  });
  const contacts = [];
  for (const row of rows) {
    const identity = await supabaseAdmin.auth.admin.getUserById(row.id);
    if (identity.error) throw new Error("Directory unavailable");
    const address = await decryptValue<{ street: string; city: string; country: string }>(row.address_encrypted, key);
    contacts.push({ id: row.id, full_name: row.full_name, email: identity.data.user.email ?? "", phone: await decryptValue<string>(row.phone_encrypted, key), street: address.street, city: address.city, country: address.country, created_at: row.created_at, last_login: row.last_login, consent_announcements_at: row.consent_announcements_at });
  }
  return contacts;
});

export const setAnnouncementConsent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ enabled: z.boolean() }).parse(input)).handler(async ({ data, context }) => {
    setResponseHeader("Cache-Control", "no-store");
    const own = await context.supabase.from("users").select("id").eq("id", context.userId).single();
    if (own.error) throw new Error("Account unavailable");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const result = await supabaseAdmin.from("users").update({ consent_announcements_at: data.enabled ? new Date().toISOString() : null }).eq("id", context.userId);
    if (result.error) throw new Error("Could not save preference");
    return { ok: true };
  });

export const exportOwnData = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader("Cache-Control", "no-store");
  const key = process.env['ACCOUNT_DATA_KEY']; if (!key) throw new Error("Export unavailable");
  const row = await context.supabase.from("users").select("*").eq("id", context.userId).single();
  if (row.error) throw new Error("Account unavailable");
  const { phone_encrypted, address_encrypted, phone_hash: _hash, ...account } = row.data;
  const read = async (table: "answers" | "progress" | "notes" | "lesson_messages" | "mentor_links" | "study_sessions" | "baptism_requests", filter: string) => collectPages(async (from, to) => {
    const result = await context.supabase.from(table).select("*").or(filter).order("id").range(from, to);
    if (result.error) throw new Error("Export unavailable");
    return result.data ?? [];
  });
  const [answers, progress, notes, messages, links, sessions, requests] = await Promise.all([
    read("answers", `user_id.eq.${context.userId}`), read("progress", `user_id.eq.${context.userId}`), read("notes", `user_id.eq.${context.userId}`),
    read("lesson_messages", `seeker_id.eq.${context.userId},author_id.eq.${context.userId}`), read("mentor_links", `seeker_id.eq.${context.userId},mentor_id.eq.${context.userId}`),
    read("study_sessions", `seeker_id.eq.${context.userId},mentor_id.eq.${context.userId}`), read("baptism_requests", `seeker_id.eq.${context.userId}`),
  ]);
  return { account: { ...account, phone: await decryptValue<string>(phone_encrypted, key), address: await decryptValue<{ street: string; city: string; country: string }>(address_encrypted, key) }, answers, progress, notes, messages, mentor_links: links, study_sessions: sessions, baptism_requests: requests };
});

export const withdrawSensitiveConsent = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const own = await context.supabase.from("users").select("id").eq("id", context.userId).single();
  if (own.error) throw new Error("Account unavailable");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const result = await supabaseAdmin.rpc("withdraw_account_consent", { _user: context.userId });
  if (result.error) throw new Error("Could not withdraw consent");
  return { ok: true };
});

export const deleteOwnAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ confirm: z.literal(true) }).parse(input)).handler(async ({ context }) => {
    const user = await context.supabase.auth.getUser();
    if (user.error || !user.data.user || user.data.user.is_anonymous) throw new Error("Sign in required");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const erased = await supabaseAdmin.rpc("erase_account_data", { _user: context.userId });
    if (erased.error) throw new Error("Could not delete account data");
    const deleted = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (deleted.error) throw new Error("Account data erased; sign-in removal needs support");
    return { ok: true };
  });