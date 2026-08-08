'use client'

import { useState } from 'react'
import { LayoutDashboard, MessageSquare, UserCog } from 'lucide-react'
import { OverviewTab } from './OverviewTab'
import { MessagesTab } from './MessagesTab'
import { ProfileTab } from './ProfileTab'
import type { Client, ClientProtocol, Appointment, ClientMessage } from '@/types/admin'

type Tab = 'overview' | 'messages' | 'profile'

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
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
  const [tab, setTab] = useState<Tab>('overview')

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
        {tab === 'overview' && <OverviewTab client={client} protocols={protocols} appointments={appointments} />}
        {tab === 'messages' && <MessagesTab clientId={client.id} clientName={client.full_name} messages={messages} />}
        {tab === 'profile' && <ProfileTab client={client} />}
      </div>
    </div>
  )
}
