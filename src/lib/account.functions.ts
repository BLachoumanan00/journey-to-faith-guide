import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { detailsSchema, addressSchema, POLICY_VERSION, OTP_SECONDS, csvRows } from "./account-rules";
import type { AccountDetails } from "./account-rules";
import { encryptValue, decryptValue, fingerprint } from "./account-crypto";

function authClient(url: string, key: string, token?: string) {
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization"); headers.set("apikey", key); return fetch(input, { ...init, headers }); },
  } });
}
const challengeSchema = z.object({ id: z.string().uuid(), secret: z.string().uuid(), code: z.string().regex(/^\d{4,8}$/) });
const genericError = { ok: false as const, error: "unavailable" };

export const phoneAuthConfig = createServerFn({ method: "GET" }).handler(async () => {
  setResponseHeader("Cache-Control", "no-store");
  const siteKey = process.env['TURNSTILE_SITE_KEY'];
  return { siteKey: siteKey ?? null, ready: Boolean(siteKey && process.env['TURNSTILE_SECRET_KEY'] && process.env['ACCOUNT_DATA_KEY']) };
});

export const requestPhoneCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ details: detailsSchema, captcha: z.string().min(1).max(2048), changePhone: z.boolean().optional() }).parse(input))
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    try {
      const key = process.env['ACCOUNT_DATA_KEY'];
      const captchaKey = process.env['TURNSTILE_SECRET_KEY'];
      const url = process.env['SUPABASE_URL']; const publicKey = process.env['SUPABASE_PUBLISHABLE_KEY'];
      if (!key || !captchaKey || !url || !publicKey) return { ok: false as const, error: "setup" };
      const request = getRequest();
      // Only the platform-controlled Cloudflare header is trusted. Never trust client-supplied X-Forwarded-For.
      const ip = request.headers.get("cf-connecting-ip");
      if (!ip && !new URL(request.url).hostname.match(/^(localhost|127\.0\.0\.1)$/)) return { ok: false as const, error: "setup" };
      const body = new URLSearchParams({ secret: captchaKey, response: data.captcha });
      if (ip) body.set("remoteip", ip);
      const captchaResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
      const captchaResult = await captchaResponse.json() as { success?: boolean; hostname?: string };
      if (!captchaResponse.ok || !captchaResult.success || captchaResult.hostname !== new URL(request.url).hostname) return { ok: false as const, error: "captcha" };
      const phoneHash = await fingerprint(`phone:${data.details.phone}`, key);
      const ipHash = await fingerprint(`ip:${ip ?? "local-development"}`, key);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const allowed = await supabaseAdmin.rpc("claim_phone_request", { _phone_hash: phoneHash, _ip_hash: ipHash });
      if (allowed.error) return genericError;
      if (!allowed.data) return { ok: false as const, error: "limited" };
      const bearer = request.headers.get("authorization")?.replace(/^Bearer /, "");
      const publicAuth = authClient(url, publicKey, bearer);
      const current = bearer ? await publicAuth.auth.getUser(bearer) : null;
      const currentUser = current?.data.user;
      if (data.changePhone && (!currentUser || currentUser.is_anonymous || !currentUser.phone)) return { ok: false as const, error: "session" };
      const secret = crypto.randomUUID();
      const saved = await supabaseAdmin.from("phone_auth_challenges").insert({
        secret_hash: await fingerprint(secret, key), phone_hash: phoneHash,
        phone_encrypted: await encryptValue(data.details.phone, key),
        details_encrypted: await encryptValue({ ...data.details, consentAt: new Date().toISOString() }, key),
        guest_id: currentUser?.is_anonymous || data.changePhone ? (currentUser?.id ?? null) : null,
        otp_type: data.changePhone ? "phone_change" : "sms",
      }).select("id, expires_at").single();
      if (saved.error) return genericError;
      const sent = data.changePhone
        ? await publicAuth.auth.updateUser({ phone: data.details.phone })
        : await publicAuth.auth.signInWithOtp({ phone: data.details.phone, options: { shouldCreateUser: true } });
      if (sent.error) {
        await supabaseAdmin.from("phone_auth_challenges").delete().eq("id", saved.data.id);
        return { ok: false as const, error: sent.error.status === 429 ? "limited" : "sms" };
      }
      return { ok: true as const, id: saved.data.id, secret, expiresAt: saved.data.expires_at, seconds: OTP_SECONDS };
    } catch { return genericError; }
  });

