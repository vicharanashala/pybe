import { chromium } from 'playwright';

const baseUrl = process.env.PYBE_URL || 'http://localhost:5173/';
const sizes = [{ name: 'desktop', width: 1280, height: 900 }, { name: 'mobile', width: 390, height: 844 }];
const themes = ['light', 'dark'];
const allowList = ['.code-block', '.code-block *', '.cleared-stamp'];

function contrastScript(theme) {
  return ({ theme, allowList }) => {
    const parse = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const parts = match[1].split(',').map(Number);
      return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
    };
    const luminance = (color) => {
      const channels = [color.r, color.g, color.b].map((channel) => {
        const value = channel / 255;
        return value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
      });
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
    };
    const ratio = (foreground, background) => {
      const first = luminance(foreground); const second = luminance(background);
      return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
    };
    const visible = [...document.querySelectorAll('body *')].filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    const offenders = [];
    for (const element of visible) {
      const style = getComputedStyle(element);
      const allowed = allowList.some((selector) => element.matches(selector));
      let background = null;
      for (let current = element; current && !background; current = current.parentElement) {
        const candidate = parse(getComputedStyle(current).backgroundColor);
        if (candidate && candidate.a > .01) background = candidate;
      }
      if (background && !allowed) {
        const value = luminance(background);
        if (!['SVG', 'PATH', 'CIRCLE', 'RECT', 'G'].includes(element.tagName)) {
          if (theme === 'light' && value < .35) offenders.push({ type: 'dark-light-surface', selector: element.tagName + '.' + element.className, value: value.toFixed(3) });
          if (theme === 'dark' && value > .85) offenders.push({ type: 'bright-dark-surface', selector: element.tagName + '.' + element.className, value: value.toFixed(3) });
        }
      }
      const foreground = parse(style.color);
      if (foreground && background && foreground.a > .01 && background.a > .01 && !allowed && element.textContent.trim() && !['SVG', 'PATH', 'CIRCLE', 'RECT', 'G'].includes(element.tagName)) {
        const required = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18 && style.fontWeight >= 700) ? 3 : 4.5;
        const value = ratio(foreground, background);
        if (value < required) offenders.push({ type: 'text-contrast', selector: element.tagName + '.' + element.className, ratio: value.toFixed(2), required });
      }
    }
    return { theme, offenders };
  };
}

const browser = await chromium.launch({ headless: true, channel: process.env.PYBE_BROWSER_CHANNEL || 'chrome' });
const page = await browser.newPage();
let failures = 0;
for (const theme of themes) {
  for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate((activeTheme) => {
      localStorage.setItem('pybe.theme', activeTheme);
      localStorage.setItem('pybe.progress.v1', JSON.stringify({ version: 1, onboarded: true, currentPartId: 'rosewood-part-0', subStepIndex: { 'rosewood-part-0': 0 }, completedSlideIds: [], completedParts: [], questionAttempts: {}, reflections: {} }));
    }, theme);
    await page.reload({ waitUntil: 'networkidle' });
    await page.screenshot({ path: `artifacts/visual-${theme}-${size.name}.png`, fullPage: true });
    const result = await page.evaluate(contrastScript(theme), { theme, allowList });
    console.log(`${theme}/${size.name}: ${result.offenders.length ? `${result.offenders.length} offenders` : '0 offenders'}`);
    result.offenders.forEach((offender) => console.log(`  ${JSON.stringify(offender)}`));
    failures += result.offenders.length;
  }
}
await browser.close();
if (failures) process.exit(1);
console.log('Playwright luminance/contrast audit passed.');
