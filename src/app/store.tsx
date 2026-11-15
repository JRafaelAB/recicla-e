import { createContext, useContext, useEffect, useReducer, useState, type Dispatch, type ReactNode } from 'react'
import { CATEGORIES, type CategoryId } from '../data/categories'
import { nameFromEmail } from '../logic/auth'
import { applyHandoff, type Handoff, type MapState } from '../logic/mapState'
import { createStorage, DEFAULT_PERSISTED, type Booking, type Persisted, type Storage } from '../logic/storage'

export type ScreenId =
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'onboardingSummary'
  | 'home'
  | 'point'
  | 'route'
  | 'schedule'
  | 'celebration'
  | 'learn'
  | 'device'
  | 'profile'

/** The three tab-bar screens (NAV-01). */
export type MainScreen = 'home' | 'learn' | 'profile'
export const MAIN_SCREENS: MainScreen[] = ['home', 'learn', 'profile']

/** Params by screen: point/route/schedule → { pointId }, celebration → { bookingId }, device → { categoryId }. */
export interface NavEntry {
  screen: ScreenId
  params?: { pointId?: number; bookingId?: string; categoryId?: CategoryId }
}

export interface AppState extends Persisted {
  map: MapState
  nav: NavEntry[]
  /** TIP-02: mascot balloon closed until the home map is opened again. */
  tipDismissed: boolean
}

export type Answer = 'tenho' | 'nao'

/** Credentials are validated by the screen (logic/auth.ts) before dispatching login/signup. */
export type Action =
  | { type: 'login'; email: string }
  | { type: 'signup'; nome: string; email: string }
  | { type: 'logout' }
  | { type: 'resetDemo' }
  | { type: 'answerCard'; category: CategoryId; answer: Answer }
  | { type: 'skipOnboarding' }
  | { type: 'navigate'; screen: ScreenId; params?: NavEntry['params'] }
  | { type: 'back' }
  | { type: 'switchTab'; screen: MainScreen }
  | { type: 'openMap'; handoff?: Handoff }
  | { type: 'setMap'; map: MapState }
  | { type: 'dismissTip' }
  | { type: 'book'; booking: Booking }

const EMPTY_MAP: MapState = { categories: [], query: '' }

const landing = (p: Persisted): NavEntry[] => [{ screen: !p.session ? 'login' : p.onboarding.done ? 'home' : 'onboarding' }]

/** AUTH-01/02: the first screen depends on the saved session and onboarding flag. */
export function initialState(p: Persisted): AppState {
  return { ...p, map: EMPTY_MAP, nav: landing(p), tipDismissed: false }
}

export function persistedSlice(s: AppState): Persisted {
  const p: Persisted = { session: s.session, onboarding: s.onboarding, bookings: s.bookings }
  return s.name === undefined ? p : { session: p.session, name: s.name, onboarding: p.onboarding, bookings: p.bookings }
}

export const top = (s: AppState): NavEntry => s.nav[s.nav.length - 1]

const openHome = (s: AppState, handoff?: Handoff): AppState => ({
  ...s,
  map: applyHandoff(s.map, handoff),
  nav: [{ screen: 'home' }],
  tipDismissed: false,
})

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'login': {
      const next = { ...s, session: true, name: s.name ?? nameFromEmail(a.email) }
      return { ...next, nav: landing(next) }
    }
    case 'signup': {
      const next = { ...s, session: true, name: a.nome }
      return { ...next, nav: landing(next) }
    }
    case 'logout':
      return { ...s, session: false, nav: [{ screen: 'login' }] }
    case 'resetDemo':
      return initialState(structuredClone(DEFAULT_PERSISTED))
    case 'answerCard': {
      if (s.onboarding.done) return s
      const answers = { ...s.onboarding.answers, [a.category]: a.answer }
      const finished = CATEGORIES.every((c) => answers[c.id] !== undefined)
      return {
        ...s,
        onboarding: { done: finished, answers },
        nav: finished ? [{ screen: 'onboardingSummary' }] : s.nav,
      }
    }
    case 'skipOnboarding':
      return openHome({ ...s, onboarding: { ...s.onboarding, done: true } }, { kind: 'reset' })
    case 'navigate':
      return { ...s, nav: [...s.nav, a.params === undefined ? { screen: a.screen } : { screen: a.screen, params: a.params }] }
    case 'back':
      return s.nav.length > 1 ? { ...s, nav: s.nav.slice(0, -1) } : s
    case 'switchTab':
      return a.screen === 'home' ? openHome(s) : { ...s, nav: [{ screen: a.screen }] }
    case 'openMap':
      return openHome(s, a.handoff)
    case 'setMap':
      return { ...s, map: a.map }
    case 'dismissTip':
      return { ...s, tipDismissed: true }
    case 'book':
      return {
        ...s,
        bookings: [...s.bookings, a.booking],
        nav: [...s.nav.slice(0, -1), { screen: 'celebration', params: { bookingId: a.booking.id } }],
      }
  }
}

interface AppContextValue {
  state: AppState
  dispatch: Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

const isDefault = (p: Persisted) => JSON.stringify(p) === JSON.stringify(DEFAULT_PERSISTED)

/** Holds the app state and persists its Persisted slice through storage.ts (default: localStorage + memory fallback). */
export function AppProvider({ storage, children }: { storage?: Storage; children: ReactNode }) {
  const [store] = useState(() => storage ?? createStorage())
  const [state, dispatch] = useReducer(reducer, store, (st) => initialState(st.load()))

  useEffect(() => {
    const p = persistedSlice(state)
    // PROF-05: a reset (or never-used) state leaves nothing saved.
    if (isDefault(p)) store.clear()
    else store.save(p)
  }, [store, state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

/** Current time source. Production: real time; gallery and unit tests provide a fixed clock. */
export const ClockContext = createContext<() => Date>(() => new Date())

export const useClock = (): (() => Date) => useContext(ClockContext)
