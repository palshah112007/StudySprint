"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("StudySprint route error", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <div className="glass-card max-w-lg rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-surface-100">Something slipped out of focus</h1>
        <p className="mt-3 text-sm leading-6 text-surface-400">
          The workspace hit an unexpected error. Your local progress is still preserved.
        </p>
        <Button className="mt-6" variant="gradient" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
