"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  glow = false,
  hover = true,
  gradient = false,
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -1, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "neural-card p-6 relative overflow-hidden group",
        glow && "shadow-[0_0_20px_rgba(124,58,237,0.15)]",
        gradient &&
          "bg-gradient-to-br from-surface-900/80 via-surface-850/60 to-surface-900/80",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-accent-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-semibold text-surface-100", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-surface-400", className)}>{children}</p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("relative z-10", className)}>{children}</div>;
}
