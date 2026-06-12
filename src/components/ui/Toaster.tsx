"use client";

import { useEffect, useState, startTransition } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

export function toast(message: string, type: ToastType = "info") {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.push({ id, message, type });
  listeners.forEach((l) => l([...toasts]));
  setTimeout(() => {
    const idx = toasts.findIndex((t) => t.id === id);
    if (idx !== -1) {
      toasts.splice(idx, 1);
      listeners.forEach((l) => l([...toasts]));
    }
  }, 4000);
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
    listeners.push(setItems);

    // Listen for custom toast events from AuthModal and other components
    const handleCustomToast = (e: CustomEvent) => {
      const { message, type } = e.detail;
      toast(message, type || "info");
    };
    window.addEventListener("studysprint-toast", handleCustomToast as EventListener);

    return () => {
      const idx = listeners.indexOf(setItems);
      if (idx !== -1) listeners.splice(idx, 1);
      window.removeEventListener("studysprint-toast", handleCustomToast as EventListener);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "glass-card flex items-center gap-3 px-5 py-3.5 rounded-xl min-w-[320px] animate-in slide-in-from-right-2",
            "shadow-2xl border-l-2"
          )}
          style={{
            borderLeftColor:
              t.type === "success"
                ? "#10b981"
                : t.type === "error"
                ? "#ef4444"
                : "#6366f1",
          }}
        >
          {t.type === "success" && (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          {t.type === "error" && (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          {t.type === "info" && (
            <Info className="w-5 h-5 text-primary-400 shrink-0" />
          )}
          <p className="text-sm text-surface-200 flex-1">{t.message}</p>
          <button
            onClick={() => {
              const idx = toasts.indexOf(t);
              if (idx !== -1) {
                toasts.splice(idx, 1);
                listeners.forEach((l) => l([...toasts]));
              }
            }}
            className="text-surface-500 hover:text-surface-300 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
