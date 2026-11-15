import { describe, expect, it } from 'vitest'
import { FACTS, SOURCES } from '../data/catalog'
import { impactFor, sumImpact } from './impact'

const all = (lines: { text: string }[]) => lines.map((l) => l.text).join(' | ')

describe('impactFor (SCH-09..11, CAT-R4, CAT-R5)', () => {
  it('2 celulares -> cobre 18 g and cobalto 7 g, phrased as contained material', () => {
    const lines = impactFor([{ subtypeId: 'celular', qty: 2 }])
    const cobre = lines.find((l) => l.text.includes('cobre'))!
    const cobalto = lines.find((l) => l.text.includes('cobalto'))!
    // CAT-R5 spec example.
    expect(cobre.text).toBe('Os 2 celulares que você vai entregar contêm cerca de 18 g de cobre')
    expect(cobalto.text).toBe('Os 2 celulares que você vai entregar contêm cerca de 7 g de cobalto')
    expect(lines.every((l) => l.kind === 'quantified')).toBe(true)
  })

  it('quantity of 1 uses the singular verb with the per-unit value', () => {
    const [cobre] = impactFor([{ subtypeId: 'celular', qty: 1 }])
    expect(cobre.text).toBe('O 1 celular que você vai entregar contém cerca de 9 g de cobre')
  })

  it('1 LED lamp -> no multiplied line, at least one qualitative catalog fact', () => {
    const lines = impactFor([{ subtypeId: 'lampada-led', qty: 1 }])
    expect(lines.length).toBeGreaterThanOrEqual(1)
    expect(lines.every((l) => l.kind === 'qualitative')).toBe(true)
    const fact = FACTS.find((f) => f.id === lines[0].factId)!
    expect(fact.subtypes).toContain('lampada-led')
    expect(lines[0].text).toBe(fact.text)
  })

  it('qualitative facts are never multiplied by the quantity', () => {
    const a = impactFor([{ subtypeId: 'lampada-led', qty: 1 }])
    const b = impactFor([{ subtypeId: 'lampada-led', qty: 20 }])
    expect(b).toEqual(a)
  })

  it('every line carries a known source and a research reference', () => {
    const lines = impactFor([
      { subtypeId: 'celular', qty: 2 },
      { subtypeId: 'lampada-led', qty: 1 },
      { subtypeId: 'tv-tubo', qty: 1 },
    ])
    expect(lines.length).toBeGreaterThanOrEqual(3)
    for (const l of lines) {
      expect(SOURCES.some((s) => s.id === l.sourceId)).toBe(true)
      expect(l.researchRef).not.toBe('')
    }
  })

  it('the CAT-R4 values are scaled: lead in kg, mercury in mg, lead "até"', () => {
    expect(all(impactFor([{ subtypeId: 'tv-tubo', qty: 3 }]))).toBe('As 3 TVs de tubo que você vai entregar contêm cerca de 5,4 kg de chumbo')
    expect(all(impactFor([{ subtypeId: 'lampada-fluorescente', qty: 2 }]))).toBe('As 2 lâmpadas fluorescentes que você vai entregar contêm cerca de 8 mg de mercúrio')
    expect(all(impactFor([{ subtypeId: 'bateria-automotiva', qty: 2 }]))).toBe('As 2 baterias automotivas que você vai entregar contêm até 16 kg de chumbo')
    expect(all(impactFor([{ subtypeId: 'lampada-fluorescente', qty: 1 }]))).toBe('A 1 lâmpada fluorescente que você vai entregar contém cerca de 4 mg de mercúrio')
  })

  it('ignores zero quantities', () => {
    expect(impactFor([{ subtypeId: 'celular', qty: 0 }])).toEqual([])
  })

  it('never claims recovery or avoided pollution', () => {
    const text = all(
      impactFor([
        { subtypeId: 'celular', qty: 2 },
        { subtypeId: 'lampada-led', qty: 1 },
        { subtypeId: 'pilha', qty: 4 },
      ]),
    )
    expect(text).toContain('contêm')
    expect(text).not.toMatch(/recuperou|evitou/i)
  })
})

describe('sumImpact (PROF-06, PROF-07)', () => {
  it('sums multipliable values across bookings', () => {
    const { totals } = sumImpact([
      { items: [{ subtypeId: 'celular', qty: 2 }] },
      { items: [{ subtypeId: 'lampada-fluorescente', qty: 1 }] },
    ])
    const t = all(totals)
    expect(t).toContain('cerca de 18 g de cobre')
    expect(t).toContain('cerca de 7 g de cobalto')
    expect(t).toContain('cerca de 4 mg de mercúrio')
    expect(totals).toHaveLength(3)
    expect(t).toContain('contêm')
    expect(t).not.toMatch(/recuperou|evitou/i)
  })

  it('adds the same sub-type across different bookings', () => {
    const { totals } = sumImpact([
      { items: [{ subtypeId: 'celular', qty: 1 }] },
      { items: [{ subtypeId: 'celular', qty: 1 }] },
    ])
    expect(all(totals)).toContain('cerca de 18 g de cobre')
  })

  it('every total carries its source', () => {
    const { totals } = sumImpact([{ items: [{ subtypeId: 'celular', qty: 1 }] }])
    expect(totals.length).toBe(2)
    for (const l of totals) expect(SOURCES.some((s) => s.id === l.sourceId)).toBe(true)
  })

  it('no multipliable sub-type -> no totals, one qualitative fact per booked category', () => {
    const { totals, qualitative } = sumImpact([
      { items: [{ subtypeId: 'lampada-led', qty: 1 }, { subtypeId: 'pilha', qty: 2 }, { subtypeId: 'cabos', qty: 1 }] },
      { items: [{ subtypeId: 'pilha', qty: 1 }] },
    ])
    expect(totals).toEqual([])
    expect(qualitative).toHaveLength(3)
    expect(new Set(qualitative.map((q) => q.categoryId))).toEqual(new Set(['lampadas', 'pilhas', 'cabos']))
    expect(qualitative.every((q) => q.kind === 'qualitative')).toBe(true)
  })

  it('no bookings -> nothing', () => {
    expect(sumImpact([])).toEqual({ totals: [], qualitative: [] })
  })
})
