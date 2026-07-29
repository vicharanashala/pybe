import { describe, it, expect } from 'vitest';
import {
  FEATURE_FLAGS,
  isFeatureEnabled,
  flagsForUI,
  type FeatureFlagId,
} from '../../src/admin/featureFlags.ts';

describe('featureFlags (Phase 10 v1/v2 separation)', () => {
  it('exports a non-empty flag table', () => {
    expect(FEATURE_FLAGS.length).toBeGreaterThan(0);
  });

  it('v1.iterate.weekly_review_page is enabled', () => {
    expect(isFeatureEnabled('v1.iterate.weekly_review_page')).toBe(true);
  });

  it('every v2 stretch feature is OFF and gated', () => {
    const stretchIds: FeatureFlagId[] = [
      'v1.stretch.horcruxes',
      'v1.stretch.time_stone',
      'v1.stretch.sorting_hat',
      'v1.stretch.firmware',
      'v1.stretch.embed_mode',
      'v1.stretch.bilingual',
    ];
    for (const id of stretchIds) {
      expect(isFeatureEnabled(id)).toBe(false);
      const flag = FEATURE_FLAGS.find((f) => f.id === id);
      expect(flag?.gating, `${id} must declare a gating reason`).toBeTruthy();
    }
  });

  it('returns undefined gracefully for unknown flag ids', () => {
    // Casting to unknown string id; the function should default to false.
    expect(isFeatureEnabled('not.a.real.flag' as FeatureFlagId)).toBe(false);
  });

  it('flagsForUI returns the same table as FEATURE_FLAGS', () => {
    expect(flagsForUI().length).toBe(FEATURE_FLAGS.length);
  });

  it('INV-PB-5 guardrail: only the table author can flip a v2 flag', () => {
    // Phase 10 invariant: there is no setter API. A contributor would
    // have to edit the source file itself — which goes through code review.
    expect(typeof isFeatureEnabled).toBe('function');
    expect(typeof flagsForUI).toBe('function');
    // ensure no exported `setFlag` / `enable` API
    const moduleKeys = Object.keys(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../src/admin/featureFlags.ts') as Record<string, unknown>,
    );
    expect(moduleKeys).not.toContain('setFlag');
    expect(moduleKeys).not.toContain('enableFlag');
    expect(moduleKeys).not.toContain('disableFlag');
  });
});