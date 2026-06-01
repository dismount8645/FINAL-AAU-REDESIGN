import { test, expect } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from '../helpers'

test.describe('Favorites page', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page)
    await gotoPage(page, '/favorites')
    await waitForPageReady(page)
  })

  test('full page visual regression', async ({ page }) => {
    await screenshotPage(page, 'favorites-full', ['.dynamic-waves'])
  })

  test('shows favorites list', async ({ page }) => {
    const content = page.locator('[data-testid="page-content"]')
    await expect(content).toBeVisible()
  })
})
