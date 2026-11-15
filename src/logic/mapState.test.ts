import { describe, expect, it } from 'vitest'
import { applyHandoff, clearFilters, selectAll, toggleChip, type MapState } from './mapState'

const base: MapState = { categories: ['pilhas', 'tvs'], query: 'savassi' }

describe('applyHandoff', () => {
  it('MAP-02: no handoff keeps state', () => {
    expect(applyHandoff(base, undefined)).toEqual(base)
  })
  it('MAP-03: category handoff replaces categories and clears query', () => {
    expect(applyHandoff(base, { kind: 'category', categories: ['celulares', 'pilhas'] })).toEqual({
      categories: ['celulares', 'pilhas'],
      query: '',
    })
  })
  it('MAP-04: reset handoff -> Todos and empty query', () => {
    expect(applyHandoff(base, { kind: 'reset' })).toEqual({ categories: [], query: '' })
  })
})

describe('toggleChip', () => {
  it('MAP-05: selecting from Todos selects only that chip', () => {
    expect(toggleChip({ categories: [], query: 'x' }, 'cabos')).toEqual({ categories: ['cabos'], query: 'x' })
  })
  it('MAP-05: selecting an unselected chip adds it', () => {
    expect(toggleChip(base, 'cabos').categories).toEqual(['pilhas', 'tvs', 'cabos'])
  })
  it('MAP-06: deselecting a chip that is not the only one removes it', () => {
    expect(toggleChip(base, 'pilhas')).toEqual({ categories: ['tvs'], query: 'savassi' })
  })
  it('MAP-07: deselecting the only chip -> Todos', () => {
    expect(toggleChip({ categories: ['tvs'], query: 'q' }, 'tvs')).toEqual({ categories: [], query: 'q' })
  })
})

describe('selectAll / clearFilters', () => {
  it('MAP-07: Todos clears category selections', () => {
    expect(selectAll(base).categories).toEqual([])
  })
  it('MAP-13: clearFilters selects Todos and clears the search text', () => {
    expect(clearFilters()).toEqual({ categories: [], query: '' })
  })
})
