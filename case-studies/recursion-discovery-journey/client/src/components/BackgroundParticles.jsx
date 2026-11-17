import React from 'react';

export default function BackgroundParticles() {
  const symbols = [
    { text: 'def mirror(depth):', top: '12%', left: '8%', delay: '0s', duration: '18s' },
    { text: 'if depth == 0:', top: '28%', right: '10%', delay: '3s', duration: '22s' },
    { text: 'return', top: '48%', left: '5%', delay: '6s', duration: '20s' },
    { text: 'mirror(depth - 1)', top: '68%', right: '8%', delay: '2s', duration: '25s' },
    { text: 'call_stack[]', top: '82%', left: '12%', delay: '8s', duration: '24s' },
    { text: 'base_case = True', top: '38%', left: '85%', delay: '4s', duration: '19s' },
    { text: 'RecursionError', top: '58%', right: '82%', delay: '7s', duration: '26s' },
    { text: 'factorial(n)', top: '18%', right: '22%', delay: '1s', duration: '21s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none aria-hidden">
      {/* Floating Coding Symbols */}
      {symbols.map((item, idx) => (
        <div
          key={idx}
          className="absolute font-mono text-xs font-semibold text-purple-400/15 backdrop-blur-[1px] tracking-wider whitespace-nowrap animate-float-symbol"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.text}
        </div>
      ))}

      {/* Floating Particles */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
    </div>
  );
}
