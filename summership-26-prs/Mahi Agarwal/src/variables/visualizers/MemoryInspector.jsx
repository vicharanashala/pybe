import React, { useState } from 'react';
import MemoryPocket from '../components/MemoryPocket';

// ---------------------------------------------------------------------------
// SIGNATURE VISUALIZATION — The Memory Room.
// Every variable currently "in memory" floats as its own glowing pocket.
// Includes a tiny standalone battery demo (battery = 100 -> battery = 80)
// so the learner sees a plain number update the same way a gadget does —
// proof that this isn't just about gadgets, it's about any stored value.
// ---------------------------------------------------------------------------
export default function MemoryInspector({ entries }) {
  return (
    <div className="dm-memory-room">
      {entries.map((e, i) => (
        <div key={e.id} className="dm-memory-room-item" style={{ animationDelay: `${i * 0.08}s` }}>
          <MemoryPocket label={e.label} varName={e.varName} emoji={e.emoji} glow />
        </div>
      ))}
      <BatteryDemo />
    </div>
  );
}

function BatteryDemo() {
  const [value, setValue] = useState(100);
  const [pulse, setPulse] = useState(false);

  function drain() {
    if (value <= 80) return;
    setPulse(true);
    setTimeout(() => { setValue(80); setPulse(false); }, 420);
  }

  return (
    <div className="dm-memory-room-item dm-battery-demo">
      <div className="dm-pocket dm-pocket-glow">
        <div className={`dm-pocket-orb filled ${pulse ? 'dm-battery-pulse' : ''}`}>{'🔋'}</div>
        <span className="dm-pocket-label">battery</span>
        <span className={`dm-pocket-varname dm-battery-value ${pulse ? 'dissolving' : ''}`}>{value}</span>
      </div>
      <button className="dm-chip" onClick={drain} disabled={value <= 80}>
        {value <= 80 ? 'battery = 80' : 'Run battery = 80'}
      </button>
    </div>
  );
}
