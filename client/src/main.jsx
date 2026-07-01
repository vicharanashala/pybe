import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronRight, Home } from 'lucide-react';
import './styles.css';
import { saveSessionState, loadSessionState } from './utils/sessionRecovery';
import { loadPassport, savePassport, updatePassportFromSession, updateStampAccuracy, PYTHON_CONCEPTS } from './utils/passport';
import { TopNav } from './components/TopNavigation';
import { ExplorerPage, WorkspacePage, SummaryPage, MentorPage, W3HPage, QuizPage, DashboardPage, PassportPage } from './pages';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const JOURNEY_STEPS = [
  { id: 'explorer', label: 'Scenario Explorer' },
  { id: 'workspace', label: 'Learning Workspace' },
  { id: 'summary', label: 'Session Summary' },
  { id: 'mentor', label: 'AI Mentor' },
  { id: 'w3h', label: 'W\u00b3H Guide' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'passport', label: 'Passport' },
];

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
  const [sessionRestored, setSessionRestored] = useState(false);
  const [passport, setPassport] = useState(() => loadPassport());
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [showBadgeCelebration, setShowBadgeCelebration] = useState(null);
  const [showStampCelebration, setShowStampCelebration] = useState(null);

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

    if (!sessionRestored) {
      const saved = loadSessionState(scenarioData);
      if (saved) {
        if (saved.xp !== undefined) {
          setXp(saved.xp);
          localStorage.setItem('pybe_xp', String(saved.xp));
        }
        if (saved.streak !== undefined) {
          setStreak(saved.streak);
          localStorage.setItem('pybe_streak', String(saved.streak));
        }
        if (saved.view && ['explorer', 'workspace', 'summary', 'mentor', 'w3h', 'quiz', 'dashboard'].includes(saved.view)) {
          setView(saved.view);
          if (saved.view !== 'explorer') {
            if (saved.selected) setSelected(saved.selected);
            if (saved.activeResult) setActiveResult(saved.activeResult);
            if (saved.journeyStep !== undefined) setJourneyStep(saved.journeyStep);
            if (saved.form) setForm(saved.form);
            if (saved.quizData) setQuizData(saved.quizData);
          }
        }
      }
      setSessionRestored(true);
    }
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [filters.q, filters.difficulty, filters.concept]);

  useEffect(() => {
    if (!loading && sessionRestored) {
      saveSessionState({
        selected,
        activeResult,
        journeyStep,
        view,
        quizData,
        form,
        xp,
        streak
      });
    }
  }, [selected, activeResult, journeyStep, view, quizData, form, xp, streak, loading, sessionRestored]);

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

      const existingStamps = Object.keys(passport.stamps || {});
      const updatedPassport = updatePassportFromSession(passport, { ...result, scenario: selected, earnedXp }, Math.round(result.promptScore));
      const newConcepts = (selected?.concepts || []).filter(c => !existingStamps.includes(c));
      if (newConcepts.length > 0) {
        setNewlyUnlocked(newConcepts);
        updatedPassport.lastNewStamp = newConcepts[0];
      }
      setPassport(updatedPassport);
      savePassport(updatedPassport);
      if (updatedPassport.lastBadgeUnlocked) {
        setShowBadgeCelebration(updatedPassport.lastBadgeUnlocked);
      }
      if (updatedPassport.lastNewStamp) {
        setShowStampCelebration(PYTHON_CONCEPTS.find(c => c.id === updatedPassport.lastNewStamp));
      }

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
        {JOURNEY_STEPS.filter(s => ['workspace', 'summary', 'mentor', 'w3h', 'quiz', 'dashboard'].includes(s.id)).map((step, idx) => (
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
            onQuizComplete={(conceptAccuracies) => {
              const previousStamps = Object.keys(passport.stamps || {});
              const updated = updateStampAccuracy(passport, conceptAccuracies);
              const newlyMastered = Object.keys(updated.stamps).filter(id =>
                !previousStamps.includes(id) || (updated.stamps[id].status === 'mastered' && passport.stamps[id]?.status !== 'mastered')
              );
              setNewlyUnlocked(newlyMastered);
              setPassport(updated);
              savePassport(updated);
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
            passport={passport}
            onSelectScenario={(scenario) => {
              setSelected(scenario || null);
              setActiveResult(null);
              setView('explorer');
              setJourneyStep(0);
            }}
            onOpenPassport={() => setView('passport')}
          />
        ) : view === 'passport' ? (
          <PassportPage
            passport={passport}
            xp={xp}
            streak={streak}
            sessions={sessions}
            onClose={() => setView('dashboard')}
            onDismissBadge={() => setShowBadgeCelebration(null)}
            onDismissStamp={() => setShowStampCelebration(null)}
            newlyUnlocked={newlyUnlocked}
          />
        ) : null}
      </section>

      {showBadgeCelebration && (
        <BadgeCelebration
          badge={showBadgeCelebration}
          onClose={() => setShowBadgeCelebration(null)}
        />
      )}
      {showStampCelebration && (
        <StampCelebration
          concept={showStampCelebration}
          onClose={() => setShowStampCelebration(null)}
        />
      )}
    </main>
  );
}

function BadgeCelebration({ badge, onClose }) {
  return (
    <div className="celebration-overlay" onClick={onClose}>
      <div className="celebration-modal">
        <div className="celebration-sparkles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="sparkle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              backgroundColor: ['#d8f07c', '#4a9a20', '#f59e0b', '#3b82f6', '#ef4444', '#a855f7'][Math.floor(Math.random() * 6)]
            }} />
          ))}
        </div>
        <div className="celebration-content">
          <h2>Congratulations!</h2>
          <p>You earned</p>
          <div className="celebration-badge">{badge.icon}</div>
          <h3>{badge.name} {badge.title}</h3>
          <p className="celebration-subtitle">Keep learning to unlock more badges!</p>
          <button className="primary" onClick={onClose}>Continue</button>
        </div>
      </div>
    </div>
  );
}

function StampCelebration({ concept, onClose }) {
  return (
    <div className="celebration-overlay stamp-celebration" onClick={onClose}>
      <div className="celebration-modal small">
        <div className="stamp-appear">
          <div className="stamp-anim-icon">{concept.icon}</div>
        </div>
        <h3>New Stamp Unlocked!</h3>
        <p><strong>{concept.name}</strong></p>
        <small>{concept.description}</small>
        <button className="primary" onClick={onClose}>Collect</button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);