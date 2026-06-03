import { PlaywrightCrawler } from 'crawlee';
import fs from 'fs';

// Create a folder for the images if it doesn't already exist
if (!fs.existsSync('./screenshots')) {
    fs.mkdirSync('./screenshots');
}

const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, enqueueLinks }) {
        console.log(`Scanning: ${request.url}`);
        await page.waitForLoadState('networkidle');

        // Create a base file name for this specific URL
        const safeBaseName = request.url.replace(/https?:\/\//, '').replace(/[^a-z0-9]/gi, '_');

        // 1. Take a screenshot of the default, untouched page first
        await page.screenshot({
            path: `./screenshots/${safeBaseName}_00_Base.png`,
            fullPage: true
        });

        // 2. Define what you want the bot to click. 
        // This targets standard buttons, ARIA tabs, and typical accordion classes.
        const interactables = page.locator('button, [role="tab"], .accordion, [aria-expanded]');
        const count = await interactables.count();
        console.log(`Found ${count} clickable elements. Capturing states...`);

        // 3. Loop through every single element, click it, and take a picture
        for (let i = 0; i < count; i++) {
            try {
                const element = interactables.nth(i);

                // Only try to click if the element is actually visible on screen
                if (await element.isVisible()) {
                    await element.click();

                    // CRITICAL: Wait half a second (500ms) for CSS animations to slide open
                    await page.waitForTimeout(500);

                    // Take a screenshot of the new state, numbering them so they stay organized
                    // e.g., localhost_3000_settings_01_State.png
                    // We use String(i + 1).padStart(2, '0') to make numbers look like 01, 02, 03
                    const stateNumber = String(i + 1).padStart(2, '0');
                    await page.screenshot({
                        path: `./screenshots/${safeBaseName}_${stateNumber}_State.png`,
                        fullPage: true
                    });
                }
            } catch (error) {
                // If a specific button acts weird or is unclickable, ignore it and keep going
            }
        }

        // 4. Once it clicks everything on this page, look for links to move to the NEXT page
        await enqueueLinks({
            strategy: 'same-domain'
        });
    },
});

// REPLACE THIS WITH YOUR WEBSITE'S URL
await crawler.run(['http://localhost:3000']);