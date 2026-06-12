"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science, Stanford",
    avatar: "SC",
    content:
      "StudySprint completely transformed my study habits. The gamification system makes me actually look forward to studying. My GPA went from 3.2 to 3.8 in one semester.",
    rating: 5,
    xp: "24,500 XP",
    level: "Grandmaster",
  },
  {
    name: "Marcus Johnson",
    role: "Pre-Med, Johns Hopkins",
    avatar: "MJ",
    content:
      "The AI study assistant is incredible. It generated personalized quizzes that perfectly matched my weak areas. The focus room helped me maintain 6+ hours of deep work daily.",
    rating: 5,
    xp: "18,200 XP",
    level: "Diamond",
  },
  {
    name: "Emily Rodriguez",
    role: "Engineering, MIT",
    avatar: "ER",
    content:
      "I've tried every study app out there. StudySprint is the first one that truly understands how students learn. The analytics alone are worth it — I can see exactly where I need to improve.",
    rating: 5,
    xp: "31,800 XP",
    level: "Legend",
  },
  {
    name: "Alex Kim",
    role: "Business, Harvard",
    avatar: "AK",
    content:
      "The community features are game-changing. Being able to join study groups and compete with friends keeps me accountable. It's like having a study buddy system on steroids.",
    rating: 5,
    xp: "12,900 XP",
    level: "Platinum",
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <Badge variant="accent" size="md" className="mb-4">
            <Sparkles className="w-3 h-3" />
            Student Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-100 mb-4">
            Loved by{" "}
            <span className="gradient-text">Ambitious Students</span>
          </h2>
          <p className="text-lg text-surface-400 max-w-2xl mx-auto">
            Join thousands of students who have transformed their academic journey
            with StudySprint.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-2xl p-6 sm:p-8 relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-500/10" />
              
              <div className="flex items-start gap-4 mb-5">
                <Avatar
                  name={testimonial.name}
                  size="lg"
                  glow
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-surface-200">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-surface-500">{testimonial.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold gradient-text">
                    {testimonial.xp}
                  </p>
                  <p className="text-[10px] text-surface-500 uppercase">
                    {testimonial.level}
                  </p>
                </div>
              </div>

              <p className="text-surface-300 leading-relaxed text-sm sm:text-base italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
