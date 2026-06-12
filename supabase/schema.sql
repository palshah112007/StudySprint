-- StudySprint Database Schema
-- Run this in Supabase SQL Editor

-- Users table (synced from Clerk via webhook)
CREATE TABLE IF NOT EXISTS public.users (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE,
  username     TEXT,
  display_name TEXT,
  avatar_url   TEXT,
  goal         TEXT,
  subjects     TEXT[],
  timezone     TEXT DEFAULT 'Asia/Kolkata',
  onboarded    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id            TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  total_xp           INTEGER DEFAULT 0,
  level              INTEGER DEFAULT 1,
  streak             INTEGER DEFAULT 0,
  longest_streak     INTEGER DEFAULT 0,
  last_active        DATE DEFAULT CURRENT_DATE,
  total_study_mins   INTEGER DEFAULT 0,
  quizzes_taken      INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject       TEXT NOT NULL,
  topic         TEXT NOT NULL,
  subtopic      TEXT,
  question      TEXT NOT NULL,
  options       JSONB NOT NULL,
  correct_idx   INTEGER NOT NULL,
  explanation   TEXT,
  difficulty    TEXT CHECK (difficulty IN ('easy','medium','hard')),
  question_type TEXT DEFAULT 'mcq_single',
  exam_tags     TEXT[],
  source        TEXT DEFAULT 'curated',
  verified      BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_exam_tags ON public.questions USING GIN(exam_tags);

CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  topic       TEXT,
  difficulty  TEXT,
  exam_mode   TEXT,
  score       INTEGER NOT NULL DEFAULT 0,
  total       INTEGER NOT NULL DEFAULT 0,
  time_taken  INTEGER,
  xp_earned   INTEGER DEFAULT 0,
  answers     JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  subject      TEXT,
  duration     INTEGER NOT NULL,
  session_type TEXT DEFAULT 'pomodoro',
  completed    BOOLEAN DEFAULT TRUE,
  xp_earned    INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  content      TEXT,
  subject      TEXT,
  tags         TEXT[],
  pinned       BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  subject     TEXT,
  priority    TEXT DEFAULT 'medium',
  category    TEXT DEFAULT 'other',
  due_date    DATE,
  completed   BOOLEAN DEFAULT FALSE,
  xp_reward   INTEGER DEFAULT 25,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  subject    TEXT,
  is_public  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flashcards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id      UUID REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  user_id      TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  front        TEXT NOT NULL,
  back         TEXT NOT NULL,
  ease_factor  FLOAT DEFAULT 2.5,
  interval     INTEGER DEFAULT 1,
  repetitions  INTEGER DEFAULT 0,
  due_date     DATE DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.xp_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  amount     INTEGER NOT NULL,
  source     TEXT NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Real-time study rooms
CREATE TABLE IF NOT EXISTS public.study_rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  host_id     TEXT REFERENCES public.users(id),
  subject     TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  timer_state JSONB DEFAULT '{"seconds":1500,"running":false}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at  TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);

CREATE TABLE IF NOT EXISTS public.room_members (
  room_id   UUID REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id   TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(room_id, user_id)
);

-- Documents/PDF storage
CREATE TABLE IF NOT EXISTS public.documents (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  filename   TEXT NOT NULL,
  url        TEXT NOT NULL,
  size_bytes INTEGER,
  content    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study plans
CREATE TABLE IF NOT EXISTS public.study_plans (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  exam       TEXT,
  exam_date  DATE,
  hours_per_day INTEGER DEFAULT 4,
  subjects   TEXT[],
  plan_data  JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users manage own data)
CREATE POLICY "own_data" ON public.quiz_sessions FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.study_sessions FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.notes FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.tasks FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.flashcard_decks FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.flashcards FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.xp_log FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.study_plans FOR ALL USING (user_id = auth.uid()::text);
CREATE POLICY "own_data" ON public.documents FOR ALL USING (user_id = auth.uid()::text);
-- Public questions readable by all
CREATE POLICY "public_read" ON public.questions FOR SELECT USING (TRUE);
-- Rooms readable by all
CREATE POLICY "rooms_readable" ON public.study_rooms FOR SELECT USING (TRUE);