import { describe, it, expect } from 'vitest';
import { applyEvent, deltaFor, formatScore } from '../../src/engine/ScoringEngine.ts';
import { emptyLearner, LEVEL_THRESHOLDS } from '../../src/domain/Learner.ts';

describe('ScoringEngine.deltaFor', () => {
  it('rewards submit_reasoning +5', () => {
    expect(
      deltaFor({ type: 'submit_reasoning', caseStudyId: 'cs_001', ts: 0 }),
    ).toBe(5);
  });
  it('rewards reveal_unlocked +10', () => {
    expect(
      deltaFor({ type: 'reveal_unlocked', caseStudyId: 'cs_001', ts: 0 }),
    ).toBe(10);
  });
  it('rewards code_run_success +15 (Phase 4 ready)', () => {
    expect(
      deltaFor({ type: 'code_run_success', caseStudyId: 'cs_001', ts: 0 }),
    ).toBe(15);
  });
});

describe('ScoringEngine.applyEvent', () => {
  it('applies delta to score and recomputes level', () => {
    const learner = emptyLearner('u1');
    const { learner: after, levelCrossedTo, deltaApplied } = applyEvent(learner, {
      type: 'submit_reasoning',
      caseStudyId: 'cs_001',
      ts: 100,
    });
    expect(after.score).toBe(5);
    expect(after.level).toBe(1); // still beginner
    expect(levelCrossedTo).toBeNull();
    expect(deltaApplied).toBe(5);
  });

  it('records history for the case study', () => {
    const learner = emptyLearner('u1');
    const { learner: after } = applyEvent(learner, {
      type: 'submit_reasoning',
      caseStudyId: 'cs_001',
      ts: 12345,
    });
    expect(after.history['cs_001']?.lastScoreDelta).toBe(5);
    expect(after.history['cs_001']?.lastAttemptAt).toBe(12345);
  });

  it('crosses level at 50 and reports the new level (INV-PB-3)', () => {
    let learner = emptyLearner('u1');
    // 10 submit_reasoning events = 50 points
    for (let i = 0; i < 10; i++) {
      const r = applyEvent(learner, {
        type: 'submit_reasoning',
        caseStudyId: 'cs_001',
        ts: i,
      });
      learner = r.learner;
    }
    expect(learner.score).toBe(50);
    expect(learner.level).toBe(2);
  });

  it('crosses multiple levels in one apply (e.g. +20 takes 1→2→3?) — actually +20 is +5x4 so not cross', () => {
    // 5+10+15 events = 30 — not a level cross. 5+10+15+10+10+10+10+10+10+10 = 110 = level 2.
    let learner = emptyLearner('u1');
    const events: Array<{ type: 'submit_reasoning' | 'reveal_unlocked' | 'code_run_success' }> = [
      { type: 'submit_reasoning' },     // 5
      { type: 'reveal_unlocked' },     // 10  -> 15
      { type: 'code_run_success' },    // 15  -> 30
      { type: 'reveal_unlocked' },     // 10  -> 40
      { type: 'reveal_unlocked' },     // 10  -> 50  (cross!)
      { type: 'reveal_unlocked' },     // 10  -> 60
      { type: 'reveal_unlocked' },     // 10  -> 70
      { type: 'reveal_unlocked' },     // 10  -> 80
      { type: 'reveal_unlocked' },     // 10  -> 90
      { type: 'reveal_unlocked' },     // 10  -> 100
      { type: 'reveal_unlocked' },     // 10  -> 110
    ];
    let crossed: number | null = null;
    for (let i = 0; i < events.length; i++) {
      const ts = i;
      const ev = events[i]!;
      const r = applyEvent(learner, { type: ev.type, caseStudyId: 'cs_001', ts });
      learner = r.learner;
      if (r.levelCrossedTo) crossed = r.levelCrossedTo;
    }
    expect(learner.score).toBe(110);
    expect(learner.level).toBe(2);
    expect(crossed).toBe(2);
  });

  it('does not cap at any specific number (INV-PB-3)', () => {
    let learner = emptyLearner('u1');
    // Apply 1000 reveal_unlocked events => +10,000 points
    for (let i = 0; i < 1000; i++) {
      const r = applyEvent(learner, {
        type: 'reveal_unlocked',
        caseStudyId: 'cs_001',
        ts: i,
      });
      learner = r.learner;
    }
    expect(learner.score).toBe(10_000);
    expect(learner.level).toBe(5);
  });

  it('arbitrarily large scores still level up correctly (INV-PB-3)', () => {
    let learner = emptyLearner('u1');
    for (let i = 0; i < 200_000; i++) {
      const r = applyEvent(learner, {
        type: 'code_run_success',
        caseStudyId: 'cs_001',
        ts: i,
      });
      learner = r.learner;
    }
    // 200_000 * 15 = 3_000_000
    expect(learner.score).toBe(3_000_000);
    expect(learner.level).toBe(5);
    expect(LEVEL_THRESHOLDS[5]).toBe(700);
    expect(learner.score).toBeGreaterThan(LEVEL_THRESHOLDS[5]);
  });
});

describe('ScoringEngine.formatScore', () => {
  it('shows the actual number below 10,000', () => {
    expect(formatScore(0)).toBe('0');
    expect(formatScore(50)).toBe('50');
    expect(formatScore(9999)).toBe('9999');
  });
  it('caps display at "9999+" but never the underlying value', () => {
    expect(formatScore(10_000)).toBe('9999+');
    expect(formatScore(1_000_000)).toBe('9999+');
  });
});