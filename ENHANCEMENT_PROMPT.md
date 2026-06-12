# StudySprint — Master Enhancement Prompt (Codex / Claude Code)
**Use this in:** Claude Code, Cursor, Windsurf, Codex
**How to use:** Run one PHASE at a time in a fresh session. Do not combine phases.

---

## PHASE 1 — Supabase Integration (Database Layer)
**Estimated time:** 3–4 hours | **Priority:** P0 — Everything depends on this

```
Repo: StudySprint — Next.js 15.5 App Router, TypeScript strict mode.
Task: Install and wire Supabase as the production database.

CONSTRAINTS:
- Do NOT break any existing UI or functionality
- Keep localStorage as offline fallback (do not delete persistence.ts)
- All new Supabase calls must have proper error handling with fallback to localStorage
- Do NOT expose SUPABASE_SERVICE_ROLE_KEY in any client component

---

STEP 1 — Install packages:
npm install @supabase/supabase-js @supabase/ssr

---

STEP 2 — Create src/lib/supabase/client.ts:

  import { createBrowserClient } from '@supabase/ssr'
  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

---

STEP 3 — Create src/lib/supabase/server.ts:

  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  export async function createClient() {
    const cookieStore = await cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          },
        },
      }
    )
  }

---

STEP 4 — Create src/lib/supabase/admin.ts:

  import { createClient } from '@supabase/supabase-js'
  // SERVICE ROLE — server-side only, never import in client components
  export const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

---

STEP 5 — Create supabase/schema.sql (run this in Supabase SQL editor):

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

  -- RLS Policies (users manage own data)
  CREATE POLICY "own_data" ON public.quiz_sessions FOR ALL USING (user_id = auth.uid()::text);
  CREATE POLICY "own_data" ON public.study_sessions FOR ALL USING (user_id = auth.uid()::text);
  CREATE POLICY "own_data" ON public.notes FOR ALL USING (user_id = auth.uid()::text);
  CREATE POLICY "own_data" ON public.tasks FOR ALL USING (user_id = auth.uid()::text);
  CREATE POLICY "own_data" ON public.flashcard_decks FOR ALL USING (user_id = auth.uid()::text);
  CREATE POLICY "own_data" ON public.flashcards FOR ALL USING (user_id = auth.uid()::text);
  -- Public questions readable by all
  CREATE POLICY "public_read" ON public.questions FOR SELECT USING (TRUE);

---

STEP 6 — Create Clerk webhook route src/app/api/webhooks/clerk/route.ts:
(Syncs new users from Clerk to Supabase)

  import { Webhook } from 'svix'
  import { headers } from 'next/headers'
  import { adminClient } from '@/lib/supabase/admin'

  export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) return new Response('No webhook secret', { status: 500 })

    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Missing svix headers', { status: 400 })
    }

    const body = await req.text()
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: { type: string; data: { id: string; email_addresses: Array<{ email_address: string }>; first_name: string; last_name: string; image_url: string } }

    try {
      evt = wh.verify(body, { 'svix-id': svix_id, 'svix-timestamp': svix_timestamp, 'svix-signature': svix_signature }) as typeof evt
    } catch {
      return new Response('Webhook verification failed', { status: 400 })
    }

    if (evt.type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data
      await adminClient.from('users').upsert({
        id,
        email: email_addresses[0].email_address,
        display_name: `${first_name || ''} ${last_name || ''}`.trim() || 'Student',
        avatar_url: image_url,
      })
      await adminClient.from('user_stats').upsert({ user_id: id })
    }

    if (evt.type === 'user.deleted') {
      await adminClient.from('users').delete().eq('id', evt.data.id)
    }

    return new Response('OK', { status: 200 })
  }

npm install svix

---

STEP 7 — Create src/lib/xp.ts:

  import { adminClient } from './supabase/admin'

  export function calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  export async function awardXP(
    userId: string,
    amount: number,
    source: string,
    metadata?: Record<string, unknown>
  ) {
    await adminClient.from('xp_log').insert({ user_id: userId, amount, source, metadata })
    const { data: stats } = await adminClient
      .from('user_stats').select('total_xp, level').eq('user_id', userId).single()
    const new_xp = (stats?.total_xp || 0) + amount
    const new_level = calculateLevel(new_xp)
    await adminClient.from('user_stats').upsert({
      user_id: userId, total_xp: new_xp, level: new_level,
      updated_at: new Date().toISOString(),
    })
    return { new_xp, new_level, leveled_up: new_level > (stats?.level || 1) }
  }

---

STEP 8 — Update .env.example to add:
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  CLERK_WEBHOOK_SECRET=whsec_...

---

STEP 9 — Create src/lib/migrate-local-data.ts:
When a user logs in for the first time on a device that has local data,
migrate their localStorage data to Supabase silently.

  'use client'
  import { createClient } from './supabase/client'
  import { loadData } from './persistence'

  export async function migrateIfNeeded(userId: string) {
    if (localStorage.getItem('ss_migrated_v2')) return
    const supabase = createClient()
    const notes = loadData<Note[]>('notes', [])
    const tasks = loadData<Task[]>('tasks', [])
    const state = loadData<UserState>('user_state', null)

    const ops = []
    if (notes.length > 0) {
      ops.push(supabase.from('notes').insert(notes.map(n => ({ ...n, id: undefined, user_id: userId }))))
    }
    if (tasks.length > 0) {
      ops.push(supabase.from('tasks').insert(tasks.map(t => ({ ...t, id: undefined, user_id: userId }))))
    }
    if (state?.totalXp) {
      ops.push(supabase.from('user_stats').upsert({ user_id: userId, total_xp: state.totalXp, streak: state.streak || 0 }))
    }
    await Promise.allSettled(ops)
    localStorage.setItem('ss_migrated_v2', 'true')
  }

---

VERIFY: npm run build → must pass with zero errors.
```

