# StudySprint — Technical Requirements Document (TRD)
**Version:** 2.0 | **Status:** Engineering Reference | **Last Updated:** June 2026

---

## 1. Current Tech Stack Audit

### What Exists
| Layer | Technology | Status |
|---|---|---|
| Framework | Next.js 15.5 (App Router) | ✅ Production-ready |
| Language | TypeScript 5.7 (strict mode) | ✅ Configured |
| Styling | Tailwind CSS v4 | ✅ Working |
| Animation | Framer Motion 12 | ✅ In use |
| Icons | Lucide React | ✅ In use |
| Charts | Recharts 3 | ✅ Upgraded |
| AI | Multi-provider (OpenRouter/Groq/xAI/OpenAI) via openai SDK | ✅ Working |
| Auth | Clerk (conditional — works without keys too) | ⚠️ Not fully wired |
| Persistence | localStorage via persistence.ts | ❌ Not scalable |
| Database | None | ❌ Missing |
| Real-time | None | ❌ Missing |
| File Storage | None | ❌ Missing |
| Email | None | ❌ Missing |
| Analytics | Vercel Analytics + Speed Insights | ✅ Imported |
| Deployment | Vercel (target) | ⚠️ Not deployed yet |

### Critical Gaps
1. No database — all state in localStorage, lost on browser clear
2. No file storage — PDF upload feature not possible
3. No real-time — collaborative features are fake static data
4. No email service — no onboarding, no weekly reports
5. No search — no way to search questions, notes, or content

---

