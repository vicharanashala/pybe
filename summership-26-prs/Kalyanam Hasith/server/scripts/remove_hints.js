const fs = require('fs');
let code = fs.readFileSync('c:/PYBE/pybe/server/src/seed.js', 'utf8');

let originalCode = code;

// 1. Remove inline comments (space(s) followed by #, not at the start of a line)
// In the JS string, this looks like `   # comment\n`
// We will look for 1 or more spaces, followed by #, followed by anything but \ or ", up to \n or "
// Wait, what if it's `# Expected output:` which we already removed?
code = code.replace(/( {1,})#(?! Goal:| Test cases:)[^\\]*(?=\\n|")/gi, '');

// 2. Remove full line comments
// In the JS string, this looks like `\n# comment\n` or `\n  # comment\n`
code = code.replace(/\\n\s*#(?! Goal:| Test cases:)[^\\]*(?=\\n|")/gi, '');

if (code !== originalCode) {
  fs.writeFileSync('c:/PYBE/pybe/server/src/seed.js', code);
  console.log('Removed hints from seed.js');
} else {
  console.log('No hints found to remove.');
}
