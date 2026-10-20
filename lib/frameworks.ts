export const frameworks = [
  "Next.js",
  "React",
  "Angular",
  "Astro",
  "Vue",
  "Nuxt",
  "Svelte",
  "Remix",
] as const;

export type Framework = (typeof frameworks)[number];

export const pick = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)] as T;
