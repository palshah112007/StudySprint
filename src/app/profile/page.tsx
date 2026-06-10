"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  Shield,
  Trophy,
  Calendar,
  Clock,
  Brain,
  Zap,
  Star,
  Medal,
  Flame,
  BookOpen,
  Edit2,
  Camera,
  MapPin,
  Mail,
  Github,
  Twitter,
  Award,
  BarChart3,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Bell,
  Volume2,
  Keyboard,
  Music,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn, formatXp, getLevelFromXp } from "@/lib/utils";
import { useSound, setSoundEnabled, setSoundVolume, type SoundType } from "@/lib/useSound";
import { useTheme } from "@/lib/theme";
import { toast } from "@/components/ui/Toaster";
import { saveSoundPreferences, loadSoundPreferences } from "@/lib/persistence";

const totalXp = 12450;
const { level, currentXp, nextLevelXp } = getLevelFromXp(totalXp);

const skillStats = [
  { name: "Mathematics", level: 18, progress: 78, xp: 3200, color: "#6366f1" },
  { name: "Physics", level: 14, progress: 65, xp: 2100, color: "#f59e0b" },
  { name: "Computer Science", level: 22, progress: 85, xp: 4800, color: "#8b5cf6" },
  { name: "Biology", level: 11, progress: 45, xp: 1350, color: "#06b6d4" },
  { name: "Literature", level: 8, progress: 30, xp: 1000, color: "#ec4899" },
];

const activityTimeline = [
  { date: "Today", events: [
    { time: "10:30 AM", text: "Completed Calculus quiz", xp: 150, type: "quiz" },
    { time: "09:00 AM", text: "Started Physics focus session", xp: 0, type: "focus" },
    { time: "08:00 AM", text: "Daily streak maintained", xp: 50, type: "streak" },
  ]},
  { date: "Yesterday", events: [
    { time: "04:00 PM", text: "Earned Week Warrior achievement", xp: 250, type: "achievement" },
    { time: "02:00 PM", text: "Completed 3 focus sessions", xp: 0, type: "focus" },
    { time: "11:00 AM", text: "Joined Code Masters study group", xp: 75, type: "social" },
  ]},
  { date: "2 days ago", events: [
    { time: "08:30 PM", text: "Finished Biology lab report", xp: 200, type: "quiz" },
    { time: "03:00 PM", text: "2-hour deep focus session", xp: 0, type: "focus" },
  ]},
];

const unlockedAchievements = [
  { name: "First Sprint", icon: "🚀", date: "Jan 2025" },
  { name: "Triple Threat", icon: "🔥", date: "Jan 2025" },
  { name: "Week Warrior", icon: "🏆", date: "Feb 2025" },
  { name: "Century Club", icon: "💯", date: "Mar 2025" },
  { name: "Deep Focus", icon: "🎯", date: "Mar 2025" },
  { name: "Quiz Master", icon: "🧠", date: "Apr 2025" },
];

