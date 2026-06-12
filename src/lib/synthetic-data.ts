// Synthetic data generator for quiz categories and topics
import { GeneratedQuestion, GeneratedQuiz } from "./quiz-generator";

/**
 * Synthetic data for various subjects and topics.
 * In a production environment, this could be replaced by a database or external knowledge base.
 */
const syntheticData: Record<string, Record<string, GeneratedQuestion[]>> = {
  Mathematics: {
    "Algebra": [
      {
        id: "syn-alg-1",
        question: "What is the solution to the equation 2x + 5 = 15?",
        options: ["x = 5", "x = 10", "x = 2.5", "x = 7.5"],
        correctIndex: 0,
        explanation: "Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5.",
        subject: "Mathematics",
        difficulty: "easy",
        topic: "Algebra",
      },
      {
        id: "syn-alg-2",
        question: "Factor the quadratic expression: x^2 - 5x + 6",
        options: ["(x-2)(x-3)", "(x+2)(x+3)", "(x-1)(x-6)", "(x+1)(x-6)"],
        correctIndex: 0,
        explanation: "Find two numbers that multiply to 6 and add to -5: -2 and -3.",
        subject: "Mathematics",
        difficulty: "medium",
        topic: "Algebra",
      },
    ],
    "Calculus": [
      {
        id: "syn-calc-1",
        question: "What is the derivative of f(x) = 3x^2 + 2x - 7?",
        options: ["6x + 2", "6x", "3x + 2", "6x^2 + 2"],
        correctIndex: 0,
        explanation: "Apply power rule: d/dx[x^n] = n*x^(n-1).",
        subject: "Mathematics",
        difficulty: "medium",
        topic: "Calculus",
      },
    ],
  },
  Physics: {
    "Mechanics": [
      {
        id: "syn-phys-1",
        question: "What is the acceleration of an object with a net force of 20 N and mass of 4 kg?",
        options: ["5 m/s²", "4 m/s²", "80 m/s²", "0.2 m/s²"],
        correctIndex: 0,
        explanation: "Use Newton's second law: a = F/m = 20 N / 4 kg = 5 m/s².",
        subject: "Physics",
        difficulty: "easy",
        topic: "Mechanics",
      },
    ],
    "Electromagnetism": [
      {
        id: "syn-phys-2",
        question: "What is the unit of electrical resistance?",
        options: ["Ampere", "Volt", "Ohm", "Watt"],
        correctIndex: 2,
        explanation: "The unit of electrical resistance is the Ohm (Ω).",
        subject: "Physics",
        difficulty: "easy",
        topic: "Electromagnetism",
      },
    ],
  },
  "Computer Science": {
    "Algorithms": [
      {
        id: "syn-cs-1",
        question: "What is the time complexity of binary search in a sorted array of n elements?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        correctIndex: 1,
        explanation: "Binary search halves the search space each time, resulting in logarithmic time complexity.",
        subject: "Computer Science",
        difficulty: "medium",
        topic: "Algorithms",
      },
    ],
    "Databases": [
      {
        id: "syn-cs-2",
        question: "Which SQL clause is used to filter rows after aggregation?",
        options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
        correctIndex: 1,
        explanation: "The HAVING clause is used to filter groups based on aggregate conditions.",
        subject: "Computer Science",
        difficulty: "medium",
        topic: "Databases",
      },
    ],
  },
  Biology: {
    "Genetics": [
      {
        id: "syn-bio-1",
        question: "What is the basic unit of heredity?",
        options: ["Gene", "Chromosome", "DNA", "Allele"],
        correctIndex: 0,
        explanation: "A gene is the basic physical and functional unit of heredity.",
        subject: "Biology",
        difficulty: "easy",
        topic: "Genetics",
      },
    ],
  },
  Chemistry: {
    "Stoichiometry": [
      {
        id: "syn-chem-1",
        question: "How many moles of oxygen are required to completely combust 2 moles of methane (CH₄)?",
        options: ["2 moles", "4 moles", "6 moles", "8 moles"],
        correctIndex: 2,
        explanation: "Balanced equation: CH₄ + 2O₂ → CO₂ + 2H₂O. For 2 moles CH₄, need 4 moles O₂.",
        subject: "Chemistry",
        difficulty: "medium",
        topic: "Stoichiometry",
      },
    ],
  },
  History: {
    "World War II": [
      {
        id: "syn-his-1",
        question: "Which event is generally considered the start of World War II?",
        options: ["Invasion of Poland", "Pearl Harbor", "Battle of Stalingrad", "D-Day"],
        correctIndex: 0,
        explanation: "Germany's invasion of Poland on September 1, 1939, is widely regarded as the start of WWII.",
        subject: "History",
        difficulty: "easy",
        topic: "World War II",
      },
    ],
  },
  Literature: {
    "Shakespeare": [
      {
        id: "syn-lit-1",
        question: "In which play does the character Hamlet appear?",
        options: ["Macbeth", "Othello", "Hamlet", "King Lear"],
        correctIndex: 2,
        explanation: "Hamlet is the titular character in Shakespeare's tragedy 'Hamlet'.",
        subject: "Literature",
        difficulty: "easy",
        topic: "Shakespeare",
      },
    ],
  },
  Languages: {
    "Spanish Vocabulary": [
      {
        id: "syn-lang-1",
        question: "What is the Spanish word for 'water'?",
        options: ["Agua", "Fuego", "Tierra", "Aire"],
        correctIndex: 0,
        explanation: "The Spanish word for water is 'agua'.",
        subject: "Languages",
        difficulty: "easy",
        topic: "Spanish Vocabulary",
      },
      {
        id: "syn-lang-2",
        question: "Which Spanish phrase means 'How are you?'?",
        options: ["¿Dónde estás?", "¿Cómo estás?", "¿Qué hora es?", "¿Cuánto cuesta?"],
        correctIndex: 1,
        explanation: "'¿Cómo estás?' means 'How are you?' in Spanish.",
        subject: "Languages",
        difficulty: "easy",
        topic: "Spanish Vocabulary",
      },
    ],
    "English Grammar": [
      {
        id: "syn-lang-3",
        question: "Which sentence is grammatically correct?",
        options: ["She don't like apples.", "She doesn't like apples.", "She didn't liked apples.", "She not like apples."],
        correctIndex: 1,
        explanation: "'She doesn't like apples.' is the correct present tense sentence.",
        subject: "Languages",
        difficulty: "medium",
        topic: "English Grammar",
      },
    ],
  },
};

