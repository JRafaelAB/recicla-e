import { describe, it, expect } from 'vitest'
import { POINTS } from './points'
import { SUBTYPES, CATEGORIES } from './categories'

// Source of truth: spec.md "Mock Data → Collection points".
const MON_FRI = [1, 2, 3, 4, 5]
const MON_SAT = [1, 2, 3, 4, 5, 6]
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]
const ALL_SUBTYPES = SUBTYPES.map((s) => s.id)

const SPEC_POINTS = [
  { id: 1, name: 'Coleta Verde Savassi', neighborhood: 'Savassi', distanceKm: 0.8,
    accepts: ['pilha', 'bateria-litio', 'celular', 'cabos', 'lampada-fluorescente', 'lampada-led'],
    hours: [{ days: MON_FRI, open: 8, close: 18 }, { days: [6], open: 8, close: 12 }] },
  { id: 2, name: 'Recicla Centro', neighborhood: 'Centro', distanceKm: 1.6,
    accepts: ['pilha', 'celular', 'notebook', 'desktop', 'tv-lcd', 'tv-led', 'cabos'],
    hours: [{ days: MON_FRI, open: 9, close: 17 }] },
  { id: 3, name: 'Coleta Lourdes', neighborhood: 'Lourdes', distanceKm: 1.9,
    accepts: ['pilha', 'lampada-fluorescente', 'lampada-led'],
    hours: [{ days: MON_SAT, open: 8, close: 14 }] },
  { id: 4, name: 'Santa Efigênia Eletro', neighborhood: 'Santa Efigênia', distanceKm: 2.4,
    accepts: ['bateria-litio', 'celular', 'notebook', 'desktop', 'tv-tubo', 'tv-lcd', 'tv-led', 'cabos'],
    hours: [{ days: MON_FRI, open: 8, close: 18 }] },
  { id: 5, name: 'Ponto Verde Cidade Nova', neighborhood: 'Cidade Nova', distanceKm: 5.2,
    accepts: ['geladeira', 'linhabranca-outros', 'notebook', 'desktop', 'tv-tubo', 'tv-lcd', 'tv-led'],
    hours: [{ days: MON_FRI, open: 8, close: 16 }] },
  { id: 6, name: 'Buritis Recicla', neighborhood: 'Buritis', distanceKm: 6.1,
    accepts: ['pilha', 'bateria-litio', 'celular', 'cabos'],
    hours: [{ days: MON_SAT, open: 9, close: 17 }] },
  { id: 7, name: 'Central de Coleta Pampulha', neighborhood: 'Pampulha', distanceKm: 9.4,
    accepts: ALL_SUBTYPES,
    hours: [{ days: ALL_DAYS, open: 8, close: 17 }] },
  { id: 8, name: 'Pampulha Lâmpadas & Pilhas', neighborhood: 'Pampulha', distanceKm: 9.8,
    accepts: ['pilha', 'bateria-litio', 'lampada-fluorescente', 'lampada-led'],
    hours: [{ days: MON_FRI, open: 9, close: 15 }] },
  { id: 9, name: 'Barreiro Coleta', neighborhood: 'Barreiro', distanceKm: 12.3,
    accepts: ['celular', 'notebook', 'desktop', 'geladeira', 'linhabranca-outros', 'tv-tubo', 'tv-lcd', 'tv-led'],
    hours: [{ days: MON_FRI, open: 8, close: 17 }] },
  { id: 10, name: 'Venda Nova Eletro', neighborhood: 'Venda Nova', distanceKm: 13.7,
    accepts: ['celular', 'notebook', 'desktop', 'geladeira', 'linhabranca-outros', 'cabos'],
    hours: [{ days: MON_SAT, open: 8, close: 16 }] },
]

// spec.md "Derived category acceptance (used by tests)".
const DERIVED: Record<string, number[]> = {
  pilhas: [1, 2, 3, 6, 7, 8],
  baterias: [1, 4, 6, 7, 8],
  celulares: [1, 2, 4, 6, 7, 9, 10],
  computadores: [2, 4, 5, 7, 9, 10],
  linhabranca: [5, 7, 9, 10],
  tvs: [2, 4, 5, 7, 9],
  lampadas: [1, 3, 7, 8],
  cabos: [1, 2, 4, 6, 7, 10],
}

const categoryOf = (subtypeId: string) => SUBTYPES.find((s) => s.id === subtypeId)!.categoryId

describe('collection points', () => {
  it('has the 10 spec points, ids 1..10', () => {
    expect(POINTS.map((p) => p.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  for (const want of SPEC_POINTS) {
    it(`point ${want.id} matches the Mock Data row`, () => {
      const p = POINTS.find((x) => x.id === want.id)!
      expect(p.name).toBe(want.name)
      expect(p.neighborhood).toBe(want.neighborhood)
      expect(p.distanceKm).toBe(want.distanceKm)
      expect([...p.accepts].sort()).toEqual([...want.accepts].sort())
      expect(p.hours).toEqual(want.hours)
    })
  }

  it('derived category acceptance matches the spec list', () => {
    for (const c of CATEGORIES) {
      const ids = POINTS.filter((p) => p.accepts.some((s) => categoryOf(s) === c.id)).map((p) => p.id)
      expect(ids, c.id).toEqual(DERIVED[c.id])
    }
  })

  it('distances are unique', () => {
    expect(new Set(POINTS.map((p) => p.distanceKm)).size).toBe(10)
  })

  it('point 7 accepts all 14 sub-types', () => {
    expect(ALL_SUBTYPES).toHaveLength(14)
    expect([...POINTS.find((p) => p.id === 7)!.accepts].sort()).toEqual([...ALL_SUBTYPES].sort())
  })

  it('only point 7 accepts bateria-automotiva', () => {
    expect(POINTS.filter((p) => p.accepts.includes('bateria-automotiva')).map((p) => p.id)).toEqual([7])
  })

  it('every accepted id is a known sub-type', () => {
    for (const p of POINTS) for (const s of p.accepts) expect(ALL_SUBTYPES).toContain(s)
  })

  it('phone is the fictional (31) 3000-00NN with NN = point number (PT-04)', () => {
    for (const p of POINTS) expect(p.phone).toBe(`(31) 3000-00${String(p.id).padStart(2, '0')}`)
  })

  it('every point has a fictional address in its neighborhood and distinct map coordinates', () => {
    for (const p of POINTS) {
      expect(p.address).toContain(p.neighborhood)
      expect(Number.isFinite(p.map.x) && Number.isFinite(p.map.y)).toBe(true)
    }
    expect(new Set(POINTS.map((p) => `${p.map.x},${p.map.y}`)).size).toBe(10)
  })
})
