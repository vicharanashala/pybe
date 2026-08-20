import React from 'react';
import { ThumbsUp, AlertTriangle } from 'lucide-react';
import { EVALUATION } from '../data/evaluation';
import { SKILL_FEEDBACK } from '../data/feedback';

export default function Feedback({ graded, correctCount, onNext }) {
  const strengths = graded.filter((g) => g.correct).map((g) => SKILL_FEEDBACK[g.id].skill);
  const mistakes = graded.filter((g) => !g.correct).map((g) => ({ id: g.id, ...SKILL_FEEDBACK[g.id] }));
  const scorePct = Math.round((correctCount / graded.length) * 100);

  return (
    <div className="lp-scene">
      <h2>Your feedback</h2>
      <p className="lp-scene-intro">
        {scorePct >= 90
          ? "You're not just getting these right — you're reasoning about iteration the way the module hoped you would."
          : scorePct >= 50
            ? 'Solid work. A few specific spots are worth another pass before this fully clicks.'
            : "Loops take repetition to master — no pun intended. Here's exactly where to focus."}
      </p>

      {strengths.length > 0 && (
        <div className="lp-note-card lp-strong-card">
          <strong><ThumbsUp size={15} style={{ verticalAlign: 'text-bottom' }} /> Strengths</strong>
          {strengths.map((s) => <p key={s}>✔ {s}</p>)}
        </div>
      )}

      {mistakes.length > 0 && (
        <div className="lp-feedback-mistakes">
          {mistakes.map((m) => (
            <div key={m.id} className="lp-note-card lp-weak-card">
              <strong><AlertTriangle size={15} style={{ verticalAlign: 'text-bottom' }} /> {m.skill}</strong>
              <p><em>Why this happens:</em> {m.why}</p>
              <p><em>How to improve:</em> {m.improve}</p>
              <p><em>Recommended practice:</em> {m.practice}</p>
            </div>
          ))}
        </div>
      )}

      {mistakes.length === 0 && (
        <div className="lp-note-card">
          <strong>Nothing to flag</strong>
          <p>Every question landed. One more crystal is waiting for this.</p>
        </div>
      )}

      <button className="lp-mini-btn lp-cta" onClick={onNext}>See the garden bloom →</button>
    </div>
  );
}
