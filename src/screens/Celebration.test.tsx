import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { CelebrationScreen } from './Schedule'

const summary = (qty: number) => {
  const view = render(
    <CelebrationScreen booking={{ id: 'b', pointId: 1, items: [{ subtypeId: 'celular', qty }], date: '2026-11-17', slot: '09:00' }} onBackToMap={() => {}} />,
  )
  const text = view.getByTestId('cel-summary').textContent
  view.unmount()
  return text
}

describe('celebration summary item phrase', () => {
  it('uses the sub-type plural noun for several items', () => {
    expect(summary(2)).toContain('2 celulares')
  })
  it('uses the singular noun for one item', () => {
    expect(summary(1)).toMatch(/1 celular(?!es)/)
  })
})
