import React from 'react';
import { ArrowLeft, Check, RotateCcw, Trophy } from 'lucide-react';

function LessonComplete({ score, concept, onTryAgain, onBack }) {
  const percentage = Math.round((score.correct / score.total) * 100);

  return (
    <section className="lj-complete" aria-labelledby="lj-complete-title">
      <div className="lj-complete-icon"><Trophy size={30} /></div>
      <p className="lj-eyebrow">A decision understood</p>
      <h2 id="lj-complete-title">Lesson Complete!</h2>
      <p className="lj-complete-copy">You just learned the basic idea behind Python conditionals by first understanding a real-world decision-making situation.</p>
      <div className="lj-completion-meter">
        <div className="lj-completion-meter-fill" style={{ width: '100%' }} />
      </div>
      <div className="lj-complete-stats">
        <div><span>Quiz score</span><strong>{score.correct}/{score.total} <small>({percentage}%)</small></strong></div>
        <div><span>Concept learned</span><strong>{concept}</strong></div>
      </div>
      <div className="lj-complete-actions">
        <button type="button" className="lj-button lj-button-primary" onClick={onTryAgain}><RotateCcw size={17} /> Try Again</button>
        <button type="button" className="lj-button lj-button-secondary" onClick={onBack}><ArrowLeft size={17} /> Choose Another Story</button>
      </div>
      <p className="lj-checkline"><Check size={16} /> Story, logic, and syntax connected</p>
    </section>
  );
}

export default LessonComplete;
