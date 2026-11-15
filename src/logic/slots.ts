import type { Point } from '../data/points'

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** Today plus the next six days, at local midnight. */
export function nextSevenDays(now: Date): Date[] {
  const today = startOfDay(now)
  return Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i))
}

export function isOpen(point: Point, date: Date): boolean {
  return point.hours.some((h) => h.days.includes(date.getDay()))
}

/** Hourly "HH:00" slots from opening to one hour before closing; on `now`'s day, past slots are hidden. */
export function slotsFor(point: Point, date: Date, now: Date): string[] {
  const h = point.hours.find((x) => x.days.includes(date.getDay()))
  if (!h) return []
  const day = startOfDay(date)
  const slots: string[] = []
  for (let hour = h.open; hour < h.close; hour++) {
    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour)
    if (start.getTime() > now.getTime()) slots.push(`${String(hour).padStart(2, '0')}:00`)
  }
  return slots
}
