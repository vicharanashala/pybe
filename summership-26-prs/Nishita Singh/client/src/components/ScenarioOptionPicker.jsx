import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, RefreshCcw } from 'lucide-react';
import { selectGeneratedScenario } from '../api/client';

/**
 * Shows up to three generated scenario drafts side by side so the learner
 * can pick whichever resonates, instead of only ever seeing one generated
 * scenario (Enhancement Proposal #11). Nothing is persisted until the
 * learner picks one - clicking "Use this scenario" is what actually saves
 * it via POST /api/ai/scenarios/select.
 */
function ScenarioOptionPicker({ options, onSelected, onRegenerate, regenerating }) {
  const [selectingIndex, setSelectingIndex] = useState(null);
  const [error, setError] = useState(null);

  async function handleSelect(option, index) {
    setSelectingIndex(index);
    setError(null);
    try {
      const result = await selectGeneratedScenario(option);
      onSelected(result.scenario);
    } catch (err) {
      setError(err.message);
    } finally {
      setSelectingIndex(null);
    }
  }

  if (!options?.length) return null;

  return (
    <div className="scenario-option-picker">
      <div className="scenario-option-picker-header">
        <p className="section-subtitle">Pick the story that resonates with you:</p>
        <button type="button" className="regenerate-button" onClick={onRegenerate} disabled={regenerating}>
          <RefreshCcw size={14} /> {regenerating ? 'Generating new options...' : 'Generate different options'}
        </button>
      </div>

      {error && <p className="error-inline">{error}</p>}

      <div className="scenario-option-grid">
        {options.map((option, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <article className="scenario-option-card" key={index}>
            <span className={`difficulty-badge difficulty-${option.difficulty?.toLowerCase()}`}>
              {option.difficulty}
            </span>
            <h3>{option.title}</h3>
            <p className="scenario-card-description">{option.description || option.context}</p>
            <button
              type="button"
              className="scenario-open-button"
              onClick={() => handleSelect(option, index)}
              disabled={selectingIndex !== null}
            >
              {selectingIndex === index ? (
                'Using this one...'
              ) : (
                <>
                  <CheckCircle2 size={16} /> Use this scenario <ArrowUpRight size={16} />
                </>
              )}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ScenarioOptionPicker;
