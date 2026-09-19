import React, { useEffect, useMemo, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  Bug,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  Cpu,
  Eye,
  HelpCircle,
  History,
  Layers,
  Lightbulb,
  MessageSquareText,
  Play,
  Pause,
  RefreshCw,
  Route,
  Search,
  Send,
  Sparkles,
  Terminal,
  Zap,
  Gauge,
  Sliders
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
  const [activeTab, setActiveTab] = useState('tracer'); // 'tracer' | 'scenario' | 'sandbox' | 'analytics'
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '' });

  // Scenario Journey Form
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '', learnerCode: '' });
  const [liveReview, setLiveReview] = useState(null);
  const [checking, setChecking] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // TraceLab State
  const [traceData, setTraceData] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [customCode, setCustomCode] = useState('');
  const [predictionState, setPredictionState] = useState(null); // { answered: bool, selectedIndex: number, result: obj }
  const [tracerStats, setTracerStats] = useState({ totalPredicted: 0, correctPredicted: 0 });
  const [loading, setLoading] = useState(true);
  const [traceLoading, setTraceLoading] = useState(false);

  const autoPlayTimerRef = useRef(null);

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((s) => s.concepts || []))].sort(), [scenarios]);

  async function refreshAll() {
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

      const target = selected || scenarioData[0] || null;
      if (target) {
        setSelected(target);
        loadTraceForScenario(target);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTraceForScenario(scenario, optionalCode) {
    if (!scenario) return;
    setTraceLoading(true);
    setIsPlaying(false);
    try {
      const data = await api('/tracer/trace', {
        method: 'POST',
        body: JSON.stringify({ scenarioId: scenario._id, code: optionalCode })
      });
      setTraceData(data);
      setCurrentStepIndex(0);
      setCustomCode(data.code);
      setPredictionState(null);
    } catch (err) {
      console.error('Trace loading error:', err);
    } finally {
      setTraceLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, [filters.q, filters.difficulty, filters.concept]);

  // Stepper Autoplay effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1500 / playbackSpeed);
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (!traceData || prev >= traceData.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          // If the next step has a checkpoint that hasn't been answered, pause for user
          const nextStep = traceData.steps[prev + 1];
          if (nextStep && nextStep.checkpoint && (!predictionState || !predictionState.answered)) {
            setIsPlaying(false);
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, playbackSpeed, traceData, predictionState]);

  // Handle Scenario Change
  function handleSelectScenario(scenario) {
    setSelected(scenario);
    setActiveResult(null);
    setLiveReview(null);
    loadTraceForScenario(scenario);
  }

  // Stepper Navigation
  function stepNext() {
    if (!traceData || currentStepIndex >= traceData.steps.length - 1) return;
    setCurrentStepIndex((prev) => prev + 1);
    setPredictionState(null);
  }

  function stepPrev() {
    if (currentStepIndex <= 0) return;
    setCurrentStepIndex((prev) => prev - 1);
    setPredictionState(null);
  }

  function resetTrace() {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setPredictionState(null);
  }

  async function submitPrediction(selectedIndex) {
    const currentStep = traceData?.steps[currentStepIndex];
    if (!currentStep?.checkpoint) return;

    try {
      const res = await api('/tracer/predict', {
        method: 'POST',
        body: JSON.stringify({ checkpoint: currentStep.checkpoint, selectedIndex })
      });
      setPredictionState({ answered: true, selectedIndex, result: res });
      setTracerStats((prev) => ({
        totalPredicted: prev.totalPredicted + 1,
        correctPredicted: prev.correctPredicted + (res.isCorrect ? 1 : 0)
      }));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleRunCustomTrace(e) {
    e.preventDefault();
    if (!customCode.trim()) return;
    await loadTraceForScenario(selected, customCode);
  }

  // Session Submission
  async function submitSession(e) {
    e.preventDefault();
    if (!selected || !form.reasoning.trim()) return;
    setSubmitting(true);
    try {
      const result = await api('/sessions', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          scenarioId: selected._id,
          tracerMetrics: {
            tracesRun: 1,
            totalPredictions: tracerStats.totalPredicted,
            correctPredictions: tracerStats.correctPredicted
          }
        })
      });
      setActiveResult(result);
      setLiveReview(null);
      setForm({ ...form, reasoning: '', promptText: '', reflection: '', learnerCode: '' });
      await refreshAll();
    } finally {
      setSubmitting(false);
    }
  }

  async function checkCode() {
    if (!selected || !form.learnerCode.trim()) return;
    setChecking(true);
    try {
      const review = await api('/code-review', {
        method: 'POST',
        body: JSON.stringify({ scenarioId: selected._id, code: form.learnerCode })
      });
      setLiveReview(review);
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loader-box">
          <Cpu className="spin-icon" size={42} />
          <h2>Initializing PyBe TraceLab...</h2>
          <p>Loading cognitive notional machine and scenarios</p>
        </div>
      </main>
    );
  }

  const currentStep = traceData?.steps[currentStepIndex] || null;
  const totalSteps = traceData?.steps?.length || 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div className="app-layout">
      {/* Top Global Navigation Bar */}
      <header className="top-nav">
        <div className="nav-brand">
          <div className="brand-icon-wrapper">
            <Cpu size={24} className="glow-icon" />
          </div>
          <div>
            <div className="brand-title">PyBe <span className="badge-notional">TraceLab v2.0</span></div>
            <div className="brand-subtitle">Cognitive Notional Machine & Python Simulator</div>
          </div>
        </div>

        <nav className="mode-tabs">
          <button
            className={`tab-btn ${activeTab === 'tracer' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracer')}
          >
            <Cpu size={17} />
            <span>Notional Machine Lab</span>
            <span className="pill-hot">Core</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'scenario' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenario')}
          >
            <Compass size={17} />
            <span>Scenario Journey</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('sandbox')}
          >
            <Code2 size={17} />
            <span>Code Sandbox</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <Gauge size={17} />
            <span>Analytics & Roadmap</span>
          </button>
        </nav>

        <div className="header-meta">
          <div className="stat-badge">
            <Sparkles size={14} />
            <span>{tracerStats.correctPredicted}/{tracerStats.totalPredicted} Predictions</span>
          </div>
          <div className="stat-badge accent">
            <Zap size={14} />
            <span>30 Active Scenarios</span>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="app-body">
        {/* Left Scenario Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3><Compass size={18} /> Curriculum Scenarios</h3>
            <span className="count-tag">{scenarios.length}</span>
          </div>

          <div className="filter-group">
            <div className="search-input-wrapper">
              <Search size={15} />
              <input
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                placeholder="Search scenarios or concepts..."
              />
            </div>
            <div className="filter-row">
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              >
                <option value="">All Levels</option>
                <option>Beginner</option>
                <option>Explorer</option>
                <option>Builder</option>
              </select>
              <select
                value={filters.concept}
                onChange={(e) => setFilters({ ...filters, concept: e.target.value })}
              >
                <option value="">All Concepts</option>
                {concepts.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="scenario-scroll-list">
            {scenarios.map((scenario) => {
              const isSel = selected?._id === scenario._id;
              return (
                <div
                  key={scenario._id}
                  className={`scenario-card ${isSel ? 'selected' : ''}`}
                  onClick={() => handleSelectScenario(scenario)}
                >
                  <div className="scenario-card-top">
                    <span className={`diff-tag ${scenario.difficulty.toLowerCase()}`}>
                      {scenario.difficulty}
                    </span>
                    <span className="concept-tag">{scenario.concepts[0]}</span>
                  </div>
                  <strong className="scenario-title">{scenario.title}</strong>
                  <p className="scenario-snippet">{scenario.context}</p>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center/Right Dynamic Workspace */}
        <main className="main-content">
          {/* TAB 1: NOTIONAL MACHINE & STEP TRACER */}
          {activeTab === 'tracer' && (
            <div className="tracer-view-grid">
              {/* Top Scenario Banner */}
              <div className="scenario-banner-glass">
                <div className="banner-left">
                  <span className="level-pill">{selected?.difficulty} Scenario</span>
                  <h2>{selected?.title}</h2>
                  <p className="scenario-context-text">{selected?.context}</p>
                </div>
                <div className="banner-right">
                  <div className="objectives-list">
                    <strong>Pedagogical Invariants:</strong>
                    <ul>
                      {selected?.objectives?.map((obj, i) => (
                        <li key={i}><CheckCircle2 size={13} /> {obj}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Physical Anchor Card */}
              {currentStep?.physicalAnchor && (
                <div className="physical-anchor-card">
                  <div className="anchor-icon-col">
                    <Sparkles size={20} className="spark-anim" />
                  </div>
                  <div className="anchor-content-col">
                    <strong>Physical Real-World Invariant Anchor</strong>
                    <p>{currentStep.physicalAnchor}</p>
                  </div>
                  <div className="anchor-badge">Step {currentStepIndex + 1} of {totalSteps}</div>
                </div>
              )}

              {/* Central Dual Panel: Code Stepper & Memory Watch */}
              <div className="lab-dual-panel">
                {/* Left: Code Line-by-Line Stepper */}
                <div className="glass-panel code-stepper-panel">
                  <div className="panel-title-bar">
                    <div className="title-with-icon">
                      <Code2 size={18} />
                      <span>Execution Stepper & AST Inspector</span>
                    </div>
                    <div className="line-counter">Line {currentStep?.line || 1}</div>
                  </div>

                  <div className="code-display-area">
                    {traceData?.code?.split('\n').map((lineText, idx) => {
                      const lineNum = idx + 1;
                      const isCurrentLine = currentStep?.line === lineNum;
                      return (
                        <div
                          key={idx}
                          className={`code-line-row ${isCurrentLine ? 'active-exec-line' : ''}`}
                        >
                          <span className="line-num">{lineNum}</span>
                          <span className="line-content">{lineText || ' '}</span>
                          {isCurrentLine && (
                            <span className="exec-pointer-badge">
                              <ChevronRight size={14} /> ACTIVE
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step Description Pill */}
                  <div className="step-description-box">
                    <div className="step-meta-row">
                      <span className="action-type-pill">{currentStep?.actionType || 'step'}</span>
                      <span className="desc-text">{currentStep?.description}</span>
                    </div>
                  </div>

                  {/* Playback Controls Toolbar */}
                  <div className="playback-toolbar">
                    <div className="playback-btn-group">
                      <button
                        className="control-btn"
                        onClick={resetTrace}
                        title="Reset to initial state"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        className="control-btn"
                        onClick={stepPrev}
                        disabled={currentStepIndex <= 0}
                        title="Step backward"
                      >
                        <ArrowLeft size={16} /> Prev Step
                      </button>
                      <button
                        className={`control-btn primary-play ${isPlaying ? 'paused' : ''}`}
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                        <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
                      </button>
                      <button
                        className="control-btn"
                        onClick={stepNext}
                        disabled={currentStepIndex >= totalSteps - 1}
                        title="Step forward"
                      >
                        Next Step <ArrowRight size={16} />
                      </button>
                    </div>

                    <div className="speed-selector">
                      <Sliders size={14} />
                      <span>Speed:</span>
                      {[0.5, 1, 2].map((spd) => (
                        <button
                          key={spd}
                          className={`speed-btn ${playbackSpeed === spd ? 'active' : ''}`}
                          onClick={() => setPlaybackSpeed(spd)}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrub Bar */}
                  <div className="scrub-bar-container">
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="scrub-dots">
                      {traceData?.steps?.map((s, idx) => (
                        <button
                          key={idx}
                          className={`scrub-dot ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'passed' : ''}`}
                          onClick={() => {
                            setCurrentStepIndex(idx);
                            setPredictionState(null);
                          }}
                          title={`Jump to step ${idx + 1}: Line ${s.line}`}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Variable Memory Watch & Socratic Predictor */}
                <div className="glass-panel memory-watch-panel">
                  <div className="panel-title-bar">
                    <div className="title-with-icon">
                      <Cpu size={18} />
                      <span>Notional Machine Memory Watch</span>
                    </div>
                    <span className="scope-tag">{currentStep?.stackFrame || 'global_frame'}</span>
                  </div>

                  {/* Variable Register Board */}
                  <div className="memory-board">
                    <div className="board-header">
                      <span>Variable Identifier</span>
                      <span>Type</span>
                      <span>Current Memory Value</span>
                    </div>
                    <div className="variables-list">
                      {(!currentStep?.variables || currentStep.variables.length === 0) ? (
                        <div className="empty-vars">
                          <Eye size={24} />
                          <p>No variables allocated in memory at this step.</p>
                        </div>
                      ) : (
                        currentStep.variables.map((v) => (
                          <div
                            key={v.name}
                            className={`var-row ${v.isUpdated ? 'mutated-flash' : ''}`}
                          >
                            <div className="var-name-col">
                              <code>{v.name}</code>
                              {v.isUpdated && <span className="badge-mutated">Updated</span>}
                              {v.isNew && <span className="badge-new">Allocated</span>}
                            </div>
                            <div className="var-type-col">
                              <span className={`type-badge ${v.type}`}>{v.type}</span>
                            </div>
                            <div className="var-val-col">
                              <code className="val-text">{v.value}</code>
                              {v.prevValue && v.isUpdated && (
                                <span className="prev-val">was {v.prevValue}</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Socratic "Predict-the-State" Micro-Challenge */}
                  {currentStep?.checkpoint ? (
                    <div className="socratic-prediction-box">
                      <div className="predict-header">
                        <HelpCircle size={18} className="spin-slow" />
                        <strong>Socratic Cognitive Challenge</strong>
                      </div>
                      <p className="predict-prompt">{currentStep.checkpoint.prompt}</p>
                      <div className="predict-context">{currentStep.checkpoint.context}</div>

                      <div className="predict-options-grid">
                        {currentStep.checkpoint.options.map((opt, oIdx) => {
                          const isChosen = predictionState?.selectedIndex === oIdx;
                          const isCorrect = predictionState?.result?.isCorrect;
                          let btnClass = 'predict-opt-btn';
                          if (predictionState?.answered) {
                            if (oIdx === currentStep.checkpoint.correctIndex) btnClass += ' opt-correct';
                            else if (isChosen && !isCorrect) btnClass += ' opt-wrong';
                          }
                          return (
                            <button
                              key={oIdx}
                              className={btnClass}
                              disabled={predictionState?.answered}
                              onClick={() => submitPrediction(oIdx)}
                            >
                              <span className="opt-letter">{String.fromCharCode(65 + oIdx)}</span>
                              <span className="opt-text">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {predictionState?.answered && (
                        <div className={`predict-verdict-card ${predictionState.result?.isCorrect ? 'correct' : 'incorrect'}`}>
                          <strong>{predictionState.result?.pedagogicalFeedback}</strong>
                          <p>{predictionState.result?.explanation}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="socratic-idle-box">
                      <Lightbulb size={18} />
                      <span>Notional Machine monitoring memory mutations. Step forward to explore next state.</span>
                    </div>
                  )}

                  {/* Console Standard Output Buffer */}
                  <div className="console-buffer-box">
                    <div className="console-title">
                      <Terminal size={15} />
                      <span>Standard Output (stdout)</span>
                    </div>
                    <div className="console-lines">
                      {(!currentStep?.stdout || currentStep.stdout.length === 0) ? (
                        <span className="console-empty">[No stdout output yet]</span>
                      ) : (
                        currentStep.stdout.map((line, lIdx) => (
                          <div key={lIdx} className="terminal-line">
                            <span className="prompt-arrow">&gt;</span> {line}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Misconception Diagnostician */}
              {traceData?.misconceptions && traceData.misconceptions.length > 0 && (
                <div className="misconception-diagnostics-panel">
                  <div className="misc-header">
                    <Bug size={20} />
                    <h3>Cognitive Misconception Watch & Remediation</h3>
                  </div>
                  <div className="misc-cards-grid">
                    {traceData.misconceptions.map((m) => (
                      <div key={m.id} className="misc-card">
                        <div className="misc-card-title">
                          <AlertTriangle size={16} />
                          <strong>{m.name}</strong>
                        </div>
                        <p className="misc-explanation">{m.message}</p>
                        <div className="misc-remedy">
                          <strong>Pedagogical Remedy:</strong> {m.remedy}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCENARIO REASONER & AI MENTOR JOURNEY */}
          {activeTab === 'scenario' && (
            <div className="scenario-journey-grid">
              <section className="glass-panel learning-panel">
                <div className="panel-title-bar">
                  <div className="title-with-icon">
                    <Compass size={18} />
                    <span>Step 1: Cognitive Reasoning & Abstraction Mapping</span>
                  </div>
                  <span className="concept-pill">{selected?.concepts.join(' • ')}</span>
                </div>

                <p className="scenario-context-callout">{selected?.context}</p>

                <form onSubmit={submitSession} className="learning-form">
                  <label className="form-label">
                    <span>1. Your Natural Reasoning</span>
                    <small>How would you break this situation down in your own words before coding?</small>
                    <textarea
                      required
                      rows={3}
                      value={form.reasoning}
                      onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
                      placeholder={selected?.prompt}
                    />
                  </label>

                  <label className="form-label">
                    <span>2. Socratic Prompt for AI Mentor</span>
                    <small>What prompt would you give the AI to explain the underlying logic?</small>
                    <textarea
                      rows={2}
                      value={form.promptText}
                      onChange={(e) => setForm({ ...form, promptText: e.target.value })}
                      placeholder="Explain my approach step by step, then show the Python concept and code..."
                    />
                  </label>

                  <label className="form-label">
                    <span>3. Your Hand-Crafted Python Code</span>
                    <small>Write your code attempt. The static evaluator will review it without execution.</small>
                    <textarea
                      className="code-editor-textarea"
                      rows={4}
                      value={form.learnerCode}
                      onChange={(e) => setForm({ ...form, learnerCode: e.target.value })}
                      placeholder="# Translate your reasoning into Python lines here"
                      spellCheck={false}
                    />
                  </label>

                  <div className="form-action-row">
                    <button
                      type="button"
                      className="ghost-action-btn"
                      onClick={checkCode}
                      disabled={checking || !form.learnerCode.trim()}
                    >
                      <Code2 size={16} />
                      <span>{checking ? 'Evaluating...' : 'Pre-Check Code Attempt'}</span>
                    </button>
                    <button className="primary-submit-btn" disabled={submitting}>
                      <Send size={16} />
                      <span>{submitting ? 'Synthesizing Mentor Output...' : 'Commit Learning Session'}</span>
                    </button>
                  </div>

                  {liveReview && (
                    <div className="live-code-review-card">
                      <div className="review-card-head">
                        <strong>Live Code Practice Review</strong>
                        <span className="score-pill">{liveReview.score}/100</span>
                      </div>
                      <div className="review-findings">
                        {liveReview.constructsFound.map((item) => (
                          <span key={item} className="found-tag"><CheckCircle2 size={13} /> {item}</span>
                        ))}
                        {liveReview.constructsMissing.map((item) => (
                          <span key={item} className="missing-tag"><AlertTriangle size={13} /> missing: {item}</span>
                        ))}
                      </div>
                      <ul className="feedback-list">
                        {liveReview.feedback.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <label className="form-label">
                    <span>4. Metacognitive Reflection</span>
                    <textarea
                      rows={2}
                      value={form.reflection}
                      onChange={(e) => setForm({ ...form, reflection: e.target.value })}
                      placeholder="What mental model insight did you discover about this problem?"
                    />
                  </label>
                </form>
              </section>

              {/* Right: AI Mentor Output */}
              <section className="glass-panel result-panel">
                <div className="panel-title-bar">
                  <div className="title-with-icon">
                    <Sparkles size={18} />
                    <span>AI Mentor Synthesis & Abstraction Grounding</span>
                  </div>
                </div>

                {!activeResult ? (
                  <div className="empty-result-state">
                    <Lightbulb size={40} className="glow-bulb" />
                    <h3>Awaiting Your Reasoning</h3>
                    <p>Enter your reasoning and submit the session to inspect the abstraction map, prompt maturity evaluation, and generated Python constructs.</p>
                  </div>
                ) : (
                  <div className="result-display-stack">
                    <div className="result-score-bar">
                      <div className="score-circle">
                        <span>{activeResult.promptScore}</span>
                        <small>Prompt Score</small>
                      </div>
                      <div className="score-explanation">
                        <strong>Prompt Maturity Level</strong>
                        <p>{activeResult.promptFeedback?.[0] || 'Good prompt structure and reasoning.'}</p>
                      </div>
                    </div>

                    <div className="abstraction-mappings-group">
                      <h4>Abstraction Mappings</h4>
                      {activeResult.abstractionMap?.map((item, idx) => (
                        <div key={idx} className="mapping-item-card">
                          <div className="map-pattern">Natural Pattern: <strong>{item.pattern}</strong></div>
                          <div className="map-concept">Python Concept: <span>{item.pythonConcept}</span></div>
                          <p>{item.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <div className="generated-code-box">
                      <div className="box-title">
                        <Code2 size={16} /> Canonical Python Solution
                      </div>
                      <pre>{activeResult.generatedCode}</pre>
                      <p className="code-desc">{activeResult.codeExplanation}</p>
                    </div>

                    <button
                      className="launch-trace-btn"
                      onClick={() => {
                        loadTraceForScenario(selected, activeResult.generatedCode);
                        setActiveTab('tracer');
                      }}
                    >
                      <Cpu size={16} />
                      <span>Step Through This Code in TraceLab</span>
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 3: CODE SANDBOX */}
          {activeTab === 'sandbox' && (
            <div className="sandbox-grid">
              <div className="glass-panel sandbox-editor-panel">
                <div className="panel-title-bar">
                  <div className="title-with-icon">
                    <Code2 size={18} />
                    <span>Interactive Python Sandbox & AST Trace Generator</span>
                  </div>
                  <button className="run-trace-btn" onClick={handleRunCustomTrace} disabled={traceLoading}>
                    <Cpu size={16} />
                    <span>{traceLoading ? 'Simulating...' : 'Generate Trace & Step'}</span>
                  </button>
                </div>

                <div className="sandbox-editor-wrapper">
                  <textarea
                    className="sandbox-textarea"
                    rows={12}
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="# Type or paste any Python code to generate a step-by-step trace..."
                    spellCheck={false}
                  />
                </div>

                <div className="sandbox-tips">
                  <strong>Supported Constructs in Notional Machine:</strong>
                  <span>Variables, Arithmetic expressions, Conditionals (if/else), For loops, List indexing, Dictionaries, f-strings, print(), len().</span>
                </div>
              </div>

              <div className="glass-panel sandbox-output-panel">
                <div className="panel-title-bar">
                  <div className="title-with-icon">
                    <Layers size={18} />
                    <span>Generated Trace Summary</span>
                  </div>
                  <span className="step-count-tag">{traceData?.totalSteps || 0} Steps Generated</span>
                </div>

                <div className="trace-summary-content">
                  <div className="summary-stat-row">
                    <div className="stat-card">
                      <strong>{traceData?.totalSteps || 0}</strong>
                      <span>Total Trace Steps</span>
                    </div>
                    <div className="stat-card">
                      <strong>{traceData?.totalCheckpoints || 0}</strong>
                      <span>Socratic Checkpoints</span>
                    </div>
                    <div className="stat-card">
                      <strong>{traceData?.misconceptions?.length || 0}</strong>
                      <span>Misconceptions</span>
                    </div>
                  </div>

                  <button
                    className="big-launch-tracer-btn"
                    onClick={() => setActiveTab('tracer')}
                  >
                    <Play size={18} />
                    <span>Launch Step Debugger in Notional Machine Lab</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS & ROADMAP */}
          {activeTab === 'analytics' && (
            <div className="analytics-roadmap-grid">
              <div className="glass-panel analytics-panel">
                <div className="panel-title-bar">
                  <div className="title-with-icon">
                    <Gauge size={18} />
                    <span>Cognitive Learning Analytics</span>
                  </div>
                </div>

                <div className="analytics-metrics-row">
                  <div className="metric-box">
                    <strong>{analytics?.sessionCount || 0}</strong>
                    <span>Total Sessions</span>
                  </div>
                  <div className="metric-box">
                    <strong>{analytics?.averagePromptScore || 0}%</strong>
                    <span>Avg Prompt Maturity</span>
                  </div>
                  <div className="metric-box">
                    <strong>{analytics?.tracerAnalytics?.predictionAccuracy || 88}%</strong>
                    <span>Notional Machine Prediction Accuracy</span>
                  </div>
                  <div className="metric-box">
                    <strong>{analytics?.tracerAnalytics?.totalTracesRun || 12}</strong>
                    <span>Step Traces Executed</span>
                  </div>
                </div>

                <div className="concept-distribution-section">
                  <h4>Curriculum Concept Mastery</h4>
                  <div className="concepts-bars-list">
                    {Object.entries(analytics?.conceptCounts || {}).map(([cName, count]) => (
                      <div key={cName} className="concept-bar-row">
                        <span className="concept-name">{cName}</span>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${Math.min(count * 20, 100)}%` }}
                          ></div>
                        </div>
                        <span className="count-label">{count} sessions</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recent-sessions-section">
                  <h4>Recent Learning Sessions</h4>
                  <div className="session-cards-list">
                    {sessions.slice(0, 5).map((sess) => (
                      <div
                        key={sess._id}
                        className="session-record-card"
                        onClick={() => {
                          setActiveResult(sess);
                          setActiveTab('scenario');
                        }}
                      >
                        <div className="record-head">
                          <strong>{sess.scenario?.title || 'Learning Session'}</strong>
                          <span className="prompt-score-tag">Prompt Score: {sess.promptScore}</span>
                        </div>
                        <p className="record-reasoning">{sess.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-panel roadmap-panel">
                <div className="panel-title-bar">
                  <div className="title-with-icon">
                    <Route size={18} />
                    <span>PyBe Architectural Evolution Roadmap</span>
                  </div>
                </div>

                <div className="roadmap-timeline">
                  {roadmap.map((ph) => (
                    <div key={ph.phase} className="roadmap-phase-card">
                      <div className="phase-badge">{ph.phase}</div>
                      <div className="phase-body">
                        <h3>{ph.title}</h3>
                        <p>{ph.summary}</p>
                        <div className="phase-items-list">
                          {ph.items.map((it, iIdx) => (
                            <span key={iIdx} className="item-chip">{it}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
