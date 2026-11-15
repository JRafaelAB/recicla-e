import { describe, it, expect } from 'vitest'
import { CATEGORIES, SUBTYPES, categoryLevel } from './categories'

// Source of truth: spec.md "Mock Data → Categories and sub-types" (SCALE-02).
const SPEC_SUBTYPES: Record<string, { categoryId: string; label: string; level: number }> = {
  pilha: { categoryId: 'pilhas', label: 'Pilha comum/alcalina', level: 2 },
  'bateria-litio': { categoryId: 'baterias', label: 'Bateria de lítio (celular, notebook, power bank)', level: 5 },
  'bateria-automotiva': { categoryId: 'baterias', label: 'Bateria automotiva (chumbo-ácido)', level: 4 },
  celular: { categoryId: 'celulares', label: 'Celular', level: 4 },
  notebook: { categoryId: 'computadores', label: 'Notebook', level: 4 },
  desktop: { categoryId: 'computadores', label: 'Computador de mesa', level: 2 },
  geladeira: { categoryId: 'linhabranca', label: 'Geladeira/freezer', level: 3 },
  'linhabranca-outros': { categoryId: 'linhabranca', label: 'Outros (lavadora, micro-ondas, fogão elétrico)', level: 3 },
  'tv-tubo': { categoryId: 'tvs', label: 'TV/monitor de tubo (CRT)', level: 4 },
  'tv-lcd': { categoryId: 'tvs', label: 'TV/monitor LCD antigo (até ~2009)', level: 2 },
  'tv-led': { categoryId: 'tvs', label: 'TV/monitor LED', level: 1 },
  'lampada-fluorescente': { categoryId: 'lampadas', label: 'Fluorescente', level: 3 },
  'lampada-led': { categoryId: 'lampadas', label: 'LED', level: 1 },
  cabos: { categoryId: 'cabos', label: 'Cabos e carregadores', level: 1 },
}

const SPEC_CATEGORIES: [string, string, number][] = [
  ['pilhas', 'Pilhas', 2],
  ['baterias', 'Baterias', 5],
  ['celulares', 'Celulares', 4],
  ['computadores', 'Computadores e notebooks', 4],
  ['linhabranca', 'Geladeiras e linha branca', 3],
  ['tvs', 'TVs e monitores', 4],
  ['lampadas', 'Lâmpadas', 3],
  ['cabos', 'Cabos e carregadores', 1],
]

describe('sub-types', () => {
  it('has exactly the 14 spec sub-types', () => {
    expect(SUBTYPES.map((s) => s.id).sort()).toEqual(Object.keys(SPEC_SUBTYPES).sort())
  })

  for (const [id, want] of Object.entries(SPEC_SUBTYPES)) {
    it(`${id}: level ${want.level}, category ${want.categoryId}, label "${want.label}"`, () => {
      const s = SUBTYPES.find((x) => x.id === id)!
      expect(s.level).toBe(want.level)
      expect(s.categoryId).toBe(want.categoryId)
      expect(s.label).toBe(want.label)
      expect(s.emoji.length).toBeGreaterThan(0)
    })
  }

  it('lists power bank under bateria-litio, never under cabos', () => {
    const withPowerBank = SUBTYPES.filter((s) => /power bank/i.test(s.label))
    expect(withPowerBank.map((s) => s.id)).toEqual(['bateria-litio'])
    expect(SUBTYPES.find((s) => s.id === 'cabos')!.label).not.toMatch(/power bank/i)
  })
})

describe('categories', () => {
  it('has the 8 spec categories in spec order with spec labels', () => {
    expect(CATEGORIES.map((c) => [c.id, c.label])).toEqual(SPEC_CATEGORIES.map(([id, label]) => [id, label]))
  })

  for (const [id, , level] of SPEC_CATEGORIES) {
    it(`categoryLevel("${id}") is ${level}`, () => {
      expect(categoryLevel(id as never)).toBe(level)
    })
  }

  it('every category has an emoji and at least one sub-type', () => {
    for (const c of CATEGORIES) {
      expect(c.emoji.length).toBeGreaterThan(0)
      expect(SUBTYPES.some((s) => s.categoryId === c.id)).toBe(true)
    }
  })
})
