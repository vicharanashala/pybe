import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useSharedPyodide } from '../../shared/pyodide/PyodideContext';
import { buildLoopTracerHarness } from '../data/loopTracerHarness';

const CODE = 'for day in range(1, 6):\n    print("Day", day)\n';

export default function IterationTheater({ onNext }) {
  const { status, runHarness } = useSharedPyodide();
  const [days, setDays] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  async function handleRun() {
    setRunning(true);
    setDays([]);
    setDone(false);
    const harness = buildLoopTracerHarness(CODE);
    const { data, error } = await runHarness(harness);
    if (!error) {
      const dayValues = data.trace.filter((s) => s.newOutput).map((s) => s.globals.day);
      for (let i = 0; i < dayValues.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, 550));
        setDays((prev) => [...prev, dayValues[i]]);
      }
      setDone(true);
    }
    setRunning(false);
  }

  return (
    <div className="lp-scene">
      <h2>Watch a for loop actually run</h2>
      <p className="lp-scene-intro">Same code you just saw — <code>for day in range(1, 6): print("Day", day)</code> — but this time watch it one iteration at a time, and notice exactly when day changes.</p>

      {days.length === 0 && (
        <button className="lp-mini-btn" onClick={handleRun} disabled={status !== 'ready' || running}>
          <Play size={14} /> {running ? 'Running…' : status !== 'ready' ? 'Starting Python…' : 'Run the loop'}
        </button>
      )}

      <div className="lp-day-chain">
        {days.map((day, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="lp-day-arrow">{'↓'}</div>}
            <div className="lp-day-card lp-day-card-in">
              <span className="lp-day-card-badge">i = {day}</span>
              Day {day}
              <span className="lp-day-card-sparkle">{'✨'}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {days.length > 0 && !done && (
        <p className="lp-caption-static">iteration {days.length} of 5{'…'}</p>
      )}

      {done && (
        <>
          <div className="lp-reward-toast lp-reward-inline">
            <span className="lp-reward-icon">{'🔮'}</span>
            <span>Magic Rune earned!</span>
          </div>
          <p className="lp-caption-static">Five iterations, one loop variable (day), climbing from 1 to 5 {'—'} no five separate print statements needed.</p>
          <button className="lp-mini-btn lp-cta" onClick={onNext}>Now take control of it {'→'}</button>
        </>
      )}
    </div>
  );
}
