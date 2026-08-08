import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentClient } from '@/lib/portal/getCurrentClient'
import { PortalShell } from '@/components/portal/PortalShell'
import { NoClientRecord } from '@/components/portal/NoClientRecord'

export const metadata: Metadata = {
  title: 'Client Portal | Soulstys Meridian Wellness',
  description: 'Secure client portal for messages, personal info, and program tracking.',
  robots: { index: false, follow: false },
}

// Every page under this layout depends on the request's auth session and
// live Supabase data — never statically prerender it.
export const dynamic = 'force-dynamic'

export default async function PortalDashboardLayout({ children }: { children: React.ReactNode }) {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return (
      <div className="min-h-screen bg-velvet-gradient flex items-center justify-center px-6 py-16">
        <div className="card-panel gold-border rounded-3xl p-10 max-w-md text-center">
          <h1 className="font-display text-2xl text-gold-light mb-2">Client Portal Not Configured</h1>
          <p className="text-white/60 text-sm">
            Add <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
            variables to enable the client portal.
          </p>
        </div>
      </div>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/portal/login')
  }

  const client = await getCurrentClient()

  if (!client) {
    return <NoClientRecord email={user.email ?? 'your account'} />
  }

  return <PortalShell clientName={client.full_name}>{children}</PortalShell>
}
