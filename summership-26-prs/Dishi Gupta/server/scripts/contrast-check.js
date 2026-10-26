const pairs = [
  ['dark body text', '#e8ddc3', '#0f0d0a'],
  ['dark secondary text', '#b5a888', '#0f0d0a'],
  ['light body text', '#1d1811', '#f1e4c8'],
  ['light secondary text', '#594b37', '#f1e4c8'],
  ['code text', '#ddd3ba', '#0b0908'],
  ['dark code panel code text', '#e8ddc3', '#171410'],
  ['dark code panel expl text', '#f0e6d2', '#171410'],
  ['light code panel code text', '#201b13', '#e5dac1'],
  ['light code panel expl text', '#18140e', '#e5dac1'],
  // Scrim captions over image (1280px desktop & 390px mobile, dark and light themes)
  // Worst-case blended scrim background: dark scrim (88% #0f0d0a) over pure white image (#2c2a27), and dark image (#0f0d0a)
  ['dark scrim caption title (worst-case over light image)', '#fff9eb', '#2c2a27'],
  ['dark scrim caption detail (worst-case over light image)', '#e3b94d', '#2c2a27'],
  ['dark scrim caption title (over dark image)', '#fff9eb', '#0f0d0a'],
  ['dark scrim caption detail (over dark image)', '#e3b94d', '#0f0d0a'],
  // Worst-case blended scrim background: light scrim (94% #fff9eb) over pure black image (#f0eae1), and light image (#fff9eb)
  ['light scrim caption title (worst-case over dark image)', '#1d1811', '#f0eae1'],
  ['light scrim caption detail (worst-case over dark image)', '#6d4a0e', '#f0eae1'],
  ['light scrim caption title (over light image)', '#1d1811', '#fff9eb'],
  ['light scrim caption detail (over light image)', '#6d4a0e', '#fff9eb']
];

function channel(hex) {
  const value = parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 255, value & 255].map((part) => {
    const s = part / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
}
function luminance(hex) { const [r, g, b] = channel(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
function ratio(foreground, background) { const a = luminance(foreground); const b = luminance(background); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); }

let failed = false;
for (const [label, foreground, background] of pairs) {
  const value = ratio(foreground, background);
  console.log(`${label}: ${value.toFixed(2)}:1`);
  if (value < 4.5) failed = true;
}
if (failed) { console.error('Contrast check failed: normal text must reach 4.5:1.'); process.exit(1); }
console.log('Contrast check passed: all checked normal-text pairs meet WCAG AA (>= 4.5:1).');

