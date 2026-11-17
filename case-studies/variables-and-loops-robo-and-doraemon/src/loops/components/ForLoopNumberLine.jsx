import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';

const DOMAIN_MIN = -2;
const DOMAIN_MAX = 18;
const TICK_STEP = 2;
const SVG_W = 640;
const SVG_H = 170;
const PAD = 24;
const LINE_Y = 96;

function xFor(value) {
  const ratio = (value - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN);
  return PAD + ratio * (SVG_W - PAD * 2);
}
function pctFor(value) { return (xFor(value) / SVG_W) * 100; }

function computeSequence(start, stop, step) {
  const safeStep = step > 0 ? step : 1;
  const seq = [];
  let i = start;
  while (i < stop && seq.length < 30) {
    seq.push(i);
    i += safeStep;
  }
  return seq;
}

export default function ForLoopNumberLine({ onNext }) {
  const [start, setStart] = useState(2);
  const [stop, setStop] = useState(10);
  const [step, setStep] = useState(2);
  const [phase, setPhase] = useState(0);
  const [loopEnded, setLoopEnded] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const jumpTimer = useRef(null);

  const sequence = useMemo(() => computeSequence(start, stop, step), [start, stop, step]);
  const code = `for i in range(${start}, ${stop}, ${step}):\n    print(i)`;

  useEffect(() => () => clearTimeout(jumpTimer.current), []);

  function resetSliders(setter) {
    return (value) => {
      setter(value);
      setPhase(0);
      setLoopEnded(false);
      setJumping(false);
    };
  }
  const handleStart = resetSliders(setStart);
  const handleStop = resetSliders(setStop);
  const handleStep = resetSliders(setStep);

  function handleRunStep() {
    if (loopEnded) {
      setPhase(0);
      setLoopEnded(false);
      return;
    }
    if (phase < sequence.length) {
      setJumping(true);
      setBurstKey((k) => k + 1);
      clearTimeout(jumpTimer.current);
      jumpTimer.current = setTimeout(() => setJumping(false), 520);
      setPhase((p) => p + 1);
    } else {
      setLoopEnded(true);
    }
  }

  const ticks = [];
  for (let t = DOMAIN_MIN; t <= DOMAIN_MAX; t += TICK_STEP) ticks.push(t);

  const currentValue = phase > 0 ? sequence[phase - 1] : start;
  const dotLeftPct = phase === 0 ? pctFor(start) : loopEnded ? pctFor(sequence[sequence.length - 1] ?? start) : pctFor(currentValue);
  const dotTopPct = (LINE_Y / SVG_H) * 100;

  const buttonLabel = loopEnded ? 'Restart' : phase < sequence.length ? 'Run next iteration' : 'See why the loop stops';
  const caption = loopEnded
    ? (sequence.length === 0
      ? `0 body runs — start (${start}) never gets below stop (${stop}), so the loop body never executes.`
      : `${sequence.length} body run${sequence.length === 1 ? '' : 's'}; stop (${stop}) is excluded.`)
    : phase === 0
      ? 'Click through and watch i take each value, one jump at a time.'
      : `i is currently ${sequence[phase - 1]}.`;

  return (
    <div className="lp-numberline-wrap">
      <span className="lp-concept-tag">for loop</span>
      <div className="lp-code-block"><pre>{code}</pre></div>

      <div className="lp-nl-stats-row">
        <span className="lp-sync-badge">completed {Math.min(phase, sequence.length)} / {sequence.length}</span>
        <span className="lp-nl-current-badge">i = {loopEnded && sequence.length === 0 ? '—' : currentValue}</span>
        <span className="lp-nl-upcoming">
          upcoming: {sequence.slice(phase).length ? sequence.slice(phase).slice(0, 4).join(', ') : 'none'}
          {sequence.slice(phase).length > 4 ? '…' : ''}
        </span>
      </div>

      <div className="lp-numberline-scene">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="lp-numberline-svg">
          <line x1={PAD} y1={LINE_Y} x2={SVG_W - PAD} y2={LINE_Y} className="lp-nl-axis" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={xFor(t)} y1={LINE_Y - 5} x2={xFor(t)} y2={LINE_Y + 5} className="lp-nl-tick" />
              <text x={xFor(t)} y={LINE_Y + 22} textAnchor="middle" className="lp-nl-tick-label">{t}</text>
            </g>
          ))}

          {/* Jump arcs between consecutive revealed values */}
          {sequence.slice(0, phase).map((val, i) => {
            if (i === 0) return null;
            const x1 = xFor(sequence[i - 1]);
            const x2 = xFor(val);
            const midX = (x1 + x2) / 2;
            const arcHeight = Math.min(46, 18 + Math.abs(x2 - x1) / 6);
            return (
              <path
                key={`arc-${i}`}
                d={`M ${x1} ${LINE_Y - 4} Q ${midX} ${LINE_Y - arcHeight} ${x2} ${LINE_Y - 4}`}
                className="lp-nl-arc lp-nl-arc-blue"
              />
            );
          })}

          {/* Future values stay dim, waiting */}
          {sequence.slice(phase).map((val) => (
            <circle key={`future-${val}`} cx={xFor(val)} cy={LINE_Y} r="5" className="lp-nl-dot-future" />
          ))}

          {/* Final arc toward the excluded stop value, once the loop has ended */}
          {loopEnded && sequence.length > 0 && (
            <path
              d={`M ${xFor(sequence[sequence.length - 1])} ${LINE_Y - 4} Q ${(xFor(sequence[sequence.length - 1]) + xFor(stop)) / 2} ${LINE_Y - 40} ${xFor(stop)} ${LINE_Y - 4}`}
              className="lp-nl-arc lp-nl-arc-green"
            />
          )}

          {/* start marker */}
          <circle cx={xFor(start)} cy={LINE_Y} r="7" className="lp-nl-dot-start" />
          <text x={xFor(start)} y={LINE_Y + 40} textAnchor="middle" className="lp-nl-label lp-nl-label-start">start</text>

          {/* stop marker (always excluded, always glowing) */}
          <circle cx={xFor(stop)} cy={LINE_Y} r="9" className={`lp-nl-dot-stop ${loopEnded ? 'reached' : ''}`} />
          <line x1={xFor(stop) - 4} y1={LINE_Y - 4} x2={xFor(stop) + 4} y2={LINE_Y + 4} className="lp-nl-x-mark" />
          <line x1={xFor(stop) - 4} y1={LINE_Y + 4} x2={xFor(stop) + 4} y2={LINE_Y - 4} className="lp-nl-x-mark" />
          <text x={xFor(stop)} y={LINE_Y + 40} textAnchor="middle" className="lp-nl-label lp-nl-label-stop">stop {'×'}</text>

          {/* visited value dots stay highlighted */}
          {sequence.slice(0, phase).map((val) => (
            <circle key={val} cx={xFor(val)} cy={LINE_Y} r="6" className={`lp-nl-dot-visited ${val === sequence[phase - 1] && !loopEnded ? 'current' : ''}`} />
          ))}
        </svg>

        {/* Animated traveling dot (HTML overlay for smooth CSS transitions) */}
        <div
          className={`lp-nl-traveler ${jumping ? 'jumping' : ''}`}
          style={{ left: `${dotLeftPct}%`, top: `${dotTopPct}%` }}
        >
          <span className="lp-nl-traveler-badge">i = {currentValue}</span>
          <span className="lp-nl-traveler-dot" />
          {jumping && (
            <span key={burstKey} className="lp-nl-burst" aria-hidden="true">
              {[...Array(6)].map((_, k) => <i key={k} style={{ '--ang': `${k * 60}deg` }} />)}
            </span>
          )}
        </div>
      </div>

      <div className="lp-nl-iteration-row">
        {sequence.slice(0, phase).map((val, i) => (
          <span key={val} className="lp-nl-iteration-chip">{i + 1} {'→'} {val}</span>
        ))}
        {phase === 0 && <span className="lp-nl-iteration-empty">iteration {'→'} print(i)</span>}
      </div>

      <p className="lp-caption-static">{caption}</p>

      <div className="lp-range-controls lp-nl-controls">
        <label>start<input type="range" min="-2" max="14" value={start} onChange={(e) => handleStart(Number(e.target.value))} /><span className="lp-nl-value">{start}</span></label>
        <label>stop<input type="range" min="0" max="18" value={stop} onChange={(e) => handleStop(Number(e.target.value))} /><span className="lp-nl-value">{stop}</span></label>
        <label>step<input type="range" min="1" max="4" value={step} onChange={(e) => handleStep(Number(e.target.value))} /><span className="lp-nl-value">{step}</span></label>
      </div>

      <div className="lp-playground-actions">
        <button className="lp-mini-btn" onClick={handleRunStep}>
          {loopEnded && <RotateCcw size={14} />} {buttonLabel}
        </button>
      </div>

      <button className="lp-mini-btn lp-cta" onClick={onNext}>Now see a while loop {'→'}</button>
    </div>
  );
}
