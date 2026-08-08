import { CalendarClock, FlaskConical, Syringe } from 'lucide-react'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'
import type { Client, ClientProtocol, Appointment } from '@/types/admin'

function formatAppointment(a: Appointment) {
  return new Date(a.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

function findNextAppointment(appointments: Appointment[]) {
  const now = Date.now()
  return appointments
    .filter((a) => a.status === 'scheduled' && new Date(a.start_time).getTime() > now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0]
}

export function OverviewTab({
  client,
  protocols,
  appointments,
}: {
  client: Client
  protocols: ClientProtocol[]
  appointments: Appointment[]
}) {
  const activeProtocols = protocols.filter((p) => p.status === 'active')
  const nextAppointment = findNextAppointment(appointments)
  const completedVisits = appointments.filter((a) => a.status === 'completed').length

  return (
    <div className="flex flex-col gap-6">
      <div className="card-panel gold-border rounded-2xl p-6 md:p-8">
        <p className="text-white/60 text-sm">Welcome back,</p>
        <h2 className="font-display text-3xl text-gradient-gold">{client.full_name}</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-panel gold-border rounded-2xl p-6">
          <Syringe className="text-gold" size={24} />
          <h3 className="font-display text-lg text-gold-light mt-3">Active Protocol{activeProtocols.length === 1 ? '' : 's'}</h3>
          {activeProtocols.length === 0 ? (
            <p className="text-white/60 text-sm mt-1">None assigned yet</p>
          ) : (
            activeProtocols.map((p) => (
              <p key={p.id} className="text-white/60 text-sm mt-1">
                {p.protocol_name}
              </p>
            ))
          )}
        </div>
        <div className="card-panel gold-border rounded-2xl p-6">
          <CalendarClock className="text-gold" size={24} />
          <h3 className="font-display text-lg text-gold-light mt-3">Next Appointment</h3>
          {nextAppointment ? (
            <>
              <p className="text-white/60 text-sm mt-1">{nextAppointment.reason || 'Scheduled visit'}</p>
              <p className="text-xs text-white/40 mt-2">{formatAppointment(nextAppointment)}</p>
            </>
          ) : (
            <p className="text-white/60 text-sm mt-1">Nothing scheduled</p>
          )}
        </div>
        <div className="card-panel gold-border rounded-2xl p-6">
          <FlaskConical className="text-gold" size={24} />
          <h3 className="font-display text-lg text-gold-light mt-3">Completed Visits</h3>
          <p className="text-white/60 text-sm mt-1">{completedVisits}</p>
          <p className="text-xs text-white/40 mt-2">Since joining {new Date(client.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <DisclaimerBanner variant="compact" />
    </div>
  )
}
