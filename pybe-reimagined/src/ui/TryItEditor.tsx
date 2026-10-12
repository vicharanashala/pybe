import { useEffect, useState } from 'react';
import { Play, Square, Wrench, CheckCircle2, Loader2 } from 'lucide-react';
import { getRunner } from '../adapter/runner.ts';
import { useLearner } from '../state/LearnerContext.tsx';
import { trackEvent } from '../analytics/tracker.ts';
import type { RunResult } from '../adapter/PythonRunner.ts';

interface Props {
  caseStudyId: string;
  defaultCode?: string;
}

const MAX_OUTPUT_LINES = 200;

/**
 * Phase-4 TryItEditor — real in-browser Python via the PythonRunner
 * interface. INV-A5: depends only on the interface.
 *
 * INV-PB-7: present on every /learn/* route (gated only by the RevealGate).
 * INV-I4: any snippet shown is runnable.
 * INV-P6: errors surfaced verbatim, stderr in red.
 */
export function TryItEditor({ caseStudyId, defaultCode = '' }: Props) {
  const { learner, dispatchScoring } = useLearner();
  const [code, setCode] = useState(defaultCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [loadProgress, setLoadProgress] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasScoredThisCase, setHasScoredThisCase] = useState<boolean>(() => {
    // Pre-load the "already scored" state from learner.history so re-attempts
    // don't double-count (Phase 2 acceptance: +15 first run only).
    return Boolean(learner.history[caseStudyId]?.lastScoreDelta === 15);
  });

  useEffect(() => {
    setCode(defaultCode);
    setResult(null);
  }, [defaultCode, caseStudyId]);

  const runner = getRunner();

  const handleRun = async (): Promise<void> => {
    if (running) return;
    setRunning(true);
    setResult(null);
    setErrorMessage(null);

    try {
      setLoadProgress('loading');
      await runner.load();
      setLoadProgress('ready');
      const r = await runner.run(code);
      setResult(r);

      // Phase-9 analytics: track run_code events (success / failure).
      if (r.ok) {
        trackEvent('run_code_success', { caseStudyId, ms: r.ms });
      } else {
        trackEvent('run_code_failure', {
          caseStudyId,
          ms: r.ms,
          errorType: r.timedOut ? 'timeout' : r.cancelled ? 'cancelled' : 'error',
        });
      }

      // Phase-2 scoring: +15 on the FIRST successful run for a given
      // case study. INV-PB-3: score keeps climbing; only the gate is
      // "first-time-only".
      if (r.ok && !hasScoredThisCase) {
        dispatchScoring({
          type: 'code_run_success',
          caseStudyId,
          ts: Date.now(),
        });
        setHasScoredThisCase(true);
      }
    } catch (err) {
      setLoadProgress('error');
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  };

  const handleStop = (): void => {
    runner.cancel();
  };

  const stdoutLines = result?.stdout ? result.stdout.split('\n').slice(0, MAX_OUTPUT_LINES) : [];
  const stderrLines = result?.stderr ? result.stderr.split('\n').slice(0, MAX_OUTPUT_LINES) : [];
  const truncateNote =
    result && (result.stdout.split('\n').length > MAX_OUTPUT_LINES || result.stderr.split('\n').length > MAX_OUTPUT_LINES)
      ? `… (output truncated to ${MAX_OUTPUT_LINES} lines)`
      : null;

  return (
    <section
      data-testid="pybe-try-it"
      aria-label="Try it yourself"
      className="pybe-card border-stone-200"
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        <Wrench className="h-4 w-4" />
        Try it yourself
        <span
          data-testid="pybe-try-it-status"
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
            loadProgress === 'ready'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
              : loadProgress === 'loading'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200'
                : loadProgress === 'error'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200'
                  : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
          }`}
        >
          {loadProgress === 'loading' && (
            <Loader2 className="h-3 w-3 pybe-anim-spin" data-testid="pybe-pyodide-spinner" />
          )}
          {loadProgress === 'ready' && <span aria-hidden>●</span>}
          {loadProgress === 'idle' && 'ready (click Run to load Pyodide)'}
          {loadProgress === 'loading' && 'loading Python runtime…'}
          {loadProgress === 'ready' && 'Python ready'}
          {loadProgress === 'error' && 'load failed'}
        </span>
      </div>

      <textarea
        data-testid="pybe-try-it-code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={6}
        spellCheck={false}
        className="w-full resize-y rounded-md border border-stone-300 bg-stone-50 p-3 font-mono text-xs leading-relaxed text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
      />

      <div className="mt-3 flex items-center gap-2">
        {!running ? (
          <button
            data-testid="pybe-try-it-run"
            type="button"
            onClick={handleRun}
            disabled={code.trim().length === 0}
            className="pybe-btn-primary disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <Play className="h-4 w-4" /> Run
          </button>
        ) : (
          <button
            data-testid="pybe-try-it-stop"
            type="button"
            onClick={handleStop}
            className="pybe-btn-ghost border border-rose-300 text-rose-700"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        )}
        {result?.ok && !hasScoredThisCase && (
          <span
            data-testid="pybe-try-it-first-success"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
          >
            <CheckCircle2 className="h-3 w-3" /> +15 score recorded
          </span>
        )}
      </div>

      {errorMessage && (
        <div
          data-testid="pybe-try-it-load-error"
          className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-700/40 dark:bg-rose-900/30 dark:text-rose-200"
        >
          <strong>Load failed:</strong> {errorMessage}
          <p className="mt-1 text-rose-700 dark:text-rose-300">
            Check your network connection. Pyodide is fetched from a public CDN on first run.
          </p>
        </div>
      )}

      {result && (
        <div data-testid="pybe-try-it-output" className="mt-4 space-y-2">
          {stdoutLines.length > 0 && (
            <pre
              data-testid="pybe-try-it-stdout"
              className="max-h-64 overflow-auto rounded-md bg-stone-900 p-3 font-mono text-xs leading-relaxed text-emerald-200"
            >
              <code>
                {stdoutLines.join('\n')}
                {result.stdout.endsWith('\n') ? '\n' : ''}
              </code>
            </pre>
          )}
          {stderrLines.length > 0 && (
            <pre
              data-testid="pybe-try-it-stderr"
              className="max-h-64 overflow-auto rounded-md bg-rose-50 p-3 font-mono text-xs leading-relaxed text-rose-900"
            >
              <code>
                {stderrLines.join('\n')}
                {result.stderr.endsWith('\n') ? '\n' : ''}
              </code>
            </pre>
          )}
          {truncateNote && (
            <p className="text-xs italic text-stone-500">{truncateNote}</p>
          )}
          <div
            data-testid="pybe-try-it-meta"
            className="flex items-center justify-between text-xs text-stone-500"
          >
            <span>
              {result.ok ? (
                <span className="text-emerald-700">OK</span>
              ) : result.timedOut ? (
                <span className="text-rose-700">Timeout</span>
              ) : result.cancelled ? (
                <span className="text-amber-700">Cancelled</span>
              ) : (
                <span className="text-rose-700">Error</span>
              )}
            </span>
            <span className="font-mono">{result.ms} ms</span>
          </div>
        </div>
      )}
    </section>
  );
}