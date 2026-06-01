import { test } from '@playwright/test';
import { gotoPage, waitForPageReady } from './helpers';
import * as fs from 'fs';
import * as path from 'path';

const PAGES = [
  { path: '/', name: 'dashboard' },
  { path: '/calendar', name: 'calendar' },
  { path: '/favorites', name: 'favorites' },
  { path: '/courses', name: 'courses' },
  { path: '/resources', name: 'resources' },
  { path: '/support', name: 'support' },
  { path: '/settings', name: 'settings' },
  { path: '/messages', name: 'messages-page' },
  { path: '/notifications', name: 'notifications-page' },
  { path: '/course/1', name: 'course-detail' },
  { path: '/submission/1/105', name: 'submission' },
  { path: '/search?q=design', name: 'search-results' },
  { path: '/grades', name: 'grades' },
  { path: '/forum/1', name: 'forum-post' },
];

const VIEWPORTS = [
  { prefix: 'desktop', width: 1920, height: 1080 },
  { prefix: 'tablet', width: 768, height: 1024 },
  { prefix: 'mobile', width: 375, height: 812 },
];

test.describe('Capture all screenshots', () => {
  test('capture viewports and overlays', async ({ page }, testInfo) => {
    testInfo.setTimeout(240000); // 4 minutes timeout
    if (testInfo.project.name !== 'desktop-chromium') {
      test.skip();
      return;
    }

    // Listen for browser console and page errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Browser console error: ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      console.error(`Browser runtime error: ${err.message}`);
    });

    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    const artifactDir = 'C:/Users/Jacob/.gemini/antigravity-cli/brain/121bdead-18b1-4cd0-8d20-17d2b2dbe0b8';

    // Cleanup old viewport folders in screenshotsDir and artifactDir
    for (const vp of ['desktop', 'tablet', 'mobile']) {
      try {
        fs.rmSync(path.join(screenshotsDir, vp), { recursive: true, force: true });
      } catch (e) {
        console.warn(`Could not clean up screenshots/${vp}: ${e}`);
      }
      try {
        fs.rmSync(path.join(artifactDir, vp), { recursive: true, force: true });
      } catch (e) {
        console.warn(`Could not clean up artifacts/${vp}: ${e}`);
      }
    }

    // Clean up flat png files in screenshotsDir
    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);
      for (const file of files) {
        const filePath = path.join(screenshotsDir, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.png')) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn(`Could not delete file ${file}: ${e}`);
          }
        }
      }
    } else {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Clean up flat png files in artifactDir
    if (fs.existsSync(artifactDir)) {
      const files = fs.readdirSync(artifactDir);
      for (const file of files) {
        const filePath = path.join(artifactDir, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.png')) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn(`Could not delete file ${file}: ${e}`);
          }
        }
      }
    } else {
      fs.mkdirSync(artifactDir, { recursive: true });
    }

    const triggerLazyLoad = async () => {
      await page.evaluate(async () => {
        const getScrollHeight = () => Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        let scrollHeight = getScrollHeight();
        let currentScroll = 0;
        const step = 200;
        
        while (currentScroll < scrollHeight) {
          window.scrollBy(0, step);
          currentScroll += step;
          await new Promise(r => setTimeout(r, 60));
          scrollHeight = getScrollHeight();
        }
        
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
    };

    // Helper to capture page or overlay in subfolder based on site name
    const capture = async (siteName: string, viewportPrefix: string, cleanName: string, isFullPage: boolean) => {
      const destSubDir = path.join(screenshotsDir, siteName);
      if (!fs.existsSync(destSubDir)) {
        fs.mkdirSync(destSubDir, { recursive: true });
      }
      const destArtifactSubDir = path.join(artifactDir, siteName);
      if (!fs.existsSync(destArtifactSubDir)) {
        fs.mkdirSync(destArtifactSubDir, { recursive: true });
      }

      const filename = `${viewportPrefix}-${cleanName}.png`;
      const screenshotPath = path.join(destSubDir, filename);
      await page.screenshot({ path: screenshotPath, fullPage: isFullPage });
      console.log(`Saved screenshot to ${screenshotPath}`);

      const artifactPath = path.join(destArtifactSubDir, filename);
      try {
        fs.copyFileSync(screenshotPath, artifactPath);
      } catch (e) {
        console.error(`Failed to copy screenshot to artifacts: ${e}`);
      }
    };

    // Loop viewports
    for (const vp of VIEWPORTS) {
      console.log(`--- Processing Viewport: ${vp.prefix} (${vp.width}x${vp.height}) ---`);
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Capture All Standard Pages
      for (const p of PAGES) {
        console.log(`Navigating to page ${p.path} under ${vp.prefix}`);
        await gotoPage(page, p.path);
        await waitForPageReady(page);
        
        const skeleton = page.locator('div[role="status"][aria-busy="true"]');
        await skeleton.waitFor({ state: 'detached', timeout: 8000 }).catch(() => {
          console.warn(`Skeleton did not detach within timeout on ${p.path}`);
        });

        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        await triggerLazyLoad();
        
        await capture(p.name, vp.prefix, p.name, true);
      }

      // 2. Capture Overlays/Drawers on Dashboard Page
      // A. Notifications Dropdown
      console.log(`Capturing Notifications overlay under ${vp.prefix}`);
      await gotoPage(page, '/');
      await waitForPageReady(page);
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      
      const notifBtn = page.locator('button[aria-label*="notif"], button[aria-label*="Notif"]').first();
      if (await notifBtn.isVisible()) {
        await notifBtn.click();
        await page.waitForTimeout(800);
        await capture('overlay-notifications', vp.prefix, 'overlay-notifications', false);
      }

      // B. Messages Dropdown
      console.log(`Capturing Messages overlay under ${vp.prefix}`);
      await gotoPage(page, '/');
      await waitForPageReady(page);
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      const msgBtn = page.locator('button[aria-label*="message"], button[aria-label*="Beskeder"], button[aria-label*="beskeder"]').first();
      if (await msgBtn.isVisible()) {
        await msgBtn.click();
        await page.waitForTimeout(800);
        await capture('overlay-messages', vp.prefix, 'overlay-messages', false);
      }

      // C. Profile Dropdown
      console.log(`Capturing Profile overlay under ${vp.prefix}`);
      await gotoPage(page, '/');
      await waitForPageReady(page);
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

      const profileBtn = page.locator('button[aria-label*="user"], button[aria-label*="Brugermenu"], button[aria-label*="User"]').first();
      if (await profileBtn.isVisible()) {
        await profileBtn.click();
        await page.waitForTimeout(800);
        await capture('overlay-profile', vp.prefix, 'overlay-profile', false);
      }

      // D. Mobile Navigation Drawer/Sidebar (only for mobile/phone viewports)
      if (vp.prefix === 'mobile') {
        console.log('Capturing Mobile Sidebar overlay');
        await gotoPage(page, '/');
        await waitForPageReady(page);
        await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

        const sidebarBtn = page.locator('button[aria-label*="toggle_sidebar"], button[aria-label*="Toggle sidebar"], button[aria-label*="Skift sidepanel"], nav.fixed.top-0 button').first();
        if (await sidebarBtn.isVisible()) {
          await sidebarBtn.click();
          await page.waitForTimeout(800);
          await capture('overlay-sidebar', vp.prefix, 'overlay-sidebar', false);
        }
      }
    }
  });
});
