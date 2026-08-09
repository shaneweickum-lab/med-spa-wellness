// Shared date/time helpers for the admin scheduling calendar.
//
// The practice operates on Eastern Time. We use the IANA zone
// 'America/New_York' rather than a fixed UTC-5 offset so it stays correct
// across the EST/EDT daylight-saving switch year-round.

export const BUSINESS_TIMEZONE = 'America/New_York'
export const BUSINESS_OPEN_MINUTES = 9 * 60 // 9:00 AM
export const BUSINESS_CLOSE_MINUTES = 17 * 60 // 5:00 PM

/**
 * Converts a wall-clock date+time string, interpreted in `timeZone`
 * (default Eastern), into the equivalent UTC Date instant. Uses the
 * standard "format and diff" trick so it accounts for DST on the given
 * date without needing a timezone library.
 */
export function zonedTimeToUtc(dateKey: string, timeStr: string, timeZone: string = BUSINESS_TIMEZONE): Date {
  const naive = new Date(`${dateKey}T${timeStr}:00`)
  const asZoned = new Date(naive.toLocaleString('en-US', { timeZone }))
  const diff = naive.getTime() - asZoned.getTime()
  return new Date(naive.getTime() + diff)
}

/** Minutes since midnight, as the clock reads in `timeZone` (default Eastern). */
export function getZonedMinutesSinceMidnight(date: Date, timeZone: string = BUSINESS_TIMEZONE): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  return hour * 60 + minute
}

/** Calendar date (YYYY-MM-DD) as the clock reads in `timeZone` (default Eastern). */
export function getZonedDateKey(date: Date, timeZone: string = BUSINESS_TIMEZONE): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    date,
  )
}

export function formatZonedTime(date: Date, timeZone: string = BUSINESS_TIMEZONE): string {
  return date.toLocaleTimeString('en-US', { timeZone, hour: 'numeric', minute: '2-digit' })
}

export function minutesToTimeInputValue(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function minutesToTimeLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60)
  const m = minutes % 60
  const period = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

/** True when [start, start+durationMinutes) falls entirely within 9am-5pm Eastern. */
export function isWithinBusinessHours(startUtc: Date, durationMinutes: number): boolean {
  const startMinutes = getZonedMinutesSinceMidnight(startUtc)
  const endMinutes = startMinutes + durationMinutes
  return startMinutes >= BUSINESS_OPEN_MINUTES && endMinutes <= BUSINESS_CLOSE_MINUTES
}

export const BUSINESS_HOURS_LABEL = '9:00 AM–5:00 PM ET'

/** Start-of-slot minute offsets (since midnight ET) for `durationMinutes`-long slots spaced `stepMinutes` apart, all fitting within business hours. */
export function generateSlotStartMinutes(durationMinutes: number, stepMinutes: number = durationMinutes): number[] {
  const slots: number[] = []
  for (let m = BUSINESS_OPEN_MINUTES; m + durationMinutes <= BUSINESS_CLOSE_MINUTES; m += stepMinutes) {
    slots.push(m)
  }
  return slots
}

// --- Calendar-grid "cursor" dates ------------------------------------------
//
// These represent a pure Y/M/D calendar date, manipulated using UTC getters
// so day-math (add/subtract days, find week/month start) never runs into
// DST-related off-by-one bugs. They are NOT real instants — always format
// them with `timeZone: 'UTC'` and never mix them with real Date arithmetic
// meant to represent an actual moment in time.

export function makeCursor(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day))
}

export function cursorFromDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number)
  return makeCursor(y, m - 1, d)
}

export function cursorDateKey(cursor: Date): string {
  const y = cursor.getUTCFullYear()
  const m = String(cursor.getUTCMonth() + 1).padStart(2, '0')
  const d = String(cursor.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(cursor: Date, days: number): Date {
  const next = new Date(cursor)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export function addMonths(cursor: Date, months: number): Date {
  const next = new Date(cursor)
  next.setUTCMonth(next.getUTCMonth() + months)
  return next
}

export function todayCursor(): Date {
  return cursorFromDateKey(getZonedDateKey(new Date()))
}

export function startOfWeek(cursor: Date): Date {
  return addDays(cursor, -cursor.getUTCDay())
}

export function startOfMonthGrid(cursor: Date): Date {
  const firstOfMonth = makeCursor(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1)
  return startOfWeek(firstOfMonth)
}

export function formatCursor(cursor: Date, options: Intl.DateTimeFormatOptions): string {
  return cursor.toLocaleDateString('en-US', { ...options, timeZone: 'UTC' })
}
