import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LEVEL_JUSTIFICATION } from '../data/catalog'
import { DangerScale, SCALE_NOTE } from './DangerScale'

afterEach(cleanup)

const filled = () => screen.getAllByTestId('danger-segment').map((s) => s.getAttribute('data-filled'))

describe('DangerScale (SCALE-01)', () => {
  it('level 4 fills 4 of 5 segments with 😨 "Muito alto"', () => {
    const j = LEVEL_JUSTIFICATION.celular
    render(<DangerScale level={4} label="Celulares" justification={j.text} sourceId={j.sourceId} />)
    expect(filled()).toEqual(['true', 'true', 'true', 'true', 'false'])
    expect(screen.getByTestId('danger-emoji').textContent).toBe('😨')
    expect(screen.getByTestId('danger-label').textContent).toBe('Muito alto')
  })

  it.each([
    [1, '🙂', 'Baixo'],
    [2, '😐', 'Moderado'],
    [3, '😟', 'Alto'],
    [5, '☠️', 'Crítico'],
  ] as const)('level %i shows %s "%s" and fills that many segments', (level, emoji, label) => {
    render(<DangerScale level={level} label="x" justification="j" />)
    expect(filled().filter((f) => f === 'true')).toHaveLength(level)
    expect(filled()).toHaveLength(5)
    expect(screen.getByTestId('danger-emoji').textContent).toBe(emoji)
    expect(screen.getByTestId('danger-label').textContent).toBe(label)
  })

  it('filled segments use the level color, empty ones do not', () => {
    render(<DangerScale level={2} label="x" justification="j" />)
    const segs = screen.getAllByTestId('danger-segment')
    expect(segs[0].style.background).toBe('var(--lvl-2)')
    expect(segs[1].style.background).toBe('var(--lvl-2)')
    expect(segs[2].style.background).toBe('')
  })
})

describe('DangerScale balloon (SCALE-03)', () => {
  it('tap shows the justification and the scale note, with Fonte', () => {
    const j = LEVEL_JUSTIFICATION.celular
    render(<DangerScale level={4} label="Celulares" justification={j.text} sourceId={j.sourceId} />)
    expect(screen.queryByText(j.text)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Celulares/ }))
    expect(screen.getByText(j.text)).toBeTruthy()
    expect(screen.getByText('Escala educativa recicla-E: toxicidade + risco de fogo')).toBeTruthy()
    expect(SCALE_NOTE).toBe('Escala educativa recicla-E: toxicidade + risco de fogo')
    expect(screen.getByTestId('fonte').textContent).toMatch(/^Fonte: /)
  })

  it('the balloon closes on ✕', () => {
    render(<DangerScale level={4} label="Celulares" justification="Bateria de lítio embutida" />)
    fireEvent.click(screen.getByRole('button', { name: /Celulares/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByText('Bateria de lítio embutida')).toBeNull()
  })
})
