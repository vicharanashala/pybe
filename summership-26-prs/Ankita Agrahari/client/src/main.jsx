import React, { useEffect, useMemo, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain,
  ChartNoAxesCombined,
  Compass,
  Route,
  Search,
  Send,
  Sparkles,
  ChevronLeft,
  Menu,
  MessageSquareText,
  Play
} from 'lucide-react';
import './styles.css';
import EmptyResult from './components/EmptyResult';
import ChallengeWorkspace from './components/ChallengeWorkspace';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function App() {
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '' });
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [mainSplitWidth, setMainSplitWidth] = useState(48);
  const mainGridRef = useRef(null);

  const startMainResize = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMainResizeMove);
    document.addEventListener('mouseup', handleMainResizeEnd);
    document.addEventListener('touchmove', handleMainTouchResizeMove);
    document.addEventListener('touchend', handleMainResizeEnd);
  };

  const handleMainResizeMove = (e) => {
    if (!mainGridRef.current) return;
    const rect = mainGridRef.current.getBoundingClientRect();
    let percentage = ((e.clientX - rect.left) / rect.width) * 100;
    if (percentage < 20) percentage = 20;
    if (percentage > 70) percentage = 70;
    setMainSplitWidth(percentage);
  };

  const handleMainTouchResizeMove = (e) => {
    if (!mainGridRef.current || !e.touches[0]) return;
    const rect = mainGridRef.current.getBoundingClientRect();
    let percentage = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    if (percentage < 20) percentage = 20;
    if (percentage > 70) percentage = 70;
    setMainSplitWidth(percentage);
  };

  const handleMainResizeEnd = () => {
    document.removeEventListener('mousemove', handleMainResizeMove);
    document.removeEventListener('mouseup', handleMainResizeEnd);
    document.removeEventListener('touchmove', handleMainTouchResizeMove);
    document.removeEventListener('touchend', handleMainResizeEnd);
  };

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((scenario) => scenario.concepts || []))].sort(), [scenarios]);

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    const [scenarioData, sessionData, analyticsData, roadmapData] = await Promise.all([
      api(`/scenarios?${params}`),
      api('/sessions'),
      api('/analytics'),
      api('/roadmap')
    ]);
    setScenarios(scenarioData);
    setSessions(sessionData);
    setAnalytics(analyticsData);
    setRoadmap(roadmapData);
    setSelected((current) => current || scenarioData[0] || null);
    setLoading(false);
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [filters.q, filters.difficulty, filters.concept]);

  useEffect(() => {
    if (selected) {
      setForm((prev) => ({
        ...prev,
        reasoning: '',
        promptText: '',
        reflection: ''
      }));
      setActiveResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selected?._id]);

  async function submitSession(event) {
    event.preventDefault();
    if (!selected || !form.reasoning.trim()) return;
    setSubmitting(true);
    try {
      const result = await api('/sessions', {
        method: 'POST',
        body: JSON.stringify({ ...form, scenarioId: selected._id })
      });
      setActiveResult(result);
      setForm({ ...form, reasoning: '', promptText: '', reflection: '' });
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="loading">Loading PyBe...</main>;

  return (
    <main className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <Brain size={30} />
            <div>
              <strong>PyBe</strong>
              <span>Scenario-first Python</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-sidebar-toggle"
            onClick={() => setSidebarCollapsed(true)}
            title="Hide Scenarios Menu"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <label className="search">
          <Search size={18} />
          <input
            value={filters.q}
            onChange={(event) => setFilters({ ...filters, q: event.target.value })}
            placeholder="Search scenarios"
          />
        </label>

        <select value={filters.difficulty} onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })}>
          <option value="">All levels</option>
          <option>Beginner</option>
          <option>Explorer</option>
          <option>Builder</option>
        </select>

        <select value={filters.concept} onChange={(event) => setFilters({ ...filters, concept: event.target.value })}>
          <option value="">All concepts</option>
          {concepts.map((concept) => <option key={concept}>{concept}</option>)}
        </select>

        <div className="scenario-list">
          {scenarios.map((scenario) => (
            <button
              key={scenario._id}
              className={selected?._id === scenario._id ? 'scenario active' : 'scenario'}
              onClick={() => {
                setSelected(scenario);
              }}
            >
              <span>{scenario.difficulty}</span>
              <strong>{scenario.title}</strong>
              <small>{scenario.concepts.join(' / ')}</small>
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace">
        {sidebarCollapsed && (
          <button
            type="button"
            className="btn-sidebar-expand"
            onClick={() => setSidebarCollapsed(false)}
            title="Show Scenarios Menu"
          >
            <Menu size={18} /> View Scenarios
          </button>
        )}
        <header className="hero">
          <div>
            <p>AI-native learning journey</p>
            <h1>Learn Python by reasoning through real situations first.</h1>
          </div>
          <div className="hero-stats">
            <span>{analytics?.scenarioCount || 0}<small>Scenarios</small></span>
            <span>{analytics?.sessionCount || 0}<small>Sessions</small></span>
            <span>{analytics?.averagePromptScore || 0}<small>Prompt score</small></span>
          </div>
        </header>

        <div className="main-grid" ref={mainGridRef}>
          <section className="panel learning-panel" style={{ width: `calc(${mainSplitWidth}% - 4px)`, flexShrink: 0 }}>
            <div className="section-title">
              <Compass size={20} />
              <h2>{selected?.title}</h2>
            </div>
            <p className="context">{selected?.context}</p>
            <div className="objective-row">
              {selected?.objectives.map((item) => <span key={item}>{item}</span>)}
            </div>
            <form onSubmit={submitSession} className="learning-form">
              <label>
                Your reasoning
                <textarea
                  required
                  value={form.reasoning}
                  onChange={(event) => setForm({ ...form, reasoning: event.target.value })}
                  placeholder={selected?.prompt}
                />
              </label>
              <label>
                Prompt you would give an AI mentor
                <textarea
                  value={form.promptText}
                  onChange={(event) => setForm({ ...form, promptText: event.target.value })}
                  placeholder="Explain my approach step by step, then show the Python concept and code..."
                />
              </label>
              <label>
                Reflection
                <textarea
                  value={form.reflection}
                  onChange={(event) => setForm({ ...form, reflection: event.target.value })}
                  placeholder="What did you notice about your thinking?"
                />
              </label>
              <button className="primary" disabled={submitting}>
                <Send size={18} />{submitting ? 'Mapping...' : 'Map My Reasoning'}
              </button>
            </form>
          </section>

          <div
            className="main-resizer-bar"
            onMouseDown={startMainResize}
            onTouchStart={startMainResize}
            title="Drag to resize layout"
          />

          <section className="panel result-panel" style={{ width: `calc(${100 - mainSplitWidth}% - 4px)`, flexShrink: 0 }}>
            <div className="section-title">
              <Sparkles size={20} />
              <h2>AI Mentor Output</h2>
            </div>
            {!activeResult ? <EmptyResult /> : <ChallengeWorkspace result={activeResult} scenario={selected} />}
          </section>
        </div>

        <section className="dashboard">
          <div className="panel">
            <div className="section-title"><ChartNoAxesCombined size={20} /><h2>Learner Analytics</h2></div>
            <Analytics analytics={analytics} />
          </div>
          <div className="panel">
            <div className="section-title"><Route size={20} /><h2>Roadmap</h2></div>
            <Roadmap roadmap={roadmap} />
          </div>
          <div className="panel">
            <div className="section-title"><MessageSquareText size={20} /><h2>Recent Sessions</h2></div>
            <SessionList sessions={sessions} />
          </div>
        </section>
      </section>
    </main>
  );
}

function Analytics({ analytics }) {
  const concepts = Object.entries(analytics?.conceptCounts || {});
  return (
    <div className="analytics-list">
      {concepts.length ? concepts.map(([name, count]) => (
        <div key={name}>
          <span>{name}</span>
          <meter min="0" max="10" value={count}></meter>
          <strong>{count}</strong>
        </div>
      )) : <p>No learning sessions yet.</p>}
    </div>
  );
}

function Roadmap({ roadmap }) {
  return (
    <div className="roadmap">
      {roadmap.map((phase) => (
        <article key={phase.phase}>
          <strong>{phase.phase}</strong>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <small>{phase.items.join(' / ')}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function SessionList({ sessions }) {
  return (
    <div className="sessions">
      {sessions.length ? sessions.slice(0, 6).map((session) => (
        <article key={session._id}>
          <Play size={16} />
          <div>
            <strong>{session.scenario?.title}</strong>
            <span>{session.masterySignals.join(' / ')}</span>
          </div>
        </article>
      )) : <p>No sessions yet.</p>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
