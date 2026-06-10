export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export interface GeneratedQuiz {
  id: string;
  name: string;
  subject: string;
  icon: string;
  questions: GeneratedQuestion[];
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  xpReward: number;
  generatedAt: string;
  aiGenerated: boolean;
}

// Fallback question banks for when the API is unavailable
const questionBanks: Record<string, Record<string, GeneratedQuestion[]>> = {
  Mathematics: {
    "Calculus: Derivatives": [
      { id: "mcd1", question: "What is the derivative of x²?", options: ["x", "2x", "2x²", "x³"], correctIndex: 1, explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x.", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd2", question: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "tan(x)", "-sin(x)"], correctIndex: 0, explanation: "The derivative of sin(x) is cos(x).", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd3", question: "What is d/dx(eˣ)?", options: ["x·eˣ", "eˣ", "eˣ⁺¹", "ln(eˣ)"], correctIndex: 1, explanation: "The derivative of eˣ is eˣ itself.", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd4", question: "Using the chain rule, what is d/dx(sin(2x))?", options: ["cos(2x)", "2cos(2x)", "sin(2x)", "2sin(2x)"], correctIndex: 1, explanation: "Chain rule: d/dx[f(g(x))] = f'(g(x))·g'(x). So d/dx(sin(2x)) = cos(2x)·2 = 2cos(2x).", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd5", question: "What is the derivative of ln(x)?", options: ["x", "1/x", "ln(x)/x", "1/x²"], correctIndex: 1, explanation: "d/dx(ln(x)) = 1/x.", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd6", question: "What is the second derivative of x⁴?", options: ["4x³", "12x²", "12x", "4x²"], correctIndex: 1, explanation: "First derivative: 4x³. Second derivative: 12x².", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd7", question: "What is d/dx(tan(x))?", options: ["sec(x)", "sec²(x)", "cot(x)", "cos²(x)"], correctIndex: 1, explanation: "d/dx(tan(x)) = sec²(x).", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
      { id: "mcd8", question: "Using the product rule, what is d/dx(x·sin(x))?", options: ["sin(x)", "sin(x) + x·cos(x)", "x·cos(x)", "cos(x)"], correctIndex: 1, explanation: "Product rule: (fg)' = f'g + fg'. So d/dx(x·sin(x)) = 1·sin(x) + x·cos(x) = sin(x) + x·cos(x).", subject: "Mathematics", difficulty: "hard", topic: "Derivatives" },
      { id: "mcd9", question: "What is the derivative of x³ - 3x + 5?", options: ["3x² - 3", "3x² - 3x", "x² - 3", "3x - 3"], correctIndex: 0, explanation: "d/dx(x³ - 3x + 5) = 3x² - 3.", subject: "Mathematics", difficulty: "easy", topic: "Derivatives" },
      { id: "mcd10", question: "What is d/dx(e^(2x))?", options: ["2eˣ", "e^(2x)", "2e^(2x)", "e^(2x)/2"], correctIndex: 2, explanation: "Chain rule: d/dx(e^(2x)) = e^(2x)·2 = 2e^(2x).", subject: "Mathematics", difficulty: "medium", topic: "Derivatives" },
    ],
    "Calculus: Integrals": [
      { id: "mci1", question: "What is ∫2x dx?", options: ["x²", "x² + C", "2x²", "2x² + C"], correctIndex: 1, explanation: "Using the power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. So ∫2x dx = 2·x²/2 + C = x² + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci2", question: "What is ∫cos(x) dx?", options: ["-sin(x) + C", "sin(x) + C", "cos(x) + C", "tan(x) + C"], correctIndex: 1, explanation: "The integral of cos(x) is sin(x) + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci3", question: "What is ∫(1/x) dx?", options: ["x⁻² + C", "ln|x| + C", "1/x² + C", "eˣ + C"], correctIndex: 1, explanation: "The integral of 1/x is ln|x| + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci4", question: "What is ∫eˣ dx?", options: ["eˣ + C", "xeˣ + C", "eˣ/x + C", "e^(x+1) + C"], correctIndex: 0, explanation: "The integral of eˣ is eˣ + C.", subject: "Mathematics", difficulty: "easy", topic: "Integrals" },
      { id: "mci5", question: "Using substitution, what is ∫2x·cos(x²) dx?", options: ["sin(x²) + C", "cos(x²) + C", "2sin(x²) + C", "x²sin(x²) + C"], correctIndex: 0, explanation: "Let u = x², then du = 2x dx. So ∫2x·cos(x²) dx = ∫cos(u) du = sin(u) + C = sin(x²) + C.", subject: "Mathematics", difficulty: "medium", topic: "Integrals" },
    ],
  },
  Physics: {
    "Quantum Mechanics": [
      { id: "pqm1", question: "What does the Heisenberg Uncertainty Principle state?", options: ["Energy is conserved", "Position and momentum cannot both be precisely known", "Electrons orbit in fixed paths", "Light is both a wave and particle"], correctIndex: 1, explanation: "The Heisenberg Uncertainty Principle states that we cannot simultaneously know both the exact position and exact momentum of a particle.", subject: "Physics", difficulty: "medium", topic: "Quantum Mechanics" },
      { id: "pqm2", question: "What is Planck's constant approximately equal to?", options: ["6.626 × 10⁻³⁴ J·s", "3.0 × 10⁸ m/s", "1.6 × 10⁻¹⁹ C", "9.8 m/s²"], correctIndex: 0, explanation: "Planck's constant h ≈ 6.626 × 10⁻³⁴ J·s.", subject: "Physics", difficulty: "easy", topic: "Quantum Mechanics" },
      { id: "pqm3", question: "What is wave-particle duality?", options: ["Waves always have particles", "Light and matter exhibit both wave and particle properties", "Particles create waves when moving", "Waves destroy particles"], correctIndex: 1, explanation: "Wave-particle duality is the concept that quantum entities exhibit both wave-like and particle-like properties.", subject: "Physics", difficulty: "easy", topic: "Quantum Mechanics" },
    ],
  },
};