## 2. Target Architecture (v2.0)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser / PWA)                    │
│  Next.js 15 App Router · React 19 · Tailwind v4             │
│  Framer Motion · Recharts · TipTap Editor · KaTeX           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                  NEXT.JS API ROUTES (Edge/Node)              │
│  /api/ai/* · /api/quiz/* · /api/upload · /api/reports       │
│  Rate limiting · Auth middleware · Input validation          │
└──────┬─────────────────────┬────────────────────────────────┘
       │                     │
┌──────▼──────┐    ┌────────▼────────────────────────────────┐
│  AI Layer   │    │            SUPABASE                      │
│  OpenRouter │    │  PostgreSQL · Auth (RLS) · Realtime      │
│  Groq       │    │  Storage (PDFs, images)                  │
│  OpenAI     │    │  Edge Functions                          │
│  (fallback  │    └─────────────────────────────────────────┘
│   chain)    │
└─────────────┘
```

---

## 3. Database Schema (Supabase PostgreSQL)

### 3.1 Users & Auth
```sql
-- Handled by Clerk, synced to Supabase via webhook
CREATE TABLE public.users (
  id           UUID PRIMARY KEY,           -- Clerk user ID
  email        TEXT NOT NULL UNIQUE,
  username     TEXT,
  display_name TEXT,
  avatar_url   TEXT,
  goal         TEXT,                       -- 'jee'|'neet'|'gate'|'college'|'self'
  subjects     TEXT[],                     -- ['Mathematics', 'Physics', ...]
  timezone     TEXT DEFAULT 'Asia/Kolkata',
  onboarded    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Questions Bank
```sql
CREATE TABLE public.questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject      TEXT NOT NULL,              -- 'Mathematics'
  topic        TEXT NOT NULL,              -- 'Calculus'
  subtopic     TEXT,                       -- 'Derivatives'
  question     TEXT NOT NULL,
  options      JSONB NOT NULL,             -- ["A", "B", "C", "D"]
  correct_idx  INTEGER NOT NULL,           -- 0-3
  explanation  TEXT,
  difficulty   TEXT CHECK (difficulty IN ('easy','medium','hard')),
  question_type TEXT DEFAULT 'mcq_single', -- 'mcq_single'|'mcq_multi'|'integer'|'truefalse'
  exam_tags    TEXT[],                     -- ['jee_main','jee_advanced','neet']
  source       TEXT,                       -- 'curated'|'ai_generated'|'community'
  year         INTEGER,                    -- exam year if from past papers
  verified     BOOLEAN DEFAULT FALSE,
  upvotes      INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  -- Full-text search
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', question || ' ' || subject || ' ' || topic)
  ) STORED
);

CREATE INDEX idx_questions_subject ON public.questions(subject);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_questions_exam_tags ON public.questions USING GIN(exam_tags);
CREATE INDEX idx_questions_search ON public.questions USING GIN(search_vector);
```

### 3.3 User Progress
```sql
CREATE TABLE public.user_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject      TEXT NOT NULL,
  topic        TEXT NOT NULL,
  accuracy     FLOAT DEFAULT 0,           -- 0.0 to 1.0
  attempts     INTEGER DEFAULT 0,
  last_practiced TIMESTAMPTZ,
  mastery_level INTEGER DEFAULT 0,        -- 0-5
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subject, topic)
);
```

### 3.4 Quiz Sessions
```sql
CREATE TABLE public.quiz_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL,
  topic         TEXT,
  difficulty    TEXT,
  exam_mode     TEXT,                      -- null or 'jee_main' etc.
  score         INTEGER NOT NULL,
  total         INTEGER NOT NULL,
  time_taken    INTEGER,                   -- seconds
  xp_earned     INTEGER DEFAULT 0,
  answers       JSONB,                     -- [{question_id, selected, correct, time_ms}]
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 Flashcard Decks
```sql
CREATE TABLE public.flashcard_decks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  subject     TEXT,
  description TEXT,
  is_public   BOOLEAN DEFAULT FALSE,
  card_count  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.flashcards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id      UUID REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
  front        TEXT NOT NULL,
  back         TEXT NOT NULL,
  -- SM-2 Algorithm fields
  ease_factor  FLOAT DEFAULT 2.5,
  interval     INTEGER DEFAULT 1,          -- days
  repetitions  INTEGER DEFAULT 0,
  due_date     DATE DEFAULT CURRENT_DATE,
  last_reviewed DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.6 Study Sessions (Focus Room)
```sql
CREATE TABLE public.study_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
  subject      TEXT,
  duration     INTEGER NOT NULL,           -- minutes
  session_type TEXT DEFAULT 'pomodoro',    -- 'pomodoro'|'deep'|'marathon'
  completed    BOOLEAN DEFAULT TRUE,
  xp_earned    INTEGER DEFAULT 0,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.7 Notes
```sql
CREATE TABLE public.notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT,                         -- rich text JSON (Tiptap format)
  content_text TEXT,                       -- plain text for search
  subject    TEXT,
  tags       TEXT[],
  pinned     BOOLEAN DEFAULT FALSE,
  is_public  BOOLEAN DEFAULT FALSE,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || COALESCE(content_text, ''))
  ) STORED
);

CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_search ON public.notes USING GIN(search_vector);
```

### 3.8 Tasks
```sql
CREATE TABLE public.tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  subject     TEXT,
  priority    TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  category    TEXT DEFAULT 'other',
  due_date    DATE,
  completed   BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  xp_reward   INTEGER DEFAULT 25,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.9 User XP & Gamification
```sql
CREATE TABLE public.user_stats (
  user_id       UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  total_xp      INTEGER DEFAULT 0,
  level         INTEGER DEFAULT 1,
  streak        INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active   DATE DEFAULT CURRENT_DATE,
  total_study_mins INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  flashcards_reviewed INTEGER DEFAULT 0,
  notes_created INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.achievements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,            -- 'first_quiz', 'streak_7', etc.
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE public.xp_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  amount     INTEGER NOT NULL,
  source     TEXT NOT NULL,               -- 'quiz', 'flashcard', 'focus', 'task', 'streak'
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.10 Study Rooms (Collaborative)
```sql
CREATE TABLE public.study_rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,        -- 6-char join code
  name        TEXT NOT NULL,
  host_id     UUID REFERENCES public.users(id),
  max_members INTEGER DEFAULT 10,
  is_active   BOOLEAN DEFAULT TRUE,
  subject     TEXT,
  timer_state JSONB,                       -- shared Pomodoro state
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE TABLE public.room_members (
  room_id  UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id  UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);
```

### 3.11 Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Example policy: users can only see/edit their own data
CREATE POLICY "Users manage own data" ON public.quiz_sessions
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Public flashcard decks readable by all
CREATE POLICY "Public decks readable" ON public.flashcard_decks
  FOR SELECT USING (is_public = TRUE OR user_id::text = auth.uid()::text);
```

---

## 4. API Routes Specification

### 4.1 Current Routes
```
POST /api/ai/chat          — Streaming AI assistant
POST /api/ai/quiz          — AI quiz generation
POST /api/ai/flashcards    — AI flashcard generation
POST /api/ai/summarize     — Note summarization
```

### 4.2 New Routes Required
```
# Auth & User
POST   /api/webhooks/clerk          — Sync Clerk user to Supabase
GET    /api/users/me                — Get current user profile + stats
PATCH  /api/users/me                — Update profile, subjects, goal
POST   /api/users/onboarding        — Complete onboarding flow

# Questions
GET    /api/questions               — Query: subject, topic, difficulty, exam_tag, limit
GET    /api/questions/subjects      — List all subjects with topic counts
POST   /api/questions/generate      — AI generate + save questions to DB

# Quiz Sessions
POST   /api/quiz/start              — Create quiz session, return question IDs
POST   /api/quiz/submit             — Submit answers, calculate score, award XP
GET    /api/quiz/history            — Paginated quiz history for user
GET    /api/quiz/analytics          — Accuracy by subject/topic over time

# Flashcards
GET    /api/flashcards/decks        — User's decks
POST   /api/flashcards/decks        — Create deck
DELETE /api/flashcards/decks/:id    — Delete deck
GET    /api/flashcards/due          — Cards due for review today (SM-2)
POST   /api/flashcards/review       — Submit review result, update SM-2 state

# Focus Sessions
POST   /api/sessions/start          — Log session start
POST   /api/sessions/complete       — Complete session, award XP
GET    /api/sessions/stats          — Aggregate stats (total hours, streak)

# Notes
GET    /api/notes                   — User's notes with search
POST   /api/notes                   — Create note
PATCH  /api/notes/:id               — Update note
DELETE /api/notes/:id               — Delete note

# File Upload
POST   /api/upload/pdf              — Upload PDF to Supabase Storage
POST   /api/upload/image            — Upload image (note attachment)
GET    /api/upload/:id/extract      — Extract text from uploaded PDF via AI

# Study Plans
POST   /api/study-plan/generate     — AI generate plan from goal + subjects + date
GET    /api/study-plan/current      — Get active plan for user
PATCH  /api/study-plan/progress     — Update plan progress

# Gamification
GET    /api/leaderboard             — Top 100 users by XP (real data)
GET    /api/leaderboard/friends     — Friends leaderboard
GET    /api/achievements            — User's achievements
POST   /api/xp/award                — Internal: award XP with source

# Study Rooms
POST   /api/rooms                   — Create room, return join code
POST   /api/rooms/join              — Join room by code
DELETE /api/rooms/:id               — Close room (host only)
GET    /api/rooms/:id/state         — Get current room state

# Reports
GET    /api/reports/weekly          — Weekly summary data
POST   /api/reports/send-email      — Send weekly report email via Resend
```

---

## 5. SM-2 Spaced Repetition Algorithm

```typescript
// src/lib/sm2.ts
interface ReviewResult {
  ease_factor: number;   // Current ease factor
  interval: number;      // Days until next review
  repetitions: number;   // Number of successful reviews
}

type Quality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout
// 1 = wrong, recognized on seeing
// 2 = wrong, easy to recall  
// 3 = correct with difficulty
// 4 = correct with hesitation
// 5 = perfect

export function calculateNextReview(
  card: ReviewResult,
  quality: Quality
): ReviewResult {
  const q = quality;
  let { ease_factor, interval, repetitions } = card;

  if (q < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease_factor);
    }
    repetitions += 1;
  }

  // Update ease factor
  ease_factor = ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  ease_factor = Math.max(1.3, ease_factor); // Never below 1.3

  return { ease_factor, interval, repetitions };
}
```

---

## 6. File Upload Architecture (PDF Processing)

```
User uploads PDF
      ↓
/api/upload/pdf
      ↓
1. Validate: max 10MB, PDF only
2. Upload to Supabase Storage (bucket: 'documents')
3. Store metadata in documents table
4. Return: { document_id, file_url }
      ↓
User clicks "Generate Quiz from PDF"
      ↓
/api/upload/:id/extract
      ↓
1. Fetch PDF from Supabase Storage
2. Extract text via pdf-parse npm package
3. Chunk text into 2000-token segments  
4. Send to AI: "Generate 10 questions from this content: {chunk}"
5. Return: { questions[] }
```

---

## 7. Real-Time Architecture (Supabase Realtime)

```typescript
// Study Room — Shared Pomodoro Timer
import { createClient } from '@supabase/supabase-js';

const channel = supabase.channel(`room:${roomId}`)
  .on('broadcast', { event: 'timer_tick' }, ({ payload }) => {
    setTimerState(payload);
  })
  .on('broadcast', { event: 'member_joined' }, ({ payload }) => {
    setMembers(prev => [...prev, payload.user]);
  })
  .on('broadcast', { event: 'quiz_answer' }, ({ payload }) => {
    updateQuizBattle(payload);
  })
  .subscribe();

// Host broadcasts timer every second
setInterval(() => {
  channel.send({
    type: 'broadcast',
    event: 'timer_tick',
    payload: { seconds_remaining: timerRef.current }
  });
}, 1000);
```

---

## 8. AI Provider Architecture (Current — Keep As-Is)

The existing `ai-provider.ts` is well-architected with:
- Provider priority chain (OpenRouter → Groq → xAI → Nvidia → OpenAI)
- Automatic fallback on failure
- Configurable via environment variables

**Enhancements needed:**
```typescript
// Add to ai-provider.ts:
// 1. Response caching for identical quiz requests (Redis or Supabase)
// 2. Token usage tracking per user
// 3. Anthropic provider support

{
  name: "anthropic",
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: "https://api.anthropic.com/v1",
  model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
}
```

---

## 9. PWA Configuration

```typescript
// next.config.ts additions
import withPWA from 'next-pwa';

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.anthropic\.com/,
      handler: 'NetworkFirst',
    },
    {
      urlPattern: /\/api\/questions/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'questions-cache',
        expiration: { maxAgeSeconds: 3600 }, // 1 hour
      },
    },
  ],
});
```

---

## 10. Performance Budget

| Metric | Target | Current (estimated) |
|---|---|---|
| First Contentful Paint | < 1.5s | ~2.2s |
| Largest Contentful Paint | < 2.5s | ~3.5s |
| Time to Interactive | < 3.5s | ~4.8s |
| Bundle size (initial JS) | < 200KB | ~280KB |
| Lighthouse Score | ≥ 90 | ~65 |

**Optimization plan:**
1. Dynamic import all chart components (Recharts = 150KB)
2. Dynamic import Framer Motion on non-critical pages
3. Use `next/image` for ALL images
4. Add `loading="lazy"` to below-fold content
5. Preload critical fonts with `rel="preload"`
6. Add `Suspense` + `loading.tsx` to all routes (done)

---

## 11. Security Checklist

- [x] API routes rate-limited (10 req/min/IP)
- [x] Clerk auth on all dashboard routes
- [x] Admin route redirected
- [x] Security headers in vercel.json
- [ ] Supabase RLS on all tables
- [ ] Input sanitization on all POST routes (add `zod` validation)
- [ ] File upload validation (type + size)
- [ ] CSRF protection (Next.js App Router handles this)
- [ ] Rate limit by user ID (not just IP) for authenticated routes
- [ ] SQL injection prevention (Supabase client uses parameterized queries)

---

## 12. Environment Variables Reference

```bash
# === REQUIRED ===
NEXT_PUBLIC_APP_URL=https://studysprint.vercel.app

# === AI (at least one required) ===
OPENROUTER_API_KEY=sk-or-...     # Free tier available
GROQ_API_KEY=gsk_...              # Very fast, free tier
OPENAI_API_KEY=sk-...
XAI_API_KEY=...
ANTHROPIC_API_KEY=sk-ant-...     # For claude-sonnet-4-6

# === AUTH ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...   # For user sync webhook

# === DATABASE ===
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Server-side only, never expose

# === STORAGE ===
# Included in Supabase keys above

# === EMAIL ===
RESEND_API_KEY=re_...             # Weekly reports

# === BUILD ===
NEXT_TELEMETRY_DISABLED=1
```

---

*Document Owner: Pal Shah | Engineering Reference — Update on every architectural change*
