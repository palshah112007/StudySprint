"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Flame,
  Trophy,
  Star,
  Shield,
  Crown,
  Sparkles,
  Swords,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const gamificationFeatures = [
  {
    icon: Flame,
    title: "Streak System",
    description: "Maintain daily streaks with animated fire effects. Never break the chain.",
    color: "from-orange-500 to-rose-600",
    bgGlow: "rgba(249,115,22,0.1)",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description: "Unlock 50+ achievements with premium unlock animations and rewards.",
    color: "from-amber-500 to-yellow-600",
    bgGlow: "rgba(245,158,11,0.1)",
  },
  {
    icon: Shield,
    title: "Level System",
    description: "Progress through 100 levels with increasing rewards and exclusive perks.",
    color: "from-primary-500 to-purple-600",
    bgGlow: "rgba(99,102,241,0.1)",
  },
  {
    icon: Star,
    title: "Skill Trees",
    description: "Unlock abilities and power-ups as you advance through specialized skill trees.",
    color: "from-accent-500 to-emerald-600",
    bgGlow: "rgba(45,212,191,0.1)",
  },
  {
    icon: Swords,
    title: "Challenges",
    description: "Compete in daily, weekly, and group challenges to earn exclusive rewards.",
    color: "from-purple-500 to-pink-600",
    bgGlow: "rgba(168,85,247,0.1)",
  },
  {
    icon: Crown,
    title: "Leaderboards",
    description: "Climb global, subject, and group leaderboards. Earn elite rank badges.",
    color: "from-rose-500 to-red-600",
    bgGlow: "rgba(244,63,94,0.1)",
  },
];

export function GamificationSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <Badge variant="amber" size="md" className="mb-4">
            <Sparkles className="w-3 h-3" />
            Gamification System
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-100 mb-4">
            Study Becomes an{" "}
            <span className="gradient-text">Addictive Game</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Every study session earns you XP. Level up, unlock achievements, 
            compete on leaderboards, and watch your productivity soar.
          </p>
        </motion.div>

        {/* XP Bar Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 sm:p-8 mb-12 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-surface-500 uppercase">Level 24</p>
                <p className="font-semibold text-surface-200">Sprint Master</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text">2,450 XP</p>
              <p className="text-xs text-surface-500">1,550 XP to next level</p>
            </div>
          </div>
          <div className="w-full h-3 bg-surface-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "61%" } : {}}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full rounded-full relative"
              style={{
                background: "linear-gradient(90deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gamificationFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-card rounded-2xl p-6 relative group cursor-default"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${feature.bgGlow}, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg",
                    feature.color
                  )}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
