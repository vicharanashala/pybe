/**
 * Leaderboard helpers — local-only for Phase 2; Phase 9 will swap to a
 * server-backed implementation behind the same surface.
 *
 * INV-PB-3 (no cap): there is no ceiling applied here. Top-N is just the
 * top-N by raw score, regardless of how large those scores get.
 */
import type { CaseHistory } from '../domain/Learner.ts';

export interface LeaderboardEntry {
  caseStudyId: string;
  score: number; // sum of lastScoreDelta per case study
  lastAttemptAt: number;
  attempts: number;
}

export function buildLeaderboard(
  history: Record<string, CaseHistory>,
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = Object.entries(history).map(
    ([caseStudyId, h]) => ({
      caseStudyId,
      score: h.lastScoreDelta,
      lastAttemptAt: h.lastAttemptAt,
      attempts: 1,
    }),
  );
  entries.sort((a, b) => b.score - a.score);
  return entries;
}

export function topN(entries: LeaderboardEntry[], n: number): LeaderboardEntry[] {
  return entries.slice(0, n);
}