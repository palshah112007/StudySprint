"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Flame,
  Target,
  Crown,
  Medal,
  Star,
  Zap,
  Rocket,
  Swords,
  Shield,
  Gem,
  ChevronRight,
  Sparkles,
  Gift,
  Users,
  Brain,
  Timer,
  BookOpen,
  Music,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { cn, formatXp, getLevelFromXp, achievements, dailyMissions, weeklyChallenges } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";

const totalXp = 12450;
const { level, currentXp, nextLevelXp } = getLevelFromXp(totalXp);

const ranks = [
  { name: "Bronze", minXp: 0, icon: Shield, color: "from-amber-600 to-amber-800" },
  { name: "Silver", minXp: 2000, icon: Medal, color: "from-slate-300 to-slate-500" },
  { name: "Gold", minXp: 5000, icon: Star, color: "from-amber-400 to-amber-600" },
  { name: "Platinum", minXp: 10000, icon: Gem, color: "from-cyan-400 to-blue-600" },
  { name: "Diamond", minXp: 20000, icon: Crown, color: "from-primary-400 to-purple-600" },
  { name: "Legend", minXp: 50000, icon: Rocket, color: "from-rose-400 to-red-600" },
];

const leaderboardData = [
  { rank: 1, name: "Sarah Chen", xp: 45800, level: 67, avatar: "SC", badge: "Legend" },
  { rank: 2, name: "Marcus Johnson", xp: 42100, level: 64, avatar: "MJ", badge: "Legend" },
  { rank: 3, name: "Emily Rodriguez", xp: 38900, level: 62, avatar: "ER", badge: "Diamond" },
  { rank: 4, name: "You", xp: 12450, level: 24, avatar: "AK", badge: "Platinum", isUser: true },
  { rank: 5, name: "Lisa Park", xp: 11200, level: 22, avatar: "LP", badge: "Platinum" },
  { rank: 6, name: "James Wilson", xp: 9800, level: 20, avatar: "JW", badge: "Gold" },
  { rank: 7, name: "Anna Schmidt", xp: 8500, level: 18, avatar: "AS", badge: "Gold" },
];

const skillTrees = [
  {
    name: "Focus Mastery",
    progress: 65,
    nodes: [
      { name: "Deep Focus I", unlocked: true },
      { name: "Deep Focus II", unlocked: true },
      { name: "Flow State", unlocked: false },
      { name: "Hyper Focus", locked: true },
    ],
    color: "primary",
  },
  {
    name: "Quiz Champion",
    progress: 40,
    nodes: [
      { name: "Quick Recall", unlocked: true },
      { name: "Pattern Recognition", unlocked: false },
      { name: "Speed Solver", locked: true },
      { name: "Perfect Score", locked: true },
    ],
    color: "accent",
  },
  {
    name: "Social Butterfly",
    progress: 25,
    nodes: [
      { name: "Group Study", unlocked: true },
      { name: "Challenge Accepted", locked: true },
      { name: "Team Lead", locked: true },
      { name: "Community Star", locked: true },
    ],
    color: "purple",
  },
];

