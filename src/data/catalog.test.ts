import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  SOURCES, FACTS, TIPS, GUIDES, LEVEL_JUSTIFICATION, MULTIPLIABLE, PNRS_CARD, URPV_NOTE,
} from './catalog'
import { SUBTYPES } from './categories'

// Source of truth: spec.md "Approved Content Catalog" (CAT-R1..R6), NFR-03,
// and research.md (the only allowed content source).
const research = readFileSync(
  fileURLToPath(new URL('../../.specs/features/recicla-e-prototype/research.md', import.meta.url)),
  'utf8',
)
const SUBTYPE_IDS = SUBTYPES.map((s) => s.id)
const sourceIds = new Set(SOURCES.map((s) => s.id))

/** Every sourced text entry in the catalog, flattened. */
const ENTRIES: { id: string; texts: string[]; sourceIds: string[]; researchRef: string }[] = [
  ...FACTS.map((f) => ({ id: f.id, texts: [f.text], sourceIds: [f.sourceId], researchRef: f.researchRef })),
  ...TIPS.map((t) => ({ id: t.id, texts: [t.text], sourceIds: [t.sourceId], researchRef: t.researchRef })),
  ...GUIDES.map((g) => ({
    id: `guide:${g.subtypeId}`,
    texts: [g.porQueNaoGuardar, g.comoDescartar, g.stream, g.comoLevar, g.danoAmbiental],
    sourceIds: g.sourceIds,
    researchRef: g.researchRef,
  })),
  ...Object.entries(LEVEL_JUSTIFICATION).map(([id, j]) => ({
    id: `level:${id}`, texts: [j.text], sourceIds: [j.sourceId], researchRef: j.researchRef,
  })),
  { id: PNRS_CARD.id, texts: [PNRS_CARD.title, PNRS_CARD.text], sourceIds: [PNRS_CARD.sourceId], researchRef: PNRS_CARD.researchRef },
  { id: URPV_NOTE.id, texts: [URPV_NOTE.text], sourceIds: [URPV_NOTE.sourceId], researchRef: URPV_NOTE.researchRef },
]
const ALL_TEXT = ENTRIES.flatMap((e) => e.texts)

