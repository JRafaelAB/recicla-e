import { SUBTYPES, type CategoryId } from '../data/categories'
import { FACTS, MULTIPLIABLE } from '../data/catalog'

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

const MG: Record<string, number> = { mg: 1, g: 1000, kg: 1_000_000 }

function quantity(mg: number): string {
  const [v, unit] = mg >= MG.kg ? [mg / MG.kg, 'kg'] : mg >= MG.g ? [mg / MG.g, 'g'] : [mg, 'mg']
  return `${String(Math.round(v * 10) / 10).replace('.', ',')} ${unit}`
}

const subtypeOf = (id: string) => SUBTYPES.find((s) => s.id === id)!

function quantified(subtypeId: string, qty: number, phrase: (contem: string) => string): ImpactLine[] {
  return MULTIPLIABLE.filter((m) => m.subtypeId === subtypeId).map((m) => {
    const fact = FACTS.find((f) => f.id === m.factId)!
    const amount = quantity(Math.round(m.value * MG[m.unit] * qty))
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
        const label = subtypeOf(i.subtypeId).label
        return quantified(i.subtypeId, i.qty, (contem) =>
          i.qty === 1
            ? `O item “${label}” que você vai entregar contém ${contem}`
            : `Os ${i.qty} itens “${label}” que você vai entregar contêm ${contem}`,
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
