import type { CategoryId } from '../data/categories'
import { POINTS, type Point } from '../data/points'
import { filterPoints } from './filter'

/** Nearest point accepting the specific category (EDGE-02). */
export function nearestPointFor(categoryId: CategoryId, points: Point[] = POINTS): Point | undefined {
  return filterPoints(points, { categories: [categoryId], query: '' })[0]
}
