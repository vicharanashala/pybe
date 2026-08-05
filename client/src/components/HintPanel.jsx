import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { generateAIHint } from '../api/client';

const MAX_LEVEL = 4;

/**
 * Feature 8: AI-generated progressive hints (4 levels), contextual to the
 * learner's current draft. Falls back to the static Phase 2 hints (3
 * levels, precomputed on the scenario) if the AI hint request fails, so
 * hints keep working even if the backend or provider has an issue.
 */
function HintPanel({ scenarioId, staticHints, onHintsUsedChange }) {
  const [revealed, setRevealed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const maxLevel = staticHints?.length ? MAX_LEVEL : MAX_LEVEL;
  const nextLevel = revealed.length + 1;

  async function revealNext() {
    setLoading(true);
    setError(null);
    try {
      const result = await generateAIHint(scenarioId, nextLevel);
      const next = [...revealed, { level: nextLevel, text: result.text }];
      setRevealed(next);
      onHintsUsedChange?.(next.length);
    } catch (err) {
      const fallback = staticHints?.find((hint) => hint.level === nextLevel);
      if (fallback) {
        const next = [...revealed, { level: nextLevel, text: fallback.text }];
        setRevealed(next);
        onHintsUsedChange?.(next.length);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hint-panel">
      <div className="hint-panel-header">
        <Lightbulb size={18} />
        <span>Need a hint?</span>
      </div>

      {revealed.map((hint) => (
        <div className="hint-card" key={hint.level}>
          <strong>Hint {hint.level}</strong>
          <p>{hint.text}</p>
        </div>
      ))}

      {error && <p className="error-inline">{error}</p>}

      {revealed.length < maxLevel && (
        <button type="button" className="hint-reveal-button" onClick={revealNext} disabled={loading}>
          {loading ? 'Thinking of a hint...' : `Reveal hint ${nextLevel} of ${maxLevel}`}
        </button>
      )}
    </div>
  );
}

export default HintPanel;
