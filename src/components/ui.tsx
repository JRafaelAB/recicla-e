import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode, type RefObject } from 'react'
import { SOURCES } from '../data/catalog'
import './theme.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'blue'

/** Chunky 3D button: darker bottom border that compresses on press. */
export function Button({ variant = 'primary', block, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; block?: boolean }) {
  const cls = ['btn', `btn-${variant}`, block ? 'btn-block' : '', className ?? ''].filter(Boolean).join(' ')
  return <button type="button" className={cls} {...rest} />
}

export function Chip({ selected, emoji, children, onClick }: { selected: boolean; emoji?: string; children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={`chip${selected ? ' chip-on' : ''}`} aria-pressed={selected} onClick={onClick}>
      {emoji ? <span aria-hidden="true">{emoji}</span> : null}
      {children}
    </button>
  )
}

/** Integer quantity stepper (SCH-02): bounded min..max, ends disabled. */
export function Stepper({ label, value, onChange, min = 0, max = 20 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="stepper-btn" aria-label={`Diminuir ${label}`} disabled={value <= min} onClick={() => value > min && onChange(value - 1)}>−</button>
      <output className="stepper-value" data-testid="stepper-value" aria-live="polite">{value}</output>
      <button type="button" className="stepper-btn" aria-label={`Aumentar ${label}`} disabled={value >= max} onClick={() => value < max && onChange(value + 1)}>+</button>
    </div>
  )
}

/**
 * Speech balloon. Closes on ✕ and, unless dismissOnOutside is false, on a tap outside it
 * (or outside `boundaryRef`, when given, so the trigger that opened it doesn't count as outside).
 */
export function Balloon({ children, onClose, dismissOnOutside = true, boundaryRef, tail = 'none', className }: {
  children: ReactNode
  onClose: () => void
  dismissOnOutside?: boolean
  boundaryRef?: RefObject<HTMLElement | null>
  tail?: 'none' | 'left' | 'top' | 'bottom'
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!dismissOnOutside) return
    const onDown = (e: Event) => {
      const inside = (boundaryRef?.current ?? ref.current)?.contains(e.target as Node)
      if (!inside) closeRef.current()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [dismissOnOutside, boundaryRef])

  return (
    <div ref={ref} role="dialog" className={`balloon balloon-tail-${tail}${className ? ` ${className}` : ''}`}>
      <div className="balloon-body">{children}</div>
      <button type="button" className="balloon-close" aria-label="Fechar" onClick={onClose}>✕</button>
    </div>
  )
}

