import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Compass, Flame, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { orchestrator, CaseStudyNotFoundError } from '../engine/CaseStudyOrchestrator.ts';
import { REVEALS } from '../lib/revealContent.ts';
import { pickNudge } from '../engine/SocraticNudge.ts';
import { DEFAULT_RENDERER } from '../domain/LessonRenderer.ts';
import { useLearner } from '../state/LearnerContext.tsx';
import { trackEvent } from '../analytics/tracker.ts';
import { Scenario } from './Scenario.tsx';
import { ReasoningPanel } from './ReasoningPanel.tsx';
import { RevealGate } from './RevealGate.tsx';
import { Reveal } from './Reveal.tsx';
import { TryItEditor } from './TryItEditor.tsx';
import { StringSlicingVisual } from './components/StringSlicingVisual.tsx';
import { DictionaryVisual } from './components/DictionaryVisual.tsx';
import { LoopVisual } from './components/LoopVisual.tsx';
import { LevelBadge } from './LevelBadge.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { FeedbackWidget } from './FeedbackWidget.tsx';
import { NextPathways } from './NextPathways.tsx';
import { GRAPH } from '../lib/graphTypes.ts';
import { CASE_STUDIES } from '../lib/cases.ts';
import type { CaseStudy } from '../domain/CaseStudy.ts';

const IDLE_MS_BEFORE_NUDGE = 30_000;

interface LoadedState {
  kind: 'ok';
  caseStudy: CaseStudy;
}

interface NotFoundState {
  kind: 'not_found';
}

type LoadResult = LoadedState | NotFoundState;

function resolveCaseStudy(id: string): LoadResult {
  try {
    return { kind: 'ok', caseStudy: orchestrator.load(id) };
  } catch (err) {
    if (err instanceof CaseStudyNotFoundError) {
      return { kind: 'not_found' };
    }
    throw err;
  }
}

/**
 * Breadcrumb-style "journey line" — what number the learner is on in
 * the catalog, and the total. Encourages the perception of forward
 * motion without imposing order (INV-P4).
 */
function JourneyLine({ id, title }: { id: string; title: string }) {
  const sorted = [...CASE_STUDIES].sort((a, b) => a.id.localeCompare(b.id));
  const idx = sorted.findIndex((cs) => cs.id === id);
  const number = idx + 1;
  const total = sorted.length;
  if (number <= 0) return null;
  return (
    <div
      data-testid="pybe-journey-line"
      className="mb-3 flex items-center gap-3 text-xs"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 font-mono font-semibold text-amber-900">
        <Flame className="h-3 w-3" />
        Case {number} of {total}
      </span>
      <span className="hidden truncate text-stone-500 sm:inline">{title}</span>
      <span className="ml-auto inline-flex items-center gap-1 text-stone-400">
        <Trophy className="h-3 w-3" />
        Free navigation · INV-P4
      </span>
    </div>
  );
}

/**
 * Bottom of page: "Constructs you'll discover" preview. INV-PB-1 keeps
 * the syntax out of the visible scenario, but a *preview* card with the
 * names alone (no usage, no example) primes the learner for what they
 * are about to reason about.
 */
