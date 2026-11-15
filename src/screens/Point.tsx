import { CATEGORIES, SUBTYPES } from '../data/categories'
import { GUIDES, PNRS_CARD } from '../data/catalog'
import { POINTS, USER_LOCATION, type Hours, type Point } from '../data/points'
import { BHMap } from '../components/BHMap'
import { Button, FictionalBadge, FonteNote, InfoIcon } from '../components/ui'
import { km } from '../logic/format'
import { ScreenHeader, SectionTitle } from './common'
import './common.css'
import './Point.css'

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

/** "Seg–Sex 8h–18h" (Mock Data notation). */
export function hoursLabel(h: Hours): string {
  const days = DAY_ORDER.filter((d) => h.days.includes(d))
  const first = DAY_NAMES[days[0]]
  const last = DAY_NAMES[days[days.length - 1]]
  return `${days.length > 1 ? `${first}–${last}` : first} ${h.open}h–${h.close}h`
}

export const pointById = (id: number): Point => POINTS.find((p) => p.id === id)!

const telHref = (phone: string) => `tel:+55${phone.replace(/\D/g, '')}`

export interface PointDetailProps {
  pointId: number
  onBack: () => void
  onRoute: () => void
  onSchedule: () => void
}

/** S10 — collection point detail (PT-01..05, PT-08). */
export function PointDetailScreen({ pointId, onBack, onRoute, onSchedule }: PointDetailProps) {
  const p = pointById(pointId)
  const accepted = SUBTYPES.filter((s) => p.accepts.includes(s.id))
  const groups = CATEGORIES.map((c) => ({ cat: c, subs: accepted.filter((s) => s.categoryId === c.id) })).filter((g) => g.subs.length > 0)
  const streams = [...new Set(accepted.map((s) => GUIDES.find((g) => g.subtypeId === s.id)!.stream))].map((stream) => ({
    stream,
    labels: accepted.filter((s) => GUIDES.find((g) => g.subtypeId === s.id)!.stream === stream).map((s) => s.label),
  }))

  return (
    <section className="scr pt" data-testid="screen-point">
      <ScreenHeader title={p.name} onBack={onBack} />
      <div className="pt-body">
        <div className="pt-hero">
          <div className="pt-mini">
            <BHMap mini points={[p]} selectedId={p.id} />
          </div>
          <FictionalBadge />
          <p className="pt-address" data-testid="pt-address"><span aria-hidden="true">📍</span> {p.address}</p>
          <p className="pt-distance" data-testid="pt-distance"><strong>{km(p.distanceKm)}</strong> de você</p>
        </div>

        <SectionTitle>O que recebe</SectionTitle>
        <div className="pt-groups">
          {groups.map(({ cat, subs }) => (
            <div key={cat.id} className="pt-group" data-testid="pt-group">
              <h3 className="pt-group-title"><span aria-hidden="true">{cat.emoji}</span> {cat.label}</h3>
              <div className="pt-chips">
                {subs.map((s) => (
                  <span key={s.id} className="pt-chip" data-testid="pt-subtype">
                    <span aria-hidden="true">{s.emoji}</span>{s.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-info-grid">
          <div className="scr-card pt-info">
            <span className="pt-info-label">🕗 Horário</span>
            <ul className="pt-hours" data-testid="pt-hours">
              {p.hours.map((h) => <li key={h.days.join()}>{hoursLabel(h)}</li>)}
            </ul>
          </div>
          <div className="scr-card pt-info">
            <span className="pt-info-label">📞 Telefone</span>
            <a className="pt-phone" href={telHref(p.phone)}>{p.phone}</a>
          </div>
        </div>

        <SectionTitle>Como levar</SectionTitle>
        <ul className="pt-tips" data-testid="pt-como-levar">
          {accepted.map((s) => (
            <li key={s.id} className="pt-tip" data-testid="pt-tip">
              <span className="pt-tip-emoji" aria-hidden="true">{s.emoji}</span>
              <span>
                <strong className="pt-tip-label">{s.label}</strong>
                <span className="pt-tip-text">{GUIDES.find((g) => g.subtypeId === s.id)!.comoLevar}</span>
              </span>
            </li>
          ))}
        </ul>

        <SectionTitle
          info={
            <InfoIcon label={PNRS_CARD.title}>
              <span>{PNRS_CARD.text}</span>
              <FonteNote sourceId={PNRS_CARD.sourceId} />
            </InfoIcon>
          }
        >
          Por que descartar aqui
        </SectionTitle>
        <ul className="pt-streams" data-testid="pt-streams">
          {streams.map(({ stream, labels }) => (
            <li key={stream} className="pt-stream">
              <span className="pt-stream-name">♻️ {stream}</span>
              <span className="pt-stream-subs">{labels.join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-actions">
        <Button variant="blue" onClick={onRoute}>Como chegar</Button>
        <Button onClick={onSchedule}>Agendar entrega</Button>
      </div>
    </section>
  )
}

export interface RouteProps {
  pointId: number
  onClose: () => void
}

/** S11 — route on the illustrated map (PT-06, PT-07). */
export function RouteScreen({ pointId, onClose }: RouteProps) {
  const p = pointById(pointId)
  return (
    <section className="scr route" data-testid="screen-route">
      <ScreenHeader title="Como chegar" onBack={onClose} />
      <div className="route-map">
        <BHMap points={[p]} routeTo={p.id} />
      </div>
      <div className="route-card">
        <div className="route-legend">
          <span className="route-dot" aria-hidden="true" /> Você · {USER_LOCATION.neighborhood}
          <span className="route-line" aria-hidden="true" />
          <span aria-hidden="true">📍</span> {p.neighborhood}
        </div>
        <p className="route-name">{p.name}</p>
        <p className="route-sub">{p.address} · <strong>{km(p.distanceKm)}</strong></p>
        <p className="route-note">Rota ilustrativa no mapa desenhado (sem navegação real).</p>
        <Button block variant="secondary" onClick={onClose}>Fechar rota</Button>
      </div>
    </section>
  )
}
