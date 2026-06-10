import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashcards | StudySprint",
  description:
    "Spaced repetition flashcards for better retention. Study pre-made decks or create your own with AI-generated cards from your notes.",
};

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
