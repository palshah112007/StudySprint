"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  glow?: boolean;
  status?: "online" | "offline" | "busy" | "away";
}

const colors = [
  "bg-primary-500",
  "bg-accent-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-orange-500",
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
  glow = false,
  status,
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
    "2xl": "w-20 h-20 text-xl",
  };

  const statusSizes = {
    sm: "w-2.5 h-2.5 border-2",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4 h-4 border-[2.5px]",
    "2xl": "w-4.5 h-4.5 border-[2.5px]",
  };

  const statusColors = {
    online: "bg-emerald-400 border-surface-900",
    offline: "bg-surface-500 border-surface-900",
    busy: "bg-rose-400 border-surface-900",
    away: "bg-amber-400 border-surface-900",
  };

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-semibold text-white overflow-hidden",
          sizes[size],
          glow && "ring-2 ring-primary-500/20 ring-offset-2 ring-offset-surface-900",
          !src && getColor(name),
          className
        )}
      >
        {src ? (
          <Image src={src} alt={name} width={80} height={80} className="w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full",
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}
