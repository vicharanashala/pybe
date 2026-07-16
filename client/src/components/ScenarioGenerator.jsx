import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { generateScenario } from '../api/client';

const CONCEPTS = ['Variables', 'Conditionals', 'Loops', 'Lists', 'Dictionaries', 'Functions', 'OOP'];
const DIFFICULTIES = ['Beginner', 'Explorer', 'Builder'];

/**
 * Feature 1: AI Scenario Generator. Learner picks concept, difficulty, and
 * theme; a brand new scenario is generated and persisted, then flows
 * through the exact same Phase 1 pipeline (code generation, CT mapping,
 * hints, IO) as a hand-authored one.
 */
function ScenarioGenerator({ onGenerated }) {
  const [concept, setConcept] = useState(CONCEPTS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [theme, setTheme] = useState('School');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateScenario({ concept, difficulty, theme });
      onGenerated(result.scenario);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="ai-generator">
      <div className="ai-generator-row">
        <label>
          Python concept
          <select value={concept} onChange={(event) => setConcept(event.target.value)}>
            {CONCEPTS.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Difficulty
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            {DIFFICULTIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <p className="ai-generator-label">Theme</p>
      <ThemeSelector value={theme} onChange={setTheme} />

      {error && <p className="error-inline">{error}</p>}

      <button type="button" className="primary" onClick={handleGenerate} disabled={generating}>
        <Sparkles size={16} /> {generating ? 'Generating scenario...' : 'Generate a new scenario'}
      </button>
    </div>
  );
}

export default ScenarioGenerator;
