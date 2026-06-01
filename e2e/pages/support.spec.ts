import { test } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from '../helpers'

test.describe('Support page', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page)
    await gotoPage(page, '/support')
    await waitForPageReady(page)
  })

  test('full page visual regression', async ({ page }) => {
    await screenshotPage(page, 'support-full', ['.dynamic-waves'])
  })
})
