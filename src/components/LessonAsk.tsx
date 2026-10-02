import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { askLessonAI } from "@/lib/lesson-ai.functions";
import type { Lesson, Question } from "@/lib/study";
import { lessonExplanation, lessonIntro, lessonTakeaway, lessonTitle, questionOptions, questionPrompt } from "@/lib/study";

const ERR = {
  fr: {
    credits: "Le service d'explication est momentanément indisponible.",
    busy: "Beaucoup de demandes en ce moment. Réessayez dans un instant.",
    empty: "Je n'ai pas pu formuler de réponse. Posez la question à votre mentor.",
    failed: "Impossible d'obtenir une explication pour l'instant.",
  },
  en: {
    credits: "The explanation service is temporarily unavailable.",
    busy: "Lots of requests right now. Please try again in a moment.",
    empty: "I couldn't form an answer. Try asking your mentor.",
    failed: "Couldn't get an explanation right now.",
  },
};

export function LessonAsk({ lesson, questions, lang }: { lesson: Lesson; questions: Question[]; lang: "fr" | "en" }) {
  const ask = useServerFn(askLessonAI);
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError("");
    setAnswer("");
    try {
      const res = await ask({
        data: {
          lang,
          question: q.trim(),
          lesson: {
            title: lessonTitle(lesson, lang),
            intro: lessonIntro(lesson, lang),
            takeaway: lessonTakeaway(lesson, lang),
            explanation: lessonExplanation(lesson, lang),
            questions: questions.map((x) => ({
              prompt: questionPrompt(x, lang),
              ref: x.verse_ref,
              answer: x.correct_index !== null ? (questionOptions(x, lang)[x.correct_index] ?? "") : "",
            })),
          },
        },
      });
      if (res.ok) setAnswer(res.answer);
      else setError(ERR[lang][res.error as keyof (typeof ERR)["fr"]] ?? ERR[lang].failed);
    } catch {
      setError(ERR[lang].failed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 rounded-xl border border-ribbon/30 bg-card p-5 shadow-[0_0_32px_-12px_var(--ribbon)]">
      <span className="eyebrow text-ribbon">{lang === "fr" ? "Une question sur cette leçon ?" : "A question about this lesson?"}</span>
      <p className="mt-2 text-sm leading-relaxed text-clay">
        {lang === "fr"
          ? "Posez-la librement : vous recevrez une explication basée sur cette leçon et ses versets."
          : "Ask freely: you'll get an explanation based on this lesson and its verses."}
      </p>
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        rows={3}
        maxLength={1000}
        placeholder={lang === "fr" ? "Ex. : Pourquoi la Bible est-elle digne de confiance ?" : "e.g. Why can the Bible be trusted?"}
        className="mt-3 w-full resize-none rounded-lg border border-border bg-paper px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring/30"
      />
      <button
        type="button"
        disabled={!q.trim() || busy}
        onClick={submit}
        className="mt-3 w-full rounded-lg bg-ribbon px-4 py-3 text-sm font-medium text-paper disabled:opacity-40"
      >
        {busy ? (lang === "fr" ? "Réflexion…" : "Thinking…") : lang === "fr" ? "Obtenir une explication" : "Get an explanation"}
      </button>
      {error ? <p className="mt-3 text-sm text-clay">{error}</p> : null}
      {answer ? (
        <div className="mt-5 border-t border-border pt-4">
          {answer.split(/\n+/).map((p, i) => (
            <p key={i} className="mt-2 font-serif text-lg leading-relaxed">
              {p.replace(/\*\*/g, "")}
            </p>
          ))}
          <p className="mt-4 text-xs italic text-clay">
            {lang === "fr"
              ? "Explication générée par IA à partir de la leçon — vérifiez toujours avec les versets et votre mentor."
              : "AI-generated from the lesson — always check with the verses and your mentor."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
