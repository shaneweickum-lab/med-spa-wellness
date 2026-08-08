import { createClient } from '@/lib/supabase/server'
import { getCurrentClient } from '@/lib/portal/getCurrentClient'
import { PortalTabs } from '@/components/portal/PortalTabs'
import type { ClientProtocol, Appointment, ClientMessage } from '@/types/admin'

export default async function PortalDashboardPage() {
  const client = await getCurrentClient()
  const supabase = await createClient()

  // Guaranteed non-null here — the layout above already redirects/blocks
  // otherwise.
  const clientId = client!.id

  const [{ data: protocols }, { data: appointments }, { data: messages }] = await Promise.all([
    supabase.from('client_protocols').select('*').eq('client_id', clientId).returns<ClientProtocol[]>(),
    supabase.from('appointments').select('*').eq('client_id', clientId).returns<Appointment[]>(),
    supabase
      .from('client_messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true })
      .returns<ClientMessage[]>(),
  ])

  return (
    <PortalTabs
      client={client!}
      protocols={protocols ?? []}
      appointments={appointments ?? []}
      messages={messages ?? []}
    />
  )
}
