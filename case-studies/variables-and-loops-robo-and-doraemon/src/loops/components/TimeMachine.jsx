import React from 'react';

export default function TimeMachine({repairPct=0}) {
 const pct=repairPct;
  return (
    <div className="lp-time-machine">
      <div className="lp-machine-ring-wrap">
        <svg viewBox="0 0 100 100" className="lp-machine-ring">
          <circle cx="50" cy="50" r="42" className="lp-machine-ring-track" />
          <circle cx="50" cy="50" r="42" className="lp-machine-ring-fill" strokeDasharray={264} strokeDashoffset={264 - (pct / 100) * 264} />
        </svg>
        <span className="lp-machine-pct">{pct}%</span>
      </div>

    </div>
  );
}
