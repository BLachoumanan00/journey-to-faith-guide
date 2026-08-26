import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/i18n";
import { useProfile, useRoles, useSessionUser } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/mentor")({
  component: MentorPage,
});

function MentorPage() {
  const { lang, t } = useLang();
  const { user } = useSessionUser();
  const profile = useProfile(user?.id);
  const roles = useRoles(user?.id);
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const [reply, setReply] = useState<Record<string, string>>({});

  const links = useQuery({
    queryKey: ["links", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mentor_links")
        .select("id, mentor_id, seeker_id, created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const asMentor = (links.data ?? []).filter((l) => l.mentor_id === user?.id);
  const asSeeker = (links.data ?? []).filter((l) => l.seeker_id === user?.id);

  const people = useQuery({
    queryKey: ["people", asMentor.map((l) => l.seeker_id).join(","), asSeeker.map((l) => l.mentor_id).join(",")],
    enabled: (links.data ?? []).length > 0,
    queryFn: async () => {
      const ids = [...asMentor.map((l) => l.seeker_id), ...asSeeker.map((l) => l.mentor_id)];
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", ids);
      if (error) throw error;
      return data ?? [];
    },
  });

  const messages = useQuery({
    queryKey: ["messages", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_messages")
        .select("id, seeker_id, author_id, body, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const link = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("link_seeker_by_code", { _code: code });
      if (error) throw error;
      await supabase.from("user_roles").insert({ user_id: user!.id, role: "mentor" });
    },
    onSuccess: () => {
      setCode("");
      toast.success(lang === "fr" ? "Étudiant(e) lié(e)." : "Student linked.");
      qc.invalidateQueries({ queryKey: ["links", user?.id] });
      qc.invalidateQueries({ queryKey: ["roles", user?.id] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Code inconnu"),
  });

  const send = useMutation({
    mutationFn: async (input: { seekerId: string; body: string }) => {
      const { error } = await supabase.from("lesson_messages").insert({
        seeker_id: input.seekerId,
        author_id: user!.id,
        body: input.body.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setReply({});
      qc.invalidateQueries({ queryKey: ["messages", user?.id] });
    },
  });

  const nameOf = (id: string) =>
    (people.data ?? []).find((p) => p.id === id)?.display_name ?? (lang === "fr" ? "Ami(e)" : "Friend");

  const isMentor = roles.data?.includes("mentor") || asMentor.length > 0;

  return (
    <AppShell>
      <span className="eyebrow">{t("mentor")}</span>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <span className="eyebrow">{t("inviteCode")}</span>
        <p className="mt-2 font-serif text-3xl tracking-[0.2em]">{profile.data?.invite_code ?? "······"}</p>
        <p className="mt-2 text-xs leading-relaxed text-clay">
          {lang === "fr"
            ? "Donnez ce code à la personne qui vous accompagne pour qu'elle suive vos réponses."
            : "Give this code to the person accompanying you so they can follow your answers."}
        </p>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <span className="eyebrow">{t("linkSeeker")}</span>
        <div className="mt-3 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="AB12CD"
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2.5 text-base tracking-widest outline-none focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="button"
            disabled={code.trim().length < 4 || link.isPending}
            onClick={() => link.mutate()}
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40"
          >
            {t("link")}
          </button>
        </div>
      </div>

      {isMentor ? (
        <div className="mt-8 border-t border-border pt-6">
          <span className="eyebrow">{t("seekers")}</span>
          <ul className="mt-3 space-y-3">
            {asMentor.map((l) => (
              <li key={l.id} className="rounded-lg border border-border p-4">
                <p className="font-serif text-lg">{nameOf(l.seeker_id)}</p>
                <textarea
                  value={reply[l.seeker_id] ?? ""}
                  onChange={(e) => setReply((r) => ({ ...r, [l.seeker_id]: e.target.value }))}
                  rows={2}
                  placeholder={lang === "fr" ? "Un mot d'encouragement…" : "A word of encouragement…"}
                  className="mt-3 w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                />
                <button
                  type="button"
                  disabled={!(reply[l.seeker_id] ?? "").trim()}
                  onClick={() => send.mutate({ seekerId: l.seeker_id, body: reply[l.seeker_id]! })}
                  className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
                >
                  {t("send")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 border-t border-border pt-6">
        <span className="eyebrow">{t("mentorNotes")}</span>
        {asSeeker.length === 0 && !isMentor ? (
          <p className="mt-3 text-sm leading-relaxed text-clay">{t("noMentor")}</p>
        ) : null}
        <ul className="mt-4 space-y-5">
          {(messages.data ?? []).map((m) => (
            <li key={m.id}>
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">
                  {m.author_id === user?.id ? (lang === "fr" ? "Vous" : "You") : nameOf(m.author_id)}
                </span>
                <span className="text-[10px] text-clay">
                  {new Date(m.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB")}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed">{m.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
