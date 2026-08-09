import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ClientsTable } from '@/components/admin/ClientsTable'
import type { Client } from '@/types/admin'

export default async function AdminClientsPage() {
  const supabase = await createClient()
  const [{ data: clients }, { data: unread }] = await Promise.all([
    supabase.from('clients').select('*').order('created_at', { ascending: false }).returns<Client[]>(),
    supabase
      .from('client_messages')
      .select('id, client_id')
      .eq('sender', 'client')
      .is('read_at', null)
      .returns<{ id: string; client_id: string }[]>(),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-gradient-gold">Clients</h1>
          <p className="text-white/50 text-sm mt-1">{clients?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold hover:brightness-110 transition"
        >
          <UserPlus size={16} />
          New Client
        </Link>
      </div>

      <ClientsTable clients={clients ?? []} unreadMessages={unread ?? []} />
    </div>
  )
}
