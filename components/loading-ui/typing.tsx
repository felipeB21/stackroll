import { cn } from "@/lib/utils";

function Typing({
  className,
  label = "Generating idea",
  dots = 3,
  ...props
}: React.ComponentProps<"span"> & { label?: string; dots?: number }) {
  return (
    <>
      <style>{`
        @keyframes loading-ui-typing-dot {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes loading-ui-typing-shimmer {
          from { background-position: 100% 0; }
          to { background-position: -100% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-ui-typing-dot,
          .loading-ui-typing-label {
            animation: none !important;
          }
        }
      `}</style>
      <span
        role="status"
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        <span
          className="loading-ui-typing-label"
          style={{
            backgroundImage:
              "linear-gradient(90deg, color-mix(in oklab, currentColor 40%, transparent) 40%, currentColor 50%, color-mix(in oklab, currentColor 40%, transparent) 60%)",
            backgroundSize: "200% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "loading-ui-typing-shimmer 2s linear infinite",
          }}
        >
          {label}
        </span>
        <span aria-hidden="true" className="inline-flex items-center gap-1">
          {Array.from({ length: dots }, (_, index) => (
            <span
              key={index}
              className="loading-ui-typing-dot inline-block size-1.5 rounded-full bg-current"
              style={{
                animation: "loading-ui-typing-dot 1.2s ease-in-out infinite",
                animationDelay: `${index * 160}ms`,
              }}
            />
          ))}
        </span>
      </span>
    </>
  );
}

export { Typing };
