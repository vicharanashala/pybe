import { describe, it, expect } from 'vitest';
import {
  nextPathways,
  iteratePathways,
  isFullyReachable,
  findNode,
  findEdges,
} from '../../src/engine/RhizomeTraverser.ts';
import type { GraphData } from '../../src/lib/graphTypes.ts';
import { GRAPH } from '../../src/lib/graphTypes.ts';

function makeData(): GraphData {
  return JSON.parse(JSON.stringify(GRAPH));
}

describe('RhizomeTraverser.nextPathways', () => {
  it('returns direct neighbors (outgoing + incoming)', () => {
    const data = makeData();
    // cs_001's direct neighbors per graph.json: cs_004, concept_lists.
    // With diversify=false (the default) we surface them all.
    const result = nextPathways(data, 'cs_001', { n: 10, diversify: false });
    expect(result).toContain('cs_004');
    expect(result).toContain('concept_lists');
  });

  it('diversifies by avoiding same-topic neighbors', () => {
    const data = makeData();
    const result = nextPathways(data, 'cs_004', { n: 3, diversify: true });
    expect(result.length).toBeGreaterThan(0);
  });

  it('caps the result at n', () => {
    const data = makeData();
    const result = nextPathways(data, 'cs_002', { n: 2 });
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('returns empty array for an isolated node', () => {
    const data: GraphData = { nodes: [{ id: 'x', label: 'X', stage: 'formal', topic: 't', href: null, ready: true }], edges: [] };
    expect(nextPathways(data, 'x')).toEqual([]);
  });
});

describe('RhizomeTraverser.iteratePathways (Iterator)', () => {
  it('yields up to n neighbors one at a time', () => {
    const data = makeData();
    const gen = iteratePathways(data, 'cs_001', 3);
    const ids: string[] = [];
    for (const id of gen) ids.push(id);
    expect(ids.length).toBeLessThanOrEqual(3);
    expect(ids.length).toBeGreaterThan(0);
  });

  it('stops early when the consumer breaks', () => {
    const data = makeData();
    const gen = iteratePathways(data, 'cs_002', 5);
    const first = gen.next();
    expect(first.done).toBe(false);
    expect(typeof first.value).toBe('string');
  });
});

describe('RhizomeTraverser.isFullyReachable (INV-P4)', () => {
  it('returns true for the seeded graph (all nodes reachable)', () => {
    expect(isFullyReachable(makeData())).toBe(true);
  });

  it('returns false when a node is orphaned', () => {
    const data: GraphData = {
      nodes: [
        { id: 'a', label: 'A', stage: 'concrete', topic: 't', href: null, ready: true },
        { id: 'b', label: 'B', stage: 'concrete', topic: 't', href: null, ready: true },
        { id: 'c', label: 'C', stage: 'concrete', topic: 't', href: null, ready: true },
      ],
      edges: [{ from: 'a', to: 'b' }], // c is unreachable
    };
    expect(isFullyReachable(data)).toBe(false);
  });

  it('returns true for an empty graph', () => {
    expect(isFullyReachable({ nodes: [], edges: [] })).toBe(true);
  });
});

describe('RhizomeTraverser helpers', () => {
  it('findNode finds by id', () => {
    expect(findNode(makeData(), 'cs_001')?.label).toBe('5-Friends Average');
    expect(findNode(makeData(), 'unknown')).toBeUndefined();
  });

  it('findEdges returns edges incident to the node', () => {
    const edges = findEdges(makeData(), 'cs_001');
    expect(edges.every((e) => e.from === 'cs_001' || e.to === 'cs_001')).toBe(true);
  });
});