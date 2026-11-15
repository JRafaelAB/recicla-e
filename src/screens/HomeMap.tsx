import { CATEGORIES } from '../data/categories'
import { URPV_NOTE, type Tip } from '../data/catalog'
import { POINTS } from '../data/points'
import { BHMap } from '../components/BHMap'
import { Balloon, Button, Chip, FictionalBadge, FonteNote, InfoIcon, Mascot } from '../components/ui'
import { filterPoints, pointAcceptsCategory } from '../logic/filter'
import { km } from '../logic/format'
import { clearFilters, selectAll, toggleChip, type MapState } from '../logic/mapState'
import './common.css'
import './HomeMap.css'

export interface HomeMapProps {
  map: MapState
  /** TIP-01: the mascot tip for this visit; null hides the balloon (TIP-02). */
  tip: Tip | null
  onMapChange: (map: MapState) => void
  onDismissTip: () => void
  onOpenPoint: (pointId: number) => void
}

/** S7–S9 — home map with filters, search, bottom sheet and the mascot tip (MAP-01..13, TIP-01..04). */
export function HomeMapScreen({ map, tip, onMapChange, onDismissTip, onOpenPoint }: HomeMapProps) {
  const visible = filterPoints(POINTS, map)
  const todos = map.categories.length === 0

  return (
    <section className="home" data-testid="screen-home">
      <h1 className="sr-only">Mapa</h1>
      <div className="home-top">
        <label className="home-search">
          <span className="home-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            aria-label="Buscar pontos"
            placeholder="Buscar por nome, bairro ou aparelho"
            value={map.query}
            onChange={(e) => onMapChange({ ...map, query: e.target.value })}
          />
        </label>
        <div className="home-chips" role="group" aria-label="Filtrar por aparelho">
          <Chip selected={todos} emoji="♻️" onClick={() => onMapChange(selectAll(map))}>Todos</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} selected={map.categories.includes(c.id)} emoji={c.emoji} onClick={() => onMapChange(toggleChip(map, c.id))}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="home-map">
        <BHMap points={visible} highlight={map.categories} onPinClick={onOpenPoint} />
        <div className="home-badge"><FictionalBadge plural /></div>
      </div>

      {tip ? (
        <div className="home-tip" data-testid="mascot-tip">
          <Mascot pose="talking" size={46} />
          <Balloon tail="left" dismissOnOutside={false} onClose={onDismissTip} className="home-tip-balloon">
            <span className="home-tip-title">Dica do Reci</span>
            <span className="home-tip-text" data-testid="mascot-tip-text">{tip.text}</span>
            <FonteNote sourceId={tip.sourceId} />
          </Balloon>
        </div>
      ) : null}

      <div className="home-sheet" role="region" aria-label="Pontos de coleta">
        <span className="home-sheet-handle" aria-hidden="true" />
        <h2 className="home-sheet-title">
          <span data-testid="points-count">
            {visible.length === 1 ? '1 ponto de coleta' : `${visible.length} pontos de coleta`}
          </span>
          <InfoIcon label={URPV_NOTE.title}>
            <span>{URPV_NOTE.text}</span>
            <FonteNote sourceId={URPV_NOTE.sourceId} />
          </InfoIcon>
        </h2>
        {visible.length === 0 ? (
          <div className="home-empty">
            <span className="home-empty-emoji" aria-hidden="true">🔎</span>
            <p className="home-empty-text">Nenhum ponto encontrado</p>
            <Button variant="secondary" onClick={() => onMapChange(clearFilters())}>Limpar filtros</Button>
          </div>
        ) : (
          <ul className="home-list">
            {visible.map((p) => (
              <li key={p.id}>
                <button type="button" className="home-item" data-testid="point-item" onClick={() => onOpenPoint(p.id)}>
                  <span className="home-item-pin" aria-hidden="true">📍</span>
                  <span className="home-item-main">
                    <span className="home-item-name">{p.name}</span>
                    <span className="home-item-sub">{p.neighborhood} · <strong>{km(p.distanceKm)}</strong></span>
                  </span>
                  <span className="home-item-cats" aria-label="Aceita">
                    {CATEGORIES.filter((c) => pointAcceptsCategory(p, c.id)).map((c) => (
                      <span key={c.id} title={c.label} role="img" aria-label={c.label}>{c.emoji}</span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
