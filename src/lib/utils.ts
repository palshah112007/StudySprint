import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Rocket,
  Flame,
  Award,
  Trophy,
  Crown,
  Brain,
  Target,
  Users,
  Medal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXp(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getLevelFromXp(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentXp = xp - 100 * Math.pow(level - 1, 2);
  const nextLevelXp = 100 * Math.pow(level, 2) - 100 * Math.pow(level - 1, 2);
  return { level, currentXp, nextLevelXp };
}

export function getProgressPercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

export const subjects = [
  { name: "Mathematics", color: "#6366f1", icon: "Sigma" },
  { name: "Physics", color: "#f59e0b", icon: "Atom" },
  { name: "Chemistry", color: "#10b981", icon: "FlaskConical" },
  { name: "Biology", color: "#06b6d4", icon: "Leaf" },
  { name: "Computer Science", color: "#8b5cf6", icon: "Monitor" },
  { name: "Literature", color: "#ec4899", icon: "BookOpen" },
  { name: "History", color: "#f97316", icon: "Landmark" },
  { name: "Languages", color: "#14b8a6", icon: "Languages" },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  xp: number;
}

export const achievements: Achievement[] = [
  { id: "first_study", name: "First Sprint", description: "Complete your first study session", icon: Rocket, xp: 50 },
  { id: "streak_3", name: "Triple Threat", description: "3-day study streak", icon: Flame, xp: 100 },
  { id: "streak_7", name: "Week Warrior", description: "7-day study streak", icon: Flame, xp: 250 },
  { id: "streak_30", name: "Monthly Master", description: "30-day study streak", icon: Award, xp: 1000 },
  { id: "xp_1000", name: "Century Club", description: "Earn 1,000 XP", icon: Trophy, xp: 200 },
  { id: "xp_10000", name: "XP Legend", description: "Earn 10,000 XP", icon: Crown, xp: 2000 },
  { id: "quiz_master", name: "Quiz Master", description: "Complete 10 quizzes", icon: Brain, xp: 300 },
  { id: "focus_10", name: "Deep Focus", description: "Complete 10 focus sessions", icon: Target, xp: 150 },
  { id: "group_join", name: "Community Member", description: "Join a study group", icon: Users, xp: 75 },
  { id: "challenge_win", name: "Champion", description: "Win a group challenge", icon: Medal, xp: 500 },
];

export const dailyMissions = [
  { id: "m1", name: "Complete 3 focus sessions", xp: 100, progress: 2, total: 3 },
  { id: "m2", name: "Study for 2 hours total", xp: 150, progress: 75, total: 120 },
  { id: "m3", name: "Answer 5 quiz questions", xp: 80, progress: 3, total: 5 },
];

export const weeklyChallenges = [
  { id: "w1", name: "7-day streak", xp: 500, progress: 4, total: 7, deadline: "2 days left" },
  { id: "w2", name: "Study 15 hours", xp: 750, progress: 9, total: 15, deadline: "4 days left" },
  { id: "w3", name: "Complete 20 quizzes", xp: 1000, progress: 8, total: 20, deadline: "5 days left" },
];
