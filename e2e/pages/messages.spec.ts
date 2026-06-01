import { test, expect } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from '../helpers'

test.describe('Messages page', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page)
    await gotoPage(page, '/messages')
    await waitForPageReady(page)
  })

  test('full page visual regression', async ({ page }) => {
    await screenshotPage(page, 'messages-full', ['.dynamic-waves'])
  })

  test('page content is visible', async ({ page }) => {
    await expect(page.locator('#main-content')).toBeVisible()
  })
})