---

## PHASE 2 — Question Bank (3000+ Questions)
**Estimated time:** 4–5 hours | **Priority:** P0 — Core content

```
Repo: StudySprint. Task: Create a comprehensive curated question bank
across 8 major subjects with exam tagging.

Create these files. Each file exports an array of question objects
matching this TypeScript interface:
interface Question {
  subject: string;
  topic: string;
  subtopic?: string;
  question: string;
  options: string[];       // exactly 4 options
  correct_idx: number;     // 0-3
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  exam_tags: string[];     // from: ['jee_main','jee_advanced','neet','gate_cs','gate_ee','cat','upsc','sat','gre','general']
  source: 'curated';
  verified: boolean;       // always true for hand-crafted questions
}

---

FILE 1: src/data/questions/mathematics.ts
Create 200 questions covering:
- Algebra (25 Qs): linear/quadratic equations, polynomials, inequalities, complex numbers
- Calculus (50 Qs): limits, derivatives (power/chain/product/quotient rules), integrals (definite/indefinite, substitution, by parts), differential equations
- Trigonometry (25 Qs): identities, inverse trig, equations, heights & distances
- Coordinate Geometry (25 Qs): straight lines, circles, parabola, ellipse, hyperbola
- Vectors & 3D (20 Qs): dot product, cross product, planes, lines in space
- Probability & Statistics (25 Qs): Bayes theorem, distributions, mean/variance, permutations/combinations
- Matrices & Determinants (20 Qs)
- Number Theory (10 Qs): GCD, LCM, modular arithmetic
Tag JEE questions with exam_tags: ['jee_main'] or ['jee_advanced'] where relevant.
Include 3 difficulty levels for each topic.

---

FILE 2: src/data/questions/physics.ts
Create 150 questions covering:
- Mechanics (35 Qs): Newton's laws, kinematics, work-energy, rotational motion, gravitation
- Thermodynamics (20 Qs): laws of thermodynamics, heat engines, entropy, ideal gas
- Waves & Optics (25 Qs): wave properties, interference, diffraction, lens/mirror formulas, doppler
- Electromagnetism (35 Qs): Coulomb's law, Gauss's law, circuits, Faraday's law, Maxwell's equations
- Modern Physics (20 Qs): photoelectric effect, atomic models, nuclear physics, radioactivity
- Fluid Mechanics (15 Qs): Bernoulli, Pascal, Archimedes
Tag NEET-relevant questions with exam_tags: ['neet'].
Tag JEE-relevant questions with exam_tags: ['jee_main'] or ['jee_advanced'].

---

FILE 3: src/data/questions/chemistry.ts
Create 150 questions covering:
- Organic Chemistry (50 Qs): IUPAC naming, reactions (substitution, addition, elimination), functional groups, isomerism, reaction mechanisms, named reactions (Aldol, Cannizzaro, Diels-Alder)
- Inorganic Chemistry (40 Qs): periodic table trends, chemical bonding, coordination compounds, d-block elements, p-block elements
- Physical Chemistry (40 Qs): mole concept, stoichiometry, electrochemistry, chemical equilibrium, thermochemistry, kinetics, solutions
- Environmental Chemistry (10 Qs): pollution, green chemistry
- Analytical Chemistry (10 Qs): titration, spectroscopy basics
Tag NEET questions with ['neet'], JEE with ['jee_main','jee_advanced'].

---

FILE 4: src/data/questions/computer-science.ts
Create 200 questions covering:
- Data Structures (40 Qs): arrays, linked lists, stacks, queues, trees (BST, AVL, heap), graphs, hash tables
- Algorithms (50 Qs): sorting (bubble, merge, quick, heap), searching, BFS, DFS, Dijkstra, dynamic programming, greedy, divide & conquer — all with time/space complexity
- Operating Systems (30 Qs): process scheduling, deadlock, memory management, file systems, paging/segmentation
- Databases (30 Qs): SQL (SELECT, JOIN, GROUP BY, HAVING, indexes), normalization, transactions, ACID, NoSQL vs SQL
- Computer Networks (25 Qs): OSI model, TCP/IP, HTTP, DNS, routing protocols
- System Design basics (15 Qs): load balancing, caching, CAP theorem, microservices
- OOPS Concepts (10 Qs): inheritance, polymorphism, encapsulation, abstraction, design patterns
Tag GATE questions with exam_tags: ['gate_cs'].

---

FILE 5: src/data/questions/biology.ts
Create 120 questions covering:
- Cell Biology (20 Qs): cell organelles, cell division (mitosis/meiosis), membrane transport
- Genetics (25 Qs): Mendel's laws, DNA structure/replication, RNA/protein synthesis, mutations, heredity
- Human Physiology (30 Qs): nervous system, circulatory system, digestive system, respiratory system, endocrine system, immune system
- Ecology (15 Qs): food chains, ecosystems, biodiversity, environmental issues
- Evolution (10 Qs): Darwin's theory, natural selection, speciation
- Plant Biology (20 Qs): photosynthesis, plant hormones, reproduction
Tag all with exam_tags: ['neet'] for NEET-relevant questions.

---

FILE 6: src/data/questions/aptitude.ts
Create 150 questions covering:
- Quantitative Aptitude (60 Qs): percentages, profit-loss, time-speed-distance, work-time, ratio-proportion, averages, mixtures, interest (SI/CI), number series
- Logical Reasoning (50 Qs): blood relations, seating arrangements, direction sense, coding-decoding, syllogisms, input-output, analogies
- Verbal Ability (40 Qs): synonyms, antonyms, fill-in-the-blanks, reading comprehension, sentence correction, para jumbles
Tag with exam_tags: ['cat', 'sat', 'gre', 'upsc'] as appropriate.

---

FILE 7: src/data/questions/history-gk.ts
Create 80 questions covering:
- Modern Indian History (20 Qs): independence movement, major events 1857-1947
- Ancient & Medieval India (15 Qs): dynasties, cultural achievements
- World History (15 Qs): WW1, WW2, Cold War, major revolutions
- Indian Polity (15 Qs): Constitution, fundamental rights, parliament structure, judiciary
- Current Affairs basics (15 Qs): major awards, national days, sports, science achievements
Tag with exam_tags: ['upsc', 'general'].

---

FILE 8: src/data/questions/index.ts
Export all question arrays combined:

  export { mathQuestions } from './mathematics'
  export { physicsQuestions } from './physics'
  export { chemistryQuestions } from './chemistry'
  export { csQuestions } from './computer-science'
  export { biologyQuestions } from './biology'
  export { aptitudeQuestions } from './aptitude'
  export { historyGkQuestions } from './history-gk'
  
  export const ALL_QUESTIONS = [
    ...mathQuestions,
    ...physicsQuestions,
    ...chemistryQuestions,
    ...csQuestions,
    ...biologyQuestions,
    ...aptitudeQuestions,
    ...historyGkQuestions,
  ]
  
  export const SUBJECTS = [...new Set(ALL_QUESTIONS.map(q => q.subject))]

---

FILE 9: scripts/seed-questions.ts
  import { createClient } from '@supabase/supabase-js'
  import { ALL_QUESTIONS } from '../src/data/questions'
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  async function seed() {
    console.log(`Seeding ${ALL_QUESTIONS.length} questions...`)
    const chunkSize = 100
    for (let i = 0; i < ALL_QUESTIONS.length; i += chunkSize) {
      const chunk = ALL_QUESTIONS.slice(i, i + chunkSize)
      const { error } = await supabase.from('questions').insert(chunk)
      if (error) { console.error(`Chunk ${i} failed:`, error.message); continue }
      console.log(`✅ ${Math.min(i + chunkSize, ALL_QUESTIONS.length)}/${ALL_QUESTIONS.length}`)
    }
    console.log('Seeding complete!')
  }
  seed().catch(console.error)

Add to package.json scripts: "seed:questions": "npx tsx scripts/seed-questions.ts"

---

QUALITY STANDARDS for every question:
1. Every question must be factually accurate — double-check formulas, values, and concepts
2. Explanation must be 2-3 sentences explaining WHY the answer is correct
3. Wrong options must be plausible (common mistakes students make)
4. Difficulty breakdown per file: 30% easy, 50% medium, 20% hard
5. No duplicate questions — each must be unique

VERIFY: npx tsc --noEmit → must pass. npm run build → must pass.
```

