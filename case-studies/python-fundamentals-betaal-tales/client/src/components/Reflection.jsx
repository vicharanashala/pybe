import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Hourglass } from 'lucide-react';
import BetaalLogo from './BetaalLogo';

const REFLECTION_SECONDS = 60;

export default function Reflection({ message, prompt, revealed, onReady, onBack }) {
  const [secondsLeft, setSecondsLeft] = useState(REFLECTION_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const readySoon = secondsLeft <= 0;
  const canProceed = readySoon;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className="reflection" aria-label="Reflection">
      <div className="reflection-head">
        <div className="betaal-avatar" aria-hidden="true">
          <BetaalLogo size={40} />
        </div>
        <div className="betaal-speech">
          <h3>Betaal says…</h3>
          <p className="reflection-message">{message}</p>
        </div>
      </div>

      <div className="reflection-card" role="note">
        <Hourglass size={22} aria-hidden="true" />
        <div>
          <p className="reflection-hint">Take this quiet minute to think. No answers needed - just wonder.</p>
          <p className="reflection-timer" aria-live="off">
            {readySoon ? '0:00' : `${minutes}:${seconds}`}
          </p>
          {readySoon && (
            <p className={`reflection-done${revealed ? ' reflection-done-reveal' : ''}`}>
              {revealed || 'Your minute is up - but only when you are ready, continue.'}
            </p>
          )}
        </div>
      </div>

      <p className="reflection-prompt">{prompt}</p>

      <div className="stage-actions">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onReady} disabled={!canProceed}>
          Ready to uncover the idea <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}