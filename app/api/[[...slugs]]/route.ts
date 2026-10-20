// app/api/[[...slugs]]/route.ts
import { Elysia } from "elysia";
import { connection } from "next/server";
import { cacheLife } from "next/cache";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { frameworks, pick, type Framework } from "@/lib/frameworks";

const domains = [
  "education",
  "fitness",
  "music",
  "personal finance",
  "travel",
  "cooking",
  "indie games",
  "developer tooling",
  "accessibility",
  "local communities",
];

const ideaSchema = z.object({
  title: z.string().describe("Catchy project name, max 4 words"),
  idea: z
    .string()
    .describe(
      "2 or 3 sentences: who it's for, the core feature, and the twist. Plain text, no markdown.",
    ),
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

const poolSchema = z.object({
  ideas: z.array(ideaSchema).min(6).max(8),
});

const SYSTEM = `You generate project ideas for developers practicing a specific framework.
- Each idea is buildable in a weekend: one core feature plus one interesting twist.
- Avoid clichés: todo apps, weather apps, blogs, generic dashboards, chat apps, calculators.
- Name who it's for and the problem it solves. No vague "platform for X".
- Suggest a tool only if it solves a specific problem in that idea.
  Never suggest the main framework itself or things it already includes.
- Plain text only: no markdown, no emojis.`;

// One LLM call per framework per cache window, not per request.
// Math.random() must stay OUTSIDE this function, or the pick gets frozen.
async function getIdeaPool(framework: Framework) {
  "use cache";
  cacheLife("hours");

  const { output } = await generateText({
    model: google("gemini-3.1-flash-lite"),
    output: Output.object({ schema: poolSchema }),
    system: SYSTEM,
    prompt: `Framework: ${framework}
Generate 8 distinct project ideas for this framework.
Each idea must be in a different domain, chosen from: ${domains.join(", ")}.`,
    maxOutputTokens: 3000,
    abortSignal: AbortSignal.timeout(20_000),
    providerOptions: {
      google: { thinkingConfig: { thinkingLevel: "minimal" } },
    },
  });

  return output.ideas;
}

export const app = new Elysia({ prefix: "/api" }).get("/", async ({ set }) => {
  const framework = pick(frameworks);
  const pool = await getIdeaPool(framework);
  const { title, idea, optionalTools } = pick(pool);

  set.headers["cache-control"] = "no-store";

  return { framework, title, idea, tools: optionalTools };
});

export type App = typeof app;

// connection() marks everything after it as request-time, so nothing
// (Math.random or the LLM call) runs during prerender.
export const GET = async (req: Request) => {
  await connection();
  return app.fetch(req);
};
