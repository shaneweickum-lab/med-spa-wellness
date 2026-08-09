'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarPlus, LayoutDashboard, MessageSquare, UserCog } from 'lucide-react'
import { OverviewTab } from './OverviewTab'
import { MessagesTab } from './MessagesTab'
import { ProfileTab } from './ProfileTab'
import { BookAppointmentTab } from './BookAppointmentTab'
import { NotificationBadge } from '@/components/NotificationBadge'
import { useRealtimeChannel } from '@/lib/hooks/useRealtimeChannel'
import type { Client, ClientProtocol, Appointment, ClientMessage } from '@/types/admin'

type Tab = 'overview' | 'book' | 'messages' | 'profile'

function unreadFromAdmin(messages: ClientMessage[]) {
  return new Set(messages.filter((m) => m.sender === 'admin' && !m.read_at).map((m) => m.id))
}

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'book', label: 'Book Appointment', icon: CalendarPlus },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'profile', label: 'Personal Info', icon: UserCog },
]

export function PortalTabs({
  client,
  protocols,
  appointments,
  messages,
}: {
  client: Client
  protocols: ClientProtocol[]
  appointments: Appointment[]
  messages: ClientMessage[]
}) {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>(searchParams.get('welcome') ? 'book' : 'overview')
  const [unreadIds, setUnreadIds] = useState(() => unreadFromAdmin(messages))

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
      const isUnreadFromAdmin = row.sender === 'admin' && !row.read_at
      const alreadyTracked = prev.has(row.id)
      if (isUnreadFromAdmin === alreadyTracked) return prev
      const next = new Set(prev)
      if (isUnreadFromAdmin) next.add(row.id)
      else next.delete(row.id)
      return next
    })
  })

  useEffect(() => {
    if (tab !== 'messages' || unreadIds.size === 0) return
    fetch('/api/portal/messages/mark-read', { method: 'POST' }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, client.id])

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
      <aside className="card-panel gold-border rounded-2xl p-4 h-fit flex lg:flex-col gap-2 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm shrink-0 transition-colors ${
              tab === id ? 'bg-gradient-to-r from-royal to-cerulean text-white' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <Icon size={18} />
            {label}
            {id === 'messages' && <NotificationBadge count={unreadIds.size} />}
          </button>
        ))}
      </aside>

      <div>
        {searchParams.get('welcome') && (
          <div className="gold-border-glow rounded-2xl bg-white/5 p-5 mb-6">
            <p className="text-gold-light font-medium mb-1">Welcome, {client.full_name.split(' ')[0]}!</p>
            <p className="text-white/60 text-sm">
              Your intake is complete — pick a time below for your first appointment with our clinical
              partner.
            </p>
          </div>
        )}
        {tab === 'overview' && (
          <OverviewTab
            client={client}
            protocols={protocols}
            appointments={appointments}
            onBookAppointment={() => setTab('book')}
          />
        )}
        {tab === 'book' && <BookAppointmentTab clientId={client.id} appointments={appointments} />}
        {tab === 'messages' && <MessagesTab clientId={client.id} clientName={client.full_name} messages={messages} />}
        {tab === 'profile' && <ProfileTab client={client} />}
      </div>
    </div>
  )
}
