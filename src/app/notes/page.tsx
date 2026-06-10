"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  Edit2,
  Tag,
  Calendar,
  X,
  Check,
  Clock,
  Sparkles,
  Brain,
  ChevronDown,
  ListChecks,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";
import type { GeneratedQuiz } from "@/lib/quiz-generator";
import { saveNotes, loadNotes, addGeneratedQuiz, type Note } from "@/lib/persistence";

const defaultNotes: Note[] = [
  {
    id: "n1", title: "Calculus Cheat Sheet", content: "## Key Derivative Rules\n\n**Power Rule:** d/dx(xⁿ) = nxⁿ⁻¹\n**Chain Rule:** d/dx[f(g(x))] = f'(g(x)) · g'(x)\n**Product Rule:** (fg)' = f'g + fg'\n**Quotient Rule:** (f/g)' = (f'g - fg') / g²\n\n## Common Derivatives\n- d/dx(sin x) = cos x\n- d/dx(cos x) = -sin x\n- d/dx(eˣ) = eˣ\n- d/dx(ln x) = 1/x",
    subject: "Mathematics", createdAt: "2025-06-01", updatedAt: "2025-06-08", pinned: true, tags: ["calculus", "reference"],
  },
  {
    id: "n2", title: "Quantum Mechanics Notes", content: "## Wave-Particle Duality\nAll quantum entities exhibit both wave-like and particle-like properties.\n\n## Key Equations\n- Schrödinger Equation: iℏ ∂ψ/∂t = Ĥψ\n- Heisenberg: ΔxΔp ≥ ℏ/2\n- de Broglie: λ = h/p\n\n## Important Concepts\n1. Superposition\n2. Entanglement\n3. Tunneling\n4. Quantum Zeno Effect",
    subject: "Physics", createdAt: "2025-06-03", updatedAt: "2025-06-07", pinned: false, tags: ["quantum", "physics"],
  },
  {
    id: "n3", title: "Data Structures Summary", content: "## Arrays\n- Access: O(1), Search: O(n), Insert: O(n)\n\n## Linked Lists\n- Access: O(n), Search: O(n), Insert: O(1)\n\n## Hash Tables\n- Average: O(1) for all operations\n- Worst case: O(n)\n\n## Binary Trees\n- Balanced: O(log n) for search/insert/delete\n\n## Graphs\n- BFS: O(V+E)\n- DFS: O(V+E)",
    subject: "Computer Science", createdAt: "2025-06-05", updatedAt: "2025-06-06", pinned: true, tags: ["data structures", "algorithms"],
  },
  {
    id: "n4", title: "Cell Biology Key Terms", content: "## Cell Structure\n- **Nucleus:** Contains DNA, controls cell activities\n- **Mitochondria:** Powerhouse of the cell, ATP production\n- **Ribosomes:** Protein synthesis\n- **Endoplasmic Reticulum:** Protein and lipid synthesis\n- **Golgi Apparatus:** Packaging and shipping\n\n## Cell Division\n- Mitosis: 2 identical daughter cells\n- Meiosis: 4 genetically unique cells",
    subject: "Biology", createdAt: "2025-06-06", updatedAt: "2025-06-06", pinned: false, tags: ["cells", "biology"],
  },
];

