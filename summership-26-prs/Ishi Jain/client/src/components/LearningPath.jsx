// client/src/components/LearningPath.jsx
import React, { useState, useEffect } from 'react';
import './LearningPath.css';

const LearningPath = ({ onScenarioSelect }) => {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLearningPath();
  }, []);

  const fetchLearningPath = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching learning path...');
      const response = await fetch('http://localhost:5000/api/learning-path');
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch learning path: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Learning path data:', data);
      setPath(data);
    } catch (error) {
      console.error('Error fetching learning path:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshPath = async () => {
    await fetchLearningPath();
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#a6e3a1',
      'Explorer': '#f9e2af',
      'Builder': '#89b4fa',
      'Advanced': '#f38ba8'
    };
    return colors[difficulty] || '#6c7086';
  };

  if (loading) {
    return (
      <div className="learning-path-loading">
        <div className="spinner"></div>
        <p>🔄 Generating your personalized learning path...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning-path-error">
        <p>❌ Error: {error}</p>
        <button onClick={refreshPath} className="btn-retry">
          🔄 Retry
        </button>
      </div>
    );
  }

  if (!path || path.totalSessions === 0) {
    return (
      <div className="learning-path-empty">
        <div className="empty-state-icon">🚀</div>
        <h3>Welcome to Your Learning Path!</h3>
        <p>Complete your first learning session to get personalized recommendations.</p>
        <button onClick={refreshPath} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="learning-path-container">
      <div className="learning-path-header">
        <h2>📚 Your Personalized Learning Path</h2>
        <button onClick={refreshPath} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{Math.round(path.averageScore || 0)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(path.averageScore || 0, 100)}%`,
                background: `linear-gradient(90deg, #89b4fa, ${path.averageScore > 70 ? '#a6e3a1' : '#f9e2af'})`
              }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <span className="stat-label">Sessions</span>
            <span className="stat-value">{path.totalSessions || 0}</span>
          </div>
          <div className="stat-sub">{path.completedSessions || 0} completed</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <span className="stat-label">Next Difficulty</span>
            <span 
              className="stat-value" 
              style={{ 
                color: getDifficultyColor(path.nextDifficulty),
                fontWeight: 'bold'
              }}
            >
              {path.nextDifficulty || 'Beginner'}
            </span>
          </div>
          <div className="stat-sub">Recommended level</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">Progress</span>
            <span className="stat-value">{Math.min(path.progress || 0, 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(path.progress || 0, 100)}%`,
                background: `linear-gradient(90deg, #89b4fa, ${path.progress > 70 ? '#a6e3a1' : '#f9e2af'})`
              }}
            />
          </div>
          <div className="stat-sub">{path.totalSessions || 0} / 10 sessions</div>
        </div>
      </div>

      {/* Weak Concepts */}
      {path.weakConcepts && path.weakConcepts.length > 0 && (
        <div className="weak-concepts-section">
          <h3>🎯 Concepts to Improve</h3>
          <div className="weak-concepts-list">
            {path.weakConcepts.map((weak, index) => {
              const formattedConcept = weak.concept
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
              
              const status = weak.average < 40 ? '🔴 Needs work' : 
                           weak.average < 70 ? '🟡 Getting there' : '🟢 Good';
              
              return (
                <div key={index} className="concept-item">
                  <div className="concept-info">
                    <span className="concept-name">{formattedConcept}</span>
                    <span className="concept-score">{Math.round(weak.average || 0)}%</span>
                  </div>
                  <div className="concept-progress">
                    <div 
                      className="concept-progress-fill"
                      style={{ 
                        width: `${Math.min(weak.average || 0, 100)}%`,
                        background: `linear-gradient(90deg, #f38ba8, ${weak.average > 50 ? '#f9e2af' : '#f38ba8'})`
                      }}
                    />
                  </div>
                  <div className="concept-status">{status}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {path.recommendations && path.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>📋 Recommended Scenarios</h3>
          <div className="recommendations-list">
            {path.recommendations.map((scenario, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-header">
                  <h4>{scenario.title}</h4>
                  <span 
                    className="difficulty-badge" 
                    style={{ 
                      background: getDifficultyColor(scenario.difficulty),
                      color: '#1e1e2e',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {scenario.difficulty || 'Beginner'}
                  </span>
                </div>
                <p className="recommendation-desc">{scenario.description || 'Practice your skills'}</p>
                {scenario.concepts && scenario.concepts.length > 0 && (
                  <div className="recommendation-concepts">
                    {scenario.concepts.map((concept, i) => (
                      <span key={i} className="concept-tag">{concept}</span>
                    ))}
                  </div>
                )}
                {scenario.recommended && (
                  <div className="recommendation-badge">⭐ Recommended</div>
                )}
                <button 
                  className="btn-start-scenario"
                  onClick={() => {
                    if (onScenarioSelect) {
                      onScenarioSelect(scenario);
                    }
                  }}
                >
                  Start Learning →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Tip */}
      <div className="progress-tip">
        💡 <strong>Tip:</strong> Complete more sessions to unlock Explorer and Builder level scenarios!
      </div>
    </div>
  );
};

export default LearningPath;