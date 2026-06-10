import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | StudySprint",
  description:
    "Comprehensive study insights — monthly trends, subject performance, focus scores, quiz history, and AI-powered improvement recommendations.",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
