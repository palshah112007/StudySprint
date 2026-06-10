"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Zap,
  Trophy,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  Calendar,
  Sparkles,
  Flame,
  Medal,
  ChevronRight,
  Plus,
  Timer,
  BarChart3,
  ListChecks,
  Code2,
  Layers,
  FileText,
  Bot,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { ContributionHeatmap } from "@/components/ui/ContributionHeatmap";
import { ProblemsChart } from "@/components/ui/ProblemsChart";
import { cn, formatXp, getLevelFromXp } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";
import { loadUserState } from "@/lib/persistence";

const totalXp = 12450;
const { level, currentXp, nextLevelXp } = getLevelFromXp(totalXp);

const quickActions = [
  { label: "Start Focus", icon: Timer, color: "from-primary-500 to-purple-600", href: "/focus-room" },
  { label: "Quiz", icon: Brain, color: "from-accent-500 to-emerald-600", href: "/quiz" },
  { label: "Flashcards", icon: Layers, color: "from-cyan-500 to-blue-600", href: "/flashcards" },
  { label: "Notes", icon: FileText, color: "from-purple-500 to-pink-600", href: "/notes" },
  { label: "Tasks", icon: ListChecks, color: "from-amber-500 to-orange-600", href: "/tasks" },
  { label: "Study Group", icon: Trophy, color: "from-rose-500 to-red-600", href: "/social" },
  { label: "AI Assistant", icon: Bot, color: "from-indigo-500 to-violet-600", href: "/ai-assistant" },
  { label: "Analytics", icon: BarChart3, color: "from-teal-500 to-emerald-600", href: "/analytics" },
];

const upcomingDeadlines = [
  { subject: "Mathematics", task: "Calculus Final Review", due: "Tomorrow", color: "primary" },
  { subject: "Physics", task: "Quantum Mechanics Quiz", due: "In 3 days", color: "amber" },
  { subject: "CS", task: "Algorithm Project", due: "In 5 days", color: "accent" },
  { subject: "Biology", task: "Lab Report", due: "In 7 days", color: "purple" },
];

const subjects = [
  { name: "Mathematics", progress: 78, color: "#6366f1", hours: 24 },
  { name: "Physics", progress: 65, color: "#f59e0b", hours: 18 },
  { name: "Computer Science", progress: 85, color: "#8b5cf6", hours: 32 },
  { name: "Biology", progress: 45, color: "#06b6d4", hours: 12 },
  { name: "Literature", progress: 30, color: "#ec4899", hours: 8 },
];

const weeklyData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 4.2 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 5.1 },
  { day: "Fri", hours: 3.7 },
  { day: "Sat", hours: 6.0 },
  { day: "Sun", hours: 4.5 },
];

const problemStats = {
  easy: { solved: 42, total: 65 },
  medium: { solved: 28, total: 55 },
  hard: { solved: 12, total: 30 },
};

