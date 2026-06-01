import { type Page, expect } from '@playwright/test'

/** Navigate to a route and wait for the page to be fully loaded */
export async function gotoPage(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'load' })
  expect(response?.status()).toBeLessThan(400)
}

/** Wait for lazy-loaded content to render, then settle framer-motion transitions */
export async function waitForPageReady(page: Page, timeout = 5000) {
  await page.waitForLoadState('domcontentloaded', { timeout })
  await page.waitForTimeout(500)
  await dismissViteOverlay(page)
}

/** Dismiss Vite error overlay if present (dev-only, won't appear in production) */
async function dismissViteOverlay(page: Page) {
  try {
    const overlay = page.locator('vite-error-overlay')
    if (await overlay.isVisible({ timeout: 1000 }).catch(() => false)) {
      await overlay.evaluate(el => el.remove())
      await page.waitForTimeout(300)
    }
  } catch {
    // ignore
  }
}

/** Take a full-page screenshot with standard options */
export async function screenshotPage(page: Page, name: string, mask?: string[]) {
  const maskLocators = mask ? mask.map((s) => page.locator(s)) : undefined
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    animations: 'disabled',
    threshold: 0.2,
    maxDiffPixelRatio: 0.02,
    timeout: 10000,
    mask: maskLocators,
  })
}

/** Freeze the clock to a fixed date for deterministic visual comparisons */
export async function freezeClock(page: Page, date = '2026-06-01T12:00:00') {
  await page.clock.install()
  await page.clock.setFixedTime(new Date(date))
}
