import { test, expect } from './fixtures'
import { openWith, loggedIn, readSaved, tabBar, fixClock, type Saved } from './helpers'
import { FACTS } from '../src/data/catalog'
import type { Page } from '@playwright/test'

const prof = (page: Page) => page.getByTestId('screen-profile')
const home = (page: Page) => page.getByTestId('screen-home')
const login = (page: Page) => page.getByTestId('screen-login')

const booking = (id: string, pointId: number, items: [string, number][], date: string, slot: string): Saved['bookings'][number] => ({
  id, pointId, items: items.map(([subtypeId, qty]) => ({ subtypeId, qty })), date, slot,
})

async function openProfile(page: Page, saved: Saved) {
  await openWith(page, saved)
  await tabBar(page).getByRole('button', { name: /Perfil/ }).click()
  await expect(prof(page)).toBeVisible()
}

async function loginAgain(page: Page) {
  await login(page).getByLabel('Email').fill('ana@x.com')
  await login(page).getByLabel('Senha').fill('abcdef')
  await login(page).getByRole('button', { name: 'Entrar' }).click()
}

test('PROF-02 / NAV-01: no bookings → name, "Itens agendados: 0" and "Agende seu primeiro descarte" opens the map without a handoff', async ({ page }) => {
  await openWith(page, loggedIn())
  await home(page).getByRole('group', { name: 'Filtrar por aparelho' }).getByRole('button', { name: 'Pilhas', exact: true }).click()
  await tabBar(page).getByRole('button', { name: /Perfil/ }).click()
  await expect(tabBar(page).getByRole('button', { name: /Perfil/ })).toHaveAttribute('aria-current', 'page')
  await expect(prof(page).getByTestId('profile-name')).toHaveText('Ana')
  await expect(prof(page).getByTestId('profile-count')).toHaveText('Itens agendados: 0')
  await expect(prof(page).getByTestId('profile-booking')).toHaveCount(0)
  await prof(page).getByRole('button', { name: 'Agende seu primeiro descarte' }).click()
  await expect(home(page)).toBeVisible()
  await expect(home(page).getByRole('group', { name: 'Filtrar por aparelho' }).locator('[aria-pressed="true"]')).toHaveText([/Pilhas$/])
})

test('PROF-01: after booking 2 celulares in the app, Perfil shows "Itens agendados: 2" and the booking (point, day, slot, items)', async ({ page }) => {
  await fixClock(page)
  await openWith(page, loggedIn())
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
  await home(page).getByTestId('point-item').first().click()
  await page.getByTestId('screen-point').getByRole('button', { name: 'Agendar entrega' }).click()
  const sch = page.getByTestId('screen-schedule')
  await sch.getByRole('button', { name: 'Aumentar Celular', exact: true }).click()
  await sch.getByRole('button', { name: 'Aumentar Celular', exact: true }).click()
  await sch.getByRole('button', { name: 'Ter, 17/11', exact: true }).click()
  await sch.getByRole('button', { name: '09:00' }).click()
  await sch.getByRole('button', { name: 'Confirmar agendamento' }).click()
  await page.getByTestId('screen-celebration').getByRole('button', { name: 'Voltar ao mapa' }).click()
  await tabBar(page).getByRole('button', { name: /Perfil/ }).click()

  await expect(prof(page).getByTestId('profile-count')).toHaveText('Itens agendados: 2')
  const b = prof(page).getByTestId('profile-booking')
  await expect(b).toHaveCount(1)
  await expect(b).toContainText('Coleta Verde Savassi')
  await expect(b).toContainText('Ter, 17/11 às 09:00')
  await expect(b).toContainText('2 × Celular')
})

test('PROF-06: 2 celulares + 1 lâmpada fluorescente → "Impacto potencial" totals cobre 18 g, cobalto 7 g, mercúrio 4 mg, each with Fonte', async ({ page }) => {
  await openProfile(page, loggedIn({
    bookings: [
      booking('b1', 1, [['celular', 2]], '2026-11-17', '09:00'),
      booking('b2', 3, [['lampada-fluorescente', 1]], '2026-11-18', '10:00'),
    ],
  }))
  await expect(prof(page).getByTestId('profile-count')).toHaveText('Itens agendados: 3')
  await expect(prof(page).getByTestId('profile-booking')).toHaveCount(2)
  const impact = prof(page).getByTestId('profile-impact')
  await expect(impact.getByRole('heading')).toHaveText(/Impacto potencial/)
  const lines = impact.getByTestId('profile-impact-line')
  await expect(lines).toHaveCount(3)
  await expect(lines.nth(0)).toContainText('contêm cerca de 18 g de cobre')
  await expect(lines.nth(1)).toContainText('contêm cerca de 7 g de cobalto')
  await expect(lines.nth(2)).toContainText('contêm cerca de 4 mg de mercúrio')
  for (const l of await lines.all()) await expect(l.getByTestId('fonte')).toBeVisible()
  await expect(impact).not.toContainText(/recuperou|evitou/i)
})

