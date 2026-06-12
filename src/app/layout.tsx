import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Toaster } from "@/components/ui/Toaster";
import { KeyboardShortcuts } from "@/components/ui/KeyboardShortcuts";
import { XPToastListener } from "@/components/ui/XPToastListener";
import { ClientInit } from "@/components/ui/ClientInit";
import { ThemeProvider } from "@/lib/theme";
import { hasValidClerkPublishableKey } from "@/lib/auth-config";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050507",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://studysprint.vercel.app"),
  title: "StudySprint — AI-Powered Study OS",
  description:
    "Gamified study platform with AI quizzes, spaced repetition flashcards, Pomodoro focus sessions, and progress analytics.",
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
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "StudySprint — AI-Powered Study OS",
    description:
      "Gamified study platform with AI quizzes, spaced repetition flashcards, Pomodoro focus sessions, and progress analytics.",
    type: "website",
    siteName: "StudySprint",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudySprint — AI-Powered Study OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudySprint — AI-Powered Study OS",
    description:
      "Gamified study platform with AI quizzes, spaced repetition flashcards, Pomodoro focus sessions, and progress analytics.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = (
    <ThemeProvider>
      <ClientInit />
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Toaster />
      <KeyboardShortcuts />
      <XPToastListener />
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('studysprint_theme');if(t&&JSON.parse(t)==='light')document.documentElement.classList.add('light')}catch(e){}` }} />
      </head>
      <body
        className={`${inter.variable} ${geist.variable} ${jetbrainsMono.variable} font-sans bg-surface-950 text-surface-100 antialiased`}
      >
        {hasValidClerkPublishableKey() ? <ClerkProvider>{app}</ClerkProvider> : app}
      </body>
    </html>
  );
}
