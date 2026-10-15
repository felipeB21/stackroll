import { Suspense } from "react";
import { api } from "@/lib/client";
import { Typing } from "@/components/loading-ui/typing";
import Rerrol from "@/components/rerrol";

async function Idea() {
  const { data, error } = await api.get();

  if (error) {
    return (
      <>
        <p>Something went wrong. Try again.</p>
        <Rerrol />
      </>
    );
  }

  return (
    <>
      <span className="text-muted-foreground">Make a project with</span>
      <h2 className="text-9xl">{data.framework}</h2>
      <p className="max-w-2xl text-xl">{data.idea}</p>
      <div className="mt-5 flex items-center flex-col gap-3">
        <h3 className="text-sm uppercase tracking-wide font-bold">
          *Optional extras*
        </h3>
        <ul className="flex flex-wrap justify-center gap-3">
          {data.tools.map((tool) => (
            <li
              key={tool.name}
              className="flex max-w-56 flex-col items-center gap-1"
            >
              <span className="bg-accent/50 rounded-full px-3 py-1 text-sm">
                {tool.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {tool.reason}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Rerrol />
    </>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-foreground text-2xl max-w-sm mb-12">
        Stackroll: random framework & project idea generator
      </h1>

      <Suspense fallback={<Typing className="w-5" />}>
        <Idea />
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
