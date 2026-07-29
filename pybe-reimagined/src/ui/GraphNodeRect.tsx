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

const STAGE_GRADIENT: Record<GraphNode['stage'], { from: string; to: string }> = {
  sensorimotor: { from: '#0ea5e9', to: '#0284c7' },
  preoperational: { from: '#a78bfa', to: '#8b5cf6' },
  concrete: { from: '#34d399', to: '#059669' },
  formal: { from: '#fbbf24', to: '#d97706' },
};

/**
 * GraphNode UI: rounded-rect with gradient fill, glow ring on hover,
 * and a label below the node. Locked nodes show a subtle lock icon.
 *
 * Wraps an SVG <g> in a foreignObject-friendly pure-SVG implementation
 * so the d3-force simulation still controls position.
 */
export function GraphNodeRect({
  node,
  x,
  y,
  onClick,
  isHighlighted = false,
  dimmed = false,
}: Props) {
  const w = 132;
  const h = 56;
  const ready = node.ready;
  const grad = STAGE_GRADIENT[node.stage];
  const stroke = STAGE_COLORS[node.stage];

  const handleClick = (): void => onClick(node);

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
      data-ready={ready}
      data-stage={node.stage}
      transform={`translate(${x - w / 2},${y - h / 2})`}
      onClick={handleClick}
      onKeyDown={handleKey}
      tabIndex={0}
      role="button"
      aria-label={`${node.label} (${node.stage}, ${ready ? 'ready' : 'planned'})`}
      className="cursor-pointer focus:outline-none"
      style={{
        opacity: dimmed ? 0.35 : 1,
        transition: 'opacity 220ms ease',
      }}
    >
      <defs>
        <linearGradient id={`grad-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={grad.from} stopOpacity={ready ? 1 : 0.55} />
          <stop offset="100%" stopColor={grad.to} stopOpacity={ready ? 1 : 0.55} />
        </linearGradient>
        <filter id={`glow-${node.id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={isHighlighted ? 4 : 2} result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {isHighlighted && (
        <rect
          x={-4}
          y={-4}
          width={w + 8}
          height={h + 8}
          rx={h / 2 + 4}
          ry={h / 2 + 4}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          opacity={0.55}
          style={{ transition: 'opacity 200ms ease' }}
        />
      )}

      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        rx={h / 2}
        ry={h / 2}
        fill={`url(#grad-${node.id})`}
        stroke={ready ? 'white' : 'transparent'}
        strokeWidth={ready ? 2 : 0}
        filter={`url(#glow-${node.id})`}
        style={{
          transition: 'transform 180ms ease, filter 180ms ease',
          cursor: 'pointer',
        }}
      />

      {/* Lock badge for non-ready nodes */}
      {!ready && (
        <g transform={`translate(${w - 22},${h / 2 - 8})`}>
          <rect width={16} height={16} rx={4} fill="rgba(255,255,255,0.85)" />
          <text x={8} y={11.5} fontSize={11} fontWeight={700} textAnchor="middle" fill={stroke}>
            🔒
          </text>
        </g>
      )}

      <text
        x={w / 2}
        y={h / 2 - 2}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill="white"
        pointerEvents="none"
      >
        {node.label.length > 18 ? node.label.slice(0, 18) + '…' : node.label}
      </text>
      <text
        x={w / 2}
        y={h + 14}
        textAnchor="middle"
        fontSize={10}
        fill={stroke}
        opacity={0.7}
        pointerEvents="none"
        className="font-mono"
      >
        {node.id}
      </text>
    </g>
  );
}