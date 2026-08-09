'use client'

import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  ClipboardList,
  Syringe,
  StickyNote,
  MessageSquare,
  CalendarClock,
  CreditCard,
} from 'lucide-react'
import type {
  Client,
  IntakeSubmission,
  ClientNote,
  ClientMessage,
  ClientProtocol,
  Appointment,
  Payment,
} from '@/types/admin'
import { OverviewTab } from './OverviewTab'
import { IntakeTab } from './IntakeTab'
import { ProtocolsTab } from './ProtocolsTab'
import { NotesTab } from './NotesTab'
import { MessagesTab } from './MessagesTab'
import { AppointmentsTab } from './AppointmentsTab'
import { PaymentsTab } from './PaymentsTab'
import { NotificationBadge } from '@/components/NotificationBadge'
import { useRealtimeChannel } from '@/lib/hooks/useRealtimeChannel'
import { createClient } from '@/lib/supabase/client'

type Tab = 'overview' | 'intake' | 'protocols' | 'appointments' | 'payments' | 'notes' | 'messages'

function unreadFromClient(messages: ClientMessage[]) {
  return new Set(messages.filter((m) => m.sender === 'client' && !m.read_at).map((m) => m.id))
}

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'intake', label: 'Intake Answers', icon: ClipboardList },
  { id: 'protocols', label: 'Protocols', icon: Syringe },
  { id: 'appointments', label: 'Appointments', icon: CalendarClock },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
]

export function ClientDetailTabs({
  client,
  intakeSubmissions,
  notes,
  messages,
  protocols,
  appointments,
  payments,
  adminId,
  adminName,
}: {
  client: Client
  intakeSubmissions: IntakeSubmission[]
  notes: ClientNote[]
  messages: ClientMessage[]
  protocols: ClientProtocol[]
  appointments: Appointment[]
  payments: Payment[]
  adminId: string
  adminName: string
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const [unreadIds, setUnreadIds] = useState(() => unreadFromClient(messages))

  useRealtimeChannel('client_messages', `client_id=eq.${client.id}`, (payload) => {
    if (payload.eventType === 'DELETE') {
      const oldId = (payload.old as { id?: string }).id
      setUnreadIds((prev) => {
        if (!oldId || !prev.has(oldId)) return prev
        const next = new Set(prev)
        next.delete(oldId)
        return next
      })
      return
    }
    const row = payload.new as ClientMessage
    setUnreadIds((prev) => {
      const isUnreadFromClient = row.sender === 'client' && !row.read_at
      const alreadyTracked = prev.has(row.id)
      if (isUnreadFromClient === alreadyTracked) return prev
      const next = new Set(prev)
      if (isUnreadFromClient) next.add(row.id)
      else next.delete(row.id)
      return next
    })
  })

  useEffect(() => {
    if (tab !== 'messages' || unreadIds.size === 0) return
    const supabase = createClient()
    supabase
      .from('client_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('client_id', client.id)
      .eq('sender', 'client')
      .is('read_at', null)
      .then(({ error }) => {
        if (error) console.error('Failed to mark messages as read:', error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, client.id])

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gold/20 pb-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
              tab === id ? 'bg-gradient-to-r from-royal to-cerulean text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            {label}
            {id === 'messages' && <NotificationBadge count={unreadIds.size} />}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab client={client} />}
      {tab === 'intake' && <IntakeTab clientId={client.id} submissions={intakeSubmissions} />}
      {tab === 'protocols' && (
        <ProtocolsTab clientId={client.id} protocols={protocols} adminId={adminId} />
      )}
      {tab === 'appointments' && <AppointmentsTab clientId={client.id} appointments={appointments} />}
      {tab === 'payments' && <PaymentsTab clientId={client.id} payments={payments} adminId={adminId} />}
      {tab === 'notes' && <NotesTab clientId={client.id} notes={notes} adminId={adminId} adminName={adminName} />}
      {tab === 'messages' && (
        <MessagesTab clientId={client.id} messages={messages} adminName={adminName} />
      )}
    </div>
  )
}
