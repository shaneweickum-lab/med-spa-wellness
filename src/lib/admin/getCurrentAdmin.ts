import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export const getCurrentAdmin = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return { id: profile.id as string, fullName: profile.full_name as string, role: profile.role as string, email: user.email }
})
