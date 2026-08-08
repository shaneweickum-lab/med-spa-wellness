'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  addDays,
  addMonths,
  cursorDateKey,
  formatCursor,
  getZonedDateKey,
  startOfMonthGrid,
  startOfWeek,
  todayCursor,
  zonedTimeToUtc,
} from '@/lib/schedule'
import { MonthView } from './MonthView'
import { TimeGridView } from './TimeGridView'
import { NewAppointmentForm } from './NewAppointmentForm'
import type { Appointment, Client } from '@/types/admin'

type ViewMode = 'month' | 'week' | 'day'

interface GridDay {
  cursor: Date
  dateKey: string
  inCurrentMonth: boolean
}

function buildGridDays(viewMode: ViewMode, anchor: Date): GridDay[] {
  if (viewMode === 'month') {
    const start = startOfMonthGrid(anchor)
    return Array.from({ length: 42 }, (_, i) => {
      const cursor = addDays(start, i)
      return { cursor, dateKey: cursorDateKey(cursor), inCurrentMonth: cursor.getUTCMonth() === anchor.getUTCMonth() }
    })
  }
  if (viewMode === 'week') {
    const start = startOfWeek(anchor)
    return Array.from({ length: 7 }, (_, i) => {
      const cursor = addDays(start, i)
      return { cursor, dateKey: cursorDateKey(cursor), inCurrentMonth: true }
    })
  }
  return [{ cursor: anchor, dateKey: cursorDateKey(anchor), inCurrentMonth: true }]
}

export function CalendarSchedule({ clients, adminId }: { clients: Client[]; adminId: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [anchor, setAnchor] = useState(todayCursor())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [prefill, setPrefill] = useState({ dateKey: cursorDateKey(todayCursor()), time: '09:00' })

  const clientMap = useMemo(() => new Map(clients.map((c) => [c.id, c.full_name])), [clients])
  const gridDays = useMemo(() => buildGridDays(viewMode, anchor), [viewMode, anchor])

  const rangeStartKey = gridDays[0].dateKey
  const rangeEndKey = cursorDateKey(addDays(gridDays[gridDays.length - 1].cursor, 1))

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const start = zonedTimeToUtc(rangeStartKey, '00:00')
      const end = zonedTimeToUtc(rangeEndKey, '00:00')
      const supabase = createClient()
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .gte('start_time', start.toISOString())
        .lt('start_time', end.toISOString())
        .order('start_time', { ascending: true })
        .returns<Appointment[]>()
      if (!cancelled) {
        setAppointments(data ?? [])
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [rangeStartKey, rangeEndKey])

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const a of appointments) {
      const key = getZonedDateKey(new Date(a.start_time))
      const list = map.get(key) ?? []
      list.push(a)
      map.set(key, list)
    }
    return map
  }, [appointments])

  function goToday() {
    setAnchor(todayCursor())
  }

  function goPrev() {
    if (viewMode === 'month') setAnchor((a) => addMonths(a, -1))
    else if (viewMode === 'week') setAnchor((a) => addDays(a, -7))
    else setAnchor((a) => addDays(a, -1))
  }

  function goNext() {
    if (viewMode === 'month') setAnchor((a) => addMonths(a, 1))
    else if (viewMode === 'week') setAnchor((a) => addDays(a, 7))
    else setAnchor((a) => addDays(a, 1))
  }

  function openNewAppointment(dateKey: string, time: string) {
    setPrefill({ dateKey, time })
    setShowForm(true)
  }

  async function cancelAppointment(id: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)))
    const supabase = createClient()
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
  }

  const headerLabel =
    viewMode === 'month'
      ? formatCursor(anchor, { month: 'long', year: 'numeric' })
      : viewMode === 'week'
        ? `${formatCursor(gridDays[0].cursor, { month: 'short', day: 'numeric' })} – ${formatCursor(gridDays[6].cursor, { month: 'short', day: 'numeric', year: 'numeric' })}`
        : formatCursor(anchor, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-gradient-gold">Schedule</h1>
          <p className="text-white/50 text-sm mt-1">All times shown in Eastern (ET). New bookings: 9:00 AM–5:00 PM ET.</p>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? setShowForm(false) : openNewAppointment(cursorDateKey(anchor), '09:00'))}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold hover:brightness-110 transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Close' : 'New Appointment'}
        </button>
      </div>

      {showForm && (
        <NewAppointmentForm
          clients={clients}
          adminId={adminId}
          initialDateKey={prefill.dateKey}
          initialTime={prefill.time}
          existingAppointments={appointments}
          clientMap={clientMap}
          onClose={() => setShowForm(false)}
          onCreated={(appointment) => {
            setAppointments((prev) => [...prev, appointment])
            setShowForm(false)
          }}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="h-9 w-9 flex items-center justify-center rounded-full gold-border text-white/70 hover:text-gold-light transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-full gold-border px-4 py-2 text-sm text-white/70 hover:text-gold-light transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="h-9 w-9 flex items-center justify-center rounded-full gold-border text-white/70 hover:text-gold-light transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <span className="font-display text-xl text-gold-light ml-2">{headerLabel}</span>
        </div>

        <div className="flex gap-2">
          {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition-colors gold-border ${
                viewMode === mode
                  ? 'bg-gradient-to-r from-royal to-cerulean text-white'
                  : 'bg-white/5 text-white/60 hover:text-gold-light'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-white/50 py-16 text-center">Loading…</p>
      ) : viewMode === 'month' ? (
        <MonthView
          gridDays={gridDays}
          appointmentsByDate={appointmentsByDate}
          clientMap={clientMap}
          onSelectDay={(dateKey) => {
            const target = gridDays.find((d) => d.dateKey === dateKey)
            if (target) setAnchor(target.cursor)
            setViewMode('day')
          }}
        />
      ) : (
        <TimeGridView
          days={gridDays.map((d) => d.cursor)}
          appointmentsByDate={appointmentsByDate}
          clientMap={clientMap}
          onSlotClick={openNewAppointment}
          onCancelAppointment={cancelAppointment}
        />
      )}
    </div>
  )
}