/** ⓘ next to a heading: opens a Balloon with a related catalog fact (TIP-03), closed by an outside tap (TIP-04). */
export function InfoIcon({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  return (
    <span className="info" ref={wrap}>
      <button type="button" className="info-btn" aria-label={`Saiba mais: ${label}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>ⓘ</button>
      {open ? <Balloon className="info-balloon" tail="top" boundaryRef={wrap} onClose={() => setOpen(false)}>{children}</Balloon> : null}
    </span>
  )
}

export function FonteNote({ sourceId }: { sourceId: string }) {
  const src = SOURCES.find((s) => s.id === sourceId)
  if (!src) return null
  return (
    <small className="fonte" data-testid="fonte">
      Fonte: <a href={src.url} target="_blank" rel="noreferrer">{src.name}</a>
    </small>
  )
}

export function FictionalBadge({ plural }: { plural?: boolean }) {
  return <span className="fictional-badge">{plural ? 'Pontos fictícios (demonstração)' : 'Ponto fictício (demonstração)'}</span>
}

export type TabId = 'home' | 'learn' | 'profile'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Mapa', icon: '🗺️' },
  { id: 'learn', label: 'Aprender', icon: '📚' },
  { id: 'profile', label: 'Perfil', icon: '👤' },
]

export function TabBar({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      {TABS.map((t) => (
        <button key={t.id} type="button" className={`tab${t.id === active ? ' tab-on' : ''}`} aria-current={t.id === active ? 'page' : undefined} onClick={() => onSelect(t.id)}>
          <span className="tab-icon" aria-hidden="true">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

export type MascotPose = 'idle' | 'talking' | 'celebrating'

/** "Reci", an original friendly battery character (inline SVG). */
export function Mascot({ pose = 'idle', size = 96 }: { pose?: MascotPose; size?: number }) {
  const armsUp = pose === 'celebrating'
  return (
    <svg className={`mascot mascot-${pose}`} data-pose={pose} width={size} height={size * 1.2} viewBox="0 0 100 120" role="img" aria-label="Reci, o mascote">
      {/* shadow */}
      <ellipse cx="50" cy="114" rx="26" ry="4" fill="#000" opacity="0.12" />
      {/* arms */}
      {armsUp ? (
        <>
          <path d="M22 62 Q8 48 12 30" stroke="#3E9A00" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M78 62 Q92 48 88 30" stroke="#3E9A00" strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="28" r="6" fill="#FFD43B" />
          <circle cx="88" cy="28" r="6" fill="#FFD43B" />
        </>
      ) : (
        <>
          <path d="M22 66 Q10 74 14 86" stroke="#3E9A00" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d={pose === 'talking' ? 'M78 66 Q92 58 92 46' : 'M78 66 Q90 74 86 86'} stroke="#3E9A00" strokeWidth="7" strokeLinecap="round" fill="none" />
        </>
      )}
      {/* legs */}
      <rect x="35" y="100" width="9" height="12" rx="4" fill="#3E9A00" />
      <rect x="56" y="100" width="9" height="12" rx="4" fill="#3E9A00" />
      {/* terminal cap */}
      <rect x="40" y="14" width="20" height="10" rx="4" fill="#FFC800" stroke="#E5A800" strokeWidth="2" />
      {/* body */}
      <rect x="20" y="22" width="60" height="82" rx="18" fill="#58CC02" stroke="#46A302" strokeWidth="3" />
      <rect x="26" y="28" width="14" height="40" rx="7" fill="#fff" opacity="0.25" />
      {/* charge band */}
      <rect x="20" y="78" width="60" height="10" fill="#46A302" opacity="0.5" />
      <path d="M52 80 L46 86 L51 86 L47 92 L56 84 L51 84 Z" fill="#FFC800" />
      {/* face */}
      {armsUp ? (
        <>
          <path d="M34 48 Q39 42 44 48" stroke="#1F3A0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M56 48 Q61 42 66 48" stroke="#1F3A0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="39" cy="47" rx="5" ry="6.5" fill="#fff" />
          <ellipse cx="61" cy="47" rx="5" ry="6.5" fill="#fff" />
          <circle cx="40" cy="48" r="3" fill="#1F3A0B" />
          <circle cx="62" cy="48" r="3" fill="#1F3A0B" />
          <circle cx="41" cy="46.5" r="1" fill="#fff" />
          <circle cx="63" cy="46.5" r="1" fill="#fff" />
        </>
      )}
      <circle cx="31" cy="58" r="4" fill="#FF86C8" opacity="0.6" />
      <circle cx="69" cy="58" r="4" fill="#FF86C8" opacity="0.6" />
      {pose === 'talking' ? (
        <ellipse cx="50" cy="61" rx="6" ry="5" fill="#1F3A0B" />
      ) : pose === 'celebrating' ? (
        <path d="M38 56 Q50 72 62 56 Z" fill="#1F3A0B" />
      ) : (
        <path d="M42 58 Q50 65 58 58" stroke="#1F3A0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      )}
    </svg>
  )
}

const CONFETTI_COLORS = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#CE82FF', '#FF9600']

/** CSS-only confetti burst. */
export function Confetti({ pieces = 28 }: { pieces?: number }) {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: pieces }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${(i * 37) % 100}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i % 7) * 0.12}s`,
            animationDuration: `${1.6 + (i % 5) * 0.25}s`,
            transform: `rotate(${(i * 47) % 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}