export const verifyPhoneCode = createServerFn({ method: "POST" }).inputValidator((input: unknown) => challengeSchema.parse(input))
  .handler(async ({ data }) => {
    setResponseHeader("Cache-Control", "no-store");
    try {
      const key = process.env['ACCOUNT_DATA_KEY']; const url = process.env['SUPABASE_URL']; const publicKey = process.env['SUPABASE_PUBLISHABLE_KEY'];
      if (!key || !url || !publicKey) return genericError;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const hash = await fingerprint(data.secret, key);
      const claimed = await supabaseAdmin.rpc("claim_phone_attempt", { _id: data.id, _secret_hash: hash });
      const challenge = claimed.data?.[0];
      if (claimed.error || !challenge) return { ok: false as const, error: "expired" };
      const phone = await decryptValue<string>(challenge.phone_encrypted, key);
      const bearer = getRequest().headers.get("authorization")?.replace(/^Bearer /, "");
      const auth = authClient(url, publicKey, challenge.otp_type === "phone_change" ? bearer : undefined);
      if (challenge.otp_type === "phone_change") {
        const current = bearer ? await auth.auth.getUser(bearer) : null;
        if (!current?.data.user || current.data.user.id !== challenge.guest_id) return { ok: false as const, error: "session" };
      }
      const verified = await auth.auth.verifyOtp({ phone, token: data.code, type: challenge.otp_type === "phone_change" ? "phone_change" : "sms" });
      if (verified.error || !verified.data.user || !verified.data.session || verified.data.user.phone !== phone || verified.data.user.is_anonymous) return { ok: false as const, error: "code", remaining: 5 - challenge.attempts };
      const consumed = await supabaseAdmin.rpc("finish_phone_challenge", { _id: data.id, _secret_hash: hash });
      if (consumed.error || !consumed.data) return { ok: false as const, error: "expired" };
      const user = verified.data.user;
      const details = await decryptValue<AccountDetails & { consentAt: string }>(challenge.details_encrypted, key);
      const existing = await supabaseAdmin.from("users").select("id").eq("id", user.id).maybeSingle();
      if (existing.error) return genericError;
      const now = new Date().toISOString();
      const saved = existing.data
        ? await supabaseAdmin.from("users").update({ last_login: now, phone_encrypted: challenge.phone_encrypted, phone_hash: challenge.phone_hash, consent_privacy_at: details.consentAt, consent_sensitive_at: details.consentAt, policy_version: POLICY_VERSION }).eq("id", user.id)
        : await supabaseAdmin.from("users").insert({ id: user.id, full_name: details.full_name, phone_hash: challenge.phone_hash, phone_encrypted: challenge.phone_encrypted, address_encrypted: await encryptValue({ street: details.street, city: details.city, postal_code: details.postal_code, country: details.country }, key), consent_privacy_at: details.consentAt, consent_sensitive_at: details.consentAt, policy_version: POLICY_VERSION, last_login: now });
      if (saved.error) return genericError;
      const profile = await supabaseAdmin.from("profiles").select("id").eq("id", user.id).maybeSingle();
      if (!profile.data) await supabaseAdmin.from("profiles").insert({ id: user.id, display_name: details.full_name });
      const role = await supabaseAdmin.from("user_roles").select("id").eq("user_id", user.id).eq("role", "seeker").maybeSingle();
      if (!role.data) await supabaseAdmin.from("user_roles").insert({ user_id: user.id, role: "seeker" });
      let transferred = true;
      if (challenge.guest_id && challenge.otp_type === "sms" && challenge.guest_id !== user.id) {
        const result = await supabaseAdmin.rpc("transfer_guest_study", { _guest: challenge.guest_id, _user: user.id });
        transferred = !result.error;
      }
      await supabaseAdmin.from("phone_auth_challenges").delete().eq("id", challenge.id);
      return { ok: true as const, access_token: verified.data.session.access_token, refresh_token: verified.data.session.refresh_token, transferred };
    } catch { return genericError; }
  });

