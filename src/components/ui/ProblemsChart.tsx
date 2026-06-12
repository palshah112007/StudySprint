"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, TrendingUp, BarChart3 } from "lucide-react";

interface ProblemStats {
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
}

interface DailySubmission {
  date: string;
  count: number;
}

interface ProblemsChartProps {
  stats?: ProblemStats;
  dailyData?: DailySubmission[];
  className?: string;
}

const defaultStats: ProblemStats = {
  easy: { solved: 42, total: 65 },
  medium: { solved: 28, total: 55 },
  hard: { solved: 12, total: 30 },
};

function generateDailyData(): DailySubmission[] {
  const data: DailySubmission[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.8;
    const count = Math.random() < base ? Math.floor(Math.random() * 8) + 1 : 0;
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    });
  }
  return data;
}

export function ProblemsChart({
  stats: externalStats,
  dailyData: externalData,
  className,
}: ProblemsChartProps) {
  const stats = externalStats || defaultStats;
  const generatedData = useMemo(() => generateDailyData(), []);
  const dailyData = externalData || generatedData;
  const [chartType, setChartType] = useState<"problems" | "submissions">("problems");

  const totalSolved = stats.easy.solved + stats.medium.solved + stats.hard.solved;
  const totalProblems = stats.easy.total + stats.medium.total + stats.hard.total;
  const acceptanceRate = Math.round((totalSolved / totalProblems) * 100);

  const maxSubmission = Math.max(...dailyData.map((d) => d.count), 1);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary Stats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-surface-100">{totalSolved}</p>
          <p className="text-xs text-surface-500">Problems Solved</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType("problems")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              chartType === "problems"
                ? "bg-primary-600 text-white"
                : "text-surface-500 hover:text-surface-300 bg-surface-800/50"
            )}
          >
            <BarChart3 className="w-3 h-3 inline mr-1" />
            Stats
          </button>
          <button
            onClick={() => setChartType("submissions")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              chartType === "submissions"
                ? "bg-primary-600 text-white"
                : "text-surface-500 hover:text-surface-300 bg-surface-800/50"
            )}
          >
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Activity
          </button>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      {chartType === "problems" && (
        <div className="space-y-4">
          {/* Donut ring */}
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none" stroke="#10b981"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.easy.solved / totalProblems) * 314.16} 314.16`}
                  initial={{ strokeDasharray: "0 314.16" }}
                  animate={{ strokeDasharray: `${(stats.easy.solved / totalProblems) * 314.16} 314.16` }}
                  transition={{ duration: 1 }}
                />
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none" stroke="#f59e0b"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.medium.solved / totalProblems) * 314.16} 314.16`}
                  strokeDashoffset={(stats.easy.solved / totalProblems) * -314.16}
                  initial={{ strokeDasharray: "0 314.16" }}
                  animate={{
                    strokeDasharray: `${(stats.medium.solved / totalProblems) * 314.16} 314.16`,
                    strokeDashoffset: (stats.easy.solved / totalProblems) * -314.16,
                  }}
                  transition={{ duration: 1 }}
                />
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none" stroke="#ef4444"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(stats.hard.solved / totalProblems) * 314.16} 314.16`}
                  strokeDashoffset={((stats.easy.solved + stats.medium.solved) / totalProblems) * -314.16}
                  initial={{ strokeDasharray: "0 314.16" }}
                  animate={{
                    strokeDasharray: `${(stats.hard.solved / totalProblems) * 314.16} 314.16`,
                    strokeDashoffset: ((stats.easy.solved + stats.medium.solved) / totalProblems) * -314.16,
                  }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-bold text-surface-100">{acceptanceRate}%</p>
                  <p className="text-[8px] text-surface-500">Solved</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Easy", solved: stats.easy.solved, total: stats.easy.total, color: "#10b981", bg: "bg-emerald-500/10" },
                { label: "Medium", solved: stats.medium.solved, total: stats.medium.total, color: "#f59e0b", bg: "bg-amber-500/10" },
                { label: "Hard", solved: stats.hard.solved, total: stats.hard.total, color: "#ef4444", bg: "bg-red-500/10" },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", cat.bg)}>
                    {cat.solved === cat.total ? (
                      <CheckCircle2 className="w-4 h-4" style={{ color: cat.color }} />
                    ) : (
                      <Circle className="w-4 h-4" style={{ color: cat.color }} />
                    )}
                  </div>
                  <div className="min-w-[60px]">
                    <p className="text-xs font-medium text-surface-300">{cat.label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-surface-100">{cat.solved}</span>
                      <span className="text-[10px] text-surface-600">/ {cat.total}</span>
                    </div>
                  </div>
                  <div className="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden max-w-[100px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cat.solved / cat.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { label: "Easy", value: `${stats.easy.solved}`, color: "text-emerald-400" },
              { label: "Medium", value: `${stats.medium.solved}`, color: "text-amber-400" },
              { label: "Hard", value: `${stats.hard.solved}`, color: "text-red-400" },
              { label: "Acceptance", value: `${acceptanceRate}%`, color: "text-primary-400" },
            ].map((stat) => (
              <div key={stat.label} className="text-center glass-light rounded-lg p-2">
                <p className={cn("text-sm font-bold", stat.color)}>{stat.value}</p>
                <p className="text-[10px] text-surface-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Submissions Bar Chart */}
      {chartType === "submissions" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-surface-500">Last 30 days</p>
            <p className="text-xs text-surface-500">
              Total: {dailyData.reduce((sum, d) => sum + d.count, 0)} submissions
            </p>
          </div>
          <div className="flex items-end gap-1 h-28">
            {dailyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.count / maxSubmission) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.02 }}
                  className={cn(
                    "w-full rounded-sm relative group cursor-pointer",
                    day.count > 0 ? "bg-gradient-to-t from-primary-600 to-primary-400" : "bg-surface-800/40"
                  )}
                  style={{ minHeight: day.count > 0 ? 2 : 0 }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface-800 px-1.5 py-0.5 rounded">
                    {day.count} problems
                  </div>
                </motion.div>
                {i % 5 === 0 && (
                  <span className="text-[8px] text-surface-600">{day.date.split(" ")[0]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
