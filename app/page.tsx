import { Suspense } from "react";
import { connection } from "next/server";
import { frameworks, pick, type Framework } from "@/lib/frameworks";
import { domains, getIdea } from "@/lib/ideas";
import { Typing } from "@/components/loading-ui/typing";
import GithubStars from "@/components/github-stars";
import { Idea } from "@/components/idea";
import Link from "next/link";

async function IdeaLoader({
  framework,
  domain,
}: {
  framework: Framework;
  domain: string;
}) {
  let ideaData;
  try {
    ideaData = await getIdea(framework, domain);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    const isQuotaExceeded =
      errorMessage.includes("quota") || errorMessage.includes("exceeded");

    const isRateLimit = errorMessage.includes("Rate limit");

    return (
      <div className="mx-auto max-w-md rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-muted-foreground">
        {isQuotaExceeded ? (
          <>
            <p className="font-semibold text-foreground mb-1">
              API Quota Exceeded!
            </p>
            <p className="text-xs mb-3">
              You have reached the daily free tier limit for the Google Gemini
              API. Please wait for your quota to reset or upgrade your plan.
            </p>
          </>
        ) : isRateLimit ? (
          <p className="text-xs mb-3">
            You are rolling too fast! Please wait a few seconds before trying
            again.
          </p>
        ) : (
          <p className="text-xs mb-3">
            Could not generate an idea this time. Please try again.
          </p>
        )}

        <Link
          href="/"
          className="text-foreground underline text-sm font-medium"
        >
          Roll again
        </Link>
      </div>
    );
  }

  return (
    <Idea idea={ideaData.idea} tools={ideaData.optionalTools.slice(0, 4)} />
  );
}

async function Roll() {
  await connection();
  const framework = pick(frameworks);
  const domain = pick(domains);

  return (
    <>
      <div>
        <span className="text-muted-foreground text-xl">
          Make a project with
        </span>
        <h2 className="text-9xl">{framework}</h2>
      </div>

      <Suspense fallback={<Typing className="text-muted-foreground" />}>
        <IdeaLoader framework={framework} domain={domain} />
      </Suspense>
    </>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <GithubStars />
      <h1 className="text-foreground text-2xl max-w-sm mb-12">
        Stackroll: random framework & project idea generator
      </h1>

      <Suspense fallback={<div className="h-40" />}>
        <Roll />
      </Suspense>

      <section className="text-muted-foreground mt-12 max-w-xl text-sm">
        <h2 className="text-foreground mb-2 text-base">How it works</h2>
        <p>
          Stackroll picks a random web framework and asks an AI for an original
          project idea to build with it. Reroll until something sparks, then go
          build it.
        </p>
      </section>
    </main>
  );
}
