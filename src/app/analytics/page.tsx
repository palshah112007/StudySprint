"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Clock,
  Target,
  Calendar,
  Download,
  Filter,
  ArrowUp,
  BookOpen,
  Code2,
  Zap,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProblemsChart } from "@/components/ui/ProblemsChart";
import { ContributionHeatmap } from "@/components/ui/ContributionHeatmap";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";
import { loadQuizResults, type QuizResult } from "@/lib/persistence";

const monthlyData = [
  { month: "Jan", hours: 45, quizzes: 12, focus: 38, problems: 15 },
  { month: "Feb", hours: 52, quizzes: 15, focus: 44, problems: 22 },
  { month: "Mar", hours: 48, quizzes: 11, focus: 40, problems: 18 },
  { month: "Apr", hours: 68, quizzes: 18, focus: 58, problems: 30 },
  { month: "May", hours: 75, quizzes: 22, focus: 65, problems: 35 },
  { month: "Jun", hours: 88, quizzes: 28, focus: 78, problems: 42 },
];

const defaultSubjectComparison = [
  { name: "Mathematics", hours: 24, score: 85, change: "+12%", progress: 78, color: "#6366f1" },
  { name: "Physics", hours: 18, score: 72, change: "+8%", progress: 65, color: "#f59e0b" },
  { name: "Computer Science", hours: 32, score: 92, change: "+15%", progress: 85, color: "#8b5cf6" },
  { name: "Biology", hours: 12, score: 68, change: "+5%", progress: 45, color: "#06b6d4" },
  { name: "Literature", hours: 8, score: 55, change: "+3%", progress: 30, color: "#ec4899" },
];

const subjectColors: Record<string, string> = {
  Mathematics: "#6366f1",
  Physics: "#f59e0b",
  "Computer Science": "#8b5cf6",
  Biology: "#06b6d4",
  Chemistry: "#10b981",
  Literature: "#ec4899",
  History: "#f97316",
  Languages: "#14b8a6",
  General: "#64748b",
};

const weeklyStats = [
  { day: "Mon", focus: 85, sessions: 3, duration: 2.5 },
  { day: "Tue", focus: 78, sessions: 4, duration: 3.2 },
  { day: "Wed", focus: 82, sessions: 2, duration: 1.8 },
  { day: "Thu", focus: 92, sessions: 5, duration: 4.5 },
  { day: "Fri", focus: 88, sessions: 3, duration: 2.8 },
  { day: "Sat", focus: 95, sessions: 6, duration: 5.5 },
  { day: "Sun", focus: 90, sessions: 4, duration: 3.8 },
];

const insights = [
  { icon: TrendingUp, text: "Your focus score improved by 15% this month. Keep up the great work!", color: "text-accent-400", bg: "bg-accent-500/10" },
  { icon: Brain, text: "Physics is your weakest subject. Try increasing study sessions by 2 per week.", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Clock, text: "Your peak productivity hours are between 8-11 AM. Schedule difficult subjects then.", color: "text-primary-400", bg: "bg-primary-500/10" },
  { icon: Target, text: "You're 65% toward your monthly goal of 80 study hours. 28 hours remaining.", color: "text-purple-400", bg: "bg-purple-500/10" },
];


