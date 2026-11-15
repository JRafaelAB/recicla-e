import { describe, expect, it } from 'vitest'
import { dayLabel, km, quantity } from './format'

describe('km (MAP-11)', () => {
  it('formats with a decimal comma and one decimal', () => {
    expect(km(0.8)).toBe('0,8 km')
    expect(km(12.3)).toBe('12,3 km')
    expect(km(5)).toBe('5,0 km')
  })
})

describe('quantity', () => {
  it('keeps the unit when it fits', () => {
    expect(quantity(18, 'g')).toBe('18 g')
    expect(quantity(4, 'mg')).toBe('4 mg')
    expect(quantity(16, 'kg')).toBe('16 kg')
  })
  it('uses a decimal comma', () => {
    expect(quantity(1.8, 'kg')).toBe('1,8 kg')
    expect(quantity(10.5, 'g')).toBe('10,5 g')
  })
  it('rescales to the readable unit', () => {
    expect(quantity(1000, 'mg')).toBe('1 g')
    expect(quantity(1200, 'mg')).toBe('1,2 g')
    expect(quantity(2500, 'g')).toBe('2,5 kg')
    expect(quantity(0.5, 'kg')).toBe('500 g')
  })
  it('does not leak float noise', () => {
    expect(quantity(1.8 * 3, 'kg')).toBe('5,4 kg')
  })
})

describe('dayLabel (SCH-03)', () => {
  it('uses pt-BR abbreviated weekdays and dd/mm', () => {
    const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    for (let i = 0; i < 7; i++) {
      expect(dayLabel(new Date(2026, 10, 15 + i))).toBe(`${names[i]}, ${15 + i}/11`)
    }
  })
  it('zero-pads day and month', () => {
    expect(dayLabel(new Date(2026, 0, 5))).toBe('Seg, 05/01')
  })
})
