import { useState } from 'react'
import { CATEGORIES, SUBTYPES } from '../data/categories'
import { Button, Confetti, FonteNote, Mascot, Stepper } from '../components/ui'
import { dayLabel, km } from '../logic/format'
import { impactFor } from '../logic/impact'
import { isOpen, nextSevenDays, slotsFor } from '../logic/slots'
import type { Booking } from '../logic/storage'
import { ScreenHeader, SectionTitle } from './common'
import { pointById } from './Point'
import './common.css'
import './Schedule.css'

const pad = (n: number) => String(n).padStart(2, '0')
/** Local "YYYY-MM-DD". */
export const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromIso = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export type NewBooking = Omit<Booking, 'id'>

export interface ScheduleProps {
  pointId: number
  /** Clock (ClockContext); read at render and when a day is selected. */
  now: () => Date
  onBack: () => void
  onConfirm: (booking: NewBooking) => void
  /** Gallery: preset quantities by sub-type id, day (YYYY-MM-DD) and slot. */
  initialQty?: Record<string, number>
  initialDate?: string
  initialSlot?: string
}

/** S12/S13 — scheduling form (SCH-01..07, SCH-12, EDGE-04). */
export function ScheduleScreen({ pointId, now, onBack, onConfirm, initialQty = {}, initialDate, initialSlot }: ScheduleProps) {
  const p = pointById(pointId)
  const accepted = SUBTYPES.filter((s) => p.accepts.includes(s.id))
  const groups = CATEGORIES.map((c) => ({ cat: c, subs: accepted.filter((s) => s.categoryId === c.id) })).filter((g) => g.subs.length > 0)
  const days = nextSevenDays(now())
  const todayIso = isoDate(now())

  const [qty, setQty] = useState<Record<string, number>>(initialQty)
  const [date, setDate] = useState<string | undefined>(initialDate)
  // EDGE-04: slots are computed when the day is selected and kept until the day is selected again.
  const [slots, setSlots] = useState<string[]>(() => (initialDate ? slotsFor(p, fromIso(initialDate), now()) : []))
  const [slot, setSlot] = useState<string | undefined>(initialSlot)

  const total = accepted.reduce((n, s) => n + (qty[s.id] ?? 0), 0)
  const valid = total > 0 && date !== undefined && slot !== undefined

  function pickDay(d: Date) {
    setDate(isoDate(d))
    setSlots(slotsFor(p, d, now()))
    setSlot(undefined)
  }

  function confirm() {
    if (!valid) return
    onConfirm({
      pointId: p.id,
      items: accepted.filter((s) => (qty[s.id] ?? 0) > 0).map((s) => ({ subtypeId: s.id, qty: qty[s.id] })),
      date: date!,
      slot: slot!,
    })
  }

  return (
    <section className="scr sch" data-testid="screen-schedule">
      <ScreenHeader title="Agendar entrega" onBack={onBack} />
      <div className="sch-body">
        <div className="sch-point">
          <span className="sch-point-pin" aria-hidden="true">📍</span>
          <span>
            <strong>{p.name}</strong>
            <span className="sch-point-sub">{p.neighborhood} · {km(p.distanceKm)}</span>
          </span>
        </div>

        <SectionTitle>O que você vai levar</SectionTitle>
        <div className="sch-groups">
          {groups.map(({ cat, subs }) => (
            <div key={cat.id} className="scr-card sch-group" data-testid="sch-group">
              <h3 className="sch-group-title"><span aria-hidden="true">{cat.emoji}</span> {cat.label}</h3>
              {subs.map((s) => (
                <div key={s.id} className="sch-row" data-testid="sch-item">
                  <span className="sch-row-label">{s.label}</span>
                  <Stepper label={s.label} value={qty[s.id] ?? 0} onChange={(n) => setQty({ ...qty, [s.id]: n })} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <SectionTitle>Escolha o dia</SectionTitle>
        <div className="sch-days" role="group" aria-label="Dia">
          {days.map((d) => {
            const iso = isoDate(d)
            const open = isOpen(p, d)
            const [wd, dm] = dayLabel(d).split(', ')
            return (
              <button
                key={iso}
                type="button"
                className={`sch-day${date === iso ? ' sch-day-on' : ''}`}
                aria-label={dayLabel(d)}
                aria-pressed={date === iso}
                disabled={!open}
                onClick={() => pickDay(d)}
              >
                <span className="sch-day-wd">{iso === todayIso ? 'Hoje' : wd}</span>
                <span className="sch-day-dm">{dm}</span>
                {!open ? <span className="sch-day-closed">Fechado</span> : null}
              </button>
            )
          })}
        </div>

        <SectionTitle>Escolha o horário</SectionTitle>
        {date === undefined ? (
          <p className="sch-hint">Escolha um dia para ver os horários.</p>
        ) : slots.length === 0 ? (
          <div className="sch-noslots">
            <span aria-hidden="true">😴</span>
            <p>Sem horários disponíveis neste dia</p>
          </div>
        ) : (
          <div className="sch-slots" role="group" aria-label="Horário">
            {slots.map((s) => (
              <button key={s} type="button" className={`sch-slot${slot === s ? ' sch-slot-on' : ''}`} aria-pressed={slot === s} onClick={() => setSlot(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sch-footer">
        <span className="sch-total" data-testid="sch-total">{total === 1 ? '1 item' : `${total} itens`}</span>
        <Button disabled={!valid} onClick={confirm}>Confirmar agendamento</Button>
      </div>
    </section>
  )
}

const subtypeOf = (id: string) => SUBTYPES.find((s) => s.id === id)!

export interface CelebrationProps {
  booking: Booking
  onBackToMap: () => void
}

/** S14 — celebration with the booking summary and its potential impact (SCH-08..11, NAV-03). */
export function CelebrationScreen({ booking, onBackToMap }: CelebrationProps) {
  const p = pointById(booking.pointId)
  const lines = impactFor(booking.items)
  return (
    <section className="scr cel" data-testid="screen-celebration">
      <Confetti />
      <div className="cel-hero">
        <Mascot pose="celebrating" size={104} />
        <h1 className="cel-title">Entrega agendada!</h1>
        <p className="cel-sub">Você está fazendo a sua parte pelo meio ambiente.</p>
      </div>

      <div className="scr-card cel-summary" data-testid="cel-summary">
        <p className="cel-point"><span aria-hidden="true">📍</span> {p.name}</p>
        <p className="cel-when"><span aria-hidden="true">📅</span> {dayLabel(fromIso(booking.date))} às {booking.slot}</p>
        <ul className="cel-items">
          {booking.items.map((i) => (
            <li key={i.subtypeId}><span aria-hidden="true">{subtypeOf(i.subtypeId).emoji}</span> {i.qty} × {subtypeOf(i.subtypeId).label}</li>
          ))}
        </ul>
      </div>

      <div className="cel-impact" data-testid="cel-impact">
        <h2 className="cel-impact-title">🌱 Seu impacto potencial</h2>
        <p className="cel-impact-intro">Ao entregar, você vai levar estes materiais para a reciclagem certa:</p>
        <ul className="cel-lines">
          {lines.map((l) => (
            <li key={`${l.subtypeId}-${l.factId}`} className={`cel-line cel-line-${l.kind}`} data-testid="impact-line">
              <span>{l.text}</span>
              <FonteNote sourceId={l.sourceId} />
            </li>
          ))}
        </ul>
      </div>

      <div className="cel-cta">
        <Button block onClick={onBackToMap}>Voltar ao mapa</Button>
      </div>
    </section>
  )
}
