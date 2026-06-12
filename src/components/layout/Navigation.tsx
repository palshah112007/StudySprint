"use client";

import { useState, useEffect, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Timer,
  Bot,
  Trophy,
  BarChart3,
  Users,
  User,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Brain,
  Layers,
  FileText,
  ListChecks,
  Sun,
  Moon,
} from "lucide-react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useSound, setSoundEnabled } from "@/lib/useSound";
import { loadSoundPreferences, saveSoundPreferences } from "@/lib/persistence";
import { useTheme } from "@/lib/theme";
import { hasValidClerkPublishableKey } from "@/lib/auth-config";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/focus-room", label: "Focus Room", icon: Timer },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/flashcards", label: "Flashcards", icon: Layers },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/gamification", label: "Gamification", icon: Trophy },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/social", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const clerkEnabled = hasValidClerkPublishableKey();
  const { playSound } = useSound();
  const { theme, toggleTheme } = useTheme();

  const isLanding = pathname === "/";

  // Navigate to Clerk sign-in when custom event fires from landing page
  useEffect(() => {
    const handleOpenAuth = (e: CustomEvent) => {
      const tab = e.detail?.tab || "signin";
      router.push(tab === "signin" ? "/sign-in" : "/sign-up");
    };
    window.addEventListener("studysprint-open-auth", handleOpenAuth as EventListener);
    return () => window.removeEventListener("studysprint-open-auth", handleOpenAuth as EventListener);
  }, [router]);

  // Load saved sound preference
  useEffect(() => {
    const prefs = loadSoundPreferences();
    startTransition(() => setSoundOn(prefs.enabled));
  }, []);

  // Track scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    saveSoundPreferences({ enabled: newState, volume: newState ? loadSoundPreferences().volume : 0 });
    if (newState) playSound("click");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || !isLanding
            ? "neural-glass shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
              onClick={() => isLanding && playSound("click")}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#00D9F5] rounded-lg flex items-center justify-center shadow-lg shadow-[#7C3AED]/25 group-hover:shadow-[#7C3AED]/40 transition-shadow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-100">
                Study<span className="gradient-text">Sprint</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
              {navLinks.map((link) => (                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all relative",
                      pathname === link.href
                        ? "text-[#A78BFA] border-l-2 border-[#7C3AED] pl-3"
                        : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 pl-3.5"
                    )}
                    onClick={() => playSound("click")}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => { playSound("click"); toggleTheme(); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 transition-all"
                title={soundOn ? "Mute sounds (M)" : "Enable sounds (M)"}
                aria-label={soundOn ? "Mute sounds" : "Enable sounds"}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {clerkEnabled ? (
                <ClerkAccountControls onAction={() => playSound("click")} />
              ) : (
                <Button
                  variant="gradient"
                  size="sm"
                  glow
                  className="hidden sm:flex"
                  onClick={() => {
                    playSound("click");
                    router.push("/dashboard");
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Button>
              )}

              {/* Mobile menu button */}
              <button
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-all"
                onClick={() => {
                  playSound("click");
                  setIsOpen(!isOpen);
                }}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-surface-800/50 bg-surface-950/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setIsOpen(false);
                      playSound("click");
                    }}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href
                        ? "text-surface-100 bg-primary-500/10"
                        : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 flex gap-2">
                  {clerkEnabled ? (
                    <ClerkAccountControls
                      mobile
                      onAction={() => {
                        playSound("click");
                        setIsOpen(false);
                      }}
                    />
                  ) : (
                    <Button
                      variant="gradient"
                      size="sm"
                      glow
                      className="flex-1"
                      onClick={() => {
                        playSound("click");
                        setIsOpen(false);
                        router.push("/dashboard");
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer for fixed nav */}
      {!isLanding && <div className="h-16" />}

    </>
  );
}

function ClerkAccountControls({
  mobile = false,
  onAction,
}: {
  mobile?: boolean;
  onAction: () => void;
}) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "w-8 h-8 rounded-xl border-2 border-primary-500/30",
            userButtonTrigger: "hover:opacity-80 transition-opacity",
            userButtonPopoverCard: "bg-surface-900 border border-surface-800 shadow-2xl shadow-black/20",
            userButtonPopoverActionButton: "text-surface-300 hover:bg-surface-800",
            userButtonPopoverActionButtonText: "text-surface-300",
            userButtonPopoverFooter: "hidden",
          },
        }}
      />
    );
  }

  return (
    <>
      <SignInButton mode="modal">
        <Button
          variant="ghost"
          size="sm"
          className={mobile ? "flex-1" : "hidden sm:flex"}
          onClick={onAction}
        >
          Sign In
        </Button>
      </SignInButton>

      <SignUpButton mode="modal">
        <Button
          variant="gradient"
          size="sm"
          glow
          className={mobile ? "flex-1" : "hidden sm:flex"}
          onClick={onAction}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Get Started
        </Button>
      </SignUpButton>
    </>
  );
}
