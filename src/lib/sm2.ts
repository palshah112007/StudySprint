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