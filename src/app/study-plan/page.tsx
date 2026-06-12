"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Target, Calendar, Clock, CheckCircle2, Map } from "lucide-react";

const examOptions = [
  { value: "jee", label: "JEE Main/Advanced" },
  { value: "neet", label: "NEET" },
  { value: "gate", label: "GATE" },
  { value: "college", label: "College Exams" },
  { value: "self", label: "Self Learning" },
];

export default function StudyPlanPage() {
  const [exam, setExam] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{ weekly_plan: any[]; today: any; weeks: any[] } | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "weekly" | "timeline">("today");

  const generatePlan = async () => {
    setLoading(true);
    const subjects = ["Mathematics", "Physics", "Chemistry"];
    
    const mockPlan = {
      weekly_plan: Array.from({ length: 12 }, (_, i) => ({
        week: i + 1,
        focus: i < 4 ? "Foundation building" : i < 8 ? "Advanced concepts" : "Revision & practice",
        daily_breakdown: {
          "Mathematics": { hours: 2, topics: [i < 4 ? "Algebra & Calculus" : "Integration & Vectors"] },
          "Physics": { hours: 1.5, topics: [i < 4 ? "Mechanics" : "Electromagnetism"] },
          "Chemistry": { hours: 1.5, topics: [i < 4 ? "Physical Chemistry" : "Organic Chemistry"] },
        }
      })),
      today: {
        "Mathematics": { hours: 2, topics: ["Differentiation - Chain Rule", "Integration basics"] },
        "Physics": { hours: 1.5, topics: ["Newton's Laws revision", "Work-Energy problems"] },
        "Chemistry": { hours: 1.5, topics: ["Mole Concept practice", "Atomic Structure"] },
      },
      weeks: Array.from({ length: 12 }, (_, i) => 
        `Week ${i + 1} (${new Date(Date.now() + i * 7 * 86400000).toLocaleDateString()}): ${i < 4 ? "Foundation" : i < 8 ? "Advanced" : "Revision"}`
      ),
    };

    setTimeout(() => {
      setPlan(mockPlan as any);
      setLoading(false);
    }, 1500);
  };

  // Show setup form if no plan
  if (!plan && !loading) {
    return (
      <div className="min-h-screen bg-surface-950 pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <Card gradient className="text-center">
            <CardContent className="space-y-6 p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto">
                <Map className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-100 mb-2">AI Study Plan Generator</h1>
                <p className="text-surface-400">Create a personalized study plan tailored to your goals</p>
              </div>
              <div className="text-left space-y-4">
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Exam Type</label>
                  <select
                    value={exam}
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-surface-100"
                  >
                    <option value="">Select exam type...</option>
                    {examOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Exam Date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700 text-surface-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Hours per day: {hoursPerDay}h</label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-surface-500 mt-1">
                    <span>1h</span><span>10h</span>
                  </div>
                </div>
              </div>
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={generatePlan}
                disabled={!exam || !examDate}
              >
                Generate My Study Plan ✨
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 pt-16 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Map className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl font-semibold text-surface-100 animate-pulse">Generating your personalized plan...</p>
          <p className="text-surface-500 text-sm">Creating optimal study schedule based on your goals</p>
        </div>
      </div>
    );
  }

  // Show plan
  return (
    <div className="min-h-screen bg-surface-950 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
              <Map className="w-6 h-6 text-primary-400" />
              Your Study Plan
            </h1>
            <p className="text-surface-400 text-sm">{hoursPerDay}h/day • {exam} • {examDate}</p>
          </div>
          <Button variant="outline" onClick={() => { setPlan(null); setLoading(false); }}>
            Regenerate
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-surface-800 pb-2">
          {(["today", "weekly", "timeline"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                activeTab === tab
                  ? "bg-primary-500/10 text-primary-300 border border-primary-500/20"
                  : "text-surface-400 hover:text-surface-200"
              )}
            >
              {tab === "today" && <Target className="w-4 h-4 inline mr-1" />}
              {tab === "weekly" && <Calendar className="w-4 h-4 inline mr-1" />}
              {tab === "timeline" && <Clock className="w-4 h-4 inline mr-1" />}
              {tab === "today" ? "Today's Goals" : tab === "weekly" ? "Weekly View" : "Full Timeline"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {activeTab === "today" && plan?.today && (
              <>
                {Object.entries(plan.today).map(([subject, data]: [string, any]) => (
                  <Card key={subject}>
                    <CardContent className="flex items-start gap-4 p-4">
                      <CheckCircle2 className="w-5 h-5 text-primary-400 mt-1 shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-surface-200">{subject} — {data.hours}h</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {data.topics.map((t: string, i: number) => (
                            <span key={i} className="text-xs bg-surface-800 text-surface-300 px-2 py-1 rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {activeTab === "weekly" && plan?.weekly_plan && (
              <div className="grid grid-cols-7 gap-2">
                {plan.weekly_plan.slice(0, 7).map((week: any, i: number) => (
                  <Card key={i} className="!rounded-xl !p-3">
                    <p className="text-xs font-bold text-surface-400 mb-1">Week {week.week}</p>
                    <p className="text-[10px] text-surface-500 leading-tight">{week.focus}</p>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "timeline" && plan?.weeks && (
              <div className="space-y-2">
                {plan.weeks.map((week: string, i: number) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <p className="text-sm text-surface-200">{week}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}