---

## PHASE 3 — Onboarding Flow (NEW Feature)
**Estimated time:** 2–3 hours | **Priority:** P0

```
Repo: StudySprint. Task: Build the complete onboarding flow for new users.

Create: src/app/onboarding/page.tsx
This is a multi-step form shown to every new user who has onboarded=false.
After completion, POST to /api/users/onboarding which saves all data and sets onboarded=true.

STEP STRUCTURE (5 steps, show one at a time with animated progress bar):

Step 1 — Goal Selection:
  Title: "What's your primary goal?"
  6 options in a 2x3 grid:
  - JEE Main / Advanced (icon: 🎯)
  - NEET (icon: 🏥)
  - GATE (icon: ⚙️)
  - College Exams (icon: 🎓)
  - UPSC / Civil Services (icon: 🏛️)
  - Self Learning (icon: 🚀)
  Each option is a card with hover state. Click to select.

Step 2 — Subject Selection:
  Title: "Which subjects are you studying?"
  Subtitle: "Pick 3-6 subjects"
  Subjects as pill buttons (toggle on/off):
  Mathematics, Physics, Chemistry, Biology, Computer Science,
  History, Geography, Economics, English, Hindi, Aptitude, Logical Reasoning
  Validate: must select at least 3.

Step 3 — Exam Date:
  Title: "When is your exam?"
  Date picker OR "I don't have a fixed date" checkbox.
  If JEE selected: show "JEE 2026 or 2027?" buttons for quick select.

Step 4 — Daily Study Hours:
  Title: "How many hours can you study daily?"
  4 buttons: "1-2 hrs", "3-4 hrs", "5-6 hrs", "7+ hrs"

Step 5 — All done screen:
  Title: "You're all set! 🚀"
  Animated checkmark
  Shows: "Generating your personalized study plan..."
  Spinner while API call runs
  Then: "Your plan is ready!" + [Enter StudySprint →] button

DESIGN: Match existing StudySprint dark theme.
Use Framer Motion AnimatePresence for step transitions (slide in from right, slide out to left).
Progress bar at top showing step X of 5.

API Route: src/app/api/users/onboarding/route.ts
  - Requires auth
  - Input: { goal, subjects, examDate?, hoursPerDay }
  - Saves to users table: goal, subjects, onboarded=true
  - AI call: generate a basic study plan structure
  - Save study plan to user_stats metadata
  - Return: { success: true, studyPlan }

INTEGRATION:
In src/app/dashboard/page.tsx, add at top of component:
  const [user, setUser] = useState<UserProfile | null>(null)
  useEffect(() => {
    // Check if user needs onboarding
    supabase.from('users').select('onboarded').eq('id', userId).single()
      .then(({ data }) => {
        if (data && !data.onboarded) router.push('/onboarding')
      })
  }, [])

VERIFY: npm run build → must pass.
Test: New user flow (sign up → onboarding → dashboard).
```

