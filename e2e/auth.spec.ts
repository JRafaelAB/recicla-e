import { test, expect } from './fixtures'
import { openWith, readSaved, loggedIn } from './helpers'
import type { Page } from '@playwright/test'

const login = (page: Page) => page.getByTestId('screen-login')
const signup = (page: Page) => page.getByTestId('screen-signup')

async function fillLogin(page: Page, email: string, password: string) {
  await login(page).getByLabel('Email').fill(email)
  await login(page).getByLabel('Senha').fill(password)
  await login(page).getByRole('button', { name: 'Entrar' }).click()
}

async function fillSignup(page: Page, nome: string, email: string, password: string) {
  await signup(page).getByLabel('Nome').fill(nome)
  await signup(page).getByLabel('Email').fill(email)
  await signup(page).getByLabel('Senha').fill(password)
  await signup(page).getByRole('button', { name: 'Cadastrar' }).click()
}

test('AUTH-01: fresh open shows email, senha, "Entrar" and "Criar conta"', async ({ page }) => {
  await openWith(page)
  await expect(login(page).getByLabel('Email')).toBeVisible()
  await expect(login(page).getByLabel('Senha')).toHaveAttribute('type', 'password')
  await expect(login(page).getByRole('button', { name: 'Entrar' })).toBeVisible()
  await expect(login(page).getByRole('button', { name: 'Criar conta' })).toBeVisible()
})

test('AUTH-04: login with an email without "@" shows the error under the email field and stays', async ({ page }) => {
  await openWith(page)
  await fillLogin(page, 'anax.com', 'abcdef')
  await expect(login(page).getByLabel('Email')).toHaveAccessibleDescription('Informe um email válido')
  await expect(login(page).getByText('A senha precisa ter pelo menos 6 caracteres')).toHaveCount(0)
  await expect(login(page)).toBeVisible()
  expect(await readSaved(page)).toBeNull()
})

test('AUTH-05: login with a short password shows the error under the senha field and stays', async ({ page }) => {
  await openWith(page)
  await fillLogin(page, 'ana@x.com', 'abcde')
  await expect(login(page).getByLabel('Senha')).toHaveAccessibleDescription('A senha precisa ter pelo menos 6 caracteres')
  await expect(login(page).getByText('Informe um email válido')).toHaveCount(0)
  await expect(login(page)).toBeVisible()
})

test('AUTH-03: "Criar conta" shows the sign-up form with nome, email, senha and "Cadastrar"', async ({ page }) => {
  await openWith(page)
  await login(page).getByRole('button', { name: 'Criar conta' }).click()
  await expect(signup(page).getByLabel('Nome')).toBeVisible()
  await expect(signup(page).getByLabel('Email')).toBeVisible()
  await expect(signup(page).getByLabel('Senha')).toBeVisible()
  await expect(signup(page).getByRole('button', { name: 'Cadastrar' })).toBeVisible()
})

test('AUTH-04..06: sign-up shows each error under its field and stays', async ({ page }) => {
  await openWith(page)
  await login(page).getByRole('button', { name: 'Criar conta' }).click()
  await fillSignup(page, '', 'anax.com', '123')
  await expect(signup(page).getByLabel('Nome')).toHaveAccessibleDescription('Informe seu nome')
  await expect(signup(page).getByLabel('Email')).toHaveAccessibleDescription('Informe um email válido')
  await expect(signup(page).getByLabel('Senha')).toHaveAccessibleDescription('A senha precisa ter pelo menos 6 caracteres')
  await expect(signup(page)).toBeVisible()
  expect(await readSaved(page)).toBeNull()
})

test('AUTH-06: sign-up with only the nome empty shows only "Informe seu nome"', async ({ page }) => {
  await openWith(page)
  await login(page).getByRole('button', { name: 'Criar conta' }).click()
  await fillSignup(page, '', 'ana@x.com', 'abcdef')
  await expect(signup(page).getByRole('alert')).toHaveText(['Informe seu nome'])
  await expect(signup(page)).toBeVisible()
})

test('AUTH-09: "Já tenho conta" returns to the login screen', async ({ page }) => {
  await openWith(page)
  await login(page).getByRole('button', { name: 'Criar conta' }).click()
  await signup(page).getByRole('button', { name: 'Já tenho conta' }).click()
  await expect(login(page)).toBeVisible()
})

test('AUTH-07 / AUTH-11: valid login without onboarding saves the session, names the user from the email and opens onboarding', async ({ page }) => {
  await openWith(page)
  await fillLogin(page, 'ana@x.com', 'abcdef')
  await expect(page.getByTestId('screen-onboarding')).toBeVisible()
  expect(await readSaved(page)).toMatchObject({ session: true, name: 'ana' })
})

test('AUTH-08: valid login with onboarding done opens the home map', async ({ page }) => {
  await openWith(page, loggedIn({ session: false, name: 'Ana' }))
  await fillLogin(page, 'outra@x.com', 'abcdef')
  await expect(page.getByTestId('screen-home')).toBeVisible()
  // AUTH-11 only applies when no name is stored.
  expect(await readSaved(page)).toMatchObject({ session: true, name: 'Ana' })
})

test('AUTH-10 / AUTH-07: sign up as "Ana" stores the name and opens onboarding; reload stays logged in (AUTH-02)', async ({ page }) => {
  await openWith(page)
  await login(page).getByRole('button', { name: 'Criar conta' }).click()
  await fillSignup(page, 'Ana', 'ana.souza@x.com', 'abcdef')
  await expect(page.getByTestId('screen-onboarding')).toBeVisible()
  expect(await readSaved(page)).toMatchObject({ session: true, name: 'Ana' })
  await page.reload()
  await expect(page.getByTestId('screen-onboarding')).toBeVisible()
  await expect(login(page)).toHaveCount(0)
})
