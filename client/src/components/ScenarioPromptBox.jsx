import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { generateCustomScenario } from '../api/client';

/**
 * Feature 2: Custom Scenario Prompt. The learner describes any situation
 * in their own words and the AI infers the concept, difficulty, and theme.
 */
function ScenarioPromptBox({ onGenerated }) {
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!description.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateCustomScenario(description);
      setDescription('');
      onGenerated(result.scenario);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <form className="scenario-prompt-box" onSubmit={handleSubmit}>
      <label>
        Describe any situation
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder='e.g. "I want a scenario about managing cricket scores."'
        />
      </label>
      {error && <p className="error-inline">{error}</p>}
      <button type="submit" className="primary" disabled={generating}>
        <Wand2 size={16} /> {generating ? 'Building your scenario...' : 'Turn this into a scenario'}
      </button>
    </form>
  );
}

export default ScenarioPromptBox;
