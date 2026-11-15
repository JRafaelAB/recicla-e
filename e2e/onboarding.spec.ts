import { test, expect } from './fixtures'
import { openWith, readSaved, loggedIn, tabBar } from './helpers'
import type { Page } from '@playwright/test'

const LABELS = ['Pilhas', 'Baterias', 'Celulares', 'Computadores e notebooks', 'Geladeiras e linha branca', 'TVs e monitores', 'Lâmpadas', 'Cabos e carregadores']
const IDS = ['pilhas', 'baterias', 'celulares', 'computadores', 'linhabranca', 'tvs', 'lampadas', 'cabos']
const LEVEL_LABELS = ['Moderado', 'Crítico', 'Muito alto', 'Muito alto', 'Alto', 'Muito alto', 'Alto', 'Baixo'] // levels 2,5,4,4,3,4,3,1

const onb = (page: Page) => page.getByTestId('screen-onboarding')
const summary = (page: Page) => page.getByTestId('screen-onboardingSummary')
const fresh = () => loggedIn({ onboarding: { done: false, answers: {} } })

/** Answers the 8 cards with the buttons; `tenho` = category ids answered ✅. */
async function answerAll(page: Page, tenho: string[]) {
  for (let i = 0; i < 8; i++) {
    await expect(page.getByTestId('onb-count')).toHaveText(`${i + 1} de 8`)
    const name = tenho.includes(IDS[i]) ? '✅ Tenho' : '✕ Não tenho'
    await onb(page).getByRole('button', { name, exact: true }).click()
  }
}

test('ONB-01..03, ONB-06: 8 cards in order with emoji, name, danger scale, a fact with Fonte, "N de 8" and progress; no tab bar', async ({ page }) => {
  await openWith(page, fresh())
  for (let i = 0; i < 8; i++) {
    await expect(page.getByTestId('onb-count')).toHaveText(`${i + 1} de 8`)
    await expect(onb(page).getByRole('progressbar')).toHaveAttribute('aria-valuenow', String(i + 1))
    const card = page.getByTestId('swipe-card')
    await expect(card.getByRole('heading', { level: 1 })).toHaveText(LABELS[i])
    await expect(card.locator('.onb-illus-emoji')).not.toBeEmpty()
    await expect(card.getByTestId('danger-segment')).toHaveCount(5)
    await expect(card.getByTestId('danger-label')).toHaveText(LEVEL_LABELS[i])
    await expect(card.getByText('Você sabia?')).toBeVisible()
    await expect(card.getByTestId('fonte')).toBeVisible()
    await expect(tabBar(page)).toHaveCount(0)
    await onb(page).getByRole('button', { name: '✕ Não tenho', exact: true }).click()
  }
  await expect(summary(page)).toBeVisible()
})

test('ONB-04/05/09/10, EDGE-02: ✅ Celulares + Pilhas → summary lists both with level, como descartar and Coleta Verde Savassi; mini map has 1 pin and the user dot inside it', async ({ page }) => {
  await openWith(page, fresh())
  await answerAll(page, ['celulares', 'pilhas'])
  await expect(summary(page)).toBeVisible()
  expect((await readSaved(page))!.onboarding).toEqual({
    done: true,
    answers: { pilhas: 'tenho', baterias: 'nao', celulares: 'tenho', computadores: 'nao', linhabranca: 'nao', tvs: 'nao', lampadas: 'nao', cabos: 'nao' },
  })
  const items = summary(page).getByTestId('summary-item')
  await expect(items.getByRole('heading')).toHaveText(['Pilhas', 'Celulares'])
  await expect(items.nth(0).getByTestId('danger-label')).toHaveText('Moderado')
  await expect(items.nth(1).getByTestId('danger-label')).toHaveText('Muito alto')
  await expect(items.nth(0)).toContainText('Como descartar: Leve a um ponto de coleta de pilhas.')
  await expect(items.nth(1)).toContainText('Como descartar: Entregue num ponto de eletroeletrônicos.')
  await expect(summary(page).getByTestId('summary-nearest')).toHaveText([/Coleta Verde Savassi · 0,8 km/, /Coleta Verde Savassi · 0,8 km/])

  const mini = summary(page).getByTestId('mini-map')
  await expect(mini.locator('[data-testid^="pin-"]')).toHaveCount(1)
  await expect(mini.getByTestId('pin-1')).toHaveCount(1)
  // Approved fix (T20): the mini map frames its pins and the user dot.
  const box = (await mini.boundingBox())!
  for (const el of [mini.getByTestId('pin-1'), mini.getByTestId('user-dot')]) {
    const b = (await el.boundingBox())!
    expect(b.x).toBeGreaterThanOrEqual(box.x)
    expect(b.y).toBeGreaterThanOrEqual(box.y)
    expect(b.x + b.width).toBeLessThanOrEqual(box.x + box.width)
    expect(b.y + b.height).toBeLessThanOrEqual(box.y + box.height)
  }
})

