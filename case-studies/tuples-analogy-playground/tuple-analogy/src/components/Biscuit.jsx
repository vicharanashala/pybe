import React from 'react';
const JAM = {
  red:   { fill: '#ef4444', dark: '#b91c1c', highlight: '#fca5a5' },
  green: { fill: '#22c55e', dark: '#15803d', highlight: '#86efac' },
  blue:  { fill: '#3b82f6', dark: '#1d4ed8', highlight: '#93c5fd' },
  yellow:{ fill: '#eab308', dark: '#a16207', highlight: '#fde68a' },
  pink:  { fill: '#ec4899', dark: '#be185d', highlight: '#f9a8d4' },
};
export const JAM_KEYS=Object.keys(JAM);
function scallopedPath(cx, cy, rOuter, rInner, points) {
  let d = '';
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d + 'Z';
}

export function Biscuit({ jam = 'red', size = 80 }) {
  const c = JAM[jam];
  const outer = scallopedPath(50, 50, 47, 40, 18);
  const dots = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const x = 50 + 32 * Math.cos(angle);
    const y = 50 + 32 * Math.sin(angle);
    return <circle key={i} cx={x} cy={y} r={2.2} fill="#c9812f" opacity={0.55} />;
  });
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.25))' }}>
      <defs>
        <radialGradient id={`crust-${jam}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fde9b8" />
          <stop offset="55%" stopColor="#eab35c" />
          <stop offset="100%" stopColor="#c9812f" />
        </radialGradient>
        <radialGradient id={`jam-${jam}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="60%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <path d={outer} fill={`url(#crust-${jam})`} stroke="#78350f" strokeWidth="3" strokeLinejoin="round" />
      {dots}
      <circle cx="50" cy="50" r="17" fill={`url(#jam-${jam})`} stroke="#78350f" strokeWidth="2.5" />
      <ellipse cx="44" cy="43" rx="5" ry="3" fill="white" opacity="0.5" />
    </svg>
  );
}

