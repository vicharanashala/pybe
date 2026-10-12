import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * INV-PB-3 (no score cap) — invariant guard.
 *
 * Greps the ScoringEngine source code for any suspicious tokens that would
 * indicate a cap. If a contributor adds `Math.min` or `if (score > ...)`,
 * this test fails. INV-PB-3 is non-negotiable.
 *
 * We strip comments so that the regex does not match the example pattern
 * inside JSDoc. We exclude the `formatScore` function (display-only).
 */

function stripComments(src: string): string {
  // Remove /* ... */ block comments
  let out = src.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove // line comments
  out = out
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('//'))
    .join('\n');
  return out;
}

function stripFormatter(src: string): string {
  // Exclude the display-only `formatScore` block.
  return src.replace(/export function formatScore[\s\S]*?\n}\s*/g, '');
}

describe('ScoringEngine — no score cap (INV-PB-3)', () => {
  const rawSrc = readFileSync(
    join(__dirname, '..', '..', 'src', 'engine', 'ScoringEngine.ts'),
    'utf-8',
  );
  const src = stripFormatter(stripComments(rawSrc));

  it('does not call Math.min in score arithmetic', () => {
    expect(src).not.toMatch(/Math\.min/);
  });

  it('does not compare score to a literal cap value', () => {
    // Patterns like `if (score > 9999)` or `score = Math.min(score, 9999)`.
    expect(src).not.toMatch(/score\s*[<>]=?\s*\d{2,}/);
    expect(src).not.toMatch(/Math\.min/);
  });

  it('does not reference a MAX_SCORE constant', () => {
    expect(src).not.toMatch(/MAX_SCORE/);
    expect(src).not.toMatch(/maxScore/i);
    expect(src).not.toMatch(/SCORE_CAP/);
  });

  it('mentions INV-PB-3 in a comment (sanity)', () => {
    expect(rawSrc).toMatch(/INV-PB-3/);
  });

  it('uses an unbounded `score + delta` pattern (sanity)', () => {
    expect(src).toMatch(/score\s*\+\s*delta/);
  });
});