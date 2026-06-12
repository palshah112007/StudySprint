'use client'
import { createClient } from './supabase/client'
import { loadData } from './persistence'

export async function migrateIfNeeded(userId: string) {
  if (localStorage.getItem('ss_migrated_v2')) return
  const supabase = createClient()
  const notes = loadData<unknown[]>('notes', [])
  const tasks = loadData<unknown[]>('tasks', [])
  const state = loadData<{ totalXp?: number; streak?: number } | null>('user_state', null)

  const ops = []
  if (notes.length > 0) {
    ops.push(supabase.from('notes').insert(notes.map(n => ({ ...n as object, id: undefined, user_id: userId }))))
  }
  if (tasks.length > 0) {
    ops.push(supabase.from('tasks').insert(tasks.map(t => ({ ...t as object, id: undefined, user_id: userId }))))
  }
  if (state?.totalXp) {
    ops.push(supabase.from('user_stats').upsert({ user_id: userId, total_xp: state.totalXp, streak: state.streak || 0 }))
  }
  await Promise.allSettled(ops)
  localStorage.setItem('ss_migrated_v2', 'true')
}