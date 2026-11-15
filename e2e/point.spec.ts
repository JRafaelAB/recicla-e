import { test, expect } from './fixtures'
import { openWith, loggedIn } from './helpers'
import { GUIDES } from '../src/data/catalog'
import type { Page } from '@playwright/test'

const home = (page: Page) => page.getByTestId('screen-home')
const point = (page: Page) => page.getByTestId('screen-point')
const route = (page: Page) => page.getByTestId('screen-route')

// Point 1 (spec Mock Data): accepts pilha, bateria-litio, celular, cabos, lampada-fluorescente, lampada-led.
const P1_SUBTYPES = ['pilha', 'bateria-litio', 'celular', 'lampada-fluorescente', 'lampada-led', 'cabos']
const guide = (id: string) => GUIDES.find((g) => g.subtypeId === id)!

async function openPoint1(page: Page) {
  await openWith(page, loggedIn())
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
  await home(page).getByTestId('pin-1').click()
  await expect(point(page)).toBeVisible()
}

test('PT-01 / PT-04 / PT-05: point 1 shows name, address, distance, grouped sub-type chips, hours, tel: phone, fictional label and both actions', async ({ page }) => {
  await openPoint1(page)
  await expect(point(page).getByRole('heading', { level: 1 })).toHaveText('Coleta Verde Savassi')
  await expect(point(page).getByTestId('pt-address')).toContainText('Rua das Acácias, 120 – Savassi')
  await expect(point(page).getByTestId('pt-distance')).toContainText('0,8 km')
  await expect(point(page).getByTestId('pt-group').getByRole('heading')).toHaveText([/Pilhas/, /Baterias/, /Celulares/, /Lâmpadas/, /Cabos e carregadores/])
  await expect(point(page).getByTestId('pt-group').nth(3).getByTestId('pt-subtype')).toHaveText([/Fluorescente/, /LED/])
  await expect(point(page).getByTestId('pt-subtype')).toHaveText([
    /Pilha comum\/alcalina/, /Bateria de lítio \(celular, notebook, power bank\)/, /Celular/, /Fluorescente/, /LED/, /Cabos e carregadores/,
  ])
  await expect(point(page).getByTestId('pt-hours').getByRole('listitem')).toHaveText(['Seg–Sex 8h–18h', 'Sáb 8h–12h'])
  const phone = point(page).getByRole('link', { name: '(31) 3000-0001' })
  await expect(phone).toHaveAttribute('href', 'tel:+553130000001')
  await expect(point(page).getByText('Ponto fictício (demonstração)')).toBeVisible()
  await expect(point(page).getByRole('button', { name: 'Como chegar' })).toBeVisible()
  await expect(point(page).getByRole('button', { name: 'Agendar entrega' })).toBeVisible()
})

test('PT-02: "Como levar" has one catalog preparation tip per accepted sub-type', async ({ page }) => {
  await openPoint1(page)
  await expect(point(page).getByRole('heading', { name: 'Como levar' })).toBeVisible()
  const tips = point(page).getByTestId('pt-tip')
  await expect(tips).toHaveCount(P1_SUBTYPES.length)
  for (const [i, id] of P1_SUBTYPES.entries()) await expect(tips.nth(i)).toContainText(guide(id).comoLevar)
})

test('PT-03: "Por que descartar aqui" names the reverse-logistics stream of each accepted sub-type', async ({ page }) => {
  await openPoint1(page)
  await expect(point(page).getByRole('heading', { name: /Por que descartar aqui/ })).toBeVisible()
  const streams = point(page).getByTestId('pt-streams')
  for (const id of P1_SUBTYPES) await expect(streams).toContainText(guide(id).stream)
})

test('PT-01 / PT-04: point 7 lists all 8 categories and its daily hours; phone link uses its number', async ({ page }) => {
  await openWith(page, loggedIn())
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
  await home(page).getByTestId('point-item').nth(6).click()
  await expect(point(page).getByRole('heading', { level: 1 })).toHaveText('Central de Coleta Pampulha')
  await expect(point(page).getByTestId('pt-group')).toHaveCount(8)
  await expect(point(page).getByTestId('pt-subtype')).toHaveCount(14)
  await expect(point(page).getByTestId('pt-hours').getByRole('listitem')).toHaveText(['Seg–Dom 8h–17h'])
  await expect(point(page).getByRole('link', { name: '(31) 3000-0007' })).toHaveAttribute('href', 'tel:+553130000007')
})

test('PT-06 / PT-07 / NAV-02: "Como chegar" shows a dashed route from the user dot to the point; "Fechar rota" and the back arrow return to the detail', async ({ page }) => {
  await openPoint1(page)
  await point(page).getByRole('button', { name: 'Como chegar' }).click()
  await expect(route(page)).toBeVisible()
  const path = route(page).getByTestId('route')
  await expect(path).toHaveAttribute('stroke-dasharray', /\d/)
  await expect(path).toHaveAttribute('d', /^M52 60 Q.* 55 63$/) // USER_LOCATION (52,60) → point 1 (55,63)
  await expect(route(page).getByTestId('user-dot')).toHaveCount(1)
  await expect(route(page).getByTestId('pin-1')).toHaveCount(1)
  await route(page).getByRole('button', { name: 'Fechar rota' }).click()
  await expect(point(page).getByRole('heading', { level: 1 })).toHaveText('Coleta Verde Savassi')
  await point(page).getByRole('button', { name: 'Como chegar' }).click()
  await route(page).getByRole('button', { name: 'Voltar' }).click()
  await expect(point(page)).toBeVisible()
})

test('PT-08: back from the point detail returns to the home map with its filters, search and closed tip unchanged', async ({ page }) => {
  await openWith(page, loggedIn())
  await home(page).getByTestId('mascot-tip').getByRole('button', { name: 'Fechar' }).click()
  await home(page).getByRole('group', { name: 'Filtrar por aparelho' }).getByRole('button', { name: 'Lâmpadas', exact: true }).click()
  await home(page).getByRole('searchbox', { name: 'Buscar pontos' }).fill('pampulha')
  await home(page).getByTestId('point-item').first().click()
  await expect(point(page).getByRole('heading', { level: 1 })).toHaveText('Central de Coleta Pampulha')
  await point(page).getByRole('button', { name: 'Voltar' }).click()
  await expect(home(page).getByRole('group', { name: 'Filtrar por aparelho' }).locator('[aria-pressed="true"]')).toHaveText([/Lâmpadas$/])
  await expect(home(page).getByRole('searchbox', { name: 'Buscar pontos' })).toHaveValue('pampulha')
  await expect(home(page).getByTestId('point-item').locator('.home-item-name')).toHaveText(['Central de Coleta Pampulha', 'Pampulha Lâmpadas & Pilhas'])
  await expect(home(page).getByTestId('mascot-tip')).toHaveCount(0)
})
