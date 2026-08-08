import Link from 'next/link'
import { ArrowUpRight, Activity, FlaskConical } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'

export function ProgramsSplit() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Two Modalities, One Standard of Care"
        title="Tailored to your biology"
        subtitle="Every program begins with comprehensive lab work and a review by our independent, licensed clinical partner — then diverges into a plan built for your goals."
      />

      <div className="mt-14 grid md:grid-cols-2 gap-8">
        <Link
          href="/peptides?type=hormone"
          className="group relative overflow-hidden rounded-3xl gold-border p-8 md:p-10 bg-gradient-to-br from-royal/50 via-velvet to-cerulean/20 transition-all hover:gold-border-glow"
        >
          <Activity className="text-cerulean-light" size={32} />
          <h3 className="font-display text-3xl text-gold-light mt-6">Hormone Optimization</h3>
          <p className="text-white/60 mt-3 leading-relaxed">
            HRT protocols individualized to your labs and goals — restoring energy, balance, and vitality.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm text-gold-light group-hover:gap-2 transition-all">
            View HRT Protocols <ArrowUpRight size={16} />
          </span>
        </Link>

        <Link
          href="/peptides?type=peptide"
          className="group relative overflow-hidden rounded-3xl gold-border p-8 md:p-10 bg-gradient-to-br from-royal/50 via-velvet to-blush/10 transition-all hover:gold-border-glow"
        >
          <FlaskConical className="text-blush" size={32} />
          <h3 className="font-display text-3xl text-gold-light mt-6">Peptide Therapy</h3>
          <p className="text-white/60 mt-3 leading-relaxed">
            Targeted peptide protocols for recovery, performance, metabolic health, and longevity.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm text-gold-light group-hover:gap-2 transition-all">
            View Peptide Protocols <ArrowUpRight size={16} />
          </span>
        </Link>
      </div>
    </section>
  )
}
