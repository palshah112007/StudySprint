import type { Metadata } from "next";
import { DashboardAuth } from "./auth-guard";

export const metadata: Metadata = {
  title: "Dashboard | StudySprint",
  description:
    "Your personalized study dashboard — track XP, streaks, weekly activity, subject progress, and get AI-powered study recommendations.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardAuth>{children}</DashboardAuth>;
}
