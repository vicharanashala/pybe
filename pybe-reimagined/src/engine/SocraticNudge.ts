/**
 * Socratic-nudge question bank.
 *
 * INV-P1: a Socratic nudge must be a question, not a lecture.
 * INV-PB-1: never introduce Python syntax in a nudge.
 *
 * The player calls pickRandomNudge() when a learner has been idle for
 * ≥ 30 seconds OR has submitted empty reasoning.
 */

export const NUDGE_QUESTIONS: readonly string[] = [
  "What is the smallest piece of data in this scenario?",
  "If you had 100 hand-written variables instead of a collection, what pattern would you notice?",
  "What is common across all the data points in the scenario?",
  "What would you do first: collect the data or compute the answer?",
  "What does the scenario assume you already know, and what does it ask you to find?",
  "If you could only keep ONE word to describe the situation, what would it be?",
  "Where, in your own life, have you grouped many similar things into one container?",
];

let cursor = 0;
export function pickNudge(): string {
  // Round-robin through the bank so learners see different questions over time.
  const q = NUDGE_QUESTIONS[cursor] ?? NUDGE_QUESTIONS[0]!;
  cursor = (cursor + 1) % NUDGE_QUESTIONS.length;
  return q;
}

export function resetNudgeCursor(): void {
  cursor = 0;
}