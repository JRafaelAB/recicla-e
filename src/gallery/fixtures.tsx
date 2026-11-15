import type { ReactNode } from 'react'
import { LoginScreen, SignupScreen } from '../screens/Auth'
import { OnboardingScreen, OnboardingSummaryScreen } from '../screens/Onboarding'
import { HomeMapScreen } from '../screens/HomeMap'
import { PointDetailScreen, RouteScreen } from '../screens/Point'
import { CelebrationScreen, ScheduleScreen } from '../screens/Schedule'
import { DeviceScreen, LearnScreen } from '../screens/Learn'
import { ProfileScreen } from '../screens/Profile'
import { CATEGORIES, type CategoryId } from '../data/categories'
import { TIPS } from '../data/catalog'
import { validateLogin } from '../logic/auth'
import type { Booking } from '../logic/storage'
import type { MainScreen } from '../app/store'

export interface Fixture {
  id: string
  name: string
  render: () => ReactNode
  /** Main screens show the bottom tab bar with this tab active. */
  tab?: MainScreen
}

/** Fixed gallery clock: Monday 2026-11-16 10:00 (local time). */
export const GALLERY_NOW = () => new Date(2026, 10, 16, 10, 0)
const MONDAY_EVENING = () => new Date(2026, 10, 16, 18, 0)

const noop = () => {}

const booking: Booking = {
  id: 'g-1',
  pointId: 1,
  items: [{ subtypeId: 'celular', qty: 2 }],
  date: '2026-11-17',
  slot: '09:00',
}
const lampBooking: Booking = {
  id: 'g-2',
  pointId: 3,
  items: [{ subtypeId: 'lampada-fluorescente', qty: 1 }],
  date: '2026-11-18',
  slot: '10:00',
}

const answers = (tenho: CategoryId[]) =>
  Object.fromEntries(CATEGORIES.map((c) => [c.id, tenho.includes(c.id) ? 'tenho' : 'nao'])) as Record<CategoryId, 'tenho' | 'nao'>

const home = (map: { categories: CategoryId[]; query: string }, tip: (typeof TIPS)[number] | null) => (
  <HomeMapScreen map={map} tip={tip} onMapChange={noop} onDismissTip={noop} onOpenPoint={noop} />
)

/** The 18 screen states of the spec's Screen Inventory, built from real data with a fixed clock. */
export const FIXTURES: Fixture[] = [
  { id: 'S1', name: 'Entrar', render: () => <LoginScreen onLogin={noop} onCreateAccount={noop} /> },
  {
    id: 'S2',
    name: 'Entrar com erros de validação',
    render: () => (
      <LoginScreen onLogin={noop} onCreateAccount={noop} initialEmail="anax.com" initialPassword="123" initialErrors={validateLogin('anax.com', '123')} />
    ),
  },
  { id: 'S3', name: 'Cadastro', render: () => <SignupScreen onSignup={noop} onHaveAccount={noop} /> },
  { id: 'S4', name: 'Apresentação: cartão de aparelho (com progresso)', render: () => <OnboardingScreen index={2} onAnswer={noop} onSkip={noop} /> },
  {
    id: 'S5',
    name: 'Apresentação: resumo com aparelhos',
    render: () => <OnboardingSummaryScreen answers={answers(['celulares', 'pilhas'])} onGoToMap={noop} />,
  },
  { id: 'S6', name: 'Apresentação: resumo sem aparelhos', render: () => <OnboardingSummaryScreen answers={answers([])} onGoToMap={noop} /> },
  { id: 'S7', tab: 'home', name: 'Mapa inicial, padrão, com balão de dica do mascote', render: () => home({ categories: [], query: '' }, TIPS[0]) },
  { id: 'S8', tab: 'home', name: 'Mapa inicial, filtrado por uma categoria', render: () => home({ categories: ['linhabranca'], query: '' }, null) },
  { id: 'S9', tab: 'home', name: 'Mapa inicial, sem resultados', render: () => home({ categories: [], query: 'xyz' }, null) },
  {
    id: 'S10',
    name: 'Detalhe do ponto',
    render: () => <PointDetailScreen pointId={1} onBack={noop} onRoute={noop} onSchedule={noop} />,
  },
  { id: 'S11', name: 'Detalhe do ponto com rota ("Como chegar")', render: () => <RouteScreen pointId={5} onClose={noop} /> },
  {
    id: 'S12',
    name: 'Formulário de agendamento',
    render: () => (
      <ScheduleScreen pointId={1} now={GALLERY_NOW} onBack={noop} onConfirm={noop} initialQty={{ celular: 2 }} initialDate="2026-11-17" initialSlot="09:00" />
    ),
  },
  {
    id: 'S13',
    name: 'Agendamento, dia sem horários',
    // Point 3 (Coleta Lourdes, closes 14h) has a short item list, so the no-slots message stays inside the frame.
    render: () => <ScheduleScreen pointId={3} now={MONDAY_EVENING} onBack={noop} onConfirm={noop} initialDate="2026-11-16" />,
  },
  { id: 'S14', name: 'Celebração / impacto após agendar', render: () => <CelebrationScreen booking={booking} onBackToMap={noop} /> },
  { id: 'S15', tab: 'learn', name: 'Lista do Aprender', render: () => <LearnScreen onOpenCategory={noop} /> },
  { id: 'S16', name: 'Página do aparelho (detalhe do Aprender)', render: () => <DeviceScreen categoryId="lampadas" onBack={noop} onSeePoints={noop} /> },
  {
    id: 'S17', tab: 'profile',
    name: 'Perfil, sem agendamentos',
    render: () => <ProfileScreen name="Ana" bookings={[]} onOpenMap={noop} onLogout={noop} onReset={noop} />,
  },
  {
    id: 'S18', tab: 'profile',
    name: 'Perfil com agendamentos',
    render: () => <ProfileScreen name="Ana" bookings={[booking, lampBooking]} onOpenMap={noop} onLogout={noop} onReset={noop} />,
  },
]
