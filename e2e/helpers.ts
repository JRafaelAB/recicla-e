import type { Page } from '@playwright/test'
import { distUrl } from './fixtures'

export const KEY = 'recicla-e:v1'

/** Saved-state shape (src/logic/storage.ts Persisted). */
export interface Saved {
  session: boolean
  name?: string
  onboarding: { done: boolean; answers: Record<string, 'tenho' | 'nao'> }
  bookings: { id: string; pointId: number; items: { subtypeId: string; qty: number }[]; date: string; slot: string }[]
}

export const loggedIn = (over: Partial<Saved> = {}): Saved => ({
  session: true,
  name: 'Ana',
  onboarding: { done: true, answers: {} },
  bookings: [],
  ...over,
})

/** Seeds localStorage once (first navigation only, so reloads keep what the app saved). */
export async function openWith(page: Page, saved?: Saved) {
  if (saved) {
    await page.addInitScript(
      ([k, v]) => {
        if (!sessionStorage.getItem('__seeded')) {
          localStorage.setItem(k, v)
          sessionStorage.setItem('__seeded', '1')
        }
      },
      [KEY, JSON.stringify(saved)] as const,
    )
  }
  await page.goto(distUrl('index.html'))
}

export async function readSaved(page: Page): Promise<Saved | null> {
  const raw = await page.evaluate((k) => localStorage.getItem(k), KEY)
  return raw ? (JSON.parse(raw) as Saved) : null
}

export const tabBar = (page: Page) => page.getByRole('navigation', { name: 'Navegação principal' })

/** Fixed local time for slot-dependent tests: Monday 2026-11-16 10:00. */
export async function fixClock(page: Page, date = new Date(2026, 10, 16, 10, 0)) {
  await page.clock.setFixedTime(date)
}
