import { CATEGORIES, type CategoryId } from '../data/categories'

export const STORAGE_KEY = 'recicla-e:v1'

export interface Booking {
  id: string
  pointId: number
  items: { subtypeId: string; qty: number }[]
  /** YYYY-MM-DD */
  date: string
  /** "09:00" */
  slot: string
}

export interface Persisted {
  session: boolean
  name?: string
  onboarding: { done: boolean; answers: Partial<Record<CategoryId, 'tenho' | 'nao'>> }
  bookings: Booking[]
}

export interface StorageBackend {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface Storage {
  load(): Persisted
  save(p: Persisted): void
  clear(): void
}

export const DEFAULT_PERSISTED: Persisted = {
  session: false,
  onboarding: { done: false, answers: {} },
  bookings: [],
}

const fresh = (): Persisted => structuredClone(DEFAULT_PERSISTED)

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

function isBooking(b: unknown): boolean {
  return (
    isObj(b) &&
    typeof b.id === 'string' &&
    typeof b.pointId === 'number' &&
    typeof b.date === 'string' &&
    typeof b.slot === 'string' &&
    Array.isArray(b.items) &&
    b.items.every((i) => isObj(i) && typeof i.subtypeId === 'string' && typeof i.qty === 'number')
  )
}

function isPersisted(v: unknown): v is Persisted {
  if (!isObj(v) || typeof v.session !== 'boolean') return false
  if (v.name !== undefined && typeof v.name !== 'string') return false
  const ob = v.onboarding
  if (!isObj(ob) || typeof ob.done !== 'boolean' || !isObj(ob.answers)) return false
  const ids: string[] = CATEGORIES.map((c) => c.id)
  const answersOk = Object.entries(ob.answers).every(([k, a]) => ids.includes(k) && (a === 'tenho' || a === 'nao'))
  return answersOk && Array.isArray(v.bookings) && v.bookings.every(isBooking)
}

function defaultBackend(): StorageBackend | undefined {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

/** localStorage-backed storage that falls back to memory if the backend is missing or throws (EDGE-01). */
export function createStorage(backend: StorageBackend | undefined = defaultBackend()): Storage {
  let store = backend
  let memory: Persisted = fresh()

  const guard = <T>(op: (b: StorageBackend) => T): T | undefined => {
    if (!store) return undefined
    try {
      return op(store)
    } catch {
      store = undefined
      return undefined
    }
  }

  function save(p: Persisted): void {
    memory = structuredClone(p)
    guard((b) => b.setItem(STORAGE_KEY, JSON.stringify(p)))
  }

  return {
    load() {
      const raw = guard((b) => b.getItem(STORAGE_KEY))
      if (store) {
        if (raw == null) return fresh()
        try {
          const parsed: unknown = JSON.parse(raw)
          if (isPersisted(parsed)) return parsed
        } catch {
          // corrupt JSON falls through to defaults
        }
        const defaults = fresh()
        save(defaults)
        return defaults
      }
      return structuredClone(memory)
    },
    save,
    clear() {
      memory = fresh()
      guard((b) => b.removeItem(STORAGE_KEY))
    },
  }
}
