export interface AuthErrors {
  nome?: string
  email?: string
  password?: string
}

export const ERR_EMAIL = 'Informe um email válido'
export const ERR_PASSWORD = 'A senha precisa ter pelo menos 6 caracteres'
export const ERR_NAME = 'Informe seu nome'

export function validateLogin(email: string, password: string): AuthErrors {
  const errors: AuthErrors = {}
  if (!email.includes('@')) errors.email = ERR_EMAIL
  if (password.length < 6) errors.password = ERR_PASSWORD
  return errors
}

export function validateSignup(nome: string, email: string, password: string): AuthErrors {
  const errors: AuthErrors = nome.trim() === '' ? { nome: ERR_NAME } : {}
  return { ...errors, ...validateLogin(email, password) }
}

export function nameFromEmail(email: string): string {
  return email.split('@')[0]
}
