'use client'

import { useRef } from 'react'
import {
  BUSINESS_CLOSE_MINUTES,
  BUSINESS_OPEN_MINUTES,
  cursorDateKey,
  formatCursor,
  getZonedMinutesSinceMidnight,
  minutesToTimeInputValue,
  minutesToTimeLabel,
  todayCursor,
} from '@/lib/schedule'
import type { Appointment } from '@/types/admin'

const HOUR_HEIGHT_PX = 60
const TOTAL_MINUTES = 24 * 60

const statusStyle: Record<Appointment['status'], string> = {
  scheduled: 'bg-cerulean/25 border-cerulean/50 text-white',
  completed: 'bg-gold/20 border-gold/50 text-white',
  cancelled: 'bg-white/5 border-white/15 text-white/40 line-through',
  no_show: 'bg-red-500/15 border-red-400/40 text-red-200',
}

export function TimeGridView({
  days,
  appointmentsByDate,
  clientMap,
  onSlotClick,
  onCancelAppointment,
}: {
  days: Date[]
  appointmentsByDate: Map<string, Appointment[]>
  clientMap: Map<string, string>
  onSlotClick: (dateKey: string, time: string) => void
  onCancelAppointment: (id: string) => void
}) {
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const today = cursorDateKey(todayCursor())

  const hours = Array.from({ length: 24 }, (_, i) => i)

  function handleColumnClick(e: React.MouseEvent<HTMLDivElement>, dateKey: string) {
    const el = columnRefs.current.get(dateKey)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const offsetY = e.clientY - rect.top
    const rawMinutes = (offsetY / rect.height) * TOTAL_MINUTES
    const snapped = Math.min(TOTAL_MINUTES - 5, Math.max(0, Math.round(rawMinutes / 5) * 5))

    if (snapped < BUSINESS_OPEN_MINUTES || snapped >= BUSINESS_CLOSE_MINUTES) return
    onSlotClick(dateKey, minutesToTimeInputValue(snapped))
  }

  return (
    <div className="card-panel gold-border rounded-2xl overflow-hidden">
      <div className="flex">
        <div className="w-16 shrink-0" />
        {days.map((day) => {
          const dateKey = cursorDateKey(day)
          return (
            <div
              key={dateKey}
              className={`flex-1 text-center py-3 border-l border-gold/10 ${
                dateKey === today ? 'bg-gold/10' : ''
              }`}
            >
              <p className="text-xs uppercase tracking-wide text-white/40">{formatCursor(day, { weekday: 'short' })}</p>
              <p className={`font-display text-lg ${dateKey === today ? 'text-gold-light' : 'text-white/80'}`}>
                {formatCursor(day, { month: 'short', day: 'numeric' })}
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex border-t border-gold/10 max-h-[70vh] overflow-y-auto">
        <div className="w-16 shrink-0">
          {hours.map((h) => (
            <div
              key={h}
              style={{ height: HOUR_HEIGHT_PX }}
              className="text-right pr-2 text-[11px] text-white/35 -translate-y-2"
            >
              {minutesToTimeLabel(h * 60)}
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dateKey = cursorDateKey(day)
          const dayAppointments = appointmentsByDate.get(dateKey) ?? []
          return (
            <div
              key={dateKey}
              ref={(el) => {
                if (el) columnRefs.current.set(dateKey, el)
              }}
              onClick={(e) => handleColumnClick(e, dateKey)}
              className="relative flex-1 border-l border-gold/10 cursor-pointer"
              style={{ height: 24 * HOUR_HEIGHT_PX }}
            >
              {hours.map((h) => (
                <div
                  key={h}
                  className="border-t border-white/5 first:border-t-0"
                  style={{ height: HOUR_HEIGHT_PX }}
                />
              ))}

              <div
                className="absolute inset-x-0 bg-gold/5 pointer-events-none"
                style={{
                  top: `${(BUSINESS_OPEN_MINUTES / TOTAL_MINUTES) * 100}%`,
                  height: `${((BUSINESS_CLOSE_MINUTES - BUSINESS_OPEN_MINUTES) / TOTAL_MINUTES) * 100}%`,
                }}
              />

              {dayAppointments.map((a) => {
                const startMinutes = getZonedMinutesSinceMidnight(new Date(a.start_time))
                const top = (startMinutes / TOTAL_MINUTES) * 100
                const height = (a.duration_minutes / TOTAL_MINUTES) * 100
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (a.status === 'scheduled' && window.confirm('Cancel this appointment?')) {
                        onCancelAppointment(a.id)
                      }
                    }}
                    className={`absolute inset-x-1 rounded-md border px-2 py-0.5 text-left text-[11px] leading-tight overflow-hidden ${statusStyle[a.status]}`}
                    style={{ top: `${top}%`, height: `${Math.max(height, 3)}%` }}
                    title={`${clientMap.get(a.client_id) ?? 'Unknown'} · ${minutesToTimeLabel(startMinutes)}`}
                  >
                    <span className="font-medium">{clientMap.get(a.client_id) ?? 'Unknown'}</span>
                    <span className="block text-white/60">{minutesToTimeLabel(startMinutes)}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
