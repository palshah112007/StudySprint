"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks,
  Plus,
  Check,
  Calendar,
  Clock,
  Flag,
  Trash2,
  Edit2,
  ChevronDown,
  BookOpen,
  AlertTriangle,

  Sparkles,
  Target,
  Circle,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/useSound";
import { toast } from "@/components/ui/Toaster";
import { saveTasks, loadTasks, type Task } from "@/lib/persistence";

const defaultTasks: Task[] = [
  { id: "t1", title: "Calculus Problem Set #8", description: "Complete problems 1-20 on derivatives and integrals", subject: "Mathematics", priority: "high", dueDate: "2025-06-11", completed: false, createdAt: "2025-06-08", category: "assignment" },
  { id: "t2", title: "Physics Lab Report", description: "Write up the quantum tunneling experiment results", subject: "Physics", priority: "urgent", dueDate: "2025-06-10", completed: false, createdAt: "2025-06-07", category: "assignment" },
  { id: "t3", title: "Read Chapter 12 - Algorithms", description: "Dynamic programming section, pages 340-380", subject: "Computer Science", priority: "medium", dueDate: "2025-06-12", completed: false, createdAt: "2025-06-06", category: "reading" },
  { id: "t4", title: "CS Algorithm Project", description: "Implement Dijkstra's algorithm with visualization", subject: "Computer Science", priority: "high", dueDate: "2025-06-14", completed: false, createdAt: "2025-06-05", category: "project" },
  { id: "t5", title: "Biology Lab Report", description: "Submit cell division lab analysis", subject: "Biology", priority: "medium", dueDate: "2025-06-16", completed: false, createdAt: "2025-06-04", category: "assignment" },
  { id: "t6", title: "Math Quiz Review", description: "Review all calculus concepts for upcoming quiz", subject: "Mathematics", priority: "low", dueDate: "2025-06-13", completed: false, createdAt: "2025-06-03", category: "other" },
  { id: "t7", title: "Literature Essay Outline", description: "Create outline for Shakespeare analysis essay", subject: "Literature", priority: "medium", dueDate: "2025-06-15", completed: false, createdAt: "2025-06-02", category: "assignment" },
  { id: "t8", title: "Physics Problem Set #5", description: "Completed — all wave mechanics problems", subject: "Physics", priority: "low", dueDate: "2025-06-08", completed: true, createdAt: "2025-06-01", category: "assignment" },
  { id: "t9", title: "Review Chemistry Notes", description: "Revised organic chemistry chapter 8", subject: "Chemistry", priority: "medium", dueDate: "2025-06-09", completed: true, createdAt: "2025-06-01", category: "reading" },
];

const priorityConfig = {
  low: { color: "accent", label: "Low", icon: Circle },
  medium: { color: "amber", label: "Medium", icon: Flag },
  high: { color: "rose", label: "High", icon: AlertTriangle },
  urgent: { color: "rose", label: "Urgent", icon: AlertTriangle },
};

