import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const screenshotDir = 'C:\\Users\\91858\\.gemini\\antigravity-ide\\brain\\e2e99dd5-f257-46f4-8c90-71e992ec5e31\\screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const baseUrl = 'http://localhost:5173/';

async function run() {
  console.log('Launching browser for verification and screenshots...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage();

  const results = {
    screenshots: [],
    tests: []
  };

  try {
    // -------------------------------------------------------------
    // 1. Reveal Screen - Dark Desktop (1280x850)
    // -------------------------------------------------------------
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'dark');
      localStorage.setItem('pybe.reveals.v1', JSON.stringify({
        version: 1,
        seen: ['rosewood-part-1'],
        lastUpdated: new Date().toISOString()
      }));
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        currentPartId: 'rosewood-part-1',
        subStepIndex: { 'rosewood-part-1': 9 },
        completedSlideIds: ['part-1-slide-0', 'part-1-slide-1', 'part-1-slide-2', 'part-1-slide-3', 'part-1-slide-4', 'part-1-slide-5', 'part-1-slide-6', 'part-1-slide-7', 'part-1-slide-8'],
        completedParts: ['rosewood-part-0'],
        seenReveals: ['rosewood-part-1'],
        questionAttempts: {},
        reflections: {}
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.case-closed-reveal-card');
    await page.waitForSelector('.code-panel-container');

    // Hover first code row to demonstrate interactive highlight
    await page.hover('.code-annotated-row');
    const ss1 = path.join(screenshotDir, 'reveal-dark-desktop.png');
    await page.screenshot({ path: ss1, fullPage: false });
    results.screenshots.push({ name: 'reveal-dark-desktop', path: ss1 });
    console.log('Saved:', ss1);

    // -------------------------------------------------------------
    // 2. Reveal Screen - Dark Mobile (390x844)
    // -------------------------------------------------------------
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const ss2 = path.join(screenshotDir, 'reveal-dark-mobile.png');
    await page.screenshot({ path: ss2, fullPage: false });
    results.screenshots.push({ name: 'reveal-dark-mobile', path: ss2 });
    console.log('Saved:', ss2);

    // -------------------------------------------------------------
    // 3. Reveal Screen - Light Desktop (1280x850)
    // -------------------------------------------------------------
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'light');
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.case-closed-reveal-card');
    await page.hover('.code-annotated-row');
    const ss3 = path.join(screenshotDir, 'reveal-light-desktop.png');
    await page.screenshot({ path: ss3, fullPage: false });
    results.screenshots.push({ name: 'reveal-light-desktop', path: ss3 });
    console.log('Saved:', ss3);

    // -------------------------------------------------------------
    // 4. Reveal Screen - Light Mobile (390x844)
    // -------------------------------------------------------------
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const ss4 = path.join(screenshotDir, 'reveal-light-mobile.png');
    await page.screenshot({ path: ss4, fullPage: false });
    results.screenshots.push({ name: 'reveal-light-mobile', path: ss4 });
    console.log('Saved:', ss4);

    // -------------------------------------------------------------
    // 5. Debrief Screen - Compact Recap Table (1280x850, dark)
    // -------------------------------------------------------------
    await page.setViewportSize({ width: 1280, height: 850 });
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'dark');
      localStorage.setItem('pybe.reveals.v1', JSON.stringify({
        version: 1,
        seen: ['rosewood-part-1', 'rosewood-part-2', 'rosewood-part-3', 'rosewood-part-4'],
        lastUpdated: new Date().toISOString()
      }));
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        caseSolved: true,
        currentPartId: 'rosewood-part-5',
        subStepIndex: { 'rosewood-part-5': 9 },
        completedParts: ['rosewood-part-0', 'rosewood-part-1', 'rosewood-part-2', 'rosewood-part-3', 'rosewood-part-4'],
        seenReveals: ['rosewood-part-1', 'rosewood-part-2', 'rosewood-part-3', 'rosewood-part-4'],
        completedSlideIds: [],
        questionAttempts: {},
        reflections: {}
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.compact-recap-table');

    // Confirm no long code list
    const codePanelsOnDebrief = await page.$$('.compact-recap-table ~ .code-panel-container');
    const recapRows = await page.$$('.compact-recap-row');
    console.log(`Debrief check: ${recapRows.length} recap rows found, ${codePanelsOnDebrief.length} unwanted standalone code panels.`);
    results.tests.push({
      test: 'Debrief compact table structure',
      passed: recapRows.length === 4 && codePanelsOnDebrief.length === 0
    });

    const ss5 = path.join(screenshotDir, 'debrief-compact-recap.png');
    await page.screenshot({ path: ss5, fullPage: false });
    results.screenshots.push({ name: 'debrief-compact-recap', path: ss5 });
    console.log('Saved:', ss5);

    // -------------------------------------------------------------
    // 6. Dark-mode Scene Caption with Scrim (1280x850, dark)
    // -------------------------------------------------------------
    await page.evaluate(() => {
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        currentPartId: 'rosewood-part-0',
        subStepIndex: { 'rosewood-part-0': 3 },
        completedParts: [],
        seenReveals: [],
        completedSlideIds: [],
        questionAttempts: {},
        reflections: {}
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('.scene-scrim');

    const sceneElement = await page.$('.scene');
    const ss6 = path.join(screenshotDir, 'scene-scrim-dark.png');
    if (sceneElement) {
      await sceneElement.screenshot({ path: ss6 });
    } else {
      await page.screenshot({ path: ss6 });
    }
    results.screenshots.push({ name: 'scene-scrim-dark', path: ss6 });
    console.log('Saved:', ss6);

    // -------------------------------------------------------------
    // 7. Functional Tests:
    // A. Modal opens when clicking "View code" on debrief or </> in sidebar
    // -------------------------------------------------------------
    // Go to part 2 with part 1 completed
    await page.evaluate(() => {
      localStorage.setItem('pybe.theme', 'dark');
      localStorage.setItem('pybe.reveals.v1', JSON.stringify({
        version: 1,
        seen: ['rosewood-part-1'],
        lastUpdated: new Date().toISOString()
      }));
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        currentPartId: 'rosewood-part-2',
        subStepIndex: { 'rosewood-part-2': 0 },
        completedParts: ['rosewood-part-0', 'rosewood-part-1'],
        seenReveals: ['rosewood-part-1'],
        completedSlideIds: [],
        questionAttempts: {},
        reflections: {}
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });

    // Check sidebar buttons
    const sidebarCodeBtns = await page.$$('.sidebar-code-icon-btn');
    console.log(`Sidebar </> buttons visible: ${sidebarCodeBtns.length} (only completed parts with code should have it)`);
    results.tests.push({
      test: 'Sidebar code buttons only on completed parts',
      passed: sidebarCodeBtns.length === 1 // Only part 1 is completed and has code (part 0 has no code, part 2-5 not completed)
    });

    // Click the sidebar </> button
    await sidebarCodeBtns[0].click();
    await page.waitForSelector('.code-modal-dialog');
    const modalTitle = await page.$eval('.code-modal-dialog .reveal-main-title', el => el.textContent);
    console.log(`Modal opened with title: "${modalTitle}"`);
    results.tests.push({
      test: 'Sidebar </> button opens code modal for completed file',
      passed: modalTitle.includes('File 1') || modalTitle.includes('Messy Notes')
    });

    // Close the modal
    await page.click('.code-modal-close-btn');
    await page.waitForSelector('.code-modal-dialog', { state: 'detached' });
    results.tests.push({
      test: 'Code modal closes when close button clicked',
      passed: true
    });

    // -------------------------------------------------------------
    // B. Reload persistence:
    // Navigate to reveal slide of part 1, reload, verify stay on reveal slide
    // -------------------------------------------------------------
    await page.evaluate(() => {
      localStorage.setItem('pybe.progress.v1', JSON.stringify({
        version: 1,
        onboarded: true,
        currentPartId: 'rosewood-part-1',
        subStepIndex: { 'rosewood-part-1': 9 },
        completedParts: ['rosewood-part-0'],
        seenReveals: ['rosewood-part-1'],
        completedSlideIds: [],
        questionAttempts: {},
        reflections: {}
      }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    const isRevealPresent = await page.$('.case-closed-reveal-card');
    results.tests.push({
      test: 'Reload on reveal slide maintains reveal slide',
      passed: Boolean(isRevealPresent)
    });

    // Click "Continue to next file"
    await page.click('.reveal-continue-btn');
    await page.waitForTimeout(500);

    const activePartAfterContinue = await page.evaluate(() => {
      const prog = JSON.parse(localStorage.getItem('pybe.progress.v1') || '{}');
      return prog.currentPartId;
    });
    console.log(`After continue, currentPartId: ${activePartAfterContinue}`);
    results.tests.push({
      test: 'Continue button advances to next part',
      passed: activePartAfterContinue === 'rosewood-part-2'
    });

    console.log('\n--- VERIFICATION RESULTS ---');
    console.log(JSON.stringify(results, null, 2));

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
