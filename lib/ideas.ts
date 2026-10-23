import { cacheLife } from "next/cache";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import type { Framework } from "@/lib/frameworks";
import { checkRateLimit } from "@/lib/rate-limit";

export const domains = [
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
    .min(1),
});

const SYSTEM = `You generate project ideas for developers practicing a specific framework.
- Buildable in a weekend: one core feature plus one interesting twist.
- Avoid clichés: todo apps, weather apps, blogs, generic dashboards, chat apps, calculators.
- Name who it's for and the problem it solves. No vague "platform for X".
- Suggest 2 to 4 tools, only if they solve a specific problem in this idea.
  Never suggest the main framework itself or things it already includes.
- Plain text only: no markdown, no emojis.`;

const MODELS = ["gemini-3.1-flash-lite", "gemini-3-flash-preview"] as const;
const ATTEMPT_TIMEOUT_MS = 20_000;

async function generate(
  modelId: string,
  framework: Framework,
  domain: string,
  signal: AbortSignal,
) {
  const t0 = performance.now();
  try {
    const { output } = await generateText({
      model: google(modelId),
      output: Output.object({ schema: ideaSchema }),
      system: SYSTEM,
      prompt: `Framework: ${framework}
Domain: ${domain}
Give one original project idea in that domain using that framework.`,
      maxOutputTokens: 1000,
      maxRetries: 0,
      abortSignal: AbortSignal.any([
        signal,
        AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      ]),
      providerOptions: {
        google: { thinkingConfig: { thinkingLevel: "minimal" } },
      },
    });
    console.log(
      `[stackroll] ${modelId} ok in ${Math.round(performance.now() - t0)}ms`,
    );
    return output;
  } catch (err) {
    const ms = Math.round(performance.now() - t0);
    const msg = err instanceof Error ? err.message : String(err);

    if (signal.aborted || msg.includes("aborted")) {
      console.log(
        `[stackroll] ${modelId} aborted after ${ms}ms (loser of model race)`,
      );
    } else {
      console.error(`[stackroll] ${modelId} failed after ${ms}ms: ${msg}`);
    }

    throw err;
  }
}

export async function getIdea(
  framework: Framework,
  domain: string,
  clientIp = "global-user",
) {
  "use cache";

  if (!checkRateLimit(clientIp, 4000)) {
    throw new Error(
      "Rate limit exceeded. Please wait a few seconds before rolling again.",
    );
  }

  cacheLife("hours");

  let lastError: unknown;

  for (let round = 1; round <= 2; round++) {
    const ctrl = new AbortController();
    try {
      const result = await Promise.any(
        MODELS.map((m) => generate(m, framework, domain, ctrl.signal)),
      );
      ctrl.abort();
      return result;
    } catch (err) {
      ctrl.abort();
      lastError = err;
    }
  }

  throw lastError;
}