export default function DashboardPage() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });
  const [isLoading, setIsLoading] = useState(true);
  const [streak] = useState(() => loadUserState().streak);
  const { playSound } = useSound();

  // Simulate loading for skeleton effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-950 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="skeleton h-8 w-64 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="skeleton h-48 rounded-2xl" />
              <div className="skeleton h-64 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="skeleton h-56 rounded-2xl" />
              <div className="skeleton h-32 rounded-2xl" />
              <div className="skeleton h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">
                  {greeting}, Alex! 👋
                </h1>
                <Badge variant="accent" size="sm" pulse>
                  <Sparkles className="w-3 h-3" />
                  Focus Mode
                </Badge>
              </div>
              <p className="text-surface-400">
                You&rsquo;re on a <span className="text-accent-400 font-medium">{streak}-day streak</span>. Keep it going!
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="glass-light rounded-xl px-4 py-2.5 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-surface-200">{streak}</span>
                  <span className="text-xs text-surface-500">days</span>
                </div>
              </div>
              <Link href="/focus-room">
                <Button variant="gradient" size="sm" glow onClick={() => playSound("click")}>
                  <Plus className="w-4 h-4" />
                  New Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full glass-card rounded-xl p-4 flex items-center gap-3 group cursor-pointer"
                onClick={() => playSound("click")}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0",
                    action.color
                  )}
                >
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-surface-200">{action.label}</span>
                <ChevronRight className="w-4 h-4 text-surface-600 ml-auto group-hover:text-surface-400 transition-colors" />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP & Level Card */}
            <Card gradient>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <Badge variant="amber" size="md">
                  <Medal className="w-3 h-3" />
                  Level {level}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-surface-100">{formatXp(totalXp)} XP</p>
                    <p className="text-sm text-surface-400">{currentXp} / {nextLevelXp} XP to next level</p>
                  </div>
                </div>
                <ProgressBar value={currentXp} max={nextLevelXp} size="lg" showLabel />

                {/* LeetCode-style Problems Chart */}
                <div className="mt-6 pt-6 border-t border-surface-800/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Code2 className="w-4 h-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-surface-200">Question Solving Progress</h3>
                    <Link href="/analytics" className="ml-auto">
                      <Button variant="ghost" size="sm" onClick={() => playSound("click")}>
                        Full Stats
                      </Button>
                    </Link>
                  </div>
                  <ProblemsChart stats={problemStats} />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <div className="flex items-center gap-2 text-xs text-surface-500">
                  <TrendingUp className="w-3.5 h-3.5 text-accent-400" />
                  <span>+23% vs last week</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-3 h-40">
                  {weeklyData.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.hours / 6) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full rounded-lg relative group cursor-pointer"
                        style={{
                          background: `linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)`,
                        }}
                      >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-surface-300 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-800 px-2 py-0.5 rounded whitespace-nowrap">
                          {d.hours}h
                        </div>
                      </motion.div>
                      <span className="text-xs text-surface-500">{d.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subject Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <Link href="/analytics">
                  <Button variant="ghost" size="sm" onClick={() => playSound("click")}>View All</Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.name} className="flex items-center gap-4">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-200">{subject.name}</span>
                        <span className="text-xs text-surface-500">{subject.hours}h</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${subject.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-surface-400 w-8 text-right">
                      {subject.progress}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contribution Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  Study Activity Calendar
                </CardTitle>
                <Badge variant="primary" size="sm">
                  <TrendingUp className="w-3 h-3" />
                  {streak}-day streak
                </Badge>
              </CardHeader>
              <CardContent>
                <ContributionHeatmap />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Focus Score */}
            <Card gradient className="text-center">
              <CardContent>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <motion.circle
                      cx="60" cy="60" r="54" fill="none"
                      stroke="#6366f1"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(85 / 100) * 339.292} 339.292`}
                      initial={{ strokeDasharray: "0 339.292" }}
                      animate={{ strokeDasharray: `${(85 / 100) * 339.292} 339.292` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-surface-100">85</p>
                      <p className="text-[10px] text-surface-500 uppercase">Focus Score</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-surface-400">Today&rsquo;s focus quality</p>
              </CardContent>
            </Card>

            {/* Motivational Quote */}
            <Card>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-300 italic leading-relaxed">
                      &ldquo;The secret of getting ahead is getting started.&rdquo;
                    </p>
                    <p className="text-xs text-surface-500 mt-2">— Mark Twain</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingDeadlines.map((dl) => (
                  <div key={dl.task} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        dl.color === "primary" && "bg-primary-400",
                        dl.color === "amber" && "bg-amber-400",
                        dl.color === "accent" && "bg-accent-400",
                        dl.color === "purple" && "bg-purple-400"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-200 truncate">{dl.task}</p>
                      <p className="text-xs text-surface-500">{dl.subject} — {dl.due}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendation */}
            <Card className="border-primary-500/20">
              <CardContent>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-200">AI Recommendation</p>
                    <p className="text-xs text-surface-400">Based on your recent activity</p>
                  </div>
                </div>
                <p className="text-sm text-surface-300 mb-3">
                  You&rsquo;ve been doing great in Mathematics! Try focusing on Physics this week to balance your progress.
                </p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => {
                  playSound("success");
                  toast("Study plan updated! Check your analytics for details.", "success");
                }}>
                  <Target className="w-3.5 h-3.5" />
                  Update Study Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
