# StudySprint — Backend Architecture
**Version:** 2.0 | **Type:** Engineering Reference

---

## 1. Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  Browser (PWA) · Mobile PWA · (Future: iOS/Android)           │
└──────────────────────────┬─────────────────────────────────────┘
                           │ HTTPS / WSS
┌──────────────────────────▼─────────────────────────────────────┐
│                  VERCEL EDGE NETWORK                            │
│  CDN · Static assets · Edge middleware (Clerk auth)            │
└──────┬───────────────────┬───────────────────────────────────┘
       │                   │
┌──────▼──────┐    ┌───────▼──────────────────────────────────┐
│ NEXT.JS     │    │          SUPABASE                         │
│ API ROUTES  │    │  ┌─────────────┐  ┌──────────────────┐   │
│             │    │  │ PostgreSQL   │  │ Realtime (WS)    │   │
│ Edge/Node   │    │  │ + pgvector   │  │ study rooms      │   │
│ Rate limit  │    │  └─────────────┘  └──────────────────┘   │
│ Auth guard  │    │  ┌─────────────┐  ┌──────────────────┐   │
│ Validation  │    │  │ Storage     │  │ Edge Functions   │   │
│             │    │  │ PDFs/images │  │ webhooks, cron   │   │
└──────┬──────┘    │  └─────────────┘  └──────────────────┘   │
       │           └───────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────────┐
│                       AI PROVIDERS                           │
│  OpenRouter (primary) → Groq → xAI → Nvidia → OpenAI       │
│  Automatic fallback chain, 30s timeout per provider         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Supabase Setup Guide

### 2.1 Project Creation
```bash
# 1. Create project at supabase.com
# 2. Get connection strings from Settings > API

# 3. Install client
npm install @supabase/supabase-js @supabase/ssr
```

### 2.2 Client Initialization
```typescript
// src/lib/supabase/client.ts — Browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// src/lib/supabase/server.ts — Server component client
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
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// src/lib/supabase/admin.ts — Service role (server-only)
import { createClient } from '@supabase/supabase-js'

export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
// WARNING: Never use adminClient in browser code or client components
```

### 2.3 Clerk → Supabase User Sync
```typescript
// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) throw new Error('No webhook secret')

  const svix_id = req.headers.get('svix-id')
  const svix_timestamp = req.headers.get('svix-timestamp')
  const svix_signature = req.headers.get('svix-signature')

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)
  
  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id!,
      'svix-timestamp': svix_timestamp!,
      'svix-signature': svix_signature!,
    }) as WebhookEvent
  } catch {
    return new Response('Webhook verification failed', { status: 400 })
  }

  const { id } = evt.data
  
  if (evt.type === 'user.created') {
    const { email_addresses, first_name, last_name, image_url } = evt.data
    
    await adminClient.from('users').upsert({
      id,
      email: email_addresses[0].email_address,
      display_name: `${first_name} ${last_name}`.trim(),
      avatar_url: image_url,
    })

    // Create initial stats record
    await adminClient.from('user_stats').insert({ user_id: id })
  }

  if (evt.type === 'user.deleted') {
    await adminClient.from('users').delete().eq('id', id)
  }

  return new Response('OK', { status: 200 })
}
```

---

## 3. API Routes Implementation

### 3.1 Quiz Start (Hybrid: DB + AI)
```typescript
// src/app/api/quiz/start/route.ts
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { createAiChatCompletion } from '@/lib/ai-provider'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { subject, topic, difficulty, count = 10, exam_mode } = await request.json()
  
  const supabase = await createClient()

  // 1. Query curated questions from DB
  let query = supabase.from('questions')
    .select('*')
    .eq('subject', subject)
    .limit(count)

  if (topic) query = query.eq('topic', topic)
  if (difficulty !== 'mixed') query = query.eq('difficulty', difficulty)
  if (exam_mode) query = query.contains('exam_tags', [exam_mode])

  const { data: dbQuestions } = await query

  let questions = dbQuestions || []

  // 2. If not enough questions, generate with AI
  if (questions.length < count) {
    const needed = count - questions.length
    const aiQuestions = await generateAiQuestions(subject, topic, difficulty, needed)
    questions = [...questions, ...aiQuestions]
  }

  // 3. Create session record
  const { data: session } = await supabase
    .from('quiz_sessions')
    .insert({
      user_id: userId,
      subject,
      topic,
      difficulty,
      exam_mode,
      score: 0,
      total: questions.length,
    })
    .select()
    .single()

  // Shuffle
  const shuffled = questions.sort(() => Math.random() - 0.5)

  return Response.json({ 
    session_id: session.id, 
    questions: shuffled.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correct_idx,
      explanation: q.explanation,
      subject: q.subject,
      difficulty: q.difficulty,
    }))
  })
}
```

