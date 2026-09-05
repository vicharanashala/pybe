import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

/**
 * Displays structured feedback across six dimensions: strengths, missing
 * ideas, and suggestions per dimension, never a plain correct/incorrect
 * verdict.
 */
function FeedbackPanel({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="feedback-panel">
      <div className="feedback-summary">
        <div className="feedback-score">{feedback.overallScore}</div>
        <p>{feedback.summary}</p>
      </div>

      <div className="feedback-dimensions">
        {feedback.dimensions.map((dimension) => (
          <div className="feedback-dimension" key={dimension.key}>
            <div className="feedback-dimension-header">
              <span>{dimension.label}</span>
              <span className="feedback-dimension-score">{dimension.score}</span>
            </div>

            {dimension.strengths.map((item) => (
              <p className="feedback-line strength" key={item}><CheckCircle2 size={14} /> {item}</p>
            ))}
            {dimension.missing.map((item) => (
              <p className="feedback-line missing" key={item}><AlertCircle size={14} /> {item}</p>
            ))}
            {dimension.suggestions.map((item) => (
              <p className="feedback-line suggestion" key={item}><Sparkles size={14} /> {item}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbackPanel;
