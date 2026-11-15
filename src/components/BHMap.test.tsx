import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { POINTS, USER_LOCATION } from '../data/points'
import { BHMap } from './BHMap'

afterEach(cleanup)

const pinIds = () => screen.queryAllByTestId(/^pin-\d+$/).map((el) => Number(el.getAttribute('data-testid')!.slice(4)))
const byId = (...ids: number[]) => POINTS.filter((p) => ids.includes(p.id))

describe('BHMap (MAP-01, ONB-10)', () => {
  it('renders one pin per point and the user dot', () => {
    render(<BHMap points={POINTS} />)
    expect(pinIds().sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(screen.getAllByTestId('user-dot')).toHaveLength(1)
  })

  it('renders exactly the given pins and no others', () => {
    render(<BHMap points={byId(5, 7, 9, 10)} />)
    expect(pinIds().sort((a, b) => a - b)).toEqual([5, 7, 9, 10])
  })

  it('renders no pins for an empty list but still shows the user dot', () => {
    render(<BHMap points={[]} />)
    expect(pinIds()).toEqual([])
    expect(screen.getAllByTestId('user-dot')).toHaveLength(1)
  })

  it('mini variant renders the given pins and the user dot', () => {
    render(<BHMap mini points={byId(1)} />)
    expect(pinIds()).toEqual([1])
    expect(screen.getAllByTestId('user-dot')).toHaveLength(1)
  })

  it('pins are named after their point', () => {
    render(<BHMap points={byId(1)} />)
    expect(screen.getByRole('button', { name: /Coleta Verde Savassi/ })).toBeTruthy()
  })
})

describe('BHMap pin click (PT-01)', () => {
  it('clicking a pin calls back with its point id', () => {
    const onPinClick = vi.fn()
    render(<BHMap points={POINTS} onPinClick={onPinClick} />)
    fireEvent.click(screen.getByTestId('pin-7'))
    expect(onPinClick).toHaveBeenCalledTimes(1)
    expect(onPinClick).toHaveBeenCalledWith(7)
  })

  it('Enter on a focused pin also calls back with its id', () => {
    const onPinClick = vi.fn()
    render(<BHMap points={POINTS} onPinClick={onPinClick} />)
    fireEvent.keyDown(screen.getByTestId('pin-3'), { key: 'Enter' })
    expect(onPinClick).toHaveBeenCalledWith(3)
  })
})

describe('BHMap route (PT-06)', () => {
  it('has no route without routeTo', () => {
    render(<BHMap points={POINTS} />)
    expect(screen.queryByTestId('route')).toBeNull()
  })

  it('draws a dashed route from the user dot to the routeTo point', () => {
    render(<BHMap points={byId(4)} routeTo={4} />)
    const route = screen.getByTestId('route')
    expect(route.getAttribute('stroke-dasharray')).toBeTruthy()
    const d = route.getAttribute('d')!
    const p4 = POINTS.find((p) => p.id === 4)!
    expect(d.startsWith(`M${USER_LOCATION.map.x} ${USER_LOCATION.map.y}`)).toBe(true)
    expect(d.endsWith(`${p4.map.x} ${p4.map.y}`)).toBe(true)
  })
})