describe('sources', () => {
  it('every source has a name and an https URL that appears verbatim in research.md', () => {
    expect(SOURCES.length).toBeGreaterThan(0)
    for (const s of SOURCES) {
      expect(s.name.trim().length, s.id).toBeGreaterThan(0)
      expect(s.url, s.id).toMatch(/^https:\/\//)
      expect(research.includes(s.url), `${s.id} URL not in research.md: ${s.url}`).toBe(true)
    }
  })

  it('source ids are unique', () => {
    expect(sourceIds.size).toBe(SOURCES.length)
  })
})

describe('CAT-R1: every entry is complete and sourced', () => {
  it('every fact has id, pt-BR text, ≥1 known sub-type, a known source and a researchRef', () => {
    for (const f of FACTS) {
      expect(f.id.length).toBeGreaterThan(0)
      expect(f.text.trim().length, f.id).toBeGreaterThan(0)
      expect(f.subtypes.length, f.id).toBeGreaterThan(0)
      for (const s of f.subtypes) expect(SUBTYPE_IDS, f.id).toContain(s)
      expect(sourceIds.has(f.sourceId), `${f.id} source ${f.sourceId}`).toBe(true)
      expect(f.researchRef, f.id).toMatch(/^§\d+/)
    }
  })

  it('fact ids are unique', () => {
    expect(new Set(FACTS.map((f) => f.id)).size).toBe(FACTS.length)
  })

  it('every other entry (tips, guides, justifications, notes) has text, a known source and a researchRef', () => {
    for (const e of ENTRIES) {
      for (const t of e.texts) expect(t.trim().length, e.id).toBeGreaterThan(0)
      expect(e.sourceIds.length, e.id).toBeGreaterThan(0)
      for (const s of e.sourceIds) expect(sourceIds.has(s), `${e.id} source ${s}`).toBe(true)
      expect(e.researchRef, e.id).toMatch(/^§\d+/)
    }
  })

  it('tips apply to known sub-types', () => {
    for (const t of TIPS) {
      expect(t.subtypes.length, t.id).toBeGreaterThan(0)
      for (const s of t.subtypes) expect(SUBTYPE_IDS, t.id).toContain(s)
    }
  })

  it('every number in the catalog text appears in research.md (no invented numbers)', () => {
    for (const text of ALL_TEXT) {
      for (const n of text.match(/\d+(?:[.,]\d+)*/g) ?? []) {
        // Whole-token match: "67" must not be satisfied by "267/2000".
        const token = new RegExp(`(?<![\\d.,])${n.replace(/[.]/g, '\\.')}(?![\\d]|[.,]\\d)`)
        expect(token.test(research), `"${n}" in "${text}" not found in research.md`).toBe(true)
      }
    }
  })
})

describe('CAT-R2: excluded claims (research.md §11) never appear', () => {
  const FORBIDDEN: [string, RegExp][] = [
    ['1 pilha contamina X litros', /mil litros|milhão de litros|litros de água|contamina o solo por/i],
    ['5º maior produtor do mundo', /5º maior|quinto maior/i],
    ['desperdiçamos 7% do ouro', /7% do ouro/i],
    ['75% da energia da indústria', /75% de toda a energia/i],
    ['41 milhões de toneladas de refrigerantes', /41 milhões/i],
    ['mercúrio reciclado e reaproveitado', /reciclado e reaproveitado|mercúrio (é|foi) reciclado/i],
    ['TV LED/LCD não tem nada tóxico', /não tem nada tóxico/i],
    ['pilha alcalina no lixo comum', /pode ir (para o|no) lixo comum/i],
    ['8,3 t CO₂e por geladeira', /8,3 t|8\.279/],
    ['1 litro de óleo contamina', /litro de óleo/i],
    ['conflicting Reciclus/ABREE point counts', /2\.520|3\.873|3\.878|7 mil pontos/],
  ]
  for (const [claim, re] of FORBIDDEN) {
    it(`no text matches "${claim}"`, () => {
      expect(ALL_TEXT.filter((t) => re.test(t))).toEqual([])
    })
  }

  it('"3%" is only used with its source year 2022 (§11.5)', () => {
    for (const t of ALL_TEXT.filter((x) => /\b3%/.test(x))) expect(t).toContain('2022')
  })
})

describe('CAT-R3: entries keep their source qualifiers', () => {
  it('the celular cobre/cobalto values say "estimativa" and "UNEP, 2009"', () => {
    for (const m of MULTIPLIABLE.filter((x) => x.subtypeId === 'celular')) {
      const f = FACTS.find((x) => x.id === m.factId)!
      expect(f.text).toMatch(/estimativa/i)
      expect(f.text).toContain('UNEP, 2009')
    }
  })

  it('the refrigerator CO₂e fact is restricted to devices with CFC', () => {
    const co2e = FACTS.filter((f) => f.subtypes.includes('geladeira') && /CO₂ equivalente/.test(f.text))
    expect(co2e.length).toBeGreaterThan(0)
    for (const f of co2e) expect(f.text).toMatch(/com CFC/)
  })
})

describe('CAT-R4: multipliable values', () => {
  it('MULTIPLIABLE is exactly the 5 CAT-R4 values', () => {
    const got = MULTIPLIABLE.map(({ subtypeId, substance, value, unit, qualifier }) => ({ subtypeId, substance, value, unit, qualifier }))
    expect(got).toEqual(
      expect.arrayContaining([
        { subtypeId: 'lampada-fluorescente', substance: 'mercúrio', value: 4, unit: 'mg', qualifier: 'cerca de' },
        { subtypeId: 'tv-tubo', substance: 'chumbo', value: 1.8, unit: 'kg', qualifier: 'cerca de' },
        { subtypeId: 'bateria-automotiva', substance: 'chumbo', value: 8, unit: 'kg', qualifier: 'até' },
        { subtypeId: 'celular', substance: 'cobre', value: 9, unit: 'g', qualifier: 'cerca de' },
        { subtypeId: 'celular', substance: 'cobalto', value: 3.5, unit: 'g', qualifier: 'cerca de' },
      ]),
    )
    expect(got).toHaveLength(5)
  })

  it('each multipliable value points to a fact for that sub-type with the same per-unit value', () => {
    for (const m of MULTIPLIABLE) {
      const f = FACTS.find((x) => x.id === m.factId)!
      expect(f, m.factId).toBeDefined()
      expect(f.subtypes).toContain(m.subtypeId)
      expect(f.perUnit).toEqual({ value: m.value, unit: m.unit, substance: m.substance, qualifier: m.qualifier })
    }
  })

  it('no other fact carries a per-unit value', () => {
    const withPerUnit = FACTS.filter((f) => f.perUnit).map((f) => f.id).sort()
    expect(withPerUnit).toEqual(MULTIPLIABLE.map((m) => m.factId).sort())
  })
})

describe('CAT-R6 and SCALE-03: coverage per sub-type', () => {
  it('has at least 12 tips', () => {
    expect(TIPS.length).toBeGreaterThanOrEqual(12)
  })

  it('has the BH URPV note', () => {
    expect(URPV_NOTE.text).toMatch(/^As URPVs de BH não recebem eletrônicos, pilhas nem lâmpadas/)
  })

  it('has the PNRS "O que é logística reversa?" card', () => {
    expect(PNRS_CARD.title).toBe('O que é logística reversa?')
    expect(PNRS_CARD.text).toContain('Política Nacional de Resíduos Sólidos')
  })

  for (const id of SUBTYPE_IDS) {
    it(`${id}: has ≥1 fact, one guide whose facts apply to it, and a level justification`, () => {
      expect(FACTS.filter((f) => f.subtypes.includes(id)).length).toBeGreaterThanOrEqual(1)
      const guides = GUIDES.filter((g) => g.subtypeId === id)
      expect(guides).toHaveLength(1)
      expect(guides[0].factIds.length).toBeGreaterThan(0)
      for (const fid of guides[0].factIds) {
        expect(FACTS.find((f) => f.id === fid)?.subtypes, fid).toContain(id)
      }
      expect(LEVEL_JUSTIFICATION[id]?.text.length).toBeGreaterThan(0)
    })
  }

  it('there is exactly one guide per sub-type and no guide for unknown ids', () => {
    expect(GUIDES.map((g) => g.subtypeId).sort()).toEqual([...SUBTYPE_IDS].sort())
    expect(Object.keys(LEVEL_JUSTIFICATION).sort()).toEqual([...SUBTYPE_IDS].sort())
  })
})
