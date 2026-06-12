# StudySprint — Complete App Flow
**Version:** 2.0 | **Type:** UX & Engineering Reference

---

## 1. High-Level Navigation Map

```
/  (Landing)
├── /sign-in          → Clerk hosted sign-in
├── /sign-up          → Clerk hosted sign-up
└── /onboarding       → NEW: Goal + subjects + level assessment

/dashboard            → Command Center (requires auth)
├── /quiz             → Quiz Center
│   ├── /quiz/[id]    → Active quiz session
│   └── /quiz/create  → NEW: Custom quiz builder
├── /flashcards       → Flashcard decks
│   ├── /flashcards/[id]      → Study a specific deck
│   └── /flashcards/[id]/edit → Edit deck cards
├── /focus-room       → Pomodoro + ambient focus
├── /notes            → Notes editor
│   └── /notes/[id]   → Single note view/edit
├── /tasks            → Task & deadline tracker
├── /study-plan       → NEW: AI-generated study plan
├── /ai-assistant     → StudyBot chat
├── /gamification     → XP, achievements, leaderboard
├── /social           → Study groups, friends, rooms
│   └── /social/rooms/[code] → Active study room
├── /analytics        → Progress & performance analytics
├── /profile          → User profile & settings
└── /admin            → Redirects to / (protected)
```

---

## 2. Onboarding Flow (NEW — Critical Path)

```
New User Signs Up
      │
      ▼
/onboarding — Step 1: Goal Selection
  ┌─────────────────────────────────┐
  │  What's your primary goal?      │
  │  ○ JEE Main / Advanced          │
  │  ○ NEET                         │
  │  ○ GATE                         │
  │  ○ CAT / MBA Entrance           │
  │  ○ UPSC Civil Services          │
  │  ○ SAT / GRE / GMAT             │
  │  ○ College coursework           │
  │  ○ Self-learning / Curiosity    │
  └─────────────────────────────────┘
      │
      ▼
Step 2: Subject Selection
  ┌─────────────────────────────────┐
  │  Pick your subjects (3-6)       │
  │  [Mathematics] [Physics]        │
  │  [Chemistry] [Biology]          │
  │  [Computer Science] [History]   │
  │  [Economics] [Geography]        │
  │  [English] [Hindi]              │
  │  [Aptitude] [Logical Reasoning] │
  └─────────────────────────────────┘
      │
      ▼
Step 3: Exam Date (optional)
  ┌─────────────────────────────────┐
  │  When is your exam?             │
  │  [Date picker or "No fixed      │
  │   date — I'm exploring"]        │
  └─────────────────────────────────┘
      │
      ▼
Step 4: Hours per Day
  ┌─────────────────────────────────┐
  │  How many hours can you study?  │
  │  ○ 1-2 hours   ○ 3-4 hours     │
  │  ○ 5-6 hours   ○ 7+ hours      │
  └─────────────────────────────────┘
      │
      ▼
Step 5: Level Assessment (2 questions per selected subject)
  ┌─────────────────────────────────┐
  │  Quick level check — 10 Qs      │
  │  (AI generates adaptive Qs)     │
  │  Don't worry — no grade given   │
  └─────────────────────────────────┘
      │
      ▼
Step 6: AI Study Plan Generated
  ┌─────────────────────────────────┐
  │  Your personalized plan ready!  │
  │  Week 1: Mathematics (40%)      │
  │           Physics (35%)         │
  │           Chemistry (25%)       │
  │  [View Full Plan] [Start Now]   │
  └─────────────────────────────────┘
      │
      ▼
Redirects to /dashboard
API: POST /api/users/onboarding → saves all data, creates study plan
```

---

## 3. Dashboard Flow

