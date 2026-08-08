'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, SelectInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'
import type { Appointment, Client } from '@/types/admin'

const DURATIONS = [10, 15, 20, 25, 30, 35, 40, 45]

function todayISODate() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

function dayRange(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00`)
  const end = new Date(`${dateStr}T23:59:59.999`)
  return { start: start.toISOString(), end: end.toISOString() }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function endTime(iso: string, durationMinutes: number) {
  const end = new Date(new Date(iso).getTime() + durationMinutes * 60000)
  return end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const statusStyle: Record<Appointment['status'], string> = {
  scheduled: 'text-cerulean-light border-cerulean/40 bg-cerulean/10',
  completed: 'text-gold-light border-gold/40 bg-gold/10',
  cancelled: 'text-white/40 border-white/20 bg-white/5 line-through',
  no_show: 'text-red-300 border-red-400/30 bg-red-500/10',
}

export function ScheduleView({
  clients,
  initialDate,
  initialAppointments,
  adminId,
}: {
  clients: Client[]
  initialDate: string
  initialAppointments: Appointment[]
  adminId: string
}) {
  const [date, setDate] = useState(initialDate || todayISODate())
  const [appointments, setAppointments] = useState(initialAppointments)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    clientId: clients[0]?.id ?? '',
    time: '10:00',
    duration: 30,
    reason: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [conflict, setConflict] = useState<Appointment | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const clientMap = useMemo(() => new Map(clients.map((c) => [c.id, c.full_name])), [clients])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { start, end } = dayRange(date)
      const supabase = createClient()
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .gte('start_time', start)
        .lte('start_time', end)
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
  }, [date])

  function findConflict(startISO: string, durationMinutes: number) {
    const start = new Date(startISO).getTime()
    const end = start + durationMinutes * 60000
    return (
      appointments.find((a) => {
        if (a.status === 'cancelled') return false
        const aStart = new Date(a.start_time).getTime()
        const aEnd = aStart + a.duration_minutes * 60000
        return start < aEnd && end > aStart
      }) ?? null
    )
  }

  async function submitAppointment(force = false) {
    setError(null)
    const startISO = new Date(`${date}T${form.time}:00`).toISOString()

    if (!force) {
      const existing = findConflict(startISO, form.duration)
      if (existing) {
        setConflict(existing)
        return
      }
    }
    setConflict(null)
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert({
          client_id: form.clientId,
          admin_id: adminId,
          start_time: startISO,
          duration_minutes: form.duration,
          reason: form.reason || null,
        })
        .select('*')
        .single()

      if (insertError) throw insertError
      setAppointments((prev) =>
        [...prev, data as Appointment].sort(
          (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
        ),
      )
      setShowForm(false)
      setForm((f) => ({ ...f, reason: '' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to schedule appointment.')
    } finally {
      setIsSaving(false)
    }
  }

  async function cancelAppointment(id: string) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)))
    const supabase = createClient()
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-gradient-gold">Schedule</h1>
          <p className="text-white/50 text-sm mt-1">Appointment blocks in 5-minute increments, 10–45 minutes.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-full gold-border bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:gold-border-glow"
          />
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold hover:brightness-110 transition"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Appointment'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card-panel gold-border rounded-2xl p-6 mb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="Client" required>
              <SelectInput value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Start Time" required>
              <TextInput
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </Field>
            <Field label="Duration" required>
              <SelectInput
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} minutes
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Reason" hint="Optional">
              <TextInput value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} />
            </Field>
          </div>

          {error && (
            <p className="flex items-start gap-2 text-sm text-red-300 mt-4">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </p>
          )}

          {conflict && (
            <div className="mt-4 gold-border rounded-xl bg-red-500/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <p className="flex items-start gap-2 text-sm text-red-200">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                Overlaps with {clientMap.get(conflict.client_id) ?? 'another client'} at{' '}
                {formatTime(conflict.start_time)}–{endTime(conflict.start_time, conflict.duration_minutes)}.
              </p>
              <Button variant="secondary" onClick={() => submitAppointment(true)} disabled={isSaving}>
                Schedule Anyway
              </Button>
            </div>
          )}

          <div className="mt-5">
            <Button variant="primary" onClick={() => submitAppointment(false)} disabled={isSaving || !form.clientId}>
              {isSaving ? 'Scheduling…' : 'Schedule Appointment'}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-white/50 py-16 text-center">Loading…</p>
      ) : appointments.length === 0 ? (
        <p className="text-white/50 py-16 text-center">No appointments scheduled for this day.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {appointments.map((a) => (
            <div key={a.id} className="card-panel gold-border rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-gold-light font-medium">{clientMap.get(a.client_id) ?? 'Unknown client'}</p>
                <p className="text-sm text-white/60 mt-1">
                  {formatTime(a.start_time)}–{endTime(a.start_time, a.duration_minutes)} ({a.duration_minutes} min)
                </p>
                {a.reason && <p className="text-xs text-white/40 mt-1">{a.reason}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`rounded-full border px-2.5 py-1 text-xs capitalize ${statusStyle[a.status]}`}>
                  {a.status.replace('_', ' ')}
                </span>
                {a.status === 'scheduled' && (
                  <button
                    type="button"
                    onClick={() => cancelAppointment(a.id)}
                    className="text-white/40 hover:text-red-300 transition-colors text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