const subjects = ["All", "Mathematics", "Physics", "Computer Science", "Biology", "Chemistry", "Literature"];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSubject, setEditSubject] = useState("Mathematics");
  const [showNewNote, setShowNewNote] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<{ summary: string; keyPoints: string[]; suggestedTags: string[] } | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const { playSound } = useSound();

  useEffect(() => {
    const loaded = loadNotes();
    if (loaded.length === 0) {
      setNotes(defaultNotes);
      saveNotes(defaultNotes);
    } else {
      setNotes(loaded);
    }
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "All" || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned);

  const createNote = () => {
    if (!editTitle.trim()) return;
    playSound("success");
    const note: Note = {
      id: Math.random().toString(36).substring(7),
      title: editTitle,
      content: editContent,
      subject: editSubject,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      pinned: false,
      tags: [],
    };
    const updated = [note, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setEditTitle("");
    setEditContent("");
    setShowNewNote(false);
    toast("📝 Note created!", "success");
  };

  const updateNote = () => {
    if (!selectedNote || !editTitle.trim()) return;
    playSound("success");
    const updated = notes.map((n) =>
      n.id === selectedNote.id ? { ...n, title: editTitle, content: editContent, subject: editSubject, updatedAt: new Date().toISOString().split("T")[0] } : n
    );
    setNotes(updated);
    saveNotes(updated);
    setSelectedNote(updated.find((n) => n.id === selectedNote.id) || null);
    setIsEditing(false);
    toast("✅ Note updated!", "success");
  };

  const togglePin = (noteId: string) => {
    playSound("click");
    const updated = notes.map((n) => n.id === noteId ? { ...n, pinned: !n.pinned } : n);
    setNotes(updated);
    saveNotes(updated);
    if (selectedNote?.id === noteId) {
      setSelectedNote(updated.find((n) => n.id === noteId) || null);
    }
  };

  const deleteNote = (noteId: string) => {
    playSound("error");
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    saveNotes(updated);
    if (selectedNote?.id === noteId) setSelectedNote(null);
    toast("🗑️ Note deleted.", "info");
  };

  const summarizeNote = async (note: Note) => {
    if (isSummarizing) return;
    setIsSummarizing(true);
    playSound("click");

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note.content }),
      });

      if (!res.ok) throw new Error("Summarization failed");

      const data = await res.json();
      setSummaryResult({
        summary: data.summary || "",
        keyPoints: data.keyPoints || [],
        suggestedTags: data.suggestedTags || [],
      });
      setShowSummary(true);
      playSound("success");
      toast("🧠 Note summarized successfully!", "success");
    } catch {
      toast("Failed to summarize note. Check your API key.", "info");
    } finally {
      setIsSummarizing(false);
    }
  };

  const generateQuizFromNote = async (note: Note) => {
    if (isGeneratingQuiz) return;
    setIsGeneratingQuiz(true);
    setGeneratedQuiz(null);
    playSound("click");

    try {
      // Use the note subject for the quiz, sending a snippet of content as context
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: note.subject,
          topic: note.title,
          content: note.content.slice(0, 5000),
          difficulty: "mixed",
          count: 8,
        }),
      });

      if (!res.ok) throw new Error("Quiz generation failed");

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        toast("No questions could be generated.", "info");
        return;
      }

      const icons: Record<string, string> = {
        Mathematics: "📐", Physics: "⚛️", "Computer Science": "💻",
        Biology: "🧬", Chemistry: "🧪", Literature: "📖", History: "🏛️", Languages: "🌍",
      };

      const quiz: GeneratedQuiz = {
        id: `note-quiz-${Date.now()}`,
        name: `${note.title} Quiz`,
        subject: note.subject,
        icon: icons[note.subject] || "📝",
        questions: data.questions.map((q: any, i: number) => ({
          id: `nq-${Date.now()}-${i}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          subject: note.subject,
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          topic: note.title,
        })),
        difficulty: "medium",
        estimatedTime: Math.ceil(data.questions.length * 1.5),
        xpReward: data.questions.length * 15,
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
      };

      addGeneratedQuiz(quiz);
      setGeneratedQuiz(quiz);
      playSound("achievement");
      toast(`🧠 Quiz "${quiz.name}" generated with ${quiz.questions.length} questions!`, "success");
    } catch {
      toast("Failed to generate quiz. Check your API key.", "info");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const subjectColors: Record<string, string> = {
    Mathematics: "#6366f1",
    Physics: "#f59e0b",
    "Computer Science": "#8b5cf6",
    Biology: "#06b6d4",
    Chemistry: "#10b981",
    Literature: "#ec4899",
    History: "#f97316",
  };

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">Study Notes</h1>
              <p className="text-sm text-surface-400">{notes.length} notes across {new Set(notes.map((n) => n.subject)).size} subjects</p>
            </div>
            <Button variant="gradient" size="sm" glow className="ml-auto" onClick={() => { playSound("click"); setEditTitle(""); setEditContent(""); setShowNewNote(true); }}>
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => { playSound("click"); setSelectedSubject(s); }}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                    selectedSubject === s
                      ? "bg-primary-600 text-white"
                      : "text-surface-400 hover:text-surface-200 bg-surface-800/50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Notes List */}
          <div className={cn("space-y-4", selectedNote ? "hidden lg:block lg:col-span-2" : "lg:col-span-5")}>
            {pinnedNotes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Pin className="w-3 h-3" />
                  Pinned
                </h3>
                <div className="space-y-2">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} subjectColors={subjectColors} onSelect={() => { playSound("click"); setSelectedNote(note); setIsEditing(false); setEditTitle(note.title); setEditContent(note.content); setEditSubject(note.subject); setSummaryResult(null); setShowSummary(false); setGeneratedQuiz(null); setIsGeneratingQuiz(false); }} onPin={() => togglePin(note.id)} onDelete={() => deleteNote(note.id)} isActive={selectedNote?.id === note.id} />
                  ))}
                </div>
              </div>
            )}

            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">All Notes</h3>
                )}
                <div className="space-y-2">
                  {unpinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} subjectColors={subjectColors} onSelect={() => { playSound("click"); setSelectedNote(note); setIsEditing(false); setEditTitle(note.title); setEditContent(note.content); setEditSubject(note.subject); setSummaryResult(null); setShowSummary(false); setGeneratedQuiz(null); setIsGeneratingQuiz(false); }} onPin={() => togglePin(note.id)} onDelete={() => deleteNote(note.id)} isActive={selectedNote?.id === note.id} />
                  ))}
                </div>
              </div>
            )}

            {filteredNotes.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-surface-600 mx-auto mb-4" />
                <p className="text-surface-400">No notes found</p>
                <p className="text-xs text-surface-600 mt-1">Create your first note to get started</p>
              </div>
            )}
          </div>

          {/* Note Viewer/Editor */}
          {selectedNote && (
            <div className="lg:col-span-3">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-lg font-semibold text-surface-100 bg-transparent border-b border-primary-500/30 focus:outline-none flex-1"
                      />
                    ) : (
                      <CardTitle>{selectedNote.title}</CardTitle>
                    )}
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      {isEditing ? (
                        <>
                          <Button variant="gradient" size="sm" onClick={updateNote}>
                            <Check className="w-4 h-4" />
                            Save
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => { playSound("click"); setSelectedNote(null); }} className="lg:hidden">
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => summarizeNote(selectedNote)}
                            disabled={isSummarizing}
                            className="text-accent-400 hover:text-accent-300"
                            title="Summarize with AI"
                          >
                            {isSummarizing ? (
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Brain className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateQuizFromNote(selectedNote)}
                            disabled={isGeneratingQuiz}
                            className="text-amber-400 hover:text-amber-300"
                            title="Generate Quiz from Note"
                          >
                            {isGeneratingQuiz ? (
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <ListChecks className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { playSound("click"); setIsEditing(true); }}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => togglePin(selectedNote.id)}>
                            {selectedNote.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subjectColors[selectedNote.subject] || "#6366f1" }} />
                    <span className="text-xs text-surface-400">{selectedNote.subject}</span>
                    <span className="text-xs text-surface-600">•</span>
                    <span className="text-xs text-surface-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {selectedNote.updatedAt}
                    </span>
                  </div>

                  {selectedNote.tags.length > 0 && (
                    <div className="flex gap-1.5 mb-4">
                      {selectedNote.tags.map((tag) => (
                        <Badge key={tag} variant="surface" size="sm">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {isEditing ? (
                    <div className="space-y-3">
                      <select
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                      >
                        {["Mathematics", "Physics", "Computer Science", "Biology", "Chemistry", "Literature", "History"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={20}
                        className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-3 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none font-mono leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <div className="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap font-mono bg-surface-800/30 rounded-xl p-4 min-h-[300px]">
                        {selectedNote.content}
                      </div>

                      {/* Generated Quiz Card */}
                      {generatedQuiz && (
                        <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{generatedQuiz.icon}</span>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-surface-200">
                                {generatedQuiz.name}
                              </p>
                              <p className="text-[10px] text-surface-500">
                                {generatedQuiz.questions.length} questions • {generatedQuiz.estimatedTime} min • +{generatedQuiz.xpReward} XP
                              </p>
                            </div>
                          </div>
                          <Link href="/quiz">
                            <Button variant="gradient" size="sm" className="w-full" glow>
                              <Play className="w-3.5 h-3.5" />
                              Start Quiz
                            </Button>
                          </Link>
                        </div>
                      )}

                      {/* AI Summary - Loading Skeleton */}
                      {isSummarizing && !summaryResult && (
                        <div className="mt-4 p-4 bg-accent-500/5 border border-accent-500/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="skeleton w-5 h-5 rounded" />
                            <div className="skeleton w-28 h-4 rounded" />
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="skeleton w-full h-3.5 rounded" />
                            <div className="skeleton w-11/12 h-3.5 rounded" />
                            <div className="skeleton w-3/4 h-3.5 rounded" />
                          </div>
                          <div className="mb-3">
                            <div className="skeleton w-20 h-3 rounded mb-2" />
                            <div className="space-y-1.5">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="skeleton w-1.5 h-1.5 rounded-full shrink-0" />
                                  <div className="skeleton h-3 rounded" style={{ width: `${70 + i * 7}%` }} />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="skeleton w-16 h-5 rounded-full" />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Summary - Result */}
                      {summaryResult && showSummary && (
                        <div className="mt-4 p-4 bg-accent-500/5 border border-accent-500/20 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-accent-300 flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              AI Summary
                            </h4>
                            <button
                              onClick={() => setShowSummary(false)}
                              className="text-surface-500 hover:text-surface-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-sm text-surface-200 leading-relaxed mb-4">
                            {summaryResult.summary}
                          </p>

                          {summaryResult.keyPoints.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-surface-400 mb-2">Key Points</p>
                              <ul className="space-y-1.5">
                                {summaryResult.keyPoints.map((point, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-surface-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 shrink-0 mt-1.5" />
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {summaryResult.suggestedTags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {summaryResult.suggestedTags.map((tag) => (
                                <Badge key={tag} variant="accent" size="sm">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {summaryResult && !showSummary && (
                        <button
                          onClick={() => setShowSummary(true)}
                          className="mt-3 w-full glass-light rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-xs text-accent-400 hover:text-accent-300 transition-colors"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          Show AI Summary
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* New Note Modal */}
      <Modal isOpen={showNewNote} onClose={() => setShowNewNote(false)} title="Create New Note" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="e.g., Thermodynamics Summary"
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Subject</label>
            <select
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            >
              {["Mathematics", "Physics", "Computer Science", "Biology", "Chemistry", "Literature", "History"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Content</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Start writing your notes..."
              rows={10}
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-3 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none font-mono leading-relaxed"
            />
          </div>
          <Button variant="gradient" size="lg" className="w-full" glow onClick={createNote}>
            <FileText className="w-4 h-4" />
            Create Note
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function NoteCard({
  note,
  subjectColors,
  onSelect,
  onPin,
  onDelete,
  isActive,
}: {
  note: Note;
  subjectColors: Record<string, string>;
  onSelect: () => void;
  onPin: () => void;
  onDelete: () => void;
  isActive: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "glass-light rounded-xl p-4 cursor-pointer transition-all",
        isActive && "ring-1 ring-primary-500/30 bg-primary-500/5"
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: subjectColors[note.subject] || "#6366f1" }} />
          <h4 className="text-sm font-medium text-surface-200 truncate">{note.title}</h4>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={onPin} className="w-6 h-6 flex items-center justify-center text-surface-500 hover:text-surface-300 transition-colors">
            {note.pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
          </button>
          <button onClick={onDelete} className="w-6 h-6 flex items-center justify-center text-surface-500 hover:text-rose-400 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <p className="text-xs text-surface-500 line-clamp-2 mb-2">{note.content.substring(0, 100)}...</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-surface-600">{note.subject}</span>
        {note.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="surface" size="sm" className="text-[8px]">{tag}</Badge>
        ))}
      </div>
    </motion.div>
  );
}
