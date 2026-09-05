import React from 'react';
import { CheckCircle2, Circle, Clock, PlayCircle } from 'lucide-react';

const STATUS_ICON = {
  completed: CheckCircle2,
  current: PlayCircle,
  'not-started': Circle,
  future: Clock
};

const STATUS_LABEL = {
  completed: 'Completed',
  current: 'In progress',
  'not-started': 'Ready to start',
  future: 'Future'
};

/**
 * Feature 6: Personalized Learning Path visualization. Renders each tier of
 * the concept dependency graph as a connected node, colored by status.
 */
function LearningPath({ path }) {
  if (!path) return null;

  return (
    <div className="learning-path">
      <p className="section-subtitle">
        Current focus: <strong>{path.currentConcept}</strong>
        {path.estimatedCompletionDate && <> &middot; estimated path completion around {path.estimatedCompletionDate}</>}
      </p>

      <div className="learning-path-track">
        {path.tiers.map((tier) => {
          const Icon = STATUS_ICON[tier.status] || Circle;
          return (
            <div className={`learning-path-node status-${tier.status}`} key={tier.tier}>
              <Icon size={20} />
              <strong>{tier.concept}</strong>
              <span>{STATUS_LABEL[tier.status]}</span>
              <small>{tier.completed}/{tier.total || '?'} scenarios</small>
              {tier.dependsOn.length > 0 && (
                <small className="learning-path-deps">Needs: {tier.dependsOn.join(', ')}</small>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LearningPath;
