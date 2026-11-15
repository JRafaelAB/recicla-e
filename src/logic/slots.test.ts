import { describe, expect, it } from 'vitest'
import { POINTS } from '../data/points'
import { isOpen, nextSevenDays, slotsFor } from './slots'

const [p1, p2] = POINTS
// 2026-11-14 is a Saturday; 16 is Monday.
const sat = new Date(2026, 10, 14)
const mon = new Date(2026, 10, 16)
const fmt = (n: number) => `${String(n).padStart(2, '0')}:00`
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => fmt(a + i))

describe('nextSevenDays (SCH-03)', () => {
  it('returns 7 consecutive days starting today at local midnight', () => {
    const days = nextSevenDays(new Date(2026, 10, 14, 15, 30))
    expect(days).toHaveLength(7)
    expect(days[0]).toEqual(new Date(2026, 10, 14))
    expect(days.map((d) => d.getDate())).toEqual([14, 15, 16, 17, 18, 19, 20])
    expect(days.map((d) => d.getDay())).toEqual([6, 0, 1, 2, 3, 4, 5])
  })
  it('crosses month boundaries', () => {
    const days = nextSevenDays(new Date(2026, 10, 28))
    expect(days.map((d) => d.getDate())).toEqual([28, 29, 30, 1, 2, 3, 4])
  })
})

describe('isOpen (SCH-03)', () => {
  it('point 2 is closed Saturday and Sunday, open Monday', () => {
    expect(isOpen(p2, new Date(2026, 10, 14))).toBe(false)
    expect(isOpen(p2, new Date(2026, 10, 15))).toBe(false)
    expect(isOpen(p2, mon)).toBe(true)
  })
  it('point 1 is open Saturday', () => {
    expect(isOpen(p1, sat)).toBe(true)
  })
})

describe('slotsFor (SCH-04, SCH-05, EDGE-04)', () => {
  const earlyNow = new Date(2026, 10, 13, 7, 0) // the day before, so nothing is past
  it('point 1 on Saturday: 08:00-11:00', () => {
    expect(slotsFor(p1, sat, earlyNow)).toEqual(['08:00', '09:00', '10:00', '11:00'])
  })
  it('point 1 on a weekday: 08:00-17:00', () => {
    expect(slotsFor(p1, mon, earlyNow)).toEqual(range(8, 17))
  })
  it('closed day -> no slots', () => {
    expect(slotsFor(p2, sat, earlyNow)).toEqual([])
  })
  it('hides slots already past today (start <= now)', () => {
    expect(slotsFor(p1, mon, new Date(2026, 10, 16, 10, 30))).toEqual(range(11, 17))
    expect(slotsFor(p1, mon, new Date(2026, 10, 16, 10, 0))).toEqual(range(11, 17))
    expect(slotsFor(p1, mon, new Date(2026, 10, 16, 9, 59))).toEqual(range(10, 17))
  })
  it('does not hide slots on future days', () => {
    expect(slotsFor(p1, mon, new Date(2026, 10, 15, 23, 0))).toEqual(range(8, 17))
  })
  it('after the last slot -> [] (no-slot state)', () => {
    expect(slotsFor(p1, mon, new Date(2026, 10, 16, 17, 30))).toEqual([])
    expect(slotsFor(p1, mon, new Date(2026, 10, 16, 20, 0))).toEqual([])
  })
})
