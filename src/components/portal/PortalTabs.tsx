'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarPlus, LayoutDashboard, MessageSquare, UserCog } from 'lucide-react'
import { OverviewTab } from './OverviewTab'
import { MessagesTab } from './MessagesTab'
import { ProfileTab } from './ProfileTab'
import { BookAppointmentTab } from './BookAppointmentTab'
import type { Client, ClientProtocol, Appointment, ClientMessage } from '@/types/admin'

type Tab = 'overview' | 'book' | 'messages' | 'profile'

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
