import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentAdmin } from '@/lib/admin/getCurrentAdmin'
import { ClientDetailTabs } from '@/components/admin/client-detail/ClientDetailTabs'
import type {
  Client,
  IntakeSubmission,
  ClientNote,
  ClientMessage,
  ClientProtocol,
  Appointment,
  Payment,
} from '@/types/admin'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const admin = await getCurrentAdmin()

  const [
    { data: clientData },
    { data: intakeSubmissions },
    { data: notes },
    { data: messages },
    { data: protocols },
    { data: appointments },
    { data: payments },
  ] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase
      .from('intake_submissions')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .returns<IntakeSubmission[]>(),
    supabase
      .from('client_notes')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .returns<ClientNote[]>(),
    supabase
      .from('client_messages')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: true })
      .returns<ClientMessage[]>(),
    supabase
      .from('client_protocols')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .returns<ClientProtocol[]>(),
    supabase
      .from('appointments')
      .select('*')
      .eq('client_id', id)
      .order('start_time', { ascending: false })
      .returns<Appointment[]>(),
    supabase
      .from('payments')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false })
      .returns<Payment[]>(),
  ])

  const client = clientData as Client | null
  if (!client) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-gradient-gold">{client.full_name}</h1>
        <p className="text-white/50 text-sm mt-1">
          Client since {new Date(client.created_at).toLocaleDateString()}
        </p>
      </div>

      <ClientDetailTabs
        client={client}
        intakeSubmissions={intakeSubmissions ?? []}
        notes={notes ?? []}
        messages={messages ?? []}
        protocols={protocols ?? []}
        appointments={appointments ?? []}
        payments={payments ?? []}
        adminId={admin?.id ?? ''}
        adminName={admin?.fullName ?? 'Admin'}
      />
    </div>
  )
}
