import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useLearner } from '../state/LearnerContext.tsx';
import { LEVEL_THRESHOLDS, type Level } from '../domain/Learner.ts';

const LEVEL_LABEL: Record<Level, string> = {
  1: 'Beginner',
  2: 'Practitioner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Mastery',
};

const TOAST_TIMEOUT_MS = 6_000;
const CONFETTI_COUNT = 12;
const CONFETTI_COLORS = ['#f59e0b', '#0ea5e9', '#10b981', '#a78bfa', '#fb7185'];

interface ConfettiDot {
  id: number;
  left: number;
  delay: number;
  color: string;
  rotation: number;
}

/**
 * LevelCrossingToast — celebratory toast with confetti animation.
 * Renders a small burst of colored dots that rise and fade.
 */
export function LevelCrossingToast() {
  const { celebrateLevel, dismissCelebration } = useLearner();
  const level = celebrateLevel;

  const dots = useMemo<ConfettiDot[]>(() => {
    if (!level) return [];
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 200,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
      rotation: Math.random() * 360,
    }));
  }, [level]);

  useEffect(() => {
    if (!level) return;
    const id = window.setTimeout(dismissCelebration, TOAST_TIMEOUT_MS);
    return () => window.clearTimeout(id);
  }, [level, dismissCelebration]);

  if (!level) return null;

  const next = level < 5 ? LEVEL_THRESHOLDS[(level + 1) as Level] : null;

  return (
    <div
      data-testid="pybe-level-toast"
      data-level={level}
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {/* Confetti dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {dots.map((d) => (
          <span
            key={d.id}
            data-testid={`pybe-confetti-${d.id}`}
            aria-hidden
            className="absolute bottom-0 block h-2 w-2 rounded-sm pybe-anim-confetti"
            style={{
              left: `${d.left}%`,
              backgroundColor: d.color,
              transform: `rotate(${d.rotation}deg)`,
              animationDelay: `${d.delay}ms`,
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-auto relative flex max-w-md items-start gap-3 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-2xl dark:border-amber-500/50 dark:from-amber-900/40 dark:to-orange-900/40"
        data-testid="pybe-level-toast-card"
      >
        <div className="text-3xl">🎉</div>
        <div className="flex-1">
          <p className="text-base font-bold text-amber-900 dark:text-amber-100">
            ELIGIBLE FOR LEVEL {level}: {LEVEL_LABEL[level]}!
          </p>
          {next !== null ? (
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
              Next target: Level {level + 1} at {next} points.
            </p>
          ) : (
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
              Mastery unlocked. No upper score — keep exploring.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismissCelebration}
          className="rounded-md p-1 text-amber-700 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/50"
          aria-label="Dismiss"
          data-testid="pybe-level-toast-close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}