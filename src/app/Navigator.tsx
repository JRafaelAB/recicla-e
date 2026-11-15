import type { Dispatch, ReactNode } from 'react'
import { PhoneFrame } from '../components/PhoneFrame'
import { TabBar } from '../components/ui'
import { LoginScreen, SignupScreen } from '../screens/Auth'
import { MAIN_SCREENS, top, useApp, useClock, type Action, type AppState, type MainScreen, type NavEntry, type ScreenId } from './store'

/** What a screen adapter receives: the live state, dispatch, its nav params and the clock. */
export interface ScreenContext {
  state: AppState
  dispatch: Dispatch<Action>
  params: NavEntry['params']
  now: () => Date
}

export type ScreenRenderer = (ctx: ScreenContext) => ReactNode

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
  onboarding: placeholder('onboarding', 'Onboarding'),
  onboardingSummary: placeholder('onboardingSummary', 'Resumo do onboarding'),
  home: placeholder('home', 'Mapa'),
  point: placeholder('point', 'Ponto de coleta'),
  route: placeholder('route', 'Como chegar'),
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
