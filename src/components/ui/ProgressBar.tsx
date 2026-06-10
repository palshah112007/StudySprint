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
          "w-full bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden",
          sizes[size]
        )}
      >
        <motion.div
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("h-full rounded-full relative overflow-hidden", sizes[size])}
          style={{
            background:
              color ||
              "linear-gradient(90deg, #7C3AED 0%, #00D9F5 100%)",
          }}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 progress-fill-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
