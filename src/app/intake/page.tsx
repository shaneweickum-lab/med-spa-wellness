import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { IntakeForm } from '@/components/intake/IntakeForm'

export const metadata: Metadata = {
  title: 'Client Intake & Quiz | Soulstys Meridian Wellness',
  description: 'Secure client intake and wellness symptom questionnaire.',
}

export default function IntakePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading
        eyebrow="Secure Intake"
        title="Client Intake & Wellness Quiz"
        subtitle="Five short steps to help us understand your goals and match you with our clinical partner — a small intake fee applies to schedule your evaluation."
      />
      <div className="mt-12">
        <Suspense fallback={null}>
          <IntakeForm />
        </Suspense>
      </div>
    </div>
  )
}
