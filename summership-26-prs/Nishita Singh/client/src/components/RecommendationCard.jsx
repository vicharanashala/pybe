import React from 'react';
import { ArrowUpRight, Compass, Sparkles } from 'lucide-react';

/**
 * Feature 3: Personalized Scenario Recommendation.
 */
function RecommendationCard({ recommendation, onOpen }) {
  if (!recommendation) return null;
  const { scenario, wasGenerated, recommendedCategory, recommendedDifficulty, rationale } = recommendation;

  return (
    <div className="recommendation-card">
      <div className="recommendation-header">
        <Compass size={18} />
        <span>Recommended next</span>
        {wasGenerated && <span className="ai-generated-badge"><Sparkles size={12} /> Freshly generated</span>}
      </div>

      <h3>{scenario.title}</h3>
      <p className="recommendation-meta">{recommendedDifficulty} &middot; {recommendedCategory}</p>
      <p className="section-subtitle">{rationale}</p>

      <button type="button" className="scenario-open-button" onClick={() => onOpen(scenario._id)}>
        Start this scenario <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

export default RecommendationCard;
