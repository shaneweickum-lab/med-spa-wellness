'use client'

import { useState } from 'react'
import { Send, UserRound } from 'lucide-react'

interface Message {
  id: string
  from: 'client' | 'team'
  author: string
  body: string
  time: string
}

const initialMessages: Message[] = [
  {
    id: 'm1',
    from: 'team',
    author: 'Care Coordinator · Morgan',
    body: 'Hi! We’ve received your latest results from our clinical partner and everything looks great. Let’s get your next appointment on the calendar.',
    time: 'Mon 9:14 AM',
  },
  {
    id: 'm2',
    from: 'client',
    author: 'You',
    body: 'Thank you! I have been feeling noticeably better this month. Looking forward to the visit.',
    time: 'Mon 11:02 AM',
  },
  {
    id: 'm3',
    from: 'team',
    author: 'Care Coordinator',
    body: 'Reminder: your telehealth visit with our clinical partner is scheduled for Thursday at 2:00 PM. You will receive a secure link 15 minutes prior.',
    time: 'Tue 8:30 AM',
  },
]

export function MessagesTab() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  function send() {
    if (!draft.trim()) return
    setMessages((m) => [
      ...m,
      { id: `m${m.length + 1}`, from: 'client', author: 'You', body: draft.trim(), time: 'Just now' },
    ])
    setDraft('')
  }

  return (
    <div className="card-panel gold-border rounded-2xl flex flex-col h-[600px]">
      <div className="px-6 py-4 border-b border-gold/20">
        <h2 className="font-display text-2xl text-gold-light">Care Team Messages</h2>
        <p className="text-xs text-white/40">Secure messaging thread with your Soulstys Meridian care team.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.from === 'client' ? 'flex-row-reverse text-right' : ''}`}>
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-royal to-cerulean flex items-center justify-center">
              <UserRound size={16} className="text-white" />
            </div>
            <div className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
              m.from === 'client' ? 'bg-gold/15 text-white' : 'bg-white/5 text-white/80'
            }`}>
              <p className="text-xs text-gold-light font-medium mb-1">{m.author} &middot; {m.time}</p>
              <p className="leading-relaxed">{m.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gold/20 flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a secure message..."
          className="flex-1 rounded-full gold-border bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:gold-border-glow"
        />
        <button
          onClick={send}
          type="button"
          aria-label="Send message"
          className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet flex items-center justify-center hover:brightness-110 transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
