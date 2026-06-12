import { auth } from '@clerk/nextjs/server'
import { adminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { goal, subjects, examDate, hoursPerDay } = await req.json()

  // Save onboarding data to users table
  const { error: userError } = await adminClient
    .from('users')
    .update({
      goal,
      subjects,
      onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 })

  // Generate a basic study plan structure
  const studyPlan = {
    goal,
    subjects,
    hoursPerDay,
    examDate: examDate || null,
    weekly_plan: subjects?.map((s: string, i: number) => ({
      week: i + 1,
      subject: s,
      hours_per_week: hoursPerDay * 7 / (subjects?.length || 1),
      focus: 'Foundation building'
    })) || [],
    revision_weeks: [4, 8, 12],
    created_at: new Date().toISOString(),
  }

  // Save study plan
  await adminClient
    .from('study_plans')
    .upsert({
      user_id: userId,
      exam: goal,
      exam_date: examDate || null,
      hours_per_day: hoursPerDay,
      subjects,
      plan_data: studyPlan,
    })

  return NextResponse.json({ success: true, studyPlan })
}