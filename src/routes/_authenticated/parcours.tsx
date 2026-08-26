import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/i18n";
import { useProfile, useSessionUser } from "@/hooks/useSession";
import {
  baptismUnlocked,
  completedCount,
  fetchLessons,
  fetchProgress,
  lessonTitle,
  statusOf,
  TOTAL_LESSONS,
} from "@/lib/study";

export const Route = createFileRoute("/_authenticated/parcours")({
  component: Journey,
});

function Journey() {
  const { lang, t } = useLang();
  const { user } = useSessionUser();
  const profile = useProfile(user?.id);

  const lessons = useQuery({ queryKey: ["lessons"], queryFn: fetchLessons });
  const progress = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => fetchProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const rows = progress.data ?? [];
  const all = lessons.data ?? [];
  const done = completedCount(rows);
  const next = all.find((l) => statusOf(rows, l.id) !== "completed") ?? all[all.length - 1];
  const unlocked = baptismUnlocked(all, rows);

  return (
    <AppShell>
      <p className="text-base leading-relaxed">
        {lang === "fr"
          ? `Bonjour ${profile.data?.display_name ?? "Ami(e)"}, votre place est gardée.`
          : `Hello ${profile.data?.display_name ?? "friend"}, your place is kept.`}
      </p>

      <div className="mt-8 border-t border-border pt-6">
        <span className="eyebrow">
          {done} {t("progressOf")} {TOTAL_LESSONS}
        </span>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: TOTAL_LESSONS }).map((_, i) => (
            <span
              key={i}
              className={
                i < done ? "h-1 flex-1 rounded-full bg-ribbon" : "h-1 flex-1 rounded-full bg-sand"
              }
            />
          ))}
        </div>
      </div>

      {next ? (
        <Link
          to="/lecons/$position"
          params={{ position: String(next.position) }}
          className="mt-8 block rounded-xl border border-border bg-card p-5"
        >
          <span className="eyebrow">{t("nextStep")}</span>
          <h2 className="mt-2 font-serif text-2xl font-medium leading-snug">
            {t("lesson")} {next.position} · {lessonTitle(next, lang)}
          </h2>
          <span className="mt-4 inline-block text-sm font-medium text-ribbon">
            {statusOf(rows, next.id) === "in_progress" ? t("continue") : t("begin")} →
          </span>
        </Link>
      ) : null}

      <div className="mt-8 rounded-xl border border-dashed border-border p-5">
        <span className="eyebrow">{t("milestone")}</span>
        {unlocked ? (
          <>
            <p className="mt-2 text-sm leading-relaxed">{t("baptismIntro")}</p>
            <Link to="/bapteme" className="mt-3 inline-block text-sm font-medium text-ribbon">
              {t("baptismStep")} →
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-clay">{t("milestoneLocked")}</p>
        )}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-clay">{t("reminderDue")}</p>

      <div className="mt-8 border-t border-border pt-6">
        <Link to="/profil" className="text-sm font-medium text-clay">
          {lang === "fr" ? "Mon compte et mes rappels" : "My account and reminders"} →
        </Link>
      </div>
    </AppShell>
  );
}