### 3.2 Quiz Submit + XP Award
```typescript
// src/app/api/quiz/submit/route.ts
export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { session_id, answers, time_taken } = await request.json()
  const supabase = await createClient()

  // Calculate score
  const correct = answers.filter((a: Answer) => a.is_correct).length
  const total = answers.length
  const accuracy = correct / total

  // XP formula
  const difficultyMultipliers = { easy: 1, medium: 1.5, hard: 2, mixed: 1.5 }
  const { data: session } = await supabase
    .from('quiz_sessions').select('*').eq('id', session_id).single()
  
  const base_xp = 100
  const multiplier = difficultyMultipliers[session.difficulty as keyof typeof difficultyMultipliers] || 1.5
  const accuracy_bonus = accuracy >= 0.9 ? 1.5 : accuracy >= 0.7 ? 1.2 : 1.0
  const xp_earned = Math.round(base_xp * multiplier * accuracy_bonus * (correct / 10))

  // Update session
  await supabase.from('quiz_sessions').update({
    score: correct, total, time_taken, xp_earned, answers
  }).eq('id', session_id)

  // Update user_progress per topic
  for (const answer of answers) {
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', session.subject)
      .eq('topic', session.topic || 'General')
      .single()

    if (existing) {
      const new_accuracy = (existing.accuracy * existing.attempts + (answer.is_correct ? 1 : 0)) / (existing.attempts + 1)
      await supabase.from('user_progress').update({
        accuracy: new_accuracy,
        attempts: existing.attempts + 1,
        last_practiced: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      await supabase.from('user_progress').insert({
        user_id: userId,
        subject: session.subject,
        topic: session.topic || 'General',
        accuracy: answer.is_correct ? 1 : 0,
        attempts: 1,
        last_practiced: new Date().toISOString(),
      })
    }
  }

  // Award XP
  await awardXP(userId, xp_earned, 'quiz', { session_id, accuracy })

  // Check achievements
  const new_achievements = await checkAchievements(userId, 'quiz', { accuracy, score: correct })

  return Response.json({ score: correct, total, xp_earned, accuracy, new_achievements })
}
```

### 3.3 XP Award Function
```typescript
// src/lib/xp.ts
import { adminClient } from './supabase/admin'

export async function awardXP(
  userId: string,
  amount: number,
  source: string,
  metadata?: Record<string, unknown>
) {
  // Log XP event
  await adminClient.from('xp_log').insert({
    user_id: userId, amount, source, metadata
  })

  // Update user_stats
  const { data: stats } = await adminClient
    .from('user_stats')
    .select('total_xp, level')
    .eq('user_id', userId)
    .single()

  const new_xp = (stats?.total_xp || 0) + amount
  const new_level = calculateLevel(new_xp)

  await adminClient.from('user_stats').upsert({
    user_id: userId,
    total_xp: new_xp,
    level: new_level,
    updated_at: new Date().toISOString(),
  })

  return { new_xp, new_level, leveled_up: new_level > (stats?.level || 1) }
}

// XP thresholds: level = floor(sqrt(total_xp / 100))
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}
```

---

## 4. Supabase Realtime — Study Rooms

