import { CheckCircle2, ShieldAlert } from 'lucide-react'
import type { Protocol } from '@/data/protocols'

export function ProtocolCard({ protocol }: { protocol: Protocol }) {
  return (
    <div className="card-panel gold-border rounded-2xl p-6 flex flex-col gap-4 h-full transition-transform duration-300 hover:-translate-y-1 hover:gold-border-glow">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cerulean-light">{protocol.group}</p>
        <h3 className="font-display text-2xl text-gold-light mt-1">{protocol.name}</h3>
      </div>

      <p className="text-white/80 text-sm italic font-display text-base">{protocol.tagline}</p>
      <p className="text-white/60 text-sm leading-relaxed">{protocol.description}</p>

      <ul className="space-y-2">
        {protocol.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-white/70">
            <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <div className="divider-gold" />

      <p className="text-xs text-white/50">
        <span className="text-gold-light font-medium">Administration: </span>
        {protocol.administration}
      </p>

      {protocol.disclaimer && (
        <p className="flex items-start gap-2 text-xs text-white/45">
          <ShieldAlert size={13} className="mt-0.5 shrink-0 text-gold/60" />
          {protocol.disclaimer}
        </p>
      )}
    </div>
  )
}
