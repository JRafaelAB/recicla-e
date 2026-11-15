import { useState } from 'react'
import { SUBTYPES } from '../data/categories'
import { Button, FonteNote, Mascot } from '../components/ui'
import { dayLabel } from '../logic/format'
import { sumImpact } from '../logic/impact'
import type { Booking } from '../logic/storage'
import { pointById } from './Point'
import './common.css'
import './Profile.css'

const subtypeOf = (id: string) => SUBTYPES.find((s) => s.id === id)!
const dateOf = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const RESET_QUESTION = 'Apagar todos os dados da demonstração?'

export interface ProfileProps {
  name: string
  bookings: Booking[]
  /** PROF-02: opens the home map without a handoff. */
  onOpenMap: () => void
  onLogout: () => void
  onReset: () => void
  /** Gallery: show the reset confirmation open. */
  initialConfirmOpen?: boolean
}

/** S17/S18 — Perfil (PROF-01..07). */
export function ProfileScreen({ name, bookings, onOpenMap, onLogout, onReset, initialConfirmOpen = false }: ProfileProps) {
  const [confirming, setConfirming] = useState(initialConfirmOpen)
  const total = bookings.reduce((n, b) => n + b.items.reduce((m, i) => m + i.qty, 0), 0)
  const { totals, qualitative } = sumImpact(bookings)

  return (
    <section className="scr prof" data-testid="screen-profile">
      <div className="prof-head">
        <span className="prof-avatar" aria-hidden="true">{name.trim().charAt(0).toUpperCase() || '🙂'}</span>
        <div>
          <h1 className="prof-name" data-testid="profile-name">{name}</h1>
          <p className="prof-count" data-testid="profile-count">Itens agendados: {total}</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="prof-empty scr-card">
          <Mascot pose="talking" size={74} />
          <p className="prof-empty-text">Você ainda não agendou nenhuma entrega. Que tal começar hoje?</p>
          <Button block onClick={onOpenMap}>Agende seu primeiro descarte</Button>
        </div>
      ) : (
        <>
          {totals.length > 0 ? (
            <div className="prof-impact" data-testid="profile-impact">
              <h2 className="prof-impact-title">🌱 Impacto potencial</h2>
              <p className="prof-impact-intro">Ao entregar tudo o que agendou, você vai levar para a reciclagem certa:</p>
              <ul className="prof-lines">
                {totals.map((l) => (
                  <li key={`${l.subtypeId}-${l.factId}`} className="prof-line" data-testid="profile-impact-line">
                    <span>{l.text}</span>
                    <FonteNote sourceId={l.sourceId} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="prof-impact" data-testid="profile-impact">
              <h2 className="prof-impact-title">🌱 Seus itens vão para a reciclagem certa</h2>
              <ul className="prof-lines">
                {qualitative.map((l) => (
                  <li key={l.categoryId} className="prof-line prof-line-qual" data-testid="profile-impact-line">
                    <span>{l.text}</span>
                    <FonteNote sourceId={l.sourceId} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h2 className="scr-section">Meus agendamentos</h2>
          <ul className="prof-bookings">
            {bookings.map((b) => (
              <li key={b.id} className="scr-card prof-booking" data-testid="profile-booking">
                <p className="prof-booking-point"><span aria-hidden="true">📍</span> {pointById(b.pointId).name}</p>
                <p className="prof-booking-when"><span aria-hidden="true">📅</span> {dayLabel(dateOf(b.date))} às {b.slot}</p>
                <p className="prof-booking-items">
                  {b.items.map((i) => `${i.qty} ${i.qty === 1 ? subtypeOf(i.subtypeId).noun.singular : subtypeOf(i.subtypeId).noun.plural}`).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="prof-actions">
        <Button variant="secondary" block onClick={onLogout}>Sair</Button>
        <Button variant="ghost" block className="prof-reset" onClick={() => setConfirming(true)}>Reiniciar demo</Button>
      </div>

      {confirming ? (
        <div className="prof-overlay">
          <div className="prof-dialog" role="alertdialog" aria-modal="true" aria-labelledby="prof-reset-q">
            <span className="prof-dialog-icon" aria-hidden="true">🗑️</span>
            <p id="prof-reset-q" className="prof-dialog-q">{RESET_QUESTION}</p>
            <p className="prof-dialog-sub">Sua conta, respostas e agendamentos de teste serão apagados.</p>
            <div className="prof-dialog-actions">
              <Button variant="secondary" onClick={() => setConfirming(false)}>Cancelar</Button>
              <Button variant="danger" onClick={onReset}>Apagar</Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
