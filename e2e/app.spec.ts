import { test, expect, distUrl } from './fixtures'
import type { Page } from '@playwright/test'

const KEY = 'recicla-e:v1'

async function openWith(page: Page, saved?: object) {
  if (saved) {
    await page.addInitScript(([k, v]) => window.localStorage.setItem(k, v), [KEY, JSON.stringify(saved)] as const)
  }
  await page.goto(distUrl('index.html'))
}

const tabBar = (page: Page) => page.getByRole('navigation', { name: 'Navegação principal' })

test('AUTH-01: a fresh open shows the login screen without the tab bar', async ({ page }) => {
  await openWith(page)
  await expect(page.getByTestId('screen-login')).toBeVisible()
  await expect(tabBar(page)).toHaveCount(0)
})

test('AUTH-02 / NAV-01: a saved session with onboarding done opens the home map with the tab bar', async ({ page }) => {
  await openWith(page, { session: true, name: 'Ana', onboarding: { done: true, answers: {} }, bookings: [] })
  await expect(page.getByTestId('screen-home')).toBeVisible()
  await expect(tabBar(page).getByRole('button')).toHaveText([/Mapa/, /Aprender/, /Perfil/])
  await expect(tabBar(page).getByRole('button', { name: /Mapa/ })).toHaveAttribute('aria-current', 'page')
})

test('AUTH-02 / ONB-03: a saved session without onboarding opens the onboarding and hides the tab bar', async ({ page }) => {
  await openWith(page, { session: true, name: 'Ana', onboarding: { done: false, answers: {} }, bookings: [] })
  await expect(page.getByTestId('screen-onboarding')).toBeVisible()
  await expect(tabBar(page)).toHaveCount(0)
})

test('NAV-01: the tab bar switches between the three main screens', async ({ page }) => {
  await openWith(page, { session: true, name: 'Ana', onboarding: { done: true, answers: {} }, bookings: [] })
  await tabBar(page).getByRole('button', { name: /Aprender/ }).click()
  await expect(page.getByTestId('screen-learn')).toBeVisible()
  await expect(tabBar(page).getByRole('button', { name: /Aprender/ })).toHaveAttribute('aria-current', 'page')
  await tabBar(page).getByRole('button', { name: /Perfil/ }).click()
  await expect(page.getByTestId('screen-profile')).toBeVisible()
  await tabBar(page).getByRole('button', { name: /Mapa/ }).click()
  await expect(page.getByTestId('screen-home')).toBeVisible()
})

test('the app renders inside a 390×844 phone frame', async ({ page }) => {
  await openWith(page)
  const box = await page.getByTestId('phone-frame').boundingBox()
  expect(box).not.toBeNull()
  expect(box!.width).toBe(390)
  expect(box!.height).toBe(844)
})
