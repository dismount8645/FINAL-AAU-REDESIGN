const { chromium } = require('playwright');
const path = require('path');

const BASE = 'http://localhost:3001';
const OUT = path.join(__dirname);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Re-check dashboard after i18n fix
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'dashboard-fixed.png'), fullPage: true });
  console.log('✓ dashboard-fixed');

  // Actual forum route
  await page.goto(BASE + '/forum/1', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'forum-post.png'), fullPage: true });
  console.log('✓ forum-post');

  // Mobile courses
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/courses', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'mobile-courses-fixed.png'), fullPage: true });
  console.log('✓ mobile-courses-fixed');

  await browser.close();
  console.log('Done.');
})();
