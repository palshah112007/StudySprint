import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "amber" | "rose" | "purple" | "surface";
  size?: "sm" | "md";
  className?: string;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = "primary",
  size = "sm",
  className,
  pulse = false,
}: BadgeProps) {
  const variants = {
    primary:
      "bg-primary-500/10 text-primary-300 border-primary-500/20",
    accent:
      "bg-accent-500/10 text-accent-300 border-accent-500/20",
    amber:
      "bg-amber-500/10 text-amber-300 border-amber-500/20",
    rose:
      "bg-rose-500/10 text-rose-300 border-rose-500/20",
    purple:
      "bg-purple-500/10 text-purple-300 border-purple-500/20",
    surface:
      "bg-surface-800 text-surface-400 border-surface-700/50",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide uppercase",
        variants[variant],
        sizes[size],
        pulse && "animate-pulse-glow",
        className
      )}
    >
      {pulse && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "primary" && "bg-primary-400",
            variant === "accent" && "bg-accent-400",
            variant === "amber" && "bg-amber-400",
            variant === "rose" && "bg-rose-400",
            variant === "purple" && "bg-purple-400"
          )}
        />
      )}
      {children}
    </span>
  );
}
