import type { Metadata } from 'next'
import { Video, FolderSync, ShieldCheck, Webhook, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'
import { LinkButton } from '@/components/Button'

export const metadata: Metadata = {
  title: 'Telehealth & EMR Integration | AETHERIA',
  description: 'Telehealth visits and EMR-connected care for AETHERIA patients.',
}

const integrationSteps = [
  {
    icon: FolderSync,
    title: 'EMR-Synced Records',
    body: 'Intake forms, lab results, and provider notes sync into your electronic medical record so every clinician on your care team has a current view of your protocol.',
  },
  {
    icon: Video,
    title: 'Live Telehealth Visits',
    body: 'Meet with your prescribing physician over secure video for consultations, follow-ups, and dose adjustments — no waiting room required.',
  },
  {
    icon: Webhook,
    title: 'Pharmacy & Lab Connections',
    body: 'Approved protocols route directly to our compounding pharmacy and partner lab network for prescription fulfillment and testing.',
  },
  {
    icon: ShieldCheck,
    title: 'Encrypted End-to-End',
    body: 'All clinical data in transit and at rest is encrypted, access-logged, and limited to your authorized care team.',
  },
]

export default function TelehealthPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        eyebrow="Connected Care"
        title="Telehealth & EMR Integration"
        subtitle="Your intake, labs, visits, and messages live in one connected clinical record — accessible to you and your care team, wherever you are."
      />

      <div className="mt-14 grid md:grid-cols-2 gap-6">
        {integrationSteps.map((item) => (
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
          <h3 className="font-display text-3xl text-gradient-gold">Ready for your next visit?</h3>
          <p className="text-white/70 mt-2">Join a telehealth visit or check your upcoming appointments in the client portal.</p>
        </div>
        <LinkButton href="/portal" variant="primary">
          Go to Client Portal <ArrowRight size={16} />
        </LinkButton>
      </div>

      <div className="mt-16 gold-border rounded-2xl p-6 bg-white/5">
        <h3 className="font-display text-2xl text-gold-light mb-3">Architecture Note</h3>
        <p className="text-white/60 text-sm leading-relaxed">
          This page illustrates how AETHERIA&rsquo;s telehealth and EMR integration would be presented to
          patients. A production build would connect to a certified EMR/EHR platform (e.g. via FHIR APIs)
          and a HIPAA-compliant video vendor under a signed Business Associate Agreement (BAA), with all PHI
          encrypted in transit and at rest and access strictly limited to authorized clinical staff.
        </p>
      </div>

      <div className="mt-10">
        <DisclaimerBanner />
      </div>
    </div>
  )
}
