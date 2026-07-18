import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain, ChartNoAxesCombined, Code2, Compass, Lightbulb, MessageSquareText,
  Play, Route, Search, Send, Sparkles, User, LogIn, LogOut, Award,
  TrendingUp, Target, Calendar, AlertTriangle, BarChart3, BookOpen, Layers, X
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() { return localStorage.getItem('pybe_token'); }
function setToken(t) { if (t) localStorage.setItem('pybe_token', t); else localStorage.removeItem('pybe_token'); }

async function api(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  if (options.headers) Object.assign(headers, options.headers);
  const response = await fetch(API_URL + path, { ...options, headers });
  if (!response.ok) { const text = await response.text(); throw new Error(text); }
  return response.json();
}

function App() {
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trends, setTrends] = useState(null);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '' });
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('learn');
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) api('/auth/me').then(setUser).catch(() => setToken(null));
  }, []);

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((s) => s.concepts || []))].sort(), [scenarios]);

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    try {
      const [sc, se, an, ro, re, tr] = await Promise.all([
        api('/scenarios?' + params), api('/sessions'), api('/analytics'),
        api('/roadmap'), api('/recommendations').catch(() => []), api('/analytics/trends').catch(() => null)
      ]);
      setScenarios(sc); setSessions(se); setAnalytics(an); setRoadmap(ro);
      setRecommendations(re); setTrends(tr);
      if (!selected && sc[0]) setSelected(sc[0]);
      setLoading(false);
    } catch (e) { console.error(e); setLoading(false); }
  }

  useEffect(() => { refresh().catch(console.error); }, [filters.q, filters.difficulty, filters.concept]);

  async function submitSession(e) {
    e.preventDefault();
    if (!selected || !form.reasoning.trim()) return;
    setSubmitting(true);
    try {
      const result = await api('/sessions', { method: 'POST', body: JSON.stringify({ ...form, scenarioId: selected._id }) });
      setActiveResult(result);
      setForm({ ...form, reasoning: '', promptText: '', reflection: '' });
      await refresh();
    } finally { setSubmitting(false); }
  }

  async function handleAuth(e) {
    e.preventDefault();
    setAuthError('');
    try {
      const ep = authMode === 'login' ? '/auth/login' : '/auth/signup';
      const body = authMode === 'login' ? { email: authEmail, password: authPassword } : { email: authEmail, password: authPassword, name: authName };
      const data = await api(ep, { method: 'POST', body: JSON.stringify(body) });
      setToken(data.token); setUser(data.user); setShowAuth(false);
      setForm(f => ({ ...f, learnerName: data.user.name || 'Guest learner' }));
    } catch (err) { setAuthError(err.message || 'Auth failed'); }
  }

  function handleLogout() { setToken(null); setUser(null); setForm(f => ({ ...f, learnerName: 'Guest learner' })); }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    try {
      const data = await api('/auth/profile', { method: 'PUT', body: JSON.stringify({ name: profileName }) });
      setUser(data); setProfileMsg('Profile updated!');
      setTimeout(() => setProfileMsg(''), 2000);
    } catch { setProfileMsg('Failed'); }
  }

  if (loading) return <main className="loading">Loading PyBe...</main>;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><Brain size={30} /><div><strong>PyBe</strong><span>Scenario-first Python</span></div></div>

        {user ? (
          <div className="user-badge" onClick={() => setShowProfile(!showProfile)}>
            <User size={16} /><span>{user.name}</span>
            <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Logout"><LogOut size={14} /></button>
          </div>
        ) : (
          <button className="auth-btn" onClick={() => setShowAuth(true)}><LogIn size={16} /> Sign in</button>
        )}

        {showProfile && user && (
          <div className="profile-panel">
            <form onSubmit={handleUpdateProfile}>
              <input value={profileName || user.name} onChange={e => setProfileName(e.target.value)} placeholder="Your name" />
              <button className="primary small" type="submit">Save</button>
            </form>
            {profileMsg && <small>{profileMsg}</small>}
            <hr /><p><small>Role: {user.role}</small></p><p><small>{user.email}</small></p>
          </div>
        )}

        <label className="search"><Search size={18} />
          <input value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} placeholder="Search scenarios" />
        </label>

        <select value={filters.difficulty} onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))}>
          <option value="">All levels</option>
          <option>Beginner</option><option>Explorer</option><option>Builder</option>
        </select>

        <select value={filters.concept} onChange={e => setFilters(f => ({ ...f, concept: e.target.value }))}>
          <option value="">All concepts</option>
          {concepts.map(c => <option key={c}>{c}</option>)}
        </select>

        <div className="scenario-list">
          {scenarios.map(sc => (
            <button key={sc._id} className={selected?._id === sc._id ? 'scenario active' : 'scenario'}
              onClick={() => { setSelected(sc); setActiveResult(null); setActiveTab('learn'); }}>
              <span>{sc.difficulty}</span><strong>{sc.title}</strong><small>{sc.concepts.join(' / ')}</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace">
        <header className="hero">
          <div><p>AI-native learning journey</p><h1>Learn Python by reasoning through real situations first.</h1></div>
          <div className="hero-stats">
            <span>{analytics?.scenarioCount || 0}<small>Scenarios</small></span>
            <span>{analytics?.sessionCount || 0}<small>Sessions</small></span>
            <span>{analytics?.averagePromptScore || 0}<small>Prompt score</small></span>
            <span>{analytics?.streak?.current || 0}<small>Day streak</small></span>
          </div>
        </header>

        <nav className="tabs">
          <button className={activeTab === 'learn' ? 'tab active' : 'tab'} onClick={() => setActiveTab('learn')}><BookOpen size={16} /> Learn</button>
          <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}><BarChart3 size={16} /> Dashboard</button>
          <button className={activeTab === 'history' ? 'tab active' : 'tab'} onClick={() => setActiveTab('history')}><MessageSquareText size={16} /> History</button>
        </nav>

        {activeTab === 'learn' && (
          <div className="main-grid">
            <section className="panel learning-panel">
              <div className="section-title"><Compass size={20} /><h2>{selected?.title || 'Select a scenario'}</h2></div>
              <div className="auth-inline">
                {!user && <p className="auth-nudge">Sign in to save your progress — <button className="link" onClick={() => setShowAuth(true)}>Sign in / Register</button></p>}
              </div>
              {selected?.context && <p className="context">{selected.context}</p>}
              {selected?.objectives && <div className="objective-row">{selected.objectives.map(o => <span key={o}>{o}</span>)}</div>}
              <form onSubmit={submitSession} className="learning-form">
                <label>Your reasoning<textarea required value={form.reasoning} onChange={e => setForm(f => ({ ...f, reasoning: e.target.value }))} placeholder={selected?.prompt} /></label>
                <label>Prompt you would give an AI mentor<textarea value={form.promptText} onChange={e => setForm(f => ({ ...f, promptText: e.target.value }))} placeholder="Explain my approach step by step..." /></label>
                <label>Reflection<textarea value={form.reflection} onChange={e => setForm(f => ({ ...f, reflection: e.target.value }))} placeholder="What did you notice?" /></label>
                <button className="primary" disabled={submitting}><Send size={18} />{submitting ? 'Mapping...' : 'Map My Reasoning'}</button>
              </form>
            </section>

            <section className="panel result-panel">
              <div className="section-title"><Sparkles size={20} /><h2>AI Mentor Output</h2></div>
              {!activeResult ? (
                <div className="empty"><Lightbulb size={38} /><p>Submit reasoning to see abstraction mapping, Python code, prompt feedback, and misconception signals.</p></div>
              ) : (
                <div className="result-stack">
                  <div className="score"><span>{activeResult.promptScore}</span><small>Prompt maturity</small></div>
                  {activeResult.promptClassification && <div className="classification"><strong>Interaction: {activeResult.promptClassification}</strong></div>}
                  {activeResult.promptDimensions && activeResult.promptDimensions.map(d => (
                    <div className="dim-bar" key={d.name}><span>{d.name}</span><meter min="0" max={d.max} value={d.score} /><strong>{d.score}/{d.max}</strong></div>
                  ))}
                  {activeResult.abstractionMap?.map(item => (
                    <article className="mapping" key={item.pattern}><strong>{item.pattern}</strong><span>{item.pythonConcept}</span><p>{item.explanation}</p></article>
                  ))}
                  <div className="code-block"><div><Code2 size={18} /> Generated Python</div><pre>{activeResult.generatedCode}</pre><p>{activeResult.codeExplanation}</p></div>
                  <ul className="feedback">{activeResult.promptFeedback?.map(i => <li key={i}>{i}</li>)}</ul>
                  {activeResult.misconceptions?.length > 0 && (
                    <div className="note"><strong>Misconception watch</strong>{activeResult.misconceptions.map(i => <p key={i}>{i}</p>)}</div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard analytics={analytics} recommendations={recommendations} sessions={sessions} />}
        {activeTab === 'history' && <HistoryTab sessions={sessions} />}
      </section>

      {showAuth && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAuth(false); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuth(false)}><X size={20} /></button>
            <h2>{authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>
            <form onSubmit={handleAuth}>
              {authMode === 'signup' && <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Name" required />}
              <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email" required />
              <input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Password" required minLength={6} />
              {authError && <p className="auth-error">{authError}</p>}
              <button className="primary" type="submit">{authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
            </form>
            <p className="auth-toggle">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button className="link" onClick={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')}>{authMode === 'login' ? 'Sign up' : 'Sign in'}</button>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function Dashboard({ analytics, recommendations, sessions }) {
  const conceptMastery = analytics?.conceptMastery ? Object.entries(analytics.conceptMastery) : [];
  const weakest = analytics?.weakestConcept || null;
  const dailyCounts = analytics?.dailySessionCounts ? Object.entries(analytics.dailySessionCounts).slice(-7) : [];
  const colors = { mastered: '#4ade80', developing: '#facc15', needs_work: '#f87171' };

  return (
    <div className="dashboard-tab">
      <div className="dashboard-grid">
        <div className="panel">
          <div className="section-title"><Award size={18} /><h3>Learner Profile</h3></div>
          <div className="profile-card">
            <div className="profile-stat"><strong>{analytics?.sessionCount || 0}</strong><small>Sessions</small></div>
            <div className="profile-stat"><strong>{analytics?.averagePromptScore || 0}</strong><small>Avg Score</small></div>
            <div className="profile-stat"><strong>{analytics?.streak?.current || 0}</strong><small>Day Streak</small></div>
            <div className="profile-stat"><strong>{analytics?.streak?.longest || 0}</strong><small>Best Streak</small></div>
          </div>
          {weakest && <div className="weakest-concept"><AlertTriangle size={14} /><span>Focus on: {weakest.name} ({weakest.avgPromptScore} avg)</span></div>}
        </div>

        <div className="panel">
          <div className="section-title"><Target size={18} /><h3>Recommendations</h3></div>
          {recommendations?.length > 0 ? recommendations.map((r, i) => (
            <div className="rec-card" key={i}><strong>{r.reason}</strong></div>
          )) : <p>Complete sessions to get recommendations.</p>}
        </div>

        {conceptMastery.length > 0 && (
          <div className="panel">
            <div className="section-title"><Layers size={18} /><h3>Concept Mastery</h3></div>
            <div className="mastery-grid">
              {conceptMastery.map(([name, stats]) => (
                <div className="mastery-card" key={name} style={{ borderLeft: '4px solid ' + (colors[stats.level] || '#999') }}>
                  <strong>{name}</strong><span>{stats.avgPromptScore} avg</span><small>{stats.sessions} sessions</small>
                  <span className={'level-badge ' + stats.level}>{stats.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {dailyCounts.length > 0 && (
          <div className="panel">
            <div className="section-title"><Calendar size={18} /><h3>Learning Pace</h3></div>
            <div className="pace-row">
              {dailyCounts.map(([day, count]) => (
                <div className="pace-item" key={day}>
                  <div className="pace-bar" style={{ height: Math.max(count * 20, 4) + 'px' }}></div>
                  <small>{day.slice(5)}</small><span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="panel">
          <div className="section-title"><TrendingUp size={18} /><h3>Recent</h3></div>
          {sessions.length > 0 ? sessions.slice(0, 5).map(s => (
            <article className="session-item" key={s._id}>
              <Play size={14} />
              <div><strong>{s.scenario?.title || 'Unknown'}</strong><span>{(s.masterySignals || []).join(' / ')}</span></div>
              <small>{s.promptScore}</small>
            </article>
          )) : <p>No sessions yet.</p>}
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ sessions }) {
  return (
    <div className="history-tab">
      <div className="panel">
        <div className="section-title"><MessageSquareText size={20} /><h2>Session History</h2></div>
        {sessions.length > 0 ? (
          <table className="session-table">
            <thead><tr><th>Scenario</th><th>Score</th><th>Concepts</th><th>Misconceptions</th><th>Date</th></tr></thead>
            <tbody>{sessions.slice(0, 30).map(s => (
              <tr key={s._id}>
                <td>{s.scenario?.title || 'Unknown'}</td>
                <td><span className="score-badge">{s.promptScore}</span></td>
                <td>{(s.abstractionMap || []).map(m => m.pythonConcept).join(', ')}</td>
                <td>{(s.misconceptions || []).length}</td>
                <td>{s.createdAt?.slice(0, 10)}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : <p>No sessions yet.</p>}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
