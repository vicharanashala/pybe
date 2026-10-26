const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const scanRoot = path.join(root, 'client', 'src');
const tokenFiles = new Set([path.join(scanRoot, 'styles.css')]);
const colorPattern = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\([^)]*\)|\b(?:white|black|red|blue|gray|grey)\b/g;
const offenders = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(css|jsx|js|mjs|html)$/.test(entry.name) && !tokenFiles.has(full)) {
      const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        for (const match of line.matchAll(colorPattern)) offenders.push(`${path.relative(root, full)}:${index + 1}: ${match[0]}`);
      });
    }
  }
}

walk(scanRoot);
console.log('Color tokens: client/src/styles.css');
console.log(`Scanned active JSX/JS/CSS modules outside the token file.`);
if (offenders.length) {
  console.error('Color audit failed:');
  offenders.forEach((offender) => console.error(`- ${offender}`));
  process.exit(1);
}
console.log('Color audit passed: no literal colors outside the token file.');
