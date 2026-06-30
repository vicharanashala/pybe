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

function calculateXp(session) {
  const base = 10;
  const scoreBonus = Math.floor((session.promptScore || 0) / 10);
  const conceptBonus = (session.abstractionMap || []).length * 3;
  return base + scoreBonus + conceptBonus;
}

function calculateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = localStorage.getItem('pybe_last_active');
  const storedStreak = parseInt(localStorage.getItem('pybe_streak') || '0', 10);

  if (!lastActive) return 1;

  const diffMs = new Date(today).getTime() - new Date(lastActive).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return storedStreak;
  if (diffDays === 1) return storedStreak + 1;
  return 1;
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
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('pybe_xp') || '0', 10));
  const [streak, setStreak] = useState(() => calculateStreak());
  const [view, setView] = useState('home');
  const [quizData, setQuizData] = useState(null);

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
      const earnedXp = calculateXp(result);
      const newXp = xp + earnedXp;
      setXp(newXp);
      localStorage.setItem('pybe_xp', String(newXp));
      const today = new Date().toISOString().split('T')[0];
      const lastActive = localStorage.getItem('pybe_last_active');
      const currentStreak = lastActive === today ? streak : calculateStreak();
      localStorage.setItem('pybe_streak', String(currentStreak));
      localStorage.setItem('pybe_last_active', today);
      setStreak(currentStreak);
      setActiveResult({ ...result, earnedXp, totalXp: newXp, streak: currentStreak });
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
        {view === 'quiz' && quizData ? (
          <QuizPage
            quizData={quizData}
            setQuizData={setQuizData}
            xp={xp}
            setXp={setXp}
            onExit={() => setView('home')}
          />
        ) : (
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
                    <div className="textarea-row">
                      <textarea
                        required
                        value={form.reasoning}
                        onChange={(event) => setForm({ ...form, reasoning: event.target.value })}
                        placeholder={selected?.prompt}
                      />
                      <VoiceInput value={form.reasoning} onChange={(v) => setForm({ ...form, reasoning: v })} />
                    </div>
                  </label>
                  <label>
                    Prompt you would give an AI mentor
                    <div className="textarea-row">
                      <textarea
                        value={form.promptText}
                        onChange={(event) => setForm({ ...form, promptText: event.target.value })}
                        placeholder="Explain my approach step by step, then show the Python concept and code..."
                      />
                      <VoiceInput value={form.promptText} onChange={(v) => setForm({ ...form, promptText: v })} />
                    </div>
                  </label>
                  <label>
                    Reflection
                    <div className="textarea-row">
                      <textarea
                        value={form.reflection}
                        onChange={(event) => setForm({ ...form, reflection: event.target.value })}
                        placeholder="What did you notice about your thinking?"
                      />
                      <VoiceInput value={form.reflection} onChange={(v) => setForm({ ...form, reflection: v })} />
                    </div>
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
                {!activeResult ? <EmptyResult /> : <Result result={activeResult} onQuizStart={(result) => {
                  setQuizData({
                    session: result,
                    difficulty: 1,
                    score: 0,
                    questionsSeen: 0,
                    concept: result.abstractionMap?.[0]?.pythonConcept || 'variables'
                  });
                  setView('quiz');
                }} />}
              </section>

              <section className="panel w3h-panel">
                {activeResult ? <W3H result={activeResult} /> : (
                  <div className="empty"><Lightbulb size={32} /><p>Submit reasoning to see W3H breakdown.</p></div>
                )}
              </section>
            </div>

            {activeResult && (
              <div className="top-stats-bar">
                <span><strong>{selected?.title}</strong></span>
                {activeResult.earnedXp != null && (
                  <span className="top-xp">+{activeResult.earnedXp} XP <small>(Total: {activeResult.totalXp})</small></span>
                )}
                {activeResult.streak != null && (
                  <span className="top-streak">&#128293; {activeResult.streak} day{activeResult.streak !== 1 ? 's' : ''}</span>
                )}
              </div>
            )}

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
        )}
      </section>
    </main>
  );
}

