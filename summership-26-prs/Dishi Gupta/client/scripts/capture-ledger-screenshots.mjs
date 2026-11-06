import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:\\Users\\91858\\.gemini\\antigravity-ide\\brain\\e2e99dd5-f257-46f4-8c90-71e992ec5e31\\screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const baseUrl = 'http://localhost:5173/';

async function run() {
  console.log('Launching browser for ledger screenshots...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 850 });

  try {
    // =========================================================
    // 1. EMPTY STATE
    // =========================================================
    // A. Dark theme empty state
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'dark');
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        currentPartId: 'rosewood-part-0',
        subStepIndex: { 'rosewood-part-0': 0 },
        completedParts: [],
        completedAt: {},
        completedSlideIds: [],
        questionAttempts: {},
        reflections: {},
        seenReveals: []
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    // Click Ledger button in TopBar
    await page.click('button:has-text("Ledger")');
    await page.waitForSelector('.ledger');
    const ss1 = path.join(screenshotDir, 'ledger-empty-dark.png');
    await page.screenshot({ path: ss1, fullPage: false });
    console.log('Saved:', ss1);

    // B. Light theme empty state
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'light');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('button:has-text("Ledger")');
    await page.waitForSelector('.ledger');
    const ss2 = path.join(screenshotDir, 'ledger-empty-light.png');
    await page.screenshot({ path: ss2, fullPage: false });
    console.log('Saved:', ss2);

    // =========================================================
    // 2. TWO ENTRIES (completed 2 files: part-0 and part-1)
    // =========================================================
    // A. Dark theme with two entries
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'dark');
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        currentPartId: 'rosewood-part-2',
        subStepIndex: { 'rosewood-part-2': 0 },
        completedParts: ['rosewood-part-0', 'rosewood-part-1'],
        completedAt: {
          'rosewood-part-0': '2026-10-18T09:15:00.000Z',
          'rosewood-part-1': '2026-10-18T09:42:00.000Z'
        },
        completedSlideIds: [],
        questionAttempts: {},
        reflections: {},
        seenReveals: ['rosewood-part-1']
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('button:has-text("Ledger")');
    await page.waitForSelector('.ledger');
    await page.waitForSelector('.ledger-entry');
    const entriesTwo = await page.$$('.ledger-entry');
    console.log(`Found ${entriesTwo.length} ledger entries (expected 2)`);

    const ss3 = path.join(screenshotDir, 'ledger-two-entries-dark.png');
    await page.screenshot({ path: ss3, fullPage: false });
    console.log('Saved:', ss3);

    // B. Light theme with two entries
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'light');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('button:has-text("Ledger")');
    await page.waitForSelector('.ledger');
    const ss4 = path.join(screenshotDir, 'ledger-two-entries-light.png');
    await page.screenshot({ path: ss4, fullPage: false });
    console.log('Saved:', ss4);

    // =========================================================
    // 3. AFTER COMPLETING A THIRD FILE (part-0, part-1, part-2)
    // =========================================================
    // A. Dark theme with three entries
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'dark');
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        currentPartId: 'rosewood-part-3',
        subStepIndex: { 'rosewood-part-3': 0 },
        completedParts: ['rosewood-part-0', 'rosewood-part-1', 'rosewood-part-2'],
        completedAt: {
          'rosewood-part-0': '2026-10-18T09:15:00.000Z',
          'rosewood-part-1': '2026-10-18T09:42:00.000Z',
          'rosewood-part-2': '2026-10-18T10:05:00.000Z'
        },
        completedSlideIds: [],
        questionAttempts: {},
        reflections: {},
        seenReveals: ['rosewood-part-1', 'rosewood-part-2']
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('button:has-text("Ledger")');
    await page.waitForSelector('.ledger');
    await page.waitForSelector('.ledger-entry');
    const entriesThree = await page.$$('.ledger-entry');
    console.log(`Found ${entriesThree.length} ledger entries (expected 3)`);

    const ss5 = path.join(screenshotDir, 'ledger-three-entries-dark.png');
    await page.screenshot({ path: ss5, fullPage: false });
    console.log('Saved:', ss5);

    // B. Light theme with three entries
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'light');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('button:has-text("Ledger")');
    await page.waitForSelector('.ledger');
    const ss6 = path.join(screenshotDir, 'ledger-three-entries-light.png');
    await page.screenshot({ path: ss6, fullPage: false });
    console.log('Saved:', ss6);

    // Mobile view check (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const ss7 = path.join(screenshotDir, 'ledger-three-entries-mobile.png');
    await page.screenshot({ path: ss7, fullPage: false });
    console.log('Saved:', ss7);

    console.log('\nAll ledger screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
