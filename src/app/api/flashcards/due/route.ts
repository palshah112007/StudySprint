import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const deck_id = searchParams.get('deck_id')
  const limit = parseInt(searchParams.get('limit') || '20')

  const supabase = await createClient()
  let query = supabase
    .from('flashcards')
    .select('*')
    .eq('user_id', userId)
    .lte('due_date', new Date().toISOString().split('T')[0])
    .order('due_date', { ascending: true })
    .limit(limit)

  if (deck_id) query = query.eq('deck_id', deck_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ cards: data })
}