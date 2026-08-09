import { getCurrentClient } from '@/lib/portal/getCurrentClient'

// Server-route auth check for the portal's own API routes — mirrors
// requireSuperadmin() in /api/admin/staff, but for the client identity
// space. Never trust a client-supplied client id; always resolve it from
// the caller's own session.
export async function requireClient() {
  const client = await getCurrentClient()
  if (!client) {
    return { error: 'Not signed in.', status: 401 as const }
  }
  return { client }
}
