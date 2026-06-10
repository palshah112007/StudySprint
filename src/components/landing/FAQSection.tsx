"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const faqs = [
  {
    q: "How does StudySprint work?",
    a: "StudySprint combines AI-powered study tools, gamification, and focus techniques into one seamless experience. Start a focus session, earn XP, track your progress, and let AI help you study smarter. The more you study, the more you level up and unlock achievements.",
  },
  {
    q: "Is StudySprint free to use?",
    a: "Yes! We offer a generous free tier that includes basic focus timers, streak tracking, and limited analytics. Our Pro and Max plans unlock the full AI assistant, advanced analytics, unlimited sessions, and community features. All paid plans come with a 14-day free trial.",
  },
  {
    q: "Can I use StudySprint for any subject?",
    a: "Absolutely! StudySprint works for any academic subject, professional certification, or skill you're learning. Our AI adapts to your specific subjects and learning style, generating relevant quizzes, summaries, and study plans.",
  },
  {
    q: "How does the AI study assistant work?",
    a: "Our AI assistant analyzes your study patterns, identifies weak areas, and generates personalized content including quizzes, flashcards, summaries, and study plans. It uses advanced language models trained on educational content across all major subjects.",
  },
  {
    q: "Can I study with friends?",
    a: "Yes! Create or join study groups, compete in challenges, share resources, and study together in real-time focus rooms. You can also compare progress on leaderboards and motivate each other with group achievements.",
  },
  {
    q: "Is my data secure?",
    a: "Security is our top priority. All data is encrypted in transit and at rest. We never share your personal information or study data with third parties. You can export or delete your data at any time.",
  },
];

export function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <Badge variant="purple" size="md" className="mb-4">
            <Sparkles className="w-3 h-3" />
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-100 mb-4">
            Got Questions?{" "}
            <span className="gradient-text">We&rsquo;ve Got Answers</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-sm sm:text-base font-medium text-surface-200">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-surface-500 transition-transform duration-300 shrink-0 ml-4",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-surface-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
