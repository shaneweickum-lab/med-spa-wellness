'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Users, CalendarClock, ShieldCheck, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/schedule', label: 'Schedule', icon: CalendarClock },
]

const superadminLinks = [{ href: '/admin/staff', label: 'Staff', icon: ShieldCheck }]

export function AdminShell({
  adminName,
  role,
  children,
}: {
  adminName: string
  role: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-velvet-gradient flex flex-col">
      <header className="border-b border-gold/20 bg-velvet/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1600px] px-6 py-4 flex items-center justify-between">
          <Link href="/admin/clients" className="flex items-center gap-2.5">
            <Image src="/images/logo-mark.png" alt="" width={913} height={1037} className="h-8 w-auto" />
            <span className="font-display text-xl tracking-[0.1em] text-gradient-gold">
              SOULSTYS MERIDIAN <span className="text-white/50 text-sm tracking-normal font-sans">Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white/80">{adminName}</p>
              <p className="text-xs text-gold-light/70 capitalize">{role}</p>
            </div>
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

      <div className="flex-1 mx-auto max-w-[1600px] w-full px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="flex lg:flex-col gap-2 overflow-x-auto">
          {[...links, ...(role === 'superadmin' ? superadminLinks : [])].map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm shrink-0 transition-colors ${
                  active ? 'bg-gradient-to-r from-royal to-cerulean text-white' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </aside>

        <main>{children}</main>
      </div>
    </div>
  )
}
