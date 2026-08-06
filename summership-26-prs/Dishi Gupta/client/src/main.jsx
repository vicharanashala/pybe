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
  Route,
  Search,
  Send,
  Sparkles
} from 'lucide-react';
import { DictationButton } from './DictationButton';
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
  const [movingNext, setMovingNext] = useState(false);

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

  async function goToNextCaseFile() {
    if (!selected?.nextScenarioId) return;
    setMovingNext(true);
    try {
      const nextScenario = await api(`/scenarios/${selected.nextScenarioId}`);
      setSelected(nextScenario);
      setActiveResult(null);
      setForm((current) => ({ ...current, reasoning: '', promptText: '', reflection: '' }));
    } catch (error) {
      console.error('Could not open the next case file', error);
      alert('Could not open the next case file. Please try again.');
    } finally {
      setMovingNext(false);
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
          <option>Advanced</option>
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
            <ScenarioEvidence scenario={selected} />
            <form onSubmit={submitSession} className="learning-form">
              <label>
                <span className="field-label">
                  Your reasoning
                  <DictationButton
                    value={form.reasoning}
                    onChange={(text) => setForm((current) => ({ ...current, reasoning: text }))}
                  />
                </span>
                <textarea
                  required
                  value={form.reasoning}
                  onChange={(event) => setForm({ ...form, reasoning: event.target.value })}
                  placeholder={selected?.prompt}
                />
              </label>
              <label>
                <span className="field-label">
                  Prompt you would give an AI mentor
                  <DictationButton
                    value={form.promptText}
                    onChange={(text) => setForm((current) => ({ ...current, promptText: text }))}
                  />
                </span>
                <textarea
                  value={form.promptText}
                  onChange={(event) => setForm({ ...form, promptText: event.target.value })}
                  placeholder="Explain my approach step by step, then show the Python concept and code..."
                />
              </label>
              <label>
                <span className="field-label">
                  Reflection
                  <DictationButton
                    value={form.reflection}
                    onChange={(text) => setForm((current) => ({ ...current, reflection: text }))}
                  />
                </span>
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
            {activeResult && <ModelAnswer key={selected?._id} scenario={selected} />}
            {activeResult && <CaseFlow scenario={selected} movingNext={movingNext} onNext={goToNextCaseFile} />}
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

function ModelAnswer({ scenario }) {
  const [revealed, setRevealed] = useState(false);
  if (!scenario?.idealSolution) return null;

  return (
    <div className="model-answer">
      <button type="button" className="ghost" onClick={() => setRevealed((current) => !current)}>
        {revealed ? 'Hide model answer' : 'Show model answer'}
      </button>
      {revealed && (
        <div className="code-block">
          <div><Code2 size={18} /> Model answer (Python)</div>
          <pre>{scenario.idealSolution}</pre>
        </div>
      )}
    </div>
  );
}

function CaseFlow({ scenario, movingNext, onNext }) {
  if (!scenario) return null;

  if (scenario.nextScenarioId) {
    return (
      <div className="case-flow">
        <button type="button" className="primary" onClick={onNext} disabled={movingNext}>
          {movingNext ? 'Opening next file...' : 'Next Case File →'}
        </button>
      </div>
    );
  }

  return (
    <div className="case-flow case-solved">
      <strong>Case Solved</strong>
      <p>{scenario.reveal || 'The answer is locked in. Review the final clue and reflect on how you ruled out the wrong paths.'}</p>
    </div>
  );
}

function ScenarioEvidence({ scenario }) {
  if (!scenario?.caseData) return null;

  const { caseData } = scenario;

  return (
    <div className="case-file">
      {caseData.witnessStatements && (
        <section>
          <h3>Witness Statements</h3>
          <ul>
            {caseData.witnessStatements.map((statement) => <li key={statement}>{statement}</li>)}
          </ul>
        </section>
      )}

      {caseData.suspectClaims && (
        <section>
          <h3>Suspect Claims</h3>
          <ul>
            {caseData.suspectClaims.map((claim) => (
              <li key={claim.suspect}>
                <strong>{claim.suspect}:</strong> {claim.claim}
              </li>
            ))}
          </ul>
        </section>
      )}

      {caseData.comparisonSets && (
        <section>
          <h3>Set Comparison Notes</h3>
          <p><strong>Witnessed rooms:</strong> {(caseData.comparisonSets.witnessedRooms || []).join(', ')}</p>
          <p><strong>Claimed rooms:</strong> {(caseData.comparisonSets.claimedRooms || []).join(', ')}</p>
        </section>
      )}

      {caseData.grid && (
        <section>
          <h3>Case Grid</h3>
          <div className="case-grid">
            <div>
              <strong>Suspects</strong>
              <span>{(caseData.grid.suspects || []).join(' / ')}</span>
            </div>
            <div>
              <strong>Rooms</strong>
              <span>{(caseData.grid.rooms || []).join(' / ')}</span>
            </div>
            <div>
              <strong>Weapons</strong>
              <span>{(caseData.grid.weapons || []).join(' / ')}</span>
            </div>
            <div>
              <strong>Times</strong>
              <span>{(caseData.grid.times || []).join(' / ')}</span>
            </div>
          </div>
          {Array.isArray(caseData.clues) && (
            <ul>
              {caseData.clues.map((clue) => <li key={clue}>{clue}</li>)}
            </ul>
          )}
        </section>
      )}

      {scenario.starterCode && (
        <section className="starter-code">
          <div><Code2 size={18} /> Recursive starter code</div>
          <pre>{scenario.starterCode}</pre>
        </section>
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
