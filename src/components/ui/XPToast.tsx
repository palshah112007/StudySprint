"use client";

import { useEffect, useState, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface XPToastProps {
  xp: number;
  message?: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export function XPToast({
  xp,
  message = "XP Earned!",
  onDismiss,
  autoDismissMs = 3000,
}: XPToastProps) {
  const [visible, setVisible] = useState(true);
  const [confettiPieces, setConfettiPieces] = useState<
    { id: number; x: number; color: string }[]
  >([]);

  useEffect(() => {
    // Generate confetti
    const colors = [
      "#7C3AED",
      "#00D9F5",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#A78BFA",
    ];
    const pieces = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 200 - 100,
      color: colors[i % colors.length],
    }));
    startTransition(() => setConfettiPieces(pieces));

    // Auto-dismiss
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative"
        >
          {/* Confetti */}
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `calc(50% + ${piece.x}px)`,
                top: "50%",
                backgroundColor: piece.color,
                width: 6,
                height: 6,
              }}
              initial={{ y: 0, rotate: 0, opacity: 1 }}
              animate={{
                y: [0, -60, -120, -80],
                x: [0, piece.x * 0.5, piece.x, piece.x * 0.3],
                rotate: [0, 180, 360, 540],
                opacity: [1, 1, 0.5, 0],
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          ))}

          {/* Toast card */}
          <div className="neural-card px-5 py-4 flex items-center gap-4 min-w-[200px] shadow-2xl shadow-[#7C3AED]/20 border-[#7C3AED]/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">+{xp}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-100">{message}</p>
              <p className="text-xs text-surface-400">
                Keep up the great work!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
