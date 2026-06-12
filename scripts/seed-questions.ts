import { createClient } from '@supabase/supabase-js'
import { ALL_QUESTIONS } from '../src/data/questions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log(`Seeding ${ALL_QUESTIONS.length} questions...`)
  const chunkSize = 100
  for (let i = 0; i < ALL_QUESTIONS.length; i += chunkSize) {
    const chunk = ALL_QUESTIONS.slice(i, i + chunkSize)
    const { error } = await supabase.from('questions').insert(chunk)
    if (error) { console.error(`Chunk ${i} failed:`, error.message); continue }
    console.log(`✅ ${Math.min(i + chunkSize, ALL_QUESTIONS.length)}/${ALL_QUESTIONS.length}`)
  }
  console.log('Seeding complete!')
}

seed().catch(console.error)