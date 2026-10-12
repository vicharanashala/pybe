/**
 * ProgressRing — circular SVG progress indicator for the dashboard.
 *
 * Animates from 0 to its target progress on mount. Honors `prefers-reduced-motion`.
 * Color reflects the current level.
 */
import { useEffect, useState } from 'react';
import type { Level } from '../domain/Learner.ts';

const SIZE = 132;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const LEVEL_COLORS: Record<Level, string> = {
  1: '#a8a29e',
  2: '#f59e0b',
  3: '#10b981',
  4: '#0ea5e9',
  5: '#a855f7',
};

interface Props {
  /** 0..1 progress within the current level. */
  progress: number;
  currentLevel: Level;
  nextLevelLabel?: string;
  nextLevelThreshold?: number;
  score: number;
}

export function ProgressRing({
  progress,
  currentLevel,
  nextLevelLabel,
  nextLevelThreshold,
  score,
}: Props) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    // Respect reduced-motion preferences.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setAnimated(progress);
      return;
    }
    const t = window.setTimeout(() => setAnimated(progress), 80);
    return () => window.clearTimeout(t);
  }, [progress]);

  const dash = CIRCUMFERENCE * (1 - Math.max(0, Math.min(1, animated)));
  const color = LEVEL_COLORS[currentLevel];

  return (
    <div
      data-testid="pybe-progress-ring"
      className="relative inline-flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="pybe-progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          className="text-stone-200 dark:text-stone-700"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={`url(#pybe-progress-grad)`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dash}
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          data-testid="pybe-progress-ring-level"
          className="text-3xl font-extrabold tabular-nums"
          style={{ color }}
        >
          {currentLevel}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-stone-500 dark:text-stone-400">
          level
        </span>
      </div>
      {nextLevelThreshold !== undefined && nextLevelLabel && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-stone-500 dark:text-stone-400">
          <span className="font-mono">{score}</span>
          <span className="mx-1">/</span>
          <span className="font-mono">{nextLevelThreshold}</span>
          <span className="ml-1">→ {nextLevelLabel}</span>
        </div>
      )}
    </div>
  );
}