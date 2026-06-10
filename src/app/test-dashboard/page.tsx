"use client";
import { ContributionHeatmap } from "@/components/ui/ContributionHeatmap";
import { ProblemsChart } from "@/components/ui/ProblemsChart";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-surface-950 pt-20 p-8">
      <h1 className="text-2xl text-white mb-8">Test Dashboard</h1>
      <div className="max-w-4xl space-y-8">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-surface-100 mb-4">Contribution Heatmap</h2>
          <ContributionHeatmap />
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-surface-100 mb-4">Problems Chart</h2>
          <ProblemsChart />
        </div>
      </div>
    </div>
  );
}
