"use client";

const PREFIX = "studysprint_";

export function saveData<T>(key: string, data: T): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    console.warn("StudySprint: Could not save data to localStorage");
  }
}

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage;
  } catch {
    return null;
  }
}

export function loadData<T>(key: string, fallback: T): T {
  const storage = getStorage();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function removeData(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(PREFIX + key);
  } catch {
    // Ignore
  }
}

export function clearAllData(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    const keys = Object.keys(storage).filter((k) => k.startsWith(PREFIX));
    keys.forEach((k) => storage.removeItem(k));
  } catch {
    // Ignore
  }
}

// Persisted user state
export interface UserState {
  totalXp: number;
  streak: number;
  sessionsCompleted: number;
  quizzesTaken: number;
  hoursStudied: number;
  focusScore: number;
  achievements: string[];
  dailyMissionsCompleted: string[];
  soundEnabled: boolean;
  soundVolume: number;
  selectedBg: string;
}

export function getDefaultUserState(): UserState {
  return {
    totalXp: 12450,
    streak: 12,
    sessionsCompleted: 156,
    quizzesTaken: 89,
    hoursStudied: 376,
    focusScore: 85,
    achievements: ["first_study", "streak_3", "streak_7", "xp_1000", "focus_10", "quiz_master"],
    dailyMissionsCompleted: [],
    soundEnabled: true,
    soundVolume: 0.3,
    selectedBg: "default",
  };
}

export function saveUserState(state: UserState): void {
  saveData("user_state", state);
}

export function loadUserState(): UserState {
  return loadData("user_state", getDefaultUserState());
}

// Daily session log
export interface SessionLog {
  date: string;
  focusMinutes: number;
  quizzesCompleted: number;
  problemsSolved: number;
  xpEarned: number;
  focusScore: number;
}

export function saveSessionLog(log: SessionLog): void {
  const logs = loadData<SessionLog[]>("session_logs", []);
  const existingIdx = logs.findIndex((l) => l.date === log.date);
  if (existingIdx >= 0) {
    logs[existingIdx] = log;
  } else {
    logs.push(log);
  }
  // Keep last 365 days
  const trimmed = logs.slice(-365);
  saveData("session_logs", trimmed);
}

export function loadSessionLogs(): SessionLog[] {
  return loadData<SessionLog[]>("session_logs", []);
}

// Sound preferences (global so it works even before component mount)
export function loadSoundPreferences(): { enabled: boolean; volume: number } {
  return loadData("sound_prefs", { enabled: true, volume: 0.3 });
}

export function saveSoundPreferences(prefs: { enabled: boolean; volume: number }): void {
  saveData("sound_prefs", prefs);
}

// Quiz data
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizResult {
  id: string;
  date: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  xpEarned: number;
  quizName?: string;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  isAiGenerated?: boolean;
}

export function saveQuizResult(result: QuizResult): void {
  const results = loadData<QuizResult[]>("quiz_results", []);
  results.push(result);
  saveData("quiz_results", results.slice(-100));
}

export function loadQuizResults(): QuizResult[] {
  return loadData<QuizResult[]>("quiz_results", []);
}

// AI-generated quizzes
import type { GeneratedQuiz } from "@/lib/quiz-generator";
export type { GeneratedQuiz };

export function saveGeneratedQuizzes(quizzes: GeneratedQuiz[]): void {
  saveData("generated_quizzes", quizzes);
}

export function loadGeneratedQuizzes(): GeneratedQuiz[] {
  return loadData<GeneratedQuiz[]>("generated_quizzes", []);
}

export function addGeneratedQuiz(quiz: GeneratedQuiz): void {
  const quizzes = loadGeneratedQuizzes();
  quizzes.push(quiz);
  saveGeneratedQuizzes(quizzes.slice(-20));
}

// Flashcard data
export interface FlashcardDeck {
  id: string;
  name: string;
  subject: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  box: number;
  nextReview: string;
  lastReviewed: string | null;
}

export function saveFlashcardDecks(decks: FlashcardDeck[]): void {
  saveData("flashcard_decks", decks);
}

export function loadFlashcardDecks(): FlashcardDeck[] {
  return loadData<FlashcardDeck[]>("flashcard_decks", []);
}

// Notes data
export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  tags: string[];
}

export function saveNotes(notes: Note[]): void {
  saveData("notes", notes);
}

export function loadNotes(): Note[] {
  return loadData<Note[]>("notes", []);
}

// Tasks data
export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  completed: boolean;
  createdAt: string;
  category: "assignment" | "exam" | "project" | "reading" | "other";
}

export function saveTasks(tasks: Task[]): void {
  saveData("tasks", tasks);
}

export function loadTasks(): Task[] {
  return loadData<Task[]>("tasks", []);
}
