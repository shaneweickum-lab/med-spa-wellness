import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal | Soulstys Meridian Wellness',
  description: 'Secure client portal for messages, personal info, and program tracking.',
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children
}
