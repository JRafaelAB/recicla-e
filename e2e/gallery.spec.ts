import { test, expect, distUrl } from './fixtures'

const CAPTIONS = [
  'S1 — Entrar',
  'S2 — Entrar com erros de validação',
  'S3 — Cadastro',
  'S4 — Apresentação: cartão de aparelho (com progresso)',
  'S5 — Apresentação: resumo com aparelhos',
  'S6 — Apresentação: resumo sem aparelhos',
  'S7 — Mapa inicial, padrão, com balão de dica do mascote',
  'S8 — Mapa inicial, filtrado por uma categoria',
  'S9 — Mapa inicial, sem resultados',
  'S10 — Detalhe do ponto',
  'S11 — Detalhe do ponto com rota ("Como chegar")',
  'S12 — Formulário de agendamento',
  'S13 — Agendamento, dia sem horários',
  'S14 — Celebração / impacto após agendar',
  'S15 — Lista do Aprender',
  'S16 — Página do aparelho (detalhe do Aprender)',
  'S17 — Perfil, sem agendamentos',
  'S18 — Perfil com agendamentos',
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
