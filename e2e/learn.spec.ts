import { test, expect } from './fixtures'
import { openWith, loggedIn, tabBar } from './helpers'
import type { Page } from '@playwright/test'

const learn = (page: Page) => page.getByTestId('screen-learn')
const dev = (page: Page) => page.getByTestId('screen-device')
const home = (page: Page) => page.getByTestId('screen-home')

async function openLearn(page: Page) {
  await openWith(page, loggedIn())
  await tabBar(page).getByRole('button', { name: /Aprender/ }).click()
  await expect(learn(page)).toBeVisible()
}

async function openDevice(page: Page, name: string) {
  await openLearn(page)
  await learn(page).getByTestId('learn-item').getByRole('button', { name, exact: true }).click()
  await expect(dev(page)).toBeVisible()
}

test('INFO-01 / SCALE-02: 8 categories with emoji, name and scale, sorted by level desc then name', async ({ page }) => {
  await openLearn(page)
  const items = learn(page).getByTestId('learn-item')
  await expect(items.locator('.learn-item-name')).toHaveText([
    'Baterias', 'Celulares', 'Computadores e notebooks', 'TVs e monitores', // 5, 4, 4, 4
    'Geladeiras e linha branca', 'Lâmpadas', // 3, 3
    'Pilhas', // 2
    'Cabos e carregadores', // 1
  ])
  await expect(items.locator('.learn-item-emoji')).toHaveText(['🪫', '📱', '💻', '📺', '🧊', '💡', '🔋', '🔌'])
  await expect(items.getByTestId('danger-label')).toHaveText(['Crítico', 'Muito alto', 'Muito alto', 'Muito alto', 'Alto', 'Alto', 'Moderado', 'Baixo'])
  await expect(items.first().getByTestId('danger-emoji')).toHaveText('☠️')
  await expect(items.first().locator('[data-testid="danger-segment"][data-filled="true"]')).toHaveCount(5)
})

test('INFO-02: the "O que é logística reversa?" card explains the PNRS and shows the BH URPV note', async ({ page }) => {
  await openLearn(page)
  const card = learn(page).getByTestId('pnrs-card')
  await expect(card.getByRole('heading', { name: /O que é logística reversa\?/ })).toBeVisible()
  await expect(card).toContainText('Política Nacional de Resíduos Sólidos (Lei 12.305/2010)')
  await expect(card.getByTestId('urpv-note')).toContainText('As URPVs de BH não recebem eletrônicos, pilhas nem lâmpadas')
  await expect(card.getByTestId('fonte')).toHaveCount(2)
})

test('SCALE-03: tapping a list scale shows its justification and the scale note', async ({ page }) => {
  await openLearn(page)
  await learn(page).getByRole('button', { name: /Perigo de Baterias/ }).click()
  const balloon = learn(page).getByRole('dialog')
  await expect(balloon).toContainText('Fuga térmica e incêndio')
  await expect(balloon).toContainText('Escala educativa recicla-E: toxicidade + risco de fogo')
})

test('INFO-03 / INFO-04 / INFO-05 / SCALE-02: Lâmpadas shows Fluorescente (3 😟) and LED (1 🙂) sections with the three headings, streams and Fonte on every fact', async ({ page }) => {
  await openDevice(page, 'Lâmpadas')
  await expect(dev(page).getByRole('heading', { level: 1 })).toHaveText('Lâmpadas')
  const subs = dev(page).getByTestId('device-subtype')
  await expect(subs).toHaveCount(2)
  await expect(subs.nth(0).getByRole('heading', { level: 2 })).toHaveText(/Fluorescente/)
  await expect(subs.nth(0).getByTestId('danger-label')).toHaveText('Alto')
  await expect(subs.nth(0).getByTestId('danger-emoji')).toHaveText('😟')
  await expect(subs.nth(1).getByRole('heading', { level: 2 })).toHaveText(/LED/)
  await expect(subs.nth(1).getByTestId('danger-label')).toHaveText('Baixo')
  await expect(subs.nth(1).getByTestId('danger-emoji')).toHaveText('🙂')
  for (const s of await subs.all()) {
    await expect(s.getByRole('heading', { level: 3, name: /Por que não guardar em casa/ })).toBeVisible()
    await expect(s.getByRole('heading', { level: 3, name: 'Como descartar corretamente' })).toBeVisible()
    await expect(s.getByRole('heading', { level: 3, name: 'O que causa ao meio ambiente' })).toBeVisible()
  }
  await expect(subs.nth(0).getByTestId('device-stream')).toContainText('Logística reversa de lâmpadas (Reciclus)')
  await expect(subs.nth(1).getByTestId('device-stream')).not.toBeEmpty()
  // INFO-05: every element with a number on the page carries a Fonte (facts); guide texts have none.
  const facts = dev(page).getByTestId('device-fact')
  expect(await facts.count()).toBeGreaterThan(0)
  for (const f of await facts.all()) await expect(f.getByTestId('fonte')).toBeVisible()
  await expect(subs.nth(0).getByTestId('device-fact').filter({ hasText: 'cerca de 4 mg de mercúrio' }).getByTestId('fonte')).toBeVisible()
  for (const p of await dev(page).locator('.dev-text, .dev-stream').all()) await expect(p).not.toContainText(/\d/)
})

