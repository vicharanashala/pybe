import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain, Code2, Compass, Lightbulb, MessageSquareText,
  Play, Search, Send, Sparkles, Award,
  TrendingUp, Target, Calendar, AlertTriangle, BarChart3, BookOpen, Layers,
  Bookmark, BookmarkCheck, Trophy, Moon, Sun, Star, Zap, Crown, Globe, Clock
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const response = await fetch(API_URL + path, { ...options, headers });
  if (!response.ok) { const text = await response.text(); throw new Error(text); }
  return response.json();
}

function getAchievements(analytics) {
  const count = analytics?.sessionCount || 0;
  const avg = analytics?.averagePromptScore || 0;
  const longest = analytics?.streak?.longest || 0;
  const mastered = analytics?.conceptMastery
    ? Object.entries(analytics.conceptMastery).filter(([, s]) => s.level === 'mastered').length
    : 0;
  const badges = [];
  if (count >= 1) badges.push({ id: 'first', name: 'First Session', icon: Trophy });
  if (count >= 5) badges.push({ id: 'five', name: 'Getting Started', icon: Star });
  if (count >= 10) badges.push({ id: 'ten', name: 'Double Digits', icon: Award });
  if (count >= 25) badges.push({ id: 'twentyfive', name: 'Quarter Century', icon: Globe });
  if (avg >= 85) badges.push({ id: 'high_avg', name: 'High Performer', icon: Crown });
  if (longest >= 3) badges.push({ id: 'streak_3', name: '3-Day Streak', icon: Zap });
  if (longest >= 7) badges.push({ id: 'streak_7', name: 'Week Warrior', icon: Crown });
  if (mastered >= 1) badges.push({ id: 'first_mastered', name: 'First Mastered', icon: Crown });
  if (mastered >= 3) badges.push({ id: "mastery_3", name: 'Concept Explorer', icon: Trophy });
  const anyImprovement = count >= 2 && avg > 0;
  if (anyImprovement) badges.push({ id: 'improvement', name: 'Rising Star', icon: Star });
  return badges;
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
  const [activeTab, setActiveTab] = useState('learn');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('pybe_dark') === 'true');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const timerRef = useRef(null);

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((s) => s.concepts || []))].sort(), [scenarios]);

  const [bookmarks, setBookmarksState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pybe_bookmarks') || '[]'); } catch { return []; }
  });
  const setBookmarks = useCallback(b => {
    setBookmarksState(b);
    localStorage.setItem('pybe_bookmarks', JSON.stringify(b));
  }, []);

  const badges = useMemo(() => getAchievements(analytics), [analytics]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pybe_dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => setTimerElapsed(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  function handleSelect(scenario) {
    setSelected(scenario);
    setActiveResult(null);
    setActiveTab('learn');
    setTimerRunning(true);
    setTimerElapsed(0);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

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
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const timeSpent = timerElapsed;
    setSubmitting(true);
    try {
      const result = await api('/sessions', { method: 'POST', body: JSON.stringify({ ...form, scenarioId: selected._id, timeSpent }) });
      setActiveResult(result);
      setForm({ ...form, reasoning: '', promptText: '', reflection: '' });
      await refresh();
    } finally { setSubmitting(false); }
  }

  if (loading) return <main className="loading">Loading PyBe...</main>;

  return (
    <main className={`app-shell${darkMode ? ' dark' : ''}`}>
      <aside className="sidebar">
        <div className="brand"><Brain size={30} /><div><strong>PyBe</strong><span>Scenario-first Python</span></div></div>

        <button className="icon-btn dark-toggle" onClick={() => setDarkMode(d => !d)} title="Toggle dark mode">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

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
          {scenarios.map(sc => {
            const isBookmarked = bookmarks.includes(sc._id);
            return (
              <button key={sc._id} className={selected?._id === sc._id ? 'scenario active' : 'scenario'}
                onClick={() => handleSelect(sc)}>
                <span>
                  {sc.difficulty}
                  <span className="bookmark-icon" onClick={e => { e.stopPropagation(); toggleBookmark(sc._id); }}>
                    {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  </span>
                </span>
                <strong>{sc.title}</strong>
                <small>{sc.concepts.join(' / ')}</small>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="workspace">
        <header className="hero">
          <div>
            <p>AI-native learning journey</p>
            <h1>Learn Python by reasoning through real situations first.</h1>
          </div>
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
          <>
            <div className="main-grid">
              <section className="panel learning-panel">
                <div className="section-title">
                  <Compass size={20} /><h2>{selected?.title || 'Select a scenario'}</h2>
                  {timerRunning && <span className="timer"><Clock size={14} /> {formatTime(timerElapsed)}</span>}
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
            {badges.length > 0 && (
              <div className="badge-bar">
                {badges.map(b => {
                  const Icon = b.icon;
                  return <span key={b.id} className="badge" title={b.desc}><Icon size={14} /> {b.name}</span>;
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'dashboard' && <Dashboard analytics={analytics} recommendations={recommendations} sessions={sessions} bookmarks={bookmarks} setBookmarks={setBookmarks} />}
        {activeTab === 'history' && <HistoryTab sessions={sessions} bookmarks={bookmarks} />}
      </section>
    </main>
  );

  function toggleBookmark(scenarioId) {
    const next = bookmarks.includes(scenarioId)
      ? bookmarks.filter(id => id !== scenarioId)
      : [...bookmarks, scenarioId];
    setBookmarks(next);
  }
}

function Dashboard({ analytics, recommendations, sessions, bookmarks }) {
  const conceptMastery = analytics?.conceptMastery ? Object.entries(analytics.conceptMastery) : [];
  const weakest = analytics?.weakestConcept || null;
  const dailyCounts = analytics?.dailySessionCounts ? Object.entries(analytics.dailySessionCounts).slice(-7) : [];
  const colors = { mastered: '#4ade80', developing: '#facc15', needs_work: '#f87171' };
  const bookmarkedSessions = sessions.filter(s => bookmarks.includes(s._id) || (s.scenario?._id && bookmarks.includes(s.scenario._id)));
  const badges = getAchievements(analytics);

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

        {badges.length > 0 && (
          <div className="panel">
            <div className="section-title"><Trophy size={18} /><h3>Achievements</h3></div>
            <div className="badge-grid">
              {badges.map(b => {
                const Icon = b.icon;
                return <div key={b.id} className="badge-card"><Icon size={20} /><span>{b.name}</span></div>;
              })}
            </div>
          </div>
        )}

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
                  <div className="pace-bar" mark-key={day} style={{ height: Math.max(count * 20, 4) + 'px' }}></div>
                  <small>{day.slice(5)}</small><span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookmarkedSessions.length > 0 && (
          <div className="panel">
            <div className="section-title"><BookmarkCheck size={18} /><h3>Favorites</h3></div>
            <div className="fav-list">
              {bookmarkedSessions.slice(0, 5).map(s => (
                <article className="session-item" key={s._id}>
                  <Play size={14} />
                  <div><strong>{s.scenario?.title || 'Unknown'}</strong><span>{s.promptScore} score</span></div>
                </article>
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

function HistoryTab({ sessions, bookmarks }) {
  return (
    <div className="history-tab">
      <div className="panel">
        <div className="section-title"><MessageSquareText size={20} /><h2>Session History</h2></div>
        {sessions.length > 0 ? (
          <table className="session-table">
            <thead><tr><th>Scenario</th><th>Score</th><th>Time</th><th>Concepts</th><th>Misconceptions</th><th>Date</th></tr></thead>
            <tbody>{sessions.slice(0, 30).map(s => (
              <tr key={s._id} className={s._id && bookmarks?.includes(s._id) ? 'bookmarked-row' : ''}>
                <td>{s.scenario?.title || 'Unknown'}</td>
                <td><span className="score-badge">{s.promptScore}</span></td>
                <td>{s.timeSpent ? `${Math.floor(s.timeSpent / 60)}:${String(s.timeSpent % 60).padStart(2, '0')}` : '-'}</td>
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