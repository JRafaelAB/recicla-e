import type { KeyboardEvent } from 'react'
import { CATEGORIES, type CategoryId } from '../data/categories'
import { POINTS, USER_LOCATION, type Point } from '../data/points'
import { pointAcceptsCategory } from '../logic/filter'
import './BHMap.css'

/** Pin color per category; "Todos" pins use the recycle green. */
export const CATEGORY_COLORS: Record<CategoryId, string> = {
  pilhas: '#FF9600',
  baterias: '#B4237A',
  celulares: '#1CB0F6',
  computadores: '#7A5AF8',
  linhabranca: '#2EC4B6',
  tvs: '#FF4B4B',
  lampadas: '#FFC800',
  cabos: '#8B6B4A',
}

const DEFAULT_PIN = { emoji: '♻️', color: '#58CC02' }

function pinStyle(p: Point, highlight: CategoryId[]) {
  const cat = CATEGORIES.find((c) => highlight.includes(c.id) && pointAcceptsCategory(p, c.id))
  return cat ? { emoji: cat.emoji, color: CATEGORY_COLORS[cat.id] } : DEFAULT_PIN
}

// One label per neighborhood (Pampulha has two points). Default: under the pin; some are moved so pins don't cover them.
const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  Centro: { dx: 0, dy: -10.2, anchor: 'middle' },
  'Santa Efigênia': { dx: 3.8, dy: -4.6, anchor: 'start' },
  'Venda Nova': { dx: 3.8, dy: -5.4, anchor: 'start' },
}
const NEIGHBORHOOD_LABELS = POINTS.filter((p, i) => POINTS.findIndex((q) => q.neighborhood === p.neighborhood) === i).map((p) => {
  const o = LABEL_OFFSET[p.neighborhood] ?? { dx: 0, dy: 3.4, anchor: 'middle' as const }
  return { text: p.neighborhood, x: p.map.x + o.dx, y: p.map.y + o.dy, anchor: o.anchor }
})

const FULL_VIEW = '0 -8 100 106'

// Pin geometry in map units: the head reaches 9.4 above the point, 3.2 to each side.
const PIN_TOP = 9.4
const PIN_HALF = 3.2
const MINI_PAD = 5
const MINI_MIN_W = 36
/** Aspect ratio (width / height) the mini map is framed for. */
export const MINI_ASPECT = 2

/**
 * Mini variant: fit the bounds of the pins (whole pin heads) and the user dot, plus padding,
 * then widen the shorter side to MINI_ASPECT around the same center.
 */
export function miniView(points: Point[]): string {
  const xs = [USER_LOCATION.map.x, ...points.map((p) => p.map.x)]
  const ys = [USER_LOCATION.map.y, ...points.map((p) => p.map.y)]
  const minX = Math.min(...xs) - PIN_HALF - MINI_PAD
  const maxX = Math.max(...xs) + PIN_HALF + MINI_PAD
  const minY = Math.min(...(points.length ? points.map((p) => p.map.y - PIN_TOP) : []), USER_LOCATION.map.y) - MINI_PAD
  const maxY = Math.max(...ys) + MINI_PAD
  let w = Math.max(maxX - minX, MINI_MIN_W)
  let h = maxY - minY
  if (w / h < MINI_ASPECT) w = h * MINI_ASPECT
  else h = w / MINI_ASPECT
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return [cx - w / 2, cy - h / 2, w, h].map((n) => n.toFixed(1)).join(' ')
}

const PIN_PATH = 'M0 0 C-1 -2.2 -3.2 -3.6 -3.2 -6.2 A3.2 3.2 0 1 1 3.2 -6.2 C3.2 -3.6 1 -2.2 0 0 Z'

/** Dashed route: a gentle curve from the user dot to the point. */
function routePath(to: { x: number; y: number }): string {
  const from = USER_LOCATION.map
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  const cx = +(mx - dy * 0.25).toFixed(2)
  const cy = +(my + dx * 0.25).toFixed(2)
  return `M${from.x} ${from.y} Q${cx} ${cy} ${to.x} ${to.y}`
}

