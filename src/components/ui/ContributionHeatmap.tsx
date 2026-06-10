"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionHeatmapProps {
  data?: DayData[];
  year?: number;
  className?: string;
}

function generateMockData(year: number): DayData[] {
  const days: DayData[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const current = new Date(startDate);
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Weekdays have higher activity probability
    const baseChance = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.7;
    const hasActivity = Math.random() < baseChance;
    const count = hasActivity ? Math.floor(Math.random() * 15) + 1 : 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0 && count <= 3) level = 1;
    else if (count <= 6) level = 2;
    else if (count <= 10) level = 3;
    else level = 4;

    days.push({
      date: current.toISOString().split("T")[0],
      count,
      level,
    });
    current.setDate(current.getDate() + 1);
  }
  return days;
}

const levelColors: Record<number, string> = {
  0: "bg-surface-800/40 hover:bg-surface-700/40",
  1: "bg-primary-950 hover:bg-primary-900",
  2: "bg-primary-800 hover:bg-primary-700",
  3: "bg-primary-600 hover:bg-primary-500",
  4: "bg-primary-400 hover:bg-primary-300",
};

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

export function ContributionHeatmap({
  data: externalData,
  year,
  className,
}: ContributionHeatmapProps) {
  const yr = year || new Date().getFullYear();
  const data = useMemo(() => externalData || generateMockData(yr), [externalData, yr]);
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const { weeks, totalContributions } = useMemo(() => {
    const startDate = new Date(yr, 0, 1);
    const startDay = startDate.getDay();

    const dataMap = new Map(data.map((d) => [d.date, d]));

    const ws: { days: { date: string; count: number; level: number }[] }[] = [];
    let total = 0;

    // Fill initial empty days
    const firstWeek: { date: string; count: number; level: number }[] = [];
    for (let i = 0; i < startDay; i++) {
      firstWeek.push({ date: "", count: 0, level: 0 });
    }

    const current = new Date(startDate);
    const endDate = new Date(yr, 11, 31);

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const dayData = dataMap.get(dateStr) || { date: dateStr, count: 0, level: 0 };
      total += dayData.count;

      if (firstWeek.length < 7) {
        firstWeek.push(dayData);
      } else {
        ws.push({ days: [...firstWeek] });
        firstWeek.length = 0;
        firstWeek.push(dayData);
      }
      current.setDate(current.getDate() + 1);
    }

    // Fill remaining
    if (firstWeek.length > 0) {
      while (firstWeek.length < 7) {
        firstWeek.push({ date: "", count: 0, level: 0 });
      }
      ws.push({ days: firstWeek });
    }

    return { weeks: ws, totalContributions: total };
  }, [data, yr]);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2 mb-3 text-xs text-surface-500">
        <span className="font-medium text-surface-400">{totalContributions.toLocaleString()} contributions</span>
        <span>in {yr}</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-[10px]">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn("w-3 h-3 rounded-sm", levelColors[level])}
            />
          ))}
          <span className="text-[10px]">More</span>
        </div>
      </div>

      <div className="flex gap-0.5 overflow-x-auto pb-2">
        <div className="flex flex-col gap-0.5 mr-1 pt-[1px]">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[10px] text-[8px] text-surface-600 leading-[10px]">
              {label}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.days.map((day, di) => (
              <motion.div
                key={`${wi}-${di}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.001 }}
                className={cn(
                  "w-[10px] h-[10px] rounded-sm cursor-pointer transition-all duration-150",
                  levelColors[day.level as keyof typeof levelColors],
                  day.date && "border border-white/[0.03]"
                )}
                onMouseEnter={(e) => {
                  if (day.date) {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      date: day.date,
                      count: day.count,
                      x: rect.left,
                      y: rect.top - 8,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[9999] glass rounded-lg px-2.5 py-1.5 text-xs shadow-xl pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          <p className="text-surface-200 font-medium whitespace-nowrap">
            {tooltip.count} {tooltip.count === 1 ? "contribution" : "contributions"}
          </p>
          <p className="text-surface-500 text-[10px]">
            {new Date(tooltip.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 text-xs text-surface-600">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">📊</span>
          <span>Study consistency</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Info className="w-3 h-3" />
          <span>Click a cell for details</span>
        </div>
      </div>
    </div>
  );
}
