import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const TREND_ICON = { increasing: TrendingUp, decreasing: TrendingDown, steady: Minus, 'new-learner': Minus };

/**
 * Feature 5: Adaptive Difficulty. Shows the learner's current difficulty
 * tier, the AI-suggested next tier, and why.
 */
function AdaptiveDifficultyIndicator({ difficulty }) {
  if (!difficulty) return null;
  const Icon = TREND_ICON[difficulty.trend] || Minus;
  const changed = difficulty.currentDifficulty !== difficulty.suggestedDifficulty;

  return (
    <div className="adaptive-difficulty">
      <div className="adaptive-difficulty-tiers">
        <span className="difficulty-badge">{difficulty.currentDifficulty}</span>
        {changed && (
          <>
            <Icon size={18} />
            <span className="difficulty-badge difficulty-suggested">{difficulty.suggestedDifficulty}</span>
          </>
        )}
      </div>
      <p className="section-subtitle">{difficulty.reason}</p>
    </div>
  );
}

export default AdaptiveDifficultyIndicator;
