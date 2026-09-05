import React, { useEffect, useState } from 'react';
import { BarChart3, BookOpenCheck, History, Sparkles } from 'lucide-react';
import { getDashboard } from '../api/client';
import XPCard from '../components/XPCard';
import BadgeGrid from '../components/BadgeGrid';
import ProgressBar from '../components/ProgressBar';
import ContinueLearningCard from '../components/ContinueLearningCard';

/**
 * Phase 2 Feature 8: the learner dashboard. Everything shown here comes
 * straight from GET /api/dashboard, which derives it from real stored
 * responses and reflections (see server/src/services/progressService.js).
 */
function Dashboard({ onOpenScenario }) {
  const [dashboard, setDashboard] = useState(null);
  const [storyProgress, setStoryProgress] = useState({ scores: {}, recentStory: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function readStoryProgress() {
    if (typeof window === 'undefined') {
      return { scores: {}, recentStory: null };
    }

    try {
      const stored = window.localStorage.getItem('pybe-story-learning-progress');
      return stored ? JSON.parse(stored) : { scores: {}, recentStory: null };
    } catch (error) {
      return { scores: {}, recentStory: null };
    }
  }

  useEffect(() => {
    let cancelled = false;
    getDashboard()
      .then((data) => { if (!cancelled) setDashboard(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    const syncStoryProgress = () => {
      if (!cancelled) setStoryProgress(readStoryProgress());
    };

    syncStoryProgress();
    window.addEventListener('story-progress-updated', syncStoryProgress);

    return () => {
      cancelled = true;
      window.removeEventListener('story-progress-updated', syncStoryProgress);
    };
  }, []);

  if (loading) return <p className="loading-inline">Loading your dashboard...</p>;
  if (error) return <p className="error-inline">Could not load your dashboard: {error}</p>;
  if (!dashboard) return null;

  const overallPercent = dashboard.totalScenarios
    ? Math.round((dashboard.completedScenarios.length / dashboard.totalScenarios) * 100)
    : 0;

  const storyEntries = Object.values(storyProgress.scores || {}).sort((first, second) => new Date(second.completedAt || 0) - new Date(first.completedAt || 0));
  const recentStory = storyProgress.recentStory;

  return (
    <div className="dashboard-page">
      <header className="browser-header">
        <h1>Your learning dashboard</h1>
        <p className="section-subtitle">
          {dashboard.completedScenarios.length} of {dashboard.totalScenarios} scenarios completed.
        </p>
      </header>

      <div className="dashboard-grid">
        <div className="panel">
          <XPCard
            xp={dashboard.xp}
            level={dashboard.level}
            xpIntoLevel={dashboard.xpIntoLevel}
            xpForNextLevel={dashboard.xpForNextLevel}
            progressToNextLevel={dashboard.progressToNextLevel}
            streak={dashboard.streak}
          />
        </div>

        <div className="panel">
          <div className="section-title"><BarChart3 size={20} /><h2>Overall progress</h2></div>
          <ProgressBar percent={overallPercent} label="Scenarios completed" />
          <p className="section-subtitle">
            {dashboard.reflectionCount} reflections submitted &middot; average feedback score {dashboard.averageFeedbackScore} &middot; {dashboard.hintsUsed} hints used
          </p>
        </div>

        <div className="panel">
          <div className="section-title"><h2>Difficulty progress</h2></div>
          {Object.entries(dashboard.difficultyMastery).map(([difficulty, stats]) => (
            <ProgressBar key={difficulty} value={stats.completed} max={stats.total} label={`${difficulty} (${stats.completed}/${stats.total})`} />
          ))}
        </div>

        <div className="panel">
          <div className="section-title"><h2>Badges</h2></div>
          <BadgeGrid badges={dashboard.badges} />
        </div>

        <div className="panel dashboard-wide">
          <div className="section-title"><BookOpenCheck size={20} /><h2>Concept progress</h2></div>
          <div className="concept-progress-grid">
            {Object.entries(dashboard.conceptProgress).map(([concept, stats]) => (
              <ProgressBar key={concept} value={stats.completed} max={stats.total} label={`${concept} (${stats.completed}/${stats.total})`} />
            ))}
          </div>
        </div>

        <div className="panel dashboard-wide">
          <div className="section-title"><Sparkles size={20} /><h2>Story scores</h2></div>
          {storyEntries.length ? (
            <div className="story-score-grid">
              {storyEntries.map((item) => (
                <div key={item.id} className="story-score-card">
                  <strong>{item.title}</strong>
                  <span>{item.concept}</span>
                  <div className="story-score-value">{item.score}%</div>
                  <small>{item.correctAnswers}/{item.totalQuestions} correct</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">Complete a story to see your scores here.</p>
          )}
        </div>

        <div className="panel">
          <div className="section-title"><History size={20} /><h2>Recently viewed story</h2></div>
          {recentStory ? (
            <div className="recent-story-card">
              <strong>{recentStory.title}</strong>
              <span>{recentStory.concept}</span>
              <small>{new Date(recentStory.viewedAt).toLocaleString()}</small>
            </div>
          ) : (
            <p className="empty-state">Open a story to start tracking your recent view.</p>
          )}
        </div>

        {dashboard.continueLearning.length > 0 && (
          <div className="panel dashboard-wide">
            <ContinueLearningCard items={dashboard.continueLearning} onOpen={onOpenScenario} />
          </div>
        )}

        <div className="panel dashboard-wide">
          <div className="section-title"><History size={20} /><h2>Recent activity</h2></div>
          {dashboard.recentActivity.length ? (
            <ul className="activity-feed">
              {dashboard.recentActivity.map((item) => (
                <li key={`${item.type}-${item.scenarioId}-${item.timestamp}`}>
                  <strong>{item.scenarioTitle}</strong>
                  <span>{item.summary}</span>
                  <time>{new Date(item.timestamp).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No activity yet. Open a scenario to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