/**
 * Get synthetic questions for a given subject and topic.
 * If topic is "all", return all questions for the subject.
 */
export function getSyntheticQuestions(
  subject: string,
  topic: string = "all"
): GeneratedQuestion[] {
  const subjectData = syntheticData[subject];
  if (!subjectData) return [];

  if (topic === "all") {
    // Flatten all topics for the subject
    return Object.values(subjectData).flat();
  }

  return subjectData[topic] || [];
}

export function getSyntheticSubjects(): string[] {
  return Object.keys(syntheticData);
}

export function getSyntheticTopics(subject: string): string[] {
  return Object.keys(syntheticData[subject] || {});
}

/**
 * Generate a synthetic quiz for a given subject, topic, difficulty, and question count.
 * This function is used as a fallback or supplement to AI-generated quizzes.
 */
export function generateSyntheticQuiz(
  subject: string,
  topic: string = "all",
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed",
  questionCount: number = 10
): GeneratedQuiz | null {
  let questions = getSyntheticQuestions(subject, topic);

  if (questions.length === 0) return null;

  // Filter by difficulty if not mixed
  if (difficulty !== "mixed") {
    questions = questions.filter((q) => q.difficulty === difficulty);
    if (questions.length === 0) {
      // If no questions match the difficulty, fall back to any difficulty
      questions = getSyntheticQuestions(subject, topic);
    }
  }

  // Shuffle and limit to questionCount
  questions = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, questionCount);

  // Re-index IDs to avoid duplicates
  questions = questions.map((q, i) => ({
    ...q,
    id: `syn-${subject.toLowerCase()}-${topic}-${i}`,
  }));

  // Determine quiz difficulty (if mixed, compute average or set to medium)
  const quizDifficulty =
    difficulty !== "mixed" ? difficulty : "medium"; // Simplified for synthetic

  const icons: Record<string, string> = {
    Mathematics: "📐",
    Physics: "⚛️",
    "Computer Science": "💻",
    Biology: "🧬",
    Chemistry: "🧪",
    History: "🏛️",
    Literature: "📖",
  };

  const estimatedTime = Math.ceil(questions.length * 1.5);
  const xpReward = questions.length * 15;

  return {
    id: `syn-quiz-${Date.now()}`,
    name:
      topic === "all"
        ? `${subject} ${difficulty === "mixed" ? "Mixed" : difficulty} Quiz`
        : `${subject} - ${topic}`,
    subject,
    icon: icons[subject] || "📝",
    questions,
    difficulty: quizDifficulty,
    estimatedTime,
    xpReward,
    generatedAt: new Date().toISOString(),
    aiGenerated: false, // Mark as synthetic
  };
}