// Get all available topics for a subject
export function getTopicsForSubject(subject: string): string[] {
  return Object.keys(questionBanks[subject] || {});
}

// Get all available subjects
export function getAllSubjects(): string[] {
  return Object.keys(questionBanks);
}

// Generate a quiz by calling the AI API first, falling back to hardcoded questions
export async function generateQuiz(
  subject: string,
  topic: string,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed",
  questionCount: number = 10
): Promise<GeneratedQuiz | null> {
  try {
    // Try AI API first
    const res = await fetch("/api/ai/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, topic, difficulty, count: questionCount }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const icons: Record<string, string> = {
          Mathematics: "📐", Physics: "⚛️", "Computer Science": "💻",
          Biology: "🧬", Chemistry: "🧪", Literature: "📖", History: "🏛️", Languages: "🌍",
        };

        const questions: GeneratedQuestion[] = data.questions.map((q: any, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          subject,
          difficulty: difficulty === "mixed"
            ? (["easy", "medium", "hard"] as const)[i % 3]
            : difficulty,
          topic: topic === "all" ? "General" : topic,
        }));

        return {
          id: `ai-quiz-${Date.now()}`,
          name: topic && topic !== "all" ? topic : `${subject} Quiz`,
          subject,
          icon: icons[subject] || "📝",
          questions,
          difficulty: difficulty === "mixed" ? "medium" : difficulty,
          estimatedTime: Math.ceil(questions.length * 1.5),
          xpReward: questions.length * 15,
          generatedAt: new Date().toISOString(),
          aiGenerated: true,
        };
      }
    }
  } catch {
    // API failed, fall through to fallback
  }

  // Fallback: use hardcoded question bank
  return generateQuizFallback(subject, topic, difficulty, questionCount);
}

// Fallback to hardcoded question bank
function generateQuizFallback(
  subject: string,
  topic: string,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed",
  questionCount: number = 10
): GeneratedQuiz | null {
  const subjectBank = questionBanks[subject];
  if (!subjectBank) return null;

  let availableQuestions: GeneratedQuestion[] = [];

  if (topic === "all" || topic === "All") {
    availableQuestions = Object.values(subjectBank).flat();
  } else {
    availableQuestions = subjectBank[topic] || [];
  }

  if (difficulty !== "mixed") {
    const filtered = availableQuestions.filter((q) => q.difficulty === difficulty);
    if (filtered.length >= questionCount) {
      availableQuestions = filtered;
    }
  }

  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  if (selected.length === 0) return null;

  const questions = selected.map((q, i) => ({
    ...q,
    id: `ai-${Date.now()}-${i}`,
  }));

  const icons: Record<string, string> = {
    Mathematics: "📐", Physics: "⚛️", "Computer Science": "💻",
    Biology: "🧬", Chemistry: "🧪", Literature: "📖", History: "🏛️", Languages: "🌍",
  };

  return {
    id: `ai-quiz-${Date.now()}`,
    name: topic === "all" || topic === "All" ? `${subject} Mixed Quiz` : topic,
    subject,
    icon: icons[subject] || "📝",
    questions,
    difficulty: difficulty === "mixed" ? "medium" : difficulty,
    estimatedTime: Math.ceil(questions.length * 1.5),
    xpReward: questions.length * 15,
    generatedAt: new Date().toISOString(),
    aiGenerated: true,
  };
}

// Generate quiz from user's notes
export async function generateQuizFromNotes(
  noteContent: string,
  subject: string,
  questionCount: number = 5
): Promise<GeneratedQuestion[]> {
  try {
    const res = await fetch("/api/ai/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        topic: noteContent.slice(0, 200),
        difficulty: "mixed",
        count: questionCount,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        return data.questions.map((q: any, i: number) => ({
          id: `notes-${Date.now()}-${i}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          subject,
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          topic: "From Notes",
        }));
      }
    }
  } catch {
    // Fall through to fallback
  }

  // Fallback: extract keywords and match from bank
  return generateQuizFromNotesFallback(noteContent, subject, questionCount);
}

function generateQuizFromNotesFallback(
  noteContent: string,
  subject: string,
  questionCount: number = 5
): GeneratedQuestion[] {
  const words = noteContent.toLowerCase().split(/\s+/);
  const keywords = words.filter((w) => w.length > 4);

  const subjectBank = questionBanks[subject] || {};
  const allQuestions = Object.values(subjectBank).flat();

  const scored = allQuestions.map((q) => {
    const score = keywords.filter(
      (kw) =>
        q.question.toLowerCase().includes(kw) ||
        q.explanation.toLowerCase().includes(kw) ||
        q.topic.toLowerCase().includes(kw)
    ).length;
    return { ...q, relevanceScore: score };
  });

  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  if (scored[0]?.relevanceScore === 0) {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }

  return scored.slice(0, questionCount);
}
