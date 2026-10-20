// app/page.tsx
import { Suspense } from "react";
import { connection } from "next/server";
import { api } from "@/lib/client";
import { frameworks, pick, type Framework } from "@/lib/frameworks";
import { Typing } from "@/components/loading-ui/typing";
import GithubStars from "@/components/github-stars";
import { Idea } from "@/components/idea";

async function IdeaLoader({ framework }: { framework: Framework }) {
  const { data, error } = await api.get({ query: { framework } });

  if (error) return <p>Something went wrong. Try again.</p>;

  return <Idea idea={data.idea} tools={data.tools} />;
}

async function Roll() {
  await connection();
  const framework = pick(frameworks);

  return (
    <>
      <div>
        <span className="text-muted-foreground">Make a project with</span>
        <h2 className="text-9xl">{framework}</h2>
      </div>

      <Suspense fallback={<Typing />}>
        <IdeaLoader framework={framework} />
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
