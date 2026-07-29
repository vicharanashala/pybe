import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { GRAPH, type GraphData, type GraphNode } from '../lib/graphTypes.ts';
import { GraphNodeRect } from './GraphNodeRect.tsx';
import { GraphLegend } from './GraphLegend.tsx';
import { nextPathways } from '../engine/RhizomeTraverser.ts';
import { Move, ZoomIn, ZoomOut, RotateCcw, Compass, Lock, ExternalLink } from 'lucide-react';

const WIDTH = 880;
const HEIGHT = 560;
const MIN_SCALE = 0.35;
const MAX_SCALE = 2.5;

interface PositionedNode extends GraphNode {
  x: number;
  y: number;
}

interface PositionedLink {
  source: PositionedNode;
  target: PositionedNode;
}

interface ViewTransform {
  x: number;
  y: number;
  scale: number;
}

interface Props {
  data?: GraphData;
}

export function ConceptGraph({ data = GRAPH }: Props = {}) {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [view, setView] = useState<ViewTransform>({ x: 0, y: 0, scale: 1 });
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  useEffect(() => {
    const simNodes: PositionedNode[] = data.nodes.map((n, i) => ({
      ...n,
      x: WIDTH / 2 + Math.cos((i / data.nodes.length) * Math.PI * 2) * 220,
      y: HEIGHT / 2 + Math.sin((i / data.nodes.length) * Math.PI * 2) * 170,
    }));
    const idIndex: Record<string, PositionedNode> = {};
    for (const n of simNodes) idIndex[n.id] = n;
    const simLinks: PositionedLink[] = data.edges
      .map((e) => {
        const src = idIndex[e.from];
        const tgt = idIndex[e.to];
        if (!src || !tgt) return null;
        return { source: src, target: tgt };
      })
      .filter((l): l is PositionedLink => l !== null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const linkForce: any = forceLink<any, any>(simLinks)
      .id((d: PositionedNode) => d.id)
      .distance(150)
      .strength(0.7);

    const simulation = forceSimulation(simNodes)
      .force('link', linkForce)
      .force('charge', forceManyBody().strength(-450))
      .force('center', forceCenter(WIDTH / 2, HEIGHT / 2))
      .force('collide', forceCollide(70))
      .stop();

    for (let i = 0; i < 380; i++) simulation.tick();

    const next: Record<string, { x: number; y: number }> = {};
    for (const n of simNodes) {
      next[n.id] = { x: n.x, y: n.y };
    }
    setPositions(next);
  }, [data]);

  const links = useMemo(() => {
    return data.edges
      .map((e) => {
        const s = positions[e.from];
        const t = positions[e.to];
        if (!s || !t) return null;
        return {
          from: e.from,
          to: e.to,
          sx: s.x,
          sy: s.y,
          tx: t.x,
          ty: t.y,
          ready: isReady(data, e.from) && isReady(data, e.to),
        };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);
  }, [positions, data]);

  // Topics — derived from the data (case studies + concept nodes).
  const topics = useMemo(() => {
    const set = new Set<string>();
    for (const n of data.nodes) {
      if (n.topic) set.add(n.topic);
    }
    return Array.from(set).sort();
  }, [data]);

  const filteredNodeIds = useMemo(() => {
    if (!topicFilter) return null;
    const set = new Set<string>();
    for (const n of data.nodes) {
      if (n.topic === topicFilter) set.add(n.id);
    }
    // Always include immediate neighbours to keep the graph connected
    // when filtering (graph remains legible).
    for (const e of data.edges) {
      if (set.has(e.from)) set.add(e.to);
      if (set.has(e.to)) set.add(e.from);
    }
    return set;
  }, [topicFilter, data]);

  const handleNodeClick = (node: GraphNode): void => {
    setHighlightNodeId(node.id);
    if (node.href) {
      navigate(node.href);
    }
  };

  const highlightedNeighbors = useMemo(
    () =>
      highlightNodeId
        ? new Set(nextPathways(data, highlightNodeId, { n: 5 }))
        : new Set<string>(),
    [highlightNodeId, data],
  );

  const selectedNode = useMemo(
    () => (highlightNodeId ? data.nodes.find((n) => n.id === highlightNodeId) : null),
    [highlightNodeId, data],
  );

  // ─── Pan / zoom ───────────────────────────────────────────────
  // ─── Pan (drag) ───────────────────────────────────────────────
  // Wheel-based zoom is intentionally NOT wired up. In React 18+,
  // `preventDefault()` on synthetic wheel events is a no-op
  // (listeners are passive by default), so wheel-zoom interferes
  // with the page scroll without actually preventing it. Users zoom
  // via the floating +/-/reset controls instead, and the page
  // scrolls normally.

  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>): void => {
    // Only start a pan if the user grabbed the canvas (not a node).
    if ((e.target as Element).closest('[data-graph-node="true"]')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
  };

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setView((v) => ({ ...v, x: dragStart.current!.vx + dx, y: dragStart.current!.vy + dy }));
  };

  const stopDrag = (): void => {
    setDragging(false);
    dragStart.current = null;
  };

  const resetView = useCallback(() => {
    setView({ x: 0, y: 0, scale: 1 });
  }, []);

  const zoomBy = useCallback((factor: number) => {
    setView((v) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
      return { ...v, scale: next };
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Topic filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-stone-500">Filter:</span>
        <button
          type="button"
          onClick={() => setTopicFilter(null)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
            topicFilter === null
              ? 'bg-amber-500 text-white shadow'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-200'
          }`}
        >
          All ({data.nodes.length})
        </button>
        {topics.map((t) => {
          const count = data.nodes.filter((n) => n.topic === t).length;
          const active = topicFilter === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTopicFilter(active ? null : t)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                active
                  ? 'bg-amber-500 text-white shadow'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-200'
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      <div
        data-testid="pybe-concept-graph"
        className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md dark:border-stone-700 dark:bg-stone-800"
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full select-none"
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
          role="img"
          aria-label="Concept graph"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <defs>
            <marker
              id="pybe-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a8a29e" />
            </marker>
            <marker
              id="pybe-arrow-hot"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
          </defs>

          <g
            transform={`translate(${view.x + WIDTH / 2}, ${view.y + HEIGHT / 2}) scale(${view.scale}) translate(${-WIDTH / 2}, ${-HEIGHT / 2})`}
          >
            {/* edges */}
            {links.map((l, i) => {
              const isEdgeHighlighted =
                highlightNodeId !== null &&
                (l.from === highlightNodeId || l.to === highlightNodeId);
              const dimmed =
                filteredNodeIds !== null &&
                (!filteredNodeIds.has(l.from) || !filteredNodeIds.has(l.to));
              return (
                <line
                  key={`edge-${i}`}
                  data-testid={`pybe-graph-edge-${l.from}-${l.to}`}
                  x1={l.sx}
                  y1={l.sy}
                  x2={l.tx}
                  y2={l.ty}
                  stroke={isEdgeHighlighted ? '#f59e0b' : '#a8a29e'}
                  strokeWidth={(isEdgeHighlighted ? 2.5 : 1.2) / view.scale}
                  opacity={dimmed ? 0.1 : isEdgeHighlighted ? 0.95 : 0.45}
                  markerEnd={isEdgeHighlighted ? 'url(#pybe-arrow-hot)' : 'url(#pybe-arrow)'}
                  style={{ transition: 'stroke 200ms ease, opacity 200ms ease' }}
                />
              );
            })}

            {/* nodes */}
            {data.nodes.map((n) => {
              const p = positions[n.id];
              if (!p) return null;
              const dimmed =
                (filteredNodeIds !== null && !filteredNodeIds.has(n.id)) ||
                (highlightNodeId !== null &&
                  highlightNodeId !== n.id &&
                  !highlightedNeighbors.has(n.id) &&
                  hoverNodeId !== n.id);
              return (
                <g
                  key={n.id}
                  data-graph-node="true"
                  onMouseEnter={() => setHoverNodeId(n.id)}
                  onMouseLeave={() => setHoverNodeId(null)}
                >
                  <GraphNodeRect
                    node={n}
                    x={p.x}
                    y={p.y}
                    onClick={handleNodeClick}
                    isHighlighted={highlightNodeId === n.id || hoverNodeId === n.id}
                    dimmed={dimmed}
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5 rounded-lg border border-stone-200 bg-white/95 p-1 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-stone-800/95">
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoomBy(1.25)}
            className="rounded p-1.5 text-stone-600 hover:bg-amber-50 hover:text-amber-700 dark:text-stone-300 dark:hover:bg-amber-900/30"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoomBy(0.8)}
            className="rounded p-1.5 text-stone-600 hover:bg-amber-50 hover:text-amber-700 dark:text-stone-300 dark:hover:bg-amber-900/30"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Reset view"
            onClick={resetView}
            className="rounded p-1.5 text-stone-600 hover:bg-amber-50 hover:text-amber-700 dark:text-stone-300 dark:hover:bg-amber-900/30"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full border border-stone-200 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-stone-500 shadow-sm backdrop-blur dark:border-stone-700 dark:bg-stone-800/90 dark:text-stone-400">
          <Move className="h-3 w-3" />
          drag to pan · use buttons to zoom
        </div>
      </div>

      {/* Selected-node details */}
      {selectedNode && (
        <div
          data-testid="pybe-graph-detail"
          className="rounded-2xl border border-amber-300 bg-amber-50/60 p-4 text-sm shadow-sm dark:border-amber-700/40 dark:bg-amber-900/20"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2.5 py-0.5 font-semibold text-amber-900">
              <Compass className="h-3 w-3" />
              {selectedNode.id}
            </span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {selectedNode.topic}
            </span>
            <span className="rounded-full bg-white px-2.5 py-0.5 capitalize text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {selectedNode.stage}
            </span>
            {selectedNode.ready ? (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800">
                Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-200 px-2.5 py-0.5 text-stone-700">
                <Lock className="h-3 w-3" />
                Planned
              </span>
            )}
          </div>
          <div className="mb-1 text-lg font-bold text-stone-900 dark:text-stone-100">
            {selectedNode.label}
          </div>
          {selectedNode.href && (
            <a
              href={selectedNode.href}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline dark:text-amber-300"
            >
              Open case study <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {!selectedNode.href && (
            <span className="text-xs italic text-stone-500">
              This concept is a planned hub — case studies land here over time.
            </span>
          )}
        </div>
      )}

      <GraphLegend nodes={data.nodes} />
    </div>
  );
}

function isReady(data: GraphData, id: string): boolean {
  return data.nodes.find((n) => n.id === id)?.ready === true;
}