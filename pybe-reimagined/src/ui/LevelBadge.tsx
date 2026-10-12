import { Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LEVEL_THRESHOLDS, type Level } from '../domain/Learner.ts';
import { useLearner, levelFromScore } from '../state/LearnerContext.tsx';
import { formatScore } from '../engine/ScoringEngine.ts';

const LEVEL_LABEL: Record<Level, string> = {
  1: 'Beginner',
  2: 'Practitioner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Mastery',
};

const LEVEL_COLOR: Record<Level, string> = {
  1: 'bg-stone-100 text-stone-700 border-stone-300',
  2: 'bg-amber-100 text-amber-800 border-amber-300',
  3: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  4: 'bg-sky-100 text-sky-800 border-sky-300',
  5: 'bg-lavender/20 bg-purple-100 text-purple-800 border-purple-300',
};

const NEXT_LEVEL: Record<Level, Level | null> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: null,
};

/**
 * Top-right badge. Always visible. Click → /dashboard for the full view.
 *
 * INV-PB-3 (no cap): the displayed score uses formatScore which truncates
 * to "9999+" above 10000, but the underlying value is unbounded.
 */
export function LevelBadge() {
  const { learner } = useLearner();
  const level = learner.level ?? levelFromScore(learner.score);
  const next = NEXT_LEVEL[level];
  const nextThreshold = next ? LEVEL_THRESHOLDS[next] : null;
  const remaining =
    nextThreshold !== null ? Math.max(0, nextThreshold - learner.score) : 0;

  const color = LEVEL_COLOR[level];
  return (
    <Link
      to="/dashboard"
      data-testid="pybe-level-badge"
      data-level={level}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${color}`}
      title={
        nextThreshold !== null
          ? `${remaining} pts to ${LEVEL_LABEL[next!]}`
          : 'Mastery — keep exploring'
      }
    >
      <Award className="h-3 w-3" />
      <span>
        L{level} · {LEVEL_LABEL[level]}
      </span>
      <span className="rounded-full bg-white/70 px-2 py-0.5 font-mono tabular-nums text-stone-700">
        {formatScore(learner.score)}
      </span>
    </Link>
  );
}