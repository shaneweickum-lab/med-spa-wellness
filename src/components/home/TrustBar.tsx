import { Handshake, MessageSquare, Video, FlaskConical } from 'lucide-react'

const items = [
  { icon: Handshake, label: 'Partnered Licensed Healthcare Providers' },
  { icon: MessageSquare, label: 'Simple, Guided Client Intake' },
  { icon: Video, label: 'Telehealth Access via Our Partner' },
  { icon: FlaskConical, label: 'Lab-Informed Protocols' },
]

export function TrustBar() {
  return (
    <section className="border-y border-gold/15 bg-royal/10">
      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 justify-center text-center md:text-left md:justify-start">
            <Icon className="text-gold shrink-0" size={22} />
            <span className="text-sm text-white/70">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
