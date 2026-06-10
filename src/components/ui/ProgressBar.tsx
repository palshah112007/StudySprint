"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color,
  showLabel = false,
  label,
  className,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-surface-400">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-surface-300">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full bg-surface-800 rounded-full overflow-hidden",
          sizes[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full relative", sizes[size])}
          style={{
            background:
              color ||
              "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
              animation: "shimmer 2s ease-in-out infinite",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
