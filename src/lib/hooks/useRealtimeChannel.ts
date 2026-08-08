'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// The `new`/`old` row shape varies per table, so callers cast to their own
// row type (`payload.new as ClientNote`, etc.) — typed as `any` here rather
// than `Record<string, unknown>` so that cast doesn't need an `unknown` hop.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChangePayload = RealtimePostgresChangesPayload<any>

/**
 * Subscribes to Postgres changes on `table` (optionally scoped with a
 * single-column filter, e.g. `client_id=eq.<id>`) and invokes `onChange`
 * for every INSERT/UPDATE/DELETE — including ones made by other browsers,
 * tabs, or roles (admin vs. client). Requires the table to be added to the
 * `supabase_realtime` publication (see supabase/migrations/0006_realtime.sql)
 * and only delivers rows the caller's RLS policies already allow it to see.
 *
 * `onChange` is kept in a ref so passing a fresh closure every render never
 * tears down and re-opens the underlying channel — only a change to
 * `table`/`filter` does that.
 */
export function useRealtimeChannel(table: string, filter: string | undefined, onChange: (payload: ChangePayload) => void) {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`rt:${table}:${filter ?? 'all'}:${crypto.randomUUID()}`)
      .on(
        'postgres_changes',
        filter ? { event: '*', schema: 'public', table, filter } : { event: '*', schema: 'public', table },
        (payload: ChangePayload) => onChangeRef.current(payload),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter])
}
