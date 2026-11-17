const { spawn, execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

async function main() {
  console.log('1. Building client...');
  execSync('npm run build --prefix client', { cwd: root, stdio: 'inherit' });

  console.log('2. Seeding data...');
  execSync('node server/src/seed.js', { cwd: root, stdio: 'inherit' });

  console.log('3. Checking / verifying server...');
  let serverProc = null;
  let alreadyRunning = false;
  try {
    const res = await fetch('http://localhost:5000/api/scenarios');
    if (res.ok) alreadyRunning = true;
  } catch (e) {
    alreadyRunning = false;
  }

  if (!alreadyRunning) {
    serverProc = spawn('node', ['src/index.js'], { cwd: path.join(root, 'server'), stdio: 'pipe' });
  }

  try {
    let parts = null;
    const start = Date.now();
    while (Date.now() - start < 15000) {
      try {
        const res = await fetch('http://localhost:5000/api/scenarios');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length === 6) {
            parts = data;
            break;
          }
        }
      } catch (err) {
        // waiting for server
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    if (!parts || parts.length !== 6) {
      throw new Error(`Expected 6 case parts from /api/scenarios, got ${parts ? parts.length : 0}`);
    }

    console.log(`4. Verified all ${parts.length} case parts from /api/scenarios:`);
    parts.forEach((p, i) => console.log(`   [${i + 1}/6] ${p._id}: ${p.partLabel || p.title}`));
    console.log('Smoke check passed.');
  } finally {
    if (serverProc) {
      serverProc.kill();
    }
  }
}

main().catch((err) => {
  console.error('Smoke check failed:', err);
  process.exit(1);
});
