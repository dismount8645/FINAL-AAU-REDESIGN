import { test, expect } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from '../helpers'

test.describe('Courses page', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page)
    await gotoPage(page, '/courses')
    await waitForPageReady(page)
  })

  test('full page visual regression', async ({ page }) => {
    await screenshotPage(page, 'courses-full', ['.dynamic-waves'])
  })

  test('displays course cards', async ({ page }) => {
    const courseCards = page.locator('[data-testid="page-content"]')
    await expect(courseCards).toBeVisible()
  })

  test('toggles course sections', async ({ page }) => {
    const sectionButtons = page.locator('button').filter({ hasText: /Kurser|Fora/i })
    const count = await sectionButtons.count()
    expect(count).toBeGreaterThan(0)
  })

  test('shows promo card', async ({ page }) => {
    const promoCard = page.locator('text=Klar til næste semester')
    await expect(promoCard).toBeVisible()
  })
})
