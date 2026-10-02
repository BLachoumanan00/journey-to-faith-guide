import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export type LessonContext = {
  title: string;
  intro: string;
  takeaway: string;
  explanation: string;
  questions: Array<{ prompt: string; ref: string; answer: string }>;
};

export async function explainLesson(ctx: LessonContext, question: string, lang: "fr" | "en") {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("config");
  const provider = createOpenAI({
    baseURL: GATEWAY,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  const material = [
    `Lesson: ${ctx.title}`,
    `Introduction: ${ctx.intro}`,
    `Key takeaway: ${ctx.takeaway}`,
    `Explanation: ${ctx.explanation}`,
    "Study questions:",
    ...ctx.questions.map((q) => `- ${q.prompt} (${q.ref}) → ${q.answer}`),
  ].join("\n");

  const system = `You are a warm, patient, non-judgmental Bible study companion for someone exploring faith through a Seventh-day Adventist course.
Answer ONLY from the lesson material below and the Bible references it cites. If the question goes beyond it, say so gently and suggest asking their mentor.
Quote references exactly as they appear (e.g. "Jean 3:16"). Never invent verses. Keep it under 220 words, in short paragraphs.
Reply in ${lang === "fr" ? "French (Louis Segond wording for any quotation)" : "English"}.

LESSON MATERIAL:
${material}`;

  const result = streamText({
    model: provider.responses(MODEL),
    system,
    prompt: question,
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return await result.text;
}
