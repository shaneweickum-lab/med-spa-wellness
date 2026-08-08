import type { Metadata } from 'next'
import { PortalLoginForm } from '@/components/portal/PortalLoginForm'

export const metadata: Metadata = {
  title: 'Client Portal Sign In | Soulstys Meridian Wellness',
  robots: { index: false, follow: false },
}

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  return (
    <div className="min-h-screen bg-velvet-gradient flex items-center justify-center px-6 py-16">
      <PortalLoginForm initialError={params.error ? 'That sign-in link expired or was already used. Please request a new one.' : null} />
    </div>
  )
}
