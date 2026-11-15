import { test as base, expect } from '@playwright/test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

export const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

/** file:// URL of a built page in dist/ (NFR-02: opened directly from disk). */
export function distUrl(file: 'index.html' | 'gallery.html'): string {
  return pathToFileURL(path.join(distDir, file)).href
}

/**
 * NFR-01: every test fails on any request whose URL is not file:.
 * Non-file requests are aborted and recorded; the fixture asserts none happened.
 */
export const test = base.extend<{ blockedRequests: string[] }>({
  blockedRequests: [
    async ({ context }, use) => {
      const blocked: string[] = []
      await context.route('**/*', (route) => {
        const url = route.request().url()
        if (url.startsWith('file:')) return route.continue()
        blocked.push(url)
        return route.abort()
      })
      await use(blocked)
      expect(blocked, 'non-file: network requests (NFR-01)').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
