import { Elysia, t } from "elysia";
import { connection } from "next/server";
import { frameworks, pick } from "@/lib/frameworks";
import { domains, getIdea } from "@/lib/ideas";

export const app = new Elysia({ prefix: "/api" }).get(
  "/",
  async ({ query, set }) => {
    set.headers["cache-control"] = "no-store";

    const { title, idea, optionalTools } = await getIdea(
      query.framework,
      pick(domains),
    );

    return { title, idea, tools: optionalTools.slice(0, 4) };
  },
  { query: t.Object({ framework: t.UnionEnum([...frameworks]) }) },
);

export type App = typeof app;

export const GET = async (req: Request) => {
  await connection();
  return app.fetch(req);
};
