import type { Metadata } from 'next'
import { SectionHeading } from '@/components/SectionHeading'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'
import { CatalogueClient } from '@/components/peptides/CatalogueClient'

export const metadata: Metadata = {
  title: 'Peptide & Hormone Protocol Catalogue | AETHERIA',
  description:
    'Explore our interactive catalogue of TRT, BHRT, and peptide therapy protocols for men and women.',
}

function toFilter(value: string | undefined) {
  if (value === 'men' || value === 'women' || value === 'both') return value
  return 'all' as const
}

export default async function PeptidesPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>
}) {
  const params = await searchParams
  const initialFocus = toFilter(params.focus)

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <SectionHeading
        eyebrow="Protocol Catalogue"
        title="Peptide & Hormone Protocols"
        subtitle="A curated library of therapies used across our TRT, BHRT, and peptide programs. Every protocol is individualized after labs and a physician consultation — nothing here is a prescription or self-directed treatment plan."
      />

      <div className="mt-10">
        <DisclaimerBanner />
      </div>

      <div className="mt-12">
        <CatalogueClient initialFocus={initialFocus} />
      </div>
    </div>
  )
}
