import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Github,
  Code2,
  GitBranch,
  Brain,
  Zap,
  Layers,
  Shield,
} from 'lucide-react';
import { LevelBadge } from './LevelBadge.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';

interface Feature {
  icon: typeof Sparkles;
  title: string;
  body: string;
  tone: 'amber' | 'sky' | 'emerald' | 'rose';
}

const FEATURES: Feature[] = [
  {
    icon: Brain,
    title: 'Problems first, syntax last',
    body: 'Every concept arrives as a real-world scenario. You articulate a solution in plain English; the system reveals the Python construct only after.',
    tone: 'amber',
  },
  {
    icon: Layers,
    title: 'Rhizomatic, not linear',
    body: 'No fixed curriculum order. Pick any node in the concept graph. Switch your learning voice (Avengers, Hogwarts, Panchatantra) at any time.',
    tone: 'sky',
  },
  {
    icon: Code2,
    title: 'Real Python in your browser',
    body: 'A working Python interpreter (Pyodide) ships with every case study. No installs, no IDE, no friction. Just type and Run.',
    tone: 'emerald',
  },
  {
    icon: GitBranch,
    title: 'Generated, not curated',
    body: '32 case studies today, hundreds tomorrow. An LLM-backed generator expands the catalog; humans review every draft before it ships.',
    tone: 'rose',
  },
  {
    icon: Zap,
    title: 'No score ceiling',
    body: 'Your level rises with each solved case. Mastery has no upper bound — there is always a higher construct to discover.',
    tone: 'amber',
  },
  {
    icon: Shield,
    title: 'Privacy-first analytics',
    body: '8 named events, anonymous UUIDs only. No email, no IP, no cookies. Your progress stays on your device unless you choose sync.',
    tone: 'sky',
  },
];

const STATS = [
  { value: '35', label: 'case studies' },
  { value: '29', label: 'invariants enforced' },
  { value: '8', label: 'analytics events' },
  { value: '0', label: 'fictional worlds' },
];

const TONE_CLASSES: Record<Feature['tone'], string> = {
  amber: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-200',
  sky: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-700/40 dark:bg-sky-900/20 dark:text-sky-200',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-200',
  rose: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-200',
};

const TONE_ICON: Record<Feature['tone'], string> = {
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
};

export default function LandingPage() {
  return (
    <main
      data-testid="pybe-landing"
      className="min-h-screen pb-16 pt-6 text-stone-900 dark:text-stone-100"
    >
      {/* ─── Sticky top bar ───────────────────────────────────────────── */}
      <header className="mx-auto mb-12 flex max-w-6xl items-center justify-between px-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">Pybe</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LevelBadge />
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-12 text-center sm:pb-20">
        <div
          data-testid="pybe-hero-badge"
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        >
          <Sparkles className="h-3 w-3" /> v1.0 released — case-study-driven Python
        </div>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Learn Python by{' '}
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 bg-clip-text text-transparent">
            solving real problems
          </span>
          ,<br />not by reading syntax.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-stone-600 dark:text-stone-300 sm:text-xl">
          Pybe teaches Python with case studies — small, real-world scenarios you solve by
          naming the right construct. No lectures. No syntax drills. No fictional re-cast of
          the problem.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/cases"
            data-testid="pybe-cta-begin"
            className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95"
          >
            Begin a case study
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/concept-graph"
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-6 py-3 text-base font-medium text-stone-700 transition-all hover:border-amber-400 hover:text-amber-700 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500"
          >
            Explore the concept graph
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <Github className="h-3 w-3" />
          <a
            href="#"
            className="underline-offset-2 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Open source — MIT / Apache-2.0
          </a>
          <span>·</span>
          <span>No login. No tracking pixels. Local-first.</span>
        </div>
      </section>

      {/* ─── Stats strip ──────────────────────────────────────────────── */}
      <section
        data-testid="pybe-stats-grid"
        className="mx-auto mb-20 max-w-4xl px-6"
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-stone-200 bg-white/70 px-4 py-5 text-center shadow-sm backdrop-blur transition-all hover:scale-[1.02] hover:shadow-md dark:border-stone-700 dark:bg-stone-800/70"
            >
              <div className="text-3xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features grid ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Why Pybe feels different
          </h2>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            Six design decisions, each grounded in pedagogy research.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article
                key={f.title}
                className={`group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${TONE_CLASSES[f.tone]}`}
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${TONE_ICON[f.tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed opacity-90">{f.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── How it works (3 steps) ───────────────────────────────────── */}
      <section className="mx-auto mb-20 max-w-4xl px-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-800 sm:p-12">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            How a case study works
          </h2>
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                n: 1,
                title: 'Read',
                body: 'A real-world scenario at the top — no syntax, no jargon. Just the problem.',
              },
              {
                n: 2,
                title: 'Reason',
                body: 'Type how you would solve it in plain language. Submit when ready (≥ 30 chars).',
              },
              {
                n: 3,
                title: 'Reveal',
                body: 'The Python construct is revealed below, plus a working editor to try it yourself.',
              },
            ].map((s) => (
              <li key={s.n} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white shadow-md">
                  {s.n}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-300">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section className="mx-auto mb-16 max-w-2xl px-6 text-center">
        <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 p-8 text-white shadow-xl sm:p-12">
          <h2 className="mb-2 text-3xl font-bold">Ready when you are.</h2>
          <p className="mb-6 text-amber-50">
            No signup. Pick a case study and start.
          </p>
          <Link
            to="/cases"
            data-testid="pybe-cta-final"
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-base font-semibold text-amber-600 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            Start learning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="mx-auto max-w-6xl border-t border-stone-200 px-6 pt-6 text-xs text-stone-500 dark:border-stone-700 dark:text-stone-400">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>Problem-based · Rhizomatic · Open source · v1.0.0</span>
          <span>No login. No tracking pixels. Local-first.</span>
        </div>
      </footer>
    </main>
  );
}