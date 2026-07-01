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
  BookOpen,
  ChevronRight,
  Home
} from 'lucide-react';
import './styles.css';
import { generateQuestionPool, getReviewConcepts, getIncorrectQuestions } from './utils/quizEngine';
import { findConceptKey, getAllConceptKeys } from './utils/quizGenerator';
import { getConceptsToReview, getScoreCategory, getScoreMessage, getPersonalizedFeedback, recommendNextScenario } from './utils/quizScoring';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const JOURNEY_STEPS = [
  { id: 'explorer', label: 'Scenario Explorer', icon: Compass },
  { id: 'workspace', label: 'Learning Workspace', icon: Brain },
  { id: 'summary', label: 'Session Summary', icon: Sparkles },
  { id: 'mentor', label: 'AI Mentor', icon: Lightbulb },
  { id: 'w3h', label: 'W\u00b3H Guide', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: Code2 },
  { id: 'review', label: 'Review', icon: MessageSquareText },
  { id: 'dashboard', label: 'Dashboard', icon: ChartNoAxesCombined },
];

function TopNav({ view, setView, xp, streak, journeyStep }) {
  return (
    <nav className="top-nav">
      <div className="top-nav-brand">
        <Brain size={24} />
        <span>PyBe</span>
      </div>
      <div className="top-nav-steps">
        {JOURNEY_STEPS.map((step, idx) => {
          const isActive = view === step.id;
          const isCompleted = idx < journeyStep;
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              className={`nav-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => setView(step.id)}
              title={step.label}
            >
              <span className="nav-step-icon"><Icon size={16} /></span>
              <span className="nav-step-label">{step.label}</span>
              {isCompleted && <span className="nav-step-check">&#10003;</span>}
            </button>
          );
        })}
      </div>
      <div className="top-nav-stats">
        <span className="nav-xp">&#9733; {xp} XP</span>
        <span className="nav-streak">&#128293; {streak}</span>
      </div>
    </nav>
  );
}

function JourneyProgress({ currentStep, onStepClick }) {
  return (
    <div className="journey-progress">
      {JOURNEY_STEPS.map((step, idx) => (
        <button
          key={step.id}
          className={`journey-step ${idx === currentStep ? 'current' : ''} ${idx < currentStep ? 'done' : ''}`}
          onClick={() => onStepClick(step.id)}
        >
          <span className="journey-step-num">{idx + 1}</span>
          <span className="journey-step-label">{step.label}</span>
        </button>
      ))}
    </div>
  );
}

function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </header>
  );
}

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
  const [view, setView] = useState('explorer');
  const [quizData, setQuizData] = useState(null);
  const [journeyStep, setJourneyStep] = useState(0);
  const [viewedScenarios, setViewedScenarios] = useState(new Set());

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

  function handleStartScenario(scenario) {
    setSelected(scenario);
    setActiveResult(null);
    setView('workspace');
    setJourneyStep(1);
    setViewedScenarios(prev => new Set([...prev, scenario._id]));
  }

  function handleCompleteSession() {
    setView('summary');
    setJourneyStep(2);
  }

  function handleViewMentor() {
    setView('mentor');
    setJourneyStep(3);
  }

  function handleViewW3H() {
    setView('w3h');
    setJourneyStep(4);
  }

  function handleTakeQuiz() {
    setQuizData({
      session: activeResult,
      scenario: selected,
      difficulty: 1,
      score: 0,
      questionsSeen: 0,
      concept: activeResult?.abstractionMap?.[0]?.pythonConcept || 'variables'
    });
    setView('quiz');
    setJourneyStep(5);
  }

  function handleViewDashboard() {
    setView('dashboard');
    setJourneyStep(7);
  }

  function handleGoHome() {
    setView('explorer');
    setJourneyStep(0);
    setActiveResult(null);
  }

  return (
    <main className="app-shell">
      <TopNav view={view} setView={setView} xp={xp} streak={streak} journeyStep={journeyStep} />

      <div className="page-breadcrumb">
        <button className="breadcrumb-home" onClick={handleGoHome}>
          <Home size={14} /> Home
        </button>
        {JOURNEY_STEPS.filter(s => ['workspace', 'summary', 'mentor', 'w3h', 'quiz', 'review', 'dashboard'].includes(s.id)).map((step, idx) => (
          <React.Fragment key={step.id}>
            <ChevronRight size={14} />
            <button
              className={`breadcrumb-step ${view === step.id ? 'active' : ''}`}
              onClick={() => {
                if (step.id === 'dashboard') handleViewDashboard();
                else if (step.id === 'mentor' && activeResult) handleViewMentor();
                else if (step.id === 'w3h' && activeResult) handleViewW3H();
                else if (step.id === 'quiz' && activeResult) handleTakeQuiz();
                else if (step.id === 'summary' && activeResult) handleCompleteSession();
                else if (step.id === 'workspace' && selected) setView('workspace');
              }}
              disabled={
                (step.id === 'workspace' && !selected) ||
                (step.id === 'summary' && !activeResult) ||
                (step.id === 'mentor' && !activeResult) ||
                (step.id === 'w3h' && !activeResult) ||
                (step.id === 'quiz' && !activeResult)
              }
            >
              {step.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      <section className="page-content">
        {view === 'quiz' && quizData ? (
          <QuizPage
            quizData={quizData}
            setQuizData={setQuizData}
            xp={xp}
            setXp={setXp}
            onExit={handleViewDashboard}
            scenarios={scenarios}
            onSelectScenario={(scenario) => {
              setSelected(scenario);
              setActiveResult(null);
              setView('explorer');
              setJourneyStep(0);
            }}
          />
        ) : view === 'explorer' ? (
          <ExplorerPage
            scenarios={scenarios}
            selected={selected}
            filters={filters}
            setFilters={setFilters}
            concepts={concepts}
            onSelectScenario={handleStartScenario}
            analytics={analytics}
            roadmap={roadmap}
            sessions={sessions}
          />
        ) : view === 'workspace' ? (
          <WorkspacePage
            selected={selected}
            form={form}
            setForm={setForm}
            submitting={submitting}
            onSubmit={submitSession}
            onComplete={handleCompleteSession}
            onViewMentor={handleViewMentor}
            activeResult={activeResult}
          />
        ) : view === 'summary' ? (
          <SummaryPage
            result={activeResult}
            selected={selected}
            onViewMentor={handleViewMentor}
            onTakeQuiz={handleTakeQuiz}
            onChangeScenario={() => setView('explorer')}
          />
        ) : view === 'mentor' ? (
          <MentorPage
            result={activeResult}
            selected={selected}
            onViewW3H={handleViewW3H}
            onTakeQuiz={handleTakeQuiz}
          />
        ) : view === 'w3h' ? (
          <W3HPage
            result={activeResult}
            onTakeQuiz={handleTakeQuiz}
            onViewDashboard={handleViewDashboard}
          />
        ) : view === 'dashboard' ? (
          <DashboardPage
            analytics={analytics}
            roadmap={roadmap}
            sessions={sessions}
            xp={xp}
            streak={streak}
            onSelectScenario={(scenario) => {
              setSelected(scenario);
              setActiveResult(null);
              setView('workspace');
              setJourneyStep(1);
            }}
          />
        ) : null}
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

function QuizPage({ quizData, setQuizData, xp, setXp, onExit, scenarios, onSelectScenario }) {
  const QUIZ_LENGTH = 7;
  const MAX_HEARTS = 3;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const diff = quizData.difficulty || 1;
    const session = quizData.session || null;
    const pool = generateQuestionPool(quizData.concept, QUIZ_LENGTH, session);
    setQuestions(pool);
    setAnswers(new Array(pool.length).fill(null));
    setCurrentIndex(0);
    setShowFeedback(false);
    setSessionCorrect(0);
    setSessionXp(0);
    setHearts(MAX_HEARTS);
    setGameOver(false);
    setQuizStarted(true);
  }, [quizData.concept, quizData.difficulty]);

  if (!quizStarted || questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <div className="quiz-loading-icon">&#128640;</div>
          <h2>Preparing your quiz...</h2>
          <p>Personalizing questions based on your session</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const reviewConcepts = getConceptsToReview(questions, answers);
    const incorrect = getIncorrectQuestions(questions, answers);

    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <button className="quiz-exit" onClick={onExit}>&#8592; Back to Learning</button>
          <span>XP: {xp}</span>
        </div>
        <div className="quiz-card quiz-game-over">
          <div className="quiz-game-over-icon">&#128148;</div>
          <h2>Practice Complete</h2>
          <p>Review your mistakes before trying again.</p>

          {incorrect.length > 0 && (
            <div className="quiz-review-section">
              <h3>Questions to Review</h3>
              {incorrect.map((item, idx) => (
                <div key={idx} className="quiz-review-item">
                  <p className="review-question"><strong>Q:</strong> {item.question.q}</p>
                  <p className="review-correct"><strong>Correct:</strong> {item.correctAnswer}</p>
                  <p className="review-explanation"><strong>Why:</strong> {item.explanation}</p>
                  <p className="review-concept">Concept: {item.concept}</p>
                </div>
              ))}
            </div>
          )}

          <div className="quiz-end-actions">
            <button className="secondary quiz-retry" onClick={() => {
              const session = quizData.session || null;
              const pool = generateQuestionPool(quizData.concept, QUIZ_LENGTH, session);
              setQuestions(pool);
              setAnswers(new Array(pool.length).fill(null));
              setCurrentIndex(0);
              setShowFeedback(false);
              setSessionCorrect(0);
              setSessionXp(0);
              setHearts(MAX_HEARTS);
              setGameOver(false);
            }}>
              &#8635; Retry Quiz
            </button>
            <button className="primary quiz-continue" onClick={onExit}>
              Return to Learning &#8594;
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isCurrentAnswered = currentAnswer !== null;
  const isFinished = currentIndex >= questions.length;
  const hasPrevious = currentIndex > 0;
  const difficulty = quizData.difficulty || 1;
  const progressPct = Math.round((currentIndex / questions.length) * 100);

  function handleSelect(idx) {
    if (showFeedback) return;
    const correct = idx === currentQuestion.correctIdx;
    const earnedXp = correct ? 5 + difficulty * 2 : 1;
    const newXp = xp + earnedXp;
    setXp(newXp);
    localStorage.setItem('pybe_xp', String(newXp));

    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);
    setShowFeedback(true);
    if (correct) {
      setSessionCorrect(prev => prev + 1);
    } else {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setTimeout(() => setGameOver(true), 1500);
      }
    }
    setSessionXp(prev => prev + earnedXp);
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(answers[currentIndex + 1] !== null);
    } else {
      setCurrentIndex(questions.length);
    }
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowFeedback(answers[currentIndex - 1] !== null);
    }
  }

  function handleFinish() {
    setQuizData(prev => ({
      ...prev,
      score: (prev.score || 0) + sessionCorrect,
      questionsSeen: (prev.questionsSeen || 0) + questions.length
    }));
    onExit();
  }

  if (isFinished) {
    const pct = Math.round((sessionCorrect / questions.length) * 100);
    const category = getScoreCategory(sessionCorrect, questions.length);
    const message = getScoreMessage(category);
    const reviewConcepts = getConceptsToReview(questions, answers);
    const incorrect = getIncorrectQuestions(questions, answers);
    const personalizedFeedback = getPersonalizedFeedback(sessionCorrect, questions.length, quizData.session, reviewConcepts);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const timeLabel = timeTaken < 60 ? `${timeTaken}s` : `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;
    const recommendedScenario = recommendNextScenario(scenarios, quizData.scenario, quizData.session, reviewConcepts);

    return (
      <div className="quiz-page">
        <div className="quiz-header">
          <button className="quiz-exit" onClick={onExit}>&#8592; Back</button>
          <span>XP: {xp}</span>
        </div>

        {pct === 100 && (
          <div className="quiz-confetti">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#d8f07c', '#4a9a20', '#f59e0b', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 5)]
              }} />
            ))}
          </div>
        )}

        <div className="quiz-card quiz-end">
          <div className="quiz-end-icon">
            {pct >= 70 ? '&#127942;' : pct >= 50 ? '&#128516;' : '&#128528;'}
          </div>
          <h2>Quiz Summary</h2>
          <p className="quiz-personalized-feedback">{personalizedFeedback}</p>

          <div className="quiz-end-stats">
            <div className="quiz-end-stat">
              <span className="quiz-end-num">{sessionCorrect}/{questions.length}</span>
              <small>Correct</small>
            </div>
            <div className="quiz-end-stat">
              <span className="quiz-end-num">{pct}%</span>
              <small>Accuracy</small>
            </div>
            <div className="quiz-end-stat">
              <span className="quiz-end-num">+{sessionXp}</span>
              <small>XP Earned</small>
            </div>
            <div className="quiz-end-stat">
              <span className="quiz-end-num">{timeLabel}</span>
              <small>Time</small>
            </div>
          </div>

          {incorrect.length > 0 && (
            <div className="quiz-review-section">
              <h3>Questions to Review</h3>
              {incorrect.map((item, idx) => (
                <div key={idx} className="quiz-review-item">
                  <p className="review-question"><strong>Question:</strong> {item.question.q}</p>
                  <p className="review-correct"><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                  <p className="review-explanation"><strong>Why it is correct:</strong> {item.explanation}</p>
                  <p className="review-concept">Python Concept: <span className="review-concept-tag">{item.concept}</span></p>
                </div>
              ))}
            </div>
          )}

          {recommendedScenario && (
            <div className="quiz-recommended">
              <h3>Recommended Next Challenge</h3>
              <div className="quiz-recommended-card">
                <div className="recommended-scenario-info">
                  <strong>{recommendedScenario.title}</strong>
                  <span className="recommended-difficulty">{recommendedScenario.difficulty}</span>
                  <p>{recommendedScenario.concepts?.join(' / ')}</p>
                </div>
                <button
                  className="primary recommended-start"
                  onClick={() => {
                    handleFinish();
                    if (onSelectScenario) {
                      setTimeout(() => onSelectScenario(recommendedScenario), 100);
                    }
                  }}
                >
                  Start Next Scenario &#8594;
                </button>
              </div>
            </div>
          )}

          <div className="quiz-end-actions">
            <button className="secondary quiz-retry" onClick={() => {
              const session = quizData.session || null;
              const pool = generateQuestionPool(quizData.concept, QUIZ_LENGTH, session);
              setQuestions(pool);
              setAnswers(new Array(pool.length).fill(null));
              setCurrentIndex(0);
              setShowFeedback(false);
              setSessionCorrect(0);
              setSessionXp(0);
              setHearts(MAX_HEARTS);
              setGameOver(false);
            }}>
              &#8635; Retry Quiz
            </button>
            <button className="primary quiz-continue" onClick={handleFinish}>
              Continue Learning &#8594;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <button className="quiz-exit" onClick={onExit}>&#8592; Back</button>
        <div className="quiz-hearts">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={`heart ${i < hearts ? 'active' : 'lost'}`}>
              {i < hearts ? '\u2764\ufe0f' : '\u2661'}
            </span>
          ))}
        </div>
        <span className="quiz-score">Score: {sessionCorrect}</span>
      </div>

      <div className="quiz-progress-container">
        <div className="quiz-progress-info">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progressPct}% complete</span>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="quiz-card">
        <div className="quiz-concept">{currentQuestion.concept}</div>
        {currentQuestion.isSessionAware && (
          <div className="quiz-session-badge">Based on your session</div>
        )}
        <h2 className="quiz-question">{currentQuestion.q}</h2>

        <div className="quiz-options">
          {currentQuestion.opts.map((opt, idx) => {
            let cls = 'quiz-option';
            if (showFeedback) {
              if (idx === currentQuestion.correctIdx) {
                cls += ' reveal correct-anim';
              } else if (idx === currentAnswer) {
                cls += ' wrong wrong-anim';
              }
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={showFeedback}
              >
                <span className="quiz-option-marker">{String.fromCharCode(65 + idx)}</span>
                <span className="quiz-option-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`quiz-feedback${currentAnswer === currentQuestion.correctIdx ? ' correct' : ' wrong'}`}>
            <div className="quiz-feedback-header">
              {currentAnswer === currentQuestion.correctIdx ? (
                <span className="feedback-icon correct">&#10003;</span>
              ) : (
                <span className="feedback-icon wrong">&#10007;</span>
              )}
              <strong>{currentAnswer === currentQuestion.correctIdx ? 'Correct!' : 'Not quite right'}</strong>
            </div>
            {currentAnswer !== currentQuestion.correctIdx && (
              <p className="quiz-feedback-selected">
                You selected: <em>{currentQuestion.opts[currentAnswer]}</em>
              </p>
            )}
            <p className="quiz-feedback-why">{currentQuestion.exp}</p>
            <p className="quiz-feedback-concept">This reinforces: <strong>{currentQuestion.concept}</strong></p>
          </div>
        )}

        <div className="quiz-nav">
          {hasPrevious && (
            <button
              className="secondary quiz-prev"
              onClick={handlePrevious}
              disabled={!isCurrentAnswered}
            >
              &#8592; Previous
            </button>
          )}
          <button
            className="primary quiz-next"
            onClick={handleNext}
            disabled={!showFeedback}
          >
            {currentIndex + 1 < questions.length ? 'Next Question \u2192' : 'See Results \u2192'}
          </button>
        </div>
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

function ExplorerPage({ scenarios, selected, filters, setFilters, concepts, onSelectScenario, analytics, roadmap, sessions }) {
  return (
    <div className="page explorer-page">
      <PageHeader
        title="Scenario Explorer"
        subtitle="Choose a scenario to begin your Python learning journey"
      />

      <div className="explorer-layout">
        <aside className="explorer-sidebar">
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
                onClick={() => onSelectScenario(scenario)}
              >
                <span>{scenario.difficulty}</span>
                <strong>{scenario.title}</strong>
                <small>{scenario.concepts.join(' / ')}</small>
              </button>
            ))}
          </div>
        </aside>

        <div className="explorer-main">
          <div className="explorer-hero">
            <div>
              <p className="hero-tag">AI-native learning journey</p>
              <h1>Learn Python by reasoning through real situations first.</h1>
            </div>
            <div className="hero-stats">
              <span>{analytics?.scenarioCount || 0}<small>Scenarios</small></span>
              <span>{analytics?.sessionCount || 0}<small>Sessions</small></span>
              <span>{analytics?.averagePromptScore || 0}<small>Prompt score</small></span>
            </div>
          </div>

          <div className="explorer-dashboard">
            <div className="panel">
              <div className="section-title"><ChartNoAxesCombined size={20} /><h2>Learning Analytics</h2></div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkspacePage({ selected, form, setForm, submitting, onSubmit, onComplete, onViewMentor, activeResult }) {
  return (
    <div className="page workspace-page">
      <PageHeader
        title={selected?.title || 'Learning Workspace'}
        subtitle={selected?.context}
      >
        {activeResult && (
          <button className="secondary" onClick={onViewMentor}>
            View AI Mentor <ChevronRight size={16} />
          </button>
        )}
      </PageHeader>

      <div className="workspace-layout">
        <section className="panel learning-panel">
          <div className="section-title">
            <Compass size={20} />
            <h2>Your Learning Task</h2>
          </div>
          <div className="objective-row">
            {selected?.objectives?.map((item) => <span key={item}>{item}</span>)}
          </div>
          <form onSubmit={onSubmit} className="learning-form">
            <label>
              Your reasoning
              <div className="textarea-row">
                <textarea
                  required
                  value={form.reasoning}
                  onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, promptText: e.target.value })}
                  placeholder="Explain my approach step by step..."
                />
                <VoiceInput value={form.promptText} onChange={(v) => setForm({ ...form, promptText: v })} />
              </div>
            </label>
            <label>
              Reflection
              <div className="textarea-row">
                <textarea
                  value={form.reflection}
                  onChange={(e) => setForm({ ...form, reflection: e.target.value })}
                  placeholder="What did you notice about your thinking?"
                />
                <VoiceInput value={form.reflection} onChange={(v) => setForm({ ...form, reflection: v })} />
              </div>
            </label>
            <div className="form-actions">
              <button type="submit" className="primary" disabled={submitting}>
                <Send size={18} />{submitting ? 'Mapping...' : 'Submit & Continue'}
              </button>
            </div>
          </form>
        </section>

        <section className="panel result-panel">
          <div className="section-title">
            <Sparkles size={20} />
            <h2>AI Mentor Output</h2>
          </div>
          {!activeResult ? (
            <div className="empty">
              <Lightbulb size={38} />
              <p>Submit your reasoning to see AI Mentor analysis and begin your quiz journey.</p>
            </div>
          ) : (
            <div className="workspace-result-preview">
              <div className="score"><span>{activeResult.promptScore}</span><small>Prompt maturity</small></div>
              {activeResult.abstractionMap?.map((item) => (
                <article className="mapping" key={item.pattern}>
                  <strong>{item.pattern}</strong>
                  <span>{item.pythonConcept}</span>
                  <p>{item.explanation}</p>
                </article>
              ))}
              <div className="code-block">
                <div><Code2 size={18} /> Generated Python</div>
                <pre>{activeResult.generatedCode}</pre>
              </div>
            </div>
          )}
        </section>
      </div>

      {activeResult && (
        <div className="workspace-next">
          <button className="primary" onClick={onComplete}>
            Continue to Session Summary <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryPage({ result, selected, onViewMentor, onTakeQuiz, onChangeScenario }) {
  if (!result) {
    return (
      <div className="page summary-page">
        <div className="empty-state">
          <p>No session data available. Please complete a learning session first.</p>
          <button className="primary" onClick={onChangeScenario}>Choose a Scenario</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page summary-page">
      <PageHeader
        title="Session Summary"
        subtitle={`You completed: ${selected?.title}`}
      >
        <button className="secondary" onClick={onChangeScenario}>Change Scenario</button>
      </PageHeader>

      <div className="summary-layout">
        <div className="summary-main">
          <div className="panel summary-score-panel">
            <div className="summary-score">
              <span className="score-big">{result.promptScore}</span>
              <small>Prompt Maturity Score</small>
            </div>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-num">{result.abstractionMap?.length || 0}</span>
                <small>Concepts Mapped</small>
              </div>
              <div className="summary-stat">
                <span className="stat-num">{result.earnedXp || 0}</span>
                <small>XP Earned</small>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="section-title"><Brain size={20} /><h2>Abstraction Map</h2></div>
            {result.abstractionMap?.map((item) => (
              <article className="mapping" key={item.pattern}>
                <strong>{item.pattern}</strong>
                <span>{item.pythonConcept}</span>
                <p>{item.explanation}</p>
              </article>
            ))}
          </div>

          <div className="panel">
            <div className="section-title"><Code2 size={20} /><h2>Generated Python Code</h2></div>
            <div className="code-block">
              <pre>{result.generatedCode}</pre>
            </div>
            <p>{result.codeExplanation}</p>
          </div>

          <div className="panel">
            <div className="section-title"><MessageSquareText size={20} /><h2>Prompt Feedback</h2></div>
            <ul className="feedback">
              {result.promptFeedback?.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="summary-actions">
          <button className="primary" onClick={onViewMentor}>
            <Lightbulb size={18} /> View AI Mentor Analysis
          </button>
          <button className="primary quiz-cta" onClick={onTakeQuiz}>
            <Sparkles size={18} /> Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

function MentorPage({ result, selected, onViewW3H, onTakeQuiz }) {
  if (!result) {
    return (
      <div className="page mentor-page">
        <div className="empty-state">
          <p>No mentor analysis available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page mentor-page">
      <PageHeader
        title="AI Mentor Analysis"
        subtitle={`Deep dive into your ${result.abstractionMap?.[0]?.pythonConcept || 'learning'} understanding`}
      >
        <button className="secondary" onClick={onViewW3H}>View W\u00b3H Guide <ChevronRight size={16} /></button>
      </PageHeader>

      <div className="mentor-layout">
        <div className="panel mentor-insights">
          <div className="section-title"><Sparkles size={20} /><h2>Mentor Insights</h2></div>

          <div className="mentor-score">
            <div className="score"><span>{result.promptScore}</span><small>Prompt Maturity</small></div>
          </div>

          {result.abstractionMap?.map((item) => (
            <article className="mapping" key={item.pattern}>
              <strong>{item.pattern}</strong>
              <span>{item.pythonConcept}</span>
              <p>{item.explanation}</p>
            </article>
          ))}

          <div className="code-block">
            <div><Code2 size={18} /> Generated Python</div>
            <pre>{result.generatedCode}</pre>
            <p>{result.codeExplanation}</p>
          </div>

          <ul className="feedback">
            {result.promptFeedback?.map((item) => <li key={item}>{item}</li>)}
          </ul>

          {result.misconceptions?.length > 0 && (
            <div className="note misconception-note">
              <strong>Misconception Watch</strong>
              {result.misconceptions.map((item) => <p key={item}>{item}</p>)}
            </div>
          )}
        </div>

        <div className="mentor-actions">
          <button className="primary" onClick={onViewW3H}>
            <BookOpen size={18} /> Explore W\u00b3H Guide
          </button>
          <button className="primary quiz-cta" onClick={onTakeQuiz}>
            <Sparkles size={18} /> Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

function W3HPage({ result, onTakeQuiz, onViewDashboard }) {
  if (!result) {
    return (
      <div className="page w3h-page">
        <div className="empty-state">
          <p>No W\u00b3H data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page w3h-page">
      <PageHeader
        title="W\u00b3H Learning Guide"
        subtitle="Understand your learning from four perspectives"
      >
        <button className="secondary" onClick={onViewDashboard}>Go to Dashboard <ChevronRight size={16} /></button>
      </PageHeader>

      <div className="w3h-layout">
        <div className="w3h-main">
          <W3H result={result} />
        </div>

        <div className="w3h-actions">
          <button className="primary quiz-cta" onClick={onTakeQuiz}>
            <Sparkles size={18} /> Take Quiz
          </button>
          <button className="secondary" onClick={onViewDashboard}>
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ analytics, roadmap, sessions, xp, streak, onSelectScenario }) {
  return (
    <div className="page dashboard-page">
      <PageHeader
        title="Your Dashboard"
        subtitle="Track your learning progress and achievements"
      />

      <div className="dashboard-layout">
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-icon">&#9733;</span>
            <span className="stat-value">{xp}</span>
            <span className="stat-label">Total XP</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#128293;</span>
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#128202;</span>
            <span className="stat-value">{analytics?.sessionCount || 0}</span>
            <span className="stat-label">Sessions</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">&#10003;</span>
            <span className="stat-value">{analytics?.averagePromptScore || 0}</span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>

        <div className="dashboard-panels">
          <div className="panel">
            <div className="section-title"><ChartNoAxesCombined size={20} /><h2>Concept Analytics</h2></div>
            <Analytics analytics={analytics} />
          </div>

          <div className="panel">
            <div className="section-title"><Route size={20} /><h2>Learning Roadmap</h2></div>
            <Roadmap roadmap={roadmap} />
          </div>

          <div className="panel">
            <div className="section-title"><MessageSquareText size={20} /><h2>Recent Sessions</h2></div>
            <SessionList sessions={sessions} />
          </div>
        </div>

        <div className="dashboard-next">
          <h3>Continue Learning</h3>
          <p>Choose a scenario to practice what you have learned.</p>
          <button className="primary" onClick={() => onSelectScenario(null)}>
            <Compass size={18} /> Explore Scenarios
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
