'use client'

import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { LinkButton } from '@/components/Button'
import { Button } from '@/components/Button'
import { createClient } from '@/lib/supabase/client'

export function NoClientRecord({ email }: { email: string }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-velvet-gradient flex items-center justify-center px-6 py-16">
      <div className="card-panel gold-border rounded-3xl p-10 max-w-md text-center flex flex-col items-center gap-4">
        <ShieldAlert className="text-gold" size={40} />
        <h1 className="font-display text-2xl text-gold-light">No Client Record Found</h1>
        <p className="text-white/60 text-sm">
          You&rsquo;re signed in as <span className="text-white">{email}</span>, but we don&rsquo;t have a
          client record for this email yet. Complete your intake to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <LinkButton href="/intake" variant="primary">
            Start Client Intake
          </LinkButton>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
