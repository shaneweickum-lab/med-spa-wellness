import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/admin/getCurrentAdmin'
import { StaffTable } from '@/components/admin/StaffTable'
import { NewStaffForm } from '@/components/admin/NewStaffForm'
import type { AdminProfile } from '@/types/admin'

export default async function StaffPage() {
  const admin = await getCurrentAdmin()

  // The nav link is hidden for non-superadmins, but guard the route directly
  // too in case someone navigates here by URL.
  if (!admin || admin.role !== 'superadmin') {
    redirect('/admin/clients')
  }

  const supabase = await createClient()
  const { data: staff } = await supabase
    .from('admin_profiles')
    .select('*')
    .order('created_at', { ascending: true })
    .returns<AdminProfile[]>()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gradient-gold">Staff</h1>
        <p className="text-white/50 text-sm mt-1">Manage who can sign in to the admin portal.</p>
      </div>

      <NewStaffForm />
      <StaffTable staff={staff ?? []} currentUserId={admin.id} />
    </div>
  )
}
