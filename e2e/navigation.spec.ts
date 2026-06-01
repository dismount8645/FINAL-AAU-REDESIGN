import { test, expect } from '@playwright/test'
import { gotoPage, waitForPageReady } from './helpers'

const ROUTES = [
  { path: '/', label: 'Dashboard' },
  { path: '/calendar', label: 'Kalender' },
  { path: '/courses', label: 'Kurser' },
  { path: '/course/1', label: 'Course Detail' },
  { path: '/support', label: 'Support' },
  { path: '/settings', label: 'Indstillinger' },
  { path: '/messages', label: 'Beskeder' },
  { path: '/resources', label: 'Ressourcer' },
  { path: '/notifications', label: 'Notifikationer' },
  { path: '/submission/1/1', label: 'Submission' },
  { path: '/search', label: 'Søgeresultater' },
  { path: '/grades', label: 'Karakterer' },
  { path: '/favorites', label: 'Favoritter' },
  { path: '/forum/1', label: 'Forum' },
]

test.describe('Navigation smoke test — all routes load', () => {
  for (const route of ROUTES) {
    test(`${route.label} loads without errors`, async ({ page }) => {
      await gotoPage(page, route.path)
      await waitForPageReady(page)

      const mainContent = page.locator('#main-content')
      await expect(mainContent).toBeVisible({ timeout: 15000 })
    })
  }
})

test('404 page for unknown routes', async ({ page }) => {
  await gotoPage(page, '/this-route-does-not-exist')
  await waitForPageReady(page)
  await expect(page.locator('#main-content')).toBeVisible()
})

test('sidebar navigation navigates to courses', async ({ page }) => {
  await gotoPage(page, '/')
  await waitForPageReady(page)

  // Use evaluate to click — works on all viewports since element is always in DOM
  await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>('#sidebar a[href="/courses"]')
    if (link) link.click()
  })
  await expect(page).toHaveURL(/\/courses/)
})
