import { PhoneFrame } from '../components/PhoneFrame'
import { TabBar } from '../components/ui'
import { ClockContext } from '../app/store'
import { FIXTURES, GALLERY_NOW } from './fixtures'
import './Gallery.css'

const noop = () => {}

/** GAL-01/02: every screen state as a captioned 390×844 frame, rendered by the same components as the app. */
export function Gallery() {
  return (
    <ClockContext.Provider value={GALLERY_NOW}>
      <main className="gallery">
        <h1 className="gallery-title">recicla-E — telas do protótipo</h1>
        <div className="gallery-grid">
          {FIXTURES.map((f) => (
            <figure key={f.id} className="gallery-item" data-testid="gallery-item">
              <figcaption className="gallery-caption">{f.id} — {f.name}</figcaption>
              <PhoneFrame footer={f.tab ? <TabBar active={f.tab} onSelect={noop} /> : null}>{f.render()}</PhoneFrame>
            </figure>
          ))}
        </div>
      </main>
    </ClockContext.Provider>
  )
}