test('ONB-10, EDGE-02: Pilhas + Geladeiras → nearest points 1 and 5, one pin each, both framed by the mini map', async ({ page }) => {
  await openWith(page, fresh())
  await answerAll(page, ['pilhas', 'linhabranca'])
  await expect(summary(page).getByTestId('summary-nearest')).toHaveText([/Coleta Verde Savassi · 0,8 km/, /Ponto Verde Cidade Nova · 5,2 km/])
  const mini = summary(page).getByTestId('mini-map')
  await expect(mini.locator('[data-testid^="pin-"]')).toHaveCount(2)
  const box = (await mini.boundingBox())!
  for (const el of [mini.getByTestId('pin-1'), mini.getByTestId('pin-5'), mini.getByTestId('user-dot')]) {
    const b = (await el.boundingBox())!
    expect(b.x >= box.x && b.y >= box.y && b.x + b.width <= box.x + box.width && b.y + b.height <= box.y + box.height).toBe(true)
  }
})

test('ONB-11/13: all ✕ → empty summary message and "Ir para o mapa" opens the home map', async ({ page }) => {
  await openWith(page, fresh())
  await answerAll(page, [])
  await expect(summary(page).getByText('Ótimo! Você não tem lixo eletrônico parado em casa.')).toBeVisible()
  await expect(summary(page).getByTestId('summary-item')).toHaveCount(0)
  await summary(page).getByRole('button', { name: 'Ir para o mapa' }).click()
  await expect(page.getByTestId('screen-home')).toBeVisible()
})

test('ONB-12: "Ir para o mapa" on a summary with devices opens the home map', async ({ page }) => {
  await openWith(page, fresh())
  await answerAll(page, ['celulares', 'pilhas'])
  await summary(page).getByRole('button', { name: 'Ir para o mapa' }).click()
  await expect(page.getByTestId('screen-home')).toBeVisible()
  await expect(tabBar(page)).toBeVisible()
})

test('ONB-08: "Pular e ver mapa" marks onboarding done and opens the home map', async ({ page }) => {
  await openWith(page, fresh())
  await onb(page).getByRole('button', { name: 'Pular e ver mapa' }).click()
  await expect(page.getByTestId('screen-home')).toBeVisible()
  expect((await readSaved(page))!.onboarding.done).toBe(true)
  await page.reload()
  await expect(page.getByTestId('screen-home')).toBeVisible()
})

test('ONB-04/05: a real mouse drag right records "tenho" and a drag left records "não tenho"', async ({ page }) => {
  await openWith(page, fresh())
  const drag = async (dx: number) => {
    const b = (await page.getByTestId('swipe-card').boundingBox())!
    const x = b.x + b.width / 2
    const y = b.y + b.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + dx / 2, y, { steps: 5 })
    await page.mouse.move(x + dx, y, { steps: 5 })
    await page.mouse.up()
  }
  await drag(160)
  await expect(page.getByTestId('onb-count')).toHaveText('2 de 8')
  await drag(-160)
  await expect(page.getByTestId('onb-count')).toHaveText('3 de 8')
  expect((await readSaved(page))!.onboarding.answers).toEqual({ pilhas: 'tenho', baterias: 'nao' })
})

test('ONB-07: a second answer during the exit animation is ignored', async ({ page }) => {
  await openWith(page, fresh())
  await onb(page).getByRole('button', { name: '✅ Tenho', exact: true }).click()
  // Second tap while the card is leaving (bypasses Playwright's enabled check on purpose).
  await onb(page).getByRole('button', { name: '✕ Não tenho', exact: true }).dispatchEvent('click')
  await expect(page.getByTestId('onb-count')).toHaveText('2 de 8')
  await expect(page.getByTestId('swipe-card').getByRole('heading', { level: 1 })).toHaveText('Baterias')
  await page.waitForTimeout(600)
  await expect(page.getByTestId('onb-count')).toHaveText('2 de 8')
  expect((await readSaved(page))!.onboarding.answers).toEqual({ pilhas: 'tenho' })
})
