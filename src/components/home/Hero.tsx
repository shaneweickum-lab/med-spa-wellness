'use client'

import { ArrowRight, ShieldCheck } from 'lucide-react'
import { LinkButton } from '@/components/Button'
import { GenderToggle } from '@/components/GenderToggle'
import { useFocus } from '@/context/FocusContext'
import { focusCopy } from '@/data/protocols'

export function Hero() {
  const { focus } = useFocus()
  const copy = focusCopy[focus]

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-royal/40 blur-[120px]" aria-hidden />
      <div className="absolute -top-20 -right-40 h-96 w-96 rounded-full bg-cerulean/30 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 flex flex-col items-center text-center gap-8">
        <span className="flex items-center gap-2 rounded-full gold-border bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold-light">
          <ShieldCheck size={14} />
          Concierge Care Coordination &middot; TRT, BHRT &amp; Peptide Programs
        </span>

        <GenderToggle />

        <div key={focus} className="flex flex-col items-center gap-5 max-w-3xl">
          <p className="uppercase text-sm tracking-[0.3em] text-cerulean-light">{copy.kicker}</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-gradient-gold">
            {copy.headline}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl">{copy.body}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <LinkButton href="/contact" variant="primary">
            Book a Consultation <ArrowRight size={16} />
          </LinkButton>
          <LinkButton href="/peptides" variant="secondary">
            Explore Protocols
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