---

## PHASE 4 — SM-2 Spaced Repetition Algorithm
**Estimated time:** 2 hours | **Priority:** P0

```
Repo: StudySprint. Task: Replace the fake Leitner box flashcard system
with a proper SM-2 spaced repetition algorithm backed by Supabase.

STEP 1 — Create src/lib/sm2.ts:

  export type Quality = 0 | 1 | 2 | 3 | 4 | 5

  export interface SM2Result {
    ease_factor: number
    interval: number
    repetitions: number
    due_date: string  // ISO date string
  }

  export function calculateNextReview(
    card: { ease_factor: number; interval: number; repetitions: number },
    quality: Quality
  ): SM2Result {
    let { ease_factor, interval, repetitions } = card
    
    if (quality < 3) {
      repetitions = 0
      interval = 1
    } else {
      if (repetitions === 0) interval = 1
      else if (repetitions === 1) interval = 6
      else interval = Math.round(interval * ease_factor)
      repetitions += 1
    }

    ease_factor = Math.max(1.3,
      ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    )

    const due = new Date()
    due.setDate(due.getDate() + interval)

    return {
      ease_factor,
      interval,
      repetitions,
      due_date: due.toISOString().split('T')[0],
    }
  }

  export function getQualityLabel(q: Quality): string {
    return ['Complete Blackout','Wrong (knew it)','Wrong (easy)','Correct (hard)','Correct','Perfect'][q]
  }

STEP 2 — Create API routes:

  src/app/api/flashcards/due/route.ts
  GET handler:
  - Requires auth
  - Query: ?deck_id=xxx&limit=20
  - Returns cards where due_date <= today, ordered by due_date ASC
  - Fetch from supabase: flashcards table

  src/app/api/flashcards/review/route.ts
  POST handler:
  - Requires auth
  - Input: { card_id: string, quality: 0|1|2|3|4|5 }
  - Fetch current card state from DB
  - Run calculateNextReview(card, quality)
  - Update card in DB with new ease_factor, interval, repetitions, due_date
  - Award 5 XP per card reviewed (call awardXP)
  - Return: { next_due, interval_days, xp_earned }

STEP 3 — Update src/app/flashcards/page.tsx:
  Replace the hardcoded "box" rating system (1-5 boxes) with quality rating:
  After card flip, show 4 buttons styled to match theme:
  - Button "😵 Forgot" → quality: 0
  - Button "😰 Hard" → quality: 2  
  - Button "🙂 Good" → quality: 4
  - Button "😊 Easy" → quality: 5
  
  On rating:
    1. POST /api/flashcards/review with { card_id, quality }
    2. Update UI: remove this card from deck, show next
    3. Show mini XP toast "+5 XP"
    4. On deck complete: show session summary with count + total XP

  Session summary component (show at end of review):
  - "Session complete! ✅"
  - "Cards reviewed: {count}"
  - "+{total_xp} XP earned"
  - "Next review: {date}"
  - [Study Another Deck] [Dashboard]

VERIFY: npm run build → must pass. TypeScript strict mode must pass.
```

