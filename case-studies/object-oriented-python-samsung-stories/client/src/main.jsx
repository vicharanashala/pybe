import CaseStudy from './CaseStudy.jsx';
import '../../../../shared/story-elements.css';
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain,
  ChartNoAxesCombined,
  Code2,
  Compass,
  FileText,
  Lightbulb,
  MessageSquareText,
  Play,
  Route,
  Search,
  Send,
  Sparkles
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
  const [caseStudies, setCaseStudies] = useState([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [currentView, setCurrentView] = useState('pybe');

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((scenario) => scenario.concepts || []))].sort(), [scenarios]);

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    const [scenarioData, sessionData, analyticsData, roadmapData, caseStudiesData] = await Promise.all([
      api(`/scenarios?${params}`),
      api('/sessions'),
      api('/analytics'),
      api('/roadmap'),
      api('/case-studies')
    ]);
    setScenarios(scenarioData);
    setSessions(sessionData);
    setAnalytics(analyticsData);
    setRoadmap(roadmapData);
    setCaseStudies(caseStudiesData);
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
      {selectedCaseStudy && <CaseStudy study={selectedCaseStudy} onClose={() => setSelectedCaseStudy(null)} />}
      <aside className="sidebar">
        <div className="brand">
          <Brain size={30} />
          <div>
            <strong>PyBe</strong>
            <span>Scenario-first Python</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={currentView === 'pybe' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('pybe')}
          >
            <Play size={18} />
            <span>PyBe</span>
          </button>
          <button 
            className={currentView === 'case-studies' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setCurrentView('case-studies')}
          >
            <FileText size={18} />
            <span>Case Study</span>
          </button>
        </nav>

        {currentView === 'pybe' && (
          <>
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
          </>
        )}
      </aside>

      <section className="workspace">
        {currentView === 'pybe' ? (
          <>
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
                <div className="section-title"><Route size={20} /><h2>Roadmap</h2></div>
                <Roadmap roadmap={roadmap} />
              </div>
              <div className="panel">
                <div className="section-title"><MessageSquareText size={20} /><h2>Recent Sessions</h2></div>
                <SessionList sessions={sessions} />
              </div>
            </section>
          </>
        ) : (
          <CaseStudiesPage caseStudies={caseStudies} onSelectStudy={setSelectedCaseStudy} />
        )}
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

function CaseStudiesPage({ caseStudies, onSelectStudy }) {
  return (
    <div className="case-studies-page">
      <header className="hero">
        <div>
          <p>Real-world learning</p>
          <h1>Case Studies</h1>
        </div>
      </header>
      
      <div className="case-studies-grid">
        {caseStudies.length > 0 ? caseStudies.map((study) => (
          <div 
            key={study.id} 
            className="panel case-study-card"
            onClick={() => onSelectStudy(study)}
          >
            <span className="case-study-badge">{study.concept}</span>
            <h3>{study.title}</h3>
            <p>{study.problemStatement}</p>
            <div className="card-footer">
              <span>Read full story</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        )        ) : (
          <div className="panel case-study-card">
            <p>Loading case studies...</p>
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
