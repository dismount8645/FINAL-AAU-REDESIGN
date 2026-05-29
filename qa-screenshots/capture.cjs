const { chromium } = require('playwright');
const path = require('path');

const BASE = 'http://localhost:3001';
const OUT = path.join(__dirname);

const PAGES = [
  ['dashboard',       '/'],
  ['courses',         '/courses'],
  ['course-1',        '/course/1'],
  ['course-1-modules','/course/1/modules'],
  ['course-1-pbl',    '/course/1/pbl'],
  ['course-1-resources','/course/1/resources'],
  ['grades',          '/grades'],
  ['favorites',       '/favorites'],
  ['messages',        '/messages'],
  ['notifications',   '/notifications'],
  ['forum-post-1',    '/forum-post/1'],
  ['search',          '/search?q=digital'],
  ['resources',       '/resources'],
  ['settings',        '/settings'],
  ['submission-1-101','/submission/1/101'],
  ['support',         '/support'],
  ['not-found',       '/this-page-does-not-exist'],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const [name, url] of PAGES) {
    try {
      await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
      console.log(`✓ ${name}`);
    } catch (e) {
      console.error(`✗ ${name}: ${e.message}`);
    }
  }

  // Mobile sweep for dashboard
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'mobile-dashboard.png'), fullPage: true });
  console.log('✓ mobile-dashboard');

  await page.goto(BASE + '/courses', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, 'mobile-courses.png'), fullPage: true });
  console.log('✓ mobile-courses');

  await browser.close();
  console.log('Done.');
})();
