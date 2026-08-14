const fs = require('fs');
let code = fs.readFileSync('c:/PYBE/pybe/server/src/seed.js', 'utf8');

// Replace \\" with \"
code = code.replace(/\\\\"/g, '\\"');

fs.writeFileSync('c:/PYBE/pybe/server/src/seed.js', code);
console.log('Fixed double backslash quotes in seed.js');
