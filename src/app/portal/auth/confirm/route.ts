import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(new URL('/portal', req.url))
      }
    } catch {
      // falls through to the error redirect below
    }
  }

  return NextResponse.redirect(new URL('/portal/login?error=1', req.url))
}
