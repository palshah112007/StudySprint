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