```
/dashboard loads
      │
      ▼
[Client] loadUserState() — fetches from Supabase:
  • user_stats (XP, level, streak)
  • upcoming tasks (due in 3 days)
  • today's study plan items
  • pending flashcard reviews count
  • recent quiz scores

Dashboard renders:
  ┌──────────────────────────────────────────────┐
  │  HEADER: Level bar · Streak · Today's goal   │
  ├──────────────────────────────────────────────┤
  │  QUICK ACTIONS (8 buttons)                   │
  │  [Focus] [Quiz] [Flashcards] [Notes]         │
  │  [Tasks] [Study Group] [AI] [Analytics]      │
  ├─────────────────┬────────────────────────────┤
  │  TODAY'S PLAN   │  CONTRIBUTION HEATMAP      │
  │  (from DB)      │  (from study_sessions)     │
  ├─────────────────┼────────────────────────────┤
  │  UPCOMING       │  SUBJECT PROGRESS          │
  │  DEADLINES      │  (from user_progress)      │
  ├─────────────────┴────────────────────────────┤
  │  WEEKLY CHART   │  FLASHCARDS DUE TODAY      │
  └─────────────────┴────────────────────────────┘
```

---

## 4. Quiz Flow (Complete)

```
/quiz — Quiz Selection Screen
      │
      ├── Browse preset quiz sets (from Supabase questions table)
      ├── Search: "quantum mechanics hard"
      ├── Filter: [Subject] [Difficulty] [Exam Type] [Question Count]
      └── [Create Custom Quiz] → /quiz/create

User selects a quiz
      │
      ▼
Quiz Configuration Modal:
  • Difficulty (Easy/Medium/Hard/Mixed/Exam Mode)
  • Question count (5/10/15/20)
  • Timer (Relaxed/Standard/Exam/Off)
  • [Start Quiz]
      │
      ▼
API: POST /api/quiz/start
  Input: { subject, topic, difficulty, count, exam_mode? }
  Process:
    1. Query Supabase for matching questions
    2. If count not met, call AI to generate remaining
    3. Shuffle questions, create session record
  Output: { session_id, questions[] }
      │
      ▼
/quiz/[session_id] — Active Quiz Screen:
  ┌────────────────────────────────────────┐
  │  Q 4/10 | Subject · Topic | ⏱ 1:23   │
  │                                        │
  │  "What is the derivative of sin(x)?"   │
  │                                        │
  │  A. cos(x)    ← selected              │
  │  B. -cos(x)                           │
  │  C. tan(x)                            │
  │  D. -sin(x)                           │
  │                                        │
  │  [Next →]                              │
  └────────────────────────────────────────┘

On answer selected:
  • Highlight correct/incorrect immediately
  • Show explanation panel (slide up)
  • Update question-level timing
  • Play sound effect

On quiz complete:
      │
      ▼
API: POST /api/quiz/submit
  Input: { session_id, answers[], time_taken }
  Process:
    1. Calculate score
    2. Update user_progress accuracy per topic
    3. Award XP (formula: base_xp * difficulty_multiplier * accuracy_bonus)
    4. Update user_stats (quizzes_taken++)
    5. Check achievement triggers
    6. Update streak
  Output: { score, xp_earned, new_achievements, accuracy_by_topic }
      │
      ▼
Quiz Results Screen:
  ┌────────────────────────────────────────┐
  │  🏆 7/10 — Great work!                 │
  │  +175 XP earned                        │
  │                                        │
  │  Accuracy by Topic:                    │
  │  Derivatives  ████████░░ 80%           │
  │  Chain Rule   ██████░░░░ 60%           │
  │                                        │
  │  Weak areas: Chain Rule, Integration   │
  │  [Review Mistakes] [Retry] [Dashboard]  │
  └────────────────────────────────────────┘
```

---

## 5. Flashcard Flow (SM-2)

```
/flashcards — Deck List
  Shows: All user decks + public library decks
  Actions: Create deck, Generate with AI, Import Anki
      │
User clicks "Study" on a deck
      │
      ▼
API: GET /api/flashcards/due?deck_id={id}
  Returns cards where due_date <= today, ordered by priority
      │
      ▼
/flashcards/[id] — Study Session:

  Card shows front face
  ┌─────────────────────────────────┐
  │  "Power Rule"                   │
  │                                 │
  │  [Flip Card]                    │
  └─────────────────────────────────┘

  User flips → back shows
  ┌─────────────────────────────────┐
  │  d/dx(xⁿ) = nxⁿ⁻¹             │
  │                                 │
  │  How well did you know this?    │
  │  [😵 Forgot] [😰 Hard] [🙂 OK] [😊 Easy] │
  └─────────────────────────────────┘

  On rating selected:
      │
      ▼
  API: POST /api/flashcards/review
    Input: { card_id, quality: 0-5 }
    Process:
      1. Run SM-2 algorithm (src/lib/sm2.ts)
      2. Update card: ease_factor, interval, repetitions, due_date
      3. Award XP (5 XP per card reviewed)
    Output: { next_due: "2026-06-15", interval_days: 3 }

  Next card appears → repeat
  Session ends when all due cards reviewed

  Session Summary:
    Cards reviewed: 15
    Due tomorrow: 3
    Due in 3 days: 8
    +75 XP earned
```

