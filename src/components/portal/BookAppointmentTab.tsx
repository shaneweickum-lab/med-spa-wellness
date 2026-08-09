'use client'

import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { AppointmentBooker } from './AppointmentBooker'
import { useRealtimeChannel } from '@/lib/hooks/useRealtimeChannel'
import type { Appointment } from '@/types/admin'

function findUpcoming(appointments: Appointment[]) {
  const now = Date.now()
  return appointments
    .filter((a) => a.status === 'scheduled' && new Date(a.start_time).getTime() > now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
}

export function BookAppointmentTab({ clientId, appointments: initial }: { clientId: string; appointments: Appointment[] }) {
  const [appointments, setAppointments] = useState(initial)

  useRealtimeChannel('appointments', `client_id=eq.${clientId}`, (payload) => {
    if (payload.eventType === 'DELETE') {
      const oldId = (payload.old as { id?: string }).id
      setAppointments((prev) => prev.filter((a) => a.id !== oldId))
      return
    }
    const row = payload.new as Appointment
    setAppointments((prev) => {
      if (payload.eventType === 'UPDATE') return prev.map((a) => (a.id === row.id ? row : a))
      return prev.some((a) => a.id === row.id) ? prev : [row, ...prev]
    })
  })

  const upcoming = findUpcoming(appointments)

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
      <AppointmentBooker
        onBooked={(appointment) => setAppointments((prev) => [appointment, ...prev])}
      />

      <div className="card-panel gold-border rounded-2xl p-6 h-fit">
        <div className="flex items-center gap-2 text-gold-light mb-4">
          <CalendarClock size={18} />
          <h3 className="font-medium">Upcoming Appointments</h3>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-white/40 text-sm">Nothing scheduled yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((a) => (
              <div key={a.id} className="gold-border rounded-xl p-3">
                <p className="text-white/85 text-sm">
                  {new Date(a.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <p className="text-xs text-white/40 mt-0.5 capitalize">{a.type.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
