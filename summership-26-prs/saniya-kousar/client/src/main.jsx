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
  Sparkles,
  Rocket,
  Target,
  BookOpen,
  Zap
} from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import LearningPath from './components/LearningPath';
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
  const [learningPath, setLearningPath] = useState(null);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '' });
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [activeTab, setActiveTab] = useState('learn');
  const [nlpResult, setNlpResult] = useState(null);

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((scenario) => scenario.concepts || []))].sort(), [scenarios]);

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    try {
      const [scenarioData, sessionData, analyticsData, roadmapData, pathData] = await Promise.all([
        api(`/scenarios?${params}`),
        api('/sessions'),
        api('/analytics'),
        api('/roadmap'),
        api('/learning-path').catch(() => null) // Changed from /analytics/learning-path
      ]);
      setScenarios(scenarioData);
      setSessions(sessionData);
      setAnalytics(analyticsData);
      setRoadmap(roadmapData);
      setLearningPath(pathData);
      setSelected((current) => current || scenarioData[0] || null);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [filters.q, filters.difficulty, filters.concept]);

  // EXISTING: Submit learning session (uses /sessions)
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

  const handleScenarioSelect = (scenario) => {
    setSelected(scenario);
    setActiveResult(null);
    setNlpResult(null);
    // Generate initial code
    const initialCode = `# Scenario: ${scenario.title}\n# Difficulty: ${scenario.difficulty}\n# Concepts: ${scenario.concepts?.join(', ') || 'N/A'}\n\ndef solve():\n    # TODO: Implement your solution here\n    pass\n\n# Call your function\nsolver = solve()`;
    setCurrentCode(initialCode);
  };

  const handleCodeSave = async (code) => {
    try {
      const response = await api('/sessions/save-code', {
        method: 'POST',
        body: JSON.stringify({ code, scenarioId: selected?._id })
      });
      alert('✅ Code saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Failed to save code');
    }
  };

  // NEW: NLP - Convert reasoning to Python code (uses /nlp)
  const handleConvertReasoning = async () => {
    if (!form.reasoning.trim()) {
      alert('Please enter your reasoning first');
      return;
    }
    
    try {
      const result = await api('/nlp/convert-reasoning', {
        method: 'POST',
        body: JSON.stringify({ 
          reasoning: form.reasoning, 
          scenarioId: selected?._id 
        })
      });
      
      if (result.success) {
        setNlpResult(result);
        setCurrentCode(result.pythonCode);
        setShowCodeEditor(true);
        setActiveTab('code');
        
        if (activeResult) {
          setActiveResult({
            ...activeResult,
            generatedCode: result.pythonCode,
            codeExplanation: result.explanation
          });
        }
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert reasoning to code');
    }
  };

  // NEW: NLP - Extract concepts from reasoning
  const handleExtractConcepts = async () => {
    if (!form.reasoning.trim()) {
      alert('Please enter your reasoning first');
      return;
    }
    
    try {
      const result = await api('/nlp/extract-concepts', {
        method: 'POST',
        body: JSON.stringify({ 
          reasoning: form.reasoning
        })
      });
      
      if (result.success) {
        alert(`📚 Detected Concepts:\n${result.concepts.join('\n')}`);
      }
    } catch (error) {
      console.error('Extract concepts error:', error);
      alert('Failed to extract concepts');
    }
  };

  // NEW: NLP - Validate code
  const handleValidateCode = async (code) => {
    try {
      const result = await api('/nlp/validate-code', {
        method: 'POST',
        body: JSON.stringify({ code })
      });
      
      if (result.success) {
        alert('✅ Code is valid!');
      } else {
        alert(`❌ Validation errors:\n${result.errors.join('\n')}`);
      }
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      return { success: false, errors: ['Validation failed'] };
    }
  };

  // NEW: NLP - Generate code with context
  const handleGenerateCodeWithContext = async () => {
    if (!form.reasoning.trim()) {
      alert('Please enter your reasoning first');
      return;
    }
    
    try {
      const context = selected?.context || '';
      const result = await api('/nlp/generate-code', {
        method: 'POST',
        body: JSON.stringify({ 
          reasoning: form.reasoning,
          scenarioId: selected?._id,
          context: context
        })
      });
      
      if (result.success) {
        setNlpResult(result);
        setCurrentCode(result.pythonCode);
        setShowCodeEditor(true);
        setActiveTab('code');
      }
    } catch (error) {
      console.error('Generate code error:', error);
      alert('Failed to generate code with context');
    }
  };

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

        <div className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn')}
          >
            <BookOpen size={16} /> Learn
          </button>
          <button 
            className={`nav-btn ${activeTab === 'path' ? 'active' : ''}`}
            onClick={() => setActiveTab('path')}
          >
            <Rocket size={16} /> Learning Path
          </button>
          <button 
            className={`nav-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <Code2 size={16} /> Code Editor
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
              onClick={() => handleScenarioSelect(scenario)}
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

        {activeTab === 'learn' && (
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
              
              {/* NLP Actions */}
              <div className="nlp-actions">
                <button 
                  className="btn-convert-code"
                  onClick={handleConvertReasoning}
                  disabled={!form.reasoning.trim()}
                >
                  <Zap size={16} /> Generate Python Code
                </button>
                <button 
                  className="btn-extract-concepts"
                  onClick={handleExtractConcepts}
                  disabled={!form.reasoning.trim()}
                >
                  <Target size={16} /> Extract Concepts
                </button>
                <button 
                  className="btn-generate-context"
                  onClick={handleGenerateCodeWithContext}
                  disabled={!form.reasoning.trim()}
                >
                  <Sparkles size={16} /> Generate with Context
                </button>
              </div>
              
              {/* Learning Form - Uses /sessions */}
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

              {/* NLP Result Display */}
              {nlpResult && (
                <div className="nlp-result">
                  <h4>🤖 NLP Analysis</h4>
                  <div className="nlp-details">
                    <p><strong>Detected Concepts:</strong> {nlpResult.concepts?.join(', ') || 'None'}</p>
                    <p><strong>Explanation:</strong> {nlpResult.explanation}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="panel result-panel">
              <div className="section-title">
                <Sparkles size={20} />
                <h2>AI Mentor Output</h2>
              </div>
              {!activeResult ? <EmptyResult /> : <Result result={activeResult} />}
            </section>
          </div>
        )}

       // In main.jsx, update the Learning Path tab section

{activeTab === 'path' && (
  <div className="learning-path-container">
    <LearningPath 
      onScenarioSelect={handleScenarioSelect}
      key={selected?._id} // Add key to force re-render
    />
  </div>
)}
        {activeTab === 'code' && (
          <div className="code-editor-container">
            <div className="panel">
              <div className="section-title">
                <Code2 size={20} />
                <h2>Python Code Editor</h2>
                <div className="editor-actions-right">
                  <button 
                    className="btn-validate-code"
                    onClick={() => handleValidateCode(currentCode)}
                  >
                    ✅ Validate
                  </button>
                  <button 
                    className="btn-close-editor"
                    onClick={() => setActiveTab('learn')}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              <CodeEditor
                initialCode={currentCode || '# Write your Python code here'}
                onSave={handleCodeSave}
                onCodeChange={setCurrentCode}
                scenarioId={selected?._id}
              />
            </div>
          </div>
        )}

        {/* Dashboard Section - Always Visible */}
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
            <span>{session.masterySignals?.join(' / ') || 'In progress'}</span>
          </div>
        </article>
      )) : <p>No sessions yet.</p>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);