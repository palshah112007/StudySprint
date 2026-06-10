"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Github, Chrome, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
  preselectedPlan?: string;
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin", preselectedPlan }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    // Simulate auth
    await new Promise((r) => setTimeout(r, 1500));

    setIsSubmitting(false);

    // Show success
    const msg = tab === "signin" ? "Welcome back! Redirecting to your dashboard..." : "Account created! Welcome to StudySprint!";
    // Close modal — parent will handle navigation
    onClose();

    // Trigger a toast via custom event
    window.dispatchEvent(
      new CustomEvent("studysprint-toast", {
        detail: { message: msg, type: "success" },
      })
    );

    // Navigate to dashboard after auth
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      {/* Tabs */}
      <div className="flex mb-6 bg-surface-800/50 rounded-xl p-1">
        {(["signin", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); }}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
              tab === t
                ? "bg-surface-700 text-surface-200 shadow-sm"
                : "text-surface-500 hover:text-surface-400"
            )}
          >
            {t === "signin" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      {preselectedPlan && (
        <div className="mb-5 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">
            You&apos;re signing up for the <strong>{preselectedPlan}</strong> plan. 14-day free trial.
          </p>
        </div>
      )}

      {/* Social buttons */}
      <div className="flex gap-3 mb-5">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-800/50 hover:bg-surface-800 rounded-xl text-sm text-surface-300 transition-all border border-surface-700/50">
          <Github className="w-4 h-4" />
          GitHub
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-800/50 hover:bg-surface-800 rounded-xl text-sm text-surface-300 transition-all border border-surface-700/50">
          <Chrome className="w-4 h-4" />
          Google
        </button>
      </div>

      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface-950 px-3 text-surface-500">or continue with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "signup" && (
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Kim"
                className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-surface-400 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studysprint.app"
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-surface-400 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-rose-400 bg-rose-500/10 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          glow
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              {tab === "signin" ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              {tab === "signin" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      <p className="text-xs text-surface-500 text-center mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </Modal>
  );
}
