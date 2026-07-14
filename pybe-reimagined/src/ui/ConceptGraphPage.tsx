import { Link } from 'react-router-dom';
import { ArrowLeft, Network, Sparkles, Compass } from 'lucide-react';
import { ConceptGraph } from './ConceptGraph.tsx';
import { GRAPH } from '../lib/graphTypes.ts';

export function ConceptGraphPage() {
  const ready = GRAPH.nodes.filter((n) => n.ready).length;
  const planned = GRAPH.nodes.length - ready;
  const caseNodes = GRAPH.nodes.filter((n) => n.id.startsWith('cs_')).length;
  const conceptNodes = GRAPH.nodes.length - caseNodes;
  const edges = GRAPH.edges.length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <Link
          to="/cases"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to case studies
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
              <Network className="h-3 w-3" />
              Rhizome
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
              The concept graph
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-300">
              Every case study is a node; every construct is a hub. Click a node to enter the case
              study. There is no fixed curriculum — INV-P4 says the graph is fully reachable, so
              you can jump anywhere.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            <Stat value={caseNodes} label="cases" />
            <Stat value={conceptNodes} label="concepts" />
            <Stat value={edges} label="links" />
            <Stat value={planned} label="planned" />
          </div>
        </div>
      </div>

      {/* ─── The graph itself ──────────────────────────────────────── */}
      <ConceptGraph data={GRAPH} />

      {/* ─── How to use this graph ─────────────────────────────────── */}
      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Hint
          icon={<Compass className="h-4 w-4" />}
          title="Click to navigate"
          body="Any coloured node is a ready case study. Click it to enter the loop. Locked nodes are planned hubs."
        />
        <Hint
          icon={<Sparkles className="h-4 w-4" />}
          title="Filter by topic"
          body="Use the chips above to focus on one construct — for example, only loops or only dictionaries. Edges stay connected."
        />
        <Hint
          icon={<Network className="h-4 w-4" />}
          title="Drag and zoom"
          body={`Grab the canvas to pan. Use the +/− buttons (top-right) to zoom. The graph is denser than it looks — ${GRAPH.nodes.length} nodes connected by ${edges} edges.`}
        />
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-4 py-2 shadow-sm dark:border-stone-700 dark:bg-stone-800">
      <div className="text-2xl font-extrabold tabular-nums text-amber-600 dark:text-amber-400">
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
        {label}
      </div>
    </div>
  );
}

function Hint({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3 text-xs text-stone-600 shadow-sm dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
      <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700">
        {icon}
        {title}
      </div>
      <p className="leading-relaxed">{body}</p>
    </div>
  );
}