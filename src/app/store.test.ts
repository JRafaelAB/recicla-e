import { describe, expect, it } from 'vitest'
import { CATEGORIES } from '../data/categories'
import { createStorage, DEFAULT_PERSISTED, STORAGE_KEY, type Booking, type Persisted, type StorageBackend } from '../logic/storage'
import { initialState, persistedSlice, reducer, top, type AppState } from './store'

const fresh = (p: Partial<Persisted> = {}): AppState => initialState({ ...structuredClone(DEFAULT_PERSISTED), ...p })
const done = { done: true, answers: {} }
const booking: Booking = { id: 'b1', pointId: 1, items: [{ subtypeId: 'celular', qty: 2 }], date: '2026-11-16', slot: '09:00' }

describe('initialState (AUTH-01, AUTH-02)', () => {
  it('opens login with no saved session', () => {
    expect(fresh().nav).toEqual([{ screen: 'login' }])
  })
  it('opens onboarding with a session and onboarding not done', () => {
    expect(fresh({ session: true }).nav).toEqual([{ screen: 'onboarding' }])
  })
  it('opens the home map with a session and onboarding done', () => {
    expect(fresh({ session: true, onboarding: done }).nav).toEqual([{ screen: 'home' }])
  })
  it('starts with Todos and empty search, tip visible', () => {
    const s = fresh()
    expect(s.map).toEqual({ categories: [], query: '' })
    expect(s.tipDismissed).toBe(false)
  })
})

describe('login / signup (AUTH-07, AUTH-08, AUTH-10, AUTH-11)', () => {
  it('login without onboarding saves session and opens onboarding', () => {
    const s = reducer(fresh(), { type: 'login', email: 'ana@x.com' })
    expect(s.session).toBe(true)
    expect(s.nav).toEqual([{ screen: 'onboarding' }])
  })
  it('login with onboarding done opens the home map', () => {
    const s = reducer(fresh({ onboarding: done }), { type: 'login', email: 'ana@x.com' })
    expect(s.session).toBe(true)
    expect(s.nav).toEqual([{ screen: 'home' }])
  })
  it('login with no stored name stores the part before "@"', () => {
    expect(reducer(fresh(), { type: 'login', email: 'ana@x.com' }).name).toBe('ana')
  })
  it('login keeps an already stored name', () => {
    expect(reducer(fresh({ name: 'Ana Maria' }), { type: 'login', email: 'zz@x.com' }).name).toBe('Ana Maria')
  })
  it('signup stores the typed nome and opens onboarding', () => {
    const s = reducer(fresh({ name: 'old' }), { type: 'signup', nome: 'Ana', email: 'a@x.com' })
    expect(s.name).toBe('Ana')
    expect(s.session).toBe(true)
    expect(s.nav).toEqual([{ screen: 'onboarding' }])
  })
  it('signup with onboarding done opens the home map', () => {
    expect(reducer(fresh({ onboarding: done }), { type: 'signup', nome: 'Ana', email: 'a@x.com' }).nav).toEqual([{ screen: 'home' }])
  })
})

