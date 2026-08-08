import type { Metadata } from 'next'
import { ClipboardList, LayoutDashboard, MessageSquare, Handshake, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'
import { LinkButton } from '@/components/Button'

export const metadata: Metadata = {
  title: 'Client Platform | Soulstys Meridian Wellness',
  description:
    'How Soulstys Meridian Wellness handles client intake, tracking, and communication alongside our independent licensed healthcare partner.',
}

const platformFeatures = [
  {
    icon: ClipboardList,
    title: 'Guided Client Intake',
    body: 'A streamlined intake and symptom quiz captures your goals and health history, then routes it to our clinical partner for evaluation.',
  },
  {
    icon: LayoutDashboard,
    title: 'Client Tracking Dashboard',
    body: 'See your active program, upcoming appointments, and progress at a glance from your client portal.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Communication',
    body: 'Message your Soulstys care coordinator anytime with questions about scheduling, billing, or your program.',
  },
  {
    icon: Handshake,
    title: 'Partnered Clinical Care',
    body: 'All lab work, prescribing, and treatment are handled by our independent, licensed healthcare partner — we coordinate the experience around it.',
  },
]

export default function PlatformPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Our Platform"
        title="Intake, Tracking & Communication — All in One Place"
        subtitle="We built our own client platform to make working with our clinical partner simple: one intake, one dashboard, one place to message your care team."
      />

      <div className="mt-14 grid md:grid-cols-2 gap-6">
        {platformFeatures.map((item) => (
          <div key={item.title} className="card-panel gold-border rounded-2xl p-6 flex gap-4">
            <item.icon className="text-gold shrink-0" size={28} />
            <div>
              <h3 className="font-display text-xl text-gold-light">{item.title}</h3>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl gold-border-glow bg-gradient-to-br from-royal/40 via-velvet to-cerulean/20 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-3xl text-gradient-gold">Ready to get started?</h3>
          <p className="text-white/70 mt-2">Complete your intake or check your dashboard in the client portal.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <LinkButton href="/intake" variant="primary">
            Start Client Intake <ArrowRight size={16} />
          </LinkButton>
          <LinkButton href="/portal" variant="secondary">
            Go to Client Portal
          </LinkButton>
        </div>
      </div>

      <div className="mt-16 gold-border rounded-2xl p-6 bg-white/5">
        <h3 className="font-display text-2xl text-gold-light mb-3">How This Works</h3>
        <p className="text-white/60 text-sm leading-relaxed">
          Soulstys Meridian Wellness is a client experience and care coordination company — we are not a
          healthcare provider and do not diagnose, prescribe, or deliver clinical care ourselves. All
          medical evaluation, prescribing, and treatment are provided by our independent, licensed
          healthcare partner. Our platform exists to make your intake, scheduling, progress tracking, and
          communication with that partner as seamless as possible.
        </p>
      </div>

      <div className="mt-10">
        <DisclaimerBanner />
      </div>
    </div>
  )
}