---

## PHASE 5 — Study Plan Generator (AI Feature)
**Estimated time:** 2–3 hours | **Priority:** P1

```
Repo: StudySprint. Task: Build an AI-powered study plan generator page.

Create: src/app/study-plan/page.tsx
This is a new route accessible from the dashboard quick actions.

UI LAYOUT:
If user has no study plan:
  Show a setup form card (centered, max-width 500px):
  - Exam type select (JEE / NEET / GATE / College / Self-learning)
  - Exam date picker
  - Hours per day slider (1-10, default 4)
  - [Generate My Study Plan ✨] button (calls API)
  - Loading state: animated gradient "Generating your personalized plan..."

If user has a study plan:
  Show plan visualization:
  
  Tab 1 — Today's Goals:
  Subject breakdown for today with checkboxes:
  [ ] Mathematics — Chapter 12: Integration (90 min)
  [ ] Physics — Thermodynamics revision (60 min)
  [ ] Chemistry — Organic reactions practice (60 min)
  
  Tab 2 — Weekly View:
  7-column calendar-like layout showing topics per day
  
  Tab 3 — Full Timeline:
  Week-by-week schedule as a text list
  "Week 1 (Jun 12-18): Calculus fundamentals, Kinematics, Mole concept"
  "Week 2 (Jun 19-25): Integration, Thermodynamics, Organic reactions"
  ...

API Route: src/app/api/study-plan/generate/route.ts
  POST handler:
  - Requires auth
  - Input: { exam, examDate, hoursPerDay, subjects, weakAreas? }
  - Build AI prompt:

  const prompt = `Create a detailed study plan for a student preparing for ${exam}.
  Exam date: ${examDate}
  Daily study time: ${hoursPerDay} hours
  Subjects: ${subjects.join(', ')}
  Weak areas: ${weakAreas?.join(', ') || 'None specified'}

  Return ONLY valid JSON in this format:
  {
    "weekly_plan": [
      {
        "week": 1,
        "focus": "Foundation building",
        "daily_breakdown": {
          "Mathematics": { "hours": 2, "topics": ["Limits", "Basic Derivatives"] },
          "Physics": { "hours": 1.5, "topics": ["Kinematics", "Newton's Laws"] },
          "Chemistry": { "hours": 1.5, "topics": ["Mole Concept", "Atomic Structure"] }
        }
      }
    ],
    "revision_weeks": [4, 8, 12],
    "practice_test_days": ["Week 4 Day 7", "Week 8 Day 7"],
    "daily_target_today": {
      "Mathematics": { "hours": 2, "topics": ["Differentiation - Chain Rule"] },
      "Physics": { "hours": 1.5, "topics": ["Newton's Second Law problems"] }
    }
  }`

  - Parse response
  - Save to user profile metadata in Supabase
  - Return plan JSON

Add navigation: In src/components/layout/Navigation.tsx, add "Study Plan" to sidebar
with icon Map from lucide-react.

VERIFY: npm run build → pass. The form submits, AI returns a plan, and it renders correctly.
```

