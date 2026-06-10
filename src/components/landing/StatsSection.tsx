"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Brain, Clock, Trophy, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  { icon: Users, to: 10000, suffix: "+", label: "Active Students", color: "primary" },
  { icon: Brain, to: 50000, suffix: "+", label: "Quizzes Completed", color: "purple" },
  { icon: Clock, to: 250000, suffix: "+", label: "Focus Hours", color: "accent" },
  { icon: Trophy, to: 15000, suffix: "+", label: "Achievements Unlocked", color: "amber" },
  { icon: Zap, to: 5000, suffix: "+", label: "Study Groups", color: "rose" },
];

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950 via-surface-900/50 to-surface-950" />

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 border border-primary-500/10"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-100 mb-3">
              Trusted by Students Worldwide
            </h2>
            <p className="text-surface-400">
              Join a growing community of ambitious learners
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${
                    stat.color === "primary"
                      ? "from-primary-500 to-purple-600"
                      : stat.color === "purple"
                      ? "from-purple-500 to-pink-600"
                      : stat.color === "accent"
                      ? "from-accent-500 to-emerald-600"
                      : stat.color === "amber"
                      ? "from-amber-500 to-orange-600"
                      : "from-rose-500 to-red-600"
                  } flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <AnimatedCounter
                  to={stat.to}
                  suffix={stat.suffix}
                  label={stat.label}
                  className="mb-2"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
