import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  lang: z.enum(["fr", "en"]),
  question: z.string().trim().min(1).max(1000),
  lesson: z.object({
    title: z.string(),
    intro: z.string(),
    takeaway: z.string(),
    explanation: z.string(),
    questions: z.array(z.object({ prompt: z.string(), ref: z.string(), answer: z.string() })).max(20),
  }),
});

export const askLessonAI = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const { explainLesson } = await import("./lesson-ai.server");
    try {
      const answer = await explainLesson(data.lesson, data.question, data.lang);
      if (!answer.trim()) return { ok: false as const, error: "empty" };
      return { ok: true as const, answer };
    } catch (e: unknown) {
      const status = (e as { statusCode?: number })?.statusCode;
      return { ok: false as const, error: status === 402 ? "credits" : status === 429 ? "busy" : "failed" };
    }
  });