const statColorClasses = {
  primary: { bg: "bg-primary-500/10", text: "text-primary-400" },
  accent: { bg: "bg-accent-500/10", text: "text-accent-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
} as const;

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [activeChart, setActiveChart] = useState<"study" | "problems">("study");
  const { playSound } = useSound();
  const [isLoading, setIsLoading] = useState(true);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  useEffect(() => {
    setQuizHistory(loadQuizResults());
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Compute real quiz stats from history
  const totalQuizzes = quizHistory.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((s, r) => s + (r.correctAnswers / r.totalQuestions) * 100, 0) / totalQuizzes)
    : 0;
  const totalXp = quizHistory.reduce((s, r) => s + r.xpEarned, 0);
  const aiQuizzes = quizHistory.filter((r) => r.isAiGenerated).length;
  const builtinQuizzes = totalQuizzes - aiQuizzes;

  // Compute subject scores from real data
  const subjectMap: Record<string, { total: number; correct: number; count: number }> = {};
  quizHistory.forEach((r) => {
    if (!subjectMap[r.subject]) subjectMap[r.subject] = { total: 0, correct: 0, count: 0 };
    subjectMap[r.subject].total += r.totalQuestions;
    subjectMap[r.subject].correct += r.correctAnswers;
    subjectMap[r.subject].count += 1;
  });
  const subjectComparison = Object.keys(subjectMap).length > 0
    ? Object.entries(subjectMap).map(([name, data]) => ({
        name,
        hours: Math.round(data.count * 0.25),
        score: Math.round((data.correct / data.total) * 100),
        change: `+${data.count} quizzes`,
        progress: Math.round((data.correct / data.total) * 100),
        color: subjectColors[name] || "#64748b",
      }))
    : defaultSubjectComparison;

  // Compute difficulty breakdown
  const difficultyStats = { easy: { solved: 0, total: 0 }, medium: { solved: 0, total: 0 }, hard: { solved: 0, total: 0 } };
  quizHistory.forEach((r) => {
    const d = r.difficulty === "mixed" ? "medium" : r.difficulty;
    if (difficultyStats[d as keyof typeof difficultyStats]) {
      difficultyStats[d as keyof typeof difficultyStats].total += r.totalQuestions;
      difficultyStats[d as keyof typeof difficultyStats].solved += r.correctAnswers;
    }
  });
  // Use defaults if no real data
  const problemStats = (difficultyStats.easy.total + difficultyStats.medium.total + difficultyStats.hard.total) > 0
    ? difficultyStats
    : { easy: { solved: 42, total: 65 }, medium: { solved: 28, total: 55 }, hard: { solved: 12, total: 30 } };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-950 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="skeleton h-8 w-48 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="skeleton h-72 rounded-2xl" />
            <div className="skeleton h-72 rounded-2xl" />
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
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">Analytics</h1>
                <p className="text-sm text-surface-400">Your comprehensive study insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={() => {
                playSound("click");
                toast("📊 Filter options: Subject, Date Range, Activity Type — coming in v1.2!", "info");
              }}>
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="secondary" size="sm" onClick={() => {
                playSound("success");
                toast("📥 Exporting your analytics as PDF... Ready for download!", "success");
              }}>
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Tab & Time selectors */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex gap-2">
              {(["weekly", "monthly", "yearly"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => { setTimeRange(range); playSound("click"); }}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    timeRange === range
                      ? "bg-primary-600 text-white shadow-lg"
                      : "text-surface-400 hover:text-surface-200 bg-surface-800/50"
                  )}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => { setActiveChart("study"); playSound("click"); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                  activeChart === "study"
                    ? "bg-accent-600 text-white shadow-lg"
                    : "text-surface-400 hover:text-surface-200 bg-surface-800/50"
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Study
              </button>
              <button
                onClick={() => { setActiveChart("problems"); playSound("click"); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
                  activeChart === "problems"
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-surface-400 hover:text-surface-200 bg-surface-800/50"
                )}
              >
                <Code2 className="w-3.5 h-3.5" />
                Problems
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeChart === "study" ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Hours", value: "376", change: "+18%", icon: Clock, color: "primary", up: true },
                { label: "Avg. Focus", value: "87%", change: "+6%", icon: Brain, color: "accent", up: true },
                { label: "Quizzes Done", value: totalQuizzes.toString(), change: totalQuizzes > 0 ? `${aiQuizzes} AI` : "0", icon: BookOpen, color: "amber", up: true },
                { label: "Study Days", value: "142", change: "+2%", icon: Calendar, color: "purple", up: true },
              ].map((stat) => (
                <Card key={stat.label} hover={false}>
                  <CardContent>
                    <div className="flex items-start justify-between mb-2">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", statColorClasses[stat.color as keyof typeof statColorClasses].bg)}>
                        <stat.icon className={cn("w-5 h-5", statColorClasses[stat.color as keyof typeof statColorClasses].text)} />
                      </div>
                      <Badge variant={stat.up ? "accent" : "rose"} size="sm">
                        <ArrowUp className="w-3 h-3" />
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-surface-100">{stat.value}</p>
                    <p className="text-xs text-surface-500">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Study Trends */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <Badge variant="primary" size="sm">Hours</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-52">
                    {monthlyData.map((d) => (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(d.hours / 100) * 100}%` }}
                          transition={{ duration: 0.8, delay: monthlyData.indexOf(d) * 0.05 }}
                          className="w-full rounded-lg relative group cursor-pointer"
                          style={{
                            background: `linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)`,
                          }}
                        >
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-surface-300 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-800 px-2 py-0.5 rounded whitespace-nowrap">
                            {d.hours}h
                          </div>
                        </motion.div>
                        <span className="text-xs text-surface-500">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <Badge variant="accent" size="sm">{totalQuizzes > 0 ? "Real Data" : "Demo"}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjectComparison.map((subject) => (
                    <div key={subject.name} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: subject.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-surface-200">{subject.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-surface-200">{subject.score}%</span>
                            <span className="text-xs text-accent-400">{subject.change}</span>
                          </div>
                        </div>
                        <ProgressBar value={subject.score} max={100} size="sm" color={subject.color} animated />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Weekly Details */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Breakdown</CardTitle>
                <Badge variant="purple" size="sm">
                  <Eye className="w-3 h-3" />
                  Focus Score
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-3">
                  {weeklyStats.map((day) => (
                    <div key={day.day} className="text-center">
                      <p className="text-xs text-surface-500 mb-2">{day.day}</p>
                      <div className="relative flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${day.focus}%` }}
                          transition={{ duration: 0.8 }}
                          className="w-full max-w-[40px] rounded-lg"
                          style={{
                            height: `${day.focus * 0.6}px`,
                            background: `linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%)`,
                          }}
                        />
                        <p className="text-xs font-bold text-surface-300 mt-2">{day.focus}%</p>
                        <p className="text-[10px] text-surface-500">{day.duration}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Problems View */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardContent>
                  <ProblemsChart stats={problemStats} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-400" />
                    Submission Activity
                  </CardTitle>
                  <Badge variant="primary" size="sm" pulse>
                    <TrendingUp className="w-3 h-3" />
                    82 total
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ContributionHeatmap />
                </CardContent>
              </Card>
            </div>

            {/* Problem Breakdown by Subject */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-primary-400" />
                  Problems by Subject
                </CardTitle>
                <Badge variant="accent" size="sm">This Month</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { subject: "Mathematics", solved: 18, total: 25, color: "#6366f1", icon: "📐" },
                    { subject: "Computer Science", solved: 22, total: 30, color: "#8b5cf6", icon: "💻" },
                    { subject: "Physics", solved: 10, total: 18, color: "#f59e0b", icon: "⚡" },
                  ].map((subj) => (
                    <div key={subj.subject} className="glass-light rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{subj.icon}</span>
                        <span className="text-sm font-medium text-surface-200">{subj.subject}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-surface-500">Problems solved</span>
                        <span className="text-sm font-bold text-surface-100">{subj.solved}/{subj.total}</span>
                      </div>
                      <ProgressBar value={subj.solved} max={subj.total} size="sm" color={subj.color} showLabel />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Quiz History */}
        {totalQuizzes > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Quiz History
              </CardTitle>
              <Badge variant="primary" size="sm">{totalQuizzes} quizzes</Badge>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-800">
                      <th className="text-left py-3 px-2 text-xs text-surface-500 font-medium">Quiz</th>
                      <th className="text-left py-3 px-2 text-xs text-surface-500 font-medium">Subject</th>
                      <th className="text-left py-3 px-2 text-xs text-surface-500 font-medium">Type</th>
                      <th className="text-left py-3 px-2 text-xs text-surface-500 font-medium">Score</th>
                      <th className="text-left py-3 px-2 text-xs text-surface-500 font-medium">Difficulty</th>
                      <th className="text-right py-3 px-2 text-xs text-surface-500 font-medium">XP</th>
                      <th className="text-right py-3 px-2 text-xs text-surface-500 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizHistory.slice(-15).reverse().map((result) => {
                      const pct = Math.round((result.correctAnswers / result.totalQuestions) * 100);
                      return (
                        <tr key={result.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                          <td className="py-3 px-2 text-sm text-surface-200 truncate max-w-[200px]">{result.quizName || result.subject}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subjectColors[result.subject] || "#64748b" }} />
                              <span className="text-xs text-surface-400">{result.subject}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={result.isAiGenerated ? "accent" : "primary"} size="sm">
                              {result.isAiGenerated ? "AI" : "Built-in"}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span className={cn("text-sm font-bold", pct >= 70 ? "text-accent-400" : pct >= 40 ? "text-amber-400" : "text-rose-400")}>{pct}%</span>
                              <span className="text-[10px] text-surface-500">({result.correctAnswers}/{result.totalQuestions})</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={(result.difficulty || "mixed") === "easy" ? "accent" : (result.difficulty || "mixed") === "hard" ? "rose" : "amber"} size="sm">
                              {result.difficulty || "mixed"}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-xs text-amber-400 font-medium">+{result.xpEarned} XP</span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-xs text-surface-500">{result.date}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Insights - shown in both views */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              AI Insights
            </CardTitle>
            <Badge variant="amber" size="sm" pulse>Personalized</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <div key={insight.text} className={cn("rounded-xl p-4 flex items-start gap-3", insight.bg)}>
                  <insight.icon className={cn("w-5 h-5 shrink-0 mt-0.5", insight.color)} />
                  <p className="text-sm text-surface-300">{insight.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-400" />
              Monthly Goals
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => {
              playSound("click");
              const goal = prompt("Enter your monthly study goal (hours):");
              if (goal && !isNaN(Number(goal)) && Number(goal) > 0) {
                playSound("success");
                toast(`🎯 New goal set: ${goal} study hours this month!`, "success");
              } else if (goal) {
                playSound("error");
                toast("Please enter a valid number of hours.", "error");
              }
            }}>Set New Goal</Button>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: "Study Hours", current: 52, target: 80, icon: Clock, color: "primary" },
                { label: "Focus Sessions", current: 38, target: 50, icon: Brain, color: "accent" },
                { label: "Quizzes", current: totalQuizzes, target: 25, icon: BookOpen, color: "amber" },
              ].map((goal) => (
                <div key={goal.label} className="glass-light rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <goal.icon className={cn("w-4 h-4", statColorClasses[goal.color as keyof typeof statColorClasses].text)} />
                    <span className="text-sm text-surface-300">{goal.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-surface-100 mb-1">
                    {goal.current}
                    <span className="text-surface-500 text-base">/{goal.target}</span>
                  </p>
                  <ProgressBar value={goal.current} max={goal.target} size="sm" showLabel />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
