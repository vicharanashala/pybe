/* ==========================================================================
   VALIDATE SCENES — Quality Gate 1
   Asserts all 12 scenes have required keys, valid photos, and BRO altitudes
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read scenes.js text
const scenesJsPath = path.join(rootDir, 'js', 'scenes.js');
const scenesJsContent = fs.readFileSync(scenesJsPath, 'utf8');

// Evaluate SCENES_DATA
const scenesDataMatch = scenesJsContent.match(/const SCENES_DATA = (\[[\s\S]*?\]);\s*\n\/\/ Export/);
if (!scenesDataMatch) {
  console.error('❌ Failed to parse SCENES_DATA from scenes.js');
  process.exit(1);
}

const SCENES_DATA = eval(scenesDataMatch[1]);

console.log(`\n🔍 Validating ${SCENES_DATA.length} scenes...`);

// BRO Altitudes reference
const BRO_ALTITUDES = {
  1: 6726,
  2: 13050,
  3: 14000,
  4: 16040,
  5: 14070,
  6: 15280,
  7: 15400,
  8: 15500,
  9: 17480,
  10: 11100,
  11: 11500,
  12: 11562
};

let errors = [];

if (SCENES_DATA.length !== 12) {
  errors.push(`Expected 12 scenes, got ${SCENES_DATA.length}`);
}

SCENES_DATA.forEach((s, idx) => {
  const num = idx + 1;
  if (s.id !== num) errors.push(`Scene ${num}: id mismatch (${s.id})`);
  if (!s.place) errors.push(`Scene ${num}: place is missing`);
  if (s.altFt !== BRO_ALTITUDES[num]) {
    errors.push(`Scene ${num} (${s.place}): altitude ${s.altFt} does not match BRO verified altitude ${BRO_ALTITUDES[num]}`);
  }

  // Check photo exists on disk
  const photoPath = path.join(rootDir, s.photo);
  if (!fs.existsSync(photoPath)) {
    errors.push(`Scene ${num}: photo not found at ${photoPath}`);
  }

  // Check verb
  if (!s.verb) errors.push(`Scene ${num}: verb missing`);
});

if (errors.length > 0) {
  console.error(`\n❌ Scene validation FAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('✅ Quality Gate 1 PASSED: All 12 scenes verified against BRO altitudes and photo files.\n');
}
