import type { ReactNode } from 'react'
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