describe('onboarding (ONB-04..09, ONB-12, ONB-13)', () => {
  const loggedIn = () => reducer(fresh(), { type: 'login', email: 'ana@x.com' })

  it('answerCard records "tenho" and "nao" and stays on onboarding', () => {
    let s = reducer(loggedIn(), { type: 'answerCard', category: 'celulares', answer: 'tenho' })
    s = reducer(s, { type: 'answerCard', category: 'pilhas', answer: 'nao' })
    expect(s.onboarding.answers).toEqual({ celulares: 'tenho', pilhas: 'nao' })
    expect(s.onboarding.done).toBe(false)
    expect(top(s).screen).toBe('onboarding')
  })

  it('answering the 8th card marks onboarding done and shows the summary', () => {
    let s = loggedIn()
    for (const c of CATEGORIES) s = reducer(s, { type: 'answerCard', category: c.id, answer: c.id === 'celulares' ? 'tenho' : 'nao' })
    expect(s.onboarding.done).toBe(true)
    expect(Object.keys(s.onboarding.answers)).toHaveLength(8)
    expect(s.nav).toEqual([{ screen: 'onboardingSummary' }])
  })

  it('answerCard is ignored once onboarding is done', () => {
    const s = fresh({ session: true, onboarding: done })
    expect(reducer(s, { type: 'answerCard', category: 'cabos', answer: 'tenho' })).toBe(s)
  })

  it('skipOnboarding marks done and opens home with a reset handoff', () => {
    const start = { ...loggedIn(), map: { categories: ['cabos' as const], query: 'x' } }
    const s = reducer(start, { type: 'skipOnboarding' })
    expect(s.onboarding.done).toBe(true)
    expect(s.nav).toEqual([{ screen: 'home' }])
    expect(s.map).toEqual({ categories: [], query: '' })
  })

  it('openMap with a category handoff selects exactly those categories and clears search', () => {
    const start = { ...fresh({ session: true, onboarding: done }), map: { categories: ['cabos' as const], query: 'pampulha' } }
    const s = reducer(start, { type: 'openMap', handoff: { kind: 'category', categories: ['celulares', 'pilhas'] } })
    expect(s.map).toEqual({ categories: ['celulares', 'pilhas'], query: '' })
    expect(s.nav).toEqual([{ screen: 'home' }])
  })

  it('openMap with a reset handoff selects Todos and clears search', () => {
    const start = { ...fresh({ session: true, onboarding: done }), map: { categories: ['cabos' as const], query: 'pampulha' } }
    expect(reducer(start, { type: 'openMap', handoff: { kind: 'reset' } }).map).toEqual({ categories: [], query: '' })
  })
})

describe('navigation (NAV-02, NAV-03, MAP-02, PT-08, TIP-02)', () => {
  const home = () => ({ ...fresh({ session: true, onboarding: done }), map: { categories: ['linhabranca' as const], query: 'pampulha' } })

  it('navigate pushes and back pops, keeping the map state', () => {
    let s = reducer(home(), { type: 'navigate', screen: 'point', params: { pointId: 7 } })
    expect(s.nav).toEqual([{ screen: 'home' }, { screen: 'point', params: { pointId: 7 } }])
    s = reducer(s, { type: 'navigate', screen: 'route', params: { pointId: 7 } })
    s = reducer(s, { type: 'back' })
    expect(top(s)).toEqual({ screen: 'point', params: { pointId: 7 } })
    s = reducer(s, { type: 'back' })
    expect(s.nav).toEqual([{ screen: 'home' }])
    expect(s.map).toEqual({ categories: ['linhabranca'], query: 'pampulha' })
  })

  it('back on the root screen keeps the stack', () => {
    const s = home()
    expect(reducer(s, { type: 'back' }).nav).toEqual([{ screen: 'home' }])
  })

  it('openMap without a handoff keeps the filters and search (NAV-03, MAP-02)', () => {
    let s = reducer(home(), { type: 'navigate', screen: 'celebration', params: { bookingId: 'b1' } })
    s = reducer(s, { type: 'openMap' })
    expect(s.nav).toEqual([{ screen: 'home' }])
    expect(s.map).toEqual({ categories: ['linhabranca'], query: 'pampulha' })
  })

  it('switchTab replaces the stack with the tab root and keeps the map state', () => {
    let s = reducer(home(), { type: 'navigate', screen: 'point', params: { pointId: 1 } })
    s = reducer(s, { type: 'switchTab', screen: 'learn' })
    expect(s.nav).toEqual([{ screen: 'learn' }])
    s = reducer(s, { type: 'switchTab', screen: 'home' })
    expect(s.nav).toEqual([{ screen: 'home' }])
    expect(s.map).toEqual({ categories: ['linhabranca'], query: 'pampulha' })
  })

  it('setMap replaces the map state', () => {
    expect(reducer(home(), { type: 'setMap', map: { categories: [], query: 'xyz' } }).map).toEqual({ categories: [], query: 'xyz' })
  })

  it('dismissTip hides the tip until the home map is opened again', () => {
    let s = reducer(home(), { type: 'dismissTip' })
    expect(s.tipDismissed).toBe(true)
    s = reducer(s, { type: 'navigate', screen: 'point', params: { pointId: 1 } })
    s = reducer(s, { type: 'back' })
    expect(s.tipDismissed).toBe(true)
    s = reducer(s, { type: 'switchTab', screen: 'learn' })
    s = reducer(s, { type: 'switchTab', screen: 'home' })
    expect(s.tipDismissed).toBe(false)
    s = reducer(reducer(s, { type: 'dismissTip' }), { type: 'openMap' })
    expect(s.tipDismissed).toBe(false)
  })
})

