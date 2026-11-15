import { useId, useState, type FormEvent } from 'react'
import { Button, Mascot } from '../components/ui'
import { validateLogin, validateSignup, type AuthErrors } from '../logic/auth'
import './common.css'
import './Auth.css'

function Field({ label, type, value, onChange, error, autoComplete }: {
  label: string
  type: 'text' | 'email' | 'password'
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
}) {
  const id = useId()
  const errId = `${id}-err`
  return (
    <div className={`auth-field${error ? ' auth-field-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <p id={errId} className="auth-error" role="alert">{error}</p> : null}
    </div>
  )
}

export interface LoginProps {
  /** Valid credentials (AUTH-07/08): the adapter dispatches login. */
  onLogin: (email: string) => void
  onCreateAccount: () => void
  /** Gallery (S2): pre-filled fields and visible errors. */
  initialEmail?: string
  initialPassword?: string
  initialErrors?: AuthErrors
}

/** S1/S2 — Login (AUTH-01, AUTH-04, AUTH-05). */
export function LoginScreen({ onLogin, onCreateAccount, initialEmail = '', initialPassword = '', initialErrors = {} }: LoginProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState(initialPassword)
  const [errors, setErrors] = useState<AuthErrors>(initialErrors)

  function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateLogin(email, password)
    setErrors(errs)
    if (Object.keys(errs).length === 0) onLogin(email.trim())
  }

  return (
    <section className="scr auth" data-testid="screen-login">
      <div className="auth-hero">
        <div className="auth-blob" aria-hidden="true" />
        <Mascot pose="talking" size={92} />
        <p className="auth-brand">recicla<span>-E</span></p>
        <p className="auth-tag">Descubra onde descartar seus eletrônicos em BH</p>
      </div>
      <form className="auth-form" onSubmit={submit} noValidate>
        <h1 className="auth-title">Entrar</h1>
        <Field label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
        <Field label="Senha" type="password" autoComplete="current-password" value={password} onChange={setPassword} error={errors.password} />
        <Button type="submit" block>Entrar</Button>
        <div className="auth-or"><span>ou</span></div>
        <Button variant="secondary" block onClick={onCreateAccount}>Criar conta</Button>
      </form>
    </section>
  )
}

export interface SignupProps {
  /** Valid data (AUTH-07/10): the adapter dispatches signup. */
  onSignup: (nome: string, email: string) => void
  onHaveAccount: () => void
  initialNome?: string
  initialEmail?: string
  initialPassword?: string
  initialErrors?: AuthErrors
}

/** S3 — Cadastro (AUTH-03..06, AUTH-09). */
export function SignupScreen({ onSignup, onHaveAccount, initialNome = '', initialEmail = '', initialPassword = '', initialErrors = {} }: SignupProps) {
  const [nome, setNome] = useState(initialNome)
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState(initialPassword)
  const [errors, setErrors] = useState<AuthErrors>(initialErrors)

  function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateSignup(nome, email, password)
    setErrors(errs)
    if (Object.keys(errs).length === 0) onSignup(nome.trim(), email.trim())
  }

  return (
    <section className="scr auth" data-testid="screen-signup">
      <div className="auth-hero auth-hero-small">
        <div className="auth-blob" aria-hidden="true" />
        <Mascot pose="idle" size={64} />
        <p className="auth-tag">Crie sua conta e comece a descartar certo</p>
      </div>
      <form className="auth-form" onSubmit={submit} noValidate>
        <h1 className="auth-title">Criar conta</h1>
        <Field label="Nome" type="text" autoComplete="name" value={nome} onChange={setNome} error={errors.nome} />
        <Field label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />
        <Field label="Senha" type="password" autoComplete="new-password" value={password} onChange={setPassword} error={errors.password} />
        <Button type="submit" block>Cadastrar</Button>
        <Button variant="ghost" block onClick={onHaveAccount}>Já tenho conta</Button>
      </form>
    </section>
  )
}