test('SCALE-02: Baterias page shows lítio at 5 ☠️ and automotiva at 4 😨', async ({ page }) => {
  await openDevice(page, 'Baterias')
  const subs = dev(page).getByTestId('device-subtype')
  await expect(subs.getByRole('heading', { level: 2 }).filter({ hasText: /lítio|automotiva/ })).toHaveText([/Bateria de lítio/, /Bateria automotiva/])
  await expect(subs.nth(0).getByTestId('danger-emoji')).toHaveText('☠️')
  await expect(subs.nth(1).getByTestId('danger-label')).toHaveText('Muito alto')
})

test('INFO-04: a single-sub-type category (Celulares) shows one guide without a sub-type title', async ({ page }) => {
  await openDevice(page, 'Celulares')
  await expect(dev(page).getByTestId('device-subtype')).toHaveCount(1)
  await expect(dev(page).getByTestId('device-subtype').locator('.dev-sub-title')).toHaveCount(0)
  await expect(dev(page).getByRole('heading', { level: 2 })).toHaveText([/Por que não guardar em casa/, 'Como descartar corretamente', 'O que causa ao meio ambiente'])
  await expect(dev(page).getByTestId('danger-label')).toHaveText(['Muito alto'])
})

test('TIP-03 / TIP-04: an ⓘ next to a section heading shows a catalog tip and closes on an outside tap', async ({ page }) => {
  await openDevice(page, 'Lâmpadas')
  await dev(page).getByRole('button', { name: /Saiba mais: dica sobre Fluorescente/ }).click()
  const balloon = dev(page).getByRole('dialog')
  await expect(balloon).toContainText('Lâmpada fluorescente quebrou?')
  await expect(balloon.getByTestId('fonte')).toBeVisible()
  await dev(page).getByRole('heading', { level: 1 }).click()
  await expect(dev(page).getByRole('dialog')).toHaveCount(0)
})

test('NAV-02: the back arrow on the device page returns to Aprender', async ({ page }) => {
  await openDevice(page, 'Pilhas')
  await dev(page).getByRole('button', { name: 'Voltar' }).click()
  await expect(learn(page)).toBeVisible()
})

test('INFO-06 / MAP-03: "Ver pontos de coleta" opens the map filtered by Lâmpadas (points 1, 3, 7, 8) with the search cleared', async ({ page }) => {
  await openWith(page, loggedIn())
  await home(page).getByRole('searchbox', { name: 'Buscar pontos' }).fill('xyz')
  await tabBar(page).getByRole('button', { name: /Aprender/ }).click()
  await learn(page).getByTestId('learn-item').getByRole('button', { name: 'Lâmpadas', exact: true }).click()
  await dev(page).getByRole('button', { name: 'Ver pontos de coleta' }).click()
  await expect(home(page)).toBeVisible()
  await expect(home(page).getByRole('searchbox', { name: 'Buscar pontos' })).toHaveValue('')
  await expect(home(page).getByRole('group', { name: 'Filtrar por aparelho' }).locator('[aria-pressed="true"]')).toHaveText([/Lâmpadas$/])
  await expect(home(page).getByTestId('point-item').locator('.home-item-name')).toHaveText([
    'Coleta Verde Savassi', 'Coleta Lourdes', 'Central de Coleta Pampulha', 'Pampulha Lâmpadas & Pilhas',
  ])
})
