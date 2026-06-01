import { test, expect } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from '../helpers'

test.describe('404 Not Found page', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page)
    await gotoPage(page, '/this-page-definitely-does-not-exist-12345')
    await waitForPageReady(page)
  })

  test('full page visual regression', async ({ page }) => {
    await screenshotPage(page, 'not-found-full', ['.dynamic-waves'])
  })

  test('shows 404 message', async ({ page }) => {
    await expect(page.locator('#main-content')).toBeVisible()
  })
})
