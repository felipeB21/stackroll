import { Elysia } from "elysia";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { connection } from "next/server";
import { z } from "zod";

const frameworks = [
  "Next.js",
  "React",
  "Angular",
  "Astro",
  "Vue",
  "Nuxt",
  "Svelte",
  "Remix",
] as const;

const ideaSchema = z.object({
  idea: z
    .string()
    .describe("The project idea in 2 or 3 sentences. Plain text, no markdown."),
  optionalTools: z
    .array(
      z.object({
        name: z.string().describe("Library or tool name, e.g. Tailwind CSS"),
        reason: z.string().describe("Why it fits this project, max 12 words"),
      }),
    )
    .min(2)
    .max(4),
});

export const app = new Elysia({ prefix: "/api" }).get("/", async () => {
  await connection();

  const framework = frameworks[Math.floor(Math.random() * frameworks.length)];

  const { output } = await generateText({
    model: google("gemini-3.1-flash-lite"),
    output: Output.object({ schema: ideaSchema }),
    prompt: `Give me an original project idea to build with ${framework}.
Then suggest 2 to 4 optional, well-known libraries or tools that fit THIS specific idea
(for example Tailwind CSS, TanStack Query, Zod, Drizzle ORM, Framer Motion).
Only suggest what the project really benefits from, and do not suggest ${framework} itself.`,
  });

  return {
    framework,
    idea: output.idea,
    tools: output.optionalTools,
  };
});

export type App = typeof app;

export const GET = app.fetch;
