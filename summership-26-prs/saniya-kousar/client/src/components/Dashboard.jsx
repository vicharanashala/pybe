// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import LearningPath from './LearningPath';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [currentCode, setCurrentCode] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/sessions')
      ]);
      
      const statsData = await statsRes.json();
      const sessionsData = await sessionsRes.json();
      
      setStats(statsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setShowCodeEditor(true);
    // Generate initial code based on scenario
    if (scenario) {
      const initialCode = `# Scenario: ${scenario.title}\n# Difficulty: ${scenario.difficulty}\n# Concepts: ${scenario.concepts?.join(', ') || 'N/A'}\n\ndef solve():\n    # TODO: Implement your solution here\n    pass\n\n# Call your function\nsolver = solve()`;
      setCurrentCode(initialCode);
    }
  };

  const handleCodeSave = async (code) => {
    try {
      const response = await fetch('/api/sessions/save-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          scenarioId: selectedScenario?._id 
        })
      });
      
      if (response.ok) {
        alert('✅ Code saved successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Failed to save code');
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Learning Dashboard</h1>
        <p>Track your progress and get personalized recommendations</p>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="quick-stat">
          <span className="qs-label">Scenarios</span>
          <span className="qs-value">{stats?.scenarioCount || 0}</span>
        </div>
        <div className="quick-stat">
          <span className="qs-label">Sessions</span>
          <span className="qs-value">{stats?.sessionCount || 0}</span>
        </div>
        <div className="quick-stat">
          <span className="qs-label">Avg Score</span>
          <span className="qs-value">{stats?.averagePromptScore || 0}%</span>
        </div>
        <div className="quick-stat">
          <span className="qs-label">Recent Sessions</span>
          <span className="qs-value">{stats?.recentSessions?.length || 0}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Learning Path - Full Width */}
        <div className="dashboard-section full-width">
          <LearningPath onScenarioSelect={handleScenarioSelect} />
        </div>

        {/* Code Editor */}
        {showCodeEditor && (
          <div className="dashboard-section full-width">
            <div className="section-header">
              <h3>💻 Code Editor</h3>
              <button 
                className="btn-close-editor"
                onClick={() => setShowCodeEditor(false)}
              >
                ✕ Close
              </button>
            </div>
            <CodeEditor
              initialCode={currentCode}
              onSave={handleCodeSave}
              onCodeChange={setCurrentCode}
              scenarioId={selectedScenario?._id}
            />
          </div>
        )}

        {/* Recent Sessions */}
        <div className="dashboard-section">
          <h3>🕐 Recent Sessions</h3>
          <div className="recent-sessions">
            {stats?.recentSessions?.length > 0 ? (
              stats.recentSessions.map((session, index) => (
                <div key={index} className="session-item">
                  <div className="session-info">
                    <span className="session-title">{session.scenario?.title || 'Unknown'}</span>
                    <span className="session-score">{session.promptScore || 0}%</span>
                  </div>
                  <div className="session-meta">
                    <span className="session-date">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No sessions yet. Start learning!</p>
            )}
          </div>
        </div>

        {/* Concept Mastery */}
        <div className="dashboard-section">
          <h3>🎯 Concept Mastery</h3>
          <div className="concept-mastery">
            {stats?.conceptCounts ? (
              Object.entries(stats.conceptCounts).map(([concept, count]) => (
                <div key={concept} className="concept-mastery-item">
                  <span className="concept-name">{concept}</span>
                  <div className="concept-bar">
                    <div 
                      className="concept-fill"
                      style={{ 
                        width: `${Math.min(count * 10, 100)}%`,
                        background: `linear-gradient(90deg, #89b4fa, ${count > 5 ? '#a6e3a1' : '#f9e2af'})`
                      }}
                    />
                  </div>
                  <span className="concept-count">{count}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No concepts mastered yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;