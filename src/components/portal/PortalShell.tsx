'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function PortalShell({ clientName, children }: { clientName: string; children: React.ReactNode }) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-velvet-gradient flex flex-col">
      <header className="border-b border-gold/20 bg-velvet/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo-mark.png" alt="" width={913} height={1037} className="h-8 w-auto" />
            <span className="font-display text-xl tracking-[0.1em] text-gradient-gold">
              SOULSTYS MERIDIAN <span className="text-white/50 text-sm tracking-normal font-sans">Client Portal</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <p className="text-sm text-white/70 hidden sm:block">{clientName}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full gold-border px-4 py-2 text-sm text-white/70 hover:text-gold-light transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10">{children}</main>
    </div>
  )
}