const categoryConfig = {
  assignment: { icon: BookOpen, label: "Assignment" },
  exam: { icon: Target, label: "Exam Prep" },
  project: { icon: Sparkles, label: "Project" },
  reading: { icon: BookOpen, label: "Reading" },
  other: { icon: ListChecks, label: "Other" },
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "subject">("dueDate");
  const [filterSubject, setFilterSubject] = useState("All");
  const [showNewTask, setShowNewTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategory, setNewCategory] = useState<Task["category"]>("assignment");
  const { playSound } = useSound();

  useEffect(() => {
    const loaded = loadTasks();
    if (loaded.length === 0) {
      setTasks(defaultTasks);
      saveTasks(defaultTasks);
    } else {
      setTasks(loaded);
    }
  }, []);

  const toggleComplete = useCallback((taskId: string) => {
    playSound("click");
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const newCompleted = !t.completed;
        if (newCompleted) {
          playSound("success");
          toast(`✅ "${t.title}" completed! +25 XP`, "success");
        }
        return { ...t, completed: newCompleted };
      }
      return t;
    });
    setTasks(updated);
    saveTasks(updated);
  }, [tasks, playSound]);

  const deleteTask = useCallback((taskId: string) => {
    playSound("error");
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
    toast("🗑️ Task deleted.", "info");
  }, [tasks, playSound]);

  const createTask = () => {
    if (!newTitle.trim()) return;
    playSound("success");
    const task: Task = {
      id: Math.random().toString(36).substring(7),
      title: newTitle,
      description: newDescription,
      subject: newSubject,
      priority: newPriority,
      dueDate: newDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      completed: false,
      createdAt: new Date().toISOString().split("T")[0],
      category: newCategory,
    };
    const updated = [task, ...tasks];
    setTasks(updated);
    saveTasks(updated);
    resetForm();
    toast("📋 Task created!", "success");
  };

  const updateTask = () => {
    if (!editingTask || !newTitle.trim()) return;
    playSound("success");
    const updated = tasks.map((t) =>
      t.id === editingTask.id ? { ...t, title: newTitle, description: newDescription, subject: newSubject, priority: newPriority, dueDate: newDueDate, category: newCategory } : t
    );
    setTasks(updated);
    saveTasks(updated);
    resetForm();
    toast("✅ Task updated!", "success");
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewSubject("Mathematics");
    setNewPriority("medium");
    setNewDueDate("");
    setNewCategory("assignment");
    setShowNewTask(false);
    setEditingTask(null);
  };

  const openEdit = (task: Task) => {
    playSound("click");
    setEditingTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewSubject(task.subject);
    setNewPriority(task.priority);
    setNewDueDate(task.dueDate);
    setNewCategory(task.category);
    setShowNewTask(true);
  };

  const getDaysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    if (diff < 0) return "Overdue";
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `${diff} days`;
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => filterSubject === "All" || t.subject === filterSubject)
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (sortBy === "priority") {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      return a.subject.localeCompare(b.subject);
    });

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const overdueTasks = activeTasks.filter((t) => new Date(t.dueDate) < new Date());
  const dueToday = activeTasks.filter((t) => {
    const d = new Date(t.dueDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <div className="min-h-screen bg-surface-950 page-enter">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ListChecks className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">Tasks & Deadlines</h1>
              <p className="text-sm text-surface-400">{activeTasks.length} active • {completedTasks.length} completed</p>
            </div>
            <Button variant="gradient" size="sm" glow className="ml-auto" onClick={() => { playSound("click"); resetForm(); setShowNewTask(true); }}>
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="glass-light rounded-xl p-3 text-center">
              <Timer className="w-4 h-4 text-primary-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-surface-200">{activeTasks.length}</p>
              <p className="text-[10px] text-surface-500">Active Tasks</p>
            </div>
            <div className="glass-light rounded-xl p-3 text-center">
              <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-surface-200">{dueToday.length}</p>
              <p className="text-[10px] text-surface-500">Due Today</p>
            </div>
            <div className="glass-light rounded-xl p-3 text-center">
              <AlertTriangle className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-surface-200">{overdueTasks.length}</p>
              <p className="text-[10px] text-surface-500">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Task List */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex gap-2">
                {(["active", "all", "completed"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => { playSound("click"); setFilter(f); }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      filter === f ? "bg-primary-600 text-white" : "text-surface-400 hover:text-surface-200 bg-surface-800/50"
                    )}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => { playSound("click"); setSortBy(e.target.value as typeof sortBy); }}
                  className="bg-surface-800/50 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-surface-300 focus:outline-none"
                >
                  <option value="dueDate">Sort by Due Date</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="subject">Sort by Subject</option>
                </select>
                <select
                  value={filterSubject}
                  onChange={(e) => { playSound("click"); setFilterSubject(e.target.value); }}
                  className="bg-surface-800/50 border border-surface-700/50 rounded-lg px-3 py-2 text-xs text-surface-300 focus:outline-none"
                >
                  {["All", "Mathematics", "Physics", "Computer Science", "Biology", "Chemistry", "Literature"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              <AnimatePresence>
                {filteredTasks.map((task) => {
                  const daysLeft = getDaysUntil(task.dueDate);
                  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                  const catInfo = categoryConfig[task.category];
                  const priInfo = priorityConfig[task.priority];

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn(
                        "glass-light rounded-xl p-4 transition-all group",
                        task.completed && "opacity-60"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                            task.completed
                              ? "bg-accent-500 border-accent-500"
                              : "border-surface-600 hover:border-primary-500"
                          )}
                        >
                          {task.completed && <Check className="w-3 h-3 text-white" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={cn("text-sm font-medium", task.completed ? "text-surface-500 line-through" : "text-surface-200")}>
                              {task.title}
                            </h4>
                            <Badge variant={priInfo.color as "accent" | "amber" | "rose"} size="sm">
                              {priInfo.label}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-surface-500 mb-2 line-clamp-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-surface-500 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: subjectColors[task.subject] }} />
                              {task.subject}
                            </span>
                            <span className="text-[10px] text-surface-600">•</span>
                            <span className={cn("text-[10px] flex items-center gap-1", isOverdue ? "text-rose-400" : "text-surface-500")}>
                              <Calendar className="w-3 h-3" />
                              {daysLeft}
                            </span>
                            <span className="text-[10px] text-surface-600">•</span>
                            <span className="text-[10px] text-surface-500 flex items-center gap-1">
                              <catInfo.icon className="w-3 h-3" />
                              {catInfo.label}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(task)} className="w-7 h-7 flex items-center justify-center text-surface-500 hover:text-surface-300 rounded-lg hover:bg-surface-800/50 transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteTask(task.id)} className="w-7 h-7 flex items-center justify-center text-surface-500 hover:text-rose-400 rounded-lg hover:bg-surface-800/50 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredTasks.length === 0 && (
                <div className="text-center py-16">
                  <CheckCircle2 className="w-12 h-12 text-accent-400/50 mx-auto mb-4" />
                  <p className="text-surface-400">
                    {filter === "completed" ? "No completed tasks yet" : "All tasks completed! 🎉"}
                  </p>
                  <p className="text-xs text-surface-600 mt-1">Create a new task to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Completion Progress */}
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-3">Progress</h3>
                <ProgressBar value={completedTasks.length} max={tasks.length} size="md" showLabel />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="glass-light rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-accent-400">{completedTasks.length}</p>
                    <p className="text-[10px] text-surface-500">Done</p>
                  </div>
                  <div className="glass-light rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-primary-400">{activeTasks.length}</p>
                    <p className="text-[10px] text-surface-500">Remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* By Subject */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">By Subject</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(
                  activeTasks.reduce((acc, t) => {
                    acc[t.subject] = (acc[t.subject] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([subject, count]) => (
                  <div key={subject} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subjectColors[subject] }} />
                      <span className="text-xs text-surface-400">{subject}</span>
                    </div>
                    <span className="text-xs font-medium text-surface-300">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {activeTasks
                  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                  .slice(0, 4)
                  .map((task) => {
                    const days = getDaysUntil(task.dueDate);
                    return (
                      <div key={task.id} className="glass-light rounded-lg p-2.5">
                        <p className="text-xs font-medium text-surface-200 truncate">{task.title}</p>
                        <p className={cn("text-[10px]", days === "Overdue" || days === "Today" ? "text-rose-400" : "text-surface-500")}>
                          {days} • {task.subject}
                        </p>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* New/Edit Task Modal */}
      <Modal isOpen={showNewTask} onClose={resetForm} title={editingTask ? "Edit Task" : "Create New Task"} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Complete Calculus Problem Set"
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-400 mb-1.5">Description</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Additional details..."
              rows={3}
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Subject</label>
              <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all">
                {["Mathematics", "Physics", "Computer Science", "Biology", "Chemistry", "Literature", "History"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Due Date</label>
              <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Priority</label>
              <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Task["priority"])} className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-400 mb-1.5">Category</label>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as Task["category"])} className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all">
                <option value="assignment">Assignment</option>
                <option value="exam">Exam Prep</option>
                <option value="project">Project</option>
                <option value="reading">Reading</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <Button variant="gradient" size="lg" className="w-full" glow onClick={editingTask ? updateTask : createTask}>
            {editingTask ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