describe('booking (SCH-07, SCH-08)', () => {
  it('book saves point, sub-types, quantities, day and slot and replaces the form with the celebration', () => {
    let s = fresh({ session: true, onboarding: done })
    s = reducer(s, { type: 'navigate', screen: 'point', params: { pointId: 1 } })
    s = reducer(s, { type: 'navigate', screen: 'schedule', params: { pointId: 1 } })
    s = reducer(s, { type: 'book', booking })
    expect(s.bookings).toEqual([booking])
    expect(s.nav).toEqual([{ screen: 'home' }, { screen: 'point', params: { pointId: 1 } }, { screen: 'celebration', params: { bookingId: 'b1' } }])
  })

  it('book appends to existing bookings', () => {
    const s = reducer(fresh({ session: true, onboarding: done, bookings: [booking] }), { type: 'book', booking: { ...booking, id: 'b2' } })
    expect(s.bookings.map((b) => b.id)).toEqual(['b1', 'b2'])
  })
})

describe('logout / resetDemo (PROF-03, PROF-05)', () => {
  const full = (): AppState => ({
    ...fresh({ session: true, name: 'Ana', onboarding: { done: true, answers: { celulares: 'tenho' } }, bookings: [booking] }),
    map: { categories: ['celulares'], query: 'sav' },
  })

  it('logout deletes the session, shows login and keeps name, answers and bookings', () => {
    const s = reducer(full(), { type: 'logout' })
    expect(s.session).toBe(false)
    expect(s.nav).toEqual([{ screen: 'login' }])
    expect(s.name).toBe('Ana')
    expect(s.onboarding).toEqual({ done: true, answers: { celulares: 'tenho' } })
    expect(s.bookings).toEqual([booking])
  })

  it('login after logout skips onboarding', () => {
    const s = reducer(reducer(full(), { type: 'logout' }), { type: 'login', email: 'x@y.com' })
    expect(s.nav).toEqual([{ screen: 'home' }])
    expect(s.name).toBe('Ana')
  })

  it('resetDemo erases everything and shows login; next login goes to onboarding', () => {
    const s = reducer(full(), { type: 'resetDemo' })
    expect(persistedSlice(s)).toEqual(DEFAULT_PERSISTED)
    expect(s.map).toEqual({ categories: [], query: '' })
    expect(s.nav).toEqual([{ screen: 'login' }])
    expect(reducer(s, { type: 'login', email: 'ana@x.com' }).nav).toEqual([{ screen: 'onboarding' }])
  })
})

describe('persistedSlice (PROF-03..05)', () => {
  it('contains only the persisted fields', () => {
    const s = { ...fresh({ session: true, name: 'Ana', bookings: [booking] }), tipDismissed: true }
    expect(persistedSlice(s)).toEqual({ session: true, name: 'Ana', onboarding: { done: false, answers: {} }, bookings: [booking] })
  })

  it('round-trips through storage so a reload restores the session', () => {
    const data: Record<string, string> = {}
    const backend: StorageBackend = { getItem: (k) => data[k] ?? null, setItem: (k, v) => void (data[k] = v), removeItem: (k) => void delete data[k] }
    const s = reducer(fresh({ onboarding: done }), { type: 'login', email: 'ana@x.com' })
    createStorage(backend).save(persistedSlice(s))
    expect(STORAGE_KEY in data).toBe(true)
    expect(initialState(createStorage(backend).load()).nav).toEqual([{ screen: 'home' }])
  })
})
