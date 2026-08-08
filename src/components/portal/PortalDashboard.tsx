'use client'

import { useState } from 'react'
import { LayoutDashboard, MessageSquare, UserCog, LogOut } from 'lucide-react'
import { OverviewTab } from './OverviewTab'
import { MessagesTab } from './MessagesTab'
import { ProfileTab } from './ProfileTab'

type Tab = 'overview' | 'messages' | 'profile'

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'profile', label: 'Personal Info', icon: UserCog },
]

export function PortalDashboard({ onLogout }: { onLogout: () => void }) {
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
        <div className="lg:mt-4 lg:pt-4 lg:border-t border-gold/20">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/50 hover:text-gold-light transition-colors shrink-0"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <div>
        {tab === 'overview' && <OverviewTab name="Jordan Ellis" />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>
    </div>
  )
}
