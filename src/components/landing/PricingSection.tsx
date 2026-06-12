"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    desc: "Perfect for getting started with focused studying",
    price: 0,
    features: [
      "Basic focus timer",
      "Daily streak tracking",
      "Limited analytics",
      "3 study sessions/day",
      "Basic achievements",
    ],
    notIncluded: ["AI study assistant", "Advanced analytics", "Unlimited sessions", "Study groups"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    desc: "For serious students who want maximum productivity",
    price: 12,
    features: [
      "Everything in Starter",
      "AI study assistant",
      "Advanced analytics & insights",
      "Unlimited focus sessions",
      "Custom study plans",
      "Priority support",
      "All achievements & badges",
    ],
    notIncluded: [],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Max",
    desc: "For power users and study groups",
    price: 24,
    features: [
      "Everything in Pro",
      "Unlimited study groups",
      "Team challenges",
      "Custom skill trees",
      "API access",
      "Dedicated mentor",
      "Early access features",
      "Export all data",
    ],
    notIncluded: [],
    cta: "Start Free Trial",
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });
  const [annual, setAnnual] = useState(true);

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <Badge variant="primary" size="md" className="mb-4">
            <Sparkles className="w-3 h-3" />
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-100 mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Choose the plan that fits your study style. All plans include a 14-day
            free trial.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={cn("text-sm", !annual ? "text-surface-200" : "text-surface-500")}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors duration-300",
              annual ? "bg-primary-600" : "bg-surface-700"
            )}
          >
            <motion.div
              animate={{ x: annual ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
            />
          </button>
          <span className={cn("text-sm", annual ? "text-surface-200" : "text-surface-500")}>
            Annual
            <Badge variant="accent" size="sm" className="ml-2">
              Save 20%
            </Badge>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={cn(
                "glass-card rounded-2xl p-6 sm:p-8 relative flex flex-col",
                plan.popular && "border-primary-500/30 ring-1 ring-primary-500/20"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="primary" size="md" pulse className="px-4">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-surface-100 mb-1">{plan.name}</h3>
                <p className="text-sm text-surface-400">{plan.desc}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-4xl font-bold text-surface-100">
                    ${annual ? plan.price * 10 : plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-surface-500 text-sm">/month</span>
                  )}
                </div>
                {plan.price === 0 && (
                  <p className="text-xs text-surface-500 mt-1">Free forever</p>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-accent-400 mt-0.5 shrink-0" />
                    <span className="text-surface-300">{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm opacity-40">
                    <X className="w-4 h-4 text-surface-500 mt-0.5 shrink-0" />
                    <span className="text-surface-500">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                >
                  Get Started Free
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled
                >
                  Coming Soon
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
