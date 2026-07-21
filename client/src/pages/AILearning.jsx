import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getRecommendation, getAdaptiveDifficulty, getLearningPath, getMastery } from '../api/client';
import ScenarioGenerator from '../components/ScenarioGenerator';
import RecommendationCard from '../components/RecommendationCard';
import AdaptiveDifficultyIndicator from '../components/AdaptiveDifficultyIndicator';
import LearningPath from '../components/LearningPath';
import MasteryChart from '../components/MasteryChart';

/**
 * Phase 3: AI-Powered Personalized Learning. Hosts scenario generation
 * (Features 1 & 2) and the learner insight panels (Features 3, 5, 6, 10).
 * The AI Tutor (Feature 4) is mounted globally in App.jsx instead, since
 * it needs to be available on every tab, not just this one.
 */
function AILearning({ onOpenScenario }) {
  const [recommendation, setRecommendation] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [path, setPath] = useState(null);
  const [mastery, setMastery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadInsights() {
    setLoading(true);
    setError(null);
    Promise.all([getRecommendation(), getAdaptiveDifficulty(), getLearningPath(), getMastery()])
      .then(([recommendationData, difficultyData, pathData, masteryData]) => {
        setRecommendation(recommendationData);
        setDifficulty(difficultyData);
        setPath(pathData);
        setMastery(masteryData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadInsights, []);

  function handleGenerated(scenario) {
    onOpenScenario(scenario._id);
  }

  return (
    <div className="scenario-browser">
      <header className="browser-header">
        <p className="eyebrow"><Sparkles size={16} /> AI-Powered Personalized Learning</p>
        <h1>Your AI mentor</h1>
        <p className="section-subtitle">
          Generate unlimited new scenarios, get a personalized recommendation, and track your predicted mastery.
        </p>
      </header>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="section-title"><Sparkles size={20} /><h2>Generate a scenario</h2></div>
          <ScenarioGenerator onGenerated={handleGenerated} />
        </div>

        {loading && <p className="loading-inline">Loading your personalized insights...</p>}
        {error && <p className="error-inline">Could not load insights: {error}</p>}

        {!loading && !error && (
          <>
            <div className="panel">
              <RecommendationCard recommendation={recommendation} onOpen={onOpenScenario} />
            </div>

            <div className="panel">
              <div className="section-title"><h2>Adaptive difficulty</h2></div>
              <AdaptiveDifficultyIndicator difficulty={difficulty} />
            </div>

            <div className="panel dashboard-wide">
              <div className="section-title"><h2>Your learning path</h2></div>
              <LearningPath path={path} />
            </div>

            <div className="panel dashboard-wide">
              <div className="section-title"><h2>Predicted concept mastery</h2></div>
              <MasteryChart mastery={mastery} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AILearning;
