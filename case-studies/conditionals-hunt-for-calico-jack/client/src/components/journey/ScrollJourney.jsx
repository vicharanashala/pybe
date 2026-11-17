import React, { useCallback, useEffect, useState } from 'react';
import IntroAct from './IntroAct';
import Expedition from './Expedition';
import QuizAct from './QuizAct';
import './journey.css';

/* =========================================================
   The journey: one continuous scroll, start to finish.

     Prologue → Act I (if / else) → Act II (the hinge)
              → Act III (if / elif / else) → the evaluation

   Act I's outcome decides what Act III hunts for, and the
   ladder is walked exactly once. To see the other road, the
   re-run buttons flip the outcome in place — nothing repeats
   further down the page.
   ========================================================= */

export default function ScrollJourney({ onExit }) {
  const [label, setLabel] = useState('Prologue');
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const onActive = useCallback((l) => setLabel(l), []);

  /* Thin read-progress line across the top. */
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setShowTop(window.scrollY > window.innerHeight * 1.5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="jr-root">
      <div className="jr-topbar">
        <div className="jr-topbar-fill" style={{ transform: `scaleX(${progress})` }} />
        <div className="jr-topbar-inner">
          <button className="jr-crumb" onClick={onExit} type="button">
            ⚓ PyBe
          </button>
          <span className="jr-now">{label}</span>
          <span className="jr-count">Chapter I · Conditionals</span>
        </div>
      </div>

      <IntroAct onActive={onActive} />
      <Expedition onActive={onActive} />
      <QuizAct onActive={onActive} />

      <footer className="jr-end">
        <div className="jr-end-inner">
          <div className="jr-act-eyebrow">End of Chapter I</div>
          <h2>The Resolute Sails On</h2>
          <p>
            You have read a two-way fork and an ordered ladder — which is most of what conditional
            logic ever asks of you. Chapter II takes the same crew out on patrol and teaches them
            to repeat an order until the job is done.
          </p>
          <div className="jr-end-actions">
            <button className="jr-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} type="button">
              ↑ Sail it again
            </button>
            <button className="jr-btn jr-btn-ghost" onClick={onExit} type="button">
              Return to port
            </button>
          </div>
        </div>
      </footer>

      <button
        className={`jr-totop ${showTop ? 'is-on' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        type="button"
        aria-label="Back to the top"
      >
        ↑
      </button>
    </div>
  );
}
