import { test, expect } from './fixtures'
import { openWith, loggedIn, readSaved, fixClock } from './helpers'
import { FACTS } from '../src/data/catalog'
import type { Page } from '@playwright/test'

const home = (page: Page) => page.getByTestId('screen-home')
const sch = (page: Page) => page.getByTestId('screen-schedule')
const cel = (page: Page) => page.getByTestId('screen-celebration')
const confirmBtn = (page: Page) => sch(page).getByRole('button', { name: 'Confirmar agendamento' })
const day = (page: Page, label: string) => sch(page).getByRole('group', { name: 'Dia' }).getByRole('button', { name: label, exact: true })
const slotButtons = (page: Page) => sch(page).getByRole('group', { name: 'Horário' }).getByRole('button')
const plus = (page: Page, label: string) => sch(page).getByRole('button', { name: `Aumentar ${label}`, exact: true })
const minus = (page: Page, label: string) => sch(page).getByRole('button', { name: `Diminuir ${label}`, exact: true })
const qtyOf = (page: Page, label: string) => sch(page).getByRole('group', { name: label, exact: true }).getByTestId('stepper-value')

const NAMES: Record<number, string> = { 1: 'Coleta Verde Savassi', 2: 'Recicla Centro', 3: 'Coleta Lourdes' }

/** Fixed clock (Mon 2026-11-16 10:00 unless given), open the point by its name in the list, tap "Agendar entrega". */
async function openSchedule(page: Page, pointId: number, at?: Date) {
  await fixClock(page, at)
  await openWith(page, loggedIn())
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
  await home(page).getByTestId('point-item').filter({ hasText: NAMES[pointId] }).click()
  await page.getByTestId('screen-point').getByRole('button', { name: 'Agendar entrega' }).click()
  await expect(sch(page)).toBeVisible()
}

const WEEK = ['Seg, 16/11', 'Ter, 17/11', 'Qua, 18/11', 'Qui, 19/11', 'Sex, 20/11', 'Sáb, 21/11', 'Dom, 22/11']

test('SCH-01: point 1 lists only its 6 accepted sub-types, grouped by category, each with a stepper', async ({ page }) => {
  await openSchedule(page, 1)
  await expect(sch(page).getByTestId('sch-group').getByRole('heading')).toHaveText([/Pilhas/, /Baterias/, /Celulares/, /Lâmpadas/, /Cabos e carregadores/])
  await expect(sch(page).getByTestId('sch-item').locator('.sch-row-label')).toHaveText([
    'Pilha comum/alcalina', 'Bateria de lítio (celular, notebook, power bank)', 'Celular', 'Fluorescente', 'LED', 'Cabos e carregadores',
  ])
  await expect(sch(page).getByTestId('stepper-value')).toHaveText(['0', '0', '0', '0', '0', '0'])
})

test('SCH-02: the stepper goes from 0 to 20, with − disabled at 0 and + disabled at 20', async ({ page }) => {
  await openSchedule(page, 1)
  await expect(minus(page, 'Celular')).toBeDisabled()
  for (let i = 0; i < 20; i++) await plus(page, 'Celular').click()
  await expect(qtyOf(page, 'Celular')).toHaveText('20')
  await expect(plus(page, 'Celular')).toBeDisabled()
  await minus(page, 'Celular').click()
  await expect(qtyOf(page, 'Celular')).toHaveText('19')
  await expect(plus(page, 'Celular')).toBeEnabled()
})

test('SCH-03: the next 7 days start today; days the point is closed are disabled', async ({ page }) => {
  await openSchedule(page, 2) // Recicla Centro: Seg–Sex
  const days = sch(page).getByRole('group', { name: 'Dia' }).getByRole('button')
  await expect(days).toHaveCount(7)
  for (const [i, label] of WEEK.entries()) await expect(days.nth(i)).toHaveAccessibleName(label)
  for (const label of WEEK.slice(0, 5)) await expect(day(page, label)).toBeEnabled()
  await expect(day(page, 'Sáb, 21/11')).toBeDisabled()
  await expect(day(page, 'Dom, 22/11')).toBeDisabled()
})

test('SCH-03 / SCH-04: point 1 is closed only on Sunday; today shows future hourly slots only, Saturday 08:00–11:00; changing day clears the slot', async ({ page }) => {
  await openSchedule(page, 1)
  await expect(day(page, 'Sáb, 21/11')).toBeEnabled()
  await expect(day(page, 'Dom, 22/11')).toBeDisabled()
  await day(page, 'Seg, 16/11').click()
  await expect(slotButtons(page)).toHaveText(['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'])
  await day(page, 'Ter, 17/11').click()
  await expect(slotButtons(page)).toHaveText(['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'])
  await slotButtons(page).filter({ hasText: '09:00' }).click()
  await expect(slotButtons(page).filter({ hasText: '09:00' })).toHaveAttribute('aria-pressed', 'true')
  await day(page, 'Sáb, 21/11').click()
  await expect(slotButtons(page)).toHaveText(['08:00', '09:00', '10:00', '11:00'])
  await expect(sch(page).getByRole('group', { name: 'Horário' }).locator('[aria-pressed="true"]')).toHaveCount(0)
})

test('SCH-05: a day with no remaining slots shows "Sem horários disponíveis neste dia"', async ({ page }) => {
  await openSchedule(page, 1, new Date(2026, 10, 16, 17, 30)) // Monday after the last slot (17:00)
  await day(page, 'Seg, 16/11').click()
  await expect(sch(page).getByText('Sem horários disponíveis neste dia')).toBeVisible()
  await expect(slotButtons(page)).toHaveCount(0)
})

