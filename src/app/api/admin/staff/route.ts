import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const ASSIGNABLE_ROLES = ['engineer', 'nurse', 'admin']

async function requireSuperadmin() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.', status: 401 as const }
  }

  const { data: profile } = await supabase.from('admin_profiles').select('role').eq('id', user.id).single()

  if (!profile || profile.role !== 'superadmin') {
    return { error: 'Only superadmins can manage staff accounts.', status: 403 as const }
  }

  return { user }
}

export async function POST(req: Request) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { fullName?: string; email?: string; password?: string; role?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { fullName, email, password, role } = body
  if (!fullName || !email || !password || !role) {
    return NextResponse.json({ error: 'Full name, email, password, and role are required.' }, { status: 400 })
  }
  if (!ASSIGNABLE_ROLES.includes(role)) {
    return NextResponse.json(
      { error: 'Superadmin accounts can only be granted directly in the database, not from this form.' },
      { status: 400 },
    )
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  try {
    const admin = getSupabaseAdmin()

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (createError) throw createError

    const { error: profileError } = await admin.from('admin_profiles').insert({
      id: created.user.id,
      full_name: fullName,
      email,
      role,
    })
    if (profileError) {
      // Don't leave an orphaned auth user with no admin_profiles row behind.
      await admin.auth.admin.deleteUser(created.user.id)
      throw profileError
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to create staff account.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const auth = await requireSuperadmin()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { id?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!body.id) return NextResponse.json({ error: 'Missing staff id.' }, { status: 400 })
  if (body.id === auth.user.id) {
    return NextResponse.json({ error: 'You cannot revoke your own access.' }, { status: 400 })
  }

  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin.from('admin_profiles').delete().eq('id', body.id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to revoke access.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
