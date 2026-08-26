import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { VerseChip } from "@/components/VerseChip";
import { useLang } from "@/lib/i18n";
import { useSessionUser } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAnswers,
  fetchLessons,
  fetchProgress,
  fetchQuestions,
  lessonIntro,
  lessonTakeaway,
  lessonTitle,
  questionPrompt,
  saveAnswer,
  setProgress,
  statusOf,
} from "@/lib/study";

export const Route = createFileRoute("/_authenticated/lecons/$position")({
  component: LessonPage,
});

function LessonPage() {
  const { position } = useParams({ from: "/_authenticated/lecons/$position" });
  const { lang, t } = useLang();
  const { user } = useSessionUser();
  const qc = useQueryClient();

  const lessons = useQuery({ queryKey: ["lessons"], queryFn: fetchLessons });
  const lesson = (lessons.data ?? []).find((l) => l.position === Number(position));

  const questions = useQuery({
    queryKey: ["questions", lesson?.id],
    queryFn: () => fetchQuestions(lesson!.id),
    enabled: Boolean(lesson?.id),
  });

  const answers = useQuery({
    queryKey: ["answers", user?.id, lesson?.id],
    queryFn: () => fetchAnswers(user!.id, lesson!.id),
    enabled: Boolean(user?.id && lesson?.id),
  });

  const progress = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => fetchProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!answers.data) return;
    const next: Record<string, string> = {};
    for (const a of answers.data) next[a.question_id] = a.answer_text;
    setDrafts((prev) => ({ ...next, ...prev }));
  }, [answers.data]);

  // Opening a lesson marks it as started so the journey reflects where you are.
  useEffect(() => {
    if (!user?.id || !lesson?.id || !progress.data) return;
    if (statusOf(progress.data, lesson.id) === "not_started") {
      setProgress({ userId: user.id, lessonId: lesson.id, status: "in_progress" }).then(() =>
        qc.invalidateQueries({ queryKey: ["progress", user.id] }),
      );
    }
  }, [user?.id, lesson?.id, progress.data, qc]);

  const save = useMutation({
    mutationFn: (input: { questionId: string; text: string }) =>
      saveAnswer({ userId: user!.id, lessonId: lesson!.id, ...input }),
    onSuccess: () => {
      toast.success(t("saved"));
      qc.invalidateQueries({ queryKey: ["answers", user?.id, lesson?.id] });
    },
    onError: () => toast.error("Impossible d'enregistrer pour l'instant."),
  });

  const complete = useMutation({
    mutationFn: () => setProgress({ userId: user!.id, lessonId: lesson!.id, status: "completed" }),
    onSuccess: () => {
      toast.success(t("lessonDone"));
      qc.invalidateQueries({ queryKey: ["progress", user?.id] });
    },
  });

  const ask = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("lesson_messages").insert({
        seeker_id: user!.id,
        author_id: user!.id,
        lesson_id: lesson!.id,
        body: message.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      toast.success(lang === "fr" ? "Message envoyé à votre mentor." : "Message sent to your mentor.");
    },
    onError: () => toast.error(t("noMentor")),
  });

  if (!lesson) {
    return (
      <AppShell>
        <p className="italic text-clay">{t("loading")}</p>
      </AppShell>
    );
  }

  const qs = questions.data ?? [];
  const allAnswered = qs.length > 0 && qs.every((q) => (drafts[q.id] ?? "").trim().length > 0);
  const isDone = statusOf(progress.data ?? [], lesson.id) === "completed";

  return (
    <AppShell>
      <span className="eyebrow">
        {t("lesson")} {lesson.position}
      </span>
      <h2 className="mt-2 font-serif text-3xl font-medium leading-tight">{lessonTitle(lesson, lang)}</h2>
      <p className="mt-4 text-base leading-relaxed text-clay">{lessonIntro(lesson, lang)}</p>

      <div className="mt-10 space-y-10">
        {qs.map((q, i) => (
          <div key={q.id} className="border-t border-border pt-6">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-lg text-clay">{i + 1}</span>
              <p className="flex-1 font-serif text-xl leading-snug">{questionPrompt(q, lang)}</p>
            </div>
            {q.verse_ref ? (
              <div className="mt-3 pl-8">
                <VerseChip reference={q.verse_ref} />
              </div>
            ) : null}
            <div className="mt-4 pl-8">
              <textarea
                value={drafts[q.id] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                onBlur={() => {
                  const text = (drafts[q.id] ?? "").trim();
                  const existing = answers.data?.find((a) => a.question_id === q.id)?.answer_text ?? "";
                  if (text && text !== existing) save.mutate({ questionId: q.id, text });
                }}
                rows={4}
                placeholder={t("yourAnswer")}
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-3 text-base leading-relaxed outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
        ))}
      </div>

      {lessonTakeaway(lesson, lang) ? (
        <div className="mt-10 rounded-xl bg-sand/60 p-5">
          <span className="eyebrow">{t("takeaway")}</span>
          <p className="mt-2 font-serif text-lg leading-relaxed">{lessonTakeaway(lesson, lang)}</p>
        </div>
      ) : null}

      <div className="mt-10 border-t border-border pt-6">
        {isDone ? (
          <p className="text-sm text-ribbon">{t("lessonDone")}</p>
        ) : (
          <>
            <button
              type="button"
              disabled={!allAnswered || complete.isPending}
              onClick={() => complete.mutate()}
              className="w-full rounded-lg bg-ink px-4 py-3 text-sm font-medium text-paper disabled:opacity-40"
            >
              {t("markComplete")}
            </button>
            {!allAnswered ? (
              <p className="mt-3 text-xs leading-relaxed text-clay">{t("answerAllFirst")}</p>
            ) : null}
          </>
        )}
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <span className="eyebrow">{t("askMentor")}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-3 w-full resize-none rounded-lg border border-border bg-card px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring/30"
        />
        <button
          type="button"
          disabled={!message.trim() || ask.isPending}
          onClick={() => ask.mutate()}
          className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          {t("send")}
        </button>
      </div>

      <div className="mt-10 flex justify-between border-t border-border pt-6 text-sm text-clay">
        {lesson.position > 1 ? (
          <Link to="/lecons/$position" params={{ position: String(lesson.position - 1) }}>
            ← {t("lesson")} {lesson.position - 1}
          </Link>
        ) : (
          <span />
        )}
        {lesson.position < (lessons.data?.length ?? 0) ? (
          <Link to="/lecons/$position" params={{ position: String(lesson.position + 1) }}>
            {t("lesson")} {lesson.position + 1} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </AppShell>
  );
}
