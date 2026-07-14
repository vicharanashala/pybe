import { describe, it, expect } from 'vitest';
import {
  emptyLearner,
  levelFromScore,
  LEVEL_THRESHOLDS,
  isPiagetStage,
  isConstruct,
} from '../../src/domain';

describe('Learner', () => {
  it('emptyLearner creates a valid default state', () => {
    const l = emptyLearner('test-user');
    expect(l.id).toBe('test-user');
    expect(l.score).toBe(0);
    expect(l.level).toBe(1);
    expect(l.piagetStage).toBe('concrete');
    expect(l.hasOnboarded).toBe(false);
  });

  it('levelFromScore maps score to level using thresholds (INV-PB-3: no cap)', () => {
    expect(levelFromScore(0)).toBe(1);
    expect(levelFromScore(LEVEL_THRESHOLDS[2] - 1)).toBe(1);
    expect(levelFromScore(LEVEL_THRESHOLDS[2])).toBe(2);
    expect(levelFromScore(LEVEL_THRESHOLDS[5])).toBe(5);
    // INV-PB-3: arbitrarily large scores still map to level 5 (no cap).
    expect(levelFromScore(1_000_000)).toBe(5);
  });
});

describe('PiagetStage', () => {
  it('accepts only valid Piaget stages', () => {
    expect(isPiagetStage('concrete')).toBe(true);
    expect(isPiagetStage('formal')).toBe(true);
    expect(isPiagetStage('invalid')).toBe(false);
    expect(isPiagetStage(42)).toBe(false);
  });
});

describe('Construct', () => {
  it('accepts documented Python constructs', () => {
    expect(isConstruct('list')).toBe(true);
    expect(isConstruct('dict')).toBe(true);
    expect(isConstruct('for')).toBe(true);
    expect(isConstruct('lambda')).toBe(false); // not yet added in Phase 0
  });
});