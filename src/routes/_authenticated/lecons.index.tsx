import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/i18n";
import { useSessionUser } from "@/hooks/useSession";
import { CORE_LESSONS, fetchLessons, fetchProgress, lessonTitle, statusOf } from "@/lib/study";

export const Route = createFileRoute("/_authenticated/lecons/")({
  component: LessonList,
});

function LessonList() {
  const { lang, t } = useLang();
  const { user } = useSessionUser();

  const lessons = useQuery({ queryKey: ["lessons"], queryFn: fetchLessons });
  const progress = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => fetchProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const rows = progress.data ?? [];

  return (
    <AppShell>
      <span className="eyebrow">{t("lessons")}</span>
      {lessons.isPending ? <p className="mt-6 italic text-clay">{t("loading")}</p> : null}

      <ol className="mt-6 divide-y divide-border border-y border-border">
        {(lessons.data ?? []).map((l) => {
          const status = statusOf(rows, l.id);
          return (
            <li key={l.id}>
              <Link
                to="/lecons/$position"
                params={{ position: String(l.position) }}
                className="flex items-baseline gap-4 py-4"
              >
                <span className="w-7 shrink-0 font-serif text-lg text-clay">
                  {String(l.position).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block font-serif text-lg leading-snug">{lessonTitle(l, lang)}</span>
                  <span className="mt-0.5 block text-[10px] uppercase tracking-widest text-clay">
                    {status === "completed"
                      ? t("completed")
                      : status === "in_progress"
                        ? t("inProgress")
                        : t("notStarted")}
                  </span>
                </span>
                {status === "completed" ? <span className="size-1.5 rounded-full bg-ribbon" /> : null}
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-xs leading-relaxed text-clay">
        {lang === "fr"
          ? `Les leçons 1 à ${CORE_LESSONS} préparent l'étape du baptême ; les suivantes accompagnent la suite du chemin.`
          : `Lessons 1 to ${CORE_LESSONS} prepare the step of baptism; the rest accompany the road ahead.`}
      </p>
    </AppShell>
  );
}
