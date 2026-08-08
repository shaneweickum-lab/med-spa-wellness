import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { createClient as createServerClient } from '@/lib/supabase/server'

// TEMPORARY: signs a client straight into the portal from their email alone,
// with no proof they actually own that inbox. This exists to remove the
// email-link wait while the portal is still being tested/set up.
//
// It still creates a REAL Supabase Auth session (via the Admin API's
// generateLink + a server-side verifyOtp) so every existing RLS policy
// keeps working unchanged — only the "prove you own this email" step is
// skipped. To restore real verification later, point PortalLoginForm back
// at supabase.auth.signInWithOtp() and this route can be deleted.
export async function POST(req: Request) {
  let body: { email?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  try {
    const admin = getSupabaseAdmin()

    const { data: client } = await admin.from('clients').select('id').eq('email', email).maybeSingle()
    if (!client) {
      return NextResponse.json(
        { error: 'No client record found for this email. Please complete your intake first.' },
        { status: 404 },
      )
    }

    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })
    if (linkError) throw linkError

    const hashedToken = linkData.properties?.hashed_token
    if (!hashedToken) throw new Error('Unable to generate a sign-in token.')

    const supabase = await createServerClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: 'magiclink',
      token_hash: hashedToken,
    })
    if (verifyError) throw verifyError

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to sign in.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
