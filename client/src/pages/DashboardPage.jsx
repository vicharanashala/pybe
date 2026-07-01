import { Compass, ChartNoAxesCombined, Route, MessageSquareText } from 'lucide-react';
import { PageHeader } from '../components/TopNavigation';
import { Analytics, Roadmap, SessionList } from '../components/SharedComponents';

export function DashboardPage({ analytics, roadmap, sessions, xp, streak, onSelectScenario }) {
  return (
    <div className="page dashboard-page">
      <PageHeader
        title="Your Dashboard"
        subtitle="Track your learning progress and achievements"
      />

      <div className="dashboard-layout">
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-icon">&#9733;</span>
            <span className="stat-value">{xp}</span>
            <span className="stat-label">Total XP</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#128293;</span>
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#128202;</span>
            <span className="stat-value">{analytics?.sessionCount || 0}</span>
            <span className="stat-label">Sessions</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#10003;</span>
            <span className="stat-value">{analytics?.averagePromptScore || 0}</span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>

        <div className="dashboard-panels">
          <div className="panel">
            <div className="section-title"><ChartNoAxesCombined size={20} /><h2>Concept Analytics</h2></div>
            <Analytics analytics={analytics} />
          </div>

          <div className="panel">
            <div className="section-title"><Route size={20} /><h2>Learning Roadmap</h2></div>
            <Roadmap roadmap={roadmap} />
          </div>

          <div className="panel">
            <div className="section-title"><MessageSquareText size={20} /><h2>Recent Sessions</h2></div>
            <SessionList sessions={sessions} />
          </div>
        </div>

        <div className="dashboard-next">
          <h3>Continue Learning</h3>
          <p>Choose a scenario to practice what you have learned.</p>
          <button className="primary" onClick={() => onSelectScenario(null)}>
            <Compass size={18} /> Explore Scenarios
          </button>
        </div>
      </div>
    </div>
  );
}