import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import type { GraphData } from '../lib/graphTypes.ts';
import { nextPathways } from '../engine/RhizomeTraverser.ts';

interface Props {
  graph: GraphData;
  fromCaseId: string;
  n?: number;
}

/**
 * Right-rail panel: "Where to go next".
 *
 * Reads the concept graph and returns up to `n` neighbours of the
 * current case study. Each neighbour is rendered as a card with the
 * node's label, topic, and stage.
 *
 * This is the user-visible face of INV-P4 (rhizomatic freedom): there
 * is never a single "next" lesson — there are several candidates and
 * the learner picks.
 */
export function NextPathways({ graph, fromCaseId, n = 4 }: Props) {
  const ids = nextPathways(graph, fromCaseId, { n, diversify: true });

  if (ids.length === 0) {
    return null;
  }

  const nodes = ids
    .map((id) => graph.nodes.find((nd) => nd.id === id))
    .filter((nd): nd is NonNullable<typeof nd> => nd !== undefined);

  const ready = nodes.filter((nd) => nd.ready);
  const planned = nodes.filter((nd) => !nd.ready);

  return (
    <aside
      data-testid="pybe-next-pathways"
      className="rounded-2xl border border-stone-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-stone-800/70"
    >
      <header className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-700 dark:text-stone-200">
        <Compass className="h-3.5 w-3.5 text-amber-600" />
        Where to go next
      </header>

      {ready.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Ready now
          </div>
          <ul className="space-y-2">
            {ready.map((nd) => (
              <li key={nd.id}>
                <Link
                  to={nd.href ?? '#'}
                  className="group flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-sm transition-all hover:scale-[1.01] hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-sm dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30"
                >
                  <span className="flex-1">
                    <span className="block font-semibold text-emerald-900 group-hover:text-emerald-700 dark:text-emerald-100">
                      {nd.label}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-700/80 dark:text-emerald-300/80">
                      {nd.topic}
                    </span>
                  </span>
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {planned.length > 0 && (
        <div>
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Coming soon
          </div>
          <ul className="space-y-2">
            {planned.map((nd) => (
              <li key={nd.id}>
                <div className="flex items-start gap-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-700/40">
                  <span className="flex-1">
                    <span className="block font-semibold text-stone-500">{nd.label}</span>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400">
                      {nd.topic} · planned
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}