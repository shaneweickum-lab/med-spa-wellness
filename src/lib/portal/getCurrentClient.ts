import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Client } from '@/types/admin'

export const getCurrentClient = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: client } = await supabase.from('clients').select('*').eq('user_id', user.id).single()

  if (!client) return null

  return client as Client
})
