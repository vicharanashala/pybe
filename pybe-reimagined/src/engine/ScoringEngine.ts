/**
 * ScoringEngine — pure event-based scoring for Pybe.
 *
 * INV-PB-3 (No score ceiling): there is NO Math.min, NO cap constant,
 * NO branch that returns a maximum. Score is a plain unbounded integer.
 *
 * The `tests/engine/no_cap.test.ts` test greps this file for any
 * suspicious tokens. If you add a cap, that test fails. Don't.
 */
import type { CaseHistory, Learner, Level } from '../domain/Learner.ts';
import { levelFromScore } from '../domain/Learner.ts';

export type ScoringEvent =
  | { type: 'submit_reasoning'; caseStudyId: string; ts: number }
  | { type: 'reveal_unlocked'; caseStudyId: string; ts: number }
  | { type: 'code_run_success'; caseStudyId: string; ts: number };

export interface ApplyResult {
  learner: Learner;
  levelCrossedTo: Level | null;
  deltaApplied: number;
}

/**
 * The single source of truth for score deltas.
 *
 * Per `Pybe_Master_Blueprint.md §15` and `WORKFLOW.md §Phase 2`:
 * - Submit reasoning (≥ 30 chars):  +5
 * - Reveal unlocked after submission: +10
 * - TryItEditor first successful run: +15  (Phase 4 will wire this)
 */
export function deltaFor(event: ScoringEvent): number {
  switch (event.type) {
    case 'submit_reasoning':
      return 5;
    case 'reveal_unlocked':
      return 10;
    case 'code_run_success':
      return 15;
  }
}

/**
 * Apply a scoring event to a Learner. Pure — returns a new Learner.
 * Does not mutate the input.
 */
export function applyEvent(learner: Learner, event: ScoringEvent): ApplyResult {
  const delta = deltaFor(event);
  // INV-PB-3: there is no ceiling. `score` is just `score + delta`.
  const newScore = learner.score + delta;
  const newLevel = levelFromScore(newScore);
  const prevLevel = learner.level;

  const historyEntry: CaseHistory = {
    lastScoreDelta: delta,
    lastAttemptAt: event.ts,
  };

  const updated: Learner = {
    ...learner,
    score: newScore,
    level: newLevel,
    history: {
      ...learner.history,
      [event.caseStudyId]: historyEntry,
    },
  };

  const levelCrossedTo: Level | null = newLevel > prevLevel ? newLevel : null;

  return {
    learner: updated,
    levelCrossedTo,
    deltaApplied: delta,
  };
}

/**
 * Display formatting. Caps visible score to 4 digits plus a `+` so a UI
 * never has to render 7-digit numbers, but the underlying value is the
 * unbounded integer — INV-PB-3.
 */
export function formatScore(score: number): string {
  if (score >= 10_000) return '9999+';
  return String(score);
}