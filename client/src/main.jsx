import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain,
  ChartNoAxesCombined,
  Code2,
  Compass,
  Lightbulb,
  MessageSquareText,
  Play,
  Route as RouteIcon,
  Search,
  Send,
  Sparkles
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MinecraftList from './pages/MinecraftList/MinecraftList';

import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to perform API requests to the backend.
 * 
 * @param {string} path - The API endpoint path (e.g., '/scenarios').
 * @param {Object} [options] - Optional fetch configuration options (e.g., method, body).
 * @returns {Promise<any>} - A promise that resolves to the JSON response data.
 * @throws {Error} - Throws an error if the response is not OK, with the response text as the message.
 */
async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

/**
 * Main application component representing the AI-native learning journey dashboard.
 * Handles state for scenarios, sessions, analytics, and user interactions.
 * 
 * @returns {JSX.Element} The rendered PyBe Dashboard UI.
 */
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

  /**
   * Fetches the latest data from the backend to refresh the dashboard state.
   * Loads scenarios, sessions, analytics, and the roadmap concurrently.
   * Includes error handling to prevent infinite loading if the backend is unreachable.
   * 
   * @returns {Promise<void>} Resolves when the dashboard state has been updated.
   */
  async function refresh() {
    try {
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
    } catch (error) {
      console.error("Failed to load dashboard data. Is the backend running?", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [filters.q, filters.difficulty, filters.concept]);

  /**
   * Submits a new learning session to the backend for AI evaluation.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @returns {Promise<void>} Resolves when the submission is complete and the dashboard is refreshed.
   */
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

        <Link to="/minecraft-list" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: '#8b8b8b',
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '16px',
          fontFamily: '"VT323", "Courier New", Courier, monospace',
          textShadow: '2px 2px 0px #3a3a3a',
          border: '4px solid #1e1e1e',
          boxShadow: 'inset -4px -4px 0px 0px #5a5a5a, inset 4px 4px 0px 0px #b6b6b6, 0 6px 0px rgba(0,0,0,0.2)',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          marginBottom: '16px',
          cursor: 'pointer'
        }}>
          <Play size={18} fill="white" /> PLAY MINECRAFT LISTS
        </Link>

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
                setActiveResult(null);
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
            {!activeResult ? <EmptyResult /> : <Result result={activeResult} />}
          </section>
        </div>

        <section className="dashboard">
          <div className="panel">
            <div className="section-title"><ChartNoAxesCombined size={20} /><h2>Learner Analytics</h2></div>
            <Analytics analytics={analytics} />
          </div>
          <div className="panel">
            <div className="section-title"><RouteIcon size={20} /><h2>Roadmap</h2></div>
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

/**
 * Component to display a placeholder when no AI Mentor output is available.
 * 
 * @returns {JSX.Element} The empty state UI.
 */
function EmptyResult() {
  return (
    <div className="empty">
      <Lightbulb size={38} />
      <p>Submit reasoning to see abstraction mapping, Python code, prompt feedback, and misconception signals.</p>
    </div>
  );
}

/**
 * Component to render the detailed results from an AI Mentor evaluation.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.result - The AI evaluation result object containing scores, mappings, and feedback.
 * @returns {JSX.Element} The rendered mentor output UI.
 */
function Result({ result }) {
  return (
    <div className="result-stack">
      <div className="score"><span>{result.promptScore}</span><small>Prompt maturity</small></div>
      <div>
        {result.abstractionMap.map((item) => (
          <article className="mapping" key={item.pattern}>
            <strong>{item.pattern}</strong>
            <span>{item.pythonConcept}</span>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>
      <div className="code-block">
        <div><Code2 size={18} /> Generated Python</div>
        <pre>{result.generatedCode}</pre>
        <p>{result.codeExplanation}</p>
      </div>
      <ul className="feedback">
        {result.promptFeedback.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {result.misconceptions.length > 0 && (
        <div className="note">
          <strong>Misconception watch</strong>
          {result.misconceptions.map((item) => <p key={item}>{item}</p>)}
        </div>
      )}
    </div>
  );
}

/**
 * Component to visualize the learner's analytics and concept mastery.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.analytics - The analytics data object containing concept counts.
 * @returns {JSX.Element} The rendered analytics UI.
 */
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

/**
 * Component to display the learner's recommended learning roadmap.
 * 
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.roadmap - An array of roadmap phase objects.
 * @returns {JSX.Element} The rendered roadmap UI.
 */
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

/**
 * Component to display a list of the user's recent learning sessions.
 * 
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.sessions - An array of session objects.
 * @returns {JSX.Element} The rendered session list UI.
 */
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

/**
 * Root component responsible for providing client-side routing.
 * Manages navigation between the main AI dashboard and the DataVille modules.
 * 
 * @returns {JSX.Element} The BrowserRouter wrapping the application routes.
 */
function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/minecraft-list" element={<MinecraftList />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
