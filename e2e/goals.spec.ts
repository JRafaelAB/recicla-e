import { test, expect } from './fixtures'
import { openWith, loggedIn, tabBar, fixClock } from './helpers'
import type { Page } from '@playwright/test'

const home = (page: Page) => page.getByTestId('screen-home')
const chip = (page: Page, name: string) => home(page).getByRole('group', { name: 'Filtrar por aparelho' }).getByRole('button', { name, exact: true })

/** Counts user taps: every click on the page goes through this wrapper. */
function tapCounter(page: Page) {
  let taps = 0
  return {
    get taps() { return taps },
    async tap(locator: ReturnType<Page['locator']>) {
      await locator.click()
      taps++
    },
  }
}

// Goal 1: from a fresh home map (Todos, empty search), 2 taps (category chip, first list item) open the nearest point.
for (const [category, nearest] of [
  ['Geladeiras e linha branca', 'Ponto Verde Cidade Nova'],
  ['Lâmpadas', 'Coleta Verde Savassi'],
] as const) {
  test(`Goal 1: ${category} → nearest point "${nearest}" in exactly 2 taps from a fresh home map`, async ({ page }) => {
    await openWith(page, loggedIn())
    await expect(home(page)).toBeVisible()
    await expect(chip(page, 'Todos')).toHaveAttribute('aria-pressed', 'true')
    await expect(home(page).getByRole('searchbox', { name: 'Buscar pontos' })).toHaveValue('')

    const t = tapCounter(page)
    await t.tap(home(page).getByRole('group', { name: 'Filtrar por aparelho' }).getByRole('button', { name: new RegExp(`${category}$`) }))
    await t.tap(home(page).getByTestId('point-item').first())

    await expect(page.getByTestId('screen-point').getByRole('heading', { level: 1 })).toHaveText(nearest)
    expect(t.taps).toBe(2)
  })
}

// Goal 2: typed valid credentials, then "Entrar" and "Pular e ver mapa" reach the home map (≤ 2 taps).
test('Goal 2: login → map in 2 taps ("Entrar", "Pular e ver mapa")', async ({ page }) => {
  await openWith(page)
  const login = page.getByTestId('screen-login')
  await login.getByLabel('Email').fill('ana@x.com')
  await login.getByLabel('Senha').fill('abcdef')

  const t = tapCounter(page)
  await t.tap(login.getByRole('button', { name: 'Entrar' }))
  await t.tap(page.getByTestId('screen-onboarding').getByRole('button', { name: 'Pular e ver mapa' }))

  await expect(home(page)).toBeVisible()
  expect(t.taps).toBeLessThanOrEqual(2)
})

// NFR-01: the whole flow runs from file: with zero other requests (the fixture fails the test on any non-file: request).
test('NFR-01: full flow login → onboarding → map → point → schedule → celebration → perfil makes no non-file: requests', async ({ page, blockedRequests }) => {
  await fixClock(page)
  const requests: string[] = []
  page.on('request', (r) => requests.push(r.url()))

  await openWith(page)
  const login = page.getByTestId('screen-login')
  await login.getByLabel('Email').fill('ana@x.com')
  await login.getByLabel('Senha').fill('abcdef')
  await login.getByRole('button', { name: 'Entrar' }).click()
  await page.getByTestId('screen-onboarding').getByRole('button', { name: 'Pular e ver mapa' }).click()

  await expect(home(page)).toBeVisible()
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
  await home(page).getByTestId('point-item').filter({ hasText: 'Coleta Verde Savassi' }).click()
  await page.getByTestId('screen-point').getByRole('button', { name: 'Agendar entrega' }).click()

  const sch = page.getByTestId('screen-schedule')
  await sch.getByRole('button', { name: 'Aumentar Celular', exact: true }).click()
  await sch.getByRole('group', { name: 'Dia' }).getByRole('button', { name: 'Ter, 17/11', exact: true }).click()
  await sch.getByRole('group', { name: 'Horário' }).getByRole('button').filter({ hasText: '09:00' }).click()
  await sch.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await expect(page.getByTestId('screen-celebration').getByTestId('cel-summary')).toContainText('1 celular')

  await page.getByTestId('screen-celebration').getByRole('button', { name: 'Voltar ao mapa' }).click()
  await tabBar(page).getByRole('button', { name: /Perfil/ }).click()
  await expect(page.getByTestId('screen-profile')).toBeVisible()

  expect(requests.length).toBeGreaterThan(0)
  expect(requests.filter((u) => !u.startsWith('file:'))).toEqual([])
  expect(blockedRequests).toEqual([])
})
