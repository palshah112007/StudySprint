import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Center | StudySprint",
  description:
    "Test your knowledge with AI-generated and built-in quizzes across Mathematics, Physics, Computer Science, Biology, and more. Earn XP and track your progress.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
