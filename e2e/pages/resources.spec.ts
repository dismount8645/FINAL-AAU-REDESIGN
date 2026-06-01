import { test } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from '../helpers'

test.describe('Resources page', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page)
    await gotoPage(page, '/resources')
    await waitForPageReady(page)
  })

  test('full page visual regression', async ({ page }) => {
    await screenshotPage(page, 'resources-full', ['.dynamic-waves'])
  })
})
