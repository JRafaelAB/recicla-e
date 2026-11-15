export type CategoryId =
  | 'pilhas'
  | 'baterias'
  | 'celulares'
  | 'computadores'
  | 'linhabranca'
  | 'tvs'
  | 'lampadas'
  | 'cabos'

export type Level = 1 | 2 | 3 | 4 | 5

export interface Category {
  id: CategoryId
  label: string
  emoji: string
}

export interface Subtype {
  id: string
  categoryId: CategoryId
  label: string
  level: Level
  emoji: string
}

export const CATEGORIES: Category[] = [
  { id: 'pilhas', label: 'Pilhas', emoji: '🔋' },
  { id: 'baterias', label: 'Baterias', emoji: '🪫' },
  { id: 'celulares', label: 'Celulares', emoji: '📱' },
  { id: 'computadores', label: 'Computadores e notebooks', emoji: '💻' },
  { id: 'linhabranca', label: 'Geladeiras e linha branca', emoji: '🧊' },
  { id: 'tvs', label: 'TVs e monitores', emoji: '📺' },
  { id: 'lampadas', label: 'Lâmpadas', emoji: '💡' },
  { id: 'cabos', label: 'Cabos e carregadores', emoji: '🔌' },
]

// Levels: research.md §10 (toxicidade + risco de fogo). bateria-litio is the
// documented override: T2+F2=4, raised to 5 for lithium thermal runaway.
export const SUBTYPES: Subtype[] = [
  { id: 'pilha', categoryId: 'pilhas', label: 'Pilha comum/alcalina', level: 2, emoji: '🔋' },
  { id: 'bateria-litio', categoryId: 'baterias', label: 'Bateria de lítio (celular, notebook, power bank)', level: 5, emoji: '🪫' },
  { id: 'bateria-automotiva', categoryId: 'baterias', label: 'Bateria automotiva (chumbo-ácido)', level: 4, emoji: '🚗' },
  { id: 'celular', categoryId: 'celulares', label: 'Celular', level: 4, emoji: '📱' },
  { id: 'notebook', categoryId: 'computadores', label: 'Notebook', level: 4, emoji: '💻' },
  { id: 'desktop', categoryId: 'computadores', label: 'Computador de mesa', level: 2, emoji: '🖥️' },
  { id: 'geladeira', categoryId: 'linhabranca', label: 'Geladeira/freezer', level: 3, emoji: '🧊' },
  { id: 'linhabranca-outros', categoryId: 'linhabranca', label: 'Outros (lavadora, micro-ondas, fogão elétrico)', level: 3, emoji: '🧺' },
  { id: 'tv-tubo', categoryId: 'tvs', label: 'TV/monitor de tubo (CRT)', level: 4, emoji: '📺' },
  { id: 'tv-lcd', categoryId: 'tvs', label: 'TV/monitor LCD antigo (até ~2009)', level: 2, emoji: '🖥️' },
  { id: 'tv-led', categoryId: 'tvs', label: 'TV/monitor LED', level: 1, emoji: '📺' },
  { id: 'lampada-fluorescente', categoryId: 'lampadas', label: 'Fluorescente', level: 3, emoji: '💡' },
  { id: 'lampada-led', categoryId: 'lampadas', label: 'LED', level: 1, emoji: '💡' },
  { id: 'cabos', categoryId: 'cabos', label: 'Cabos e carregadores', level: 1, emoji: '🔌' },
]

/** Category level = the highest level among its sub-types (spec Mock Data). */
export function categoryLevel(id: CategoryId): Level {
  return Math.max(...SUBTYPES.filter((s) => s.categoryId === id).map((s) => s.level)) as Level
}
