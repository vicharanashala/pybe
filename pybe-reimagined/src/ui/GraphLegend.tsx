import type { GraphNode } from '../lib/graphTypes.ts';

interface Props {
  nodes: GraphNode[];
}

/**
 * Legend for the concept graph. Maps each Piaget stage to its color,
 * and shows the locked-vs-ready semantics.
 */
export function GraphLegend({ nodes }: Props) {
  const ready = nodes.filter((n) => n.ready).length;
  const planned = nodes.length - ready;
  const stages: GraphNode['stage'][] = [
    'sensorimotor',
    'preoperational',
    'concrete',
    'formal',
  ];
  const colors: Record<GraphNode['stage'], string> = {
    sensorimotor: 'bg-sky-200 text-sky-800 border-sky-300',
    preoperational: 'bg-lavender/20 bg-purple-100 text-purple-800 border-purple-300',
    concrete: 'bg-emerald-200 text-emerald-800 border-emerald-300',
    formal: 'bg-amber-200 text-amber-900 border-amber-300',
  };
  const labels: Record<GraphNode['stage'], string> = {
    sensorimotor: 'Sensorimotor',
    preoperational: 'Preoperational',
    concrete: 'Concrete',
    formal: 'Formal',
  };

  return (
    <div
      data-testid="pybe-graph-legend"
      className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-xs"
    >
      <div className="mb-2 font-semibold text-stone-700">Piaget stages</div>
      <ul className="flex flex-wrap gap-2">
        {stages.map((s) => (
          <li
            key={s}
            data-testid={`pybe-graph-legend-stage-${s}`}
            className={`flex items-center gap-1 rounded-full border px-2 py-1 ${colors[s]}`}
          >
            <span className="font-medium">{labels[s]}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-stone-500">
        {ready} ready · {planned} planned · click any node to navigate
      </div>
    </div>
  );
}