import React from 'react';
import { PageHeader } from '../components/TopNavigation';
import { PYTHON_CONCEPTS, BADGES, getPassportCompletion, getStampStatus, getBadgeStatus, getRecentUnlocks, getNextStamp } from '../utils/passport';

export function PassportPage({ passport, xp, streak, sessions, onClose, newlyUnlocked }) {
  const completion = getPassportCompletion(passport);
  const earnedBadges = BADGES.filter(b => passport.badges[b.id]);
  const recentUnlocks = getRecentUnlocks(passport, 5);
  const nextStamp = getNextStamp(passport);
  const levelMap = ['Beginner', 'Explorer', 'Builder', 'Master'];
  const level = levelMap[Math.min(Math.floor(completion.collected / 5), 3)];

  return (
    <div className="page passport-page">
      <PageHeader
        title="Learning Passport"
        subtitle="Your personal Python learning journey"
      >
        <button className="secondary" onClick={onClose}>Close</button>
      </PageHeader>

      <div className="passport-layout">
        <aside className="passport-sidebar">
          <div className="passport-card passport-profile">
            <div className="passport-avatar">&#128640;</div>
            <h3>Python Learner</h3>
            <p className="passport-level">Level {completion.collected > 0 ? level : 'Beginner'}</p>
            <div className="passport-stats-grid">
              <div className="passport-stat">
                <span className="passport-stat-value">{xp}</span>
                <span className="passport-stat-label">XP</span>
              </div>
              <div className="passport-stat">
                <span className="passport-stat-value">{streak}</span>
                <span className="passport-stat-label">Streak</span>
              </div>
              <div className="passport-stat">
                <span className="passport-stat-value">{passport.sessionsCompleted || 0}</span>
                <span className="passport-stat-label">Sessions</span>
              </div>
              <div className="passport-stat">
                <span className="passport-stat-value">{completion.collected}</span>
                <span className="passport-stat-label">Stamps</span>
              </div>
            </div>
          </div>

          <div className="passport-card passport-progress-card">
            <h4>Passport Progress</h4>
            <div className="passport-progress-bar">
              <div className="passport-progress-fill" style={{ width: `${completion.percentage}%` }} />
            </div>
            <div className="passport-progress-text">
              <span>{completion.collected} / {completion.total} Stamps</span>
              <span className="passport-pct">{completion.percentage}%</span>
            </div>
          </div>

          <div className="passport-card">
            <h4>Level Badges</h4>
            <div className="badges-row">
              {BADGES.map(badge => {
                const status = getBadgeStatus(passport, badge.id);
                return (
                  <div key={badge.id} className={`badge-mini ${status}`} title={badge.name}>
                    <span className="badge-mini-icon">{badge.icon}</span>
                    {status === 'earned' && <span className="badge-mini-check">&#10003;</span>}
                    {status === 'locked' && <span className="badge-mini-lock">&#128274;</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {nextStamp && (
            <div className="passport-card">
              <h4>Next Stamp</h4>
              <div className="next-stamp-preview">
                <span className="next-stamp-icon">{nextStamp.icon}</span>
                <div className="next-stamp-info">
                  <strong>{nextStamp.name}</strong>
                  <span>{nextStamp.description}</span>
                </div>
              </div>
            </div>
          )}

          {recentUnlocks.length > 0 && (
            <div className="passport-card">
              <h4>Recent Unlocks</h4>
              <div className="recent-unlocks">
                {recentUnlocks.map((item, idx) => (
                  <div key={idx} className="recent-unlock-item">
                    <span className="recent-unlock-icon">{item.type === 'stamp' ? item.concept.icon : item.badge.icon}</span>
                    <span className="recent-unlock-text">
                      {item.type === 'stamp' ? `Unlocked ${item.concept.name}` : `Earned ${item.badge.name} ${item.badge.title}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="passport-main">
          <div className="passport-section">
            <h3>Stamp Collection</h3>
            <div className="stamps-grid">
              {PYTHON_CONCEPTS.map(concept => {
                const status = getStampStatus(passport, concept.id);
                const stamp = passport.stamps[concept.id];
                const isNewlyUnlocked = newlyUnlocked && newlyUnlocked.includes(concept.id);
                return (
                  <div key={concept.id} className={`stamp-card ${status}${isNewlyUnlocked ? ' stamp-just-unlocked' : ''}`}>
                    <div className="stamp-border">
                      <div className="stamp-icon">{concept.icon}</div>
                    </div>
                    <div className="stamp-info">
                      <strong>{concept.name}</strong>
                      <span>{concept.description}</span>
                    </div>
                    <div className="stamp-status">
                      {status === 'mastered' && <span className="stamp-badge mastered">Mastered</span>}
                      {status === 'unlocked' && <span className="stamp-badge unlocked">Unlocked</span>}
                      {status === 'locked' && <span className="stamp-badge locked">Locked</span>}
                    </div>
                    {stamp && stamp.unlockedAt && (
                      <div className="stamp-date">
                        {new Date(stamp.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}