test('EDGE-04: shown slots stay until the day is selected again', async ({ page }) => {
  await openSchedule(page, 1)
  await day(page, 'Seg, 16/11').click()
  await expect(slotButtons(page).first()).toHaveText('11:00')
  await page.clock.setFixedTime(new Date(2026, 10, 16, 12, 30))
  await plus(page, 'Pilha comum/alcalina').click() // re-render with the new time
  await expect(slotButtons(page).first()).toHaveText('11:00')
  await day(page, 'Seg, 16/11').click()
  await expect(slotButtons(page)).toHaveText(['13:00', '14:00', '15:00', '16:00', '17:00'])
})

test('SCH-06: "Confirmar agendamento" stays disabled until quantity > 0, a day and a slot are chosen', async ({ page }) => {
  await openSchedule(page, 1)
  await expect(confirmBtn(page)).toBeDisabled()
  await day(page, 'Ter, 17/11').click()
  await slotButtons(page).filter({ hasText: '09:00' }).click()
  await expect(confirmBtn(page)).toBeDisabled() // quantity 0
  await plus(page, 'Celular').click()
  await expect(confirmBtn(page)).toBeEnabled()
  await day(page, 'Qua, 18/11').click()
  await expect(confirmBtn(page)).toBeDisabled() // slot cleared
  await slotButtons(page).filter({ hasText: '10:00' }).click()
  await expect(confirmBtn(page)).toBeEnabled()
  await minus(page, 'Celular').click()
  await expect(confirmBtn(page)).toBeDisabled()
})

test('SCH-07..11: booking 2 celulares saves it and shows the celebration with summary, "contêm cerca de 18 g de cobre", cobalto 7 g, Fonte and potential wording', async ({ page }) => {
  await openSchedule(page, 1)
  await plus(page, 'Celular').click()
  await plus(page, 'Celular').click()
  await day(page, 'Ter, 17/11').click()
  await slotButtons(page).filter({ hasText: '09:00' }).click()
  await confirmBtn(page).click()

  await expect(cel(page)).toBeVisible()
  const saved = (await readSaved(page))!.bookings
  expect(saved).toHaveLength(1)
  expect(saved[0]).toMatchObject({ pointId: 1, items: [{ subtypeId: 'celular', qty: 2 }], date: '2026-11-17', slot: '09:00' })
  expect(saved[0].id).not.toBe('')

  await expect(cel(page).getByRole('img', { name: 'Reci, o mascote' })).toBeVisible()
  await expect(cel(page).locator('.confetti-piece').first()).toBeAttached()
  const summary = cel(page).getByTestId('cel-summary')
  await expect(summary).toContainText('Coleta Verde Savassi')
  await expect(summary).toContainText('Ter, 17/11 às 09:00')
  await expect(summary).toContainText('2 × Celular')

  const impact = cel(page).getByTestId('cel-impact')
  await expect(impact).toContainText('Ao entregar, você vai')
  const lines = impact.getByTestId('impact-line')
  await expect(lines).toHaveCount(2)
  await expect(lines.nth(0)).toContainText('Os 2 celulares que você vai entregar contêm cerca de 18 g de cobre')
  await expect(lines.nth(1)).toContainText('Os 2 celulares que você vai entregar contêm cerca de 7 g de cobalto')
  for (const l of await lines.all()) await expect(l.getByTestId('fonte')).toContainText('Fonte:')
  await expect(cel(page)).not.toContainText(/recuperou|evitou|você salvou/i)
})

test('SCH-09 / SCH-10: 1 lâmpada LED at point 3 shows a qualitative LED fact with Fonte and no multiplied number', async ({ page }) => {
  await openSchedule(page, 3)
  await plus(page, 'LED').click()
  await day(page, 'Ter, 17/11').click()
  await slotButtons(page).first().click()
  await confirmBtn(page).click()
  const lines = cel(page).getByTestId('impact-line')
  await expect(lines).toHaveCount(1)
  const ledFacts = FACTS.filter((f) => f.subtypes.includes('lampada-led')).map((f) => f.text)
  expect(ledFacts).toContain((await lines.first().locator('span').first().textContent())!.trim())
  await expect(lines.first().getByTestId('fonte')).toBeVisible()
  await expect(cel(page).getByTestId('cel-impact')).not.toContainText(/\d+(,\d+)?\s?(mg|g|kg)\b/)
})

test('SCH-12: the back arrow returns to the point detail without saving', async ({ page }) => {
  await openSchedule(page, 1)
  await plus(page, 'Celular').click()
  await day(page, 'Ter, 17/11').click()
  await slotButtons(page).first().click()
  await sch(page).getByRole('button', { name: 'Voltar' }).click()
  await expect(page.getByTestId('screen-point')).toBeVisible()
  expect((await readSaved(page))!.bookings).toEqual([])
})

test('NAV-03: "Voltar ao mapa" opens the home map without a handoff (filters kept)', async ({ page }) => {
  await fixClock(page)
  await openWith(page, loggedIn())
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
  await home(page).getByRole('group', { name: 'Filtrar por aparelho' }).getByRole('button', { name: 'Celulares', exact: true }).click()
  await home(page).getByTestId('point-item').first().click()
  await page.getByTestId('screen-point').getByRole('button', { name: 'Agendar entrega' }).click()
  await plus(page, 'Celular').click()
  await day(page, 'Ter, 17/11').click()
  await slotButtons(page).first().click()
  await confirmBtn(page).click()
  await cel(page).getByRole('button', { name: 'Voltar ao mapa' }).click()
  await expect(home(page)).toBeVisible()
  await expect(home(page).getByRole('group', { name: 'Filtrar por aparelho' }).locator('[aria-pressed="true"]')).toHaveText([/Celulares$/])
})
