import React from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Renders the six computational-thinking guided questions for a scenario
 * as a numbered, step-by-step list.
 */
function GuidedQuestions({ questions }) {
  if (!questions?.length) return null;

  return (
    <ol className="guided-questions">
      {questions.map((item, index) => (
        <li key={item.id} className="guided-question">
          <div className="guided-question-number">{index + 1}</div>
          <div>
            <div className="guided-question-text">
              <HelpCircle size={16} />
              <strong>{item.question}</strong>
            </div>
            <p className="guided-question-hint">{item.hint}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default GuidedQuestions;
