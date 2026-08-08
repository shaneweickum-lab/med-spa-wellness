'use client'

import { useState } from 'react'
import { Mail, Phone, Calendar, MapPin, BadgeCheck } from 'lucide-react'
import { useRealtimeChannel } from '@/lib/hooks/useRealtimeChannel'
import type { Client } from '@/types/admin'

export function OverviewTab({ client: initialClient }: { client: Client }) {
  const [client, setClient] = useState(initialClient)

  useRealtimeChannel('clients', `id=eq.${initialClient.id}`, (payload) => {
    if (payload.eventType === 'UPDATE') setClient(payload.new as Client)
  })

  const rows = [
    { icon: Mail, label: 'Email', value: client.email },
    { icon: Phone, label: 'Phone', value: client.phone },
    { icon: Calendar, label: 'Date of Birth', value: client.date_of_birth ?? 'Not provided' },
    { icon: MapPin, label: 'State of Residence', value: client.state_of_residence ?? 'Not provided' },
    { icon: BadgeCheck, label: 'Status', value: client.status },
  ]

  return (
    <div className="card-panel gold-border rounded-2xl p-6 md:p-8 grid sm:grid-cols-2 gap-6 max-w-3xl">
      {rows.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <Icon className="text-gold mt-0.5 shrink-0" size={18} />
          <div>
            <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
            <p className="text-white/85 capitalize">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
