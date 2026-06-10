"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  Zap,
  Target,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame,
  Timer,
  Star,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";
import {
  saveQuizResult,
  loadQuizResults,
  loadGeneratedQuizzes,
  type QuizResult,
  type GeneratedQuiz as GeneratedQuizType,
} from "@/lib/persistence";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizSet {
  id: string;
  name: string;
  subject: string;
  icon: string;
  questionCount: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
  estimatedTime: number;
  xpReward: number;
}

const quizSets: QuizSet[] = [
  { id: "calc-deriv", name: "Calculus: Derivatives", subject: "Mathematics", icon: "📐", questionCount: 10, difficulty: "medium", estimatedTime: 15, xpReward: 150 },
  { id: "calc-integ", name: "Calculus: Integrals", subject: "Mathematics", icon: "📐", questionCount: 10, difficulty: "hard", estimatedTime: 20, xpReward: 200 },
  { id: "phys-quantum", name: "Quantum Mechanics", subject: "Physics", icon: "⚛️", questionCount: 10, difficulty: "hard", estimatedTime: 20, xpReward: 200 },
  { id: "phys-mechanics", name: "Classical Mechanics", subject: "Physics", icon: "⚡", questionCount: 10, difficulty: "medium", estimatedTime: 15, xpReward: 150 },
  { id: "cs-algo", name: "Algorithms & Data Structures", subject: "Computer Science", icon: "💻", questionCount: 10, difficulty: "medium", estimatedTime: 18, xpReward: 180 },
  { id: "cs-ds", name: "Data Structures", subject: "Computer Science", icon: "🗂️", questionCount: 10, difficulty: "easy", estimatedTime: 12, xpReward: 120 },
  { id: "bio-cell", name: "Cell Biology", subject: "Biology", icon: "🧬", questionCount: 10, difficulty: "medium", estimatedTime: 15, xpReward: 150 },
  { id: "bio-genetics", name: "Genetics", subject: "Biology", icon: "🧬", questionCount: 10, difficulty: "hard", estimatedTime: 20, xpReward: 200 },
  { id: "chem-organic", name: "Organic Chemistry", subject: "Chemistry", icon: "🧪", questionCount: 10, difficulty: "medium", estimatedTime: 15, xpReward: 150 },
  { id: "lit-analysis", name: "Literary Analysis", subject: "Literature", icon: "📖", questionCount: 10, difficulty: "easy", estimatedTime: 12, xpReward: 120 },
];

