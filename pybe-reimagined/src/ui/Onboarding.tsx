import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Sparkles,
  Trophy,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { useLearner } from '../state/LearnerContext.tsx';

/**
 * First-run onboarding.
 *
 * Phase 12: there is no metaphor to pick any more. Case studies present
 * a single clean scenario, so onboarding is a quick "here's how Pybe
 * works, tap to start" flow that completes `hasOnboarded` and
 * redirects to /cases.
 *
 * Visual model: a wide hero panel (full-width gradient), a 3-step
 * numbered pipeline, an inline preview of what a case study looks
 * like, and a clear CTA with secondary action. Bright amber palette
 * against a warm cream background — feels like a product launch page,
 * not a "click OK" dialog.
 */
export function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useLearner();

  const handleStart = (): void => {
    completeOnboarding();
    navigate('/cases');
  };

  const handleBrowse = (): void => {
    completeOnboarding();
    navigate('/cases');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white text-stone-900 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 dark:text-stone-50">
      {/* ─── Top bar ───────────────────────────────────────────────── */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">Pybe</span>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-white/70 px-3 py-1 text-xs font-semibold text-amber-800 backdrop-blur sm:inline-flex dark:border-amber-700/40 dark:bg-amber-900/30 dark:text-amber-200">
          <Trophy className="h-3 w-3" />
          v1.0 released
        </div>
      </header>

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800 dark:border-amber-700/40 dark:bg-amber-900/40 dark:text-amber-200">
              <Sparkles className="h-3 w-3" />
              Welcome to Pybe
            </div>
            <h1 className="mb-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Learn Python by{' '}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                solving real problems
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-balance text-lg leading-relaxed text-stone-700 dark:text-stone-300">
              Pybe teaches Python through case studies — small real-world
              scenarios you solve by naming the right Python construct. No
              lectures. No syntax drills. Pick a case, reason about it,
              run the code.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleStart}
                data-testid="pybe-onboarding-start"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-4 text-base font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40 active:scale-95"
              >
                <Play className="h-5 w-5 fill-current" />
                Start with case study #1
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={handleBrowse}
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-5 py-4 text-sm font-semibold text-stone-700 transition-all hover:border-amber-400 hover:text-amber-700 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500 dark:hover:text-amber-300"
              >
                Browse all 35 case studies
              </button>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              No login required · Saves locally · 100% open source
            </p>
          </div>

          {/* Right: visual preview of a case study card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-200/40 via-rose-200/30 to-sky-200/40 blur-2xl dark:from-amber-700/20 dark:via-rose-700/10 dark:to-sky-700/20" />
            <PreviewCard />
          </div>
        </div>
      </section>

      {/* ─── 3-step pipeline ─────────────────────────────────────── */}
      <section className="mx-auto mt-20 max-w-6xl px-6 sm:mt-28">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            How a case study works
          </h2>
          <p className="text-stone-600 dark:text-stone-400">
            Three regions. One focused flow. Same on every case.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Step
            n={1}
            icon={<BookOpen className="h-5 w-5" />}
            title="Read"
            body="A real scenario at the top. Plain English, no jargon."
            accent="amber"
          />
          <Step
            n={2}
            icon={<Compass className="h-5 w-5" />}
            title="Reason"
            body="Write how you would solve it. Submit when ready (≥ 30 chars)."
            accent="sky"
          />
          <Step
            n={3}
            icon={<Sparkles className="h-5 w-5" />}
            title="Reveal"
            body="The Python construct is shown, with code you can run live."
            accent="emerald"
          />
        </ol>
      </section>

      {/* ─── Stats strip ─────────────────────────────────────────── */}
      <section className="mx-auto mt-16 max-w-4xl px-6 pb-20 sm:mt-20">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm backdrop-blur sm:grid-cols-4 sm:gap-4 sm:p-6 dark:border-stone-700 dark:bg-stone-800/70">
          <Stat value="35" label="case studies" />
          <Stat value="29" label="invariants" />
          <Stat value="8" label="analytics events" />
          <Stat value="∞" label="score cap" hint="INV-PB-3" />
        </div>
      </section>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────────── */

function PreviewCard() {
  return (
    <div
      data-testid="pybe-onboarding-preview"
      className="relative rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl shadow-stone-900/10 dark:border-stone-700 dark:bg-stone-800"
    >
      {/* Window chrome */}
      <div className="mb-4 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 text-xs font-mono text-stone-400">/learn/cs_001</span>
      </div>

      {/* Scenario strip */}
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
        <BookOpen className="h-3 w-3" />
        Scenario
      </div>
      <h3 className="mb-2 text-base font-bold leading-snug text-stone-900 dark:text-stone-50">
        Average of Five Friends' Scores
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        Five friends showed their math scores: 78, 92, 65, 88, 71. What Python
        construct would you reach for to compute the average?
      </p>

      {/* Reasoning strip */}
      <div className="mb-4 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-900/40">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
            Your reasoning
          </span>
          <span className="text-[10px] tabular-nums text-emerald-600">62 / 30+ chars</span>
        </div>
        <p className="font-mono text-xs text-stone-700 dark:text-stone-300">
          I'd gather the five marks into a list and walk through them with a
          for loop, accumulating a sum, then divide by the count.
        </p>
      </div>

      {/* Reveal strip */}
      <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 p-3 dark:bg-emerald-900/20">
        <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          <Sparkles className="h-3 w-3" />
          The construct
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-mono normal-case text-emerald-700 dark:bg-emerald-900/30">
            list, for, sum, len
          </span>
        </div>
        <pre className="overflow-x-auto rounded bg-stone-900 px-3 py-2 font-mono text-[11px] leading-relaxed text-stone-100">
{`marks = [78, 92, 65, 88, 71]
total = sum(marks)
print(total / len(marks))  # 78.8`}
        </pre>
      </div>
    </div>
  );
}

const STEP_ACCENTS = {
  amber: {
    ring: 'ring-amber-300',
    badge: 'bg-amber-100 text-amber-800',
    icon: 'bg-amber-500 text-white',
  },
  sky: {
    ring: 'ring-sky-300',
    badge: 'bg-sky-100 text-sky-800',
    icon: 'bg-sky-500 text-white',
  },
  emerald: {
    ring: 'ring-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800',
    icon: 'bg-emerald-500 text-white',
  },
} as const;

function Step({
  n,
  icon,
  title,
  body,
  accent,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: keyof typeof STEP_ACCENTS;
}) {
  const a = STEP_ACCENTS[accent];
  return (
    <li className="relative rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-stone-700 dark:bg-stone-800">
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-extrabold shadow-md ${a.icon}`}
        >
          {n}
        </span>
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${a.badge}`}
        >
          {icon}
        </span>
      </div>
      <h3 className="mb-1 text-base font-bold text-stone-900 dark:text-stone-50">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        {body}
      </p>
    </li>
  );
}

function Stat({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl font-extrabold tabular-nums text-amber-600 sm:text-3xl dark:text-amber-400">
        {value}
      </div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-500 sm:text-xs dark:text-stone-400">
        {label}
      </div>
      {hint && (
        <div className="mt-0.5 font-mono text-[9px] text-stone-400 dark:text-stone-500">
          {hint}
        </div>
      )}
    </div>
  );
}