function triggerConfetti() {
  const colors = ["#6366f1", "#2dd4bf", "#f59e0b", "#ec4899", "#8b5cf6", "#10b981"];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = "-10px";
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = Math.random() * 6 + 4 + "px";
    el.style.height = Math.random() * 6 + 4 + "px";
    el.style.setProperty("--drift", (Math.random() - 0.5) * 200 + "px");
    el.style.animationDuration = Math.random() * 1.5 + 1.5 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState<"achievements" | "missions" | "skilltree" | "leaderboard">("achievements");
  const { playSound } = useSound();
  const [claimingMission, setClaimingMission] = useState<string | null>(null);

  const handleClaimMission = useCallback((missionId: string, xp: number) => {
    setClaimingMission(missionId);
    playSound("achievement");
    setTimeout(() => {
      playSound("xp");
      triggerConfetti();
      toast(`🎉 Earned ${xp} XP!`, "success");
      setClaimingMission(null);
    }, 800);
  }, [playSound]);

  const handleAchievementHover = useCallback((unlocked: boolean) => {
    if (unlocked) playSound("hover");
  }, [playSound]);

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-400" />
                Gamification
              </h1>
              <p className="text-surface-400">Level up your study game</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-light rounded-xl px-4 py-2.5 flex items-center gap-3">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-xs text-surface-500">Current Streak</p>
                  <p className="text-lg font-bold text-surface-200">12 days</p>
                </div>
              </div>
              <div className="glass-light rounded-xl px-4 py-2.5 flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs text-surface-500">Total XP</p>
                  <p className="text-lg font-bold gradient-text">{formatXp(totalXp)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 glass-card rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-surface-500 uppercase">Level {level}</p>
                  <p className="font-semibold text-surface-200">Sprint Master</p>
                </div>
              </div>
              <Badge variant="amber" size="md" pulse>
                {currentXp} / {nextLevelXp} XP
              </Badge>
            </div>
            <ProgressBar value={currentXp} max={nextLevelXp} size="lg" showLabel label="Level Progress" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 -mb-px">
            {[
              { id: "achievements", label: "Achievements", icon: Award },
              { id: "missions", label: "Missions", icon: Target },
              { id: "skilltree", label: "Skill Tree", icon: Shield },
              { id: "leaderboard", label: "Leaderboard", icon: Crown },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as typeof activeTab); playSound("click"); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
                  activeTab === tab.id
                    ? "border-primary-500 text-surface-200"
                    : "border-transparent text-surface-500 hover:text-surface-400"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-4 flex items-center gap-4 group cursor-pointer"
                onMouseEnter={() => handleAchievementHover(i < 5)}
                onClick={() => {
                  if (i < 5) {
                    playSound("achievement");
                    triggerConfetti();
                    toast(`🏆 ${achievement.name} unlocked! +${achievement.xp} XP`, "success");
                  }
                }}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-all group-hover:scale-110",
                    i < 5
                      ? "bg-gradient-to-br from-primary-500 to-purple-600"
                      : "bg-surface-800"
                  )}
                >
                  <achievement.icon className={cn("w-5 h-5", i < 5 ? "text-white" : "text-surface-500")} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold", i < 5 ? "text-surface-200" : "text-surface-500")}>
                    {achievement.name}
                  </p>
                  <p className={cn("text-xs", i < 5 ? "text-surface-400" : "text-surface-600")}>
                    {achievement.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-surface-500">+{achievement.xp} XP</p>
                  {i < 5 && (
                    <Badge variant="primary" size="sm">Unlocked</Badge>
                  )}
                  {i >= 5 && (
                    <Badge variant="surface" size="sm">Locked</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Missions Tab */}
        {activeTab === "missions" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Daily Missions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" />
                  Daily Missions
                </CardTitle>
                <Badge variant="amber" size="sm">
                  <Sparkles className="w-3 h-3" />
                  3 Active
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyMissions.map((mission) => (
                  <div key={mission.id} className="glass-light rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-surface-200">{mission.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" size="sm">+{mission.xp} XP</Badge>
                        {mission.progress >= mission.total && (
                          <button
                            onClick={() => handleClaimMission(mission.id, mission.xp)}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-accent-600 text-white hover:bg-accent-500 transition-all"
                          >
                            {claimingMission === mission.id ? "Claiming..." : "Claim"}
                          </button>
                        )}
                      </div>
                    </div>
                    <ProgressBar value={mission.progress} max={mission.total} size="sm" showLabel />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-purple-400" />
                  Weekly Challenges
                </CardTitle>
                <Badge variant="purple" size="sm">
                  <Gift className="w-3 h-3" />
                  Rewards
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyChallenges.map((challenge) => (
                  <div key={challenge.id} className="glass-light rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-surface-200">{challenge.name}</p>
                        <p className="text-xs text-surface-500">{challenge.deadline}</p>
                      </div>
                      <Badge variant="purple" size="sm">+{challenge.xp} XP</Badge>
                    </div>
                    <ProgressBar value={challenge.progress} max={challenge.total} size="sm" showLabel />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Skill Tree Tab */}
        {activeTab === "skilltree" && (
          <div className="grid md:grid-cols-3 gap-6">
            {skillTrees.map((tree) => (
              <Card key={tree.name}>
                <CardContent>
                  <h3 className="text-lg font-semibold text-surface-200 mb-2">{tree.name}</h3>
                  <ProgressBar value={tree.progress} max={100} size="md" showLabel className="mb-4" />
                  <div className="space-y-3">
                    {tree.nodes.map((node) => (
                      <div
                        key={node.name}
                        className={cn(
                          "glass-light rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all hover:bg-surface-700/30",
                          node.locked && "opacity-40"
                        )}
                        onClick={() => {
                          if (node.unlocked) {
                            playSound("achievement");
                            triggerConfetti();
                            toast(`✨ ${node.name} activated!`, "success");
                          } else {
                            playSound("error");
                            toast("🔒 Complete earlier nodes to unlock this skill.", "info");
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            node.unlocked ? "bg-gradient-to-br from-primary-500 to-purple-600" : "bg-surface-800"
                          )}
                        >
                          <Star className={cn("w-4 h-4", node.unlocked ? "text-white" : "text-surface-500")} />
                        </div>
                        <div>
                          <p className={cn("text-sm font-medium", node.unlocked ? "text-surface-200" : "text-surface-500")}>
                            {node.name}
                          </p>
                          <p className="text-[10px] text-surface-500">
                            {node.unlocked ? "Unlocked" : node.locked ? "Locked" : "Available"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Global Leaderboard
              </CardTitle>
              <Badge variant="amber" size="md" pulse>This Week</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((player) => (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: player.rank * 0.05 }}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer",
                      player.isUser
                        ? "bg-primary-500/10 border border-primary-500/20"
                        : "glass-light hover:bg-surface-700/30"
                    )}
                    onClick={() => {
                      if (!player.isUser) {
                        playSound("click");
                        toast(`👤 Viewing ${player.name}'s profile — Level ${player.level} • ${player.badge} rank`, "info");
                      }
                    }}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                        player.rank === 1 && "bg-gradient-to-br from-amber-400 to-amber-600 text-white",
                        player.rank === 2 && "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
                        player.rank === 3 && "bg-gradient-to-br from-amber-600 to-amber-800 text-white",
                        player.rank > 3 && "bg-surface-800 text-surface-400"
                      )}
                    >
                      {player.rank}
                    </span>
                    <Avatar name={player.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-200">
                        {player.name}
                        {player.isUser && (
                          <Badge variant="primary" size="sm" className="ml-2">You</Badge>
                        )}
                      </p>
                      <p className="text-xs text-surface-500">Level {player.level} • {player.badge}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold gradient-text">{formatXp(player.xp)} XP</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
