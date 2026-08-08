import React, { useEffect, useRef, useState } from 'react';

export default function MemoryOrbs({ globals, emptyLabel = 'No variables yet.' }) {
  const prevRef = useRef({});
  const [pulse, setPulse] = useState({});

  useEffect(() => {
    const prev = prevRef.current;
    const next = {};
    for (const key of Object.keys(globals)) {
      if (!(key in prev)) next[key] = 'spawned';
      else if (prev[key] !== globals[key]) next[key] = 'shifted';
    }
    setPulse(next);
    prevRef.current = globals;
    const t = setTimeout(() => setPulse({}), 850);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(globals)]);

  const keys = Object.keys(globals);

  return (
    <div className="lp-orb-panel">
      <div className="lp-panel-label">Memory</div>
      {keys.length === 0 ? (
        <p className="lp-orb-empty">{emptyLabel}</p>
      ) : (
        <div className="lp-orb-row">
          {keys.map((key) => (
            <div key={key} className={`lp-orb ${pulse[key] || ''}`}>
              <span className="lp-orb-name">{key}</span>
              <span className="lp-orb-value">{globals[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
