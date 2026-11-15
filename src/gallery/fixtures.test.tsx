import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { FIXTURES, GALLERY_NOW } from './fixtures'

// Screen Inventory (spec.md): ids and names, verbatim.
const INVENTORY: [string, string][] = [
  ['S1', 'Entrar'],
  ['S2', 'Entrar com erros de validação'],
  ['S3', 'Cadastro'],
  ['S4', 'Apresentação: cartão de aparelho (com progresso)'],
  ['S5', 'Apresentação: resumo com aparelhos'],
  ['S6', 'Apresentação: resumo sem aparelhos'],
  ['S7', 'Mapa inicial, padrão, com balão de dica do mascote'],
  ['S8', 'Mapa inicial, filtrado por uma categoria'],
  ['S9', 'Mapa inicial, sem resultados'],
  ['S10', 'Detalhe do ponto'],
  ['S11', 'Detalhe do ponto com rota ("Como chegar")'],
  ['S12', 'Formulário de agendamento'],
  ['S13', 'Agendamento, dia sem horários'],
  ['S14', 'Celebração / impacto após agendar'],
  ['S15', 'Lista do Aprender'],
  ['S16', 'Página do aparelho (detalhe do Aprender)'],
  ['S17', 'Perfil, sem agendamentos'],
  ['S18', 'Perfil com agendamentos'],
]

const SCREEN_TESTID: Record<string, string> = {
  S1: 'screen-login', S2: 'screen-login', S3: 'screen-signup', S4: 'screen-onboarding',
  S7: 'screen-home', S8: 'screen-home', S9: 'screen-home',
  S10: 'screen-point', S11: 'screen-route', S12: 'screen-schedule', S13: 'screen-schedule',
  S14: 'screen-celebration', S15: 'screen-learn', S16: 'screen-device', S17: 'screen-profile', S18: 'screen-profile',
}

describe('gallery fixtures (GAL-01, GAL-02)', () => {
  it('has exactly the 18 inventory states, ids and names in order', () => {
    expect(FIXTURES.map((f) => [f.id, f.name])).toEqual(INVENTORY)
  })

  it('uses the fixed clock Monday 2026-11-16 10:00', () => {
    expect(GALLERY_NOW().getTime()).toBe(new Date(2026, 10, 16, 10, 0).getTime())
  })

  it.each(INVENTORY)('%s renders a real screen component', (id) => {
    const fixture = FIXTURES.find((f) => f.id === id)!
    const { container } = render(<>{fixture.render()}</>)
    expect(container.querySelector('section')).not.toBeNull()
    const testid = SCREEN_TESTID[id]
    if (testid) expect(container.querySelector(`[data-testid="${testid}"]`)).not.toBeNull()
  })
})
