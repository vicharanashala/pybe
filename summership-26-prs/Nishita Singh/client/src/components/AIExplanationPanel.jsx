import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { explainConcept } from '../api/client';

const MODES = [
  { key: 'like-im-10', label: "Like I'm 10" },
  { key: 'analogy', label: 'Use an analogy' },
  { key: 'another-example', label: 'Another example' },
  { key: 'differently', label: 'Explain differently' },
  { key: 'visual-text', label: 'Explain visually' }
];

/**
 * Feature 7: AI Explanation Generator. Collapsible panel; every click
 * fetches a fresh explanation rather than reusing a cached one, since
 * varied wording is the whole point of this feature.
 */
function AIExplanationPanel({ concept, scenarioId }) {
  const [open, setOpen] = useState(false);
  const [activeMode, setActiveMode] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleModeClick(mode) {
    setActiveMode(mode);
    setLoading(true);
    setError(null);
    try {
      const result = await explainConcept(concept, mode, scenarioId);
      setExplanation(result.explanation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-explanation-panel">
      <button type="button" className="collapsible-toggle" onClick={() => setOpen((value) => !value)}>
        <Sparkles size={16} /> Ask AI to explain this differently
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="ai-explanation-body">
          <div className="ai-explanation-modes">
            {MODES.map((mode) => (
              <button
                type="button"
                key={mode.key}
                className={activeMode === mode.key ? 'mode-chip active' : 'mode-chip'}
                onClick={() => handleModeClick(mode.key)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {loading && <p className="loading-inline">Thinking of a fresh explanation...</p>}
          {error && <p className="error-inline">{error}</p>}
          {explanation && !loading && <p className="ai-explanation-text">{explanation}</p>}
        </div>
      )}
    </div>
  );
}

export default AIExplanationPanel;
