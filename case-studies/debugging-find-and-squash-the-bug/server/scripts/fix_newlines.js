const fs = require('fs');
let code = fs.readFileSync('c:/PYBE/pybe/server/src/seed.js', 'utf8');

// The file currently contains the literal characters '\', '\', 'n'.
// We want to replace it with '\', 'n'.
// In regex, /\\\\n/g matches two backslashes followed by n.
// We replace it with '\\n', which is a string containing one backslash followed by n.
code = code.replace(/\\\\n/g, '\\n');

// For quotes: the file might contain \\", we want \"
code = code.replace(/\\\\"/g, '\\"');

fs.writeFileSync('c:/PYBE/pybe/server/src/seed.js', code);
console.log('Fixed double-escaped newlines and quotes in seed.js');
