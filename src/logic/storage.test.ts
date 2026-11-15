import { describe, expect, it } from 'vitest'
import { createStorage, DEFAULT_PERSISTED, STORAGE_KEY, type Persisted, type StorageBackend } from './storage'

function fakeBackend(initial: Record<string, string> = {}) {
  const data = { ...initial }
  const backend: StorageBackend = {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => void (data[k] = v),
    removeItem: (k) => void delete data[k],
  }
  return { backend, data }
}

const throwing: StorageBackend = {
  getItem: () => { throw new Error('denied') },
  setItem: () => { throw new Error('denied') },
  removeItem: () => { throw new Error('denied') },
}

const sample: Persisted = {
  session: true,
  name: 'Ana',
  onboarding: { done: true, answers: { celulares: 'tenho', pilhas: 'nao' } },
  bookings: [{ id: 'b1', pointId: 1, items: [{ subtypeId: 'celular', qty: 2 }], date: '2026-11-16', slot: '09:00' }],
}

describe('createStorage', () => {
  it('uses the key "recicla-e:v1"', () => {
    const { backend, data } = fakeBackend()
    createStorage(backend).save(sample)
    expect(Object.keys(data)).toEqual(['recicla-e:v1'])
    expect(STORAGE_KEY).toBe('recicla-e:v1')
  })

  it('round-trips saved state', () => {
    const { backend } = fakeBackend()
    const s = createStorage(backend)
    s.save(sample)
    expect(createStorage(backend).load()).toEqual(sample)
  })

  it('empty backend -> defaults (logged out, onboarding not done, no bookings)', () => {
    expect(createStorage(fakeBackend().backend).load()).toEqual({
      session: false,
      onboarding: { done: false, answers: {} },
      bookings: [],
    })
  })

  it('corrupt JSON -> defaults, and the corrupt value is overwritten', () => {
    const { backend, data } = fakeBackend({ [STORAGE_KEY]: '{not json' })
    expect(createStorage(backend).load()).toEqual(DEFAULT_PERSISTED)
    expect(JSON.parse(data[STORAGE_KEY])).toEqual(DEFAULT_PERSISTED)
  })

  it('wrong shape -> defaults', () => {
    for (const bad of [
      { session: 'yes', onboarding: { done: true, answers: {} }, bookings: [] },
      { session: true, onboarding: { done: true, answers: { pilhas: 'maybe' } }, bookings: [] },
      { session: true, onboarding: { done: true, answers: {} }, bookings: [{ id: 'x' }] },
      { session: true, onboarding: { done: true, answers: {} } },
      null,
      [],
    ]) {
      const { backend } = fakeBackend({ [STORAGE_KEY]: JSON.stringify(bad) })
      expect(createStorage(backend).load()).toEqual(DEFAULT_PERSISTED)
    }
  })

  it('returns fresh defaults that callers cannot corrupt', () => {
    const s = createStorage(fakeBackend().backend)
    s.load().bookings.push(sample.bookings[0])
    expect(s.load().bookings).toEqual([])
  })

  it('clear removes everything', () => {
    const { backend, data } = fakeBackend()
    const s = createStorage(backend)
    s.save(sample)
    s.clear()
    expect(data).toEqual({})
    expect(s.load()).toEqual(DEFAULT_PERSISTED)
  })

  it('EDGE-01: a throwing backend falls back to memory and keeps working', () => {
    const s = createStorage(throwing)
    expect(s.load()).toEqual(DEFAULT_PERSISTED)
    s.save(sample)
    expect(s.load()).toEqual(sample)
    s.clear()
    expect(s.load()).toEqual(DEFAULT_PERSISTED)
  })

  it('EDGE-01: no backend and no localStorage -> memory', () => {
    const s = createStorage()
    s.save(sample)
    expect(s.load()).toEqual(sample)
  })

  it('EDGE-01: a backend that starts throwing mid-session switches to memory', () => {
    let broken = false
    const { backend } = fakeBackend()
    const flaky: StorageBackend = {
      getItem: (k) => { if (broken) throw new Error('x'); return backend.getItem(k) },
      setItem: (k, v) => { if (broken) throw new Error('x'); backend.setItem(k, v) },
      removeItem: (k) => { if (broken) throw new Error('x'); backend.removeItem(k) },
    }
    const s = createStorage(flaky)
    s.save(sample)
    broken = true
    s.save({ ...sample, name: 'Bia' })
    expect(s.load().name).toBe('Bia')
  })
})