test('PROF-06: totals sum the same sub-type across bookings', async ({ page }) => {
  await openProfile(page, loggedIn({
    bookings: [booking('b1', 1, [['celular', 1]], '2026-11-17', '09:00'), booking('b2', 2, [['celular', 3]], '2026-11-18', '10:00')],
  }))
  await expect(prof(page).getByTestId('profile-count')).toHaveText('Itens agendados: 4')
  await expect(prof(page).getByTestId('profile-impact-line').first()).toContainText('cerca de 36 g de cobre')
})

test('PROF-07: no multipliable sub-type → "Seus itens vão para a reciclagem certa" with one qualitative fact per booked category', async ({ page }) => {
  await openProfile(page, loggedIn({
    bookings: [booking('b1', 3, [['lampada-led', 1], ['pilha', 2]], '2026-11-17', '09:00')],
  }))
  const impact = prof(page).getByTestId('profile-impact')
  await expect(impact.getByRole('heading')).toHaveText(/Seus itens vão para a reciclagem certa/)
  await expect(impact).not.toContainText('Impacto potencial')
  const lines = impact.getByTestId('profile-impact-line')
  await expect(lines).toHaveCount(2)
  const textOf = async (i: number) => (await lines.nth(i).locator('span').first().textContent())!.trim()
  const factsFor = (st: string) => FACTS.filter((f) => f.subtypes.includes(st)).map((f) => f.text)
  expect(factsFor('lampada-led')).toContain(await textOf(0))
  expect(factsFor('pilha')).toContain(await textOf(1))
  for (const l of await lines.all()) await expect(l.getByTestId('fonte')).toBeVisible()
})

test('PROF-03: "Sair" shows login and keeps name, onboarding and bookings; logging in again skips onboarding', async ({ page }) => {
  const saved = loggedIn({
    onboarding: { done: true, answers: { celulares: 'tenho' } },
    bookings: [booking('b1', 1, [['celular', 2]], '2026-11-17', '09:00')],
  })
  await openProfile(page, saved)
  await prof(page).getByRole('button', { name: 'Sair' }).click()
  await expect(login(page)).toBeVisible()
  expect(await readSaved(page)).toEqual({ ...saved, session: false })
  await loginAgain(page)
  await expect(home(page)).toBeVisible()
  await tabBar(page).getByRole('button', { name: /Perfil/ }).click()
  await expect(prof(page).getByTestId('profile-name')).toHaveText('Ana')
  await expect(prof(page).getByTestId('profile-count')).toHaveText('Itens agendados: 2')
})

test('PROF-04: "Reiniciar demo" asks "Apagar todos os dados da demonstração?"; "Cancelar" keeps all data', async ({ page }) => {
  const saved = loggedIn({ bookings: [booking('b1', 1, [['celular', 2]], '2026-11-17', '09:00')] })
  await openProfile(page, saved)
  await prof(page).getByRole('button', { name: 'Reiniciar demo' }).click()
  const dialog = prof(page).getByRole('alertdialog')
  await expect(dialog).toContainText('Apagar todos os dados da demonstração?')
  await expect(dialog.getByRole('button')).toHaveText(['Cancelar', 'Apagar'])
  await dialog.getByRole('button', { name: 'Cancelar' }).click()
  await expect(prof(page).getByRole('alertdialog')).toHaveCount(0)
  await expect(prof(page).getByTestId('profile-count')).toHaveText('Itens agendados: 2')
  expect(await readSaved(page)).toEqual(saved)
})

test('PROF-05: confirming "Apagar" erases all saved state and shows login; logging in again shows onboarding', async ({ page }) => {
  await openProfile(page, loggedIn({ bookings: [booking('b1', 1, [['celular', 2]], '2026-11-17', '09:00')] }))
  await prof(page).getByRole('button', { name: 'Reiniciar demo' }).click()
  await prof(page).getByRole('alertdialog').getByRole('button', { name: 'Apagar' }).click()
  await expect(login(page)).toBeVisible()
  expect(await readSaved(page)).toBeNull()
  await loginAgain(page)
  await expect(page.getByTestId('screen-onboarding')).toBeVisible()
  expect(await readSaved(page)).toEqual({ session: true, name: 'ana', onboarding: { done: false, answers: {} }, bookings: [] })
})
