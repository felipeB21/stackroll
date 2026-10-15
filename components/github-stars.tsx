import { Star } from "lucide-react";
import { cacheLife } from "next/cache";

const REPO = "felipeb21/stackroll";

async function fetchStars(): Promise<number> {
  "use cache";
  cacheLife("hours");

  const res = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);

  const data = await res.json();
  return data.stargazers_count as number;
}

export default async function GithubStars() {
  let stars: number | null = null;
  try {
    stars = await fetchStars();
  } catch {}

  return (
    <a
      href={`https://github.com/${REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-accent/50 flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
    >
      <Star size={16} />
      <span>Star on GitHub</span>
      {stars !== null && (
        <span className="text-muted-foreground border-l pl-2">
          {stars.toLocaleString("en-US")}
        </span>
      )}
    </a>
  );
}
