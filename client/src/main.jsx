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
  const [tutorialStep, setTutorialStep] = useState(1);

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
    if (tutorialStep > 0) {
      setTimeout(() => {
        const el = document.querySelector('.highlighted-step');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [tutorialStep]);

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
    <main className={`app-shell ${tutorialStep > 0 ? 'tutorial-active' : ''}`}>
      <aside className={`sidebar ${tutorialStep === 2 ? 'highlighted-step' : ''}`}>
        <div className="brand">
          <Brain size={30} />
          <div>
            <strong>PyBe</strong>
            <span>Scenario-first Python</span>
          </div>
        </div>

        <div className={`filters-container ${tutorialStep === 3 ? 'highlighted-step' : ''}`}>
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
        </div>

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
          <div className="hero-content">
            <div>
              <p>AI-native learning journey</p>
              <h1>Learn Python by reasoning through real situations first.</h1>
            </div>
            <button className="how-it-works-btn" onClick={() => setTutorialStep(1)}>
              <Compass size={18} /> How it works
            </button>
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
            <form onSubmit={submitSession} className={`learning-form ${tutorialStep === 4 ? 'highlighted-step' : ''}`}>
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
              <button className={`primary ${tutorialStep === 5 ? 'highlighted-step' : ''}`} disabled={submitting}>
                <Send size={18} />{submitting ? 'Mapping...' : 'Map My Reasoning'}
              </button>
            </form>
          </section>

          <section className={`panel result-panel ${tutorialStep === 6 ? 'highlighted-step' : ''}`}>
            <div className="section-title">
              <Sparkles size={20} />
              <h2>AI Mentor Output</h2>
            </div>
            {!activeResult ? <EmptyResult /> : <Result result={activeResult} />}
          </section>
        </div>

        <section className={`dashboard ${tutorialStep === 7 ? 'highlighted-step' : ''}`}>
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
      
      {tutorialStep > 0 && (
        <TutorialPopup step={tutorialStep} setStep={setTutorialStep} />
      )}
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

function TutorialPopup({ step, setStep }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const handleMouseDown = (e) => {
    // Only drag with left click and when clicking header or title
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const steps = [
    { title: "Welcome to PyBe!", desc: "PyBe is an AI-native learning journey that completely flips how you learn Python. Instead of just reading code, you will face real-world scenarios and use your natural reasoning to solve them first. This tour will walk you through the entire experience." },
    { title: "Sidebar & Lesson Library", desc: "On the left side, you'll find our entire library of scenarios. These range from beginner tasks to complex system designs. Click on any scenario to load it into your workspace." },
    { title: "Filters", desc: "Use the search bar to find specific topics, or use the difficulty and concept dropdowns to narrow down the list. This helps you target exactly the skills you want to practice today." },
    { title: "Reasoning Fields", desc: "When you open a scenario, do NOT write code yet! Instead, write out your thought process. 1. 'Your reasoning': How would you logically solve this? 2. 'Prompt': Write what you'd ask an AI mentor. 3. 'Reflection': Notice your own thinking." },
    { title: "Map My Reasoning", desc: "Once you've filled out your thoughts, click this button. PyBe's AI will analyze your logic and perfectly map it to actual Python concepts, bridging the gap between natural language and syntax." },
    { title: "AI Mentor Output", desc: "Here is where the magic happens! You will receive a Prompt Maturity Score, a direct mapping of your logical patterns to Python features (like Decision making -> if/else), the generated Python code based on your logic, and a check for any misconceptions." },
    { title: "Dashboard & Roadmap", desc: "Finally, track your progress at the bottom! As you complete scenarios, your analytics will update, showing your mastery over different Python concepts. Your roadmap will guide you on what to tackle next." }
  ];

  useEffect(() => {
    if (ttsEnabled && step > 0) {
      window.speechSynthesis.cancel();
      const currentText = steps[step - 1].desc;
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, [step, ttsEnabled]);

  const toggleTts = () => {
    if (ttsEnabled) {
      window.speechSynthesis.cancel();
      setTtsEnabled(false);
    } else {
      setTtsEnabled(true);
    }
  };

  const current = steps[step - 1];

  return (
    <>
      <div className="tutorial-overlay-bg"></div>
      <div className="tutorial-modal-container">
        <div 
          className={`tutorial-modal ${step === 1 ? 'welcome-modal' : ''}`}
          style={{ transform: step === 1 ? 'none' : `translate(${position.x}px, ${position.y}px)` }}
        >
          <div className="tutorial-progress-bar" style={{ width: `${(step / 7) * 100}%` }}></div>
          
          <div 
            className="tutorial-header"
            onMouseDown={step === 1 ? undefined : handleMouseDown}
            style={{ cursor: step === 1 ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
          >
            <h3>{current.title}</h3>
            <div className="tutorial-header-controls" onMouseDown={(e) => e.stopPropagation()}>
              <button 
                onClick={toggleTts} 
                className={`tts-btn ${ttsEnabled ? 'active' : ''}`}
                title={ttsEnabled ? "Mute Voice Narrator" : "Enable Voice Narrator"}
              >
                {ttsEnabled ? "🔊 Narrate" : "🔇 Mute"}
              </button>
              <span>Step {step} of 7</span>
            </div>
          </div>
          
          {step === 4 && (
            <div className="tutorial-mockup light-mockup">
              <label>Your reasoning</label>
              <div className="mock-input active-mock-input">I need to store a single value and give it a clear name so the computer remembers it.</div>
              <label>Prompt you would give an AI mentor</label>
              <div className="mock-input">Explain step by step how to store a single number using a variable.</div>
            </div>
          )}

          {step === 6 && (
            <div className="tutorial-mockup dark-mockup">
              <div className="mock-score">
                <strong>100</strong>
                <span>Prompt maturity</span>
              </div>
              <div className="mock-mapping">
                <strong>Decision making</strong>
                <small>if / elif / else</small>
                <p>You are branching based on a condition...</p>
              </div>
            </div>
          )}

          <p>{current.desc}</p>
          <div className="tutorial-actions">
            <button onClick={() => { window.speechSynthesis.cancel(); setStep(0); }} className="skip-btn">Skip Tour</button>
            
            <div className="tutorial-dots">
              {steps.map((_, i) => (
                <button 
                  key={i} 
                  className={`dot ${step === i + 1 ? 'active' : ''}`}
                  onClick={() => setStep(i + 1)}
                  title={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            <div className="nav-btns">
              {step > 1 && <button onClick={() => setStep(step - 1)}>Previous</button>}
              <button onClick={() => { if (step === 7) { window.speechSynthesis.cancel(); setStep(0); } else { setStep(step + 1); } }} className="next-btn">
                {step === 7 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
