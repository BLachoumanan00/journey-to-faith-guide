import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/i18n";
import { useSessionUser } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { baptismUnlocked, fetchLessons, fetchProgress } from "@/lib/study";

export const Route = createFileRoute("/_authenticated/bapteme")({
  component: BaptismPage,
});

function BaptismPage() {
  const { lang, t } = useLang();
  const { user } = useSessionUser();
  const qc = useQueryClient();
  const [reflection, setReflection] = useState("");

  const lessons = useQuery({ queryKey: ["lessons"], queryFn: fetchLessons });
  const progress = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => fetchProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const requests = useQuery({
    queryKey: ["baptism", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("baptism_requests")
        .select("id, reflection, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const request = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("baptism_requests")
        .insert({ seeker_id: user!.id, reflection: reflection.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setReflection("");
      toast.success(t("baptismSent"));
      qc.invalidateQueries({ queryKey: ["baptism", user?.id] });
    },
    onError: () => toast.error("Impossible d'envoyer la demande pour l'instant."),
  });

  const unlocked = baptismUnlocked(lessons.data ?? [], progress.data ?? []);

  return (
    <AppShell>
      <span className="eyebrow">{t("milestone")}</span>
      <h2 className="mt-2 font-serif text-3xl font-medium leading-tight">{t("baptismStep")}</h2>
      <p className="mt-4 text-base leading-relaxed text-clay">{t("baptismIntro")}</p>

      {!unlocked ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-5">
          <p className="text-sm leading-relaxed text-clay">{t("milestoneLocked")}</p>
          <Link to="/lecons" className="mt-3 inline-block text-sm font-medium text-ribbon">
            {t("lessons")} →
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 border-t border-border pt-6">
            <span className="eyebrow">{t("baptismReflect")}</span>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={5}
              className="mt-3 w-full resize-none rounded-lg border border-border bg-card px-3 py-3 text-base leading-relaxed outline-none focus:ring-2 focus:ring-ring/30"
            />
            <div className="mt-4 space-y-3">
              <button
                type="button"
                disabled={request.isPending}
                onClick={() => request.mutate()}
                className="w-full rounded-lg bg-ink px-4 py-3 text-sm font-medium text-paper disabled:opacity-40"
              >
                {t("baptismTalk")}
              </button>
              <Link
                to="/mentor"
                className="block w-full rounded-lg border border-border px-4 py-3 text-center text-sm font-medium"
              >
                {t("baptismLater")}
              </Link>
            </div>
          </div>

          {(requests.data ?? []).length > 0 ? (
            <ul className="mt-8 space-y-4 border-t border-border pt-6">
              {(requests.data ?? []).map((r) => (
                <li key={r.id}>
                  <span className="eyebrow">
                    {new Date(r.created_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB")}
                  </span>
                  <p className="mt-1 whitespace-pre-wrap font-serif text-lg leading-relaxed">
                    {r.reflection}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <span className="eyebrow">{t("followUp")}</span>
        <p className="mt-2 text-sm leading-relaxed text-clay">
          {lang === "fr"
            ? "Le chemin continue après le baptême : les dernières leçons parlent de la vie d'église, du témoignage et de la marche quotidienne."
            : "The road continues after baptism: the final lessons speak of church life, witness and the daily walk."}
        </p>
      </div>
    </AppShell>
  );
}
