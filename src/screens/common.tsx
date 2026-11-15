import type { ReactNode } from 'react'
import { categoryLevel, SUBTYPES, type CategoryId, type Level } from '../data/categories'
import { LEVEL_JUSTIFICATION } from '../data/catalog'
import '../components/theme.css'
import './common.css'

/** Top bar of a non-main screen: back arrow (NAV-02) + title. */
export function ScreenHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <header className="scr-header">
      <button type="button" className="scr-back" aria-label="Voltar" onClick={onBack}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="scr-title">{title}</h1>
      <span className="scr-header-right">{right}</span>
    </header>
  )
}

/** Section heading with an optional ⓘ (TIP-03). */
export function SectionTitle({ children, info }: { children: ReactNode; info?: ReactNode }) {
  return (
    <h2 className="scr-section">
      <span>{children}</span>
      {info}
    </h2>
  )
}

/** Danger-scale props for a category: its level and the justification of its highest-level sub-type. */
export function categoryDanger(id: CategoryId): { level: Level; justification: string; sourceId: string } {
  const top = SUBTYPES.filter((s) => s.categoryId === id).reduce((a, b) => (b.level > a.level ? b : a))
  const j = LEVEL_JUSTIFICATION[top.id]
  return { level: categoryLevel(id), justification: j.text, sourceId: j.sourceId }
}

/** Danger-scale props for a sub-type. */
export function subtypeDanger(subtypeId: string): { level: Level; justification: string; sourceId: string } {
  const st = SUBTYPES.find((s) => s.id === subtypeId)!
  const j = LEVEL_JUSTIFICATION[subtypeId]
  return { level: st.level, justification: j.text, sourceId: j.sourceId }
}
