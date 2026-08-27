import { supabase } from "@/integrations/supabase/client";

export type Lesson = {
  id: string;
  position: number;
  title_fr: string;
  title_en: string;
  intro_fr: string;
  intro_en: string;
  takeaway_fr: string;
  takeaway_en: string;
};

export type Question = {
  id: string;
  lesson_id: string;
  position: number;
  verse_ref: string;
  prompt_fr: string;
  prompt_en: string;
  options_fr: string[];
  options_en: string[];
  correct_index: number | null;
};


export type ProgressRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  status: string;
  completed_at: string | null;
};

export const CORE_LESSONS = 22; // Lessons 1–22 unlock the baptism milestone.
export const TOTAL_LESSONS = 25;

export const lessonTitle = (l: Lesson, lang: "fr" | "en") => (lang === "en" ? l.title_en : l.title_fr);
export const lessonIntro = (l: Lesson, lang: "fr" | "en") => (lang === "en" ? l.intro_en : l.intro_fr);
export const lessonTakeaway = (l: Lesson, lang: "fr" | "en") =>
  lang === "en" ? l.takeaway_en : l.takeaway_fr;
export const questionPrompt = (q: Question, lang: "fr" | "en") =>
  lang === "en" && q.prompt_en ? q.prompt_en : q.prompt_fr;

export async function fetchLessons() {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, position, title_fr, title_en, intro_fr, intro_en, takeaway_fr, takeaway_en")
    .order("position");
  if (error) throw error;
  return (data ?? []) as Lesson[];
}

export async function fetchQuestions(lessonId: string) {
  const { data, error } = await supabase
    .from("lesson_questions")
    .select("id, lesson_id, position, verse_ref, prompt_fr, prompt_en")
    .eq("lesson_id", lessonId)
    .order("position");
  if (error) throw error;
  return (data ?? []) as Question[];
}

export async function fetchProgress(userId: string) {
  const { data, error } = await supabase
    .from("progress")
    .select("id, user_id, lesson_id, status, completed_at")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []) as ProgressRow[];
}

export async function fetchAnswers(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from("answers")
    .select("id, question_id, answer_text")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId);
  if (error) throw error;
  return data ?? [];
}

export async function saveAnswer(input: {
  userId: string;
  lessonId: string;
  questionId: string;
  text: string;
}) {
  const { error } = await supabase.from("answers").upsert(
    {
      user_id: input.userId,
      lesson_id: input.lessonId,
      question_id: input.questionId,
      answer_text: input.text,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,question_id" },
  );
  if (error) throw error;
}

export async function setProgress(input: {
  userId: string;
  lessonId: string;
  status: "in_progress" | "completed";
}) {
  const { error } = await supabase.from("progress").upsert(
    {
      user_id: input.userId,
      lesson_id: input.lessonId,
      status: input.status,
      completed_at: input.status === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) throw error;
}

export function statusOf(progress: ProgressRow[], lessonId: string) {
  const row = progress.find((p) => p.lesson_id === lessonId);
  if (!row) return "not_started" as const;
  return row.status === "completed" ? ("completed" as const) : ("in_progress" as const);
}

export function completedCount(progress: ProgressRow[]) {
  return progress.filter((p) => p.status === "completed").length;
}

export function baptismUnlocked(lessons: Lesson[], progress: ProgressRow[]) {
  const core = lessons.filter((l) => l.position <= CORE_LESSONS);
  if (core.length === 0) return false;
  return core.every((l) => statusOf(progress, l.id) === "completed");
}
