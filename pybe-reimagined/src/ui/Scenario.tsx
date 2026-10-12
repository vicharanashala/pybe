import { BookOpen, Briefcase, Layers, GraduationCap } from 'lucide-react';
import type { CaseStudy } from '../domain/CaseStudy.ts';
import type { ScenarioView } from '../domain/LessonRenderer.ts';

interface Props {
  caseStudy: CaseStudy;
  view: ScenarioView;
}

/**
 * Top region of the three-region layout. INV-I1: scenario is always the
 * first thing visible. INV-I2: scenario occupies the top zone.
 *
 * Phase 12: there is no metaphor layer any more. The scenario text
 * comes straight from the case study. A practitioner note (optional)
 * is rendered as a quiet footnote below the scenario.
 */
export function Scenario({ caseStudy, view }: Props) {
  return (
    <section
      data-testid="pybe-scenario"
      data-metaphor="default"
      aria-label="Case scenario"
      className="relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-white to-stone-50 shadow-sm dark:border-stone-700 dark:from-stone-800 dark:to-stone-900"
    >
      {/* Decorative top-right corner blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10"
      />

      <div className="relative px-6 py-7 sm:px-8 sm:py-9">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-900">
            <BookOpen className="h-3 w-3" />
            Scenario
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-stone-600 dark:bg-stone-700 dark:text-stone-300">
            <Layers className="h-3 w-3" />
            {caseStudy.jonassenType}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-stone-600 dark:bg-stone-700 dark:text-stone-300">
            <GraduationCap className="h-3 w-3" />
            level {caseStudy.level}
          </span>
        </div>

        <h1
          data-testid="pybe-scenario-title"
          className="mb-4 text-balance text-2xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50"
        >
          {caseStudy.title}
        </h1>

        <p
          data-testid="pybe-scenario-text"
          className="text-base leading-relaxed text-stone-700 sm:text-lg dark:text-stone-200"
        >
          {view.text}
        </p>

        {view.practitionerNote && (
          <p
            data-testid="pybe-scenario-practitioner-note"
            className="mt-5 flex items-start gap-2 border-t border-stone-200 pt-4 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400"
          >
            <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" />
            <span>
              <span className="font-semibold text-stone-600 dark:text-stone-300">
                In the wild:
              </span>{' '}
              {view.practitionerNote}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}