import { test, expect } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from '../helpers'

test.describe('Calendar page', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page, '2026-06-01T12:00:00')
    await gotoPage(page, '/calendar')
    await waitForPageReady(page, 10000)
  })

  test('full page visual regression', async ({ page }) => {
    await screenshotPage(page, 'calendar-full', ['.dynamic-waves'])
  })

  test('page content is visible', async ({ page }) => {
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('view switcher exists', async ({ page }) => {
    const segmentedControl = page.locator('.segmented-control').first()
    await expect(segmentedControl).toBeVisible()
  })
})
