import { createClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/admin/getCurrentAdmin'
import { CalendarSchedule } from '@/components/admin/schedule/CalendarSchedule'
import type { Client } from '@/types/admin'

export default async function AdminSchedulePage() {
  const supabase = await createClient()
  const admin = await getCurrentAdmin()

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('full_name', { ascending: true })
    .returns<Client[]>()

  return <CalendarSchedule clients={clients ?? []} adminId={admin?.id ?? ''} />
}