function VoiceInput({ value, onChange }) {
  const [recording, setRecording] = useState(false);
  const [supported] = useState(() => {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });

  useEffect(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onChange(value + transcript);
    };

    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);

    if (recording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => { recognition.stop(); };
  }, [recording]);

  if (!supported) return null;

  function toggle() {
    setRecording(r => !r);
  }

  return (
    <button
      type="button"
      className={`voice-btn${recording ? ' recording' : ''}`}
      onClick={toggle}
      title={recording ? 'Stop recording' : 'Start voice input'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {recording ? (
          <rect x="6" y="6" width="12" height="12" rx="1" />
        ) : (
          <>
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </>
        )}
      </svg>
      {recording && <span className="recording-dot" />}
    </button>
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

function W3H({ result }) {
  const [expanded, setExpanded] = useState(null);
  const primary = result.abstractionMap?.[0];
  const codeText = result.generatedCode || '';

  const whatReasoning = buildWhatReasoning(primary, result.reasoning);
  const whyText = buildWhy(primary, result.promptFeedback, result.scenario);
  const { whereText, whereLabel } = buildWhere(codeText);
  const { codeLines, highlightIdx } = buildHow(codeText);
  const needsFix = (result.promptScore != null && result.promptScore < 60) || (result.misconceptions && result.misconceptions.length > 0);
  const fixInsight = buildFixInsight(result, primary);

  function toggle(section) {
    setExpanded(prev => prev === section ? null : section);
  }

  return (
    <div className="w3h-panel">
      <div className="w3h-panel-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        W³H Learning Insight
      </div>

      <div className="w3h-sections">
        <AccordionSection
          icon={<span className="w3h-dot blue" />}
          label="WHAT"
          title="Your Thinking Pattern"
          content={<p>{whatReasoning}</p>}
          expanded={expanded === 'what'}
          onToggle={() => toggle('what')}
          accent="blue"
        />
        <AccordionSection
          icon={<span className="w3h-dot yellow" />}
          label="WHY"
          title="Context & Purpose"
          content={<p>{whyText}</p>}
          expanded={expanded === 'why'}
          onToggle={() => toggle('why')}
          accent="yellow"
        />
        <AccordionSection
          icon={<span className="w3h-dot orange" />}
          label="WHERE"
          title="Code Mapping"
          content={<div className="w3h-where"><span className="w3h-where-label">{whereLabel}</span><p>{whereText}</p></div>}
          expanded={expanded === 'where'}
          onToggle={() => toggle('where')}
          accent="orange"
        />
        <AccordionSection
          icon={<span className="w3h-dot red" />}
          label="HOW"
          title="Real Code View"
          content={
            <div className="w3h-code-block">
              {codeLines.map((line, i) => (
                <div key={i} className={`w3h-code-line${i === highlightIdx ? ' highlight' : ''}`}>
                  <span className="w3h-code-num">{i + 1}</span>
                  <span className="w3h-code-text">{line || ' '}</span>
                </div>
              ))}
            </div>
          }
          expanded={expanded === 'how'}
          onToggle={() => toggle('how')}
          accent="red"
          dark
        />
      </div>

      {needsFix && fixInsight && (
        <div className="w3h-fix-insight">
          <div className="w3h-fix-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Fix Insight
          </div>
          <p className="w3h-fix-mistake"><strong>Mistake:</strong> {fixInsight.mistake}</p>
          <p className="w3h-fix-correct"><strong>Correct approach:</strong> {fixInsight.correct}</p>
        </div>
      )}
    </div>
  );
}

function AccordionSection({ icon, label, title, content, expanded, onToggle, accent, dark }) {
  return (
    <div className={`w3h-section${expanded ? ' open' : ''}${dark ? ' dark' : ''} accent-${accent}`}>
      <button className="w3h-section-toggle" onClick={onToggle}>
        <div className="w3h-section-left">
          {icon}
          <span className="w3h-label">{label}</span>
          <span className="w3h-title">{title}</span>
        </div>
        <svg className="w3h-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {expanded && <div className="w3h-section-body">{content}</div>}
    </div>
  );
}

function buildWhatReasoning(primary, reasoning) {
  if (!primary) return 'No clear reasoning pattern detected yet.';
  const pattern = primary.pattern || '';
  const reasoning_lower = (reasoning || '').toLowerCase();
  if (pattern === 'Repetition') return 'You identified a pattern that repeats — thinking in cycles to handle multiple items one after another.';
  if (pattern === 'Decision making') return 'You evaluated a condition and chose a path — thinking conditionally based on a true/false check.';
  if (pattern === 'Collection handling') return 'You grouped related values together — thinking about data as organized collections.';
  if (pattern === 'Computation') return 'You transformed values through calculation — thinking in terms of arithmetic operations and results.';
  if (pattern === 'Reusable procedure') return 'You spotted a repeatable process — thinking about logic that can be called multiple times.';
  if (pattern === 'Selection and filtering') return 'You narrowed down options using a rule — thinking about keeping only what matches a criteria.';
  if (pattern === 'Sequential thinking') return 'You broke the problem into ordered steps — thinking in a clear top-to-bottom flow.';
  return `You applied ${primary.pythonConcept} in your reasoning to structure the solution.`;
}

function buildWhy(primary, feedback, scenario) {
  const fb = (feedback || [])[0] || '';
  if (fb.includes('Strong prompt')) return 'Your reasoning shows good structure, which maps cleanly to the Python constructs needed for this scenario.';
  if (fb.includes('context')) return 'Your approach identifies the key data elements before deciding how to process them — the right mindset for this scenario.';
  if (fb.includes('example')) return 'You included practical details in your reasoning, helping map your thinking directly to real Python code.';
  if (primary?.pattern === 'Repetition') return 'This scenario involves handling multiple items of the same kind — loops are the natural Python tool for exactly this.';
  if (primary?.pattern === 'Decision making') return 'This scenario requires choosing between actions based on a condition — conditionals are built for that decision logic.';
  if (primary?.pattern === 'Collection handling') return 'This scenario works with groups of related data — Python lists and dictionaries are designed to model exactly these situations.';
  if (primary?.pattern === 'Computation') return 'This scenario needs a numeric result — Python variables and arithmetic let you compute and store results efficiently.';
  if (primary?.pattern === 'Reusable procedure') return 'This scenario involves a rule applied to different inputs — functions are the Python way to capture and reuse such logic.';
  return 'Your reasoning connects naturally to the Python concepts this scenario is designed to introduce.';
}

function buildWhere(codeText) {
  if (/for\s+\w+\s+in\s+/i.test(codeText)) return { whereLabel: 'for loop', whereText: 'A for loop iterates over each item in a sequence, running the same block for every element.' };
  if (/while\s+/i.test(codeText)) return { whereLabel: 'while loop', whereText: 'A while loop repeats as long as its condition remains true — useful when you do not know how many iterations needed.' };
  if (/if\s+/i.test(codeText)) return { whereLabel: 'if statement', whereText: 'An if statement executes a block only when its condition evaluates to true, creating a branching path.' };
  if (/def\s+\w+/i.test(codeText)) return { whereLabel: 'function def', whereText: 'A function definition packages logic into a reusable unit that can be called multiple times with different inputs.' };
  if (/print\s*\(/i.test(codeText)) return { whereLabel: 'print output', whereText: 'A print statement outputs values to the console, useful for displaying results and debugging.' };
  if (/\w+\s*=\s*/i.test(codeText)) return { whereLabel: 'variable assignment', whereText: 'Variable assignment stores a value in memory using a named label, making it reusable throughout the code.' };
  return { whereLabel: 'not detected', whereText: 'No specific Python structure detected — the reasoning may need to map more clearly to a construct.' };
}

function buildHow(codeText) {
  const allLines = codeText.split('\n').filter(l => l.trim() !== '');
  const lines = allLines.slice(0, 8);
  let highlightIdx = 0;
  if (/for\s+\w+\s+in\s+/i.test(codeText)) highlightIdx = lines.findIndex(l => /for\s+\w+\s+in\s+/i.test(l));
  else if (/def\s+\w+/i.test(codeText)) highlightIdx = lines.findIndex(l => /def\s+\w+/i.test(l));
  else if (/if\s+/i.test(codeText)) highlightIdx = lines.findIndex(l => /if\s+/i.test(l));
  else if (/while\s+/i.test(codeText)) highlightIdx = lines.findIndex(l => /while\s+/i.test(l));
  else if (/\w+\s*=\s*[\d"\[']/i.test(codeText)) highlightIdx = lines.findIndex(l => /\w+\s*=\s*[\d"\[']/i.test(l));
  if (highlightIdx < 0) highlightIdx = 0;
  return { codeLines: lines, highlightIdx };
}

function buildFixInsight(result, primary) {
  const score = result.promptScore || 0;
  const misconceptions = result.misconceptions || [];
  if (score < 40) {
    return {
      mistake: 'Your prompt lacks context and structure. The AI needs more details about what you want to learn and why.',
      correct: 'Include the scenario goal, the specific Python concept, and an example of what output you expect.'
    };
  }
  if (score < 60) {
    return {
      mistake: 'Your reasoning shows the right intent but may not fully map to the target Python construct.',
      correct: 'Try naming the Python concept directly and describe what your code should do step by step.'
    };
  }
  if (misconceptions.length > 0) {
    return {
      mistake: misconceptions[0],
      correct: 'Focus on the specific condition or loop rule before writing the full logic.'
    };
  }
  return null;
}

function Result({ result, onQuizStart }) {
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
      <button
        className="primary quiz-trigger"
        onClick={() => onQuizStart && onQuizStart(result)}
      >
        <Sparkles size={18} /> Take a Quiz
      </button>
    </div>
  );
}

function generateQuestion(concept, difficulty) {
  const qBank = {
    'for / while loops': [
      { q: 'What Python construct repeats actions?', a: 'A for or while loop', opts: ['A for or while loop', 'An if statement', 'A variable assignment', 'A function definition'], exp: 'Loops repeat a block of code multiple times.' },
      { q: 'Which correctly iterates over a list?', a: 'for item in my_list:', opts: ['for item in my_list:', 'if item in my_list:', 'while item in my_list:', 'def item in my_list:'], exp: 'The for loop iterates over each element in a collection.' },
      { q: 'When should you use a while loop?', a: 'When you don\'t know the number of iterations', opts: ['When you don\'t know the number of iterations', 'When you want to store a value', 'When you need to compare two values', 'When defining a function'], exp: 'while loops continue until a condition becomes false.' },
      { q: 'What causes an infinite loop?', a: 'A condition that never becomes false', opts: ['A condition that never becomes false', 'A for loop with a list', 'A function with a return statement', 'An if-else block'], exp: 'If the condition always remains true, the loop never stops.' },
    ],
    'if / elif / else': [
      { q: 'What does an if statement do?', a: 'Executes code only when a condition is true', opts: ['Executes code only when a condition is true', 'Repeats code multiple times', 'Stores a value in memory', 'Defines a reusable function'], exp: 'if checks a condition and runs the block only if it\'s true.' },
      { q: 'What is the purpose of else?', a: 'Runs when the if condition is false', opts: ['Runs when the if condition is false', 'Checks a second condition', 'Defines a loop', 'Stores a variable'], exp: 'else provides a fallback block when the if condition fails.' },
      { q: 'When elif is needed?', a: 'When there are multiple conditions to check', opts: ['When there are multiple conditions to check', 'When you need to repeat code', 'When defining a function', 'When storing multiple values'], exp: 'elif lets you chain multiple conditional branches.' },
    ],
    'lists and dictionaries': [
      { q: 'What is a list in Python?', a: 'An ordered collection of items', opts: ['An ordered collection of items', 'A single value', 'A loop construct', 'A conditional check'], exp: 'Lists hold multiple values in a specific order.' },
      { q: 'How do you access the first item in a list?', a: 'my_list[0]', opts: ['my_list[0]', 'my_list[1]', 'my_list(first)', 'my_list{0}'], exp: 'Python uses zero-based indexing, so the first item is at index 0.' },
      { q: 'What is a dictionary for?', a: 'Storing key-value pairs', opts: ['Storing key-value pairs', 'Repeating actions', 'Making decisions', 'Creating loops'], exp: 'Dictionaries map unique keys to values for fast lookup.' },
      { q: 'What does dict["name"] do?', a: 'Retrieves the value for key "name"', opts: ['Retrieves the value for key "name"', 'Stores "name" as a string', 'Creates a new key', 'Deletes the "name" key'], exp: 'Square bracket notation fetches the value associated with that key.' },
    ],
    'variables and arithmetic expressions': [
      { q: 'What is a variable?', a: 'A named container for a value', opts: ['A named container for a value', 'A loop that counts numbers', 'A conditional check', 'A type of data'], exp: 'Variables give names to values so you can reuse them.' },
      { q: 'What does x = 5 + 3 do?', a: 'Assigns the sum 8 to x', opts: ['Assigns the sum 8 to x', 'Checks if x equals 5', 'Prints 5 + 3', 'Defines a function'], exp: 'The right side is evaluated first, then assigned to the variable.' },
      { q: 'Which creates a valid variable name?', a: 'student_name', opts: ['student_name', 'my-var', '2nd_place', 'class'], exp: 'Variable names can contain letters, numbers (not first), and underscores.' },
    ],
    'functions': [
      { q: 'What does a function do?', a: 'Encapsulates reusable code logic', opts: ['Encapsulates reusable code logic', 'Stores a single value', 'Makes a decision', 'Creates a loop'], exp: 'Functions bundle code so it can be called multiple times.' },
      { q: 'What keyword defines a function?', a: 'def', opts: ['def', 'func', 'function', 'define'], exp: 'def is used to define a function in Python.' },
      { q: 'What is a return statement for?', a: 'Sends a value back to the caller', opts: ['Sends a value back to the caller', 'Repeats the function', 'Stops the program', 'Stores a global variable'], exp: 'return passes a result back from the function.' },
    ],
    'comparisons and list comprehensions': [
      { q: 'What does x > 10 evaluate to?', a: 'True or False', opts: ['True or False', 'A number', 'A string', 'A list'], exp: 'Comparison operators return a boolean value.' },
      { q: 'What is a list comprehension?', a: 'A compact way to create a list', opts: ['A compact way to create a list', 'A type of loop', 'A dictionary', 'A function call'], exp: 'List comprehensions generate lists using a single line of Python.' },
    ],
    'statements and variables': [
      { q: 'What is a Python statement?', a: 'A complete instruction that Python executes', opts: ['A complete instruction that Python executes', 'A type of loop', 'A comparison', 'A function'], exp: 'Statements are the individual instructions that make up a program.' },
      { q: 'Which is a valid Python statement?', a: 'print("Hello")', opts: ['print("Hello")', 'print(Hello)', 'print Hello', 'print[Hello]'], exp: 'print() is a function call — a valid Python statement.' },
    ],
    'strings': [
      { q: 'What is a string?', a: 'A sequence of characters in quotes', opts: ['A sequence of characters in quotes', 'A type of loop', 'A number', 'A condition'], exp: 'Strings represent text data wrapped in quotes.' },
      { q: 'How do you get the length of a string?', a: 'len(text)', opts: ['len(text)', 'text.length()', 'size(text)', 'text.size()'], exp: 'The len() function returns the number of characters in a string.' },
    ],
    'default': [
      { q: 'What Python concept does this scenario teach?', a: 'Using variables to store data', opts: ['Using variables to store data', 'Creating an infinite loop', 'Defining a class', 'Importing modules'], exp: 'This scenario focuses on storing and managing data values.' },
    ]
  };

  const conceptKey = Object.keys(qBank).find(k => concept?.toLowerCase().includes(k.toLowerCase().split('/')[0].trim())) || 'default';
  const pool = qBank[conceptKey] || qBank['default'];
  const idx = Math.min(difficulty - 1, pool.length - 1);
  const question = { ...pool[idx >= 0 ? idx : 0], concept };
  return question;
}

function QuizPage({ quizData, setQuizData, xp, setXp, onExit }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const q = generateQuestion(quizData.concept, quizData.difficulty);
    setQuestion(q);
    setSelected(null);
    setFeedback(null);
  }, [quizData.difficulty, quizData.concept, quizData.questionsSeen]);

  function handleSelect(option) {
    if (feedback) return;
    const correct = option === question.a;
    setSelected(option);
    setFeedback({ correct, explanation: question.exp });
    const earnedXp = correct ? 5 + quizData.difficulty * 2 : 2;
    const newXp = xp + earnedXp;
    setXp(newXp);
    localStorage.setItem('pybe_xp', String(newXp));
    setQuizData(prev => ({ ...prev, score: prev.score + (correct ? 1 : 0), questionsSeen: prev.questionsSeen + 1 }));
  }

  function handleNext() {
    const newDiff = feedback.correct
      ? Math.min(quizData.difficulty + 1, 4)
      : Math.max(quizData.difficulty - 1, 1);
    setQuizData(prev => ({ ...prev, difficulty: newDiff }));
  }

  if (!question) return null;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="quiz-exit" onClick={onExit}>&#8592; Back</button>
        <span>Score: {quizData.score}/{quizData.questionsSeen}</span>
        <span>XP: {xp}</span>
      </div>
      <div className="quiz-card">
        <div className="quiz-concept">{question.concept}</div>
        <h2 className="quiz-question">{question.q}</h2>
        <div className="quiz-options">
          {question.opts.map((opt) => (
            <button
              key={opt}
              className={`quiz-option${selected === opt ? (feedback?.correct ? ' correct' : ' wrong') : ''}${!feedback && selected !== opt && opt === question.a ? ' reveal' : ''}`}
              onClick={() => handleSelect(opt)}
              disabled={!!feedback}
            >
              {opt}
            </button>
          ))}
        </div>
        {feedback && (
          <div className={`quiz-feedback${feedback.correct ? ' correct' : ' wrong'}`}>
            <strong>{feedback.correct ? 'Correct! ' : 'Not quite. '}</strong>{feedback.explanation}
          </div>
        )}
        {feedback && (
          <button className="primary quiz-next" onClick={handleNext}>
            Next Question &#8594;
          </button>
        )}
      </div>
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
