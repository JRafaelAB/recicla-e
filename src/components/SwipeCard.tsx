import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import './SwipeCard.css'

export type SwipeAnswer = 'tenho' | 'nao'

export const SWIPE_THRESHOLD = 100
export const EXIT_MS = 280

/**
 * Onboarding card: drag right (✅ "tenho") or left (✕ "não tenho") past ±100 px, or tap a button.
 * The card animates out and only then calls onAnswer; it ignores any input meanwhile (ONB-07).
 */
export function SwipeCard({ children, onAnswer }: { children: ReactNode; onAnswer: (a: SwipeAnswer) => void }) {
  const [dx, setDx] = useState(0)
  const [exiting, setExiting] = useState<SwipeAnswer | null>(null)
  const [dragging, setDragging] = useState(false)
  const locked = useRef(false)
  const start = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function answer(a: SwipeAnswer) {
    if (locked.current) return
    locked.current = true
    setExiting(a)
    timer.current = setTimeout(() => {
      onAnswer(a)
      locked.current = false
      start.current = null
      setDx(0)
      setExiting(null)
    }, EXIT_MS)
  }

  function onDown(e: PointerEvent<HTMLDivElement>) {
    if (locked.current) return
    start.current = e.clientX
    setDragging(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (start.current === null || locked.current) return
    setDx(e.clientX - start.current)
  }

  function onUp(e: PointerEvent<HTMLDivElement>) {
    if (start.current === null || locked.current) return
    const moved = e.clientX - start.current
    start.current = null
    setDragging(false)
    if (moved > SWIPE_THRESHOLD) answer('tenho')
    else if (moved < -SWIPE_THRESHOLD) answer('nao')
    else setDx(0)
  }

  const transform = exiting
    ? `translateX(${exiting === 'tenho' ? 520 : -520}px) rotate(${exiting === 'tenho' ? 24 : -24}deg)`
    : `translateX(${dx}px) rotate(${Math.round(dx / 20)}deg)`
  const lean = exiting ?? (dx > 20 ? 'tenho' : dx < -20 ? 'nao' : null)
  const stampOpacity = exiting ? 1 : Math.min(Math.abs(dx) / SWIPE_THRESHOLD, 1)

  return (
    <div className="swipe">
      <div
        className={`swipe-card${dragging ? ' swipe-dragging' : ''}`}
        data-testid="swipe-card"
        data-exiting={exiting ?? undefined}
        style={{ transform, transitionDuration: dragging ? '0ms' : `${EXIT_MS}ms` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => { start.current = null; setDragging(false); if (!locked.current) setDx(0) }}
      >
        {lean ? (
          <span className={`swipe-stamp swipe-stamp-${lean}`} style={{ opacity: stampOpacity }} aria-hidden="true">
            {lean === 'tenho' ? 'TENHO' : 'NÃO TENHO'}
          </span>
        ) : null}
        {children}
      </div>
      <div className="swipe-actions">
        <button type="button" className="swipe-btn swipe-btn-nao" disabled={exiting !== null} onClick={() => answer('nao')}>
          ✕ Não tenho
        </button>
        <button type="button" className="swipe-btn swipe-btn-tenho" disabled={exiting !== null} onClick={() => answer('tenho')}>
          ✅ Tenho
        </button>
      </div>
    </div>
  )
}