---

## PHASE 6 — Real-Time Study Rooms
**Estimated time:** 3–4 hours | **Priority:** P2

```
Repo: StudySprint. Task: Build real-time collaborative study rooms using Supabase Realtime.

STEP 1 — Create study_rooms schema (add to existing SQL):
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
  ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "rooms_readable" ON public.study_rooms FOR SELECT USING (TRUE);

STEP 2 — Create src/hooks/useStudyRoom.ts as described in BACKEND_ARCHITECTURE.md

STEP 3 — Create API routes:
  src/app/api/rooms/route.ts — POST to create room
    Generate a random 6-character code: Math.random().toString(36).substring(2, 8).toUpperCase()
    Insert into study_rooms, insert host as first room_member
    Return { room_id, code }

  src/app/api/rooms/join/route.ts — POST to join room
    Input: { code }
    Find room by code, check is_active and not expired
    Insert user into room_members
    Return { room_id, room_name, host_id }

STEP 4 — Create src/app/social/rooms/[code]/page.tsx:
  Room interface with:
  - Member list (real-time presence via Supabase)
  - Shared Pomodoro timer (synced via broadcast)
  - Simple text chat (broadcast events)
  - [Leave Room] button
  
  Use the useStudyRoom hook for all real-time functionality.
  Timer: host controls start/pause, all members see same countdown.

STEP 5 — Update src/app/social/page.tsx:
  Replace the fake static study group list with:
  1. [Create Room] button → opens modal with room name + subject
  2. [Join Room] button → opens modal with code input
  3. Active rooms the user is in (fetched from Supabase)

VERIFY: npm run build → pass. Open two browser windows, join same room, verify timer syncs.
```

