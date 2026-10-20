export function Idea({
  idea,
  tools,
}: {
  idea: string;
  tools: { name: string; reason: string }[];
}) {
  return (
    <>
      <p className="max-w-2xl text-xl">{idea}</p>
      <div className="mt-5 flex items-center flex-col gap-3">
        <h3 className="text-sm uppercase tracking-wide font-bold">
          *Optional extras*
        </h3>
        <ul className="flex flex-wrap justify-center gap-3">
          {tools.map((tool) => (
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
    </>
  );
}
