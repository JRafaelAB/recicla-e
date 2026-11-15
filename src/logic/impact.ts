import { SUBTYPES, type CategoryId } from '../data/categories'
import { FACTS, MULTIPLIABLE } from '../data/catalog'
import { quantity } from './format'

export interface ImpactItem {
  subtypeId: string
  qty: number
}

export interface ImpactLine {
  kind: 'quantified' | 'qualitative'
  subtypeId: string
  categoryId: CategoryId
  factId: string
  text: string
  sourceId: string
  researchRef: string
}

const subtypeOf = (id: string) => SUBTYPES.find((s) => s.id === id)!

function quantified(subtypeId: string, qty: number, phrase: (contem: string) => string): ImpactLine[] {
  return MULTIPLIABLE.filter((m) => m.subtypeId === subtypeId).map((m) => {
    const fact = FACTS.find((f) => f.id === m.factId)!
    const amount = quantity(m.value * qty, m.unit)
    return {
      kind: 'quantified',
      subtypeId,
      categoryId: subtypeOf(subtypeId).categoryId,
      factId: m.factId,
      text: phrase(`${m.qualifier} ${amount} de ${m.substance}`),
      sourceId: fact.sourceId,
      researchRef: fact.researchRef,
    }
  })
}

function qualitative(subtypeId: string): ImpactLine | undefined {
  const fact =
    FACTS.find((f) => f.subtypes.includes(subtypeId) && !f.perUnit) ?? FACTS.find((f) => f.subtypes.includes(subtypeId))
  if (!fact) return undefined
  return {
    kind: 'qualitative',
    subtypeId,
    categoryId: subtypeOf(subtypeId).categoryId,
    factId: fact.id,
    text: fact.text,
    sourceId: fact.sourceId,
    researchRef: fact.researchRef,
  }
}

/** Potential impact of a delivery (CAT-R4/R5): multipliable values are scaled, others stay qualitative. */
export function impactFor(items: ImpactItem[]): ImpactLine[] {
  return items
    .filter((i) => i.qty > 0)
    .flatMap((i) => {
      if (MULTIPLIABLE.some((m) => m.subtypeId === i.subtypeId)) {
        // CAT-R5: "Os 2 celulares que você vai entregar contêm cerca de 18 g de cobre".
        const { singular, plural, gender } = subtypeOf(i.subtypeId).noun
        return quantified(i.subtypeId, i.qty, (contem) =>
          i.qty === 1
            ? `${gender === 'f' ? 'A' : 'O'} 1 ${singular} que você vai entregar contém ${contem}`
            : `${gender === 'f' ? 'As' : 'Os'} ${i.qty} ${plural} que você vai entregar contêm ${contem}`,
        )
      }
      return qualitative(i.subtypeId) ?? []
    })
}

/** Accumulated potential impact over all bookings (PROF-06/07). */
export function sumImpact(bookings: { items: ImpactItem[] }[]): { totals: ImpactLine[]; qualitative: ImpactLine[] } {
  const qtyBySubtype = new Map<string, number>()
  for (const b of bookings)
    for (const i of b.items) if (i.qty > 0) qtyBySubtype.set(i.subtypeId, (qtyBySubtype.get(i.subtypeId) ?? 0) + i.qty)

  const totals = [...qtyBySubtype].flatMap(([id, qty]) =>
    quantified(id, qty, (contem) => `Os itens que você agendou contêm ${contem}`),
  )

  const byCategory = new Map<CategoryId, ImpactLine>()
  for (const id of qtyBySubtype.keys()) {
    const line = qualitative(id)
    if (line && !byCategory.has(line.categoryId)) byCategory.set(line.categoryId, line)
  }
  return { totals, qualitative: [...byCategory.values()] }
}
