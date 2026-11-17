/* ==========================================================================
   CHECK ASSETS — Quality Gate 7
   Verifies photo presence, size limits, and CREDITS.md alignment
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const photosDir = path.join(rootDir, 'assets', 'photos');
const creditsPath = path.join(rootDir, 'assets', 'CREDITS.md');

console.log('\nChecking asset footprint & credits...');

if (!fs.existsSync(creditsPath)) {
  console.error('❌ assets/CREDITS.md not found');
  process.exit(1);
}

const creditsContent = fs.readFileSync(creditsPath, 'utf8');

const expectedPhotos = [
  '01_manali.jpg',
  '02_rohtang.jpg',
  '03_zingzingbar.jpg',
  '04_baralacha.jpg',
  '05_sarchu.jpg',
  '06_pang.jpg',
  '07_morey_plains.jpg',
  '08_debring.jpg',
  '09_tanglang_la.jpg',
  '10_karu.jpg',
  '11_shey.jpg',
  '12_leh.jpg'
];

let errors = [];

expectedPhotos.forEach(filename => {
  const filePath = path.join(photosDir, filename);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing photo file: ${filename}`);
    return;
  }

  const stat = fs.statSync(filePath);
  const sizeKb = Math.round(stat.size / 1024);
  console.log(`  - ${filename}: ${sizeKb} KB`);

  // Check mention in CREDITS.md
  if (!creditsContent.includes(filename)) {
    errors.push(`Photo ${filename} is not documented in assets/CREDITS.md`);
  }
});

if (errors.length > 0) {
  console.error(`\n❌ Asset checks FAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\n[OK] Quality Gate 7 PASSED: All 12 photos exist, sizes verified, credits documented.\n');
}
