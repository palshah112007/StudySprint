import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) return new Response('No webhook secret', { status: 500 })

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: { type: string; data: { id: string; email_addresses: Array<{ email_address: string }>; first_name: string; last_name: string; image_url: string } }

  try {
    evt = wh.verify(body, { 'svix-id': svix_id, 'svix-timestamp': svix_timestamp, 'svix-signature': svix_signature }) as typeof evt
  } catch {
    return new Response('Webhook verification failed', { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    await adminClient.from('users').upsert({
      id,
      email: email_addresses[0].email_address,
      display_name: `${first_name || ''} ${last_name || ''}`.trim() || 'Student',
      avatar_url: image_url,
    })
    await adminClient.from('user_stats').upsert({ user_id: id })
  }

  if (evt.type === 'user.deleted') {
    await adminClient.from('users').delete().eq('id', evt.data.id)
  }

  return new Response('OK', { status: 200 })
}