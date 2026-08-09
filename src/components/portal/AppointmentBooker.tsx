'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { Field, TextInput } from '@/components/form/inputs'
import {
  BUSINESS_HOURS_LABEL,
  generateSlotStartMinutes,
  getZonedDateKey,
  minutesToTimeInputValue,
  minutesToTimeLabel,
  zonedTimeToUtc,
} from '@/lib/schedule'
import type { Appointment } from '@/types/admin'

const SLOT_MINUTES = 30
const ALL_SLOTS = generateSlotStartMinutes(SLOT_MINUTES)

function isSlotInPast(dateKey: string, startMinutes: number) {
  return zonedTimeToUtc(dateKey, minutesToTimeInputValue(startMinutes)).getTime() <= Date.now()
}

export function AppointmentBooker({
  title = 'Book an Appointment',
  description = `30-minute slots, ${BUSINESS_HOURS_LABEL}. Your care team may adjust the length after booking.`,
  onBooked,
}: {
  title?: string
  description?: string
  onBooked?: (appointment: Appointment) => void
}) {
  const [dateKey, setDateKey] = useState(getZonedDateKey(new Date()))
  const [busyMinutes, setBusyMinutes] = useState<{ startMinutes: number; endMinutes: number }[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmed, setConfirmed] = useState<Appointment | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadAvailability() {
      setIsLoadingSlots(true)
      setSelected(null)
      try {
        const res = await fetch(`/api/portal/appointments?date=${dateKey}`)
        const payload = await res.json()
        if (!cancelled) setBusyMinutes(payload.busy ?? [])
      } catch {
        if (!cancelled) setBusyMinutes([])
      } finally {
        if (!cancelled) setIsLoadingSlots(false)
      }
    }
    loadAvailability()
    return () => {
      cancelled = true
    }
  }, [dateKey])

  function isSlotTaken(startMinutes: number) {
    const endMinutes = startMinutes + SLOT_MINUTES
    return busyMinutes.some((b) => startMinutes < b.endMinutes && endMinutes > b.startMinutes)
  }

  async function handleConfirm() {
    if (selected === null) return
    setError(null)
    setIsSaving(true)
    try {
      const res = await fetch('/api/portal/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateKey, time: minutesToTimeInputValue(selected), reason }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Unable to book your appointment.')
      setConfirmed(payload.appointment as Appointment)
      onBooked?.(payload.appointment as Appointment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to book your appointment.')
    } finally {
      setIsSaving(false)
    }
  }

  if (confirmed) {
    return (
      <div className="card-panel gold-border-glow rounded-2xl p-8 text-center flex flex-col items-center gap-3">
        <CheckCircle2 className="text-gold" size={36} />
        <h3 className="font-display text-xl text-gradient-gold">Appointment Confirmed</h3>
        <p className="text-white/70 text-sm">
          {new Date(confirmed.start_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setConfirmed(null)
            setReason('')
          }}
        >
          Book Another
        </Button>
      </div>
    )
  }

  return (
    <div className="card-panel gold-border rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 text-gold-light mb-1">
        <CalendarClock size={20} />
        <h3 className="font-display text-xl">{title}</h3>
      </div>
      <p className="text-white/50 text-sm mb-6">{description}</p>

      <Field label="Date" required>
        <TextInput
          type="date"
          value={dateKey}
          min={getZonedDateKey(new Date())}
          onChange={(e) => setDateKey(e.target.value)}
        />
      </Field>

      <div className="mt-5">
        <span className="text-sm text-gold-light font-medium block mb-2">Available Times</span>
        {isLoadingSlots ? (
          <p className="text-white/40 text-sm py-4">Loading availability…</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {ALL_SLOTS.map((m) => {
              const taken = isSlotTaken(m) || isSlotInPast(dateKey, m)
              return (
                <button
                  key={m}
                  type="button"
                  disabled={taken}
                  onClick={() => setSelected(m)}
                  className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                    taken
                      ? 'border-white/10 text-white/25 cursor-not-allowed line-through'
                      : selected === m
                        ? 'border-gold bg-gradient-to-r from-gold-dark via-gold to-gold-light text-velvet font-semibold'
                        : 'gold-border text-white/70 hover:text-gold-light'
                  }`}
                >
                  {minutesToTimeLabel(m)}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-5">
        <Field label="Reason for visit" hint="Optional">
          <TextInput value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Follow-up consultation" />
        </Field>
      </div>

      {error && (
        <p className="flex items-start gap-2 text-sm text-red-300 mt-4">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <Button variant="primary" className="mt-5" onClick={handleConfirm} disabled={selected === null || isSaving}>
        {isSaving ? 'Booking…' : 'Confirm Appointment'}
      </Button>
    </div>
  )
}