function ConstructPreview({ constructs }: { constructs: readonly string[] }) {
  if (constructs.length === 0) return null;
  return (
    <div
      data-testid="pybe-construct-preview"
      className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-amber-300 bg-amber-50/60 px-3 py-2 text-xs text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-200"
    >
      <span className="font-semibold uppercase tracking-wide">What you might discover:</span>
      {constructs.map((c) => (
        <span
          key={c}
          className="rounded-full bg-white px-2 py-0.5 font-mono text-amber-800 shadow-sm dark:bg-amber-900/40 dark:text-amber-100"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function CaseStudyPlayer() {
  const { caseStudyId = '' } = useParams<{ caseStudyId: string }>();
  const loadResult = resolveCaseStudy(caseStudyId);

  if (loadResult.kind === 'not_found') {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="mb-4 text-lg text-stone-700 dark:text-stone-200">
          No case study with id <code className="rounded bg-stone-100 px-1.5 dark:bg-stone-700">{caseStudyId}</code>.
        </p>
        <Link
          to="/cases"
          className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to case studies
        </Link>
      </main>
    );
  }

  return <CaseStudyPlayerInner caseStudy={loadResult.caseStudy} />;
}

interface InnerProps {
  caseStudy: CaseStudy;
}

function CaseStudyPlayerInner({ caseStudy }: InnerProps) {
  const revealEntry = REVEALS[caseStudy.id];
  const { recordAttempt, markRevealed, lastAttempt, revealedHints, dispatchScoring } =
    useLearner();

  // If the case has been revealed in a previous session, start the panel
  // in the unlocked state. INV-D3 (progress is lossless).
  const wasRevealed = (revealedHints[caseStudy.id]?.length ?? 0) > 0;

  const [reasoning, setReasoning] = useState(lastAttempt(caseStudy.id));
  const [revealed, setRevealed] = useState(wasRevealed);
  const [nudge, setNudge] = useState<string | null>(null);
  const [lastTypeAt, setLastTypeAt] = useState(Date.now());

  // Single source of truth for the scenario view: the default renderer
  // returns the case study's own scenario + optional practitioner note.
  const scenarioView = useMemo(
    () => DEFAULT_RENDERER.renderScenario(caseStudy),
    [caseStudy],
  );

  useEffect(() => {
    if (revealed) return;
    const id = window.setInterval(() => {
      if (Date.now() - lastTypeAt > IDLE_MS_BEFORE_NUDGE && !nudge) {
        setNudge(pickNudge());
      }
    }, 5_000);
    return () => window.clearInterval(id);
  }, [lastTypeAt, revealed, nudge]);

  // Phase 9: emit a `case_started` event when a case study page is
  // opened. The analytics tracker is offline-first (LocalStorage).
  useEffect(() => {
    trackEvent('case_started', {
      caseStudyId: caseStudy.id,
      piagetStage: caseStudy.piagetStage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseStudy.id]);

  if (!revealEntry) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <p className="text-rose-700">
          Reveal content missing for <code>{caseStudy.id}</code>. Add an entry to{' '}
          <code>src/lib/revealContent.ts</code>.
        </p>
      </main>
    );
  }

  const handleSubmit = (text: string): void => {
    setReasoning(text);
    setRevealed(true);
    setNudge(null);
    setLastTypeAt(Date.now());

    const ts = Date.now();
    recordAttempt(caseStudy.id, text);
    markRevealed(caseStudy.id);
    dispatchScoring({ type: 'submit_reasoning', caseStudyId: caseStudy.id, ts });
    dispatchScoring({ type: 'reveal_unlocked', caseStudyId: caseStudy.id, ts });
    trackEvent('reasoning_submitted', { caseStudyId: caseStudy.id, length: text.length });
    trackEvent('reveal_unlocked', {
      caseStudyId: caseStudy.id,
      constructs: caseStudy.constructHint.join(','),
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* ─── Top bar ───────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          to="/cases"
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-3 w-3" />
          All case studies
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LevelBadge />
        </div>
      </div>

      <JourneyLine id={caseStudy.id} title={caseStudy.title} />

      {/* ─── Two-column layout: main + right rail ──────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-6">
          <Scenario caseStudy={caseStudy} view={scenarioView} />

          <div>
            <ReasoningPanel
              initialValue={reasoning}
              onSubmit={(text) => {
                setLastTypeAt(Date.now());
                handleSubmit(text);
              }}
              nudgeQuestion={nudge ?? undefined}
              suggestConstructs={caseStudy.constructHint}
            />
            <ConstructPreview constructs={caseStudy.constructHint} />
          </div>

          <RevealGate locked={!revealed}>
            <Reveal entry={revealEntry} />
            {revealEntry.visualKind === 'string-slicing' && <StringSlicingVisual />}
            {revealEntry.visualKind === 'dictionary' && <DictionaryVisual />}
            {revealEntry.visualKind === 'loop' && <LoopVisual />}
            <TryItEditor caseStudyId={caseStudy.id} defaultCode={revealEntry.firstCode} />
            {revealed && (
              <div
                data-testid="pybe-submit-confirmation"
                className="mt-2 flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                +25 score recorded for submitting reasoning on this case study.
              </div>
            )}
          </RevealGate>
        </div>

        {/* Right rail: next pathways. Hidden on small screens. */}
        <aside className="hidden lg:flex lg:flex-col lg:gap-4">
          <NextPathways graph={GRAPH} fromCaseId={caseStudy.id} />
          <div className="rounded-2xl border border-stone-200 bg-white/70 p-4 text-xs text-stone-600 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-stone-800/70 dark:text-stone-300">
            <header className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stone-700 dark:text-stone-200">
              <Compass className="h-3.5 w-3.5 text-amber-600" />
              Free navigation
            </header>
            <p className="leading-relaxed">
              There is no fixed curriculum. After every case, the panel on the left suggests
              several next neighbours — pick the one that excites you.
            </p>
            <Link
              to="/concept-graph"
              className="mt-3 inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
            >
              Open the concept graph →
            </Link>
          </div>
        </aside>
      </div>

      <FeedbackWidget />
    </main>
  );
}

// Re-export the unused DefaultRenderer symbol so the import isn't tree-shaken
// out for downstream consumers (and tests can import it).
export { DEFAULT_RENDERER };