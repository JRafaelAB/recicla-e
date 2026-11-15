import { readdirSync } from 'node:fs'
import { test, expect, distUrl, distDir } from './fixtures'

// NFR-01 + NFR-02: both built files open from disk with the network blocked,
// and the build emits exactly these two self-contained files.
for (const file of ['index.html', 'gallery.html'] as const) {
  test(`dist/${file} loads from file:// offline and has a root element`, async ({ page }) => {
    expect(readdirSync(distDir).sort()).toEqual(['gallery.html', 'index.html'])
    await page.goto(distUrl(file))
    expect(page.url().startsWith('file:')).toBe(true)
    await expect(page.locator('#root')).toHaveCount(1)
  })
}
