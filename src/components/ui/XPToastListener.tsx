"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import { XPToast } from "./XPToast";
import { createPortal } from "react-dom";

interface ToastState {
  id: number;
  xp: number;
  message?: string;
}

export function XPToastListener() {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  const handleXPEarned = useCallback(
    (e: Event) => {
      const detail = (e as CustomEvent).detail ?? {};
      const xp = detail.xp ?? 10;
      const message = detail.message ?? "XP Earned!";
      const id = Date.now();
      setToasts((prev) => [...prev, { id, xp, message }]);
    },
    []
  );

  useEffect(() => {
    window.addEventListener("studysprint-xp-earned", handleXPEarned);
    return () =>
      window.removeEventListener("studysprint-xp-earned", handleXPEarned);
  }, [handleXPEarned]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <XPToast
            xp={t.xp}
            message={t.message}
            onDismiss={() => dismiss(t.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
}
