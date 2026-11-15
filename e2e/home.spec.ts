import { test, expect } from './fixtures'
import { openWith, loggedIn, tabBar } from './helpers'
import { TIPS } from '../src/data/catalog'
import type { Page } from '@playwright/test'

const NAMES: Record<number, string> = {
  1: 'Coleta Verde Savassi', 2: 'Recicla Centro', 3: 'Coleta Lourdes', 4: 'Santa Efigênia Eletro', 5: 'Ponto Verde Cidade Nova',
  6: 'Buritis Recicla', 7: 'Central de Coleta Pampulha', 8: 'Pampulha Lâmpadas & Pilhas', 9: 'Barreiro Coleta', 10: 'Venda Nova Eletro',
}
const CHIP_LABELS = ['Todos', 'Pilhas', 'Baterias', 'Celulares', 'Computadores e notebooks', 'Geladeiras e linha branca', 'TVs e monitores', 'Lâmpadas', 'Cabos e carregadores']

const home = (page: Page) => page.getByTestId('screen-home')
const chip = (page: Page, name: string) => home(page).getByRole('group', { name: 'Filtrar por aparelho' }).getByRole('button', { name, exact: true })
const search = (page: Page) => home(page).getByRole('searchbox', { name: 'Buscar pontos' })
const items = (page: Page) => home(page).getByTestId('point-item')
const pins = (page: Page) => home(page).locator('[data-testid^="pin-"]')

/** Asserts list (in order) and pins show exactly these point ids. */
async function expectPoints(page: Page, ids: number[]) {
  await expect(items(page).locator('.home-item-name')).toHaveText(ids.map((i) => NAMES[i]))
  await expect(pins(page)).toHaveCount(ids.length)
  for (const id of ids) await expect(home(page).getByTestId(`pin-${id}`)).toHaveCount(1)
}

async function closeTip(page: Page) {
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
}

test.beforeEach(async ({ page }) => {
  await openWith(page, loggedIn())
  await expect(home(page)).toBeVisible()
})

