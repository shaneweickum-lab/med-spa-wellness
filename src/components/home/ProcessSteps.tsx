import { ClipboardList, FlaskConical, Stethoscope, HeartPulse } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'

const steps = [
  {
    icon: ClipboardList,
    title: 'Client Intake & Quiz',
    body: 'Complete our secure client intake and symptom questionnaire from anywhere.',
  },
  {
    icon: FlaskConical,
    title: 'Lab Work',
    body: 'Comprehensive hormone panels drawn locally or via our partner lab network.',
  },
  {
    icon: Stethoscope,
    title: 'Clinical Review',
    body: 'Our independent, licensed clinical partner reviews your results and designs your personalized protocol.',
  },
  {
    icon: HeartPulse,
    title: 'Ongoing Care',
    body: 'Telehealth check-ins, progress tracking, and portal messaging keep you supported.',
  },
]

export function ProcessSteps() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="The Soulstys Meridian Experience"
        title="A refined path to optimization"
        subtitle="From first questionnaire to ongoing support, every step is coordinated with our independent, licensed clinical partner."
      />

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <div key={step.title} className="card-panel gold-border rounded-2xl p-6 relative">
            <span className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-royal to-cerulean text-xs font-semibold text-white gold-border">
              {i + 1}
            </span>
            <step.icon className="text-gold" size={26} />
            <h3 className="font-display text-xl text-gold-light mt-4">{step.title}</h3>
            <p className="text-white/60 text-sm mt-2 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
