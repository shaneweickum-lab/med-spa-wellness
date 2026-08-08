'use client'

import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/Button'
import { createClient } from '@/lib/supabase/client'

export function NotAuthorized({ email }: { email: string }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-velvet-gradient flex items-center justify-center px-6 py-16">
      <div className="card-panel gold-border rounded-3xl p-10 max-w-md text-center flex flex-col items-center gap-4">
        <ShieldAlert className="text-gold" size={40} />
        <h1 className="font-display text-2xl text-gold-light">Access Pending</h1>
        <p className="text-white/60 text-sm">
          You&rsquo;re signed in as <span className="text-white">{email}</span>, but this account hasn&rsquo;t
          been granted admin portal access yet. Contact the engineering team to be added.
        </p>
        <Button variant="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}
