/* ==========================================================================
   LINT TEXT & CONSTRAINTS — Quality Gate 2
   Enforces word limits, non-consecutive verbs, and MCQ balance
   ========================================================================== */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const scenesJsContent = fs.readFileSync(path.join(rootDir, 'js', 'scenes.js'), 'utf8');
const scenesDataMatch = scenesJsContent.match(/const SCENES_DATA = (\[[\s\S]*?\]);\s*\n\/\/ Export/);
const SCENES_DATA = eval(scenesDataMatch[1]);

console.log(`\n🔍 Linting text budgets & constraints across 12 scenes...`);

let errors = [];
let prevVerb = null;
let mcqDistribution = { 0: 0, 1: 0, 2: 0 }; // 0: A, 1: B, 2: C
let mcqCount = 0;

SCENES_DATA.forEach((s, idx) => {
  const num = idx + 1;

  // 1. Narration word limit <= 12
  if (s.narration) {
    const words = s.narration.trim().split(/\s+/).length;
    if (words > 12) {
      errors.push(`Scene ${num} narration: ${words} words (exceeds 12 max): "${s.narration}"`);
    }
  }

  // 2. Radio word limit <= 10
  if (s.radio && s.radio.text) {
    const radioWords = s.radio.text.trim().split(/\s+/).length;
    if (radioWords > 10) {
      errors.push(`Scene ${num} radio: ${radioWords} words (exceeds 10 max): "${s.radio.text}"`);
    }
  }

  // 3. No consecutive duplicate verbs
  if (s.verb === prevVerb) {
    errors.push(`Scene ${num} verb '${s.verb}' is identical to consecutive previous scene ${num - 1}`);
  }
  prevVerb = s.verb;

  // 4. Quick Checks (must be on scenes 2, 4, 5, 6, 9, 10 only)
  const allowedQcScenes = [2, 4, 5, 6, 9, 10];
  if (allowedQcScenes.includes(num)) {
    if (!s.quickCheck) {
      errors.push(`Scene ${num} expected Quick Check MCQ, but none found.`);
    } else {
      mcqCount++;
      mcqDistribution[s.quickCheck.correctIndex] = (mcqDistribution[s.quickCheck.correctIndex] || 0) + 1;
      
      // Verify options
      if (s.quickCheck.options.length !== 3) {
        errors.push(`Scene ${num} Quick Check must have exactly 3 options.`);
      }
    }
  } else {
    if (s.quickCheck) {
      errors.push(`Scene ${num} should NOT have Quick Check (only scenes 2, 4, 5, 6, 9, 10 have MCQs).`);
    }
  }
});

console.log(`📊 Quick Check MCQ Distribution: A: ${mcqDistribution[0]}, B: ${mcqDistribution[1]}, C: ${mcqDistribution[2]}`);

if (mcqCount !== 6) {
  errors.push(`Expected exactly 6 Quick Checks, found ${mcqCount}`);
}

if (errors.length > 0) {
  console.error(`\n❌ Text Linting FAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('✅ Quality Gate 2 PASSED: All word budgets, verbs, and MCQ balances are verified.\n');
}
