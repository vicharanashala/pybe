import { Circle, Lock } from 'lucide-react';
import type { GraphNode } from '../lib/graphTypes.ts';

interface Props {
  node: GraphNode;
  x: number;
  y: number;
  onClick: (node: GraphNode) => void;
  isHighlighted?: boolean;
  dimmed?: boolean;
}

const STAGE_COLORS: Record<GraphNode['stage'], string> = {
  sensorimotor: '#0ea5e9',
  preoperational: '#a78bfa',
  concrete: '#10b981',
  formal: '#f59e0b',
};

const STAGE_LABEL: Record<GraphNode['stage'], string> = {
  sensorimotor: 'Sensorimotor',
  preoperational: 'Preoperational',
  concrete: 'Concrete',
  formal: 'Formal',
};

/**
 * SVG <g> wrapper for a single concept node. Phase 6: simple circles +
 * label. INV-I6 (visible stage) — color encodes Piaget stage.
 *
 * INV-I3: clicking a node never blocks. If `ready=true`, navigation
 * triggers. If `ready=false`, a tiny 🔒 icon hints the case study
 * is in the backlog.
 */
export function GraphNodeCircle({
  node,
  x,
  y,
  onClick,
  isHighlighted = false,
  dimmed = false,
}: Props) {
  const r = node.ready ? 28 : 22;
  const color = STAGE_COLORS[node.stage];

  const handleClick = (): void => {
    onClick(node);
  };

  const handleKey = (e: React.KeyboardEvent<SVGGElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(node);
    }
  };

  return (
    <g
      data-testid={`pybe-graph-node-${node.id}`}
      data-node-id={node.id}
      data-ready={node.ready}
      data-stage={node.stage}
      transform={`translate(${x},${y})`}
      onClick={handleClick}
      onKeyDown={handleKey}
      tabIndex={0}
      role="button"
      aria-label={`${node.label} (${STAGE_LABEL[node.stage]}, ${
        node.ready ? 'ready' : 'planned'
      })`}
      className="cursor-pointer focus:outline-none"
      style={{ opacity: dimmed ? 0.4 : 1 }}
    >
      {isHighlighted && (
        <circle r={r + 6} fill="none" stroke="#f59e0b" strokeWidth={2} opacity={0.7} />
      )}
      <circle
        r={r}
        fill={color}
        stroke={node.ready ? 'white' : '#d6d3d1'}
        strokeWidth={3}
      />
      {!node.ready && (
        <Lock
          x={-7}
          y={-7}
          width={14}
          height={14}
          color="white"
          stroke="white"
          fill="none"
          strokeWidth={1.5}
        />
      )}
      <text
        textAnchor="middle"
        dy={5}
        fontSize={11}
        fontWeight={700}
        fill="white"
        pointerEvents="none"
      >
        {node.label.length > 9 ? node.label.slice(0, 9) + '…' : node.label}
      </text>
      <text
        textAnchor="middle"
        dy={r + 14}
        fontSize={9}
        fill="#57534e"
        pointerEvents="none"
      >
        {node.id}
      </text>
    </g>
  );
}

void Circle;