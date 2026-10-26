const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const scanRoot = path.join(root, 'client', 'src');
const tokenFiles = new Set([path.join(scanRoot, 'type.css')]);

// Flag any font-size that does not reference var(--type-...) tokens
const rawFontSizePattern = /font-size:\s*(?!\s*var\(--type-)[^;]+;/gi;
// Flag any shorthand font rule using literal size units rather than var(--type-...) tokens
const rawFontShorthandPattern = /font:\s*(?!\s*var\(--type-)[^;]*\b(?:\d*\.?\d+(?:px|rem|em|%|pt))\b[^;]*;/gi;

const offenders = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(css|jsx|js|mjs|html)$/.test(entry.name) && !tokenFiles.has(full)) {
      const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        // Skip comment lines
        const stripped = line.trim();
        if (stripped.startsWith('/*') || stripped.startsWith('//') || stripped.startsWith('*')) return;

        for (const match of line.matchAll(rawFontSizePattern)) {
          offenders.push(`${path.relative(root, full)}:${index + 1}: ${match[0].trim()}`);
        }
        for (const match of line.matchAll(rawFontShorthandPattern)) {
          offenders.push(`${path.relative(root, full)}:${index + 1}: ${match[0].trim()}`);
        }
      });
    }
  }
}

walk(scanRoot);
console.log('Type tokens: client/src/type.css');
console.log('Scanned active JSX/JS/CSS modules outside the token file.');

if (offenders.length) {
  console.error(`Type audit failed: found ${offenders.length} raw font size(s) outside token files:`);
  offenders.forEach((offender) => console.error(`- ${offender}`));
  process.exit(1);
}

console.log('Type audit passed: no raw font-size outside the token file.');
