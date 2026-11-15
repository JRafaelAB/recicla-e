import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { FIXTURES, GALLERY_NOW } from './fixtures'

// Screen Inventory (spec.md): ids and names, verbatim.
const INVENTORY: [string, string][] = [
  ['S1', 'Login'],
  ['S2', 'Login with validation errors'],
  ['S3', 'Cadastro (sign-up)'],
  ['S4', 'Onboarding card (with progress)'],
  ['S5', 'Onboarding summary with devices'],
  ['S6', 'Onboarding summary, no devices'],
  ['S7', 'Home map, default, with mascot tip balloon'],
  ['S8', 'Home map, filtered by a category'],
  ['S9', 'Home map, no results'],
  ['S10', 'Point detail'],
  ['S11', 'Point detail with route ("Como chegar")'],
  ['S12', 'Scheduling form'],
  ['S13', 'Scheduling, day with no slots'],
  ['S14', 'Celebration / impact after booking'],
  ['S15', 'Aprender list'],
  ['S16', 'Device page (Aprender detail)'],
  ['S17', 'Perfil, no bookings'],
  ['S18', 'Perfil with bookings'],
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