---

## PHASE 7 — PDF Upload & Analysis
**Estimated time:** 2 hours | **Priority:** P1

```
Repo: StudySprint. Task: Allow users to upload PDFs, have AI extract text,
and generate quizzes/flashcards from the content.

STEP 1 — Install:
npm install pdf-parse
npm install --save-dev @types/pdf-parse
Add to Supabase: create a 'documents' storage bucket (public read, auth write).

STEP 2 — Create src/app/api/upload/pdf/route.ts:
  POST handler:
  - Requires auth
  - Parse multipart form: const formData = await req.formData()
  - Validate: file.type === 'application/pdf', file.size < 10MB
  - Upload to Supabase Storage bucket 'documents'
  - Return { document_id, url, filename }

STEP 3 — Create src/app/api/upload/[id]/analyze/route.ts:
  POST handler:
  - Requires auth
  - Input: { action: 'quiz' | 'flashcards' | 'summary', count?: number }
  - Download PDF from Supabase Storage
  - Extract text using pdf-parse
  - Call appropriate AI route with extracted text as content
  - Return { result } where result depends on action

STEP 4 — Add upload button to src/app/notes/page.tsx:
  Add a [📎 Upload PDF] button in the header area
  Opens a drag-and-drop file upload modal
  After upload:
  - Show extracted text preview (first 500 chars)
  - 3 action buttons: [Generate Quiz] [Create Flashcards] [Summarize]
  - Each calls /api/upload/[id]/analyze with respective action
  - Generated quiz appears in /quiz, flashcards in /flashcards

VERIFY: npm run build → pass. Upload a test PDF and verify text extraction works.
```

---

## PHASE 8 — Analytics with Real Data
**Estimated time:** 2 hours | **Priority:** P1

```
Repo: StudySprint. Task: Replace all static/mock data in analytics with
real data from Supabase.

Open src/app/analytics/page.tsx.
Replace every static data array with Supabase queries.

STEP 1 — Create useAnalytics hook: src/hooks/useAnalytics.ts
  Fetches in parallel:
  1. Quiz sessions last 30 days → accuracy by subject
  2. Study sessions last 30 days → hours per day, total hours
  3. user_stats → total XP, level, streak
  4. user_progress → subject mastery levels
  5. achievements → unlocked count

  Return:
  { 
    monthlyHours: { month, hours }[],
    subjectAccuracy: { subject, accuracy, attempts }[],
    weeklyStudyData: { day, hours }[],
    totalStats: { xp, level, streak, quizzes, studyHours },
    isLoading,
    error
  }

STEP 2 — Replace static arrays in analytics/page.tsx:
  - monthlyData → from useAnalytics().monthlyHours
  - subjectComparison → from useAnalytics().subjectAccuracy  
  - Show skeleton loaders while isLoading is true (ChartSkeleton is already built)
  - Show error state if error is not null

STEP 3 — Add "Export Report" button:
  [Export as PDF] → calls /api/reports/export
  Generates a simple text report with stats and downloads as .txt for now
  (Full PDF generation can come later with puppeteer)

VERIFY: npm run build → pass. Analytics page shows real data when user has quiz history.
```

---

## PHASE 9 — PWA + KaTeX Math Rendering
**Estimated time:** 1.5 hours | **Priority:** P1

