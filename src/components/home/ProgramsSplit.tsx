import Link from 'next/link'
import { ArrowUpRight, Dumbbell, Flower2 } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'

export function ProgramsSplit() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Two Paths, One Standard of Care"
        title="Tailored to your biology"
        subtitle="Every program begins with comprehensive lab work and a review by our independent, licensed clinical partner — then diverges into a plan built for your goals."
      />

      <div className="mt-14 grid md:grid-cols-2 gap-8">
        <Link
          href="/peptides?focus=men"
          className="group relative overflow-hidden rounded-3xl gold-border p-8 md:p-10 bg-gradient-to-br from-royal/50 via-velvet to-cerulean/20 transition-all hover:gold-border-glow"
        >
          <Dumbbell className="text-cerulean-light" size={32} />
          <h3 className="font-display text-3xl text-gold-light mt-6">Men&rsquo;s Performance</h3>
          <p className="text-white/60 mt-3 leading-relaxed">
            TRT, HCG support, and recovery peptides engineered to restore energy, strength, drive, and
            mental edge.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm text-gold-light group-hover:gap-2 transition-all">
            View TRT &amp; Peptide Protocols <ArrowUpRight size={16} />
          </span>
        </Link>

        <Link
          href="/peptides?focus=women"
          className="group relative overflow-hidden rounded-3xl gold-border p-8 md:p-10 bg-gradient-to-br from-royal/50 via-velvet to-blush/10 transition-all hover:gold-border-glow"
        >
          <Flower2 className="text-blush" size={32} />
          <h3 className="font-display text-3xl text-gold-light mt-6">Women&rsquo;s Hormones</h3>
          <p className="text-white/60 mt-3 leading-relaxed">
            Bio-identical hormone therapy, glow peptides, and metabolic support designed around your
            body&rsquo;s natural rhythm.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm text-gold-light group-hover:gap-2 transition-all">
            View BHRT &amp; Glow Protocols <ArrowUpRight size={16} />
          </span>
        </Link>
      </div>
    </section>
  )
}
