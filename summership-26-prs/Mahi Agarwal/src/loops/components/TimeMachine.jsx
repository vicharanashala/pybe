import React from 'react';

export const CRYSTALS = {
  blue: { icon: '🔹', label: 'Blue Crystal', desc: 'Completed your first challenge' },
  purple: { icon: '🟣', label: 'Purple Crystal', desc: 'Solved a stage without hints' },
  golden: { icon: '🟡', label: 'Golden Crystal', desc: 'Perfect evaluation score' },
  red: { icon: '❤️', label: 'Red Crystal', desc: 'Found a hidden bug' },
  emerald: { icon: '🟢', label: 'Emerald Crystal', desc: 'Completed the full mission' }
};

export default function TimeMachine({ earned, repairPct }) {
  const total = Object.keys(CRYSTALS).length;
  const pct = repairPct !== undefined ? repairPct : Math.round((earned.size / total) * 100);

  return (
    <div className="lp-time-machine">
      <div className="lp-machine-ring-wrap">
        <svg viewBox="0 0 100 100" className="lp-machine-ring">
          <circle cx="50" cy="50" r="42" className="lp-machine-ring-track" />
          <circle cx="50" cy="50" r="42" className="lp-machine-ring-fill" strokeDasharray={264} strokeDashoffset={264 - (pct / 100) * 264} />
        </svg>
        <span className="lp-machine-pct">{pct}%</span>
      </div>
      <div className="lp-crystal-row">
        {Object.entries(CRYSTALS).map(([key, c]) => (
          <span key={key} className={`lp-crystal ${earned.has(key) ? 'lit' : ''}`} title={`${c.label} — ${c.desc}`}>{c.icon}</span>
        ))}
      </div>
    </div>
  );
}
