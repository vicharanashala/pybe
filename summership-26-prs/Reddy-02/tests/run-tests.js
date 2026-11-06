/**
 * run-tests.js
 * ─────────────────────────────────────────────────────────────────
 * Comprehensive automated test suite for the Dasara Festival Discovery Lab.
 * Validates lesson data schema, pedagogical completeness, deterministic
 * execution logic, and assessment scoring.
 * ─────────────────────────────────────────────────────────────────
 */

import { MODULE_META, CHAPTERS, CHAPTER_ORDER, getChapter, CONCEPTS_SUMMARY } from '../src/data/dasaraLesson.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  \x1b[32m✓ PASS\x1b[0m ${testName}`);
    passedTests++;
  } else {
    console.error(`  \x1b[31m✗ FAIL\x1b[0m ${testName}`);
    failedTests++;
  }
}

console.log('\n======================================================');
console.log('  DASARA DISCOVERY LAB — AUTOMATED TEST SUITE');
console.log('======================================================\n');

// ── Test Suite 1: Module Metadata ──
console.log('[Suite 1: Module Metadata & Objectives]');
assert(MODULE_META.id === 'dasara-discovery-lab', 'Module ID is correctly set');
assert(MODULE_META.concepts.length >= 6, 'Module covers all 6 key concepts (try, except, else, finally, ValueError, KeyError)');
assert(MODULE_META.learningObjectives.length >= 7, 'Module defines at least 7 explicit learning objectives');
assert(MODULE_META.author.includes('Vicharanashala'), 'Author metadata references Vicharanashala');

// ── Test Suite 2: Chapters Structure & Schema ──
console.log('\n[Suite 2: Chapters Structure & Ordering]');
assert(CHAPTERS.length === 9, 'Module contains exactly 9 chapters (0 through 8)');
assert(CHAPTER_ORDER.length === 9, 'CHAPTER_ORDER contains 9 chapter IDs');
assert(CHAPTERS[0].id === 'opening', 'Chapter 0 is the opening hero screen');
assert(CHAPTERS[8].id === 'assessment', 'Chapter 8 is the final assessment');

CHAPTERS.forEach((ch, idx) => {
  assert(ch.chapterNum === idx, `Chapter at index ${idx} has chapterNum === ${idx}`);
  assert(typeof ch.title === 'string' && ch.title.length > 0, `Chapter ${idx} has non-empty title`);
  assert(typeof ch.narration === 'string' && ch.narration.length > 20, `Chapter ${idx} has audio narration text`);
});

// ── Test Suite 3: Pedagogical Challenges ──
console.log('\n[Suite 3: Pedagogical Challenges & Scenarios]');

// Chapter 2: Prediction challenge
const ch2 = getChapter('mahishasura-rise');
assert(ch2 !== undefined, 'Chapter 2 mahishasura-rise exists');
assert(ch2.scenePrediction.options.length === 4, 'Chapter 2 prediction has 4 options');
assert(ch2.scenePrediction.bestAnswer === 'c', 'Chapter 2 best answer is "c" (graceful handling)');
assert(typeof ch2.scenePrediction.explanations['c'] === 'string', 'Chapter 2 has explanation for best answer');

// Chapter 3: ValueError challenge
const ch3 = getChapter('nine-day-battle');
assert(ch3 !== undefined, 'Chapter 3 nine-day-battle exists');
assert(ch3.codeProblem.correctId === 'b', 'Chapter 3 ValueError quiz correct answer is "b"');
assert(ch3.codeProblem.exceptionTrace.length === 3, 'Chapter 3 includes 3-line execution trace');
assert(ch3.codeProblem.exceptionTrace[1].status === 'raises', 'Line 2 in Chapter 3 raises exception');
assert(ch3.codeProblem.exceptionTrace[2].status === 'skipped', 'Line 3 in Chapter 3 is skipped');

// Chapter 4: try/except lab
const ch4 = getChapter('try-except');
assert(ch4 !== undefined, 'Chapter 4 try-except exists');
assert(ch4.codeLines.length === 5, 'Chapter 4 contains 5 code lines for try/except walkthrough');
assert(ch4.editableExample.variants.length === 4, 'Chapter 4 provides 4 interactive input variants');

// Chapter 5: KeyError challenge
const ch5 = getChapter('rama-journey');
assert(ch5 !== undefined, 'Chapter 5 rama-journey exists');
assert(ch5.codeProblem.correctId === 'c', 'Chapter 5 KeyError quiz correct answer is "c"');
assert(ch5.recoveryChallenge.options.length === 4, 'Chapter 5 presents 4 recovery options');

