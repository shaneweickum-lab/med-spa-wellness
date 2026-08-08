import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Consultation | AETHERIA',
  description: 'Request a consultation for TRT, BHRT, or peptide therapy at AETHERIA.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
