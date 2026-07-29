/**
 * RhizomeTraverser — GoF Iterator pattern over the concept graph.
 *
 * INV-P4 (Rhizomatic Freedom): every node has neighbors in both
 * directions; there is no fixed curriculum order. The traverser returns
 * a list of next-step candidates without imposing a sequence.
 */
import type { GraphData, GraphEdge, GraphNode } from '../lib/graphTypes.ts';

export interface PathwayOptions {
  /** Max number of recommendations to return. Default 3. */
  n?: number;
  /** Skip neighbors with the same primary topic as `nodeId`. */
  diversify?: boolean;
  /** If set, prefer neighbors matching this topic. */
  preferTopic?: string;
}

/**
 * Return the IDs of up to `n` nodes adjacent to `nodeId`.
 * Neighbors are deduped; we walk the `from` edges (outgoing) and
 * synthesize the reverse direction so the graph is undirected.
 */
export function nextPathways(
  data: GraphData,
  nodeId: string,
  options: PathwayOptions = {},
): string[] {
  const { n = 3, diversify = true, preferTopic } = options;
  const allNeighbors = collectNeighbors(data, nodeId);
  if (allNeighbors.length === 0) return [];

  const scored = allNeighbors.map((nId) => {
    const node = data.nodes.find((nd) => nd.id === nId);
    let score = 0;
    if (node?.ready) score += 2;
    if (preferTopic && node?.topic === preferTopic) score += 5;
    return { id: nId, score };
  });

  if (diversify) {
    const sourceNode = data.nodes.find((nd) => nd.id === nodeId);
    const filtered = sourceNode?.topic
      ? scored.filter((s) => {
          const n = data.nodes.find((nd) => nd.id === s.id);
          return n?.topic !== sourceNode.topic;
        })
      : scored;
    if (filtered.length > 0) return filtered.sort((a, b) => b.score - a.score).slice(0, n).map((s) => s.id);
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, n).map((s) => s.id);
}

function collectNeighbors(data: GraphData, nodeId: string): string[] {
  const out = new Set<string>();
  for (const e of data.edges) {
    if (e.from === nodeId) out.add(e.to);
    if (e.to === nodeId) out.add(e.from);
  }
  return Array.from(out);
}

/**
 * Iterator-style traversal: yields the next `count` neighbors one at a
 * time. The caller can break early.
 */
export function* iteratePathways(
  data: GraphData,
  nodeId: string,
  count = 3,
): Generator<string> {
  for (const id of nextPathways(data, nodeId, { n: count })) {
    yield id;
  }
}

/**
 * INV-P4: every node is reachable from every other node in the
 * undirected version of the graph. Returns false on the first
 * unreachable node.
 */
export function isFullyReachable(data: GraphData): boolean {
  if (data.nodes.length === 0) return true;
  const visited = new Set<string>();
  const queue: string[] = [data.nodes[0]!.id];
  const adjacency = buildAdjacency(data);
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const n of adjacency.get(current) ?? []) {
      if (!visited.has(n)) queue.push(n);
    }
  }
  return data.nodes.every((n) => visited.has(n.id));
}

function buildAdjacency(data: GraphData): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of data.nodes) adj.set(n.id, []);
  for (const e of data.edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }
  return adj;
}

export function findNode(data: GraphData, id: string): GraphNode | undefined {
  return data.nodes.find((n) => n.id === id);
}

export function findEdges(data: GraphData, id: string): GraphEdge[] {
  return data.edges.filter((e) => e.from === id || e.to === id);
}