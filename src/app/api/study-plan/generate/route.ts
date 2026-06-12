import { auth } from '@clerk/nextjs/server'
import { adminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { exam, examDate, hoursPerDay, subjects, weakAreas } = await req.json()

  // Generate a structured study plan (mock AI for now, real AI integration later)
  const totalWeeks = Math.ceil((new Date(examDate).getTime() - Date.now()) / (7 * 86400000))
  const clampedWeeks = Math.max(4, Math.min(totalWeeks, 52))

  const weeklyPlan = Array.from({ length: clampedWeeks }, (_, i) => {
    const phase = i < clampedWeeks * 0.3 ? 'Foundation building' 
      : i < clampedWeeks * 0.7 ? 'Advanced concepts & practice'
      : 'Revision & mock tests'
    
    const dailyBreakdown: Record<string, { hours: number; topics: string[] }> = {}
    subjects?.forEach((s: string) => {
      dailyBreakdown[s] = {
        hours: hoursPerDay / subjects.length,
        topics: [`${phase} - ${s} core concepts`],
      }
    })

    return { week: i + 1, focus: phase, daily_breakdown: dailyBreakdown }
  })

  const planData = {
    weekly_plan: weeklyPlan,
    revision_weeks: [Math.ceil(clampedWeeks * 0.7), Math.ceil(clampedWeeks * 0.85)],
    practice_test_days: [`Week ${Math.ceil(clampedWeeks * 0.3)} Day 7`, `Week ${Math.ceil(clampedWeeks * 0.6)} Day 7`],
    daily_target_today: weeklyPlan[0]?.daily_breakdown || {},
    total_weeks: clampedWeeks,
    exam,
    hours_per_day: hoursPerDay,
  }

  // Save to database
  await adminClient.from('study_plans').upsert({
    user_id: userId,
    exam,
    exam_date: examDate,
    hours_per_day: hoursPerDay,
    subjects,
    plan_data: planData,
  })

  return NextResponse.json(planData)
}