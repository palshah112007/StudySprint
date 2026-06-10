import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Focus Room | StudySprint",
  description:
    "Deep focus Pomodoro sessions with ambient soundscapes — Rain, Waves, Lofi, and Nature. Track your focus time with animated timers and visual ambiance.",
};

export default function FocusRoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
