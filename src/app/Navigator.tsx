import type { Dispatch, ReactNode } from 'react'
import { PhoneFrame } from '../components/PhoneFrame'
import { TabBar } from '../components/ui'
import { CATEGORIES } from '../data/categories'
import { TIPS, type Tip } from '../data/catalog'
import { LoginScreen, SignupScreen } from '../screens/Auth'
import { OnboardingScreen, OnboardingSummaryScreen } from '../screens/Onboarding'
import { HomeMapScreen } from '../screens/HomeMap'
import { PointDetailScreen, RouteScreen } from '../screens/Point'
import { MAIN_SCREENS, top, useApp, useClock, type Action, type AppState, type MainScreen, type NavEntry, type ScreenId } from './store'

/** What a screen adapter receives: the live state, dispatch, its nav params and the clock. */
export interface ScreenContext {
  state: AppState
  dispatch: Dispatch<Action>
  params: NavEntry['params']
  now: () => Date
}

export type ScreenRenderer = (ctx: ScreenContext) => ReactNode

// TIP-01: each opening of the home map (a new home nav entry) gets the next catalog tip;
// returning to the same entry (back from a point) keeps its tip.
const tipByEntry = new WeakMap<NavEntry, Tip>()
let tipCounter = 0
function tipFor(entry: NavEntry): Tip {
  let tip = tipByEntry.get(entry)
  if (!tip) {
    tip = TIPS[tipCounter++ % TIPS.length]
    tipByEntry.set(entry, tip)
  }
  return tip
}

const placeholder = (id: ScreenId, title: string): ScreenRenderer => () => (
  <section className="screen-placeholder" data-testid={`screen-${id}`} style={{ padding: 24 }}>
    <h1>{title}</h1>
  </section>
)

/**
 * Screen registry. Phase 4 replaces each placeholder with an adapter that maps
 * the store to the screen component's props (screens stay pure for the gallery).
 */
export const SCREENS: Record<ScreenId, ScreenRenderer> = {
  login: ({ dispatch }) => (
    <LoginScreen
      onLogin={(email) => dispatch({ type: 'login', email })}
      onCreateAccount={() => dispatch({ type: 'navigate', screen: 'signup' })}
    />
  ),
  signup: ({ dispatch }) => (
    <SignupScreen
      onSignup={(nome, email) => dispatch({ type: 'signup', nome, email })}
      onHaveAccount={() => dispatch({ type: 'back' })}
    />
  ),
  onboarding: ({ state, dispatch }) => (
    <OnboardingScreen
      index={CATEGORIES.findIndex((c) => state.onboarding.answers[c.id] === undefined)}
      onAnswer={(category, answer) => dispatch({ type: 'answerCard', category, answer })}
      onSkip={() => dispatch({ type: 'skipOnboarding' })}
    />
  ),
  onboardingSummary: ({ state, dispatch }) => (
    <OnboardingSummaryScreen
      answers={state.onboarding.answers}
      onGoToMap={(tenho) =>
        dispatch({ type: 'openMap', handoff: tenho.length ? { kind: 'category', categories: tenho } : { kind: 'reset' } })
      }
    />
  ),
  home: ({ state, dispatch }) => (
    <HomeMapScreen
      map={state.map}
      tip={state.tipDismissed ? null : tipFor(top(state))}
      onMapChange={(map) => dispatch({ type: 'setMap', map })}
      onDismissTip={() => dispatch({ type: 'dismissTip' })}
      onOpenPoint={(pointId) => dispatch({ type: 'navigate', screen: 'point', params: { pointId } })}
    />
  ),
  point: ({ dispatch, params }) => (
    <PointDetailScreen
      pointId={params!.pointId!}
      onBack={() => dispatch({ type: 'back' })}
      onRoute={() => dispatch({ type: 'navigate', screen: 'route', params: { pointId: params!.pointId! } })}
      onSchedule={() => dispatch({ type: 'navigate', screen: 'schedule', params: { pointId: params!.pointId! } })}
    />
  ),
  route: ({ dispatch, params }) => <RouteScreen pointId={params!.pointId!} onClose={() => dispatch({ type: 'back' })} />,
  schedule: placeholder('schedule', 'Agendar entrega'),
  celebration: placeholder('celebration', 'Agendamento confirmado'),
  learn: placeholder('learn', 'Aprender'),
  device: placeholder('device', 'Aparelho'),
  profile: placeholder('profile', 'Perfil'),
}

const isMain = (s: ScreenId): s is MainScreen => (MAIN_SCREENS as ScreenId[]).includes(s)

/** NAV-01 / ONB-03: tab bar only on the three main screens, logged in, onboarding done. */
export function tabFor(state: AppState): MainScreen | null {
  const screen = top(state).screen
  return state.session && state.onboarding.done && isMain(screen) ? screen : null
}

/** Renders the top of the nav stack inside the phone frame. */
export function Navigator() {
  const { state, dispatch } = useApp()
  const now = useClock()
  const entry = top(state)
  const tab = tabFor(state)
  return (
    <PhoneFrame footer={tab ? <TabBar active={tab} onSelect={(screen) => dispatch({ type: 'switchTab', screen })} /> : null}>
      {SCREENS[entry.screen]({ state, dispatch, params: entry.params, now })}
    </PhoneFrame>
  )
}
