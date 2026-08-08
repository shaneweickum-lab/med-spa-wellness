import { createClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/admin/getCurrentAdmin'
import { ScheduleView } from '@/components/admin/ScheduleView'
import type { Appointment, Client } from '@/types/admin'

function todayISODate() {
  return new Date().toISOString().slice(0, 10)
}

export default async function AdminSchedulePage() {
  const supabase = await createClient()
  const admin = await getCurrentAdmin()
  const today = todayISODate()

  const [{ data: clients }, { data: appointments }] = await Promise.all([
    supabase.from('clients').select('*').order('full_name', { ascending: true }).returns<Client[]>(),
    supabase
      .from('appointments')
      .select('*')
      .gte('start_time', `${today}T00:00:00`)
      .lte('start_time', `${today}T23:59:59.999`)
      .order('start_time', { ascending: true })
      .returns<Appointment[]>(),
  ])

  return (
    <ScheduleView
      clients={clients ?? []}
      initialDate={today}
      initialAppointments={appointments ?? []}
      adminId={admin?.id ?? ''}
    />
  )
}
