import { test } from '@playwright/test'
import { gotoPage, waitForPageReady, screenshotPage, freezeClock } from './helpers'

const KEY_PAGES = [
  { path: '/', name: 'dashboard' },
  { path: '/courses', name: 'courses' },
  { path: '/grades', name: 'grades' },
  { path: '/messages', name: 'messages' },
  { path: '/settings', name: 'settings' },
  { path: '/search', name: 'search' },
  { path: '/calendar', name: 'calendar' },
  { path: '/favorites', name: 'favorites' },
  { path: '/support', name: 'support' },
  { path: '/resources', name: 'resources' },
  { path: '/notifications', name: 'notifications' },
]

const WAVE_BG = ['.dynamic-waves']

test.describe('Responsive visual regression', () => {
  for (const viewport of [
    { name: 'Desktop 1280x720', width: 1280, height: 720, prefix: 'desktop' },
    { name: 'Tablet 768x1024', width: 768, height: 1024, prefix: 'tablet' },
    { name: 'Mobile 375x667', width: 375, height: 667, prefix: 'mobile' },
  ]) {
    for (const page of KEY_PAGES) {
      test(`${viewport.name} — ${page.name}`, async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
        const p = await ctx.newPage()
        await freezeClock(p)
        await gotoPage(p, page.path)
        await waitForPageReady(p)
        await screenshotPage(p, `${viewport.prefix}-${page.name}`, WAVE_BG)
        await ctx.close()
      })
    }
  }
})
