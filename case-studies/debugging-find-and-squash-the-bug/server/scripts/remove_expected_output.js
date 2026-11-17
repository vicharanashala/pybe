const fs = require('fs');
let code = fs.readFileSync('c:/PYBE/pybe/server/src/seed.js', 'utf8');

// The regex will match `# Expected output:` and any characters up to the end of the line.
// Since it's inside a JSON string, a newline is escaped as \n.
// So we need to match from `# Expected output` up to either the literal `\n` or the end of the string quote `"`.
code = code.replace(/[ ]*#[^\\]*Expected output[^\\]*/gi, '');

fs.writeFileSync('c:/PYBE/pybe/server/src/seed.js', code);
console.log('Removed expected output comments from seed.js');
