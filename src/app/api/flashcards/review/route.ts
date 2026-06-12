import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { calculateNextReview } from '@/lib/sm2'
import { awardXP } from '@/lib/xp'
import { NextResponse } from 'next/server'
import type { Quality } from '@/lib/sm2'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { card_id, quality } = await req.json() as { card_id: string; quality: Quality }
  if (typeof quality !== 'number' || quality < 0 || quality > 5) {
    return NextResponse.json({ error: 'Invalid quality rating (0-5 required)' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: card, error: fetchError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('id', card_id)
    .eq('user_id', userId)
    .single()

  if (fetchError || !card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  }

  const result = calculateNextReview(
    { ease_factor: card.ease_factor, interval: card.interval, repetitions: card.repetitions },
    quality
  )

  const { error: updateError } = await supabase
    .from('flashcards')
    .update({
      ease_factor: result.ease_factor,
      interval: result.interval,
      repetitions: result.repetitions,
      due_date: result.due_date,
    })
    .eq('id', card_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const xpResult = await awardXP(userId, 5, 'flashcard_review', { card_id, quality })

  return NextResponse.json({
    next_due: result.due_date,
    interval_days: result.interval,
    xp_earned: 5,
    ...xpResult,
  })
}