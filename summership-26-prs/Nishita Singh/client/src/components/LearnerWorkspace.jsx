import React, { useState } from 'react';
import { Send } from 'lucide-react';
import HintPanel from './HintPanel';

/**
 * The learner's own workspace for a scenario. The official solution is
 * never shown here - this only collects the learner's own thinking and
 * submits it for feedback. Fields autosave as drafts on blur so progress
 * survives navigating away mid-thought (Phase 2 Feature 9).
 */
function LearnerWorkspace({ scenario, initialValues, onSaveDraft, onSubmit, submitting }) {
  const [fields, setFields] = useState({
    reasoning: initialValues?.reasoning || '',
    computationalThinking: initialValues?.computationalThinking || ''
  });
  const [hintsUsed, setHintsUsed] = useState(initialValues?.hintsUsed || 0);

  function updateField(key, value) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function handleBlur() {
    onSaveDraft?.({ ...fields, hintsUsed });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!fields.reasoning.trim()) return;
    onSubmit({ ...fields, hintsUsed });
  }

  return (
    <form className="learner-workspace" onSubmit={handleSubmit}>
      <label>
        My Reasoning
        <textarea
          required
          value={fields.reasoning}
          onChange={(event) => updateField('reasoning', event.target.value)}
          onBlur={handleBlur}
          placeholder={scenario.prompt}
        />
      </label>

      <label>
        My Computational Thinking
        <textarea
          value={fields.computationalThinking}
          onChange={(event) => updateField('computationalThinking', event.target.value)}
          onBlur={handleBlur}
          placeholder="What matters, what can be ignored, and what pattern do you notice?"
        />
      </label>

      <HintPanel scenarioId={scenario._id} staticHints={scenario.hints} onHintsUsedChange={setHintsUsed} />

      <button type="submit" className="primary" disabled={submitting}>
        <Send size={16} /> {submitting ? 'Getting feedback...' : 'Submit for feedback'}
      </button>
    </form>
  );
}

export default LearnerWorkspace;
