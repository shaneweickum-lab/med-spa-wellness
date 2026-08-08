'use client'

import { useState } from 'react'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput, SelectInput } from '@/components/form/inputs'
import { createClient } from '@/lib/supabase/client'
import type { Appointment } from '@/types/admin'

const DURATIONS = [10, 15, 20, 25, 30, 35, 40, 45]

const typeLabel: Record<Appointment['type'], string> = {
  intake: 'Initial Intake',
  consultation: 'Consultation',
  follow_up: 'Follow-Up',
  other: 'Other',
}

const statusStyle: Record<Appointment['status'], string> = {
  scheduled: 'text-cerulean-light border-cerulean/40 bg-cerulean/10',
  completed: 'text-gold-light border-gold/40 bg-gold/10',
  cancelled: 'text-white/40 border-white/20 bg-white/5 line-through',
  no_show: 'text-red-300 border-red-400/30 bg-red-500/10',
}

function todayISODate() {
  return new Date().toISOString().slice(0, 10)
}

export function AppointmentsTab({ clientId, appointments }: { clientId: string; appointments: Appointment[] }) {
  const [items, setItems] = useState(
    [...appointments].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()),
  )
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    date: todayISODate(),
    time: '10:00',
    duration: 30,
    type: 'follow_up' as Appointment['type'],
    status: 'completed' as Appointment['status'],
    reason: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit() {
    setError(null)
    setIsSaving(true)
    try {
      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert({
          client_id: clientId,
          start_time: new Date(`${form.date}T${form.time}:00`).toISOString(),
          duration_minutes: form.duration,
          type: form.type,
          status: form.status,
          reason: form.reason || null,
        })
        .select('*')
        .single()

      if (insertError) throw insertError
      setItems((prev) =>
        [data as Appointment, ...prev].sort(
          (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
        ),
      )
      setShowForm(false)
      setForm((f) => ({ ...f, reason: '' }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log appointment.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold hover:brightness-110 transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Log Appointment'}
        </button>
      </div>

      {showForm && (
        <div className="card-panel gold-border rounded-2xl p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Date" required>
              <TextInput type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </Field>
            <Field label="Time" required>
              <TextInput type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
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
            <Field label="Type">
              <SelectInput
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Appointment['type'] }))}
              >
                <option value="consultation">Consultation</option>
                <option value="follow_up">Follow-Up</option>
                <option value="intake">Initial Intake</option>
                <option value="other">Other</option>
              </SelectInput>
            </Field>
            <Field label="Status">
              <SelectInput
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Appointment['status'] }))}
              >
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
                <option value="no_show">No Show</option>
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

          <Button variant="primary" className="mt-5" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Appointment'}
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-white/50 py-10 text-center">No appointment history yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((a) => (
            <div key={a.id} className="card-panel gold-border rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-gold-light font-medium">{typeLabel[a.type]}</p>
                <p className="text-sm text-white/60 mt-1">
                  {new Date(a.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} &middot;{' '}
                  {a.duration_minutes} min
                </p>
                {a.reason && <p className="text-xs text-white/40 mt-1">{a.reason}</p>}
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-xs capitalize shrink-0 ${statusStyle[a.status]}`}>
                {a.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
