import React, { useEffect, useState } from 'react';
import { BarChart3, BookOpenCheck, History } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getDashboard()
      .then((data) => { if (!cancelled) setDashboard(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="loading-inline">Loading your dashboard...</p>;
  if (error) return <p className="error-inline">Could not load your dashboard: {error}</p>;
  if (!dashboard) return null;

  const overallPercent = dashboard.totalScenarios
    ? Math.round((dashboard.completedScenarios.length / dashboard.totalScenarios) * 100)
    : 0;

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
