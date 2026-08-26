import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/i18n";
import { useSessionUser } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/journal")({
  component: JournalPage,
});

const KINDS = ["reflection", "prayer", "question"] as const;

function JournalPage() {
  const { lang, t } = useLang();
  const { user } = useSessionUser();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("reflection");

  const notes = useQuery({
    queryKey: ["notes", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("id, kind, body, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notes")
        .insert({ user_id: user!.id, kind, body: body.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["notes", user?.id] });
    },
    onError: () => toast.error("Impossible d'enregistrer la note."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes", user?.id] }),
  });

  return (
    <AppShell>
      <span className="eyebrow">{t("journal")}</span>
      <h2 className="mt-2 font-serif text-2xl font-medium leading-snug">{t("journalTitle")}</h2>

      <div className="mt-6 flex gap-1 rounded-lg bg-sand p-1">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={
              kind === k
                ? "flex-1 rounded-md bg-paper px-2 py-2 text-xs font-medium"
                : "flex-1 rounded-md px-2 py-2 text-xs font-medium text-clay"
            }
          >
            {t(k)}
          </button>
        ))}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder={t("newNote")}
        className="mt-4 w-full resize-none rounded-lg border border-border bg-card px-3 py-3 text-base leading-relaxed outline-none focus:ring-2 focus:ring-ring/30"
      />
      <button
        type="button"
        disabled={!body.trim() || add.isPending}
        onClick={() => add.mutate()}
        className="mt-3 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-40"
      >
        {t("addNote")}
      </button>

      <ul className="mt-10 space-y-6 border-t border-border pt-6">
        {(notes.data ?? []).map((n) => (
          <li key={n.id}>
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">{t(n.kind as (typeof KINDS)[number])}</span>
              <span className="text-[10px] text-clay">
                {new Date(n.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB")}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap font-serif text-lg leading-relaxed">{n.body}</p>
            <button
              type="button"
              onClick={() => remove.mutate(n.id)}
              className="mt-2 text-[10px] uppercase tracking-widest text-clay"
            >
              {lang === "fr" ? "Supprimer" : "Delete"}
            </button>
          </li>
        ))}
        {notes.data?.length === 0 ? (
          <li className="text-sm italic text-clay">
            {lang === "fr" ? "Votre journal est encore vierge." : "Your journal is still blank."}
          </li>
        ) : null}
      </ul>
    </AppShell>
  );
}
