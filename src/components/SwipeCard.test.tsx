import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EXIT_MS, SwipeCard } from './SwipeCard'

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const card = () => screen.getByTestId('swipe-card')

function drag(dx: number) {
  fireEvent.pointerDown(card(), { clientX: 200, pointerId: 1 })
  fireEvent.pointerMove(card(), { clientX: 200 + dx / 2, pointerId: 1 })
  fireEvent.pointerMove(card(), { clientX: 200 + dx, pointerId: 1 })
  fireEvent.pointerUp(card(), { clientX: 200 + dx, pointerId: 1 })
}

const finishExit = () => act(() => vi.advanceTimersByTime(EXIT_MS))

describe('SwipeCard drag (ONB-04, ONB-05)', () => {
  it('drag right past 100 px answers "tenho"', () => {
    const onAnswer = vi.fn()
    render(<SwipeCard onAnswer={onAnswer}>Celulares</SwipeCard>)
    drag(140)
    finishExit()
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith('tenho')
  })

  it('drag left past 100 px answers "nao"', () => {
    const onAnswer = vi.fn()
    render(<SwipeCard onAnswer={onAnswer}>Celulares</SwipeCard>)
    drag(-140)
    finishExit()
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith('nao')
  })

  it('a drag below the threshold snaps back with no answer', () => {
    const onAnswer = vi.fn()
    render(<SwipeCard onAnswer={onAnswer}>Celulares</SwipeCard>)
    drag(80)
    finishExit()
    expect(onAnswer).not.toHaveBeenCalled()
    expect(card().style.transform).toBe('translateX(0px) rotate(0deg)')
    drag(-99)
    finishExit()
    expect(onAnswer).not.toHaveBeenCalled()
    expect(card().style.transform).toBe('translateX(0px) rotate(0deg)')
  })

  it('the card follows the pointer while dragging', () => {
    render(<SwipeCard onAnswer={() => {}}>Celulares</SwipeCard>)
    fireEvent.pointerDown(card(), { clientX: 200, pointerId: 1 })
    fireEvent.pointerMove(card(), { clientX: 260, pointerId: 1 })
    expect(card().style.transform).toBe('translateX(60px) rotate(3deg)')
  })
})

describe('SwipeCard buttons (ONB-04, ONB-05)', () => {
  it('✅ answers "tenho" and ✕ answers "nao"', () => {
    const onAnswer = vi.fn()
    const { rerender } = render(<SwipeCard key="a" onAnswer={onAnswer}>A</SwipeCard>)
    fireEvent.click(screen.getByRole('button', { name: /Tenho/ }))
    finishExit()
    rerender(<SwipeCard key="b" onAnswer={onAnswer}>B</SwipeCard>)
    fireEvent.click(screen.getByRole('button', { name: /Não tenho/ }))
    finishExit()
    expect(onAnswer.mock.calls).toEqual([['tenho'], ['nao']])
  })

  it('answers only after the exit animation', () => {
    const onAnswer = vi.fn()
    render(<SwipeCard onAnswer={onAnswer}>A</SwipeCard>)
    fireEvent.click(screen.getByRole('button', { name: /Tenho/ }))
    expect(onAnswer).not.toHaveBeenCalled()
    expect(card().getAttribute('data-exiting')).toBe('tenho')
    finishExit()
    expect(onAnswer).toHaveBeenCalledWith('tenho')
  })
})

describe('SwipeCard lock (ONB-07)', () => {
  it('a second answer during the exit animation is ignored', () => {
    const onAnswer = vi.fn()
    render(<SwipeCard onAnswer={onAnswer}>A</SwipeCard>)
    fireEvent.click(screen.getByRole('button', { name: /Tenho/ }))
    fireEvent.click(screen.getByRole('button', { name: /Não tenho/ }))
    drag(-150)
    fireEvent.click(screen.getByRole('button', { name: /Tenho/ }))
    finishExit()
    act(() => vi.advanceTimersByTime(EXIT_MS * 3))
    expect(onAnswer.mock.calls).toEqual([['tenho']])
  })

  it('a swipe followed by a button tap during the animation answers once', () => {
    const onAnswer = vi.fn()
    render(<SwipeCard onAnswer={onAnswer}>A</SwipeCard>)
    drag(-150)
    fireEvent.click(screen.getByRole('button', { name: /Tenho/ }))
    finishExit()
    expect(onAnswer.mock.calls).toEqual([['nao']])
  })

  it('buttons are disabled while the card exits', () => {
    render(<SwipeCard onAnswer={() => {}}>A</SwipeCard>)
    fireEvent.click(screen.getByRole('button', { name: /Tenho/ }))
    expect(screen.getByRole('button', { name: /Não tenho/ }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: /^✅/ }).hasAttribute('disabled')).toBe(true)
  })
})
