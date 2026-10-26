import React, { useState } from 'react';
import { Code2, EyeOff, Eye } from 'lucide-react';

// The mentor's reading of a submitted attempt — same server payload as
// before (prompt score, abstraction map, generated code, feedback,
// misconceptions), restyled as annotations in the case ledger.

export function MentorOutput({ result }) {
  return (
    <div className="mentor-output">
      <div className="score-plaque">
        <span className="score-value">{result.promptScore}</span>
        <small>prompt maturity</small>
      </div>

      <div className="mapping-list">
        {result.abstractionMap.map((item) => (
          <article className="mapping" key={item.pattern}>
            <strong>{item.pattern}</strong>
            <span>{item.pythonConcept}</span>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>

      <div className="code-block">
        <div><Code2 size={16} /> Generated Python</div>
        <pre>{result.generatedCode}</pre>
        <p>{result.codeExplanation}</p>
      </div>

      <ul className="feedback">
        {result.promptFeedback.map((item) => <li key={item}>{item}</li>)}
      </ul>

      {result.misconceptions.length > 0 && (
        <div className="note">
          <strong>Misconception watch</strong>
          {result.misconceptions.map((item) => <p key={item}>{item}</p>)}
        </div>
      )}
    </div>
  );
}

// Model-answer reveal — unchanged behaviour, new clothes: sealed until the
// learner chooses to break it open.
export function ModelAnswer({ scenario }) {
  const [revealed, setRevealed] = useState(false);
  if (!scenario?.idealSolution) return null;

  return (
    <div className="model-answer">
      <button type="button" className="ghost" onClick={() => setRevealed((current) => !current)}>
        {revealed ? <EyeOff size={15} /> : <Eye size={15} />}
        {revealed ? 'Seal the model answer' : 'Break the seal · model answer'}
      </button>
      {revealed && (
        <div className="code-block">
          <div><Code2 size={16} /> Model answer (Python)</div>
          <pre>{scenario.idealSolution}</pre>
        </div>
      )}
    </div>
  );
}
