import React from 'react';
import { Lock, CheckCircle2, Star } from 'lucide-react';

const HORCRUXES = [
  { id: 1, name: 'Variables & Types',    icon: '📦', color: '#F59E0B', concept: 'variables',     desc: 'Storing and naming — the atom of all programs.' },
  { id: 2, name: 'Control Flow',         icon: '🔀', color: '#3B82F6', concept: 'conditionals',  desc: 'Deciding and repeating — giving code a brain.' },
  { id: 3, name: 'Functions',            icon: '🔧', color: '#10B981', concept: 'functions',      desc: 'Packaging and reusing — write once, use everywhere.' },
  { id: 4, name: 'Data Structures',      icon: '🗂️', color: '#8B5CF6', concept: 'lists',          desc: 'Organizing and retrieving — data at scale.' },
  { id: 5, name: 'File & I/O',           icon: '💾', color: '#EC4899', concept: 'file I/O',       desc: 'Connecting to the world — persistence matters.' },
  { id: 6, name: 'Error Handling',       icon: '🛡️', color: '#F97316', concept: 'error handling', desc: 'Expecting the unexpected — real code fails.' },
  { id: 7, name: 'Modules & Packages',   icon: '🏛️', color: '#A8FF3E', concept: 'modules',        desc: 'Building systems — from script to software.' },
];

export default function HorcruxVault({ conceptCounts = {} }) {
  const allConcepts = Object.keys(conceptCounts);

  const isUnlocked = (horcrux) => {
    const count = conceptCounts[horcrux.concept] || 0;
    return count >= 1;
  };

  const unlockedCount = HORCRUXES.filter(isUnlocked).length;
  const progress = Math.round((unlockedCount / 7) * 100);

  return (
    <div className="hv">
      <div className="hv__header">
        <div>
          <div className="section-label">The 7 Horcruxes of Python</div>
          <p className="hv__sub">Each Horcrux is a pillar of Python mastery. Solve scenarios to unlock them all.</p>
        </div>
        <div className="hv__progress-ring">
          <svg width={60} height={60} viewBox="0 0 60 60">
            <circle cx={30} cy={30} r={24} fill="none" stroke="var(--bg-elevated)" strokeWidth={5} />
            <circle
              cx={30} cy={30} r={24}
              fill="none" stroke="var(--accent)" strokeWidth={5}
              strokeDasharray={`${(progress / 100) * 2 * Math.PI * 24} ${2 * Math.PI * 24}`}
              strokeLinecap="round" transform="rotate(-90 30 30)"
            />
            <text x={30} y={35} textAnchor="middle" fill="var(--accent)" fontSize={13} fontWeight={700} fontFamily="Space Grotesk, sans-serif">{unlockedCount}/7</text>
          </svg>
        </div>
      </div>

      <div className="hv__grid stagger">
        {HORCRUXES.map((h) => {
          const unlocked = isUnlocked(h);
          return (
            <div
              key={h.id}
              className={`hv__vault anim-fade-up${unlocked ? ' hv__vault--unlocked' : ''}`}
              style={{ '--h-color': h.color }}
            >
              {unlocked && <div className="hv__vault-glow" />}
              <div className="hv__vault-icon">{h.icon}</div>
              <div className="hv__vault-name">{h.name}</div>
              <div className="hv__vault-desc">{h.desc}</div>
              <div className="hv__vault-status">
                {unlocked ? (
                  <span className="hv__vault-unlocked-label">
                    <CheckCircle2 size={12} /> {conceptCounts[h.concept] || 0} sessions
                  </span>
                ) : (
                  <span className="hv__vault-locked-label">
                    <Lock size={11} /> Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {unlockedCount === 7 && (
        <div className="hv__complete anim-scale-in">
          <Star size={20} />
          You are a Python Wizard — all 7 Horcruxes found!
        </div>
      )}

      <style>{`
        .hv { display: flex; flex-direction: column; gap: var(--sp-5); }
        .hv__header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--sp-4); }
        .hv__sub { font-size: 0.82rem; color: var(--text-secondary); margin: 4px 0 0; line-height: 1.5; }
        .hv__grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: var(--sp-2);
        }
        .hv__vault {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          gap: 4px;
          padding: var(--sp-3) var(--sp-2);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          background: var(--bg-elevated);
          opacity: 0.5;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .hv__vault--unlocked {
          opacity: 1;
          border-color: color-mix(in srgb, var(--h-color) 40%, transparent);
          background: color-mix(in srgb, var(--h-color) 6%, var(--bg-elevated));
        }
        .hv__vault-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at top, color-mix(in srgb, var(--h-color) 15%, transparent), transparent 70%);
          pointer-events: none;
        }
        .hv__vault-icon { font-size: 1.4rem; line-height: 1; }
        .hv__vault-name {
          font-size: 0.62rem; font-weight: 600;
          color: var(--text-primary); line-height: 1.2; text-align: center;
        }
        .hv__vault-desc { display: none; }
        .hv__vault-status { margin-top: 2px; }
        .hv__vault-unlocked-label {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.6rem; font-weight: 600;
          color: var(--h-color);
        }
        .hv__vault-locked-label {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.6rem; color: var(--text-muted);
        }
        .hv__complete {
          display: flex; align-items: center; justify-content: center; gap: var(--sp-2);
          padding: var(--sp-4);
          background: var(--accent-glow);
          border: 1px solid var(--border-accent);
          border-radius: var(--r-md);
          color: var(--accent);
          font-weight: 700;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .hv__grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 480px) {
          .hv__grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
}
