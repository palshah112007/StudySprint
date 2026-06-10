"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Brain,
  FileText,
  ListChecks,
  Lightbulb,
  ChevronRight,
  Mic,
  Paperclip,
  Zap,
  BarChart3,
  Play,
  Trophy,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";
import {
  addGeneratedQuiz,
  loadGeneratedQuizzes,
  loadNotes,
} from "@/lib/persistence";
import {
  generateQuiz,
  generateQuizFromNotes,
  getAllSubjects,
  type GeneratedQuiz,
} from "@/lib/quiz-generator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  generatedQuiz?: GeneratedQuiz;
}

const suggestions = [
  { icon: Lightbulb, text: "Generate a quiz on Calculus" },
  { icon: BookOpen, text: "Generate a quiz from my notes" },
  { icon: Brain, text: "Create flashcards for Biology" },
  { icon: FileText, text: "Help me with my essay" },
  { icon: ListChecks, text: "Make a study schedule" },
  { icon: BarChart3, text: "Analyze my progress" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI study assistant. I can help you with quizzes, summaries, flashcards, assignments, and more. What would you like to work on today?\n\n💡 **Tip:** Say \"Generate a quiz on [subject]\" and I'll create real questions for you to practice!",
    timestamp: new Date(),
  },
];

const subjectKeywords: Record<string, string[]> = {
  Mathematics: ["math", "calculus", "algebra", "statistics", "geometry", "trigonometry", "probability", "linear algebra", "derivative", "integral"],
  Physics: ["physics", "mechanics", "quantum", "thermodynamics", "electromagnetism", "gravity", "energy", "velocity", "force"],
  "Computer Science": ["programming", "algorithms", "data structures", "database", "networking", "operating system", "coding", "software", "cs", "computer"],
  Biology: ["biology", "cell", "genetics", "ecology", "evolution", "dna", "anatomy", "physiology", "organism"],
  Chemistry: ["chemistry", "organic", "inorganic", "biochemistry", "reaction", "molecule", "atom", "bond", "element"],
  Literature: ["literature", "shakespeare", "poetry", "novel", "essay", "literary", "author", "book", "writing"],
  History: ["history", "ancient", "world war", "revolution", "civilization", "empire", "culture", "historical"],
  Languages: ["spanish", "french", "german", "language", "grammar", "vocabulary", "translation"],
};

function detectSubject(input: string): string | null {
  const lower = input.toLowerCase();
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return subject;
    }
  }
  return null;
}

type Difficulty = "easy" | "medium" | "hard" | "mixed";