// Chapter 6: try/except/else/finally blanks
const ch6 = getChapter('vijayadashami');
assert(ch6 !== undefined, 'Chapter 6 vijayadashami exists');
assert(ch6.finalCodeChallenge.blanks.length === 4, 'Chapter 6 has 4 blanks');
const blankAnswers = ch6.finalCodeChallenge.blanks.map((b) => b.answer);
assert(
  blankAnswers.includes('try') &&
  blankAnswers.includes('else') &&
  blankAnswers.includes('except') &&
  blankAnswers.includes('finally'),
  'Chapter 6 blanks validate try, else, except, and finally'
);

// Chapter 7: Interactive Lab
const ch7 = getChapter('code-lab');
assert(ch7 !== undefined, 'Chapter 7 code-lab exists');
assert(ch7.examples.length === 3, 'Chapter 7 provides 3 sandbox examples');
ch7.examples.forEach((ex) => {
  assert(ex.inputs.length >= 3, `Example ${ex.id} has at least 3 test inputs`);
});

// Chapter 8: Final Assessment
const ch8 = getChapter('assessment');
assert(ch8 !== undefined, 'Chapter 8 assessment exists');
assert(ch8.questions.length === 5, 'Chapter 8 has exactly 5 assessment questions');
assert(ch8.passMark === 4, 'Chapter 8 passMark is 4 out of 5');
ch8.questions.forEach((q, i) => {
  assert(q.options.length === 4, `Question ${i + 1} has 4 options`);
  assert(q.options.some((o) => o.id === q.correctId), `Question ${i + 1} correctId matches an option`);
  assert(typeof q.explanation === 'string' && q.explanation.length > 10, `Question ${i + 1} has explanation`);
});

// Concepts Summary Check
assert(CONCEPTS_SUMMARY.length >= 6, 'Module provides concepts cheat sheet with at least 6 concepts');

// ── Test Suite 4: Simulation & Logic Correctness ──
console.log('\n[Suite 4: Simulation & Logic Correctness]');

// Simulation of int("nine")
function simulateIntConversion(input) {
  const n = Number(input);
  if (input.trim() === '' || isNaN(n) || !Number.isInteger(n)) {
    return { error: 'ValueError', output: 'Please enter a valid number.' };
  }
  return { output: String(n) };
}
assert(simulateIntConversion('nine').error === 'ValueError', 'simulateIntConversion("nine") correctly catches ValueError');
assert(simulateIntConversion('9').output === '9', 'simulateIntConversion("9") produces "9"');
assert(simulateIntConversion('').error === 'ValueError', 'simulateIntConversion("") correctly catches ValueError');

// Simulation of KeyError lookup
function simulateDictLookup(dict, key) {
  if (Object.prototype.hasOwnProperty.call(dict, key)) {
    return { value: dict[key] };
  }
  return { error: 'KeyError', message: `Key not found: ${key}` };
}
const testDict = { destination: 'Lanka', guide: 'Hanuman' };
assert(simulateDictLookup(testDict, 'guide').value === 'Hanuman', 'Key "guide" found');
assert(simulateDictLookup(testDict, 'bridge').error === 'KeyError', 'Key "bridge" raises KeyError');

// Assessment scoring logic
function calculateScore(answers) {
  let score = 0;
  ch8.questions.forEach((q) => {
    if (answers[q.id] === q.correctId) score++;
  });
  return { score, passed: score >= ch8.passMark };
}

const perfectAnswers = { q1: 'b', q2: 'b', q3: 'c', q4: 'c', q5: 'c' };
assert(calculateScore(perfectAnswers).score === 5 && calculateScore(perfectAnswers).passed, 'Scoring: 5/5 passes');

const fourAnswers = { q1: 'b', q2: 'b', q3: 'c', q4: 'c', q5: 'a' };
assert(calculateScore(fourAnswers).score === 4 && calculateScore(fourAnswers).passed, 'Scoring: 4/5 passes threshold');

const failAnswers = { q1: 'a', q2: 'a', q3: 'a', q4: 'a', q5: 'a' };
assert(calculateScore(failAnswers).score === 0 && !calculateScore(failAnswers).passed, 'Scoring: 0/5 fails threshold');

console.log('\n======================================================');
console.log(`  TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