---

## 6. Focus Room Flow

```
/focus-room loads
      │
      ▼
User configures:
  ┌──────────────────────────────────┐
  │  Session Type:                   │
  │  [Sprint 25min] [Deep 45min]     │
  │  [Marathon 60min]                │
  │                                  │
  │  Subject: [Mathematics ▼]        │
  │  Background: [Deep Space ▼]      │
  │  Sound: [Lofi ♪] [Rain]          │
  │         [Waves] [Nature]         │
  │  [Start Focus Session]           │
  └──────────────────────────────────┘
      │
      ▼
Timer runs:
  • Web Audio API plays selected ambient sound
  • Background orb animates
  • Timer counts down (Service Worker keeps it alive)
  • Mini task list visible on side
      │
      ▼
API: POST /api/sessions/start
  { user_id, subject, duration, session_type }
      │
Timer completes (or user stops early):
      │
      ▼
API: POST /api/sessions/complete
  { session_id, actual_duration, completed: true|false }
  Process:
    1. Save to study_sessions table
    2. Calculate XP (5 XP/minute for completed, 3 XP/minute partial)
    3. Update user_stats (total_study_mins, streak)
    4. Update contribution heatmap data
    5. Check achievements (e.g., "3 sessions in one day")
      │
      ▼
Session Complete Modal:
  ┌─────────────────────────────────┐
  │  🎯 Focus session complete!     │
  │  25 minutes of Mathematics      │
  │  +125 XP earned                 │
  │  Streak: 🔥 7 days              │
  │                                 │
  │  [Start Break] [New Session]    │
  │  [Go to Dashboard]              │
  └─────────────────────────────────┘
```

---

## 7. AI Assistant Flow

```
/ai-assistant

Sidebar: Mode selector
  ┌──────────────────────┐
  │ 📚 Study Assistant   │ ← default
  │ 🔢 Math Solver       │
  │ 💻 Code Debugger     │
  │ ✍️  Essay Reviewer   │
  │ 📋 Exam Simulator    │
  └──────────────────────┘

Chat interface:
  User types: "Explain the chain rule with examples"
      │
  API: POST /api/ai/chat
    Input: { messages[], mode: 'study_assistant', context: { subject, weak_areas } }
    Process:
      1. Check rate limit (10/min)
      2. Build system prompt based on mode
      3. Inject user context (weak areas, current subject)
      4. Stream response via TransformStream
    Output: Streaming text response with markdown
      │
  Response renders with:
    • Markdown formatting
    • KaTeX for math: $\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)$
    • Code blocks with syntax highlighting
    • Suggested follow-up questions

  File attachment flow:
    User clicks 📎 → uploads image of textbook page
    Image sent as base64 with message
    AI describes and explains the content
```

---

## 8. Study Plan Flow (NEW)

