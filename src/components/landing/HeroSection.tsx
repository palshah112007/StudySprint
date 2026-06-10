"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Clock,
  Trophy,
  Brain,
  Play,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (i * 29) % 100,
    y: (i * 47) % 100,
    size: (i % 3) + 1,
    duration: (i % 8) + 4,
    delay: (i % 5) * 0.4,
    opacity: 0.12 + (i % 4) * 0.08,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingCard({
  children,
  className,
  delay = 0,
  x = 0,
  y = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: x * -1, y: y * -1 }}
      animate={{
        opacity: 1,
        x: 0,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 5, repeat: Infinity, delay: delay + 1, ease: "easeInOut" },
      }}
      className={cn(
        "glass-card rounded-2xl p-4 shadow-2xl shadow-black/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mt-16 mx-auto max-w-5xl"
    >
      {/* Main Dashboard Window */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 border border-primary-500/15">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-5 py-3.5 bg-surface-900/80 border-b border-primary-500/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="ml-4 flex items-center gap-2 text-xs text-surface-500">
            <Zap className="w-3 h-3 text-primary-400" />
            <span>StudySprint Dashboard — Focus Mode</span>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6 grid grid-cols-12 gap-4">
          {/* Stats row */}
          <div className="col-span-12 grid grid-cols-4 gap-3">
            {[
              { label: "Focus Score", value: "94", icon: Brain, color: "primary" },
              { label: "XP Today", value: "1,240", icon: Zap, color: "amber" },
              { label: "Streak", value: "12 days", icon: Trophy, color: "accent" },
              { label: "Sessions", value: "8", icon: Clock, color: "purple" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-light rounded-xl p-3.5 flex items-center gap-3"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    stat.color === "primary" && "bg-primary-500/15 text-primary-400",
                    stat.color === "amber" && "bg-amber-500/15 text-amber-400",
                    stat.color === "accent" && "bg-accent-500/15 text-accent-400",
                    stat.color === "purple" && "bg-purple-500/15 text-purple-400"
                  )}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-surface-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-sm font-bold text-surface-200">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart area */}
          <div className="col-span-8 glass-light rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-surface-400">Weekly Activity</span>
              <span className="text-[10px] text-surface-500">+23% vs last week</span>
            </div>
            <div className="flex items-end gap-2 h-20">
              {[35, 55, 45, 70, 60, 85, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
                  className="flex-1 rounded-t-md relative group"
                  style={{
                    background: `linear-gradient(180deg, ${
                      ["#6366f1", "#818cf8", "#6366f1", "#8b5cf6", "#6366f1", "#2dd4bf", "#6366f1"][i]
                    } 0%, transparent 100%)`,
                  }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="text-[9px] text-surface-600 uppercase">{d}</span>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="col-span-4 glass-light rounded-xl p-4 space-y-2.5">
            <span className="text-xs font-medium text-surface-400">Recent Activity</span>
            {[
              { text: "Completed Math quiz", time: "2m ago", color: "primary" },
              { text: "Started Physics sprint", time: "15m ago", color: "amber" },
              { text: "Earned 150 XP", time: "1h ago", color: "accent" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="flex items-center gap-2.5"
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    item.color === "primary" && "bg-primary-400",
                    item.color === "amber" && "bg-amber-400",
                    item.color === "accent" && "bg-accent-400"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-surface-300 truncate">{item.text}</p>
                  <p className="text-[9px] text-surface-600">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating achievement card */}
      <FloatingCard
        className="absolute -top-3 -right-3 md:-top-6 md:-right-6 w-44 md:w-52"
        delay={1.5}
        x={20}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-surface-500 uppercase">Achievement</p>
            <p className="text-sm font-semibold text-surface-200">Week Warrior</p>
            <p className="text-[10px] text-surface-400">7-day streak</p>
          </div>
        </div>
      </FloatingCard>

      {/* Floating XP card */}
      <FloatingCard
        className="absolute -bottom-3 -left-3 md:-bottom-6 md:-left-6 w-40 md:w-48"
        delay={2}
        x={-20}
        y={20}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-surface-500 uppercase">Total XP</p>
            <p className="text-lg font-bold gradient-text">12,450</p>
          </div>
        </div>
      </FloatingCard>
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDemo, setShowDemo] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleGetStarted = () => {
    window.dispatchEvent(
      new CustomEvent("studysprint-open-auth", {
        detail: { tab: "signup" },
      })
    );
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden animated-gradient pt-20"
    >
      {/* Particle effects */}
      <FloatingParticles />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/8 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500/8 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "3s" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Badge variant="primary" size="md" pulse>
            <Sparkles className="w-3 h-3" />
            Now in Public Beta
          </Badge>
        </motion.div>

        {/* Headline — letter by letter stagger */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.04, delayChildren: 0.2 },
            },
          }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          {"Your Neural Study OS".split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={char === "N" || char === "S" || char === "O" ? "gradient-text" : "text-surface-100"}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle — cycling typewriter */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          AI Quizzes. Smart Flashcards. Epic Focus.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Link href="/dashboard">
            <Button variant="primary" size="xl" glow className="group">
              Enter the OS →
            </Button>
          </Link>
          <Button variant="ghost" size="xl" className="group" onClick={handleWatchDemo}>
            <Play className="w-5 h-5" />
            Watch demo
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-surface-500"
        >
          <div className="flex -space-x-2">
            {["JD", "AK", "ML", "RS"].map((initials, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-surface-800 border-2 border-surface-900 flex items-center justify-center text-[10px] font-semibold text-surface-300"
              >
                {initials}
              </div>
            ))}
          </div>
          <span>
            <strong className="text-surface-300">10,000+</strong> students already on board
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="ml-1">4.9</span>
          </span>
        </motion.div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-20">
        <DashboardPreview />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-surface-600 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-surface-700 flex items-start justify-center p-1.5"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1.5 rounded-full bg-primary-400"
          />
        </motion.div>
      </motion.div>

      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass-card rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/20 border border-primary-500/15"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800/50">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-primary-400" />
                  <h3 className="text-lg font-semibold text-surface-100">StudySprint Demo</h3>
                </div>
                <button
                  onClick={() => setShowDemo(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video placeholder */}
              <div className="aspect-video bg-surface-900 flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-purple-600/10" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/30 group-hover:scale-105 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-surface-400 text-sm">Product tour video</p>
                  <p className="text-surface-600 text-xs mt-1">2:34 min</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex items-center justify-between bg-surface-900/50">
                <p className="text-sm text-surface-400">
                  See how StudySprint transforms your study experience
                </p>
                <button
                  onClick={handleGetStarted}
                  className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Start free trial →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
