"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const GOALS = [
  { id: "jee", label: "JEE Main / Advanced", icon: "🎯", color: "from-primary-500 to-purple-600" },
  { id: "neet", label: "NEET", icon: "🏥", color: "from-accent-500 to-emerald-600" },
  { id: "gate", label: "GATE", icon: "⚙️", color: "from-cyan-500 to-blue-600" },
  { id: "college", label: "College Exams", icon: "🎓", color: "from-purple-500 to-pink-600" },
  { id: "upsc", label: "UPSC / Civil Services", icon: "🏛️", color: "from-amber-500 to-orange-600" },
  { id: "self", label: "Self Learning", icon: "🚀", color: "from-rose-500 to-red-600" },
];

const ALL_SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
  "History", "Geography", "Economics", "English", "Hindi", "Aptitude", "Logical Reasoning"
];

const HOURS_OPTIONS = ["1-2 hrs", "3-4 hrs", "5-6 hrs", "7+ hrs"];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [goal, setGoal] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examDate, setExamDate] = useState<string>("");
  const [noFixedDate, setNoFixedDate] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const totalSteps = 5;

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, totalSteps - 1)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const canProceed = () => {
    switch (step) {
      case 0: return !!goal;
      case 1: return subjects.length >= 3;
      case 2: return noFixedDate || !!examDate;
      case 3: return !!hoursPerDay;
      default: return true;
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await fetch("/api/users/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          subjects,
          examDate: noFixedDate ? null : examDate,
          hoursPerDay: parseInt(hoursPerDay?.split("-")[0] || "3"),
        }),
      });
      setComplete(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setComplete(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  const toggleSubject = (s: string) => {
    setSubjects((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-all duration-500",
                i <= step ? "bg-primary-500" : "bg-surface-800"
              )}
            />
          ))}
        </div>
        <p className="text-surface-500 text-sm text-center mb-6">Step {step + 1} of {totalSteps}</p>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="glass-card rounded-2xl p-8 border border-surface-800/50"
          >
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-surface-100 text-center">What&rsquo;s your primary goal?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {GOALS.map((g) => (
                    <motion.button
                      key={g.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setGoal(g.id)}
                      className={cn(
                        "glass-card rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all",
                        goal === g.id ? "ring-2 ring-primary-500 bg-primary-500/10" : "hover:bg-surface-800/50"
                      )}
                    >
                      <span className="text-3xl">{g.icon}</span>
                      <span className="text-sm font-medium text-surface-200 text-center">{g.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-surface-100 text-center">Which subjects are you studying?</h2>
                <p className="text-surface-400 text-center text-sm">Pick 3-6 subjects</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {ALL_SUBJECTS.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSubject(s)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                        subjects.includes(s)
                          ? "bg-primary-500/20 border-primary-500 text-primary-300"
                          : "bg-surface-800/50 border-surface-700 text-surface-300 hover:border-surface-500"
                      )}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-surface-100 text-center">When is your exam?</h2>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => { setExamDate(e.target.value); setNoFixedDate(false); }}
                  disabled={noFixedDate}
                  className="w-full px-4 py-3 rounded-xl bg-surface-800 border border-surface-700 text-surface-100 disabled:opacity-50"
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noFixedDate}
                    onChange={(e) => setNoFixedDate(e.target.checked)}
                    className="w-4 h-4 accent-primary-500"
                  />
                  <span className="text-surface-300">I don&rsquo;t have a fixed date</span>
                </label>
                {goal === "jee" && !noFixedDate && (
                  <div className="flex gap-2">
                    {["JEE 2026", "JEE 2027"].map((y) => (
                      <button
                        key={y}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                          examDate?.includes("2026")
                            ? "bg-primary-500/20 border-primary-500 text-primary-300"
                            : "bg-surface-800/50 border-surface-700 text-surface-300"
                        )}
                        onClick={() => setExamDate(y === "JEE 2026" ? "2026-04-01" : "2027-04-01")}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-surface-100 text-center">How many hours can you study daily?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {HOURS_OPTIONS.map((h) => (
                    <motion.button
                      key={h}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setHoursPerDay(h)}
                      className={cn(
                        "glass-card rounded-xl p-6 text-center cursor-pointer transition-all",
                        hoursPerDay === h
                          ? "ring-2 ring-primary-500 bg-primary-500/10"
                          : "hover:bg-surface-800/50"
                      )}
                    >
                      <span className="text-lg font-bold text-surface-200">{h}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center">
                {complete ? (
                  <>
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-surface-100">Your plan is ready!</h2>
                    <p className="text-surface-400">Redirecting to your dashboard...</p>
                  </>
                ) : loading ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                    <h2 className="text-2xl font-bold text-surface-100">You&rsquo;re all set! 🚀</h2>
                    <p className="text-surface-400">Generating your personalized study plan...</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">🚀</div>
                    <h2 className="text-2xl font-bold text-surface-100">You&rsquo;re all set!</h2>
                    <p className="text-surface-400">Let&rsquo;s create your personalized study plan</p>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 0 || loading}
          >
            Back
          </Button>
          {step < totalSteps - 1 ? (
            <Button
              variant="gradient"
              onClick={goNext}
              disabled={!canProceed()}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="gradient"
              onClick={handleComplete}
              disabled={loading || complete}
              loading={loading}
            >
              {loading ? "Setting up..." : "Start Learning 🚀"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}