export const getAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader("Cache-Control", "no-store");
  const key = process.env['ACCOUNT_DATA_KEY'];
  if (!key) throw new Error("Account temporarily unavailable");
  const row = await context.supabase.from("users").select("*").eq("id", context.userId).maybeSingle();
  if (row.error) throw new Error("Account temporarily unavailable");
  if (!row.data) return null;
  const { phone_encrypted, phone_hash: _hash, address_encrypted, ...record } = row.data;
  return { ...record, phone: await decryptValue<string>(phone_encrypted, key), ...await decryptValue<{ street: string; city: string; postal_code: string; country: string }>(address_encrypted, key) };
});

export const updateAccount = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => addressSchema.parse(input)).handler(async ({ data, context }) => {
    const current = await context.supabase.auth.getUser();
    if (current.error || !current.data.user?.phone || current.data.user.is_anonymous) throw new Error("Sign in required");
    const key = process.env['ACCOUNT_DATA_KEY']; if (!key) throw new Error("Account temporarily unavailable");
    const own = await context.supabase.from("users").select("id").eq("id", context.userId).single();
    if (own.error) throw new Error("Account unavailable");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { full_name, ...address } = data;
    const result = await supabaseAdmin.from("users").update({ full_name, address_encrypted: await encryptValue(address, key) }).eq("id", context.userId);
    if (result.error) throw new Error("Could not save account");
    await context.supabase.from("profiles").update({ display_name: full_name }).eq("id", context.userId);
    return { ok: true };
  });

export const adminUsersCsv = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader("Cache-Control", "no-store");
  const permission = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (permission.error || permission.data !== true) throw new Error("Administrator access required");
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

export const exportOwnData = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  setResponseHeader("Cache-Control", "no-store");
  const key = process.env['ACCOUNT_DATA_KEY']; if (!key) throw new Error("Export unavailable");
  const row = await context.supabase.from("users").select("*").eq("id", context.userId).single();
  if (row.error) throw new Error("Account unavailable");
  const { phone_encrypted, address_encrypted, phone_hash: _hash, ...account } = row.data;
  const [answers, progress, notes, messages, links, sessions, requests] = await Promise.all([
    context.supabase.from("answers").select("*").eq("user_id", context.userId),
    context.supabase.from("progress").select("*").eq("user_id", context.userId),
    context.supabase.from("notes").select("*").eq("user_id", context.userId),
    context.supabase.from("lesson_messages").select("*").or(`seeker_id.eq.${context.userId},author_id.eq.${context.userId}`),
    context.supabase.from("mentor_links").select("*").or(`seeker_id.eq.${context.userId},mentor_id.eq.${context.userId}`),
    context.supabase.from("study_sessions").select("*").or(`seeker_id.eq.${context.userId},mentor_id.eq.${context.userId}`),
    context.supabase.from("baptism_requests").select("*").eq("seeker_id", context.userId),
  ]);
  if ([answers, progress, notes, messages, links, sessions, requests].some(r => r.error)) throw new Error("Export unavailable");
  return { account: { ...account, phone: await decryptValue<string>(phone_encrypted, key), address: await decryptValue<{ street: string; city: string; postal_code: string; country: string }>(address_encrypted, key) }, answers: answers.data, progress: progress.data, notes: notes.data, messages: messages.data, mentor_links: links.data, study_sessions: sessions.data, baptism_requests: requests.data };
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