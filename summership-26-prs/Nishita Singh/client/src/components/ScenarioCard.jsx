import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

/**
 * A single scenario preview card used by the Scenario Browser grid.
 * Presentational only: card data comes from GET /api/scenarios; `completed`
 * comes from the learner's Phase 2 progress so finished scenarios are
 * visibly marked.
 */
function ScenarioCard({ scenario, onOpen, completed }) {
  return (
    <article className="scenario-card">
      <div className="scenario-card-top">
        <span className={`difficulty-badge difficulty-${scenario.difficulty?.toLowerCase()}`}>
          {scenario.difficulty}
        </span>
        {completed && (
          <span className="completed-badge"><CheckCircle2 size={14} /> Completed</span>
        )}
        <div className="concept-tags">
          {scenario.concepts?.slice(0, 3).map((concept) => (
            <span key={concept} className="concept-tag">{concept}</span>
          ))}
        </div>
      </div>

      <h3>{scenario.title}</h3>
      <p className="scenario-card-description">{scenario.description}</p>

      <button type="button" className="scenario-open-button" onClick={() => onOpen(scenario._id)}>
        Open scenario
        <ArrowUpRight size={16} />
      </button>
    </article>
  );
}

export default ScenarioCard;
