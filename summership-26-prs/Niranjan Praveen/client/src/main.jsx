import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain,
  ChartNoAxesCombined,
  Code2,
  Compass,
  Lightbulb,
  Lock,
  MessageSquareText,
  Play,
  Route,
  Search,
  Send,
  Sparkles,
  Target,
  Trophy
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
  const [mastery, setMastery] = useState(null);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '' });
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((scenario) => scenario.concepts || []))].sort(), [scenarios]);

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    const [scenarioData, sessionData, analyticsData, roadmapData, masteryData] = await Promise.all([
      api(`/scenarios?${params}`),
      api('/sessions'),
      api('/analytics'),
      api('/roadmap'),
      api('/mastery')
    ]);
    setScenarios(scenarioData);
    setSessions(sessionData);
    setAnalytics(analyticsData);
    setRoadmap(roadmapData);
    setMastery(masteryData);
    const unlocked = new Set((masteryData?.levels || []).filter((level) => level.unlocked).map((level) => level.level));
    setSelected((current) => current || scenarioData.find((scenario) => unlocked.has(scenario.difficulty)) || scenarioData[0] || null);
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
          {scenarios.map((scenario) => {
            const locked = mastery && !mastery.levels.find((level) => level.level === scenario.difficulty)?.unlocked;
            return (
              <button
                key={scenario._id}
                disabled={locked}
                className={locked ? 'scenario locked' : selected?._id === scenario._id ? 'scenario active' : 'scenario'}
                title={locked ? `Locked: reach mastery in the previous stage to unlock ${scenario.difficulty}` : undefined}
                onClick={() => {
                  setSelected(scenario);
                  setActiveResult(null);
                }}
              >
                <span>{locked ? <><Lock size={11} /> {scenario.difficulty}</> : scenario.difficulty}</span>
                <strong>{scenario.title}</strong>
                <small>{scenario.concepts.join(' / ')}</small>
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

        <section className="panel mastery-panel">
          <div className="section-title"><Trophy size={20} /><h2>Mastery Journey</h2></div>
          <MasteryJourney
            mastery={mastery}
            onPick={(scenarioId) => {
              const scenario = scenarios.find((item) => item._id === scenarioId);
              if (scenario) {
                setSelected(scenario);
                setActiveResult(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        </section>

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

function MasteryJourney({ mastery, onPick }) {
  if (!mastery) return <p>Complete a session to start your mastery journey.</p>;

  return (
    <div className="mastery-grid">
      <div className="mastery-levels">
        {mastery.levels.map((level) => (
          <article key={level.level} className={level.unlocked ? 'stage unlocked' : 'stage'}>
            <header>
              {level.unlocked ? <Trophy size={16} /> : <Lock size={16} />}
              <strong>{level.level}</strong>
            </header>
            <span className="stage-name">{level.stage}</span>
            <p>{level.piaget}</p>
            <div className="stage-progress">
              <meter min="0" max="100" value={level.coverage}></meter>
              <small>
                {level.unlocked
                  ? `${level.coverage}% concepts mastered · ${level.sessionsCompleted} session${level.sessionsCompleted === 1 ? '' : 's'}`
                  : `Locked — master ${Math.round(mastery.threshold)}+ in half of the previous stage's concepts (${mastery.minSessionsToAdvance}+ sessions)`}
              </small>
            </div>
          </article>
        ))}
      </div>

      <div className="mastery-concepts">
        <h3>Concept mastery</h3>
        {mastery.concepts.length ? mastery.concepts.map((item) => (
          <div key={item.concept} className="concept-row">
            <span>{item.concept}</span>
            <meter min="0" max="100" low={mastery.threshold / 2} high={mastery.threshold} optimum={100} value={item.mastery}></meter>
            <strong>{item.mastery}</strong>
            <small>{item.status}</small>
          </div>
        )) : <p>No concepts practiced yet — your first session begins the map.</p>}
      </div>

      <div className="mastery-recommend">
        <h3><Target size={16} /> Recommended next</h3>
        {mastery.recommendations.length ? mastery.recommendations.map((item) => (
          <article key={item.scenarioId}>
            <div>
              <strong>{item.title}</strong>
              <span>{item.difficulty} · {item.concepts.join(' / ')}</span>
              <small>{item.reason}</small>
            </div>
            <button className="primary" onClick={() => onPick(item.scenarioId)}>Start</button>
          </article>
        )) : <p>All unlocked scenarios attempted — advance a stage to keep growing.</p>}
      </div>
    </div>
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
