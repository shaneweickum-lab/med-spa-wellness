import type { Metadata } from 'next'
import { SectionHeading } from '@/components/SectionHeading'
import { IntakeForm } from '@/components/intake/IntakeForm'

export const metadata: Metadata = {
  title: 'Patient Intake & Quiz | AETHERIA',
  description: 'Secure, HIPAA-conscious patient intake and hormone symptom questionnaire.',
}

export default function IntakePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <SectionHeading
        eyebrow="Secure Intake"
        title="Patient Intake & Symptom Quiz"
        subtitle="Five short steps to help your provider understand your health history and goals before your consultation."
      />
      <div className="mt-12">
        <IntakeForm />
      </div>
    </div>
  )
}
