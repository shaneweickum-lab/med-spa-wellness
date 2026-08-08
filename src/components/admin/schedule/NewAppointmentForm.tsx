'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, SelectInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'
import {
  BUSINESS_CLOSE_MINUTES,
  BUSINESS_HOURS_LABEL,
  BUSINESS_OPEN_MINUTES,
  getZonedMinutesSinceMidnight,
  minutesToTimeLabel,
  zonedTimeToUtc,
} from '@/lib/schedule'
import type { Appointment, Client } from '@/types/admin'

const DURATIONS = [10, 15, 20, 25, 30, 35, 40, 45]

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

export function NewAppointmentForm({
  clients,
  adminId,
  initialDateKey,
  initialTime,
  existingAppointments,
  clientMap,
  onCreated,
  onClose,
}: {
  clients: Client[]
  adminId: string
  initialDateKey: string
  initialTime: string
  existingAppointments: Appointment[]
  clientMap: Map<string, string>
  onCreated: (appointment: Appointment) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    clientId: clients[0]?.id ?? '',
    dateKey: initialDateKey,
    time: initialTime,
    duration: 30,
    reason: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [conflict, setConflict] = useState<Appointment | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function findConflict(startUtc: Date, durationMinutes: number) {
    const start = startUtc.getTime()
    const end = start + durationMinutes * 60000
    return (
      existingAppointments.find((a) => {
        if (a.status === 'cancelled') return false
        const aStart = new Date(a.start_time).getTime()
        const aEnd = aStart + a.duration_minutes * 60000
        return start < aEnd && end > aStart
      }) ?? null
    )
  }

  async function submit(force = false) {
    setError(null)

    const startMinutes = parseTimeToMinutes(form.time)
    if (startMinutes < BUSINESS_OPEN_MINUTES || startMinutes + form.duration > BUSINESS_CLOSE_MINUTES) {
      setError(`Appointments can only be scheduled between ${BUSINESS_HOURS_LABEL}.`)
      return
    }
    if (!form.clientId) {
      setError('Select a client.')
      return
    }

    const startUtc = zonedTimeToUtc(form.dateKey, form.time)

    if (!force) {
      const existing = findConflict(startUtc, form.duration)
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
          start_time: startUtc.toISOString(),
          duration_minutes: form.duration,
          reason: form.reason || null,
        })
        .select('*')
        .single()

      if (insertError) throw insertError
      onCreated(data as Appointment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to schedule appointment.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card-panel gold-border rounded-2xl p-6 mb-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Field label="Client" required>
          <SelectInput value={form.clientId} onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Date" required>
          <TextInput
            type="date"
            value={form.dateKey}
            onChange={(e) => setForm((f) => ({ ...f, dateKey: e.target.value }))}
          />
        </Field>
        <Field label="Start Time" required hint={BUSINESS_HOURS_LABEL}>
          <TextInput
            type="time"
            min="09:00"
            max="17:00"
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
            {(() => {
              const startMinutes = getZonedMinutesSinceMidnight(new Date(conflict.start_time))
              return (
                <>
                  Overlaps with {clientMap.get(conflict.client_id) ?? 'another client'} at{' '}
                  {minutesToTimeLabel(startMinutes)}–{minutesToTimeLabel(startMinutes + conflict.duration_minutes)}.
                </>
              )
            })()}
          </p>
          <Button variant="secondary" onClick={() => submit(true)} disabled={isSaving}>
            Schedule Anyway
          </Button>
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <Button variant="primary" onClick={() => submit(false)} disabled={isSaving || !form.clientId}>
          {isSaving ? 'Scheduling…' : 'Schedule Appointment'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
