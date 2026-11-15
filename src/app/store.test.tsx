import { act, render, renderHook, screen } from '@testing-library/react'
import { useContext, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createStorage, STORAGE_KEY, type StorageBackend } from '../logic/storage'
import { AppProvider, ClockContext, useApp, useClock } from './store'

function fakeBackend(initial: Record<string, string> = {}) {
  const data: Record<string, string> = { ...initial }
  const backend: StorageBackend = {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => void (data[k] = v),
    removeItem: (k) => void delete data[k],
  }
  return { backend, data }
}

const saved = (o: object) => ({ [STORAGE_KEY]: JSON.stringify(o) })

describe('AppProvider persistence (AUTH-02, AUTH-07, PROF-03, PROF-05, EDGE-01)', () => {
  it('loads the saved session and opens the home map', () => {
    const { backend } = fakeBackend(saved({ session: true, name: 'Ana', onboarding: { done: true, answers: {} }, bookings: [] }))
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider storage={createStorage(backend)}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    expect(result.current.state.nav).toEqual([{ screen: 'home' }])
    expect(result.current.state.name).toBe('Ana')
  })

  it('saves the session after login, keeps data after logout, and erases everything on resetDemo', () => {
    const { backend, data } = fakeBackend()
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider storage={createStorage(backend)}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })

    act(() => result.current.dispatch({ type: 'login', email: 'ana@x.com' }))
    expect(JSON.parse(data[STORAGE_KEY])).toMatchObject({ session: true, name: 'ana' })

    act(() => result.current.dispatch({ type: 'skipOnboarding' }))
    act(() => result.current.dispatch({ type: 'logout' }))
    expect(JSON.parse(data[STORAGE_KEY])).toEqual({ session: false, name: 'ana', onboarding: { done: true, answers: {} }, bookings: [] })

    act(() => result.current.dispatch({ type: 'resetDemo' }))
    expect(data).toEqual({})
    expect(result.current.state.nav).toEqual([{ screen: 'login' }])
  })

  it('works in memory when the backend throws', () => {
    const throwing: StorageBackend = {
      getItem: () => { throw new Error('denied') },
      setItem: () => { throw new Error('denied') },
      removeItem: () => { throw new Error('denied') },
    }
    const wrapper = ({ children }: { children: ReactNode }) => <AppProvider storage={createStorage(throwing)}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.dispatch({ type: 'login', email: 'ana@x.com' }))
    expect(result.current.state.nav).toEqual([{ screen: 'onboarding' }])
  })
})

describe('ClockContext', () => {
  it('defaults to the real time', () => {
    const before = Date.now()
    const { result } = renderHook(() => useClock())
    expect(result.current().getTime()).toBeGreaterThanOrEqual(before)
  })

  it('provides an injected fixed clock', () => {
    const fixed = new Date(2026, 10, 16, 10, 0)
    function Show() {
      const now = useContext(ClockContext)
      return <p>{now().toISOString()}</p>
    }
    render(<ClockContext.Provider value={() => fixed}><Show /></ClockContext.Provider>)
    expect(screen.getByText(fixed.toISOString())).toBeTruthy()
  })
})
