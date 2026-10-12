import { Link } from 'react-router-dom';
import { Trophy, RotateCcw, Network, BarChart3, ArrowRight } from 'lucide-react';
import {
  LEVEL_THRESHOLDS,
  type Level,
  levelFromScore,
} from '../domain/Learner.ts';
import { useLearner } from '../state/LearnerContext.tsx';
import { formatScore } from '../engine/ScoringEngine.ts';
import { buildLeaderboard, topN } from '../lib/leaderboard.ts';
import { ProgressRing } from './ProgressRing.tsx';
import { LevelBadge } from './LevelBadge.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';

const LEVEL_LABEL: Record<Level, string> = {
  1: 'Beginner',
  2: 'Practitioner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Mastery',
};

export function Dashboard() {
  const { learner, reset } = useLearner();
  const leaderboard = topN(buildLeaderboard(learner.history), 10);

  const lv = (learner.level ?? levelFromScore(learner.score)) as Level;
  const next = lv < 5 ? ((lv + 1) as Level) : null;
  const nextThreshold = next ? LEVEL_THRESHOLDS[next] : null;
  const progressWithinLevel =
    next && nextThreshold
      ? Math.max(0, Math.min(1, learner.score / nextThreshold))
      : 1;

  return (
    <main
      data-testid="pybe-dashboard"
      className="mx-auto max-w-4xl px-6 py-10 text-stone-900 dark:text-stone-100"
    >
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your progress</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Local-first for now. Phase 9 will sync to a server.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <Link
            to="/concept-graph"
            className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500"
          >
            <Network className="h-3 w-3" /> Concept graph
          </Link>
          <Link
            to="/weekly-review"
            className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 transition-colors hover:border-amber-300 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500"
          >
            <BarChart3 className="h-3 w-3" /> Weekly review
          </Link>
          <LevelBadge />
        </div>
      </header>

      {/* ─── Hero score card ─────────────────────────────────────────── */}
      <section
        className="mb-6 grid grid-cols-1 gap-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-800 sm:grid-cols-[1fr_auto] sm:p-8"
      >
        <div className="flex flex-col justify-center">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Total score
          </div>
          <div
            data-testid="pybe-dashboard-score"
            className="text-5xl font-extrabold tabular-nums tracking-tight text-stone-900 dark:text-stone-50"
          >
            {formatScore(learner.score)}
          </div>
          <div className="mt-3 inline-flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                lv === 1
                  ? 'bg-stone-100 text-stone-700 dark:bg-stone-700 dark:text-stone-200'
                  : lv === 2
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
                    : lv === 3
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
                      : lv === 4
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200'
              }`}
            >
              L{lv} · {LEVEL_LABEL[lv]}
            </span>
          </div>
          <div className="mt-4 text-sm text-stone-600 dark:text-stone-300">
            {(() => {
              if (lv >= 5) {
                return (
                  <>
                    <strong className="text-emerald-700 dark:text-emerald-300">
                      Mastery unlocked.
                    </strong>{' '}
                    No upper cap — keep exploring.
                  </>
                );
              }
              const pct = Math.round(progressWithinLevel * 100);
              const left = Math.max(0, (nextThreshold ?? 0) - learner.score);
              return (
                <>
                  <span className="font-mono">{pct}%</span> to{' '}
                  <strong>{LEVEL_LABEL[next!]}</strong> (
                  <span className="font-mono">{left} pts</span> to go)
                </>
              );
            })()}
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
              style={{ width: `${Math.round(progressWithinLevel * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-end">
          <ProgressRing
            progress={progressWithinLevel}
            currentLevel={lv}
            nextLevelLabel={next ? LEVEL_LABEL[next] : undefined}
            nextLevelThreshold={nextThreshold ?? undefined}
            score={learner.score}
          />
        </div>
      </section>

      {/* ─── Quick actions ───────────────────────────────────────────── */}
      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickAction to="/cases" icon={<ArrowRight className="h-4 w-4" />} label="Browse cases" />
        <QuickAction to="/concept-graph" icon={<Network className="h-4 w-4" />} label="Open graph" />
        <QuickAction to="/weekly-review" icon={<BarChart3 className="h-4 w-4" />} label="This week" />
      </section>

      {/* ─── Leaderboard ──────────────────────────────────────────────── */}
      <section className="pybe-card">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-lg font-semibold">Local leaderboard</h2>
          <span className="ml-auto text-xs text-stone-500 dark:text-stone-400">top 10</span>
        </div>
        {leaderboard.length === 0 ? (
          <p
            data-testid="pybe-leaderboard-empty"
            className="text-sm text-stone-500 dark:text-stone-400"
          >
            Inbox empty — no solved cases yet.{' '}
            <Link to="/cases" className="text-amber-700 underline dark:text-amber-300">
              Browse case studies →
            </Link>
          </p>
        ) : (
          <table data-testid="pybe-leaderboard" className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
              <tr>
                <th className="pb-2 pr-3">#</th>
                <th className="pb-2 pr-3">Case study</th>
                <th className="pb-2 pr-3 text-right">Score delta</th>
                <th className="pb-2 pr-3 text-right">Last attempt</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr
                  key={entry.caseStudyId}
                  data-testid={`pybe-leaderboard-row-${i}`}
                  className="border-t border-stone-100 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-700/50"
                >
                  <td className="py-2 pr-3 font-mono tabular-nums text-stone-400">{i + 1}</td>
                  <td className="py-2 pr-3">
                    <Link
                      to={`/learn/${entry.caseStudyId}`}
                      className="font-mono text-amber-700 hover:underline dark:text-amber-300"
                    >
                      {entry.caseStudyId}
                    </Link>
                  </td>
                  <td className="py-2 pr-3 text-right font-mono tabular-nums">+{entry.score}</td>
                  <td className="py-2 pr-3 text-right text-xs text-stone-500 dark:text-stone-400">
                    {new Date(entry.lastAttemptAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="mt-6 text-right">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset your progress? This cannot be undone.')) {
              reset();
            }
          }}
          className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-200"
        >
          <RotateCcw className="h-3 w-3" />
          Reset progress
        </button>
      </div>
    </main>
  );
}

function QuickAction({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      data-testid={`pybe-dashboard-action-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className="group flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md active:scale-[0.98] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500"
    >
      <span className="inline-flex items-center gap-2">{icon} {label}</span>
      <ArrowRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-0.5 dark:text-stone-500" />
    </Link>
  );
}