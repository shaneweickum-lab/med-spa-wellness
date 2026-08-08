import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/SectionHeading'
import { ProtocolCard } from '@/components/ProtocolCard'
import { LinkButton } from '@/components/Button'
import { protocols } from '@/data/protocols'

export function FeaturedProtocols() {
  const featured = protocols.filter((p) => p.featured).slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Featured Protocols"
        title="Popular Protocols"
        subtitle="A preview from our full peptide and hormone protocol catalogue — every plan is individualized after clinical review."
      />

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {featured.map((p) => (
          <ProtocolCard key={p.id} protocol={p} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <LinkButton href="/peptides" variant="secondary">
          View Full Catalogue <ArrowRight size={16} />
        </LinkButton>
      </div>
    </section>
  )
}
