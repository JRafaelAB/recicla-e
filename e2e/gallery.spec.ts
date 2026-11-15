import { test, expect, distUrl } from './fixtures'

const CAPTIONS = [
  'S1 — Login',
  'S2 — Login with validation errors',
  'S3 — Cadastro (sign-up)',
  'S4 — Onboarding card (with progress)',
  'S5 — Onboarding summary with devices',
  'S6 — Onboarding summary, no devices',
  'S7 — Home map, default, with mascot tip balloon',
  'S8 — Home map, filtered by a category',
  'S9 — Home map, no results',
  'S10 — Point detail',
  'S11 — Point detail with route ("Como chegar")',
  'S12 — Scheduling form',
  'S13 — Scheduling, day with no slots',
  'S14 — Celebration / impact after booking',
  'S15 — Aprender list',
  'S16 — Device page (Aprender detail)',
  'S17 — Perfil, no bookings',
  'S18 — Perfil with bookings',
]

test('GAL-01/02: gallery.html offline shows 18 captioned 390×844 frames', async ({ page }) => {
  await page.goto(distUrl('gallery.html'))
  await expect(page.getByRole('heading', { level: 1, name: 'recicla-E — telas do protótipo' })).toBeVisible()
  const items = page.getByTestId('gallery-item')
  await expect(items).toHaveCount(18)
  await expect(items.locator('figcaption')).toHaveText(CAPTIONS)
  for (let i = 0; i < 18; i++) {
    const box = await items.nth(i).getByTestId('phone-frame').boundingBox()
    expect([box!.width, box!.height], CAPTIONS[i]).toEqual([390, 844])
  }
})

test('GAL-01: S13 frame shows the no-slots state inside the visible screen', async ({ page }) => {
  await page.goto(distUrl('gallery.html'))
  const frame = page.getByTestId('gallery-item').nth(12)
  const screen = await frame.locator('.phone-screen').boundingBox()
  const footer = await frame.locator('.sch-footer').boundingBox()
  const msg = await frame.getByText('Sem horários disponíveis neste dia').boundingBox()
  expect(msg!.y).toBeGreaterThanOrEqual(screen!.y)
  expect(msg!.y + msg!.height).toBeLessThanOrEqual(Math.min(screen!.y + screen!.height, footer!.y))
})

test('GAL-02: frames use the fixed clock and the app components', async ({ page }) => {
  await page.goto(distUrl('gallery.html'))
  const frame = (n: number) => page.getByTestId('gallery-item').nth(n - 1)
  await expect(frame(1).getByRole('button', { name: 'Entrar' })).toBeVisible()
  await expect(frame(14).getByTestId('cel-summary')).toContainText('2 celulares')
  await expect(frame(8).getByTestId('screen-home')).toBeVisible()
  await expect(frame(18).getByTestId('screen-profile')).toBeVisible()
})
