import { CATEGORIES, categoryLevel, SUBTYPES, type CategoryId } from '../data/categories'
import { FACTS, GUIDES, PNRS_CARD, TIPS, URPV_NOTE } from '../data/catalog'
import { DangerScale } from '../components/DangerScale'
import { Button, FonteNote, InfoIcon, Mascot } from '../components/ui'
import { categoryDanger, ScreenHeader, SectionTitle, subtypeDanger } from './common'
import './common.css'
import './Learn.css'

/** INFO-01: level descending, then name A→Z. */
export const LEARN_ORDER = [...CATEGORIES].sort(
  (a, b) => categoryLevel(b.id) - categoryLevel(a.id) || a.label.localeCompare(b.label, 'pt-BR'),
)

export interface LearnProps {
  onOpenCategory: (id: CategoryId) => void
}

/** S15 — Aprender list (INFO-01, INFO-02). */
export function LearnScreen({ onOpenCategory }: LearnProps) {
  return (
    <section className="scr learn" data-testid="screen-learn">
      <div className="learn-head">
        <div>
          <h1 className="scr-h1">Aprender</h1>
          <p className="learn-intro">Toque num aparelho para saber por que não guardar e como descartar.</p>
        </div>
        <Mascot pose="idle" size={58} />
      </div>

      <article className="learn-card" data-testid="pnrs-card">
        <h2 className="learn-card-title"><span aria-hidden="true">♻️</span> {PNRS_CARD.title}</h2>
        <p>{PNRS_CARD.text}</p>
        <FonteNote sourceId={PNRS_CARD.sourceId} />
        <div className="learn-urpv" data-testid="urpv-note">
          <strong>{URPV_NOTE.title}</strong>
          <p>{URPV_NOTE.text}</p>
          <FonteNote sourceId={URPV_NOTE.sourceId} />
        </div>
      </article>

      <SectionTitle>Aparelhos</SectionTitle>
      <ul className="learn-list">
        {LEARN_ORDER.map((c) => {
          const d = categoryDanger(c.id)
          return (
            <li key={c.id} className="learn-item scr-card" data-testid="learn-item">
              <button type="button" className="learn-item-open" onClick={() => onOpenCategory(c.id)}>
                <span className="learn-item-emoji" aria-hidden="true">{c.emoji}</span>
                <span className="learn-item-name">{c.label}</span>
                <span className="learn-item-arrow" aria-hidden="true">›</span>
              </button>
              <DangerScale compact level={d.level} label={c.label} justification={d.justification} sourceId={d.sourceId} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function SubtypeGuide({ subtypeId, showTitle }: { subtypeId: string; showTitle: boolean }) {
  const st = SUBTYPES.find((s) => s.id === subtypeId)!
  const g = GUIDES.find((x) => x.subtypeId === subtypeId)!
  const facts = g.factIds.map((id) => FACTS.find((f) => f.id === id)!)
  const tip = TIPS.find((t) => t.subtypes.includes(subtypeId))
  const d = subtypeDanger(subtypeId)
  const level = showTitle ? 3 : 2
  return (
    <article className="dev-sub" data-testid="device-subtype">
      {showTitle ? (
        <div className="dev-sub-head">
          <h2 className="dev-sub-title"><span aria-hidden="true">{st.emoji}</span> {st.label}</h2>
          <DangerScale level={d.level} label={st.label} justification={d.justification} sourceId={d.sourceId} />
        </div>
      ) : null}

      <SectionTitle
        level={level}
        info={
          tip ? (
            <InfoIcon label={`dica sobre ${st.label}`}>
              <span>{tip.text}</span>
              <FonteNote sourceId={tip.sourceId} />
            </InfoIcon>
          ) : undefined
        }
      >
        Por que não guardar em casa
      </SectionTitle>
      <p className="dev-text">{g.porQueNaoGuardar}</p>

      <SectionTitle level={level}>Como descartar corretamente</SectionTitle>
      <p className="dev-text">{g.comoDescartar}</p>
      <p className="dev-stream" data-testid="device-stream"><span aria-hidden="true">♻️</span> {g.stream}</p>

      <SectionTitle level={level}>O que causa ao meio ambiente</SectionTitle>
      <p className="dev-text">{g.danoAmbiental}</p>

      <ul className="dev-facts">
        {facts.map((f) => (
          <li key={f.id} className="dev-fact" data-testid="device-fact">
            <span className="dev-fact-title">Você sabia?</span>
            <p>{f.text}</p>
            <FonteNote sourceId={f.sourceId} />
          </li>
        ))}
      </ul>
    </article>
  )
}

export interface DeviceProps {
  categoryId: CategoryId
  onBack: () => void
  onSeePoints: () => void
}

/** S16 — device page (INFO-03..06, SCALE-02). */
export function DeviceScreen({ categoryId, onBack, onSeePoints }: DeviceProps) {
  const cat = CATEGORIES.find((c) => c.id === categoryId)!
  const subs = SUBTYPES.filter((s) => s.categoryId === categoryId)
  const d = categoryDanger(categoryId)
  return (
    <section className="scr dev" data-testid="screen-device">
      <ScreenHeader title={cat.label} onBack={onBack} />
      <div className="dev-body">
        <div className="dev-hero">
          <span className="dev-hero-emoji" aria-hidden="true">{cat.emoji}</span>
          <div className="dev-hero-scale">
            <span className="dev-hero-label">Nível de perigo</span>
            <DangerScale level={d.level} label={cat.label} justification={d.justification} sourceId={d.sourceId} />
          </div>
        </div>
        {subs.map((s) => (
          <SubtypeGuide key={s.id} subtypeId={s.id} showTitle={subs.length > 1} />
        ))}
      </div>
      <div className="dev-cta">
        <Button block onClick={onSeePoints}>Ver pontos de coleta</Button>
      </div>
    </section>
  )
}
