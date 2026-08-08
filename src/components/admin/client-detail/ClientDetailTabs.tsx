'use client'

import { useState } from 'react'
import { LayoutDashboard, ClipboardList, Syringe, StickyNote, MessageSquare } from 'lucide-react'
import type { Client, IntakeSubmission, ClientNote, ClientMessage, ClientProtocol } from '@/types/admin'
import { OverviewTab } from './OverviewTab'
import { IntakeTab } from './IntakeTab'
import { ProtocolsTab } from './ProtocolsTab'
import { NotesTab } from './NotesTab'
import { MessagesTab } from './MessagesTab'

type Tab = 'overview' | 'intake' | 'protocols' | 'notes' | 'messages'

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'intake', label: 'Intake Answers', icon: ClipboardList },
  { id: 'protocols', label: 'Protocols', icon: Syringe },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
]

export function ClientDetailTabs({
  client,
  intakeSubmissions,
  notes,
  messages,
  protocols,
  adminId,
  adminName,
}: {
  client: Client
  intakeSubmissions: IntakeSubmission[]
  notes: ClientNote[]
  messages: ClientMessage[]
  protocols: ClientProtocol[]
  adminId: string
  adminName: string
}) {
  const [tab, setTab] = useState<Tab>('overview')

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
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab client={client} />}
      {tab === 'intake' && <IntakeTab submissions={intakeSubmissions} />}
      {tab === 'protocols' && (
        <ProtocolsTab clientId={client.id} protocols={protocols} adminId={adminId} />
      )}
      {tab === 'notes' && <NotesTab clientId={client.id} notes={notes} adminId={adminId} adminName={adminName} />}
      {tab === 'messages' && (
        <MessagesTab clientId={client.id} messages={messages} adminName={adminName} />
      )}
    </div>
  )
}
