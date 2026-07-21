import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import ScenarioOptionPicker from './ScenarioOptionPicker';
import { generateCustomScenarioOptions } from '../api/client';

/**
 * Feature 2: Custom Scenario Prompt. The learner describes any situation in
 * their own words; three distinct scenario options are generated from it
 * (Enhancement Proposal #11) and previewed before anything is saved.
 */
function ScenarioPromptBox({ onGenerated }) {
  const [description, setDescription] = useState('');
  const [lastDescription, setLastDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState(null);

  async function requestOptions(text) {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateCustomScenarioOptions(text);
      setOptions(result.options);
      setLastDescription(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!description.trim()) return;
    requestOptions(description);
    setDescription('');
  }

  if (options) {
    return (
      <ScenarioOptionPicker
        options={options}
        onSelected={onGenerated}
        onRegenerate={() => requestOptions(lastDescription)}
        regenerating={generating}
      />
    );
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
        <Wand2 size={16} /> {generating ? 'Building your options...' : 'Turn this into scenario options'}
      </button>
    </form>
  );
}

export default ScenarioPromptBox;
