"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Zap,
  Timer,
  Users,
  BarChart3,
  Sparkles,
  Shield,
  Target,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    icon: Brain,
    title: "AI Study Assistant",
    description:
      "Your personal AI tutor that understands your learning style. Get smart recommendations, generate quizzes, and summarize notes instantly.",
    color: "from-primary-500 to-purple-600",
    gradient: "from-primary-500/10 to-purple-500/5",
    border: "border-primary-500/20",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    icon: Timer,
    title: "Immersive Focus Room",
    description:
      "Deep focus sessions with ambient sounds, Pomodoro timers, and distraction-free environments designed for maximum productivity.",
    color: "from-accent-500 to-emerald-600",
    gradient: "from-accent-500/10 to-emerald-500/5",
    border: "border-accent-500/20",
    glow: "rgba(45,212,191,0.15)",
  },
  {
    icon: Zap,
    title: "Gamified Progression",
    description:
      "Earn XP, unlock achievements, climb leaderboards, and maintain streaks. Study becomes an addictive game you'll want to play daily.",
    color: "from-amber-500 to-orange-600",
    gradient: "from-amber-500/10 to-orange-500/5",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Beautiful, insightful dashboards showing your study patterns, productivity trends, and areas for improvement with actionable data.",
    color: "from-purple-500 to-pink-600",
    gradient: "from-purple-500/10 to-pink-500/5",
    border: "border-purple-500/20",
    glow: "rgba(168,85,247,0.15)",
  },
  {
    icon: Users,
    title: "Study Communities",
    description:
      "Join or create study groups, compete in challenges, share resources, and stay motivated with friends in real-time study rooms.",
    color: "from-rose-500 to-red-600",
    gradient: "from-rose-500/10 to-red-500/5",
    border: "border-rose-500/20",
    glow: "rgba(244,63,94,0.15)",
  },
  {
    icon: Target,
    title: "Smart Goal Tracking",
    description:
      "Set academic goals, track daily progress, get AI-powered study plans, and receive personalized recommendations to stay on target.",
    color: "from-cyan-500 to-blue-600",
    gradient: "from-cyan-500/10 to-blue-500/5",
    border: "border-cyan-500/20",
    glow: "rgba(6,182,212,0.15)",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "glass-card rounded-2xl p-6 sm:p-8 relative group cursor-default",
        "hover:border-opacity-40 transition-all duration-500",
        feature.border
      )}
      style={{
        background: `linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.4) 100%)`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg",
            feature.color
          )}
        >
          <feature.icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-surface-100 mb-3">
          {feature.title}
        </h3>
        <p className="text-sm text-surface-400 leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Corner gradient accent */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${feature.glow.replace("0.15", "0.08")}, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-accent-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="primary" size="md" className="mb-4">
            <Sparkles className="w-3 h-3" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-100 mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Excel</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            From AI-powered assistance to immersive focus environments — StudySprint
            combines everything you need for academic success in one beautiful ecosystem.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