const profileStatTextClasses = {
  primary: "text-primary-400",
  accent: "text-accent-400",
  amber: "text-amber-400",
  rose: "text-rose-400",
  purple: "text-purple-400",
} as const;

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<"overview" | "activity" | "achievements" | "settings">("overview");
  const { playSound } = useSound();

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      {/* Profile Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-60" />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative group">
              <Avatar name="Alex K." size="2xl" glow />
              <button
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-surface-800 rounded-full flex items-center justify-center border-2 border-surface-900 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => {
                  playSound("click");
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = () => { playSound("success"); toast("📸 Profile photo updated successfully!", "success"); };
                  input.click();
                }}
              >
                <Camera className="w-4 h-4 text-surface-300" />
              </button>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-surface-100">Alex Kim</h1>
                <Badge variant="amber" size="md">
                  <Medal className="w-3 h-3" />
                  Level {level} — Sprint Master
                </Badge>
              </div>
              <p className="text-surface-400 flex items-center justify-center sm:justify-start gap-2 mb-3">
                <MapPin className="w-3.5 h-3.5" />
                Computer Science • Stanford University
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-surface-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  alex@studysprint.app
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined Jan 2025
                </span>
              </div>
            </div>

            <Button variant="secondary" size="md" onClick={() => { playSound("click"); setActiveSection("settings"); }}>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total XP", value: formatXp(totalXp), icon: Zap, color: "primary" },
              { label: "Study Hours", value: "376", icon: Clock, color: "accent" },
              { label: "Achievements", value: "12/50", icon: Award, color: "amber" },
              { label: "Best Streak", value: "21 days", icon: Flame, color: "rose" },
              { label: "Groups", value: "4", icon: Users, color: "purple" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={cn("w-4 h-4 mx-auto mb-1", profileStatTextClasses[stat.color as keyof typeof profileStatTextClasses])} />
                <p className="text-lg font-bold text-surface-200">{stat.value}</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 -mb-px overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "activity", label: "Activity", icon: Clock },
              { id: "achievements", label: "Achievements", icon: Trophy },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { playSound("click"); setActiveSection(tab.id as typeof activeSection); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all",
                  activeSection === tab.id
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
        {activeSection === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Level & XP */}
            <Card gradient>
              <CardHeader>
                <CardTitle>Level Progression</CardTitle>
                <Badge variant="amber" size="md">
                  <Star className="w-3 h-3" />
                  Level {level}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-surface-100">{formatXp(totalXp)} XP</p>
                    <p className="text-sm text-surface-400">{currentXp} / {nextLevelXp} XP to next level</p>
                  </div>
                </div>
                <ProgressBar value={currentXp} max={nextLevelXp} size="lg" showLabel />
              </CardContent>
            </Card>

            {/* Subject Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Levels</CardTitle>
                <span className="text-xs text-surface-500">By subject</span>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillStats.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-4">
                    <div
                      className="w-2 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: skill.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-surface-200">{skill.name}</span>
                          <span className="text-xs text-surface-500">Lv.{skill.level}</span>
                        </div>
                        <span className="text-xs text-surface-400">{skill.xp} XP</span>
                      </div>
                      <ProgressBar value={skill.progress} max={100} size="sm" color={skill.color} animated />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-400" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Focus Sessions", value: "156", icon: Brain },
                    { label: "Quizzes Taken", value: "89", icon: BookOpen },
                    { label: "Study Streak", value: "12 days", icon: Flame },
                    { label: "Avg. Session", value: "42 min", icon: Clock },
                    { label: "Groups Joined", value: "4", icon: Users },
                    { label: "Challenges Won", value: "12", icon: Target },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-light rounded-lg p-3 flex items-center gap-3">
                      <stat.icon className="w-4 h-4 text-primary-400 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-surface-200">{stat.value}</p>
                        <p className="text-[10px] text-surface-500">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => {
                  playSound("click");
                  toast("⚙️ Connected accounts settings — link GitHub, Google, Discord, and more.", "info");
                }}>Manage</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Github, name: "GitHub", connected: true, username: "@alexkim" },
                  { icon: Twitter, name: "Twitter", connected: true, username: "@alexkstudies" },
                  { icon: Users, name: "Discord", connected: false },
                ].map((account) => (
                  <div key={account.name} className="flex items-center justify-between p-3 glass-light rounded-lg">
                    <div className="flex items-center gap-3">
                      <account.icon className="w-4 h-4 text-surface-400" />
                      <div>
                        <p className="text-sm font-medium text-surface-200">{account.name}</p>
                        {account.connected && (
                          <p className="text-xs text-surface-500">{account.username}</p>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={account.connected ? "accent" : "surface"}
                      size="sm"
                    >
                      {account.connected ? "Connected" : "Connect"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === "activity" && (
          <div className="max-w-3xl mx-auto">
            {activityTimeline.map((day) => (
              <div key={day.date} className="mb-8">
                <h3 className="text-lg font-semibold text-surface-200 mb-4">{day.date}</h3>
                <div className="space-y-3 ml-4 border-l border-surface-800 pl-6">
                  {day.events.map((event, i) => (
                    <motion.div
                      key={event.time}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative"
                    >
                      <div className="absolute -left-8 top-2 w-3 h-3 rounded-full bg-surface-800 border-2 border-surface-700" />
                      <div className="glass-light rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-surface-200">{event.text}</p>
                            <p className="text-xs text-surface-500 mt-1">{event.time}</p>
                          </div>
                          {event.xp > 0 && (
                            <Badge variant="amber" size="sm">+{event.xp} XP</Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "achievements" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <motion.div
                key={achievement.name}
                whileHover={{ y: -2 }}
                className="glass-card rounded-xl p-5 text-center cursor-pointer"
                onClick={() => {
                  playSound("achievement");
                  toast(`🏆 ${achievement.name} — Unlocked ${achievement.date}`, "success");
                }}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="text-sm font-semibold text-surface-200 mb-1">{achievement.name}</h4>
                <p className="text-xs text-surface-500">Unlocked {achievement.date}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeSection === "settings" && (
          <SettingsPanel playSound={playSound} />
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ playSound }: { playSound: (type: SoundType) => void }) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [soundState, setSoundState] = useState(() => loadSoundPreferences().enabled);
  const [volumeState, setVolumeState] = useState(() => loadSoundPreferences().volume);
  const { theme, toggleTheme } = useTheme();

  const handleSoundToggle = () => {
    const newState = !soundState;
    setSoundState(newState);
    setSoundEnabled(newState);
    saveSoundPreferences({ enabled: newState, volume: volumeState });
    if (newState) playSound("click");
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolumeState(newVol);
    setSoundVolume(newVol);
    saveSoundPreferences({ enabled: soundState, volume: newVol });
    playSound("hover");
  };

  const sections = [
    { title: "Appearance", desc: "Customize theme and display", icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-surface-300">Dark Mode</span>
            </div>
            <button
              onClick={() => { playSound("click"); toggleTheme(); }}
              className={cn("w-10 h-5 rounded-full transition-colors relative", theme === "dark" ? "bg-primary-600" : "bg-surface-300")}
            >
              <div className={cn("w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm", theme === "dark" ? "translate-x-[22px]" : "translate-x-[2px]")} />
            </button>
          </div>
        </div>
      )
    },
    { title: "Sound & Audio", desc: "Configure sound effects and volume", icon: Volume2,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-300">Sound Effects</span>
            </div>
            <button
              onClick={handleSoundToggle}
              className={cn("w-10 h-5 rounded-full transition-colors relative", soundState ? "bg-primary-600" : "bg-surface-700")}
            >
              <div className={cn("w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all", soundState ? "translate-x-[22px]" : "translate-x-[2px]")} />
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-surface-400">Volume</span>
              <span className="text-xs text-surface-400">{Math.round(volumeState * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumeState}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-surface-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-400 [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>
        </div>
      )
    },
    {
      title: "Keyboard Shortcuts", desc: "View and customize keyboard shortcuts", icon: Keyboard,
      content: (
        <div className="space-y-2">
          <p className="text-sm text-surface-400 leading-relaxed mb-3">Press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono bg-surface-800 border border-surface-700 text-primary-300">?</kbd> anytime to view all shortcuts.</p>
          {[
            ["G then D", "Go to Dashboard"],
            ["G then F", "Go to Focus Room"],
            ["Space", "Play/Pause Focus Timer"],
            ["F", "Toggle Fullscreen"],
            ["M", "Toggle Sound"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-surface-400">{desc}</span>
              <kbd className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-800 border border-surface-700 text-primary-300">{key}</kbd>
            </div>
          ))}
        </div>
      )
    },
    { title: "Notifications", desc: "Manage your notification preferences", icon: Bell,
      content: "Push notifications for study reminders, achievements, and friend activity. Toggle email digests for weekly summaries."
    },
    { title: "Privacy", desc: "Control your data and visibility", icon: Shield,
      content: "Profile visibility: Public, Friends Only, or Private. Control what appears on leaderboards and friend feeds."
    },
    { title: "Study Preferences", desc: "Customize your study experience", icon: Settings,
      content: `Default focus duration: 25 min. Sound: ${soundState ? "enabled" : "disabled"}. Theme: ${theme === "dark" ? "Dark mode" : "Light mode"} (toggle in Appearance).`
    },
    { title: "Account", desc: "Manage your account settings", icon: User,
      content: "Email: alex@studysprint.app. Password: last changed 2 months ago. Delete account data."
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {sections.map((section) => {
        const expanded = expandedSections[section.title] || false;
        return (
          <div key={section.title}>
            <div
              className="glass-card rounded-xl p-5 flex items-center justify-between cursor-pointer group"
              onClick={() => {
                playSound("click");
                setExpandedSections((prev) => ({ ...prev, [section.title]: !prev[section.title] }));
              }}
            >
              <div className="flex items-center gap-4">
                <section.icon className="w-5 h-5 text-primary-400" />
                <div>
                  <h4 className="text-sm font-medium text-surface-200">{section.title}</h4>
                  <p className="text-xs text-surface-500">{section.desc}</p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-surface-600 group-hover:text-surface-400 transition-all",
                  expanded && "rotate-180"
                )}
              />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card rounded-xl p-5 mt-2 border border-surface-800/50">
                    {typeof section.content === "string" ? (
                      <p className="text-sm text-surface-400 leading-relaxed">{section.content}</p>
                    ) : (
                      section.content
                    )}
                    <div className="mt-4 flex items-center gap-3">
                      <Button variant="gradient" size="sm" onClick={() => {
                        playSound("success");
                        toast(`✅ ${section.title} updated!`, "success");
                      }}>
                        Save Changes
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        playSound("click");
                        setExpandedSections((prev) => ({ ...prev, [section.title]: false }));
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
