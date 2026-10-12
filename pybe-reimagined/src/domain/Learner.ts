// INV-A1: this file owns ONE type — Learner.

import type { PiagetStage } from './PiagetStage.ts';

export type Level = 1 | 2 | 3 | 4 | 5;

export interface LearnerAttempt {
  caseStudyId: string;
  reasoning: string;
  timestamp: number;
  revealed: boolean;
}

export interface CaseHistory {
  lastScoreDelta: number;
  lastAttemptAt: number;
}

export interface Learner {
  id: string;
  piagetStage: PiagetStage;
  /**
   * True iff the learner has completed the onboarding flow at least once.
   */
  hasOnboarded: boolean;
  visitedConcepts: string[];
  revealedHints: Record<string, string[]>;
  attempts: LearnerAttempt[];
  pathwaysTaken: string[];
  score: number;
  level: Level;
  history: Record<string, CaseHistory>;
}

// INV-PB-3: explicit level thresholds. There is intentionally no upper
// score ceiling — see ScoringSpec.md in WORKFLOW.md §Phase 2.
export const LEVEL_THRESHOLDS: Record<Level, number> = {
  1: 0,
  2: 50,
  3: 150,
  4: 350,
  5: 700,
};

export function levelFromScore(score: number): Level {
  let level: Level = 1;
  for (const lv of [1, 2, 3, 4, 5] as const) {
    if (score >= LEVEL_THRESHOLDS[lv]) {
      level = lv;
    }
  }
  return level;
}

export function emptyLearner(id: string): Learner {
  return {
    id,
    piagetStage: 'concrete',
    hasOnboarded: false,
    visitedConcepts: [],
    revealedHints: {},
    attempts: [],
    pathwaysTaken: [],
    score: 0,
    level: 1,
    history: {},
  };
}