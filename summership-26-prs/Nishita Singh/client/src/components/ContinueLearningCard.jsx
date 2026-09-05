import React from 'react';
import { PlayCircle } from 'lucide-react';

const STEP_LABELS = {
  reading: 'Reading the scenario',
  questions: 'Answering guided questions',
  workspace: 'Writing your reasoning',
  submitted: 'Feedback ready',
  revealed: 'Comparing with the official solution',
  reflection: 'Writing your reflection'
};

/**
 * Shows scenarios the learner started but hasn't finished, so they can jump
 * back in from where they left off (Phase 2 Feature 9: Save Progress).
 */
function ContinueLearningCard({ items, onOpen }) {
  if (!items?.length) return null;

  return (
    <div className="continue-learning">
      <h2>Continue learning</h2>
      <div className="continue-learning-list">
        {items.map((item) => (
          <button type="button" key={item.scenarioId} className="continue-learning-item" onClick={() => onOpen(item.scenarioId)}>
            <PlayCircle size={20} />
            <div>
              <strong>{item.title}</strong>
              <span>{STEP_LABELS[item.step] || 'In progress'}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContinueLearningCard;
