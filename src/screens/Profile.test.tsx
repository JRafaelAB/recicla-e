import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ProfileScreen } from './Profile'

const noop = () => {}
const bookingItems = (qty: number) => {
  const view = render(
    <ProfileScreen
      name="Ana"
      bookings={[{ id: 'b', pointId: 1, items: [{ subtypeId: 'celular', qty }], date: '2026-11-17', slot: '09:00' }]}
      onOpenMap={noop}
      onLogout={noop}
      onReset={noop}
    />,
  )
  const text = view.getByTestId('profile-booking').textContent
  view.unmount()
  return text
}

describe('PROF-01 booking item phrase', () => {
  it('uses the sub-type plural noun for several items', () => {
    expect(bookingItems(2)).toContain('2 celulares')
  })
  it('uses the singular noun for one item', () => {
    expect(bookingItems(1)).toMatch(/1 celular(?!es)/)
  })
})
