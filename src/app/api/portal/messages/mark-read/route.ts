import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireClient } from '@/lib/portal/requireClient'

// Clients have no RLS update policy on client_messages (a blanket one would
// let them rewrite any field on any message in their thread, not just
// read_at) — so marking messages read goes through the service role instead,
// scoped server-side to exactly the admin-authored, unread rows in the
// caller's own thread.
export async function POST() {
  const auth = await requireClient()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin
      .from('client_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('client_id', auth.client.id)
      .eq('sender', 'admin')
      .is('read_at', null)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to mark messages as read.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
