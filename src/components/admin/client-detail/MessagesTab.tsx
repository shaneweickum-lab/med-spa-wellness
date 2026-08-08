'use client'

import { useState } from 'react'
import { Send, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ClientMessage } from '@/types/admin'

export function MessagesTab({
  clientId,
  messages,
  adminName,
}: {
  clientId: string
  messages: ClientMessage[]
  adminName: string
}) {
  const [items, setItems] = useState(messages)
  const [draft, setDraft] = useState('')

  async function send() {
    if (!draft.trim()) return
    const body = draft.trim()
    setDraft('')

    const supabase = createClient()
    const { data, error } = await supabase
      .from('client_messages')
      .insert({ client_id: clientId, sender: 'admin', author_name: adminName, body })
      .select('*')
      .single()

    if (!error && data) {
      setItems((prev) => [...prev, data as ClientMessage])
    }
  }

  return (
    <div className="card-panel gold-border rounded-2xl flex flex-col h-[600px]">
      <div className="px-6 py-4 border-b border-gold/20">
        <h2 className="font-display text-2xl text-gold-light">Messages</h2>
        <p className="text-xs text-white/40">Secure two-way thread with this client.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        {items.length === 0 ? (
          <p className="text-white/40 text-sm text-center my-auto">No messages yet.</p>
        ) : (
          items.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'admin' ? 'flex-row-reverse text-right' : ''}`}>
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-royal to-cerulean flex items-center justify-center">
                <UserRound size={16} className="text-white" />
              </div>
              <div
                className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
                  m.sender === 'admin' ? 'bg-gold/15 text-white' : 'bg-white/5 text-white/80'
                }`}
              >
                <p className="text-xs text-gold-light font-medium mb-1">
                  {m.author_name} &middot; {new Date(m.created_at).toLocaleString()}
                </p>
                <p className="leading-relaxed">{m.body}</p>
              </div>
            </div>
          ))
        )}
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
