import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Clock, TrendingUp, Play } from 'lucide-react';
import HorcruxVault from '../components/HorcruxVault.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
async function api(path) {
  const r = await fetch(`${API_URL}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

function ConceptBar({ name, count, maxCount }) {
  const pct = maxCount ? Math.round((count / maxCount) * 100) : 0;
  return (
    <div className="cb">
      <div className="cb__top">
        <span className="cb__name">{name}</span>
        <span className="cb__count">{count} sessions</span>
      </div>
      <div className="cb__track">
        <div className="cb__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([api('/analytics'), api('/sessions')])
      .then(([a, s]) => { setAnalytics(a); setSessions(s); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dash page-content container">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 120, marginBottom: 16, borderRadius: 'var(--r-lg)' }} />
        ))}
      </div>
    );
  }

  const concepts = Object.entries(analytics?.conceptCounts || {}).sort((a, b) => b[1] - a[1]);
  const maxCount = concepts[0]?.[1] || 1;

  const scoreLabel = (s) => {
    if (s >= 70) return { text: 'Excellent', color: 'var(--accent)' };
    if (s >= 45) return { text: 'Developing', color: 'var(--chai-color)' };
    return { text: 'Early stage', color: 'var(--builder-color)' };
  };

  return (
    <div className="dash page-content">
      <div className="container">
        <div className="section-label">Your Progress</div>
        <h1 style={{ marginBottom: 'var(--sp-2)' }}>Learning Dashboard</h1>
        <p style={{ marginBottom: 'var(--sp-8)' }}>
          Track your concept mastery, prompt quality, and Horcrux progress below.
        </p>

        {/* Summary stats */}
        <div className="dash__stats-row stagger">
          {[
            { icon: <BarChart2 size={20} />, label: 'Scenarios', val: analytics?.scenarioCount ?? 0, color: 'var(--accent)' },
            { icon: <Play size={20} />, label: 'Sessions', val: analytics?.sessionCount ?? 0, color: 'var(--explorer-color)' },
            { icon: <TrendingUp size={20} />, label: 'Avg Prompt Score', val: analytics?.averagePromptScore ?? 0, color: 'var(--chai-color)' },
            { icon: <Clock size={20} />, label: 'Concepts Explored', val: concepts.length, color: 'var(--builder-color)' },
          ].map(s => (
            <div key={s.label} className="dash__stat-card card anim-fade-up">
              <div className="dash__stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="dash__stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="dash__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dash__grid">
          {/* Concept mastery */}
          <div className="card dash__panel">
            <div className="section-label" style={{ marginBottom: 'var(--sp-4)' }}>Concept Mastery</div>
            {concepts.length === 0 ? (
              <div className="dash__empty">
                <p>No sessions yet. <Link to="/scenarios">Start learning →</Link></p>
              </div>
            ) : (
              <div className="dash__concept-list">
                {concepts.map(([name, count]) => (
                  <ConceptBar key={name} name={name} count={count} maxCount={maxCount} />
                ))}
              </div>
            )}
          </div>

          {/* Recent sessions */}
          <div className="card dash__panel">
            <div className="section-label" style={{ marginBottom: 'var(--sp-4)' }}>Recent Sessions</div>
            {sessions.length === 0 ? (
              <div className="dash__empty">
                <p>No sessions yet. <Link to="/scenarios">Try a scenario →</Link></p>
              </div>
            ) : (
              <div className="dash__sessions">
                {sessions.slice(0, 8).map(session => {
                  const sl = scoreLabel(session.promptScore);
                  return (
                    <div key={session._id} className="dash__session">
                      <div className="dash__session-icon">
                        <Play size={13} />
                      </div>
                      <div className="dash__session-body">
                        <div className="dash__session-title">{session.scenario?.title || 'Unknown Scenario'}</div>
                        <div className="dash__session-meta">
                          {session.masterySignals?.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                      <div className="dash__session-score" style={{ color: sl.color }}>
                        {session.promptScore}
                        <span>{sl.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Horcrux vault */}
        <div className="card dash__horcrux">
          <HorcruxVault conceptCounts={analytics?.conceptCounts || {}} />
        </div>
      </div>

      <style>{`
        .dash__stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--sp-4);
          margin-bottom: var(--sp-6);
        }
        .dash__stat-card {
          padding: var(--sp-5);
          display: flex; flex-direction: column; gap: var(--sp-2);
        }
        .dash__stat-icon {}
        .dash__stat-val { font-family: var(--font-heading); font-size: 2rem; font-weight: 800; }
        .dash__stat-label { font-size: 0.8rem; color: var(--text-muted); }

        .dash__grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: var(--sp-5); margin-bottom: var(--sp-5); align-items: start; }
        .dash__panel { padding: var(--sp-5); }
        .dash__empty { color: var(--text-muted); font-size: 0.85rem; }
        .dash__empty a { color: var(--accent); }

        .dash__concept-list { display: flex; flex-direction: column; gap: var(--sp-3); }
        .cb { display: flex; flex-direction: column; gap: 6px; }
        .cb__top { display: flex; justify-content: space-between; }
        .cb__name { font-size: 0.85rem; color: var(--text-primary); font-weight: 500; }
        .cb__count { font-size: 0.75rem; color: var(--text-muted); }
        .cb__track { height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden; }
        .cb__fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-dim)); border-radius: 3px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }

        .dash__sessions { display: flex; flex-direction: column; gap: var(--sp-2); }
        .dash__session {
          display: flex; align-items: center; gap: var(--sp-3);
          padding: var(--sp-2) 0;
          border-bottom: 1px solid var(--border);
        }
        .dash__session:last-child { border-bottom: none; }
        .dash__session-icon {
          width: 28px; height: 28px;
          background: var(--bg-elevated); border-radius: var(--r-sm);
          display: grid; place-items: center; color: var(--text-muted); flex-shrink: 0;
        }
        .dash__session-body { flex: 1; min-width: 0; }
        .dash__session-title { font-size: 0.85rem; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dash__session-meta { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
        .dash__session-score { font-size: 1.1rem; font-weight: 700; text-align: right; flex-shrink: 0; }
        .dash__session-score span { display: block; font-size: 0.65rem; font-weight: 500; opacity: 0.8; }

        .dash__horcrux { padding: var(--sp-6); }

        @media (max-width: 900px) {
          .dash__stats-row { grid-template-columns: repeat(2, 1fr); }
          .dash__grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .dash__stats-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
