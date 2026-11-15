import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Balloon, FictionalBadge, FonteNote, InfoIcon, Stepper, TabBar } from './ui'

afterEach(cleanup)

function ControlledStepper({ start, onChange }: { start: number; onChange?: (n: number) => void }) {
  const [v, setV] = useState(start)
  return <Stepper label="Celular" value={v} onChange={(n) => { setV(n); onChange?.(n) }} />
}

describe('Stepper (SCH-02)', () => {
  it('starts at 0 with "−" disabled and "+" enabled', () => {
    render(<ControlledStepper start={0} />)
    expect(screen.getByRole('button', { name: 'Diminuir Celular' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('button', { name: 'Aumentar Celular' }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByTestId('stepper-value').textContent).toBe('0')
  })

  it('"+" and "−" change the value by one integer', () => {
    const onChange = vi.fn()
    render(<ControlledStepper start={0} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar Celular' }))
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar Celular' }))
    expect(screen.getByTestId('stepper-value').textContent).toBe('2')
    fireEvent.click(screen.getByRole('button', { name: 'Diminuir Celular' }))
    expect(screen.getByTestId('stepper-value').textContent).toBe('1')
    expect(onChange.mock.calls.map((c) => c[0])).toEqual([1, 2, 1])
  })

  it('disables "+" at 20 and never goes above 20', () => {
    const onChange = vi.fn()
    render(<ControlledStepper start={19} onChange={onChange} />)
    const plus = screen.getByRole('button', { name: 'Aumentar Celular' })
    fireEvent.click(plus)
    expect(screen.getByTestId('stepper-value').textContent).toBe('20')
    expect(plus.hasAttribute('disabled')).toBe(true)
    fireEvent.click(plus)
    expect(screen.getByTestId('stepper-value').textContent).toBe('20')
    expect(onChange.mock.calls.map((c) => c[0])).toEqual([20])
    expect(screen.getByRole('button', { name: 'Diminuir Celular' }).hasAttribute('disabled')).toBe(false)
  })

  it('never goes below 0', () => {
    const onChange = vi.fn()
    render(<ControlledStepper start={0} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Diminuir Celular' }))
    expect(screen.getByTestId('stepper-value').textContent).toBe('0')
    expect(onChange).not.toHaveBeenCalled()
  })
})

function BalloonHarness() {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <p>fora</p>
      {open ? <Balloon onClose={() => setOpen(false)}>Dica do Reci</Balloon> : null}
    </div>
  )
}

describe('Balloon (TIP-02, TIP-04)', () => {
  it('closes when ✕ is tapped', () => {
    render(<BalloonHarness />)
    expect(screen.getByText('Dica do Reci')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByText('Dica do Reci')).toBeNull()
  })

  it('closes on a tap outside it', () => {
    render(<BalloonHarness />)
    fireEvent.pointerDown(screen.getByText('fora'))
    expect(screen.queryByText('Dica do Reci')).toBeNull()
  })

  it('stays open on a tap inside it', () => {
    render(<BalloonHarness />)
    fireEvent.pointerDown(screen.getByText('Dica do Reci'))
    expect(screen.getByText('Dica do Reci')).toBeTruthy()
  })

  it('ignores outside taps when dismissOnOutside is false', () => {
    const onClose = vi.fn()
    render(<div><p>fora</p><Balloon onClose={onClose} dismissOnOutside={false}>x</Balloon></div>)
    fireEvent.pointerDown(screen.getByText('fora'))
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('InfoIcon (TIP-03, TIP-04)', () => {
  it('tapping ⓘ shows the related fact; an outside tap closes it', () => {
    render(<div><p>fora</p><InfoIcon label="Pilhas">Pilhas vazam líquido corrosivo.</InfoIcon></div>)
    expect(screen.queryByText('Pilhas vazam líquido corrosivo.')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Saiba mais: Pilhas' }))
    expect(screen.getByText('Pilhas vazam líquido corrosivo.')).toBeTruthy()
    fireEvent.pointerDown(screen.getByText('fora'))
    expect(screen.queryByText('Pilhas vazam líquido corrosivo.')).toBeNull()
  })
})

describe('TabBar (NAV-01)', () => {
  it('shows Mapa, Aprender and Perfil and marks the active tab', () => {
    render(<TabBar active="learn" onSelect={() => {}} />)
    const tabs = screen.getAllByRole('button')
    expect(tabs.map((t) => t.textContent?.replace(/\P{L}/gu, ''))).toEqual(['Mapa', 'Aprender', 'Perfil'])
    expect(screen.getByRole('button', { name: /Aprender/ }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('button', { name: /Mapa/ }).getAttribute('aria-current')).toBeNull()
    expect(screen.getByRole('button', { name: /Perfil/ }).getAttribute('aria-current')).toBeNull()
  })

  it('calls onSelect with the tapped tab', () => {
    const onSelect = vi.fn()
    render(<TabBar active="home" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /Perfil/ }))
    expect(onSelect).toHaveBeenCalledWith('profile')
  })
})

describe('FictionalBadge (PT-05, MAP-01)', () => {
  it('reads "Ponto fictício (demonstração)"', () => {
    render(<FictionalBadge />)
    expect(screen.getByText('Ponto fictício (demonstração)')).toBeTruthy()
  })
  it('plural reads "Pontos fictícios (demonstração)"', () => {
    render(<FictionalBadge plural />)
    expect(screen.getByText('Pontos fictícios (demonstração)')).toBeTruthy()
  })
})

describe('FonteNote (SCH-09, INFO-05)', () => {
  it('shows "Fonte:" with the catalog source name', () => {
    render(<FonteNote sourceId="pnrs" />)
    expect(screen.getByTestId('fonte').textContent).toBe('Fonte: Lei 12.305/2010 (Política Nacional de Resíduos Sólidos)')
  })
})
