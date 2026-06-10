"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Command, ArrowUp, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

const shortcuts = [
  { key: "G then D", label: "Go to Dashboard" },
  { key: "G then F", label: "Go to Focus Room" },
  { key: "G then A", label: "Go to AI Assistant" },
  { key: "G then G", label: "Go to Gamification" },
  { key: "G then N", label: "Go to Analytics" },
  { key: "G then S", label: "Go to Community" },
  { key: "G then P", label: "Go to Profile" },
  { key: "?", label: "Toggle this menu" },
  { key: "Space", label: "Play/Pause Focus Timer" },
  { key: "F", label: "Toggle Fullscreen" },
  { key: "M", label: "Toggle Sound" },
  { key: "Esc", label: "Close modals" },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [pressedKey, setPressedKey] = useState("");

  useEffect(() => {
    let keyBuffer = "";
    let bufferTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // ? key toggles the menu
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        setIsOpen((prev) => !prev);
        return;
      }

      // Esc closes the menu
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        return;
      }

      // G then key navigation
      if (e.key === "g" || e.key === "G") {
        keyBuffer = "g";
        setPressedKey("g");
        if (bufferTimeout) clearTimeout(bufferTimeout);
        bufferTimeout = setTimeout(() => {
          keyBuffer = "";
          setPressedKey("");
        }, 500);
        return;
      }

      if (keyBuffer === "g") {
        const navMap: Record<string, string> = {
          d: "/dashboard",
          f: "/focus-room",
          a: "/ai-assistant",
          g: "/gamification",
          n: "/analytics",
          s: "/social",
          p: "/profile",
        };

        const target = navMap[e.key.toLowerCase()];
        if (target) {
          keyBuffer = "";
          setPressedKey("");
          if (bufferTimeout) clearTimeout(bufferTimeout);
          // Only navigate if not already on that page
          if (window.location.pathname !== target) {
            window.location.href = target;
          }
        }
        return;
      }

      setPressedKey(e.key);
      if (bufferTimeout) clearTimeout(bufferTimeout);
      bufferTimeout = setTimeout(() => setPressedKey(""), 500);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Mini indicator */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 w-8 h-8 glass rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all cursor-pointer"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="w-4 h-4" />
      </button>

      {/* Pressed key indicator */}
      <AnimatePresence>
        {pressedKey && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-4 left-16 z-50 glass rounded-lg px-3 py-1.5 text-xs text-surface-400"
          >
            {pressedKey === "g" ? "Waiting for next key..." : `Pressed: ${pressedKey}`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg glass-card rounded-2xl p-6 border border-primary-500/15 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Command className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-surface-100">Keyboard Shortcuts</h2>
                    <p className="text-xs text-surface-500">Navigate faster with your keyboard</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-800/30 transition-colors"
                  >
                    <span className="text-sm text-surface-300">{sc.label}</span>
                    <kbd
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-surface-800 border border-surface-700",
                        sc.key === "Space"
                          ? "text-surface-300 min-w-[60px] text-center"
                          : "text-primary-300"
                      )}
                    >
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-surface-800/50">
                <p className="text-xs text-surface-600 flex items-center gap-1.5">
                  <ArrowUp className="w-3 h-3" />
                  Press <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-800 border border-surface-700 text-surface-400">?</kbd> anytime to toggle this menu
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
