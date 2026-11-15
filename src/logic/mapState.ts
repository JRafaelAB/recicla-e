import type { CategoryId } from '../data/categories'

/** `categories: []` means "Todos". */
export interface MapState {
  categories: CategoryId[]
  query: string
}

export type Handoff = { kind: 'category'; categories: CategoryId[] } | { kind: 'reset' }

export function applyHandoff(state: MapState, handoff?: Handoff): MapState {
  if (!handoff) return state
  if (handoff.kind === 'reset') return { categories: [], query: '' }
  return { categories: [...handoff.categories], query: '' }
}

export function toggleChip(state: MapState, id: CategoryId): MapState {
  if (!state.categories.includes(id)) return { ...state, categories: [...state.categories, id] }
  return { ...state, categories: state.categories.filter((c) => c !== id) }
}

export function selectAll(state: MapState): MapState {
  return { ...state, categories: [] }
}

export function clearFilters(): MapState {
  return { categories: [], query: '' }
}
