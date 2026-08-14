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
  Bug,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
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
  const completedBugChallenges = useMemo(() => new Set(sessions.filter(s => s.debugChallenge).map(s => s.debugChallenge._id)), [sessions]);
  const [analytics, setAnalytics] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '', debugConcept: '' });
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Debug states
  const [tab, setTab] = useState('scenarios');
  const [debugChallenges, setDebugChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [debugResult, setDebugResult] = useState(null);
  const [runningCode, setRunningCode] = useState(false);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((scenario) => scenario.concepts || []))].sort(), [scenarios]);
  const debugConcepts = useMemo(() => [...new Set(debugChallenges.flatMap((c) => c.concepts || []))].sort(), [debugChallenges]);

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    const [scenarioData, sessionData, analyticsData, roadmapData, debugData] = await Promise.all([
      api(`/scenarios?${params}`),
      api('/sessions'),
      api('/analytics'),
      api('/roadmap'),
      api('/debug')
    ]);
    setScenarios(scenarioData);
    setSessions(sessionData);
    setAnalytics(analyticsData);
    setRoadmap(roadmapData);
    setDebugChallenges(debugData);
    setSelected((current) => current || scenarioData[0] || null);
    setSelectedChallenge((current) => current || debugData[0] || null);
    setLoading(false);
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [filters.q, filters.difficulty, filters.concept]);

  useEffect(() => {
    if (selectedChallenge && tab.startsWith('debug')) {
      setUserCode(selectedChallenge.buggyCode);
      setDebugResult(null);
    }
  }, [selectedChallenge, tab]);

  useEffect(() => {
    if (selectedChallenge && tab.startsWith('debug')) {
      if (tab === 'debug-pro') {
        setChatMessages([{ role: 'ai', content: `I'm your AI programming assistant. How can I help you debug '${selectedChallenge.title}'?` }]);
      } else {
        setChatMessages([{ role: 'ai', content: `Hey Senior! I wrote this code for '${selectedChallenge.title}', but it's failing the verification tests. Can you review it and tell me what I did wrong conceptually?` }]);
      }
      setChatInput('');
    }
  }, [selectedChallenge, tab]);

  async function runCode() {
    if (!selectedChallenge || !userCode.trim()) return;
    setRunningCode(true);
    try {
      const result = await api(`/debug/${selectedChallenge._id}/run`, {
        method: 'POST',
        body: JSON.stringify({ code: userCode })
      });
      setDebugResult(result);
      if (result.success) {
        await refresh();
      }
    } catch (err) {
      console.error(err);
      setDebugResult({
        success: false,
        failedCase: {
          type: 'crash',
          error: 'An unexpected system error occurred while running your code.',
          rawError: err.message
        }
      });
    } finally {
      setRunningCode(false);
    }
  }

  async function sendChatMessage(e) {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChallenge) return;
    
    const userMessage = chatInput.trim();
    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await api(`/debug/${selectedChallenge._id}/chat`, {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
          code: userCode,
          history: newMessages,
          mode: tab === 'debug-pro' ? 'pro' : 'intermediate'
        })
      });
      
      setChatMessages([...newMessages, { role: 'ai', content: response.message }]);
      
      if (response.solved) {
        setUserCode(selectedChallenge.solutionCode);
        setDebugResult({
          success: true,
          expectedTranslation: selectedChallenge.expectedLogic,
          userTranslation: selectedChallenge.expectedLogic
        });
        await refresh();
      }
    } catch (err) {
      console.error(err);
      setChatMessages([...newMessages, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  }

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
    <main className={`app-shell ${tab.startsWith('debug') ? 'app-shell-dark' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <Brain size={30} />
          <div>
            <strong>PyBe</strong>
            <span>Scenario-first Python</span>
          </div>
        </div>

        <div className="tab-switch">
          <button 
            className={tab === 'scenarios' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setTab('scenarios')}
          >
            Scenarios
          </button>
          <button 
            className={tab === 'debug-int' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setTab('debug-int')}
          >
            Bug Hunter (Int.)
          </button>
          <button 
            className={tab === 'debug-pro' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setTab('debug-pro')}
          >
            Bug Hunter (Pro)
          </button>
        </div>

        {tab === 'scenarios' ? (
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
              {concepts.map((concept) => <option key={concept} value={concept}>{concept.charAt(0).toUpperCase() + concept.slice(1)}</option>)}
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
        ) : (
          <>
            <select value={filters.debugConcept} onChange={(event) => setFilters({ ...filters, debugConcept: event.target.value })}>
              <option value="">All topics</option>
              {debugConcepts.map((concept) => <option key={concept} value={concept}>{concept.charAt(0).toUpperCase() + concept.slice(1)}</option>)}
            </select>
            <div className="category-groups">
              {['Beginner', 'Explorer', 'Builder'].map((diff) => {
                const items = debugChallenges.filter((c) => c.difficulty === diff && (!filters.debugConcept || c.concepts?.includes(filters.debugConcept.toLowerCase())));
                if (items.length === 0) return null;
              return (
                <div key={diff} className="category-group">
                  <div className="category-group-header">
                    <span>{diff}</span>
                    <span className="count-badge">{items.length}</span>
                  </div>
                  <div className="scenario-list">
                    {items.map((challenge) => (
                      <button
                        key={challenge._id}
                        className={selectedChallenge?._id === challenge._id ? 'scenario active' : 'scenario'}
                        onClick={() => {
                          setSelectedChallenge(challenge);
                        }}
                      >
                        <strong>
                          {challenge.title}
                          {completedBugChallenges.has(challenge._id) && (
                            <CheckCircle2 size={16} className="text-success" style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'text-bottom' }} />
                          )}
                        </strong>
                        <small>{challenge.concepts.join(' / ')}</small>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            </div>
          </>
        )}
      </aside>

      <section className={`workspace ${tab.startsWith('debug') ? 'workspace-bughunter' : ''}`}>
        <header className="hero">
          <div>
            <p>AI-native learning journey</p>
            <h1>{tab === 'scenarios' ? 'Learn Python by reasoning through real situations first.' : 'Find and squash bugs to master Python syntax.'}</h1>
          </div>
          <div className="hero-stats">
            <span>{tab === 'scenarios' ? (analytics?.scenarioCount || 0) : debugChallenges.length}<small>{tab === 'scenarios' ? 'Scenarios' : 'Bug Challenges'}</small></span>
            <span>{analytics?.sessionCount || 0}<small>Sessions</small></span>
            <span>{analytics?.averagePromptScore || 0}<small>Prompt score</small></span>
          </div>
        </header>

        {tab === 'scenarios' ? (
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
        ) : (
          <BugHunterPanel 
            key={`${selectedChallenge?._id}-${tab}`}
            challenge={selectedChallenge}
            userCode={userCode}
            setUserCode={setUserCode}
            debugResult={debugResult}
            runningCode={runningCode}
            runCode={runCode}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isChatLoading={isChatLoading}
            sendChatMessage={sendChatMessage}
            mode={tab === 'debug-pro' ? 'pro' : 'intermediate'}
          />
        )}

        {tab === 'scenarios' && (
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
            <strong>{session.scenario ? session.scenario.title : (session.debugChallenge ? `Debug: ${session.debugChallenge.title}` : 'Solved Challenge')}</strong>
            <span>{session.masterySignals.join(' / ')}</span>
          </div>
        </article>
      )) : <p>No sessions yet.</p>}
    </div>
  );
}

function PseudocodeViewer({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  const highlight = (line) => {
    let escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const keywords = ['Set', 'Print', 'If', 'Else', 'Else if', 'For each', 'For every', 'Add', 'Subtract', 'Multiply', 'Divide', 'Return', 'Otherwise'];
    keywords.forEach(kw => {
      const regex = new RegExp(`^(\\s*)(${kw})\\b`, 'i');
      escaped = escaped.replace(regex, `$1<span class='pseudocode-kw'>$2</span>`);
    });
    escaped = escaped.replace(/"([^"]*)"/g, "<span class='pseudocode-str'>&quot;$1&quot;</span>");
    return <span dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  return (
    <div className="pseudocode-viewer">
      {lines.map((line, i) => (
        <div key={i} className="pseudocode-line">
          <span className="pseudocode-line-num">{i + 1}</span>
          <span className="pseudocode-line-content">{highlight(line)}</span>
        </div>
      ))}
    </div>
  );
}

function BugHunterPanel({ 
  challenge, 
  userCode, 
  setUserCode, 
  debugResult, 
  runningCode, 
  runCode,
  chatMessages,
  chatInput,
  setChatInput,
  isChatLoading,
  sendChatMessage,
  mode
}) {
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  
  const [viewMode, setViewMode] = useState('python');
  const [englishTranslation, setEnglishTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setViewMode('python');
    setEnglishTranslation('');
  }, [challenge]);

  // Clear translation cache when code changes so it re-translates the new code
  useEffect(() => {
    setEnglishTranslation('');
  }, [userCode]);

  useEffect(() => {
    if (mode === 'pro') {
      setViewMode('python');
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'intermediate' && viewMode === 'english' && !englishTranslation && !isTranslating) {
      setIsTranslating(true);
      api('/debug/translate', {
        method: 'POST',
        body: JSON.stringify({ code: userCode })
      })
      .then(data => {
        setEnglishTranslation(data.english);
        setIsTranslating(false);
      })
      .catch((err) => {
        console.error(err);
        setEnglishTranslation('Translation failed.');
        setIsTranslating(false);
      });
    }
  }, [viewMode, mode, englishTranslation, isTranslating, userCode]);

  if (!challenge) {
    return <div className="empty">No debugging challenges found.</div>;
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      const newValue = value.substring(0, selectionStart) + '    ' + value.substring(selectionEnd);
      setUserCode(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4;
      }, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      
      const beforeCursor = value.substring(0, selectionStart);
      const lines = beforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      
      const indentMatch = currentLine.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : '';
      
      if (currentLine.trim().endsWith(':')) {
        indent += '    ';
      }
      
      const afterCursor = value.substring(selectionEnd);
      const newValue = beforeCursor + '\n' + indent + afterCursor;
      setUserCode(newValue);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1 + indent.length;
      }, 0);
    }
  };

  const isResolved = debugResult?.success;
  const displaySolution = showSolution || isResolved;

  return (
    <div className="main-grid">
      <section className="panel learning-panel">
        <div className="section-title">
          <Bug size={20} />
          <h2>{challenge.title}</h2>
        </div>
        <p className="context">{challenge.context}</p>

        {challenge.hints && challenge.hints.length > 0 && (
          <div className="hints-container">
            {challenge.hints.slice(0, hintIndex).map((hint, i) => (
              <div key={i} className="hint-bubble slide-in">
                <strong>💡 Hint {i + 1}:</strong> {hint}
              </div>
            ))}
            {hintIndex < challenge.hints.length && !displaySolution && (
              <button 
                className="secondary hint-btn"
                onClick={() => setHintIndex(hintIndex + 1)}
              >
                Get Hint ({challenge.hints.length - hintIndex} remaining)
              </button>
            )}
          </div>
        )}
        
        {mode === 'intermediate' && (
          <div className="view-mode-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'python' ? 'active' : ''}`}
              onClick={() => setViewMode('python')}
            >
              <Code2 size={16} /> Python Code
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'english' ? 'active' : ''}`}
              onClick={() => setViewMode('english')}
            >
              <MessageSquareText size={16} /> Plain English
            </button>
          </div>
        )}

        {viewMode === 'python' ? (
          <div className="code-editor-container">
            <div className="editor-header">
              <div className="terminal-dots">
                <span className="dot close"></span>
                <span className="dot minimize"></span>
                <span className="dot expand"></span>
              </div>
              <span><Code2 size={16} /> solution.py</span>
            </div>
            <div className="editor-wrapper" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#1d1f21' }}>
              <Editor
                value={userCode}
                onValueChange={code => setUserCode(code)}
                highlight={code => Prism.highlight(code, Prism.languages.python, 'python')}
                padding={15}
                style={{
                  fontFamily: '"Fira Code", "Consolas", monospace',
                  fontSize: 14,
                  minHeight: '100%',
                }}
                className="code-editor"
                placeholder="# Write your Python code here..."
                disabled={runningCode || isResolved}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        ) : (
          <div className="english-translation-container" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', minHeight: '200px' }}>
            {isTranslating ? (
              <div className="chat-loading" style={{ margin: 'auto' }}><span></span><span></span><span></span></div>
            ) : (
              <PseudocodeViewer text={englishTranslation} />
            )}
          </div>
        )}

        <button 
          className="primary run-btn" 
          onClick={runCode} 
          disabled={runningCode || !userCode.trim() || viewMode === 'english'}
        >
          <Play size={18} /> {runningCode ? 'Running...' : 'Run & Verify Code'}
        </button>
      </section>

      <section className="panel result-panel">
        <div className="section-title">
          <Terminal size={20} />
          <h2>Execution Results</h2>
        </div>

        {!debugResult && !displaySolution && (
          <div className="empty">
            <Lightbulb size={38} />
            <p>Click "Run & Verify Code" to test your solution against the verification test cases.</p>
          </div>
        )}

        {debugResult && (
          <div className="debug-result-stack">
            {isResolved ? (
              <div className="debug-status success-box">
                <CheckCircle2 size={24} className="text-success" />
                <div>
                  <strong>Success! All test cases passed!</strong>
                  <p>Your code correctly solved the debugging challenge.</p>
                </div>
              </div>
            ) : (
              <div className="debug-status fail-box">
                <AlertTriangle size={24} className="text-warning" />
                <div>
                  <strong>Verification Failed!</strong>
                  {debugResult.failedCase?.type === 'crash' ? (
                    <p className="friendly-error">
                      The code has failed to run because of an error.
                    </p>
                  ) : (
                    <div className="friendly-error">
                      <p>Your code ran successfully, but produced incorrect results.</p>
                      <p><strong>Output:</strong> <code>{debugResult.failedCase?.actual || '(Empty Output)'}</code></p>
                      {debugResult.userTranslation && (
                        <div className="user-logic-explanation" style={{ marginTop: '8px', padding: '8px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                          <strong>What your code did:</strong>
                          <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>{debugResult.userTranslation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!isResolved && debugResult && !showSolution && (
          <div className="reveal-section">
            <button 
              className="secondary reveal-sol-btn"
              onClick={() => setShowSolution(true)}
            >
              Give Up & View Solution
            </button>
          </div>
        )}

        {displaySolution && (
          <div className="solution-stack slide-in">
            <div className="solution-section">
              <h3>Expected Solution Code</h3>
              <div className="code-block solution-code-block">
                <pre>{challenge.solutionCode}</pre>
              </div>
            </div>

            <div className="bug-explanation-card">
              <strong>Bug Explanation</strong>
              <p>{challenge.bugExplanation}</p>
            </div>

            <div className="logic-comparison-section">
              <h3>Logic Comparison</h3>
              <div className="logic-grid">
                <div className="logic-card expected-card">
                  <h4>Expected Logic</h4>
                  <pre>{debugResult ? debugResult.expectedTranslation : challenge.expectedLogic}</pre>
                </div>
                <div className="logic-card actual-card">
                  <h4>Your Code's Logic</h4>
                  <pre>{debugResult ? debugResult.userTranslation : '(Run your code to translate)'}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {challenge && (
          <div className="chat-container">
            <div className="chat-header">
              <MessageSquareText size={16} /> AI Assistant
            </div>
            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              {isChatLoading && (
                <div className="chat-bubble ai loading">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
            </div>
            <form className="chat-input-area" onSubmit={sendChatMessage}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask a question..."
                disabled={isChatLoading}
              />
              <button type="submit" disabled={!chatInput.trim() || isChatLoading} className="send-btn">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