test('MAP-01 / MAP-02 / MAP-11: first open shows the map, user dot, search, Todos + 8 chips, 10 points by distance and the fictional label', async ({ page }) => {
  await expect(home(page).getByTestId('bhmap')).toBeVisible()
  await expect(home(page).getByTestId('user-dot')).toHaveCount(1)
  await expect(search(page)).toHaveValue('')
  await expect(home(page).getByRole('group', { name: 'Filtrar por aparelho' }).getByRole('button')).toHaveText(CHIP_LABELS.map((l) => new RegExp(`${l}$`)))
  await expect(chip(page, 'Todos')).toHaveAttribute('aria-pressed', 'true')
  await expect(home(page).getByText('Pontos fictícios (demonstração)')).toBeVisible()
  await expectPoints(page, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const first = items(page).first()
  await expect(first).toContainText('Coleta Verde Savassi')
  await expect(first).toContainText('Savassi · 0,8 km')
  // Point 1 accepts pilhas, baterias, celulares, lâmpadas, cabos.
  await expect(first.getByRole('img')).toHaveText(['🔋', '🪫', '📱', '💡', '🔌'])
  await expect(items(page).nth(9)).toContainText('Venda Nova · 13,7 km')
})

test('MAP-05 / MAP-08: selecting "Geladeiras e linha branca" deselects Todos and shows points 5, 7, 9, 10', async ({ page }) => {
  await chip(page, 'Geladeiras e linha branca').click()
  await expect(chip(page, 'Geladeiras e linha branca')).toHaveAttribute('aria-pressed', 'true')
  await expect(chip(page, 'Todos')).toHaveAttribute('aria-pressed', 'false')
  await expectPoints(page, [5, 7, 9, 10])
})

test('MAP-06 / MAP-07: deselecting one of two chips keeps the other; deselecting the only chip returns to Todos; Todos clears', async ({ page }) => {
  await chip(page, 'Geladeiras e linha branca').click()
  await chip(page, 'Lâmpadas').click()
  await expectPoints(page, [1, 3, 5, 7, 8, 9, 10])
  await chip(page, 'Lâmpadas').click()
  await expect(chip(page, 'Lâmpadas')).toHaveAttribute('aria-pressed', 'false')
  await expectPoints(page, [5, 7, 9, 10])
  await chip(page, 'Geladeiras e linha branca').click()
  await expect(chip(page, 'Todos')).toHaveAttribute('aria-pressed', 'true')
  await expectPoints(page, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  await chip(page, 'Pilhas').click()
  await chip(page, 'Cabos e carregadores').click()
  await chip(page, 'Todos').click()
  await expect(chip(page, 'Todos')).toHaveAttribute('aria-pressed', 'true')
  await expect(chip(page, 'Pilhas')).toHaveAttribute('aria-pressed', 'false')
  await expect(chip(page, 'Cabos e carregadores')).toHaveAttribute('aria-pressed', 'false')
  await expect(items(page)).toHaveCount(10)
})

test('MAP-09: searching "pampulha" shows points 7, 8', async ({ page }) => {
  await search(page).fill('pampulha')
  await expectPoints(page, [7, 8])
})

test('MAP-10: "Geladeiras e linha branca" + "pampulha" shows point 7 only', async ({ page }) => {
  await chip(page, 'Geladeiras e linha branca').click()
  await search(page).fill('pampulha')
  await expectPoints(page, [7])
})

test('EDGE-03 / MAP-09: accent-free and case-insensitive search matches accented data', async ({ page }) => {
  await search(page).fill('EFIGENIA')
  await expectPoints(page, [4])
  await search(page).fill('lampada')
  await expectPoints(page, [1, 3, 7, 8])
})

test('MAP-12 / MAP-13: "xyz" shows "Nenhum ponto encontrado"; "Limpar filtros" selects Todos and clears the search', async ({ page }) => {
  await chip(page, 'Pilhas').click()
  await search(page).fill('xyz')
  await expect(home(page).getByText('Nenhum ponto encontrado')).toBeVisible()
  await expect(items(page)).toHaveCount(0)
  await expect(pins(page)).toHaveCount(0)
  await home(page).getByRole('button', { name: 'Limpar filtros' }).click()
  await expect(search(page)).toHaveValue('')
  await expect(chip(page, 'Todos')).toHaveAttribute('aria-pressed', 'true')
  await expect(chip(page, 'Pilhas')).toHaveAttribute('aria-pressed', 'false')
  await expect(items(page)).toHaveCount(10)
})

test('MAP-02: reopening the map without a handoff (tab switch) keeps chips and search', async ({ page }) => {
  await chip(page, 'Lâmpadas').click()
  await search(page).fill('pampulha')
  await tabBar(page).getByRole('button', { name: /Aprender/ }).click()
  await tabBar(page).getByRole('button', { name: /Mapa/ }).click()
  await expect(chip(page, 'Lâmpadas')).toHaveAttribute('aria-pressed', 'true')
  await expect(search(page)).toHaveValue('pampulha')
  await expectPoints(page, [7, 8])
})

test('TIP-01 / TIP-02: the mascot tip shows a catalog tip, closes on ✕ and reappears after reopening the map', async ({ page }) => {
  const tipText = home(page).getByTestId('mascot-tip-text')
  await expect(tipText).toBeVisible()
  expect(TIPS.map((t) => t.text)).toContain(await tipText.textContent())
  // Not dismissed by a tap elsewhere (only ✕ closes it).
  await chip(page, 'Pilhas').click()
  await expect(tipText).toBeVisible()
  await closeTip(page)
  await expect(home(page).getByTestId('mascot-tip')).toHaveCount(0)
  await chip(page, 'Pilhas').click()
  await expect(home(page).getByTestId('mascot-tip')).toHaveCount(0)
  await tabBar(page).getByRole('button', { name: /Aprender/ }).click()
  await tabBar(page).getByRole('button', { name: /Mapa/ }).click()
  await expect(tipText).toBeVisible()
  expect(TIPS.map((t) => t.text)).toContain(await tipText.textContent())
})

test('TIP-03 / TIP-04: the ⓘ next to the list heading opens a catalog fact balloon that closes on an outside tap', async ({ page }) => {
  await closeTip(page)
  await home(page).getByRole('button', { name: /Saiba mais/ }).click()
  const balloon = home(page).getByRole('dialog')
  await expect(balloon).toContainText('As URPVs de BH não recebem eletrônicos, pilhas nem lâmpadas')
  await expect(balloon.getByTestId('fonte')).toBeVisible()
  await search(page).click()
  await expect(home(page).getByRole('dialog')).toHaveCount(0)
})

test('PT-01 entry: tapping a list item opens that point', async ({ page }) => {
  await closeTip(page)
  await items(page).nth(2).click()
  await expect(page.getByTestId('screen-point')).toBeVisible()
})

test('PT-01 entry: tapping a pin opens that point', async ({ page }) => {
  await closeTip(page)
  await home(page).getByTestId('pin-10').click()
  await expect(page.getByTestId('screen-point')).toBeVisible()
})
