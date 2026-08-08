'use client'

import { useState } from 'react'
import { PortalLogin } from '@/components/portal/PortalLogin'
import { PortalDashboard } from '@/components/portal/PortalDashboard'

export default function PortalPage() {
  const [authenticated, setAuthenticated] = useState(false)

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col min-h-[70vh] justify-center">
      {authenticated ? (
        <PortalDashboard onLogout={() => setAuthenticated(false)} />
      ) : (
        <PortalLogin onLogin={() => setAuthenticated(true)} />
      )}
    </div>
  )
}
