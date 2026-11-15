import { CATEGORIES, SUBTYPES, type CategoryId } from '../data/categories'
import type { Point } from '../data/points'

export function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function pointAcceptsCategory(p: Point, catId: CategoryId): boolean {
  return p.accepts.some((id) => SUBTYPES.find((s) => s.id === id)?.categoryId === catId)
}

function categoryLabelsOf(p: Point): string[] {
  return CATEGORIES.filter((c) => pointAcceptsCategory(p, c.id)).map((c) => c.label)
}

export interface PointFilter {
  categories: CategoryId[]
  query: string
}

export function filterPoints(points: Point[], { categories, query }: PointFilter): Point[] {
  const q = normalize(query.trim())
  return points
    .filter((p) => categories.length === 0 || categories.some((c) => pointAcceptsCategory(p, c)))
    .filter(
      (p) =>
        q === '' || [p.name, p.neighborhood, ...categoryLabelsOf(p)].some((t) => normalize(t).includes(q)),
    )
    .sort((a, b) => a.distanceKm - b.distanceKm || a.name.localeCompare(b.name, 'pt-BR'))
}
