import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json() as { code: string }
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 })

  const supabase = await createClient()
  const { data: room, error } = await supabase
    .from('study_rooms')
    .select('id, name, host_id, is_active, expires_at')
    .eq('code', code.toUpperCase())
    .single()

  if (error || !room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  if (!room.is_active) return NextResponse.json({ error: 'Room is no longer active' }, { status: 400 })
  if (new Date(room.expires_at) < new Date()) return NextResponse.json({ error: 'Room has expired' }, { status: 400 })

  await supabase.from('room_members').upsert({ room_id: room.id, user_id: userId })

  return NextResponse.json({ room_id: room.id, room_name: room.name, host_id: room.host_id })
}