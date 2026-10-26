const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const caseParts = require(path.join(__dirname, '..', '..', 'server', 'rosewoodManorCase'));
const { conceptCodeTemplates } = require('../src/services/learningEngine');

const snippets = [
  ...caseParts.map((part) => [`${part._id}/idealSolution`, part.idealSolution]),
  ...Object.entries(conceptCodeTemplates).map(([name, code]) => [`template/${name}`, code])
];
const failures = [];
const python = process.platform === 'win32' ? 'python' : 'python3';
const CODE_LENGTH_LIMIT = 50;

for (const [name, code] of snippets) {
  const lines = String(code).split('\n');
  let prevLineWasBlank = true;

  lines.forEach((line, index) => {
    // 1. Fail on tabs
    if (line.includes('\t')) {
      failures.push(`${name}:${index + 1} contains tab characters (tabs are forbidden)`);
    }

    // 2. Fail on indentation that isn't a multiple of 4
    const leadingSpaces = (line.match(/^ */) || [''])[0].length;
    if (leadingSpaces % 4 !== 0) {
      failures.push(`${name}:${index + 1} indentation (${leadingSpaces}) is not a multiple of 4`);
    }

    const trimmed = line.trim();
    if (!trimmed) {
      prevLineWasBlank = true;
      return;
    }

    // Check block header captions (starts with # at root level)
    const isCaption = trimmed.startsWith('#');
    if (isCaption) {
      // If caption at root level (a block caption), ensure preceding blank line unless first line
      if (leadingSpaces === 0 && index > 0 && !prevLineWasBlank) {
        failures.push(`${name}:${index + 1} missing blank line between blocks before "${trimmed}"`);
      }
    } else {
      // 3. Fail on any code line without a comment
      if (!line.includes('#')) {
        failures.push(`${name}:${index + 1} has no comment`);
      }

      // 4. Fail on code lines over the length limit (50 characters or fewer)
      const codePart = line.includes('#') ? line.slice(0, line.indexOf('#')).trimEnd() : line.trimEnd();
      if (codePart.length > CODE_LENGTH_LIMIT) {
        failures.push(`${name}:${index + 1} code length (${codePart.length}) exceeds limit of ${CODE_LENGTH_LIMIT}: "${codePart}"`);
      }
    }

    prevLineWasBlank = false;
  });

  // 5. Fail if code does not compile with Python 3
  const temp = path.join(__dirname, `.pybe-${process.pid}-${snippets.indexOf([name, code])}.py`);
  fs.writeFileSync(temp, `${code}\n`, 'utf8');
  const result = spawnSync(python, ['-m', 'py_compile', temp], { encoding: 'utf8' });
  fs.rmSync(temp, { force: true });
  if (result.status !== 0) {
    failures.push(`${name} does not compile with Python 3: ${(result.stderr || '').trim()}`);
  }
}

console.log(`Validated ${snippets.length} Python snippets.`);
if (failures.length) {
  console.error('Python validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Python validation passed: all code lines commented, no tabs, 4-space indentation, line length <= 50, blocks separated by blank lines, and Python 3 compilation passed.');
