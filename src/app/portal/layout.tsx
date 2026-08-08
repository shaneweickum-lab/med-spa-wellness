import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal | AETHERIA',
  description: 'Secure client portal for messages, personal info, and care plan tracking.',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children
}
