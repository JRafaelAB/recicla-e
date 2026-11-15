import type { ReactNode } from 'react'
import './theme.css'
import './PhoneFrame.css'

/** 390×844 phone frame (iPhone 14): status bar, scrollable screen area, optional bottom bar (TabBar). */
export function PhoneFrame({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="phone" data-testid="phone-frame">
      <div className="phone-status" aria-hidden="true">
        <span className="phone-time">9:41</span>
        <span className="phone-notch" />
        <span className="phone-icons">
          <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
          <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="16" height="8" rx="1.8" /><rect x="22.5" y="4" width="2" height="4" rx="1" opacity="0.4" /></svg>
        </span>
      </div>
      <div className="phone-screen">{children}</div>
      {footer ? <div className="phone-footer">{footer}</div> : null}
    </div>
  )
}
