import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  Brain,
  ChartNoAxesCombined,
  Code2,
  Compass,
  GitBranch,
  Lightbulb,
  MessageSquareText,
  Play,
  Route,
  Search,
  Send,
  Sparkles,
  TriangleAlert
} from 'lucide-react';
import './styles.css';

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
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Brain size={30} />
          <div>
            <strong>PyBe</strong>
            <span>Scenario-first Python</span>
          </div>
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
              className={[
                'scenario',
                selected?._id === scenario._id ? 'active' : '',
                `difficulty-${scenario.difficulty.toLowerCase()}`
              ].filter(Boolean).join(' ')}
              onClick={() => {
                setSelected(scenario);
                setActiveResult(null);
              }}
            >
              <span className="scenario-difficulty">{scenario.difficulty}</span>
              <strong className="scenario-title">{scenario.title}</strong>
              <div className="scenario-concepts">
                {scenario.concepts.map((concept) => (
                  <span key={concept} className="scenario-pill">{concept}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="workspace">
        <header className="hero">
          <div className="hero-text">
            <p className="hero-eyebrow"><Sparkles size={13} /><span>AI-native learning journey</span></p>
            <h1>Learn Python by reasoning through real situations first.</h1>
            <p className="hero-sub">Pick a scenario, explain your thinking, and let PyBe map it to Python concepts.</p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{analytics?.scenarioCount || 0}</strong>
              <small>Scenarios</small>
            </div>
            <div className="hero-stat">
              <strong>{analytics?.sessionCount || 0}</strong>
              <small>Sessions</small>
            </div>
            <div className="hero-stat">
              <strong>{analytics?.averagePromptScore || 0}</strong>
              <small>Avg&nbsp;prompt score</small>
            </div>
          </div>
        </header>

        <div className="main-grid">
          <section className="panel learning-panel">
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

          <section className="panel result-panel">
            <div className="section-title">
              <Sparkles size={20} />
              <h2>AI Mentor Output</h2>
            </div>
            {submitting ? <ResultSkeleton /> : !activeResult ? <EmptyResult /> : <Result result={activeResult} />}
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

function EmptyResult() {
  return (
    <div className="empty">
      <div className="empty-icon-wrap">
        <Lightbulb size={32} />
      </div>
      <p className="empty-title">Your AI Mentor is ready</p>
      <p className="empty-sub">Submit your reasoning above to receive a full abstraction mapping, generated Python code, prompt feedback, and misconception signals.</p>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="result-stack skeleton-wrap">
      <div className="skeleton skeleton-score" />
      <div className="mentor-section">
        <div className="skeleton skeleton-line" style={{ width: '40%', marginBottom: 10 }} />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" style={{ width: '75%' }} />
      </div>
      <div className="skeleton skeleton-code" />
      <div className="mentor-section">
        <div className="skeleton skeleton-line" style={{ width: '35%', marginBottom: 10 }} />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" style={{ width: '80%' }} />
      </div>
    </div>
  );
}

function Result({ result }) {
  return (
    <div className="result-stack">

      {/* ── Prompt Score ───────────────────────── */}
      <div className="mentor-section score-section">
        <div className="mentor-section-header">
          <Sparkles size={14} />
          <span>Prompt Score</span>
        </div>
        <div className="score">
          <div className="score-ring">
            <span className="score-number">{(result.promptScore / 10).toFixed(1)}</span>
            <small className="score-denom">/10</small>
          </div>
          <small className="score-label">Prompt maturity</small>
        </div>
      </div>

      {/* ── Python Mapping ─────────────────────── */}
      <div className="mentor-section">
        <div className="mentor-section-header">
          <GitBranch size={14} />
          <span>Python Mapping</span>
        </div>
        <div className="mapping-list">
          {result.abstractionMap.map((item) => (
            <article className="mapping" key={item.pattern}>
              <div className="mapping-top">
                <strong className="mapping-pattern">{item.pattern}</strong>
                <span className="mapping-concept">{item.pythonConcept}</span>
              </div>
              <p className="mapping-explanation">{item.explanation}</p>
            </article>
          ))}
        </div>
      </div>

      {/* ── Generated Python ───────────────────── */}
      <div className="mentor-section">
        <div className="mentor-section-header">
          <Code2 size={14} />
          <span>Generated Python</span>
        </div>
        <div className="code-block">
          <pre>{result.generatedCode}</pre>
          <p className="code-explanation">{result.codeExplanation}</p>
        </div>
      </div>

      {/* ── Prompt Feedback ────────────────────── */}
      <div className="mentor-section">
        <div className="mentor-section-header">
          <MessageSquareText size={14} />
          <span>Prompt Feedback</span>
        </div>
        <ul className="feedback">
          {result.promptFeedback.map((item) => (
            <li key={item} className="feedback-item">
              <ArrowRight size={13} className="feedback-icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Next Steps / Misconceptions ────────── */}
      {result.misconceptions.length > 0 && (
        <div className="mentor-section">
          <div className="mentor-section-header mentor-section-header--warn">
            <TriangleAlert size={14} />
            <span>Next Steps &amp; Misconception Watch</span>
          </div>
          <div className="note">
            {result.misconceptions.map((item) => (
              <p key={item} className="note-item">{item}</p>
            ))}
          </div>
        </div>
      )}

    </div>
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
