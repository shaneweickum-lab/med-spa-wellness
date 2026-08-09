'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { useRealtimeChannel } from '@/lib/hooks/useRealtimeChannel'
import { NotificationBadge } from '@/components/NotificationBadge'
import type { Client, ClientMessage } from '@/types/admin'

const statusStyle: Record<Client['status'], string> = {
  active: 'text-cerulean-light border-cerulean/40 bg-cerulean/10',
  pending: 'text-gold-light border-gold/40 bg-gold/10',
  inactive: 'text-white/50 border-white/20 bg-white/5',
}

export function ClientsTable({
  clients,
  unreadMessages,
}: {
  clients: Client[]
  unreadMessages: { id: string; client_id: string }[]
}) {
  const [items, setItems] = useState(clients)
  const [query, setQuery] = useState('')
  const [unreadMap, setUnreadMap] = useState(() => new Map(unreadMessages.map((m) => [m.id, m.client_id])))

  useRealtimeChannel('clients', undefined, (payload) => {
    if (payload.eventType === 'DELETE') {
      const oldId = (payload.old as { id?: string }).id
      setItems((prev) => prev.filter((c) => c.id !== oldId))
      return
    }
    const row = payload.new as Client
    setItems((prev) => {
      if (payload.eventType === 'UPDATE') return prev.map((c) => (c.id === row.id ? row : c))
      return prev.some((c) => c.id === row.id) ? prev : [...prev, row]
    })
  })

  useRealtimeChannel('client_messages', undefined, (payload) => {
    if (payload.eventType === 'DELETE') {
      const oldId = (payload.old as { id?: string }).id
      if (!oldId) return
      setUnreadMap((prev) => {
        if (!prev.has(oldId)) return prev
        const next = new Map(prev)
        next.delete(oldId)
        return next
      })
      return
    }
    const row = payload.new as ClientMessage
    setUnreadMap((prev) => {
      const isUnreadFromClient = row.sender === 'client' && !row.read_at
      const alreadyTracked = prev.has(row.id)
      if (isUnreadFromClient === alreadyTracked) return prev
      const next = new Map(prev)
      if (isUnreadFromClient) next.set(row.id, row.client_id)
      else next.delete(row.id)
      return next
    })
  })

  const unreadCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const clientId of unreadMap.values()) {
      counts.set(clientId, (counts.get(clientId) ?? 0) + 1)
    }
    return counts
  }, [unreadMap])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (c) => c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q),
    )
  }, [items, query])

  return (
    <div>
      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full rounded-full gold-border bg-white/5 pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:gold-border-glow"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/50 py-16 text-center">No clients found.</p>
      ) : (
        <div className="card-panel gold-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/40 uppercase text-xs tracking-wide border-b border-gold/20">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/clients/${c.id}`} className="inline-flex items-center gap-2 text-gold-light hover:underline">
                      {c.full_name}
                      <NotificationBadge count={unreadCounts.get(c.id) ?? 0} />
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-white/70">{c.email}</td>
                  <td className="px-5 py-3 text-white/70">{c.phone}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyle[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white/50">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
