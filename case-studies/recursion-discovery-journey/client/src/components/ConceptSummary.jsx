import React, { useState } from 'react';
import { ChevronRight, RefreshCw, Layers, StopCircle, CornerUpLeft } from 'lucide-react';

const PILLARS = [
  {
    icon: <RefreshCw className="w-7 h-7" />,
    colour: 'cyan',
    number: '01',
    title: 'Recursive Function Call',
    body: 'A function that calls itself with a smaller or simpler version of the same problem. Each call creates a new stack frame in memory.',
    code: 'mirror(depth - 1)',
    codeLabel: 'Recursive self-call',
  },
  {
    icon: <StopCircle className="w-7 h-7" />,
    colour: 'amber',
    number: '02',
    title: 'Base Case',
    body: 'The stopping condition that prevents infinite recursion. When the condition is met, the function returns without making another recursive call.',
    code: 'if depth == 0: return',
    codeLabel: 'Termination condition',
  },
  {
    icon: <CornerUpLeft className="w-7 h-7" />,
    colour: 'purple',
    number: '03',
    title: 'Stack Unwinding',
    body: 'Once the base case is reached, each frame returns in reverse order — unwinding the call stack from deepest call back to the original caller.',
    code: 'mirror(1) → mirror(2) → … → mirror(5)',
    codeLabel: 'Return sequence',
  },
];

const colourMap = {
  cyan:   { border: 'rgba(34,211,238,0.40)',  glow: 'rgba(34,211,238,0.15)',  text: '#67E8F9', badge: 'rgba(6,182,212,0.20)' },
  amber:  { border: 'rgba(251,191,36,0.40)',  glow: 'rgba(251,191,36,0.15)',  text: '#FDE68A', badge: 'rgba(245,158,11,0.20)' },
  purple: { border: 'rgba(167,139,250,0.40)', glow: 'rgba(139,92,246,0.15)', text: '#C4B5FD', badge: 'rgba(139,92,246,0.20)' },
};

export default function ConceptSummary({ onContinue }) {
  const [revealed, setRevealed] = useState(0);

  const handleReveal = (e) => {
    e.stopPropagation();
    if (revealed < PILLARS.length) {
      setRevealed(r => r + 1);
    } else {
      onContinue?.();
    }
  };

  const allRevealed = revealed >= PILLARS.length;

  return (
    <div
      className="concept-summary-panel"
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="concept-summary-header">
        <div className="flex items-center gap-3">
          <div className="cs-icon-badge">
            <Layers className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <h2 className="cs-title">Recursion Mastery Check</h2>
            <p className="cs-subtitle">Three foundational pillars of recursive programming</p>
          </div>
        </div>
        <div className="cs-progress-badge">
          {revealed}/{PILLARS.length} revealed
        </div>
      </div>

      {/* Pillars grid */}
      <div className="cs-pillars-grid">
        {PILLARS.map((pillar, i) => {
          const c = colourMap[pillar.colour];
          const isVisible = i < revealed;
          return (
            <div
              key={i}
              className={`cs-pillar-card ${isVisible ? 'cs-pillar-card--visible' : 'cs-pillar-card--hidden'}`}
              style={{
                borderColor: isVisible ? c.border : 'rgba(255,255,255,0.06)',
                boxShadow: isVisible ? `0 0 40px ${c.glow}` : 'none',
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {/* Number label */}
              <div
                className="cs-pillar-number"
                style={{ color: isVisible ? c.text : '#1E293B' }}
              >
                {pillar.number}
              </div>

              {/* Icon */}
              <div
                className="cs-pillar-icon"
                style={{
                  background: isVisible ? c.badge : 'rgba(255,255,255,0.03)',
                  color: isVisible ? c.text : '#334155',
                  border: `1px solid ${isVisible ? c.border : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                {pillar.icon}
              </div>

              {/* Content */}
              <div className="cs-pillar-content">
                <h3
                  className="cs-pillar-title"
                  style={{ color: isVisible ? '#F1F5F9' : '#1E293B' }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="cs-pillar-body"
                  style={{ color: isVisible ? 'rgba(203,213,225,0.85)' : 'transparent' }}
                >
                  {pillar.body}
                </p>

                {/* Code snippet */}
                {isVisible && (
                  <div
                    className="cs-pillar-code"
                    style={{ borderColor: c.border, background: 'rgba(0,0,0,0.50)' }}
                  >
                    <span className="cs-code-label" style={{ color: c.text }}>{pillar.codeLabel}</span>
                    <code className="cs-code-text">{pillar.code}</code>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="cs-footer">
        <button className="cs-reveal-btn" onClick={handleReveal}>
          {!allRevealed
            ? `Reveal Pillar ${revealed + 1} of ${PILLARS.length}`
            : 'Proceed to Recursion Assessment →'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
