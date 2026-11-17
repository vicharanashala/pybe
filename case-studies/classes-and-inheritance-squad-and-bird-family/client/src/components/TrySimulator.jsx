import { useState, useEffect, useRef } from "react";
import { LEVELS } from "../levels.js";

import { EagleChild, SparrowChild, PenguinChild, OwlChild, DuckChild } from "./BirdIllustration.jsx";

const ILLUSTRATIONS = {
  EagleChild,
  SparrowChild,
  PenguinChild,
  OwlChild,
  DuckChild,
};

// NOTE: quiz/completion logic is untouched from the original —
// `call()` and `done` work exactly as before (same calledIds tracking,
// same onComplete contract). Everything added here is presentational:
// active/tried method states, a typed-line console animation, an XP
// toast on completion, and a richer layout. No new dependencies.

export default function TrySimulator({ levelId, onComplete }) {
  const level = LEVELS[levelId];
  const Illustration = ILLUSTRATIONS[level.illustration];
  const [calledIds, setCalledIds] = useState([]);
  const [log, setLog] = useState([]);
  const [activeMethod, setActiveMethod] = useState(null);
  const [justCalled, setJustCalled] = useState(null); // id of method whose lines are still "typing in"
  const [showXpToast, setShowXpToast] = useState(false);
  const consoleEndRef = useRef(null);
  const wasDone = useRef(false);

  const done = calledIds.length === level.methods.length;

  function call(method) {
    setActiveMethod(method.id);
    setJustCalled(method.id);
    setLog((prev) => [
      ...prev,
      ...method.lines.map((text) => ({
        text,
        isNew: method.isNew,
        isOverride: method.isOverride,
        methodId: method.id,
      })),
    ]);
    if (!calledIds.includes(method.id)) {
      setCalledIds((prev) => [...prev, method.id]);
    }
    window.clearTimeout(call._t);
    call._t = window.setTimeout(() => setJustCalled(null), 500);
  }

  // Scroll the console to the newest line as it grows.
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log]);

  // Fire the XP toast exactly once, the moment all methods have been tried.
  useEffect(() => {
    if (done && !wasDone.current) {
      wasDone.current = true;
      setShowXpToast(true);
      const t = window.setTimeout(() => setShowXpToast(false), 2600);
      return () => window.clearTimeout(t);
    }
  }, [done]);

  const triedPct = Math.round((calledIds.length / level.methods.length) * 100);

  return (
    <div className="card sim-card">
      <div className="sim-header">
        <div>
          <h2 className="card-title">Try it yourself</h2>
          <p className="eyebrow">
            {level.badge}
            {level.difficultyLabel ? <span className="sim-difficulty-pill">{level.difficultyLabel}</span> : null}
          </p>
        </div>
        {typeof level.xp === "number" && (
          <div className="sim-xp-chip" aria-label={`Worth ${level.xp} XP`}>
            <span className="sim-xp-chip-icon" aria-hidden="true">⚡</span>
            {level.xp} XP
          </div>
        )}
      </div>

      <div className="simulator-grid sim-grid">
        <div className="simulator-visual sim-visual">
          <div className={"sim-illustration-frame" + (justCalled ? " sim-bounce" : "")}>
            <Illustration size={100} />
          </div>
          <p className="class-name">{level.className}</p>
        </div>

        <div className="simulator-code sim-code">
          <div className="sim-code-topbar" aria-hidden="true">
            <span className="sim-dot sim-dot-red" />
            <span className="sim-dot sim-dot-yellow" />
            <span className="sim-dot sim-dot-green" />
          </div>
          <pre className="code-block small">
            <code>{level.code}</code>
          </pre>
        </div>
      </div>

      <div
        className="method-buttons sim-method-buttons"
        role="group"
        aria-label="Methods you can call"
      >
        {level.methods.map((m) => {
          const isTried = calledIds.includes(m.id);
          const isActive = activeMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              className={
                "btn btn-secondary small sim-method-btn" +
                (isActive ? " active" : "") +
                (isTried ? " sim-method-tried" : "")
              }
              onClick={() => call(m)}
              aria-pressed={isActive}
            >
              <span>{m.label}</span>
              {isTried && (
                <span className="sim-method-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="console-log sim-console" role="log" aria-live="polite">
        {log.length === 0 && <p className="console-placeholder">Output will appear here…</p>}
        {log.map((line, i) => (
          <p
            key={i}
            className={
              "console-line" +
              (line.isNew ? " highlight-new" : line.isOverride ? " highlight" : "") +
              (i === log.length - 1 && justCalled === line.methodId ? " sim-line-in" : "")
            }
          >
            {">"} {line.text}
          </p>
        ))}
        <div ref={consoleEndRef} />
      </div>

      <div className="sim-progress-row">
        <div className="sim-progress-track" aria-hidden="true">
          <div className="sim-progress-fill" style={{ width: `${triedPct}%` }} />
        </div>
        <p className="progress-caption sim-progress-caption">
          {calledIds.length}/{level.methods.length} methods tried
        </p>
      </div>

      <button className="btn btn-primary sim-continue-btn" disabled={!done} onClick={onComplete}>
        {level.nextLabel}
      </button>

      {showXpToast && (
        <div className="sim-xp-toast" role="status">
          <span className="sim-xp-toast-icon" aria-hidden="true">⚡</span>
          +{level.xp ?? 0} XP — all methods tried!
        </div>
      )}
    </div>
  );
}