import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, subject } = await req.json() as { name: string; subject?: string }
  const code = Math.random().toString(36).substring(2, 8).toUpperCase()

  const supabase = await createClient()
  const { data: room, error } = await supabase
    .from('study_rooms')
    .insert({ name, subject: subject || null, host_id: userId, code })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('room_members').insert({ room_id: room.id, user_id: userId })

  return NextResponse.json({ room_id: room.id, code: room.code })
}