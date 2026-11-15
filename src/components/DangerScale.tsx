import { useRef, useState } from 'react'
import type { Level } from '../data/categories'
import { Balloon, FonteNote } from './ui'
import './DangerScale.css'

export const DANGER_LEVELS: Record<Level, { emoji: string; label: string }> = {
  1: { emoji: '🙂', label: 'Baixo' },
  2: { emoji: '😐', label: 'Moderado' },
  3: { emoji: '😟', label: 'Alto' },
  4: { emoji: '😨', label: 'Muito alto' },
  5: { emoji: '☠️', label: 'Crítico' },
}

export const SCALE_NOTE = 'Escala educativa recicla-E: toxicidade + risco de fogo'

/** 5-segment emoji danger scale (SCALE-01); tap opens the justification balloon (SCALE-03). */
export function DangerScale({ level, label, justification, sourceId, compact }: {
  level: Level
  /** Item name, used in the accessible name. */
  label: string
  justification: string
  sourceId?: string
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const { emoji, label: levelLabel } = DANGER_LEVELS[level]
  return (
    <div className={`danger${compact ? ' danger-compact' : ''}`} ref={wrap}>
      <button
        type="button"
        className="danger-btn"
        aria-label={`Perigo de ${label}: nível ${level} de 5, ${levelLabel}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="danger-emoji" data-testid="danger-emoji">{emoji}</span>
        <span className="danger-bar">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="danger-seg"
              data-testid="danger-segment"
              data-filled={i <= level}
              style={i <= level ? { background: `var(--lvl-${level})` } : undefined}
            />
          ))}
        </span>
        <span className={`danger-label danger-label-${level}`} data-testid="danger-label">{levelLabel}</span>
      </button>
      {open ? (
        <Balloon className="danger-balloon" tail="top" boundaryRef={wrap} onClose={() => setOpen(false)}>
          <p className="danger-just">{justification}</p>
          <p className="danger-note">{SCALE_NOTE}</p>
          {sourceId ? <FonteNote sourceId={sourceId} /> : null}
        </Balloon>
      ) : null}
    </div>
  )
}
