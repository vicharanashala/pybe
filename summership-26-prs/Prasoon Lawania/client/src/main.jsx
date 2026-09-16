import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain,
  ChartNoAxesCombined,
  Code2,
  Compass,
  GraduationCap,
  Lightbulb,
  MessageSquareText,
  Play,
  Route,
  Search,
  Send,
  Sparkles,
  Gamepad2,
  Palette,
  Rocket
} from 'lucide-react';
import { BrowserRouter, Routes, Route as RRoute, NavLink } from 'react-router-dom';
import './styles.css';
import LearningPage from './learning/LearningPage.jsx';
import PythonPetPage from './pet/PythonPetPage.jsx';
import PixelArtPage from './pixel/PixelArtPage.jsx';
import CodeInvadersPage from './invaders/CodeInvadersPage.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
//  ORIGINAL PYBE APP 
// ─────────────────────────────────────────────────────────────────────────────
function OriginalApp() {
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
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  const concepts = useMemo(
    () => [...new Set(scenarios.flatMap((s) => s.concepts || []))].sort(),
    [scenarios]
  );

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
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
    setSelected((cur) => cur || scenarioData[0] || null);
    setLoading(false);
  }

  useEffect(() => { refresh().catch(console.error); }, [filters.q, filters.difficulty, filters.concept]);

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
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            placeholder="Search scenarios"
          />
        </label>

        <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
          <option value="">All levels</option>
          <option>Beginner</option>
          <option>Explorer</option>
          <option>Builder</option>
        </select>

        <select value={filters.concept} onChange={(e) => setFilters({ ...filters, concept: e.target.value })}>
          <option value="">All concepts</option>
          {concepts.map((c) => <option key={c}>{c}</option>)}
        </select>

        <div className="scenario-list">
          {scenarios.map((scenario) => (
            <button
              key={scenario._id}
              className={selected?._id === scenario._id ? 'scenario active' : 'scenario'}
              onClick={() => { setSelected(scenario); setActiveResult(null); }}
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
            <div className="section-title"><Compass size={20} /><h2>{selected?.title}</h2></div>
            <p className="context">{selected?.context}</p>
            <div className="objective-row">
              {selected?.objectives.map((item) => <span key={item}>{item}</span>)}
            </div>
            <form onSubmit={submitSession} className="learning-form">
              <label>
                Your reasoning
                <textarea required value={form.reasoning} onChange={(e) => setForm({ ...form, reasoning: e.target.value })} placeholder={selected?.prompt} />
              </label>
              <label>
                Prompt you would give an AI mentor
                <textarea value={form.promptText} onChange={(e) => setForm({ ...form, promptText: e.target.value })} placeholder="Explain my approach step by step, then show the Python concept and code..." />
              </label>
              <label>
                Reflection
                <textarea value={form.reflection} onChange={(e) => setForm({ ...form, reflection: e.target.value })} placeholder="What did you notice about your thinking?" />
              </label>
              <button className="primary" disabled={submitting}>
                <Send size={18} />{submitting ? 'Mapping...' : 'Map My Reasoning'}
              </button>
            </form>
          </section>

          <section className="panel result-panel">
            <div className="section-title"><Sparkles size={20} /><h2>AI Mentor Output</h2></div>
            {!activeResult ? <EmptyResult /> : (
              <Result
                result={activeResult}
                pyodide={pyodide}
                setPyodide={setPyodide}
                pyodideLoading={pyodideLoading}
                setPyodideLoading={setPyodideLoading}
              />
            )}
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
      <Lightbulb size={38} />
      <p>Submit reasoning to see abstraction mapping, Python code, prompt feedback, and misconception signals.</p>
    </div>
  );
}

function Result({ result, pyodide, setPyodide, pyodideLoading, setPyodideLoading }) {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);

  const runCode = async () => {
    let currentPyodide = pyodide;
    
    if (!currentPyodide) {
      setPyodideLoading(true);
      try {
        if (!window.loadPyodide) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = '/pyodide/pyodide.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Pyodide.'));
            document.head.appendChild(script);
          });
        }
        currentPyodide = await window.loadPyodide({ indexURL: '/pyodide/' });
        setPyodide(currentPyodide);
      } catch (err) {
        setOutput(`Error loading Python: ${err.message}`);
        setPyodideLoading(false);
        return;
      }
      setPyodideLoading(false);
    }

    setRunning(true);
    setOutput(null);

    try {
      const stubs = `
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

_coins = [5, 10, 2, 3]
_coin_idx = 0
def get_coin_inserted():
    global _coin_idx
    val = _coins[_coin_idx % len(_coins)]
    _coin_idx += 1
    return val

correct_pin = 1234
_pins = [9999, 0000, 1234, 1234]
_pin_idx = 0
def ask_for_pin():
    global _pin_idx
    val = _pins[_pin_idx % len(_pins)]
    _pin_idx += 1
    return val
`;
      await currentPyodide.runPythonAsync(stubs + '\n' + result.generatedCode);
      const stdout = currentPyodide.runPython('sys.stdout.getvalue()');
      const stderr = currentPyodide.runPython('sys.stderr.getvalue()');
      
      let res = '';
      if (stdout) res += stdout;
      if (stderr) res += `\nError:\n${stderr}`;
      setOutput(res || '(Execution completed with no output)');
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

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
        
        {/* Run Code Action */}
        <div style={{ marginTop: '1rem', borderTop: '1px solid #253d37', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pyodideLoading && <div style={{ color: '#b9c7bf', fontSize: '0.82rem' }}>⚡ Initializing local Python engine...</div>}
          {!pyodideLoading && (
            <button
              onClick={runCode}
              disabled={running}
              style={{
                background: running ? 'transparent' : '#d8f07c',
                color: running ? '#b9c7bf' : '#17201d',
                border: '1px solid #d8f07c',
                borderRadius: 8,
                padding: '0.5rem 1rem',
                fontWeight: 700,
                cursor: running ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                alignSelf: 'flex-start',
                fontSize: '0.82rem',
                transition: 'all .15s ease'
              }}
            >
              ▶ {running ? 'Running...' : 'Run Code'}
            </button>
          )}

          {output !== null && (
            <div style={{
              background: '#111916',
              border: '1px solid #253d37',
              borderRadius: 8,
              padding: '0.8rem 1rem',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              color: output.startsWith('Error') ? '#f87171' : '#d8f07c',
              whiteSpace: 'pre-wrap',
              animation: 'csFadeIn .2s ease-out'
            }}>
              <div style={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem', color: output.startsWith('Error') ? '#f87171' : '#4ade80' }}>
                {output.startsWith('Error') ? '✕ Execution Error' : '✓ Execution Output'}
              </div>
              <div>{output}</div>
            </div>
          )}
        </div>
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

function Analytics({ analytics }) {
  const concepts = Object.entries(analytics?.conceptCounts || {});
  return (
    <div className="analytics-list">
      {concepts.length
        ? concepts.map(([name, count]) => (
          <div key={name}>
            <span>{name}</span>
            <meter min="0" max="10" value={count}></meter>
            <strong>{count}</strong>
          </div>
        ))
        : <p>No learning sessions yet.</p>}
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
      {sessions.length
        ? sessions.slice(0, 6).map((session) => (
          <article key={session._id}>
            <Play size={16} />
            <div>
              <strong>{session.scenario?.title}</strong>
              <span>{session.masterySignals.join(' / ')}</span>
            </div>
          </article>
        ))
        : <p>No sessions yet.</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROOT BrowserRouter with routes
// ─────────────────────────────────────────────────────────────────────────────
const navLinkStyle = ({ isActive }) => ({
  background: 'none', border: 'none', padding: '0.8rem 1.5rem',
  color: isActive ? '#00f3ff' : '#b9c7bf',
  fontWeight: isActive ? 700 : 400,
  fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
  borderBottom: isActive ? '2px solid #00f3ff' : '2px solid transparent',
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  transition: 'color .2s ease', textDecoration: 'none',
});

function Root() {
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 0, background: '#0d1318', borderBottom: '1px solid #1c2730', position: 'sticky', top: 0, zIndex: 100 }}>
        <NavLink to="/" end style={navLinkStyle}>
          <Brain size={16} /> Scenario Explorer
        </NavLink>
        <NavLink to="/learn" style={navLinkStyle}>
          <GraduationCap size={16} /> Case Study Learning
        </NavLink>
        <NavLink to="/pet" style={navLinkStyle}>
          <Gamepad2 size={16} /> Python Pet
        </NavLink>
        <NavLink to="/pixel" style={navLinkStyle}>
          <Palette size={16} /> Pixel Art
        </NavLink>
        <NavLink to="/invaders" style={navLinkStyle}>
          <Rocket size={16} /> Code Invaders
        </NavLink>
      </nav>

      <Routes>
        <RRoute path="/" element={<OriginalApp />} />
        <RRoute path="/learn" element={<LearningPage />} />
        <RRoute path="/pet" element={<PythonPetPage />} />
        <RRoute path="/pixel" element={<PixelArtPage />} />
        <RRoute path="/invaders" element={<CodeInvadersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
