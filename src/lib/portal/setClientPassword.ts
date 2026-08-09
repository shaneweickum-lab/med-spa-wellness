import type { SupabaseClient } from '@supabase/supabase-js'

// Creates the client's Supabase Auth account with the password they chose
// during intake, or — if they already have one (e.g. re-submitting intake) —
// updates that account's password instead. `link_new_auth_user_to_client`
// (supabase/migrations/0005_client_portal.sql) links the new auth user to
// their `clients` row by email automatically. email_confirm is set to true
// since intake itself is the verification step; there's no separate
// "confirm your email" round-trip for clients.
export async function setClientPassword(admin: SupabaseClient, email: string, password: string) {
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (!createError) return

  if (!createError.message?.toLowerCase().includes('already been registered')) {
    throw createError
  }

  const { data: list, error: listError } = await admin.auth.admin.listUsers()
  if (listError) throw listError

  const existing = list.users.find((u) => u.email?.toLowerCase() === email)
  if (!existing) throw createError

  const { error: updateError } = await admin.auth.admin.updateUserById(existing.id, { password })
  if (updateError) throw updateError
}
