import React, { useEffect, useState } from 'react';
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Flame, Lock, Star, Trophy, Zap } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

const badgeDefs = [
  { id: 'beginner', name: 'Beginner', description: 'Complete your first challenge', icon: <Star size={24} />, threshold: 1 },
  { id: 'consistent', name: 'Consistent Learner', description: 'Complete 7 challenges', icon: <Zap size={24} />, threshold: 7 },
  { id: 'explorer', name: 'Python Explorer', description: 'Complete 15 challenges', icon: <Award size={24} />, threshold: 15 },
  { id: 'master', name: 'Challenge Master', description: 'Complete all 30 challenges', icon: <Trophy size={24} />, threshold: 30 }
];

export default function PythonChallenge() {
  const [challenges, setChallenges] = useState([]);
  const [progress, setProgress] = useState({ completedDays: [], currentStreak: 0, lastCompletedDate: null });
  const [selectedDay, setSelectedDay] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [challengesData, progressData] = await Promise.all([
        api('/challenges'),
        api('/challenges/progress')
      ]);
      setChallenges(challengesData);
      setProgress(progressData);
    } catch {
      // Error loading
    } finally {
      setLoading(false);
    }
  }

  async function completeDay() {
    setCompleting(true);
    try {
      const newProgress = await api(`/challenges/${selectedDay}/complete`, { method: 'POST' });
      setProgress(newProgress);
    } catch {
      // Error
    } finally {
      setCompleting(false);
    }
  }

  const currentChallenge = challenges.find((c) => c.day === selectedDay);
  const completedCount = progress.completedDays.length;
  const progressPercent = Math.round((completedCount / 30) * 100);
  const earnedBadges = badgeDefs.filter((b) => completedCount >= b.threshold);

  if (loading) return <div className="loading">Loading challenges...</div>;

  return (
    <div className="challenge-page">
      <header className="page-header">
        <div className="page-header-text">
          <h1>30-Day Python Challenge</h1>
          <p>One coding challenge per day. Build your Python skills progressively from easy to hard.</p>
        </div>
      </header>

      <div className="challenge-overview">
        <div className="panel stat-card">
          <Calendar size={28} />
          <div>
            <strong>{completedCount} / 30</strong>
            <span>Days Completed</span>
          </div>
        </div>
        <div className="panel stat-card">
          <Flame size={28} />
          <div>
            <strong>{progress.currentStreak}</strong>
            <span>Day Streak</span>
          </div>
        </div>
        <div className="panel stat-card">
          <Trophy size={28} />
          <div>
            <strong>{progressPercent}%</strong>
            <span>Progress</span>
          </div>
        </div>
        <div className="panel stat-card">
          <Award size={28} />
          <div>
            <strong>{earnedBadges.length}</strong>
            <span>Badges Earned</span>
          </div>
        </div>
      </div>

      <div className="panel progress-bar-panel">
        <h3>Overall Progress</h3>
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="progress-labels">
          <span>Day 1</span>
          <span>{progressPercent}% complete</span>
          <span>Day 30</span>
        </div>
      </div>

      <section className="panel badges-panel">
        <div className="section-title"><Award size={20} /><h2>Badge Collection</h2></div>
        <div className="badges-grid">
          {badgeDefs.map((badge) => {
            const earned = completedCount >= badge.threshold;
            return (
              <div key={badge.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
                <div className="badge-icon">{earned ? badge.icon : <Lock size={24} />}</div>
                <strong>{badge.name}</strong>
                <small>{badge.description}</small>
                {!earned && <span className="badge-progress">{completedCount}/{badge.threshold}</span>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="challenge-content">
        <section className="panel day-selector">
          <div className="section-title"><Calendar size={20} /><h2>Select Day</h2></div>
          <div className="day-grid">
            {challenges.map((ch) => {
              const completed = progress.completedDays.includes(ch.day);
              const isSelected = ch.day === selectedDay;
              const difficultyClass = ch.difficulty.toLowerCase();
              return (
                <button
                  key={ch.day}
                  className={`day-btn ${isSelected ? 'selected' : ''} ${completed ? 'completed' : ''} ${difficultyClass}`}
                  onClick={() => { setSelectedDay(ch.day); setShowHint(false); setSolution(''); }}
                >
                  {completed && <CheckCircle size={14} />}
                  <span>{ch.day}</span>
                </button>
              );
            })}
          </div>
          <div className="day-legend">
            <span className="legend-item"><span className="legend-dot easy" /> Easy</span>
            <span className="legend-item"><span className="legend-dot medium" /> Medium</span>
            <span className="legend-item"><span className="legend-dot hard" /> Hard</span>
          </div>
        </section>

        {currentChallenge && (
          <section className="panel challenge-detail">
            <div className="challenge-nav">
              <button
                className="icon-btn"
                disabled={selectedDay <= 1}
                onClick={() => { setSelectedDay(selectedDay - 1); setShowHint(false); setSolution(''); }}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="challenge-header">
                <span className={`difficulty-badge ${currentChallenge.difficulty.toLowerCase()}`}>{currentChallenge.difficulty}</span>
                <h2>Day {currentChallenge.day}: {currentChallenge.title}</h2>
              </div>
              <button
                className="icon-btn"
                disabled={selectedDay >= 30}
                onClick={() => { setSelectedDay(selectedDay + 1); setShowHint(false); setSolution(''); }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="challenge-section">
              <h3>Problem</h3>
              <p>{currentChallenge.problem}</p>
            </div>

            {currentChallenge.exampleInput && (
              <div className="challenge-section">
                <h3>Example Input</h3>
                <pre>{currentChallenge.exampleInput}</pre>
              </div>
            )}

            <div className="challenge-section">
              <h3>Expected Output</h3>
              <pre>{currentChallenge.exampleOutput}</pre>
            </div>

            <div className="challenge-section">
              <h3>Concepts</h3>
              <div className="concepts-row">
                {currentChallenge.concepts.map((c) => <span key={c} className="concept-pill">{c}</span>)}
              </div>
            </div>

            <div className="challenge-section">
              <button className="secondary-btn" onClick={() => setShowHint(!showHint)}>
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && <div className="hint-box"><Zap size={16} /> {currentChallenge.hint}</div>}
            </div>

            <div className="challenge-section">
              <label>
                Your Solution
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="# Write your Python solution here"
                  className="code-textarea"
                  rows={8}
                />
              </label>
            </div>

            <div className="challenge-actions">
              {progress.completedDays.includes(selectedDay) ? (
                <span className="completed-label"><CheckCircle size={18} /> Completed</span>
              ) : (
                <button className="primary" onClick={completeDay} disabled={completing}>
                  <CheckCircle size={18} />
                  {completing ? 'Saving...' : 'Mark as Completed'}
                </button>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