```typescript
// src/hooks/useStudyRoom.ts
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RoomState {
  members: RoomMember[]
  timerSeconds: number
  isRunning: boolean
  messages: ChatMessage[]
}

export function useStudyRoom(roomId: string, userId: string) {
  const supabase = createClient()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const [state, setState] = useState<RoomState>({ members: [], timerSeconds: 1500, isRunning: false, messages: [] })

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`, {
      config: { broadcast: { self: true } }
    })

    channel
      .on('broadcast', { event: 'timer_update' }, ({ payload }) => {
        setState(prev => ({ ...prev, timerSeconds: payload.seconds, isRunning: payload.running }))
      })
      .on('broadcast', { event: 'chat_message' }, ({ payload }) => {
        setState(prev => ({ ...prev, messages: [...prev.messages, payload] }))
      })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState()
        const members = Object.values(presenceState).flat() as RoomMember[]
        setState(prev => ({ ...prev, members }))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId, online_at: new Date().toISOString() })
        }
      })

    channelRef.current = channel

    return () => { supabase.removeChannel(channel) }
  }, [roomId, userId])

  const broadcastTimerTick = (seconds: number, running: boolean) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'timer_update',
      payload: { seconds, running }
    })
  }

  const sendMessage = (text: string) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: { user_id: userId, text, timestamp: Date.now() }
    })
  }

  return { state, broadcastTimerTick, sendMessage }
}
```

---

## 5. File Upload & PDF Processing

```typescript
// src/app/api/upload/pdf/route.ts
import { auth } from '@clerk/nextjs/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file || file.type !== 'application/pdf') {
    return Response.json({ error: 'Invalid file — PDF only' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB max
    return Response.json({ error: 'File too large — max 10MB' }, { status: 400 })
  }

  const fileName = `${userId}/${Date.now()}_${file.name}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload to Supabase Storage
  const { data, error } = await adminClient.storage
    .from('documents')
    .upload(fileName, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (error) {
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = adminClient.storage
    .from('documents')
    .getPublicUrl(fileName)

  // Store document metadata
  const { data: doc } = await adminClient.from('documents').insert({
    user_id: userId,
    filename: file.name,
    storage_path: data.path,
    public_url: publicUrl,
    size_bytes: file.size,
  }).select().single()

  return Response.json({ document_id: doc.id, url: publicUrl })
}

// src/app/api/upload/[id]/extract/route.ts
import pdf from 'pdf-parse'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { action } = await request.json() // 'quiz' | 'flashcards' | 'summary'
  const supabase = await createClient()

  // Get document
  const { data: doc } = await supabase
    .from('documents').select('*').eq('id', params.id).single()

  // Download PDF from Storage
  const { data: fileData } = await adminClient.storage
    .from('documents').download(doc.storage_path)
  
  const buffer = Buffer.from(await fileData!.arrayBuffer())
  const pdfData = await pdf(buffer)
  const text = pdfData.text.slice(0, 8000) // Limit context

  // Route to appropriate AI action
  if (action === 'quiz') {
    const res = await fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, count: 10 })
    })
    return res
  }

  return Response.json({ text: text.slice(0, 2000) }) // preview
}
```

---

## 6. Cron Jobs (Supabase Edge Functions)

### 6.1 Daily Streak Reset
```typescript
// supabase/functions/daily-streak-check/index.ts
// Runs: every day at midnight IST (18:30 UTC)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  // Find users who didn't study yesterday → reset streak
  const { data: inactiveUsers } = await supabase
    .from('user_stats')
    .select('user_id')
    .lt('last_active', yesterdayStr)
    .gt('streak', 0)

  if (inactiveUsers?.length) {
    await supabase.from('user_stats')
      .update({ streak: 0 })
      .in('user_id', inactiveUsers.map(u => u.user_id))
  }

  return new Response(JSON.stringify({ reset: inactiveUsers?.length || 0 }))
})
```

### 6.2 Weekly Report Email (Resend)
```typescript
// supabase/functions/weekly-report/index.ts
// Runs: every Sunday at 9 AM IST

import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

Deno.serve(async () => {
  const supabase = createClient(...)

  // Get all active users from past week
  const { data: activeUsers } = await supabase
    .from('user_stats')
    .select(`*, users!inner(email, display_name)`)
    .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  for (const user of activeUsers || []) {
    // Get week stats
    const { data: weekSessions } = await supabase
      .from('study_sessions')
      .select('duration, subject')
      .eq('user_id', user.user_id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const totalMinutes = weekSessions?.reduce((sum, s) => sum + s.duration, 0) || 0

    await resend.emails.send({
      from: 'StudySprint <hello@studysprint.app>',
      to: user.users.email,
      subject: `📊 Your weekly study report — ${totalMinutes} minutes studied`,
      html: generateReportHTML({ user, totalMinutes, streak: user.streak }),
    })
  }

  return new Response(JSON.stringify({ sent: activeUsers?.length || 0 }))
})
```

---

## 7. Data Migration: localStorage → Supabase

```typescript
// src/lib/migrate-local-data.ts
// Run once per user on first authenticated load

import { createClient } from './supabase/client'
import { loadData, clearAllData } from './persistence'

export async function migrateLocalDataToSupabase(userId: string) {
  const supabase = createClient()
  
  // Check if migration already done
  const migrated = localStorage.getItem('studysprint_migrated')
  if (migrated) return

  const localNotes = loadData('notes', [])
  const localTasks = loadData('tasks', [])
  const localDecks = loadData('flashcard_decks', [])
  const localState = loadData('user_state', null)

  const migrations = []

  // Migrate notes
  if (localNotes.length > 0) {
    migrations.push(
      supabase.from('notes').insert(
        localNotes.map((n: LocalNote) => ({
          ...n,
          user_id: userId,
          id: undefined, // Let Supabase generate new IDs
        }))
      )
    )
  }

  // Migrate tasks
  if (localTasks.length > 0) {
    migrations.push(
      supabase.from('tasks').insert(
        localTasks.map((t: LocalTask) => ({ ...t, user_id: userId, id: undefined }))
      )
    )
  }

  // Migrate XP
  if (localState?.totalXp > 0) {
    migrations.push(
      supabase.from('user_stats').upsert({
        user_id: userId,
        total_xp: localState.totalXp,
        streak: localState.streak || 0,
      })
    )
  }

  await Promise.allSettled(migrations)

  localStorage.setItem('studysprint_migrated', 'true')
  console.log('✅ Local data migrated to Supabase')
}
```

---

## 8. Question Bank Seeding Script

```typescript
// scripts/seed-questions.ts
// Run: npx tsx scripts/seed-questions.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Import all question files
import { mathQuestions } from './data/mathematics'
import { physicsQuestions } from './data/physics'
import { chemistryQuestions } from './data/chemistry'
import { biologyQuestions } from './data/biology'
import { csQuestions } from './data/computer-science'
import { aptitudeQuestions } from './data/aptitude'
import { jeeQuestions } from './data/jee-past-papers'
import { neetQuestions } from './data/neet-past-papers'
import { gateQuestions } from './data/gate-past-papers'

const allQuestions = [
  ...mathQuestions,      // ~600 questions
  ...physicsQuestions,   // ~500 questions
  ...chemistryQuestions, // ~400 questions
  ...biologyQuestions,   // ~350 questions
  ...csQuestions,        // ~500 questions
  ...aptitudeQuestions,  // ~300 questions
  ...jeeQuestions,       // ~200 past paper questions
  ...neetQuestions,      // ~150 past paper questions
  ...gateQuestions,      // ~200 past paper questions
]

// Batch insert in chunks of 100
const chunkSize = 100
for (let i = 0; i < allQuestions.length; i += chunkSize) {
  const chunk = allQuestions.slice(i, i + chunkSize)
  const { error } = await supabase.from('questions').insert(chunk)
  if (error) console.error(`Chunk ${i} failed:`, error)
  else console.log(`Seeded ${i + chunk.length}/${allQuestions.length}`)
}

console.log(`✅ Seeded ${allQuestions.length} questions total`)
```

---

## 9. Deployment Architecture

```
GitHub main branch push
      │
      ▼
GitHub Actions CI:
  1. npm ci
  2. npm run type-check
  3. npm run lint
  4. npm run build
  If all pass → trigger Vercel deploy
      │
      ▼
Vercel Deploy:
  Region: bom1 (Mumbai — closest to India target audience)
  Build: next build (automatic)
  Functions: Edge runtime for /api/ai/* routes (global low latency)
  Static: CDN-cached at edge globally
      │
      ▼
Supabase:
  Region: ap-south-1 (Mumbai)
  Tier: Pro (for realtime + more connections)
  Backups: Daily automated + point-in-time recovery
      │
      ▼
Monitoring:
  Vercel Analytics → page views, routes, vitals
  Vercel Speed Insights → Core Web Vitals per route
  Supabase Dashboard → query performance, table sizes
  Sentry (add later) → error tracking
```

---

## 10. Cost Estimation (Monthly)

| Service | Free Tier Limit | Estimated Usage | Cost |
|---|---|---|---|
| Vercel | 100GB bandwidth | ~20GB | $0 (Hobby) |
| Supabase | 500MB DB, 1GB storage | 200MB DB, 500MB storage | $0 (Free) |
| OpenRouter | $1 free credit | ~$3/month at scale | $3 |
| Groq | 14400 req/day free | Well within | $0 |
| Clerk | 10,000 MAU free | Under 10K initially | $0 |
| Resend | 3000 emails/month | ~2000 | $0 |
| **Total** | | | **~$3/month** |

*At 10K MAU:*
| Service | Cost |
|---|---|
| Vercel Pro | $20/month |
| Supabase Pro | $25/month |
| OpenRouter | ~$20/month |
| Clerk | $25/month (25K MAU) |
| Resend | $20/month |
| **Total** | **~$110/month** |

---

*Document Owner: Pal Shah | Architecture Reference — Update on every infrastructure change*