/**
 * Illustrated, stylized Belo Horizonte (not a real map): Lagoa da Pampulha north,
 * Serra do Curral south, main avenues, the user dot in Funcionários and one pin per point.
 */
export function BHMap({ points, onPinClick, routeTo, mini, highlight = [], selectedId }: {
  points: Point[]
  onPinClick?: (id: number) => void
  /** Point id; draws the dashed route (PT-06). */
  routeTo?: number
  mini?: boolean
  /** Selected categories: pins show the first one the point accepts. */
  highlight?: CategoryId[]
  selectedId?: number
}) {
  const target = routeTo === undefined ? undefined : POINTS.find((p) => p.id === routeTo)
  const onKey = (id: number) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPinClick?.(id)
    }
  }

  return (
    <svg
      className={`bhmap${mini ? ' bhmap-mini' : ''}`}
      viewBox={mini ? miniView(points) : FULL_VIEW}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa ilustrado de Belo Horizonte"
      data-testid="bhmap"
    >
      <defs>
        <pattern id="bh-dots" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.35" fill="#d6ebbd" />
        </pattern>
      </defs>

      {/* land */}
      <rect x="0" y="-8" width="100" height="106" fill="#eef8e1" />
      <rect x="0" y="-8" width="100" height="106" fill="url(#bh-dots)" />

      {/* city blocks: soft districts */}
      <path d="M8 40 Q20 30 34 34 Q40 44 36 58 Q26 66 12 62 Q4 52 8 40 Z" fill="#e4f2d2" />
      <path d="M62 24 Q76 18 88 28 Q92 42 82 50 Q70 50 64 42 Q60 32 62 24 Z" fill="#e4f2d2" />
      <path d="M40 -4 Q56 -8 64 2 Q64 12 54 14 Q44 12 40 -4 Z" fill="#e4f2d2" />

      {/* Serra do Curral ridge (south) */}
      <path d="M33 98 L33 88 Q38 82 43 85 Q48 77 54 81 Q59 74 65 79 Q71 72 77 78 Q83 73 88 79 Q94 75 100 80 L100 98 Z" fill="#a8d38a" />
      <path d="M33 88 Q38 82 43 85 Q48 77 54 81 Q59 74 65 79 Q71 72 77 78 Q83 73 88 79 Q94 75 100 80" fill="none" stroke="#7fb75e" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M48 98 Q52 88 60 86 Q70 84 78 88 Q88 86 100 90 L100 98 Z" fill="#93c574" />

      {/* parks */}
      <ellipse cx="51.5" cy="56" rx="2.4" ry="1.6" fill="#b9e29a" />
      <ellipse cx="64" cy="71" rx="4" ry="2.4" fill="#b9e29a" />

      {/* Lagoa da Pampulha (north) */}
      <path d="M22 12 Q23 7 29 8.5 Q33 6.5 37 9 Q42 9.5 41 13.5 Q41.5 17.5 36 17 Q31 19 27 16.5 Q21 16.5 22 12 Z" fill="#8fd8f8" stroke="#5bc0eb" strokeWidth="0.6" />
      <path d="M26 12 Q30 10.5 34 12" fill="none" stroke="#c9eefc" strokeWidth="0.5" strokeLinecap="round" />

      {/* main avenues: casing + fill */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="#f2c94c" strokeWidth="2.2">
          <path id="av-afonso-pena" d="M41 42 L66 76" />
          <path id="av-antonio-carlos" d="M47 46 Q42 34 40 26 Q38 20 36 17" />
          <path id="av-cristiano-machado" d="M56 47 Q66 40 67 32 Q66 20 52 8" />
          <path id="av-amazonas" d="M43 56 Q32 64 26 72 Q20 80 15 86" />
          <path id="av-contorno" d="M40 50 Q44 44.5 50 45 Q57 45 59.5 50 Q61 56 58.5 62 Q55 67.5 49 67 Q42.5 66.5 40.5 61 Q38.5 55 40 50 Z" />
        </g>
        <g stroke="#ffe48a" strokeWidth="1.2">
          <use href="#av-afonso-pena" />
          <use href="#av-antonio-carlos" />
          <use href="#av-cristiano-machado" />
          <use href="#av-amazonas" />
          <use href="#av-contorno" />
        </g>
      </g>

      {!mini ? (
        <g className="bhmap-labels">
          <text x="31" y="3.5" className="bhmap-water">Lagoa da Pampulha</text>
          <text x="80" y="93.5" className="bhmap-mountain">Serra do Curral</text>
          <text className="bhmap-road" transform="translate(67.5 73) rotate(54)">Av. Afonso Pena</text>
          <text className="bhmap-road" transform="translate(36.6 56) rotate(-82)">Av. do Contorno</text>
          <text className="bhmap-road" transform="translate(42.2 37) rotate(-70)">Av. Antônio Carlos</text>
          <text className="bhmap-road" transform="translate(69.5 30) rotate(-80)">Av. Cristiano Machado</text>
          <text className="bhmap-road" transform="translate(25 70) rotate(-48)">Av. Amazonas</text>
          {NEIGHBORHOOD_LABELS.map((l) => (
            <text key={l.text} x={l.x} y={l.y} textAnchor={l.anchor} className="bhmap-hood">{l.text}</text>
          ))}
          <text x={USER_LOCATION.map.x - 2.4} y={USER_LOCATION.map.y + 4.2} textAnchor="end" className="bhmap-hood bhmap-hood-user">{USER_LOCATION.neighborhood}</text>
        </g>
      ) : null}

      {/* compass */}
      {!mini ? (
        <g transform="translate(92 -2)" className="bhmap-compass">
          <circle r="3.6" fill="#fff" stroke="#e5e5e5" strokeWidth="0.5" />
          <path d="M0 -2.6 L1.2 0.6 L0 0 L-1.2 0.6 Z" fill="#ff4b4b" />
          <text y="3" className="bhmap-compass-n">N</text>
        </g>
      ) : null}

      {/* route (PT-06) */}
      {target ? (
        <g className="bhmap-route">
          <path d={routePath(target.map)} fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <path data-testid="route" d={routePath(target.map)} fill="none" stroke="#1cb0f6" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2.2 1.8" className="bhmap-route-dash" />
          <circle cx={target.map.x} cy={target.map.y} r="3" fill="none" stroke="#1cb0f6" strokeWidth="0.6" className="bhmap-target" />
        </g>
      ) : null}

      {/* user dot */}
      <g data-testid="user-dot" aria-label={`Você está aqui (${USER_LOCATION.neighborhood})`} role="img">
        <circle cx={USER_LOCATION.map.x} cy={USER_LOCATION.map.y} r="2" fill="#1cb0f6" opacity="0.35" className="bhmap-pulse" />
        <circle cx={USER_LOCATION.map.x} cy={USER_LOCATION.map.y} r="1.6" fill="#1cb0f6" stroke="#fff" strokeWidth="0.8" />
      </g>

      {/* pins */}
      {points.map((p) => {
        const s = pinStyle(p, highlight)
        const selected = p.id === selectedId || p.id === routeTo
        return (
          <g
            key={p.id}
            data-testid={`pin-${p.id}`}
            role="button"
            tabIndex={0}
            aria-label={`${p.name}, ${p.neighborhood}`}
            className={`bhmap-pin${selected ? ' bhmap-pin-on' : ''}`}
            transform={`translate(${p.map.x} ${p.map.y})${selected ? ' scale(1.2)' : ''}`}
            onClick={() => onPinClick?.(p.id)}
            onKeyDown={onKey(p.id)}
          >
            <ellipse cx="0" cy="0.2" rx="1.6" ry="0.5" fill="#000" opacity="0.18" />
            <path d={PIN_PATH} fill={s.color} stroke="#fff" strokeWidth="0.6" />
            <circle cx="0" cy="-6.2" r="2.3" fill="#fff" />
            <text x="0" y="-5.15" className="bhmap-pin-emoji">{s.emoji}</text>
          </g>
        )
      })}
    </svg>
  )
}
