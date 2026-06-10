"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Flag,
  Search,
  ShieldCheck,
  Swords,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

const adminStats = [
  { label: "Active users", value: "18,420", change: "+12.8%", icon: Users, tone: "text-primary-400" },
  { label: "Focus minutes", value: "1.9M", change: "+18.2%", icon: Activity, tone: "text-accent-400" },
  { label: "Open reports", value: "27", change: "-6.1%", icon: Flag, tone: "text-amber-400" },
  { label: "System health", value: "99.98%", change: "stable", icon: ShieldCheck, tone: "text-emerald-400" },
];

const users = [
  { name: "Sarah Chen", plan: "Pro", status: "Active", xp: "45.8k", risk: "Low" },
  { name: "Marcus Johnson", plan: "Teams", status: "In review", xp: "42.1k", risk: "Medium" },
  { name: "Emily Rodriguez", plan: "Pro", status: "Active", xp: "38.9k", risk: "Low" },
  { name: "Ryan Torres", plan: "Free", status: "Flagged", xp: "6.4k", risk: "High" },
];

const moderationQueue = [
  { title: "Study group invite spam", area: "Community", priority: "High" },
  { title: "Challenge result dispute", area: "Gamification", priority: "Medium" },
  { title: "Unsafe uploaded note title", area: "AI Workspace", priority: "Medium" },
];

export default function AdminPage() {
  const [query, setQuery] = useState("");
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-primary-500/5 blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-lg shadow-primary-500/20">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-100 sm:text-3xl">Admin Command Center</h1>
                <p className="text-sm text-surface-400">Operate users, content, challenges, reports, and platform health.</p>
              </div>
            </div>
            <Badge variant="accent" size="md" pulse>
              <CheckCircle2 className="h-3 w-3" />
              All systems nominal
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminStats.map((stat) => (
            <Card key={stat.label} hover={false}>
              <CardContent>
                <div className="mb-3 flex items-center justify-between">
                  <stat.icon className={cn("h-5 w-5", stat.tone)} />
                  <Badge variant="surface" size="sm">{stat.change}</Badge>
                </div>
                <p className="text-2xl font-bold text-surface-100">{stat.value}</p>
                <p className="text-xs uppercase tracking-wider text-surface-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-400" />
                User Management
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toast("User cohort export queued for admin review.", "success")}
              >
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search users..."
                  className="w-full rounded-xl border border-surface-700/50 bg-surface-800/50 py-2.5 pl-10 pr-4 text-sm text-surface-200 placeholder-surface-500 outline-none transition-all focus:border-primary-500/30 focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div key={user.name} className="flex items-center gap-4 rounded-xl bg-surface-800/30 p-3">
                    <Avatar name={user.name} size="sm" status={user.status === "Active" ? "online" : "away"} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-surface-200">{user.name}</p>
                      <p className="text-xs text-surface-500">{user.plan} plan - {user.xp} XP</p>
                    </div>
                    <Badge variant={user.risk === "High" ? "rose" : user.risk === "Medium" ? "amber" : "accent"} size="sm">
                      {user.risk}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast(`${user.name} opened in admin review mode.`, "info")}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Reports
              </CardTitle>
              <Badge variant="amber" size="sm">27 open</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {moderationQueue.map((item) => (
                <div key={item.title} className="rounded-xl bg-surface-800/30 p-3">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-surface-200">{item.title}</p>
                    <Badge variant={item.priority === "High" ? "rose" : "amber"} size="sm">{item.priority}</Badge>
                  </div>
                  <p className="text-xs text-surface-500">{item.area}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Challenge Ops", icon: Swords, value: 72, copy: "Weekly challenges calibrated" },
            { title: "Content QA", icon: BookOpen, value: 88, copy: "AI-generated sets approved" },
            { title: "Executive Report", icon: BarChart3, value: 64, copy: "May cohort forecast confidence" },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/10 text-primary-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-200">{item.title}</p>
                    <p className="text-xs text-surface-500">{item.copy}</p>
                  </div>
                </div>
                <ProgressBar value={item.value} max={100} size="sm" showLabel />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-accent-400" />
              Launch Readiness Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Authentication policy reviewed",
                "Payments event handling mapped",
                "AI prompt safety review queued",
                "Upload moderation workflow designed",
                "Admin audit trail specified",
                "Incident response owner assigned",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-surface-800/30 p-3 text-sm text-surface-300">
                  <CheckCircle2 className="h-4 w-4 text-accent-400" />
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
