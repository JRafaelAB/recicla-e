import { describe, expect, it } from 'vitest'
import { POINTS } from '../data/points'
import { filterPoints, normalize, pointAcceptsCategory } from './filter'

const ids = (r: { id: number }[]) => r.map((p) => p.id)

describe('normalize', () => {
  it('lowercases and strips accents', () => {
    expect(normalize('Santa Efigênia')).toBe('santa efigenia')
    expect(normalize('LÂMPADAS')).toBe('lampadas')
  })
})

describe('pointAcceptsCategory', () => {
  it('is true when any sub-type of the category is accepted', () => {
    expect(pointAcceptsCategory(POINTS[0], 'celulares')).toBe(true)
    expect(pointAcceptsCategory(POINTS[0], 'tvs')).toBe(false)
  })
  it('baterias is rejected by a point with no battery sub-type and accepted by point 7', () => {
    expect(pointAcceptsCategory(POINTS[2], 'baterias')).toBe(false)
    expect(pointAcceptsCategory(POINTS[6], 'baterias')).toBe(true)
  })
})

describe('filterPoints', () => {
  it('returns all 10 points sorted by distance with no filters', () => {
    expect(ids(filterPoints(POINTS, { categories: [], query: '' }))).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
  it('MAP-08: linhabranca -> points 5,7,9,10', () => {
    expect(ids(filterPoints(POINTS, { categories: ['linhabranca'], query: '' }))).toEqual([5, 7, 9, 10])
  })
  it('MAP-08: multiple categories are OR-combined', () => {
    expect(ids(filterPoints(POINTS, { categories: ['linhabranca', 'lampadas'], query: '' }))).toEqual([1, 3, 5, 7, 8, 9, 10])
  })
  it('MAP-09: "pampulha" -> points 7,8', () => {
    expect(ids(filterPoints(POINTS, { categories: [], query: 'pampulha' }))).toEqual([7, 8])
  })
  it('MAP-10: linhabranca + "pampulha" -> point 7', () => {
    expect(ids(filterPoints(POINTS, { categories: ['linhabranca'], query: 'pampulha' }))).toEqual([7])
  })
  it('no match -> empty', () => {
    expect(filterPoints(POINTS, { categories: [], query: 'xyz' })).toEqual([])
  })
  it('EDGE-03: accent-free queries match accented data', () => {
    expect(ids(filterPoints(POINTS, { categories: [], query: 'lampada' }))).toEqual([1, 3, 7, 8])
    expect(ids(filterPoints(POINTS, { categories: [], query: 'efigenia' }))).toEqual([4])
  })
  it('MAP-09: matches name, neighborhood and category labels, ignoring case', () => {
    expect(ids(filterPoints(POINTS, { categories: [], query: 'BURITIS' }))).toEqual([6])
    expect(ids(filterPoints(POINTS, { categories: [], query: 'geladeiras' }))).toEqual([5, 7, 9, 10])
  })
  it('MAP-11: ties on distance break by name', () => {
    const a = { ...POINTS[0], id: 91, name: 'B ponto', distanceKm: 0.1 }
    const b = { ...POINTS[0], id: 92, name: 'A ponto', distanceKm: 0.1 }
    expect(ids(filterPoints([a, b], { categories: [], query: '' }))).toEqual([92, 91])
  })
  it('does not mutate the input', () => {
    const copy = [...POINTS].reverse()
    const before = ids(copy)
    filterPoints(copy, { categories: [], query: '' })
    expect(ids(copy)).toEqual(before)
  })
})
