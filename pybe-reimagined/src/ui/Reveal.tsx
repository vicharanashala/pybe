import { Lightbulb, Sparkles, Target } from 'lucide-react';
import type { RevealEntry } from '../lib/revealContent.ts';

interface Props {
  entry: RevealEntry;
}

/**
 * Bottom region of the three-region layout, unlocked. INV-I2.
 * Renders the construct, the explanation, the first-code snippet, and
 * (when present) a "Did you know?" insight card and a "Why this
 * matters" one-liner — the two richness fields that make every case
 * feel researched rather than mechanical.
 *
 * Phase 4 plugs the TryItEditor (live Pyodide) under the snippet.
 */
export function Reveal({ entry }: Props) {
  return (
    <section
      data-testid="pybe-reveal"
      aria-label="The construct"
      className="pybe-card border-l-4 border-l-emerald-500"
    >
      <header className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          <Sparkles className="h-3 w-3" />
          The construct
        </span>
        <span
          data-testid="pybe-reveal-construct"
          className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-800"
        >
          {entry.construct}
        </span>
      </header>

      <p
        data-testid="pybe-reveal-explanation"
        className="mb-5 text-sm leading-relaxed text-stone-700"
      >
        {entry.explanation}
      </p>

      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
        First code
      </div>
      <pre
        data-testid="pybe-first-code"
        className="overflow-x-auto rounded-md bg-stone-900 p-4 text-xs leading-relaxed text-stone-100"
      >
        <code>{entry.firstCode}</code>
      </pre>

      {entry.didYouKnow && (
        <aside
          data-testid="pybe-did-you-know"
          className="mt-5 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              Did you know?
            </div>
            <p className="leading-relaxed">{entry.didYouKnow}</p>
          </div>
        </aside>
      )}

      {entry.whyItMatters && (
        <aside
          data-testid="pybe-why-it-matters"
          className="mt-3 flex gap-3 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900"
        >
          <Target className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              Why this matters
            </div>
            <p className="leading-relaxed">{entry.whyItMatters}</p>
          </div>
        </aside>
      )}
    </section>
  );
}