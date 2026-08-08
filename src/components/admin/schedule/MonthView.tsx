'use client'

import { cursorDateKey, getZonedMinutesSinceMidnight, minutesToTimeLabel, todayCursor } from '@/lib/schedule'
import type { Appointment } from '@/types/admin'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MAX_VISIBLE = 3

export function MonthView({
  gridDays,
  appointmentsByDate,
  clientMap,
  onSelectDay,
}: {
  gridDays: { cursor: Date; dateKey: string; inCurrentMonth: boolean }[]
  appointmentsByDate: Map<string, Appointment[]>
  clientMap: Map<string, string>
  onSelectDay: (dateKey: string) => void
}) {
  const today = cursorDateKey(todayCursor())

  return (
    <div className="card-panel gold-border rounded-2xl overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gold/10">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center py-2 text-xs uppercase tracking-wide text-white/40">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {gridDays.map(({ cursor, dateKey, inCurrentMonth }) => {
          const dayAppointments = (appointmentsByDate.get(dateKey) ?? [])
            .filter((a) => a.status !== 'cancelled')
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
          const isToday = dateKey === today

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDay(dateKey)}
              disabled={!inCurrentMonth}
              className={`min-h-[110px] border-b border-l border-gold/10 first:border-l-0 p-2 text-left align-top transition-colors ${
                inCurrentMonth ? 'hover:bg-white/5 cursor-pointer' : 'opacity-30 cursor-default'
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday ? 'bg-gold text-velvet font-semibold' : 'text-white/70'
                }`}
              >
                {cursor.getUTCDate()}
              </span>

              <div className="mt-1 flex flex-col gap-1">
                {dayAppointments.slice(0, MAX_VISIBLE).map((a) => (
                  <span
                    key={a.id}
                    className="truncate rounded bg-cerulean/20 border border-cerulean/40 px-1.5 py-0.5 text-[10px] text-white/85"
                  >
                    {minutesToTimeLabel(getZonedMinutesSinceMidnight(new Date(a.start_time)))}{' '}
                    {clientMap.get(a.client_id) ?? 'Unknown'}
                  </span>
                ))}
                {dayAppointments.length > MAX_VISIBLE && (
                  <span className="text-[10px] text-gold-light">+{dayAppointments.length - MAX_VISIBLE} more</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
