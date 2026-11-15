import { describe, expect, it } from 'vitest'
import { nameFromEmail, validateLogin, validateSignup } from './auth'

describe('validateLogin (AUTH-04, AUTH-05)', () => {
  it('accepts a valid email and password', () => {
    expect(validateLogin('ana@x.com', 'abcdef')).toEqual({})
  })
  it('email without "@" -> "Informe um email válido"', () => {
    expect(validateLogin('anax.com', 'abcdef')).toEqual({ email: 'Informe um email válido' })
  })
  it('password shorter than 6 -> exact message', () => {
    expect(validateLogin('ana@x.com', 'abcde')).toEqual({ password: 'A senha precisa ter pelo menos 6 caracteres' })
  })
  it('exactly 6 characters is valid', () => {
    expect(validateLogin('ana@x.com', '123456').password).toBeUndefined()
  })
  it('reports both field errors at once', () => {
    expect(validateLogin('', '')).toEqual({
      email: 'Informe um email válido',
      password: 'A senha precisa ter pelo menos 6 caracteres',
    })
  })
})

describe('validateSignup (AUTH-04..06)', () => {
  it('accepts valid data', () => {
    expect(validateSignup('Ana', 'ana@x.com', 'abcdef')).toEqual({})
  })
  it('empty nome -> "Informe seu nome"', () => {
    expect(validateSignup('', 'ana@x.com', 'abcdef')).toEqual({ nome: 'Informe seu nome' })
  })
  it('whitespace-only nome counts as empty', () => {
    expect(validateSignup('   ', 'ana@x.com', 'abcdef')).toEqual({ nome: 'Informe seu nome' })
  })
  it('reports all three errors', () => {
    expect(validateSignup('', 'x', '1')).toEqual({
      nome: 'Informe seu nome',
      email: 'Informe um email válido',
      password: 'A senha precisa ter pelo menos 6 caracteres',
    })
  })
})

describe('nameFromEmail (AUTH-11)', () => {
  it('takes the part before "@"', () => {
    expect(nameFromEmail('ana@x.com')).toBe('ana')
  })
})
