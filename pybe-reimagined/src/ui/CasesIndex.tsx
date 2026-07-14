import { Link } from 'react-router-dom';
import { ArrowRight, Network, Trophy } from 'lucide-react';
import { orchestrator } from '../engine/CaseStudyOrchestrator.ts';
import { LevelBadge } from './LevelBadge.tsx';

export function CasesIndex() {
  const cases = orchestrator.list();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
            Case studies
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">
            {cases.length} case studies. Each one is a real problem first; the
            Python construct comes after you reason about it.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/concept-graph"
            className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <Network className="h-3 w-3" /> Concept graph
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:text-amber-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
          >
            <Trophy className="h-3 w-3" /> Dashboard
          </Link>
          <LevelBadge />
        </div>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cases.map((cs) => (
          <li key={cs.id}>
            <Link
              to={`/learn/${cs.id}`}
              className="group block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-800"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                <span className="font-mono text-stone-600 dark:text-stone-300">{cs.id}</span>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600 dark:bg-stone-700 dark:text-stone-300">
                  level {cs.level}
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                  {cs.jonassenType}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                {cs.title}
              </h2>
              <p className="line-clamp-3 text-sm text-stone-600 dark:text-stone-400">
                {cs.scenario}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">
                  constructs:{' '}
                  <code className="font-mono text-stone-700 dark:text-stone-200">
                    {cs.constructHint.join(', ')}
                  </code>
                </span>
                <span className="inline-flex items-center gap-1 text-amber-700 transition-transform group-hover:translate-x-0.5 dark:text-amber-300">
                  Start <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}