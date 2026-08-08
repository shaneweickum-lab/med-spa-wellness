import type { Metadata } from 'next'
import { SectionHeading } from '@/components/SectionHeading'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'
import { CatalogueClient } from '@/components/peptides/CatalogueClient'

export const metadata: Metadata = {
  title: 'Peptide & Hormone Protocol Catalogue | Soulstys Meridian Wellness',
  description: 'Explore our interactive catalogue of HRT and peptide therapy protocols.',
}

function toFilter(value: string | undefined) {
  if (value === 'hormone' || value === 'peptide') return value
  return 'all' as const
}

export default async function PeptidesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const params = await searchParams
  const initialType = toFilter(params.type)

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Protocol Catalogue"
        title="Peptide & Hormone Protocols"
        subtitle="A curated library of therapies used across our HRT and peptide programs. Every protocol is individualized after labs and evaluation by our independent, licensed clinical partner — nothing here is a prescription or self-directed treatment plan."
      />

      <div className="mt-10">
        <DisclaimerBanner />
      </div>

      <div className="mt-12">
        <CatalogueClient initialType={initialType} />
      </div>
    </div>
  )
}
