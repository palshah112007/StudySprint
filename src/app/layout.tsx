import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from "@/components/ui/Toaster";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import { ClientInit } from "@/components/ui/ClientInit";
import { ThemeProvider } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studysprint.app"),
  title: {
    default: "StudySprint - AI-Powered Gamified Study OS",
    template: "%s | StudySprint",
  },
  description:
    "StudySprint is a premium AI-powered gamified study operating system for focus sessions, adaptive quizzes, analytics, community, and academic momentum.",
  keywords: [
    "StudySprint",
    "AI study",
    "gamified learning",
    "Pomodoro",
    "study tracker",
    "productivity",
  ],
  applicationName: "StudySprint",
  authors: [{ name: "StudySprint" }],
  creator: "StudySprint",
  publisher: "StudySprint",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "StudySprint - AI-Powered Gamified Study OS",
    description:
      "Supercharge your learning with AI-powered study tools, gamification, and deep focus sessions.",
    type: "website",
    siteName: "StudySprint",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudySprint - AI-Powered Gamified Study OS",
    description:
      "Focus, learn, compete, and improve with an AI study operating system built for ambitious students.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('studysprint_theme');if(t&&JSON.parse(t)==='light')document.documentElement.classList.add('light')}catch(e){}` }} />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-surface-950 text-surface-100 antialiased`}
      >
        <ThemeProvider>
          <ClientInit />
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Toaster />
          <KeyboardShortcuts />
        </ThemeProvider>
      </body>
    </html>
  );
}
