import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/admin/getCurrentAdmin'
import { AdminShell } from '@/components/admin/AdminShell'
import { NotAuthorized } from '@/components/admin/NotAuthorized'

// Every page under this layout depends on the request's auth session and
// live Supabase data — never statically prerender it.
export const dynamic = 'force-dynamic'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return (
      <div className="min-h-screen bg-velvet-gradient flex items-center justify-center px-6 py-16">
        <div className="card-panel gold-border rounded-3xl p-10 max-w-md text-center">
          <h1 className="font-display text-2xl text-gold-light mb-2">Admin Portal Not Configured</h1>
          <p className="text-white/60 text-sm">
            Add <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
            variables to enable the admin portal.
          </p>
        </div>
      </div>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const admin = await getCurrentAdmin()

  if (!admin) {
    return <NotAuthorized email={user.email ?? 'your account'} />
  }

  return (
    <AdminShell adminName={admin.fullName} role={admin.role}>
      {children}
    </AdminShell>
  )
}