```
Repo: StudySprint. Task: Add PWA support and KaTeX math rendering.

STEP 1 — KaTeX for math in quiz explanations and AI chat:
npm install katex
npm install --save-dev @types/katex

Create src/components/ui/MathRenderer.tsx:
  'use client'
  import katex from 'katex'
  import 'katex/dist/katex.min.css'
  import { useEffect, useRef } from 'react'

  interface MathRendererProps {
    latex: string
    displayMode?: boolean
    className?: string
  }

  export function MathRenderer({ latex, displayMode = false, className }: MathRendererProps) {
    const ref = useRef<HTMLSpanElement>(null)
    useEffect(() => {
      if (ref.current) {
        try {
          katex.render(latex, ref.current, { displayMode, throwOnError: false })
        } catch { 
          if (ref.current) ref.current.textContent = latex
        }
      }
    }, [latex, displayMode])
    return <span ref={ref} className={className} />
  }

Create src/lib/parse-math.ts:
  Parse text containing $...$ (inline) and $$...$$ (display) math:
  
  export function parseMathContent(text: string): { type: 'text'|'math'|'display_math', content: string }[] {
    const parts: { type: 'text'|'math'|'display_math', content: string }[] = []
    const regex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
      }
      if (match[1] !== undefined) {
        parts.push({ type: 'display_math', content: match[1] })
      } else if (match[2] !== undefined) {
        parts.push({ type: 'math', content: match[2] })
      }
      lastIndex = match.index + match[0].length
    }
    
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) })
    }
    return parts
  }

Use MathRenderer in:
  - Quiz question text and explanation rendering
  - AI assistant message display (when message contains $...$)
  - Flashcard front/back display

STEP 2 — PWA Setup:
npm install next-pwa
npm install --save-dev @types/next-pwa

Update next.config.ts:
  import withPWA from 'next-pwa'
  const withPWAConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })
  
  const nextConfig = withPWAConfig({
    // existing config
    poweredByHeader: false,
    compress: true,
  })
  export default nextConfig

Create public/manifest.json:
  {
    "name": "StudySprint",
    "short_name": "StudySprint",
    "description": "Your Neural Study OS",
    "start_url": "/dashboard",
    "display": "standalone",
    "background_color": "#050507",
    "theme_color": "#7C3AED",
    "orientation": "portrait",
    "icons": [
      { "src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png" },
      { "src": "/favicon.ico", "sizes": "48x48", "type": "image/x-icon" },
      { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" },
      { "src": "/og-image.png", "sizes": "1200x630", "type": "image/png", "purpose": "any" }
    ]
  }

Add to src/app/layout.tsx metadata:
  manifest: '/manifest.json'

VERIFY: npm run build → pass. Lighthouse PWA score should appear.
```

---

## FINAL PHASE — Production Hardening
**Estimated time:** 1 hour | **Priority:** P0 — Do before deploy

```
Repo: StudySprint. Final production hardening pass.

1. Run: npm run check (type-check + lint + build). Fix ALL errors.

2. Add proper Suspense to every heavy component in analytics/page.tsx
   and dashboard/page.tsx if not already present.

3. Verify all API routes return proper TypeScript types (no 'any').

4. Add error boundaries:
   Wrap each major page section in try/catch with user-facing error message.

5. Run: npm run build and verify:
   - Zero TypeScript errors
   - Build output shows no pages larger than 500KB (check .next/analyze if needed)
   - All routes compile successfully

6. Git commit:
   git add -A
   git commit -m "feat: supabase db, 3000+ questions, onboarding, sm-2 SRS, study plan, real-time rooms, pdf upload, katex, PWA"
   git push origin main

7. Vercel deploy — set ALL env vars:
   NEXT_PUBLIC_APP_URL=https://studysprint.vercel.app
   OPENROUTER_API_KEY=...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   CLERK_WEBHOOK_SECRET=...
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_TELEMETRY_DISABLED=1

8. After deploy:
   - Register Clerk webhook: Dashboard → Webhooks → https://studysprint.vercel.app/api/webhooks/clerk
   - Events: user.created, user.updated, user.deleted
   - Run: npm run seed:questions (with prod env vars) to populate question bank

OUTPUT CONTRACT:
✓ PHASE 1  — Supabase wired
✓ PHASE 2  — 3000+ questions seeded
✓ PHASE 3  — Onboarding flow
✓ PHASE 4  — SM-2 spaced repetition
✓ PHASE 5  — AI study plan
✓ PHASE 6  — Real-time rooms
✓ PHASE 7  — PDF upload
✓ PHASE 8  — Real analytics
✓ PHASE 9  — PWA + KaTeX
✓ FINAL    — npm run check passed

Build status: PRODUCTION READY 🚀
```
