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
  /** pt-BR noun for counted phrases ("o 1 celular", "os 2 celulares"). */
  noun: { singular: string; plural: string; gender: 'm' | 'f' }
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
  { id: 'pilha', categoryId: 'pilhas', label: 'Pilha comum/alcalina', level: 2, emoji: '🔋', noun: { singular: 'pilha', plural: 'pilhas', gender: 'f' } },
  { id: 'bateria-litio', categoryId: 'baterias', label: 'Bateria de lítio (celular, notebook, power bank)', level: 5, emoji: '🪫', noun: { singular: 'bateria de lítio', plural: 'baterias de lítio', gender: 'f' } },
  { id: 'bateria-automotiva', categoryId: 'baterias', label: 'Bateria automotiva (chumbo-ácido)', level: 4, emoji: '🚗', noun: { singular: 'bateria automotiva', plural: 'baterias automotivas', gender: 'f' } },
  { id: 'celular', categoryId: 'celulares', label: 'Celular', level: 4, emoji: '📱', noun: { singular: 'celular', plural: 'celulares', gender: 'm' } },
  { id: 'notebook', categoryId: 'computadores', label: 'Notebook', level: 4, emoji: '💻', noun: { singular: 'notebook', plural: 'notebooks', gender: 'm' } },
  { id: 'desktop', categoryId: 'computadores', label: 'Computador de mesa', level: 2, emoji: '🖥️', noun: { singular: 'computador de mesa', plural: 'computadores de mesa', gender: 'm' } },
  { id: 'geladeira', categoryId: 'linhabranca', label: 'Geladeira/freezer', level: 3, emoji: '🧊', noun: { singular: 'geladeira', plural: 'geladeiras', gender: 'f' } },
  { id: 'linhabranca-outros', categoryId: 'linhabranca', label: 'Outros (lavadora, micro-ondas, fogão elétrico)', level: 3, emoji: '🧺', noun: { singular: 'eletrodoméstico de linha branca', plural: 'eletrodomésticos de linha branca', gender: 'm' } },
  { id: 'tv-tubo', categoryId: 'tvs', label: 'TV/monitor de tubo (CRT)', level: 4, emoji: '📺', noun: { singular: 'TV de tubo', plural: 'TVs de tubo', gender: 'f' } },
  { id: 'tv-lcd', categoryId: 'tvs', label: 'TV/monitor LCD antigo (até ~2009)', level: 2, emoji: '🖥️', noun: { singular: 'TV LCD antiga', plural: 'TVs LCD antigas', gender: 'f' } },
  { id: 'tv-led', categoryId: 'tvs', label: 'TV/monitor LED', level: 1, emoji: '📺', noun: { singular: 'TV LED', plural: 'TVs LED', gender: 'f' } },
  { id: 'lampada-fluorescente', categoryId: 'lampadas', label: 'Fluorescente', level: 3, emoji: '💡', noun: { singular: 'lâmpada fluorescente', plural: 'lâmpadas fluorescentes', gender: 'f' } },
  { id: 'lampada-led', categoryId: 'lampadas', label: 'LED', level: 1, emoji: '💡', noun: { singular: 'lâmpada LED', plural: 'lâmpadas LED', gender: 'f' } },
  { id: 'cabos', categoryId: 'cabos', label: 'Cabos e carregadores', level: 1, emoji: '🔌', noun: { singular: 'cabo ou carregador', plural: 'cabos e carregadores', gender: 'm' } },
]

/** Category level = the highest level among its sub-types (spec Mock Data). */
export function categoryLevel(id: CategoryId): Level {
  return Math.max(...SUBTYPES.filter((s) => s.categoryId === id).map((s) => s.level)) as Level
}
