import { describe, expect, it } from 'vitest'
import { POINTS } from '../data/points'
import { nearestPointFor } from './nearest'

describe('nearestPointFor (ONB-09, EDGE-02)', () => {
  it.each([
    ['celulares', 1],
    ['pilhas', 1],
    ['linhabranca', 5],
    ['tvs', 2],
    ['lampadas', 1],
    ['computadores', 2],
  ] as const)('%s -> point %i', (cat, id) => {
    expect(nearestPointFor(cat)?.id).toBe(id)
  })

  it('returns undefined when no point accepts the category', () => {
    expect(nearestPointFor('tvs', [POINTS[0]])).toBeUndefined()
  })

  it('picks the nearest among the given points', () => {
    expect(nearestPointFor('celulares', [POINTS[3], POINTS[5]])?.id).toBe(4)
  })
})