```
/study-plan

If no plan exists:
  ┌──────────────────────────────────┐
  │  Generate Your Study Plan        │
  │                                  │
  │  Exam: [JEE Advanced ▼]          │
  │  Date: [March 2027 📅]           │
  │  Hours/day: [5-6 hrs ▼]          │
  │  Subjects: [already from profile]│
  │                                  │
  │  [Generate Plan with AI →]       │
  └──────────────────────────────────┘
      │
  API: POST /api/study-plan/generate
    Input: { exam, date, hours_per_day, subjects, weak_areas }
    AI builds:
      • Week-by-week topic schedule
      • Daily time allocation per subject
      • Revision cycles (every 2 weeks)
      • Practice test dates
      • Buffer weeks before exam
      │
  Plan renders as:
    Tab 1: Weekly Calendar view
    Tab 2: Subject timeline (Gantt-style)
    Tab 3: Daily targets

If plan exists:
  Shows today's targets:
  ┌──────────────────────────────────┐
  │  Today's Study Plan              │
  │  Week 12, Day 3                  │
  │                                  │
  │  ✅ Mathematics — Integrals (2h) │
  │  🔄 Physics — Thermodynamics (2h)│
  │  ⏳ Chemistry — Organic (1h)     │
  │                                  │
  │  Progress: 40% ████░░░░░░       │
  └──────────────────────────────────┘
```

---

## 9. XP & Achievement Award Flow

```
Any activity completes
      │
      ▼
XP calculation:
  Quiz:        base_xp(100) × difficulty(1x/1.5x/2x) × accuracy_bonus
  Focus:       5 XP × minutes completed
  Flashcard:   5 XP per card reviewed
  Task:        25-100 XP based on priority
  Note:        50 XP for creating, 25 XP for AI actions
  Streak:      bonus 50 XP for 7-day streak
      │
      ▼
API: POST /api/xp/award (internal)
  1. INSERT into xp_log
  2. UPDATE user_stats.total_xp
  3. Calculate new level from total_xp
  4. If leveled up → trigger level-up event
  5. Check all achievement conditions
      │
      ▼
Frontend receives XP award response:
  → XPToast component shows "+175 XP 🎯"
  → If level up: LevelUpModal with confetti
  → If new achievement: AchievementModal slides in
```

---

## 10. Study Room (Real-Time) Flow

```
/social → Create Study Room
      │
User fills: Name, subject, max members
      │
API: POST /api/rooms
  Returns: { room_id, join_code: "XK7P2Q" }
      │
User shares code with friends
      │
Friends visit /social → Enter Code: "XK7P2Q"
      │
API: POST /api/rooms/join
      │
All users enter /social/rooms/XK7P2Q
      │
Supabase Realtime channel: `room:XK7P2Q`
      │
Room interface:
  ┌────────────────────────────────────────┐
  │  📚 Calculus Study Room               │
  │  Members: Sarah · Rahul · You (3/10)  │
  ├────────────────────────────────────────┤
  │  SHARED POMODORO TIMER                 │
  │         🔥 23:41                       │
  │  [Host: Start] [Pause]                │
  ├─────────────────┬──────────────────────┤
  │  CHAT           │  QUIZ BATTLE         │
  │  Sarah: Starting│  [Start Battle]      │
  │  now!           │  (everyone answers   │
  │  You: Let's go  │   same questions,    │
  │  Rahul: 💪      │   ranked by speed    │
  │  [Message...]   │   + accuracy)        │
  └─────────────────┴──────────────────────┘

Timer broadcast every second from host:
  channel.send({ event: 'timer_tick', payload: { seconds: 1421 } })
All members receive and sync their display
```

---

## 11. Error States & Recovery

| Scenario | Handling |
|---|---|
| AI API unavailable | Show "AI temporarily unavailable. Using local question bank." — fall back to hardcoded questions |
| Supabase down | Show "Offline mode — progress will sync when reconnected." — use localStorage as cache |
| Auth token expired | Clerk auto-refreshes tokens; on failure, redirect to /sign-in |
| Network offline | Service Worker serves cached quiz/flashcard content; queue sync actions |
| Rate limit hit | Show toast "Too many requests — please wait 1 minute" |
| Build error | Vercel auto-rollback to last successful deployment |

---

## 12. Mobile Flow (PWA)

```
User visits studysprint.vercel.app on mobile
      │
Browser shows "Add to Home Screen" prompt (after 2 visits)
      │
User installs PWA → icon on home screen
      │
Opens like native app:
  • Full screen (no browser chrome)
  • Offline: can take quiz, review flashcards from cache
  • Background sync: study session timer continues when phone sleeps
  • Push notifications: "Your 7-day streak is at risk! Study now."
```

---

*Document Owner: Pal Shah | Updated on every flow change*
