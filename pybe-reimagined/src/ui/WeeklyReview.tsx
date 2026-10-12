import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Calendar, Eye } from 'lucide-react';
import { getTracker } from '../analytics/tracker.ts';
import { LocalStorageTracker } from '../analytics/tracker.ts';
import type { AnalyticsEvent } from '../analytics/events.ts';
import { LevelBadge } from './LevelBadge.tsx';
import { flagsForUI, isFeatureEnabled } from '../admin/featureFlags.ts';

interface Aggregates {
  totalEvents: number;
  byName: Record<string, number>;
  uniqueLearners: number;
  last7days: number;
  successRate: number; // 0..1, run_code_success / (run_code_success + run_code_failure)
  feedbackAvgScore: number | null;
}

/**
 * /weekly-review — Phase 10 iteration dashboard.
 *
 * Reads analytics from the LocalStorageTracker and aggregates for the
 * current week's review. Read-only at v1.0; Phase 11+ adds aggregation
 * server-side and trend lines.
 */
export function WeeklyReview() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    // Drain persisted events.
    const tracker = getTracker();
    if (tracker instanceof LocalStorageTracker) {
      // The tracker exposes a readonly list — copy so React state stays mutable.
      setEvents([...tracker.list()]);
    }
  }, []);

  const agg = useMemo<Aggregates>(() => {
    const byName: Record<string, number> = {};
    const learners = new Set<string>();
    let successes = 0;
    let failures = 0;
    let feedbackSum = 0;
    let feedbackN = 0;
    let last7days = 0;
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    for (const ev of events) {
      byName[ev.name] = (byName[ev.name] ?? 0) + 1;
      learners.add(ev.userId || 'anon');
      if (ev.ts >= sevenDaysAgo) last7days += 1;
      if (ev.name === 'run_code_success') successes += 1;
      if (ev.name === 'run_code_failure') failures += 1;
      if (ev.name === 'feedback_submitted') {
        const score = (ev.props as { score: number }).score;
        if (typeof score === 'number') {
          feedbackSum += score;
          feedbackN += 1;
        }
      }
    }
    const runsTotal = successes + failures;
    return {
      totalEvents: events.length,
      byName,
      uniqueLearners: learners.size,
      last7days,
      successRate: runsTotal === 0 ? 1 : successes / runsTotal,
      feedbackAvgScore: feedbackN === 0 ? null : feedbackSum / feedbackN,
    };
  }, [events]);

  // Determine the ISO week string (YYYY-Www) for display.
  const isoWeek = useMemo(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to dashboard
          </Link>
          <h1 className="mt-2 inline-flex items-center gap-2 text-3xl font-bold text-stone-900">
            <BarChart3 className="h-6 w-6 text-amber-600" />
            Weekly review
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-stone-600">
            <Calendar className="h-3 w-3" /> Week {isoWeek}
          </p>
        </div>
        <LevelBadge />
      </header>

      <section
        data-testid="pybe-weekly-metrics"
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <Metric label="Total events" value={agg.totalEvents} />
        <Metric label="Unique learners" value={agg.uniqueLearners} />
        <Metric label="Last 7 days" value={agg.last7days} />
        <Metric
          label="Pyodide success"
          value={`${Math.round(agg.successRate * 100)}%`}
        />
        <Metric
          label="Feedback avg"
          value={agg.feedbackAvgScore === null ? '—' : agg.feedbackAvgScore.toFixed(1)}
        />
      </section>

      <section className="pybe-card mb-6">
        <h2 className="mb-3 text-sm font-semibold text-stone-800">Events by name</h2>
        {Object.keys(agg.byName).length === 0 ? (
          <p
            data-testid="pybe-weekly-empty"
            className="text-sm text-stone-500"
          >
            No events yet. Run a case study to populate the dashboard.
          </p>
        ) : (
          <ul data-testid="pybe-weekly-byname" className="space-y-1 text-sm">
            {Object.entries(agg.byName).map(([name, count]) => (
              <li key={name} className="flex items-center justify-between rounded bg-stone-50 px-3 py-1.5">
                <span className="font-mono text-stone-700">{name}</span>
                <span className="rounded-full bg-stone-200 px-2 py-0.5 font-mono text-xs text-stone-700">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pybe-card">
        <h2 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-stone-800">
          <Eye className="h-4 w-4" /> Feature flags (Phase 10 guardrail)
        </h2>
        <ul data-testid="pybe-weekly-flags" className="space-y-1 text-xs">
          {flagsForUI().map((f) => (
            <li
              key={f.id}
              data-testid={`pybe-flag-${f.id}`}
              className="flex items-center justify-between rounded bg-stone-50 px-3 py-1.5"
            >
              <span className="font-mono text-stone-700">{f.id}</span>
              <span>
                {isFeatureEnabled(f.id) ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono text-emerald-800">
                    ON
                  </span>
                ) : (
                  <span
                    className="rounded-full bg-stone-200 px-2 py-0.5 font-mono text-stone-600"
                    title={f.gating}
                  >
                    OFF
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3">
      <div className="text-xs uppercase tracking-wide text-stone-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-stone-900">{value}</div>
    </div>
  );
}