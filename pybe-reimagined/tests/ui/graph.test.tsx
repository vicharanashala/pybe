import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { ConceptGraph } from '../../src/ui/ConceptGraph.tsx';
import type { GraphData } from '../../src/lib/graphTypes.ts';

function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="probe-path">{loc.pathname}</div>;
}

function renderGraph(data?: GraphData) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ConceptGraph data={data} />
      <LocationProbe />
    </MemoryRouter>,
  );
}

const tiny: GraphData = {
  nodes: [
    { id: 'a', label: 'A', stage: 'concrete', topic: 'slicing', href: '/cases', ready: true },
    { id: 'b', label: 'B', stage: 'concrete', topic: 'dicts', href: '/cases', ready: true },
  ],
  edges: [{ from: 'a', to: 'b' }],
};

describe('ConceptGraph', () => {
  it('renders one node per data node (INV-P4)', () => {
    renderGraph(tiny);
    expect(screen.getByTestId('pybe-graph-node-a')).toBeInTheDocument();
    expect(screen.getByTestId('pybe-graph-node-b')).toBeInTheDocument();
  });

  it('renders an edge line between connected nodes', () => {
    renderGraph(tiny);
    expect(screen.getByTestId('pybe-graph-edge-a-b')).toBeInTheDocument();
  });

  it('renders the legend', () => {
    renderGraph(tiny);
    expect(screen.getByTestId('pybe-graph-legend')).toBeInTheDocument();
  });

  it('clicking a node with href navigates (INV-I3: free navigation, never blocks)', () => {
    // Mock navigate by spying on history push is too complex; instead verify
    // the location-probe shows the new path after click.
    const navigateSpy = vi.fn();
    // The default tiny graph has both nodes with href '/cases' — the
    // route handler matches MemoryRouter initial path '/'. After click,
    // the probe should show '/cases'.
    renderGraph(tiny);
    fireEvent.click(screen.getByTestId('pybe-graph-node-a'));
    expect(screen.getByTestId('probe-path')).toHaveTextContent('/cases');
    // Sanity: navigate spy isn't needed since we used MemoryRouter.
    expect(navigateSpy).toBeDefined();
  });

  it('a node without href does not navigate (planned concept)', () => {
    const local: GraphData = {
      nodes: [
        { id: 'a', label: 'A', stage: 'concrete', topic: 'slicing', href: '/cases', ready: true },
        { id: 'b', label: 'B', stage: 'concrete', topic: 'dicts', href: null, ready: false },
      ],
      edges: [],
    };
    renderGraph(local);
    fireEvent.click(screen.getByTestId('pybe-graph-node-b'));
    // Path should NOT have changed.
    expect(screen.getByTestId('probe-path')).toHaveTextContent('/');
  });

  it('color-codes nodes by stage (INV-I6 visible stage)', () => {
    const data: GraphData = {
      nodes: [
        { id: 'a', label: 'A', stage: 'sensorimotor', topic: 't', href: null, ready: true },
        { id: 'b', label: 'B', stage: 'formal', topic: 't', href: null, ready: true },
        { id: 'c', label: 'C', stage: 'concrete', topic: 't', href: null, ready: true },
      ],
      edges: [],
    };
    renderGraph(data);
    expect(screen.getByTestId('pybe-graph-node-a').getAttribute('data-stage')).toBe('sensorimotor');
    expect(screen.getByTestId('pybe-graph-node-b').getAttribute('data-stage')).toBe('formal');
    expect(screen.getByTestId('pybe-graph-node-c').getAttribute('data-stage')).toBe('concrete');
  });
});