function detectQuizRequest(input: string): { isQuiz: boolean; subject: string | null; topic: string; fromNotes: boolean; difficulty: Difficulty } {
  const lower = input.toLowerCase();
  const quizWords = ["quiz", "test", "practice", "questions", "exam prep", "challenge"];
  const isQuiz = quizWords.some((w) => lower.includes(w));
  const fromNotes = lower.includes("from my notes") || lower.includes("from notes") || lower.includes("based on my notes") || lower.includes("based on notes");

  if (!isQuiz) return { isQuiz: false, subject: null, topic: "", fromNotes: false, difficulty: "mixed" };

  const subject = detectSubject(lower);

  // Detect specific topic
  let topic = "all";
  if (lower.includes("derivative")) topic = "Calculus: Derivatives";
  else if (lower.includes("integral")) topic = "Calculus: Integrals";
  else if (lower.includes("quantum")) topic = "Quantum Mechanics";
  else if (lower.includes("mechanics") && !lower.includes("quantum")) topic = "Classical Mechanics";
  else if (lower.includes("algorithm")) topic = "Algorithms & Data Structures";
  else if (lower.includes("cell")) topic = "Cell Biology";
  else if (lower.includes("genetic")) topic = "Genetics";
  else if (lower.includes("organic")) topic = "Organic Chemistry";
  else if (lower.includes("shakespeare")) topic = "Shakespeare Studies";
  else if (lower.includes("literary")) topic = "Literary Analysis";

  // Detect difficulty
  let difficulty: Difficulty = "mixed";
  if (lower.includes("easy") || lower.includes("basic") || lower.includes("beginner") || lower.includes("simple")) difficulty = "easy";
  else if (lower.includes("hard") || lower.includes("difficult") || lower.includes("advanced") || lower.includes("challenging")) difficulty = "hard";
  else if (lower.includes("medium") || lower.includes("intermediate") || lower.includes("moderate")) difficulty = "medium";

  return { isQuiz: true, subject, topic, fromNotes, difficulty };
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useSound();
  const [generatedQuizzes, setGeneratedQuizzes] = useState<GeneratedQuiz[]>([]);

  useEffect(() => {
    setGeneratedQuizzes(loadGeneratedQuizzes());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (content: string) => {
    if (!content.trim() || isTyping) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    playSound("messageSent");

    // Check if user wants a quiz
    const { isQuiz, subject, topic, fromNotes, difficulty } = detectQuizRequest(content);

    setTimeout(() => {
      let response = "";
      let generatedQuiz: GeneratedQuiz | undefined;

      if (isQuiz) {
        if (fromNotes) {
          // Generate quiz from user's notes
          const notes = loadNotes();
          if (notes.length === 0) {
            response = "📝 You don't have any notes yet! Create some notes first, then I can generate a quiz based on their content.\n\n💡 **Tip:** Go to the Notes page to create study notes, then come back and say \"Generate a quiz from my notes\"!";
          } else {
            // Combine all note content
            const allContent = notes.map((n) => n.content).join(" ");
            // Detect subject from notes or use the most common one
            const subjectCounts: Record<string, number> = {};
            notes.forEach((n) => { subjectCounts[n.subject] = (subjectCounts[n.subject] || 0) + 1; });
            const topSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";
            const detectedSubject = subject || topSubject;

            // Generate questions from note content
            const questions = generateQuizFromNotes(allContent, detectedSubject, 10);
            if (questions.length > 0) {
              const quiz: GeneratedQuiz = {
                id: `notes-quiz-${Date.now()}`,
                name: `${detectedSubject} Quiz from Notes`,
                subject: detectedSubject,
                icon: "📝",
                questions,
                difficulty: "medium",
                estimatedTime: Math.ceil(questions.length * 1.5),
                xpReward: questions.length * 15,
                generatedAt: new Date().toISOString(),
                aiGenerated: true,
              };
              generatedQuiz = quiz;
              addGeneratedQuiz(quiz);
              setGeneratedQuizzes(loadGeneratedQuizzes());
              response = `🎉 I've analyzed your **${notes.length} notes** and generated a **${quiz.name}** with **${quiz.questions.length} questions**!\n\nThe questions are based on keywords and topics found in your notes. You can start the quiz right from here or find it in the Quiz Center.\n\nGood luck! 🚀`;
              playSound("achievement");
              toast(`🧠 Quiz generated from notes: ${quiz.name}`, "success");
            } else {
              response = "I couldn't generate questions from your notes. Try adding more detailed notes with specific topics, terms, or concepts.\n\n💡 **Tip:** Include key terms, definitions, and formulas in your notes for better quiz generation!";
            }
          }
        } else if (subject) {
          // Generate a real quiz from question bank
          const quiz = generateQuiz(subject, topic, difficulty, 10);
          if (quiz) {
            generatedQuiz = quiz;
            addGeneratedQuiz(quiz);
            setGeneratedQuizzes(loadGeneratedQuizzes());
            const diffLabel = difficulty === "mixed" ? "mixed difficulty" : difficulty;
            response = `🎉 I've generated a **${quiz.name}** quiz with **${quiz.questions.length} questions** covering ${subject} at **${diffLabel}** level!\n\nThe quiz includes detailed explanations for each answer. You can start the quiz right from here or find it in the Quiz Center.\n\nGood luck! 🚀`;
            playSound("achievement");
            toast(`🧠 Quiz generated: ${quiz.name}`, "success");
          } else {
            response = `I couldn't find specific questions for "${topic}" in ${subject}. Try asking for a general ${subject} quiz, or specify a different topic like "Calculus", "Quantum Mechanics", or "Cell Biology".`;
          }
        } else {
          // Ask user to specify a subject
          const subjects = getAllSubjects();
          response = `I'd love to generate a quiz for you! Which subject would you like?\n\n${subjects.map((s) => `• **${s}**`).join("\n")}\n\nJust say "Generate a quiz on [subject]" and I'll create real questions for you!`;
        }
      } else {
        // Regular AI responses
        const responses: Record<string, string> = {
          summarize: "I've analyzed your notes and created a comprehensive summary with key concepts, formulas, and important definitions. The main topics covered are: differentiation rules, integration techniques, and limit theorems.\n\n💡 **Tip:** Say \"Generate a quiz on [subject]\" to test your understanding!",
          flashcard: "I've created 15 flashcards from your Biology materials covering cellular respiration, photosynthesis, and DNA replication. Each card includes key terms, definitions, and memory aids.\n\n💡 **Tip:** Say \"Generate a quiz on Biology\" to test your knowledge!",
          essay: "I can help structure your essay. Let's start with an outline:\n\n1. **Introduction** — Strong hook + thesis statement\n2. **Body Paragraph 1** — First main point with evidence\n3. **Body Paragraph 2** — Second main point with evidence\n4. **Body Paragraph 3** — Counterargument & rebuttal\n5. **Conclusion** — Restate thesis + final thoughts\n\n💡 **Tip:** Say \"Generate a quiz on Literature\" to improve your analytical skills!",
          schedule: "Based on your upcoming deadlines and study patterns, here's an optimized study schedule:\n\n📅 **Monday:** Mathematics (2h) + Physics (1h)\n📅 **Tuesday:** Computer Science (3h)\n📅 **Wednesday:** Biology (2h) + Chemistry (1h)\n📅 **Thursday:** Review day — Flashcards\n📅 **Friday:** Practice quizzes on weak areas\n📅 **Weekend:** Deep focus sessions +休息\n\n💡 **Tip:** Say \"Generate a quiz on [subject]\" for each study day!",
          progress: "Your analytics show strong progress in Mathematics (78%) and Computer Science (85%). Physics (65%) needs attention.\n\n📊 **Recommendations:**\n• 3 additional Physics sessions this week\n• Focus on Quantum Mechanics and Thermodynamics\n• Daily flashcard review for Biology\n\n💡 **Tip:** Say \"Generate a quiz on Physics\" to practice your weak areas!",
        };

        response = "I'll help you with that! Let me analyze your request and provide the best assistance.\n\n💡 **Pro tip:** Say \"Generate a quiz on [subject]\" to create real practice questions for any subject!";
        for (const [key, value] of Object.entries(responses)) {
          if (content.toLowerCase().includes(key)) {
            response = value;
            break;
          }
        }
      }

      const aiMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        generatedQuiz,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      playSound("messageReceived");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-100">AI Study Assistant</h1>
              <p className="text-sm text-surface-400">
                Generate real quizzes, summaries, and study plans
              </p>
            </div>
            <Badge variant="primary" size="md" pulse className="ml-auto">
              <Sparkles className="w-3 h-3" />
              Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Chat area */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[500px]">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        msg.role === "user"
                          ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-tr-md"
                          : "glass-light rounded-tl-md"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      {/* Generated Quiz Card */}
                      {msg.generatedQuiz && (
                        <div className="mt-3 p-3 bg-surface-900/50 rounded-xl border border-primary-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{msg.generatedQuiz.icon}</span>
                            <div>
                              <p className="text-xs font-semibold text-surface-200">
                                {msg.generatedQuiz.name}
                              </p>
                              <p className="text-[10px] text-surface-500">
                                {msg.generatedQuiz.questions.length} questions • {msg.generatedQuiz.estimatedTime} min • +{msg.generatedQuiz.xpReward} XP
                              </p>
                            </div>
                          </div>
                          <Link href="/quiz">
                            <Button
                              variant="gradient"
                              size="sm"
                              className="w-full"
                              glow
                              onClick={() => playSound("click")}
                            >
                              <Play className="w-3.5 h-3.5" />
                              Start Quiz
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <Avatar name="Alex K." size="sm" />
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="glass-light rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 bg-primary-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-surface-800/50 p-4">
                <div className="flex items-center gap-3">
                  <button
                    className="text-surface-500 hover:text-surface-300 transition-colors"
                    onClick={() => {
                      playSound("click");
                      toast("📎 File upload ready! Drop your notes, PDFs, or images and I'll analyze them.", "info");
                    }}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                      placeholder="Ask anything about your studies..."
                      className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all"
                    />
                  </div>
                  <button
                    className={cn(
                      "transition-colors",
                      isRecording ? "text-red-400" : "text-surface-500 hover:text-surface-300"
                    )}
                    onClick={() => {
                      if (!isRecording) {
                        playSound("click");
                        setIsRecording(true);
                        toast("🎤 Listening... Speak your question clearly.", "info");
                        setTimeout(() => {
                          setIsRecording(false);
                          const demoQuestions = ["Generate a quiz on Calculus", "Help with my math homework", "Create a study plan"];
                          const q = demoQuestions[Math.floor(Math.random() * demoQuestions.length)];
                          setInput(q);
                          toast(`🎤 Transcribed: "${q}"`, "success");
                        }, 3000);
                      } else {
                        setIsRecording(false);
                      }
                    }}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <Button
                    variant="gradient"
                    size="sm"
                    glow
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Suggestions */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.text}
                      onClick={() => { playSound("click"); handleSend(s.text); }}
                      className="w-full glass-light rounded-lg px-3 py-2.5 flex items-center gap-3 text-left cursor-pointer hover:bg-surface-700/30 transition-all group"
                    >
                      <s.icon className="w-4 h-4 text-primary-400 shrink-0" />
                      <span className="text-xs text-surface-300 flex-1">{s.text}</span>
                      <ChevronRight className="w-3 h-3 text-surface-600 group-hover:text-surface-400 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generated Quizzes */}
            {generatedQuizzes.length > 0 && (
              <Card>
                <CardContent>
                  <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary-400" />
                    Your Generated Quizzes
                  </h3>
                  <div className="space-y-2">
                    {generatedQuizzes.slice(-5).reverse().map((quiz) => (
                      <Link key={quiz.id} href="/quiz">
                        <div className="glass-light rounded-lg p-3 cursor-pointer hover:bg-surface-700/30 transition-all">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{quiz.icon}</span>
                            <span className="text-xs font-medium text-surface-200 truncate flex-1">{quiz.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-surface-500">
                            <span>{quiz.questions.length} questions</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Trophy className="w-2.5 h-2.5 text-amber-400" />
                              +{quiz.xpReward} XP
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Subjects */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent-400" />
                  Quiz Subjects
                </h3>
                <div className="space-y-1.5">
                  {getAllSubjects().map((subject) => (
                    <button
                      key={subject}
                      onClick={() => { playSound("click"); handleSend(`Generate a quiz on ${subject}`); }}
                      className="w-full glass-light rounded-lg px-3 py-2 flex items-center gap-2 text-left cursor-pointer hover:bg-surface-700/30 transition-all group"
                    >
                      <span className="text-xs text-surface-300 flex-1">{subject}</span>
                      <ChevronRight className="w-3 h-3 text-surface-600 group-hover:text-surface-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-4">Today&apos;s Usage</h3>
                <div className="space-y-3">
                  {[
                    { label: "Queries Used", value: "12/50", progress: 24 },
                    { label: "Quizzes Generated", value: generatedQuizzes.length.toString(), progress: Math.min(generatedQuizzes.length * 10, 100) },
                    { label: "Notes Summarized", value: "2", progress: 20 },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-surface-400">{stat.label}</span>
                        <span className="text-surface-300 font-medium">{stat.value}</span>
                      </div>
                      <div className="w-full h-1 bg-surface-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="border-amber-500/20">
              <CardContent>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-surface-200 mb-1">Pro Tip</p>
                    <p className="text-xs text-surface-400 leading-relaxed">
                      Say &ldquo;Generate a quiz on [subject]&rdquo; to create real practice questions! Add difficulty like &ldquo;easy&rdquo;, &ldquo;hard&rdquo;, or &ldquo;mixed&rdquo;. Try subjects like Mathematics, Physics, Computer Science, Biology, Chemistry, Literature, History, or Languages.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
