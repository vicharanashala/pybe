/**
 * Analytics event taxonomy — single source of truth.
 *
 * The keys here are the EXACT event names the dashboard expects.
 * Adding a new event? Add it here, then update docs/pilot-plan.md.
 *
 * Privacy: no PII. Only the user's anonymous UUID (from localStorage)
 * and the metadata below. Plausible-style: cookieless, GDPR-friendly.
 *
 * Phase 12: the `metaphor_changed` event was retired along with the
 * metaphor system.
 */

export const EVENTS = {
  case_started: 'case_started',
  reasoning_submitted: 'reasoning_submitted',
  reveal_unlocked: 'reveal_unlocked',
  run_code_success: 'run_code_success',
  run_code_failure: 'run_code_failure',
  level_unlocked: 'level_unlocked',
  feedback_submitted: 'feedback_submitted',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export interface AnalyticsEvent {
  name: EventName;
  /** Anonymous learner UUID; do NOT include name/email/IP. */
  userId: string;
  /** Properties per event. Whitelisted to avoid leaking arbitrary data. */
  props: Record<string, string | number | boolean>;
  /** Wall-clock timestamp ms. */
  ts: number;
}

/**
 * Per-event property schema (whitelist).
 * Adding a property to an event? Extend its `Props` type below.
 */
export interface EventPropsByName {
  case_started: { caseStudyId: string; piagetStage: string };
  reasoning_submitted: { caseStudyId: string; length: number };
  reveal_unlocked: { caseStudyId: string; constructs: string };
  run_code_success: { caseStudyId: string; ms: number };
  run_code_failure: { caseStudyId: string; ms: number; errorType: string };
  level_unlocked: { from: number; to: number; totalScore: number };
  feedback_submitted: { score: number; hasComment: boolean };
}

export type EventOf<N extends EventName> = AnalyticsEvent & {
  name: N;
  props: EventPropsByName[N];
};