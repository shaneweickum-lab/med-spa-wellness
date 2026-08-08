import { MessageSquare, UserCog, CalendarClock, ArrowUpRight } from 'lucide-react'
import { LinkButton } from '@/components/Button'

const features = [
  { icon: MessageSquare, label: 'Secure messaging with your care team' },
  { icon: UserCog, label: 'Manage your personal info' },
  { icon: CalendarClock, label: 'Track protocols & upcoming visits' },
]

export function PortalTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="rounded-3xl gold-border-glow bg-gradient-to-br from-royal/40 via-velvet to-cerulean/20 p-10 md:p-14 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="uppercase text-xs tracking-[0.3em] text-cerulean-light">Client Portal</span>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold mt-3 leading-tight">
            Your care, always in reach.
          </h2>
          <p className="text-white/70 mt-4 leading-relaxed max-w-lg">
            Log in anytime to message your provider, review your personal profile, and stay on top of your
            protocol &mdash; all in one refined, secure space.
          </p>
          <div className="mt-8">
            <LinkButton href="/portal" variant="primary">
              Access Client Portal <ArrowUpRight size={16} />
            </LinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-4 card-panel gold-border rounded-2xl px-5 py-4">
              <Icon className="text-gold shrink-0" size={22} />
              <span className="text-sm text-white/80">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
