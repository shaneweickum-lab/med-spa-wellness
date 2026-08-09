import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireClient } from '@/lib/portal/requireClient'
import {
  addDays,
  cursorDateKey,
  cursorFromDateKey,
  getZonedMinutesSinceMidnight,
  isWithinBusinessHours,
  zonedTimeToUtc,
} from '@/lib/schedule'
import type { Appointment } from '@/types/admin'

const APPOINTMENT_DURATION_MINUTES = 30

// GET: busy time ranges (no client identity, just start/end minutes) for one
// calendar day, so the booking widget can grey out slots that are already
// taken — by any client, since there's one care team handling one
// appointment at a time. POST: books a 30-minute slot for the signed-in
// client, resolving `client_id` from their own session rather than trusting
// anything from the request body.
export async function GET(req: Request) {
  const auth = await requireClient()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const dateKey = new URL(req.url).searchParams.get('date')
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return NextResponse.json({ error: 'A valid date is required.' }, { status: 400 })
  }

  try {
    const admin = getSupabaseAdmin()
    const dayStart = zonedTimeToUtc(dateKey, '00:00')
    const dayEnd = zonedTimeToUtc(cursorDateKey(addDays(cursorFromDateKey(dateKey), 1)), '00:00')

    const { data, error } = await admin
      .from('appointments')
      .select('start_time, duration_minutes, status')
      .gte('start_time', dayStart.toISOString())
      .lt('start_time', dayEnd.toISOString())
      .returns<Pick<Appointment, 'start_time' | 'duration_minutes' | 'status'>[]>()

    if (error) throw error

    const busy = (data ?? [])
      .filter((a) => a.status !== 'cancelled')
      .map((a) => {
        const startMinutes = getZonedMinutesSinceMidnight(new Date(a.start_time))
        return { startMinutes, endMinutes: startMinutes + a.duration_minutes }
      })

    return NextResponse.json({ busy })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to load availability.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const auth = await requireClient()
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { dateKey?: string; time?: string; reason?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { dateKey, time, reason } = body
  if (!dateKey || !time) {
    return NextResponse.json({ error: 'A date and time are required.' }, { status: 400 })
  }

  const startUtc = zonedTimeToUtc(dateKey, time)
  if (Number.isNaN(startUtc.getTime())) {
    return NextResponse.json({ error: 'Invalid date or time.' }, { status: 400 })
  }
  if (startUtc.getTime() <= Date.now()) {
    return NextResponse.json({ error: 'Please choose a time in the future.' }, { status: 400 })
  }
  if (!isWithinBusinessHours(startUtc, APPOINTMENT_DURATION_MINUTES)) {
    return NextResponse.json({ error: 'Appointments can only be scheduled between 9:00 AM–5:00 PM ET.' }, { status: 400 })
  }

  try {
    const admin = getSupabaseAdmin()
    const dayStart = zonedTimeToUtc(dateKey, '00:00')
    const dayEnd = zonedTimeToUtc(cursorDateKey(addDays(cursorFromDateKey(dateKey), 1)), '00:00')

    const { data: sameDay, error: sameDayError } = await admin
      .from('appointments')
      .select('start_time, duration_minutes, status')
      .gte('start_time', dayStart.toISOString())
      .lt('start_time', dayEnd.toISOString())
      .returns<Pick<Appointment, 'start_time' | 'duration_minutes' | 'status'>[]>()

    if (sameDayError) throw sameDayError

    const startMs = startUtc.getTime()
    const endMs = startMs + APPOINTMENT_DURATION_MINUTES * 60000
    const conflict = (sameDay ?? []).some((a) => {
      if (a.status === 'cancelled') return false
      const aStart = new Date(a.start_time).getTime()
      const aEnd = aStart + a.duration_minutes * 60000
      return startMs < aEnd && endMs > aStart
    })
    if (conflict) {
      return NextResponse.json({ error: 'That time was just booked — please choose another slot.' }, { status: 409 })
    }

    const { count: existingCount, error: countError } = await admin
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', auth.client.id)

    if (countError) throw countError

    const { data: created, error: insertError } = await admin
      .from('appointments')
      .insert({
        client_id: auth.client.id,
        start_time: startUtc.toISOString(),
        duration_minutes: APPOINTMENT_DURATION_MINUTES,
        status: 'scheduled',
        type: (existingCount ?? 0) === 0 ? 'intake' : 'consultation',
        reason: reason?.trim() || null,
      })
      .select('*')
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ appointment: created })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to book your appointment.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
