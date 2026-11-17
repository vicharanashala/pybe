// A single ant glyph: three body segments, six legs, two antennae.
// Rendered as a <g> so parents can translate/rotate/scale it.

export default function AntGlyph({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      {/* legs */}
      <g stroke="#3b2a1a" strokeWidth={0.9} strokeLinecap="round">
        <line x1={-2.4} y1={0} x2={-4.2} y2={-2.6} />
        <line x1={-2.4} y1={0} x2={-4.6} y2={2.6} />
        <line x1={0} y1={0} x2={-2} y2={-3} />
        <line x1={0} y1={0} x2={-2.2} y2={3} />
        <line x1={2.4} y1={0} x2={4.2} y2={-2.6} />
        <line x1={2.4} y1={0} x2={4.6} y2={2.6} />
      </g>
      {/* antennae */}
      <g stroke="#3b2a1a" strokeWidth={0.7} strokeLinecap="round" fill="none">
        <path d="M 4.6 -1.2 q 2.4 -1.8 3.6 -3.4" />
        <path d="M 4.6 1.2 q 2.4 1.8 3.6 3.4" />
      </g>
      {/* body */}
      <circle cx={-3.2} cy={0} r={2.1} fill="#2a1d11" />
      <ellipse cx={0} cy={0} rx={2.6} ry={2.1} fill="#3b2a1a" />
      <ellipse cx={4} cy={0} rx={3} ry={2.3} fill="#241809" />
    </g>
  );
}
