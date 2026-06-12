# StudySprint — Product Requirements Document (PRD)
**Version:** 2.0 | **Status:** Active Development | **Last Updated:** June 2026

---

## 1. Executive Summary

StudySprint is an AI-powered study operating system targeting students aged 16–28 across India and globally. It combines intelligent quiz generation, spaced repetition flashcards, deep-focus sessions, gamification, and real-time collaboration into a single platform. The goal is to become the **Duolingo of academic studying** — habit-forming, personalized, and measurably effective.

**Current state:** MVP with localStorage persistence, AI quiz generation (multi-provider), Pomodoro focus room, basic gamification, and a complete UI shell. No real database, no real-time features, limited content depth.

**Target state (v2.0):** Full-stack platform with Supabase persistence, 3,000+ curated questions across 15 subjects, exam-specific modes (JEE/NEET/GATE/SAT/GRE/CAT/UPSC), real-time study rooms, AI study plan generation, PDF analysis, and a mobile-first PWA.

---

## 2. Problem Statement

Students face four core problems:
1. **Fragmentation** — notes in Notion, timers in Forest, quizzes in Kahoot, flashcards in Anki. Context switching kills momentum.
2. **Passive studying** — reading notes without active recall. No feedback loop.
3. **Zero personalization** — every student gets the same content regardless of their weak areas.
4. **No accountability** — studying alone with no social proof or progress visibility.

---

## 3. Target Users

| Persona | Description | Primary Need |
|---|---|---|
| **Arjun, JEE Aspirant** | Class 12, preparing for IIT-JEE, studies 8–10 hrs/day | Exam-specific question banks, weak area analysis |
| **Priya, Undergrad** | B.Tech 2nd year, balancing coursework and projects | Notes → quiz pipeline, assignment tracking |
| **Rahul, UPSC Prep** | Working professional, studying 3–4 hrs/day | Spaced repetition, custom study plans |
| **Aisha, International Student** | GRE/SAT prep, needs vocabulary + quant help | Adaptive difficulty, progress reports |
| **Dev, Self-Learner** | Teaching himself ML/CS, no formal curriculum | AI-driven exploration, coding challenges |

---

## 4. Product Goals (v2.0)

### Primary Goals
- **G1:** 10-minute onboarding → first meaningful study session within one visit
- **G2:** 3,000+ questions across 15+ subjects with Indian exam coverage (JEE/NEET/GATE/UPSC)
- **G3:** AI study plan generation from user goals + timeline
- **G4:** Real database persistence — data survives browser clear, accessible on any device
- **G5:** Real-time collaborative study rooms (≤2 second latency)

### Secondary Goals
- **G6:** PDF/document upload → instant AI quiz + flashcard generation
- **G7:** Mobile PWA with offline support
- **G8:** Spaced repetition with SM-2 algorithm
- **G9:** Weekly AI-generated progress reports
- **G10:** Export progress as PDF/CSV for parents or professors

---

## 5. Feature Specifications

### 5.1 Onboarding Flow (NEW)
**Priority:** P0

| Step | Description |
|---|---|
| 1. Account creation | Email/Google via Clerk |
| 2. Goal selection | JEE / NEET / College Exams / Self-Learning / Professional Cert |
| 3. Subject selection | Choose 3–6 subjects from 15+ options |
| 4. Level assessment | 5-question adaptive quiz per subject to set baseline |
| 5. Study plan generation | AI generates a weekly plan based on goals + availability |
| 6. First session | Immediately enter quiz or focus room |

**Success metric:** ≥60% of users who sign up complete onboarding within 5 minutes.

---

### 5.2 Quiz Center (ENHANCE)
**Priority:** P0

**Current:** 10 quiz sets, ~100 hardcoded questions, AI generation via OpenRouter.

**Target v2.0:**
- 3,000+ questions across Mathematics, Physics, Chemistry, Biology, Computer Science, History, Geography, Economics, English, Hindi, General Knowledge, Aptitude, Logical Reasoning, GATE-CS, GATE-EE
- Each question tagged: `subject`, `topic`, `subtopic`, `difficulty`, `exam_type[]`, `source`, `year`
- **Exam modes:** JEE Main, JEE Advanced, NEET, GATE, UPSC Prelims, CAT, SAT, GRE, GMAT
- **Question types:** MCQ (single), MCQ (multiple correct), Integer answer, True/False, Fill in blank, Match the column
- **Adaptive difficulty:** Auto-adjust based on last 5 answers
- **Timer modes:** No timer / Relaxed (2x time) / Standard / Exam (strict)
- **Post-quiz analytics:** Time per question, accuracy by topic, comparison to peers, weak area identification
- **Custom quiz builder:** Select subject + topics + difficulty + count → generate mix of AI + curated questions

---

### 5.3 Flashcard System (ENHANCE)
**Priority:** P0

**Current:** Basic front/back cards with Leitner box system, static defaults.

**Target v2.0:**
- Full **SM-2 spaced repetition algorithm** (not just Leitner boxes)
- Card types: Text, Image+Text, Cloze deletion, Audio pronunciation (for languages)
- **AI card generation from:** notes, PDF upload, topic name, YouTube URL (transcript)
- Pre-built decks: 50+ curated decks across subjects (500+ cards)
- Deck sharing: public deck library, clone others' decks
- Import/export: Anki `.apkg` format compatibility

---

### 5.4 Focus Room (ENHANCE)
**Priority:** P1

**Current:** Pomodoro timer, 4 visual themes, 4 ambient sounds (UI only, no real audio).