const questionBank: Record<string, Question[]> = {
  "calc-deriv": [
    { id: "q1", question: "What is the derivative of x²?", options: ["x", "2x", "2x²", "x³"], correctIndex: 1, explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x.", subject: "Mathematics", difficulty: "medium" },
    { id: "q2", question: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"], correctIndex: 0, explanation: "The derivative of sin(x) is cos(x).", subject: "Mathematics", difficulty: "easy" },
    { id: "q3", question: "What is d/dx(eˣ)?", options: ["x·eˣ", "eˣ", "eˣ⁺¹", "ln(eˣ)"], correctIndex: 1, explanation: "The derivative of eˣ is eˣ itself.", subject: "Mathematics", difficulty: "easy" },
    { id: "q4", question: "Using the chain rule, what is d/dx(sin(2x))?", options: ["cos(2x)", "2cos(2x)", "sin(2x)", "2sin(2x)"], correctIndex: 1, explanation: "Chain rule: d/dx[f(g(x))] = f'(g(x))·g'(x). So d/dx(sin(2x)) = cos(2x)·2 = 2cos(2x).", subject: "Mathematics", difficulty: "medium" },
    { id: "q5", question: "What is the derivative of ln(x)?", options: ["x", "1/x", "ln(x)/x", "1/x²"], correctIndex: 1, explanation: "d/dx(ln(x)) = 1/x.", subject: "Mathematics", difficulty: "easy" },
    { id: "q6", question: "What is the second derivative of x⁴?", options: ["4x³", "12x²", "12x", "4x²"], correctIndex: 1, explanation: "First derivative: 4x³. Second derivative: 12x².", subject: "Mathematics", difficulty: "medium" },
    { id: "q7", question: "What is d/dx(tan(x))?", options: ["sec(x)", "sec²(x)", "cot(x)", "cos²(x)"], correctIndex: 1, explanation: "d/dx(tan(x)) = sec²(x).", subject: "Mathematics", difficulty: "medium" },
    { id: "q8", question: "Using the product rule, what is d/dx(x·sin(x))?", options: ["sin(x)", "sin(x) + x·cos(x)", "x·cos(x)", "cos(x)"], correctIndex: 1, explanation: "Product rule: (fg)' = f'g + fg'. So d/dx(x·sin(x)) = 1·sin(x) + x·cos(x) = sin(x) + x·cos(x).", subject: "Mathematics", difficulty: "hard" },
    { id: "q9", question: "What is the derivative of x³ - 3x + 5?", options: ["3x² - 3", "3x² - 3x", "x² - 3", "3x - 3"], correctIndex: 0, explanation: "d/dx(x³ - 3x + 5) = 3x² - 3.", subject: "Mathematics", difficulty: "easy" },
    { id: "q10", question: "What is d/dx(e^(2x))?", options: ["2eˣ", "e^(2x)", "2e^(2x)", "e^(2x)/2"], correctIndex: 2, explanation: "Chain rule: d/dx(e^(2x)) = e^(2x)·2 = 2e^(2x).", subject: "Mathematics", difficulty: "medium" },
  ],
  "phys-quantum": [
    { id: "q1", question: "What does the Heisenberg Uncertainty Principle state?", options: ["Energy is conserved", "Position and momentum cannot both be precisely known", "Electrons orbit in fixed paths", "Light is both a wave and particle"], correctIndex: 1, explanation: "The Heisenberg Uncertainty Principle states that we cannot simultaneously know both the exact position and exact momentum of a particle.", subject: "Physics", difficulty: "medium" },
    { id: "q2", question: "What is Planck's constant approximately equal to?", options: ["6.626 × 10⁻³⁴ J·s", "3.0 × 10⁸ m/s", "1.6 × 10⁻¹⁹ C", "9.8 m/s²"], correctIndex: 0, explanation: "Planck's constant h ≈ 6.626 × 10⁻³⁴ J·s.", subject: "Physics", difficulty: "easy" },
    { id: "q3", question: "What is wave-particle duality?", options: ["Waves always have particles", "Light and matter exhibit both wave and particle properties", "Particles create waves when moving", "Waves destroy particles"], correctIndex: 1, explanation: "Wave-particle duality is the concept that quantum entities exhibit both wave-like and particle-like properties.", subject: "Physics", difficulty: "easy" },
    { id: "q4", question: "What does the Schrödinger equation describe?", options: ["Nuclear fusion", "Quantum state evolution over time", "Gravitational waves", "Electromagnetic radiation"], correctIndex: 1, explanation: "The Schrödinger equation describes how the quantum state of a system evolves over time.", subject: "Physics", difficulty: "medium" },
    { id: "q5", question: "What is quantum superposition?", options: ["Adding quantum states", "A system existing in multiple states simultaneously until measured", "Stacking quantum particles", "Measuring quantum properties"], correctIndex: 1, explanation: "Quantum superposition means a quantum system can exist in multiple states at once until it is measured.", subject: "Physics", difficulty: "medium" },
    { id: "q6", question: "What is quantum entanglement?", options: ["Particles spinning together", "Correlated quantum states regardless of distance", "Particles colliding", "Quantum particles merging"], correctIndex: 1, explanation: "Quantum entanglement is a phenomenon where two particles become correlated and the state of one instantly influences the other, regardless of distance.", subject: "Physics", difficulty: "hard" },
    { id: "q7", question: "What is the photoelectric effect?", options: ["Electricity from photos", "Electron emission from material when light hits it", "Light produced by electricity", "Reflection of light"], correctIndex: 1, explanation: "The photoelectric effect is the emission of electrons when electromagnetic radiation hits a material.", subject: "Physics", difficulty: "easy" },
    { id: "q8", question: "What is a photon?", options: ["A particle with mass", "A quantum of electromagnetic radiation", "An electron with energy", "A neutron"], correctIndex: 1, explanation: "A photon is a quantum of electromagnetic radiation — a massless particle that carries electromagnetic force.", subject: "Physics", difficulty: "easy" },
    { id: "q9", question: "What is quantum tunneling?", options: ["Tunneling through walls", "Particle passing through a classically forbidden energy barrier", "Creating tunnels in atoms", "Moving through black holes"], correctIndex: 1, explanation: "Quantum tunneling is the quantum mechanical phenomenon where a particle passes through a barrier that it classically could not surmount.", subject: "Physics", difficulty: "hard" },
    { id: "q10", question: "What is the Pauli Exclusion Principle?", options: ["No two fermions can occupy the same quantum state", "All particles spin the same way", "Energy is always conserved", "Protons cannot touch electrons"], correctIndex: 0, explanation: "The Pauli Exclusion Principle states that no two identical fermions can occupy the same quantum state simultaneously.", subject: "Physics", difficulty: "hard" },
  ],
  "cs-algo": [
    { id: "q1", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctIndex: 1, explanation: "Binary search halves the search space each step, giving O(log n) time complexity.", subject: "Computer Science", difficulty: "easy" },
    { id: "q2", question: "Which data structure uses LIFO ordering?", options: ["Queue", "Stack", "Array", "Linked List"], correctIndex: 1, explanation: "A stack uses Last In, First Out (LIFO) ordering.", subject: "Computer Science", difficulty: "easy" },
    { id: "q3", question: "What is the average time complexity of QuickSort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctIndex: 1, explanation: "QuickSort has an average time complexity of O(n log n).", subject: "Computer Science", difficulty: "medium" },
    { id: "q4", question: "What is a hash table's average lookup time?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 2, explanation: "Hash tables provide O(1) average-case time complexity for lookups.", subject: "Computer Science", difficulty: "easy" },
    { id: "q5", question: "Which algorithm is used for shortest path in a weighted graph?", options: ["BFS", "DFS", "Dijkstra's Algorithm", "Merge Sort"], correctIndex: 2, explanation: "Dijkstra's Algorithm finds the shortest path in a weighted graph with non-negative edge weights.", subject: "Computer Science", difficulty: "medium" },
    { id: "q6", question: "What is the space complexity of merge sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctIndex: 2, explanation: "Merge sort requires O(n) auxiliary space for the merging step.", subject: "Computer Science", difficulty: "medium" },
    { id: "q7", question: "What is dynamic programming?", options: ["Programming with variables", "Optimization by breaking problems into overlapping subproblems", "A type of loop", "Runtime code generation"], correctIndex: 1, explanation: "Dynamic programming solves complex problems by breaking them into overlapping subproblems and storing their solutions.", subject: "Computer Science", difficulty: "medium" },
    { id: "q8", question: "What is the height of a balanced BST with n nodes?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 1, explanation: "A balanced binary search tree has height O(log n).", subject: "Computer Science", difficulty: "medium" },
    { id: "q9", question: "Which sorting algorithm is stable?", options: ["QuickSort", "HeapSort", "MergeSort", "Selection Sort"], correctIndex: 2, explanation: "MergeSort is a stable sorting algorithm — it preserves the relative order of equal elements.", subject: "Computer Science", difficulty: "hard" },
    { id: "q10", question: "What is the Bellman-Ford algorithm used for?", options: ["Sorting", "Finding shortest paths (handles negative weights)", "Finding cycles", "Binary search"], correctIndex: 1, explanation: "Bellman-Ford finds shortest paths from a single source and can handle negative edge weights.", subject: "Computer Science", difficulty: "hard" },
  ],
};

function generateQuestions(quizId: string, aiQuizzes: GeneratedQuizType[]): Question[] {
  if (questionBank[quizId]) return questionBank[quizId];
  // Check AI-generated quizzes
  const aiQuiz = aiQuizzes.find((q) => q.id === quizId);
  if (aiQuiz) {
    return aiQuiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      subject: q.subject,
      difficulty: q.difficulty,
    }));
  }
  // Fallback to calculus derivatives
  const bank = questionBank["calc-deriv"];
  return bank.map((q, i) => ({
    ...q,
    id: `gen-${i}`,
    subject: quizSets.find((s) => s.id === quizId)?.subject || "General",
  }));
}

export default function QuizPage() {
  const [screen, setScreen] = useState<"select" | "quiz" | "results">("select");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useSound();
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [aiQuizzes, setAiQuizzes] = useState<GeneratedQuizType[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  useEffect(() => {
    setHistory(loadQuizResults());
    setAiQuizzes(loadGeneratedQuizzes());
  }, []);

  const startQuiz = useCallback((quiz: QuizSet) => {
    playSound("focusStart");
    const qs = generateQuestions(quiz.id, aiQuizzes);
    setQuestions(qs);
    setSelectedQuiz(quiz);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers(new Array(qs.length).fill(null));
    setTimeLeft(quiz.estimatedTime * 60);
    setQuizStartTime(Date.now());
    setScreen("quiz");
  }, [playSound, aiQuizzes]);

  useEffect(() => {
    if (screen === "quiz" && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [screen, timeLeft]);

  const finishQuiz = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    playSound("timerEnd");

    const correctCount = answers.filter((a, i) => a === questions[i].correctIndex).length;
    const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);
    const xpEarned = Math.round((correctCount / questions.length) * (selectedQuiz?.xpReward || 100));

    const isAiQuiz = aiQuizzes.some((q) => q.id === selectedQuiz?.id);
    const result: QuizResult = {
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split("T")[0],
      subject: selectedQuiz?.subject || "General",
      quizName: selectedQuiz?.name || "Unknown Quiz",
      difficulty: selectedQuiz?.difficulty || "mixed",
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      timeSpent,
      xpEarned,
      isAiGenerated: isAiQuiz,
    };

    saveQuizResult(result);
    setHistory((prev) => [...prev, result]);

    if (correctCount === questions.length) {
      playSound("achievement");
      toast("🎉 Perfect score! You're incredible!", "success");
    } else if (correctCount >= questions.length * 0.7) {
      playSound("success");
      toast(`Great job! ${correctCount}/${questions.length} correct!`, "success");
    } else {
      playSound("error");
      toast(`${correctCount}/${questions.length}. Keep practicing!`, "info");
    }

    setScreen("results");
  }, [answers, questions, selectedQuiz, quizStartTime, playSound, aiQuizzes]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    playSound("click");
    setSelectedAnswer(index);
    setShowExplanation(true);

    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);

    if (index === questions[currentQ].correctIndex) {
      playSound("quizCorrect");
    } else {
      playSound("quizIncorrect");
    }
  };

  const nextQuestion = () => {
    playSound("click");
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const score = screen === "results" ? answers.filter((a, i) => a === questions[i]?.correctIndex).length : 0;
  const total = questions.length || 1;

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">Quiz Center</h1>
              <p className="text-sm text-surface-400">Test your knowledge and earn XP</p>
            </div>
            {screen === "select" && (
              <div className="ml-auto flex items-center gap-3">
                <div className="glass-light rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-surface-200">{history.length} quizzes taken</span>
                </div>
              </div>
            )}
            {screen === "quiz" && selectedQuiz && (
              <div className="ml-auto flex items-center gap-3">
                <div className={cn(
                  "glass-light rounded-xl px-4 py-2.5 flex items-center gap-2",
                  timeLeft < 60 && "border-rose-500/30 ring-1 ring-rose-500/20"
                )}>
                  <Timer className={cn("w-4 h-4", timeLeft < 60 ? "text-rose-400" : "text-primary-400")} />
                  <span className={cn("text-sm font-bold tabular-nums", timeLeft < 60 ? "text-rose-400" : "text-surface-200")}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <Badge variant="primary" size="md">
                  {currentQ + 1} / {questions.length}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Quiz Selection */}
          {screen === "select" && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Quizzes", value: history.length.toString(), icon: Brain, color: "primary" },
                  { label: "Avg. Score", value: history.length > 0 ? `${Math.round(history.reduce((s, h) => s + (h.correctAnswers / h.totalQuestions) * 100, 0) / history.length)}%` : "—", icon: Target, color: "accent" },
                  { label: "Total XP Earned", value: history.reduce((s, h) => s + h.xpEarned, 0).toString(), icon: Zap, color: "amber" },
                  { label: "Best Streak", value: "5", icon: Flame, color: "rose" },
                ].map((stat) => (
                  <Card key={stat.label} hover={false}>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          stat.color === "primary" && "bg-primary-500/10",
                          stat.color === "accent" && "bg-accent-500/10",
                          stat.color === "amber" && "bg-amber-500/10",
                          stat.color === "rose" && "bg-rose-500/10"
                        )}>
                          <stat.icon className={cn(
                            "w-5 h-5",
                            stat.color === "primary" && "text-primary-400",
                            stat.color === "accent" && "text-accent-400",
                            stat.color === "amber" && "text-amber-400",
                            stat.color === "rose" && "text-rose-400"
                          )} />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-surface-100">{stat.value}</p>
                          <p className="text-[10px] text-surface-500 uppercase">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI-Generated Quizzes */}
              {aiQuizzes.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-surface-200 mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-accent-400" />
                    AI-Generated Quizzes
                    <Badge variant="accent" size="sm">New</Badge>
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aiQuizzes.slice(-6).reverse().filter((q) => difficultyFilter === "all" || q.difficulty === difficultyFilter).map((quiz) => (
                      <motion.div
                        key={quiz.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="cursor-pointer border-accent-500/20"
                          onClick={() => startQuiz({
                            id: quiz.id,
                            name: quiz.name,
                            subject: quiz.subject,
                            icon: quiz.icon,
                            questionCount: quiz.questions.length,
                            difficulty: quiz.difficulty,
                            estimatedTime: quiz.estimatedTime,
                            xpReward: quiz.xpReward,
                          })}
                        >
                          <CardContent>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{quiz.icon}</span>
                                <div>
                                  <p className="text-sm font-semibold text-surface-200">{quiz.name}</p>
                                  <p className="text-xs text-surface-500">{quiz.subject}</p>
                                </div>
                              </div>
                              <Badge variant="accent" size="sm">AI</Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-surface-500 mb-3">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {quiz.questions.length} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                ~{quiz.estimatedTime} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-400" />
                                +{quiz.xpReward} XP
                              </span>
                            </div>
                            <Button variant="gradient" size="sm" className="w-full" glow>
                              Start Quiz
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Built-in Quiz Sets */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  Available Quizzes
                </h2>
                <div className="flex gap-1.5">
                  {["all", "easy", "medium", "hard"].map((d) => (
                    <button
                      key={d}
                      onClick={() => { playSound("click"); setDifficultyFilter(d); }}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-medium capitalize transition-all",
                        difficultyFilter === d
                          ? d === "easy" ? "bg-accent-500/20 text-accent-300" : d === "medium" ? "bg-amber-500/20 text-amber-300" : d === "hard" ? "bg-rose-500/20 text-rose-300" : "bg-primary-500/20 text-primary-300"
                          : "text-surface-500 hover:text-surface-300"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizSets.filter((q) => difficultyFilter === "all" || q.difficulty === difficultyFilter).map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer"
                      onClick={() => startQuiz(quiz)}
                    >
                      <CardContent>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{quiz.icon}</span>
                            <div>
                              <p className="text-sm font-semibold text-surface-200">{quiz.name}</p>
                              <p className="text-xs text-surface-500">{quiz.subject}</p>
                            </div>
                          </div>
                          <Badge
                            variant={quiz.difficulty === "easy" ? "accent" : quiz.difficulty === "medium" ? "amber" : "rose"}
                            size="sm"
                          >
                            {quiz.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-surface-500 mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {quiz.questionCount} questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ~{quiz.estimatedTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            +{quiz.xpReward} XP
                          </span>
                        </div>
                        <Button variant="gradient" size="sm" className="w-full" glow>
                          Start Quiz
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recent History */}
              {history.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-surface-200 mb-4">Recent Results</h2>
                  <div className="space-y-2">
                    {history.slice(-5).reverse().map((result) => (
                      <div key={result.id} className="glass-light rounded-xl p-4 flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          (result.correctAnswers / result.totalQuestions) >= 0.7 ? "bg-accent-500/10" : "bg-rose-500/10"
                        )}>
                          {(result.correctAnswers / result.totalQuestions) >= 0.7 ? (
                            <CheckCircle2 className="w-5 h-5 text-accent-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-surface-200">{result.subject}</p>
                          <p className="text-xs text-surface-500">{result.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-surface-200">{result.correctAnswers}/{result.totalQuestions}</p>
                          <p className="text-xs text-amber-400">+{result.xpEarned} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Active Quiz */}
          {screen === "quiz" && questions.length > 0 && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-surface-500">Progress</span>
                  <span className="text-xs font-medium text-surface-300">{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
                </div>
                <ProgressBar value={currentQ + 1} max={questions.length} size="md" />
              </div>

              {/* Question Card */}
              <Card className="mb-6">
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="primary" size="sm">Q{currentQ + 1}</Badge>
                    <Badge variant={questions[currentQ].difficulty === "easy" ? "accent" : questions[currentQ].difficulty === "medium" ? "amber" : "rose"} size="sm">
                      {questions[currentQ].difficulty}
                    </Badge>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-surface-100 mb-6">
                    {questions[currentQ].question}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {questions[currentQ].options.map((option, idx) => {
                      const isCorrect = idx === questions[currentQ].correctIndex;
                      const isSelected = selectedAnswer === idx;
                      const isWrong = isSelected && !isCorrect;

                      return (
                        <motion.button
                          key={idx}
                          whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                          whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                          onClick={() => handleAnswer(idx)}
                          disabled={selectedAnswer !== null}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-300",
                            selectedAnswer === null
                              ? "border-surface-700/50 hover:border-primary-500/30 bg-surface-800/30 hover:bg-surface-800/50"
                              : isCorrect
                              ? "border-accent-500/50 bg-accent-500/10"
                              : isWrong
                              ? "border-rose-500/50 bg-rose-500/10"
                              : "border-surface-700/30 bg-surface-800/20 opacity-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all",
                              selectedAnswer === null
                                ? "bg-surface-700/50 text-surface-400"
                                : isCorrect
                                ? "bg-accent-500 text-white"
                                : isWrong
                                ? "bg-rose-500 text-white"
                                : "bg-surface-800 text-surface-500"
                            )}>
                              {selectedAnswer !== null && isCorrect ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : selectedAnswer !== null && isWrong ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                String.fromCharCode(65 + idx)
                              )}
                            </div>
                            <span className={cn(
                              "text-sm",
                              selectedAnswer === null ? "text-surface-200" : isCorrect ? "text-accent-200" : isWrong ? "text-rose-200" : "text-surface-500"
                            )}>
                              {option}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className={cn(
                          "p-4 rounded-xl border",
                          selectedAnswer === questions[currentQ].correctIndex
                            ? "bg-accent-500/5 border-accent-500/20"
                            : "bg-amber-500/5 border-amber-500/20"
                        )}>
                          <div className="flex items-start gap-3">
                            {selectedAnswer === questions[currentQ].correctIndex ? (
                              <CheckCircle2 className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-surface-200 mb-1">
                                {selectedAnswer === questions[currentQ].correctIndex ? "Correct!" : "Not quite right"}
                              </p>
                              <p className="text-xs text-surface-400 leading-relaxed">
                                {questions[currentQ].explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Next Button */}
              {selectedAnswer !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                  <Button variant="gradient" size="lg" glow onClick={nextQuestion}>
                    {currentQ < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Finish Quiz
                        <Trophy className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Results */}
          {screen === "results" && selectedQuiz && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center">
              <Card className="overflow-hidden">
                <div className={cn(
                  "p-8 sm:p-12",
                  score === total ? "bg-gradient-to-br from-accent-500/10 to-primary-500/10" : score >= total * 0.7 ? "bg-gradient-to-br from-primary-500/10 to-purple-500/10" : "bg-gradient-to-br from-surface-800/50 to-surface-900/50"
                )}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className={cn(
                      "w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl",
                      score === total ? "bg-gradient-to-br from-amber-400 to-amber-600" : score >= total * 0.7 ? "bg-gradient-to-br from-primary-500 to-purple-600" : "bg-gradient-to-br from-surface-600 to-surface-700"
                    )}
                  >
                    {score === total ? (
                      <Trophy className="w-12 h-12 text-white" />
                    ) : score >= total * 0.7 ? (
                      <Star className="w-12 h-12 text-white" />
                    ) : (
                      <Target className="w-12 h-12 text-white" />
                    )}
                  </motion.div>

                  <h2 className="text-3xl font-bold text-surface-100 mb-2">
                    {score === total ? "Perfect Score!" : score >= total * 0.7 ? "Great Job!" : "Keep Practicing!"}
                  </h2>
                  <p className="text-surface-400 mb-6">{selectedQuiz.name}</p>

                  {/* Score Circle */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8" />
                      <motion.circle
                        cx="60" cy="60" r="54" fill="none"
                        stroke={score === total ? "#10b981" : score >= total * 0.7 ? "#6366f1" : "#f59e0b"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / total) * 339.292} 339.292`}
                        initial={{ strokeDasharray: "0 339.292" }}
                        animate={{ strokeDasharray: `${(score / total) * 339.292} 339.292` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-3xl font-bold text-surface-100">{Math.round((score / total) * 100)}%</p>
                      <p className="text-[10px] text-surface-500">{score}/{total}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { label: "Correct", value: score.toString(), color: "text-accent-400" },
                      { label: "Wrong", value: (total - score).toString(), color: "text-rose-400" },
                      { label: "XP Earned", value: `+${Math.round((score / total) * (selectedQuiz.xpReward))}`, color: "text-amber-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="glass-light rounded-xl p-3">
                        <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
                        <p className="text-[10px] text-surface-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Question Review */}
                  <div className="text-left space-y-2 mb-8">
                    <p className="text-sm font-medium text-surface-300 mb-3">Question Review</p>
                    {questions.map((q, i) => (
                      <div key={q.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/30">
                        {answers[i] === q.correctIndex ? (
                          <CheckCircle2 className="w-4 h-4 text-accent-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="text-xs text-surface-300 flex-1 truncate">{q.question}</span>
                        <span className="text-[10px] text-surface-500">Q{i + 1}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" size="lg" onClick={() => { playSound("click"); setScreen("select"); }}>
                      <RotateCcw className="w-4 h-4" />
                      Back to Quizzes
                    </Button>
                    <Button variant="gradient" size="lg" glow onClick={() => { playSound("click"); startQuiz(selectedQuiz); }}>
                      <RotateCcw className="w-4 h-4" />
                      Retry Quiz
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
