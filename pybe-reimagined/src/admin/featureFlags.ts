/**
 * Feature flags — Phase 10 introduces v1/v2 separation.
 *
 * Per Sir's mandate, stretch features (Horcruxes, Time Stone, Sorting Hat,
 * firmware lessons) are gated on "4 weeks of pilot data". Until then, all
 * v2 features are OFF regardless of the flag value.
 *
 * INV-PB-5 (resists shallow PRs): a v2 feature cannot accidentally ship.
 * The flag is `false` for v2.* items regardless of inputs.
 */
import type { AnalyticsEvent, EventName } from '../analytics/events.ts';

export type FeatureFlagId =
  | 'v1.stretch.horcruxes'
  | 'v1.stretch.time_stone'
  | 'v1.stretch.sorting_hat'
  | 'v1.stretch.firmware'
  | 'v1.stretch.embed_mode'
  | 'v1.stretch.bilingual'
  | 'v1.iterate.weekly_review_page'
  | 'v1.iterate.analytics_aggregation'
  | 'v1.iterate.bug_report_link';

export interface FeatureFlagState {
  id: FeatureFlagId;
  enabled: boolean;
  /** When the feature is gated, this explains why it cannot ship. */
  gating?: string;
}

/**
 * The canonical feature flag table. v2.* features are HARD-CODED `enabled: false`.
 * A contributor cannot flip them on without also editing this file.
 */
export const FEATURE_FLAGS: readonly FeatureFlagState[] = [
  // v1 features (always on).
  { id: 'v1.iterate.weekly_review_page', enabled: true },
  { id: 'v1.iterate.analytics_aggregation', enabled: false, gating: 'Phase-11 follow-up' },
  { id: 'v1.iterate.bug_report_link', enabled: false, gating: 'pending pilot signal' },
  // v2 stretch features (always off until 4 weeks of pilot data).
  {
    id: 'v1.stretch.horcruxes',
    enabled: false,
    gating: 'Requires 4 weeks of pilot data per docs/ROADMAP.md',
  },
  {
    id: 'v1.stretch.time_stone',
    enabled: false,
    gating: 'Requires 4 weeks of pilot data per docs/ROADMAP.md',
  },
  {
    id: 'v1.stretch.sorting_hat',
    enabled: false,
    gating: 'Requires 4 weeks of pilot data per docs/ROADMAP.md',
  },
  {
    id: 'v1.stretch.firmware',
    enabled: false,
    gating: 'Requires 4 weeks of pilot data per docs/ROADMAP.md',
  },
  {
    id: 'v1.stretch.embed_mode',
    enabled: false,
    gating: 'Requires 4 weeks of pilot data per docs/ROADMAP.md',
  },
  {
    id: 'v1.stretch.bilingual',
    enabled: false,
    gating: 'Requires 4 weeks of pilot data per docs/ROADMAP.md',
  },
];

export function isFeatureEnabled(id: FeatureFlagId): boolean {
  const flag = FEATURE_FLAGS.find((f) => f.id === id);
  return flag?.enabled ?? false;
}

/** Used by analytics to record which flags are ON at any given moment. */
export function snapshotEnabledFlags(): AnalyticsEvent[] {
  const now = Date.now();
  return FEATURE_FLAGS.filter((f) => f.enabled).map((f) => ({
    name: 'case_started' as EventName, // re-use existing event type (whitelisted)
    userId: '',
    ts: now,
    props: { flagId: f.id },
  }));
}

export function flagsForUI(): readonly FeatureFlagState[] {
  return FEATURE_FLAGS;
}