**Target v2.0:**
- **Real ambient audio** via Web Audio API + audio files (rain, cafe, lofi, white noise, brown noise, binaural beats)
- **Session logging** with subject tagging — "I studied Calculus for 45 minutes"
- **Distraction blocking mode** — full-screen, disable other tabs notification
- **Session insights:** post-session summary with XP earned, topic studied, streak update
- **Flow state detection:** if user completes 3+ sessions in a day without pausing, unlock "Flow State" badge
- **Background sync** — session timer continues even if tab is backgrounded (using Service Worker)

---

### 5.5 Study Notes (ENHANCE)
**Priority:** P1

**Current:** Markdown notes with AI summarize + quiz gen. No rich text, no images.

**Target v2.0:**
- **Rich text editor** (Tiptap or Plate.js) with: headings, bold/italic, code blocks, tables, math equations (KaTeX inline), image upload
- **PDF upload** → extract text → display in reading mode → generate quiz/flashcards from it
- **Note templates:** Lecture notes, Cornell notes, Problem-solving sheet, Experiment report
- **Auto-linking:** If you type "Heisenberg Uncertainty Principle", auto-link to the concept card in the database
- **Revision schedule:** Notes can be marked for review, system schedules them like flashcards
- **AI features:** Summarize, Generate quiz, Generate flashcards, Explain any selected text, Find related notes

---

### 5.6 Study Plan Generator (NEW)
**Priority:** P1

A dedicated AI-powered feature:
- User inputs: exam name, exam date, subjects, hours/day available, current level per subject
- AI generates: week-by-week schedule, daily topic targets, resource recommendations
- Plan auto-adjusts based on quiz performance (weak topics get more time)
- Visualized as calendar + Gantt chart

---

### 5.7 AI Assistant (ENHANCE)
**Priority:** P1

**Current:** Streaming chat with OpenRouter multi-provider.

**Target v2.0:**
- **Mode switching:** Study Assistant / Math Solver / Code Debugger / Essay Reviewer / Exam Simulator
- **Context awareness:** AI knows user's current subject focus, weak areas, recent quiz scores
- **Math rendering:** LaTeX in responses rendered via KaTeX
- **Code execution:** For CS students, code snippets can be run inline (via Piston API)
- **File attachment:** Upload image (photo of textbook page) → AI explains it
- **Conversation memory:** Last 30 messages persist across sessions

---

### 5.8 Gamification (ENHANCE)
**Priority:** P1

**Current:** XP system, levels, static leaderboard (all fake).

**Target v2.0:**
- XP earned from ALL activities (quiz, focus session, flashcard review, note created, task completed, streak maintained) stored in Supabase
- **Real leaderboard** using actual user XP from database
- **Streak system:** Daily streak tracked server-side, not localStorage
- **Achievement system:** 50+ unlockable achievements with real triggers
- **Skill tree:** Visual skill tree per subject — unlock deeper topics as you master basics
- **Weekly challenges:** AI-generated challenges based on weak areas (e.g., "Complete 20 Organic Chemistry questions this week")
- **Badges:** Shareable image badges for social media (og:image generated dynamically)
- **Study leagues:** Weekly competitive leagues with 30 users at similar level

---

### 5.9 Collaborative Study Rooms (NEW)
**Priority:** P2

- Create/join study rooms with up to 10 users
- Real-time shared Pomodoro timer (everyone in sync)
- Text chat within room
- Quiz battles: competitive quiz where room members answer same questions simultaneously
- Shared whiteboard (basic canvas)
- Built on Supabase Realtime

---

### 5.10 Analytics Dashboard (ENHANCE)
**Priority:** P1

**Current:** Charts with mock/static data.

**Target v2.0:**
- All data from real Supabase tables
- Weekly report email (via Resend): hours studied, quizzes taken, accuracy rate, streak
- Subject-level breakdown: accuracy over time, time invested vs score correlation
- Predicted exam readiness score (based on performance vs exam benchmark)
- Export: PDF progress report, CSV raw data

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | LCP < 2.5s, FID < 100ms, CLS < 0.1 |
| **Availability** | 99.9% uptime on Vercel |
| **Security** | Auth via Clerk, RLS on all Supabase tables, API routes rate-limited |
| **Accessibility** | WCAG 2.1 AA compliance, keyboard navigable, screen reader compatible |
| **Mobile** | Fully responsive, PWA with offline quiz/flashcard support |
| **Data privacy** | GDPR-aligned data deletion, no data sold to third parties |
| **Scalability** | Supabase scales to 50K users on free/pro tier |

---

## 7. Success Metrics

| Metric | Target (3 months post-launch) |
|---|---|
| D1 Retention | ≥ 40% |
| D7 Retention | ≥ 25% |
| D30 Retention | ≥ 15% |
| Avg session length | ≥ 18 minutes |
| Quiz completions/user/week | ≥ 5 |
| NPS | ≥ 45 |
| GitHub stars | ≥ 500 |
| Monthly active users | ≥ 2,000 |

---

## 8. Out of Scope (v2.0)

- Native mobile app (iOS/Android) — PWA first
- Live video tutoring marketplace
- Payment processing for premium plans (Coming Soon)
- School/institution dashboards
- Browser extension

---

## 9. Roadmap

```
v1.5 (Current) ──► v2.0 ──────────────────────────────► v3.0
  localStorage      Supabase DB                          Native App
  ~100 questions    3000+ questions                      Live tutoring
  Fake social       Real-time rooms                      School dashboards
  No study plan     AI study plans                       Marketplace
  localStorage      SM-2 SRS                             Offline-first
```

---

*Document Owner: Pal Shah | Next review: After v2.0 beta launch*
