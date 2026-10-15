"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

export default function Rerrol() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const rerrolIdea = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={rerrolIdea}
      disabled={isPending}
      className="flex items-center gap-2 mt-5 bg-accent/50 p-2 rounded-full"
    >
      <RotateCw className={isPending ? "animate-spin" : ""} size={24} />
    </button>
  );
}
