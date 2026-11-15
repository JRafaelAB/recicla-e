import { CATEGORIES, SUBTYPES, type CategoryId } from '../data/categories'
import { FACTS, GUIDES } from '../data/catalog'
import { BHMap } from '../components/BHMap'
import { DangerScale } from '../components/DangerScale'
import { SwipeCard, type SwipeAnswer } from '../components/SwipeCard'
import { Button, FonteNote, Mascot } from '../components/ui'
import { km } from '../logic/format'
import { nearestPointFor } from '../logic/nearest'
import { categoryDanger } from './common'
import './common.css'
import './Onboarding.css'

/** One approved fact per card (ONB-01), chosen from the catalog. */
const CARD_FACT: Record<CategoryId, string> = {
  pilhas: 'pilha-vazamento',
  baterias: 'litio-energia',
  celulares: 'celular-cobre',
  computadores: 'pc-metais',
  linhabranca: 'cfc12',
  tvs: 'crt-chumbo',
  lampadas: 'cfl-mercurio',
  cabos: 'cabos-queima',
}

export const ONBOARDING_QUESTION = 'Você tem este aparelho parado em casa?'

export interface OnboardingProps {
  /** Index (0..7) of the current card = first unanswered category. */
  index: number
  onAnswer: (category: CategoryId, answer: SwipeAnswer) => void
  onSkip: () => void
}

/** S4 — swipe onboarding (ONB-01..08). */
export function OnboardingScreen({ index, onAnswer, onSkip }: OnboardingProps) {
  const total = CATEGORIES.length
  const i = Math.max(0, Math.min(index, total - 1))
  const cat = CATEGORIES[i]
  const fact = FACTS.find((f) => f.id === CARD_FACT[cat.id])!
  const danger = categoryDanger(cat.id)
  const n = i + 1
  const subtypes = SUBTYPES.filter((s) => s.categoryId === cat.id)

  return (
    <section className="scr onb" data-testid="screen-onboarding">
      <div className="onb-top">
        <div className="onb-progress" role="progressbar" aria-label="Progresso" aria-valuemin={1} aria-valuemax={total} aria-valuenow={n}>
          <span className="onb-progress-fill" style={{ width: `${(n / total) * 100}%` }} />
        </div>
        <span className="onb-count" data-testid="onb-count">{n} de {total}</span>
      </div>
      <div className="onb-ask">
        <Mascot pose="talking" size={52} />
        <p className="onb-question">{ONBOARDING_QUESTION}</p>
      </div>
      <SwipeCard key={cat.id} onAnswer={(a) => onAnswer(cat.id, a)}>
        <div className="onb-card">
          <div className="onb-illus" aria-hidden="true">
            <span className="onb-illus-ring" />
            <span className="onb-illus-emoji">{cat.emoji}</span>
          </div>
          <h1 className="onb-name">{cat.label}</h1>
          {subtypes.length > 1 ? <p className="onb-subtypes">{subtypes.map((s) => s.label).join(' · ')}</p> : null}
          <DangerScale level={danger.level} label={cat.label} justification={danger.justification} sourceId={danger.sourceId} />
          <div className="onb-fact">
            <span className="onb-fact-title">Você sabia?</span>
            <p>{fact.text}</p>
            <FonteNote sourceId={fact.sourceId} />
          </div>
        </div>
      </SwipeCard>
      <p className="onb-hint">Arraste o cartão para a direita se tem, ou para a esquerda se não tem.</p>
      <Button variant="ghost" block className="onb-skip" onClick={onSkip}>Pular e ver mapa</Button>
    </section>
  )
}

/** First sentence of the guide of the category's most dangerous sub-type (ONB-09 "one-line como descartar"). */
function comoDescartarLine(id: CategoryId): string {
  const top = SUBTYPES.filter((s) => s.categoryId === id).reduce((a, b) => (b.level > a.level ? b : a))
  const text = GUIDES.find((g) => g.subtypeId === top.id)!.comoDescartar
  const end = text.indexOf('. ')
  return end === -1 ? text : text.slice(0, end + 1)
}

export interface OnboardingSummaryProps {
  answers: Partial<Record<CategoryId, SwipeAnswer>>
  /** ONB-12/13: receives exactly the "tenho" categories ([] → reset handoff). */
  onGoToMap: (tenho: CategoryId[]) => void
}

/** S5/S6 — onboarding summary (ONB-09..13). */
export function OnboardingSummaryScreen({ answers, onGoToMap }: OnboardingSummaryProps) {
  const tenho = CATEGORIES.filter((c) => answers[c.id] === 'tenho')
  const rows = tenho.map((c) => ({ cat: c, point: nearestPointFor(c.id) }))
  const pins = rows.map((r) => r.point).filter((p, i, a) => p && a.findIndex((q) => q?.id === p.id) === i).map((p) => p!)

  if (tenho.length === 0) {
    return (
      <section className="scr onb-sum onb-sum-empty" data-testid="screen-onboardingSummary">
        <div className="onb-sum-hero">
          <Mascot pose="celebrating" size={120} />
          <h1 className="scr-h1">Ótimo! Você não tem lixo eletrônico parado em casa.</h1>
          <p className="scr-muted onb-sum-sub">Quando tiver, o mapa mostra onde descartar cada aparelho.</p>
        </div>
        <Button block onClick={() => onGoToMap([])}>Ir para o mapa</Button>
      </section>
    )
  }

  return (
    <section className="scr onb-sum" data-testid="screen-onboardingSummary">
      <div className="onb-sum-head">
        <Mascot pose="celebrating" size={64} />
        <div>
          <h1 className="scr-h1">Seu lixo eletrônico</h1>
          <p className="scr-muted onb-sum-sub">
            {tenho.length === 1 ? 'Você tem 1 tipo de aparelho parado em casa.' : `Você tem ${tenho.length} tipos de aparelho parados em casa.`}
          </p>
        </div>
      </div>
      <div className="onb-minimap" data-testid="mini-map">
        <BHMap mini points={pins} highlight={tenho.map((c) => c.id)} />
      </div>
      <ul className="onb-sum-list">
        {rows.map(({ cat, point }) => {
          const d = categoryDanger(cat.id)
          return (
            <li key={cat.id} className="onb-sum-item scr-card" data-testid="summary-item">
              <div className="onb-sum-row">
                <span className="onb-sum-emoji" aria-hidden="true">{cat.emoji}</span>
                <h2 className="onb-sum-name">{cat.label}</h2>
              </div>
              <DangerScale compact level={d.level} label={cat.label} justification={d.justification} sourceId={d.sourceId} />
              <p className="onb-sum-line"><strong>Como descartar:</strong> {comoDescartarLine(cat.id)}</p>
              {point ? (
                <p className="onb-sum-point" data-testid="summary-nearest">
                  <span aria-hidden="true">📍</span> Mais perto: <strong>{point.name}</strong> · {km(point.distanceKm)}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
      <div className="onb-sum-cta">
        <Button block onClick={() => onGoToMap(tenho.map((c) => c.id))}>Ir para o mapa</Button>
      </div>
    </section>
  )
}
