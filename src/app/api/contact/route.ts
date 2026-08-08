import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  let body: { name?: string; email?: string; phone?: string; program?: string; message?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.name || !body.email || !body.phone) {
    return NextResponse.json({ error: 'Name, email, and phone are required.' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('contact_requests').insert({
      full_name: body.name,
      email: body.email,
      phone: body.phone,
      program_of_interest: body.program || null,
      message: body.message || null,
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to submit your request.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
