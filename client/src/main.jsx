import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain, Code2, Compass, Lightbulb, MessageSquareText,
  Play, Search, Send, Sparkles, Award,
  TrendingUp, Target, Calendar, AlertTriangle, BarChart3, BookOpen, Layers,
  Bookmark, BookmarkCheck, Trophy, Moon, Sun, Star, Zap, Crown, Globe, Clock,
  MessageCircle, ClipboardCheck, HelpCircle, CalendarDays, Network, BarChart2,
  ChevronRight, CheckCircle, XCircle, AlertCircle, Info
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const response = await fetch(API_URL + path, { ...options, headers });
  if (!response.ok) { const text = await response.text(); throw new Error(text); }
  return response.json();
}

function getAchievements(analytics) {
  const count = analytics?.sessionCount || 0;
  const avg = analytics?.averagePromptScore || 0;
  const longest = analytics?.streak?.longest || 0;
  const mastered = analytics?.conceptMastery
    ? Object.entries(analytics.conceptMastery).filter(([, s]) => s.level === 'mastered').length
    : 0;
  const badges = [];
  if (count >= 1) badges.push({ id: 'first', name: 'First Session', icon: Trophy });
  if (count >= 5) badges.push({ id: 'five', name: 'Getting Started', icon: Star });
  if (count >= 10) badges.push({ id: 'ten', name: 'Double Digits', icon: Award });
  if (count >= 25) badges.push({ id: 'twentyfive', name: 'Quarter Century', icon: Globe });
  if (avg >= 85) badges.push({ id: 'high_avg', name: 'High Performer', icon: Crown });
  if (longest >= 3) badges.push({ id: 'streak_3', name: '3-Day Streak', icon: Zap });
  if (longest >= 7) badges.push({ id: 'streak_7', name: 'Week Warrior', icon: Crown });
  if (mastered >= 1) badges.push({ id: 'first_mastered', name: 'First Mastered', icon: Crown });
  if (mastered >= 3) badges.push({ id: 'mastery_3', name: 'Concept Explorer', icon: Trophy });
  if (count >= 2 && avg > 0) badges.push({ id: 'improvement', name: 'Rising Star', icon: Star });
  return badges;
}

function App() {
  const [scenarios, setScenarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trends, setTrends] = useState(null);
  const [filters, setFilters] = useState({ q: '', difficulty: '', concept: '' });
  const [form, setForm] = useState({ learnerName: 'Guest learner', reasoning: '', promptText: '', reflection: '' });
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('pybe_dark') === 'true');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const timerRef = useRef(null);

  const concepts = useMemo(() => [...new Set(scenarios.flatMap((s) => s.concepts || []))].sort(), [scenarios]);

  const [bookmarks, setBookmarksState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pybe_bookmarks') || '[]'); } catch { return []; }
  });
  const setBookmarks = useCallback(b => {
    setBookmarksState(b);
    localStorage.setItem('pybe_bookmarks', JSON.stringify(b));
  }, []);

  const badges = useMemo(() => getAchievements(analytics), [analytics]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('pybe_dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => setTimerElapsed(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  function handleSelect(scenario) {
    setSelected(scenario);
    setActiveResult(null);
    setActiveTab('learn');
    setTimerRunning(true);
    setTimerElapsed(0);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  async function refresh() {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    try {
      const [sc, se, an, ro, re, tr] = await Promise.all([
        api('/scenarios?' + params), api('/sessions'), api('/analytics'),
        api('/roadmap'), api('/recommendations').catch(() => []), api('/analytics/trends').catch(() => null)
      ]);
      setScenarios(sc); setSessions(se); setAnalytics(an); setRoadmap(ro);
      setRecommendations(re); setTrends(tr);
      if (!selected && sc[0]) setSelected(sc[0]);
      setLoading(false);
    } catch (e) { console.error(e); setLoading(false); }
  }

  useEffect(() => { refresh().catch(console.error); }, [filters.q, filters.difficulty, filters.concept]);

  async function submitSession(e) {
    e.preventDefault();
    if (!selected || !form.reasoning.trim()) return;
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const timeSpent = timerElapsed;
    setSubmitting(true);
    try {
      const result = await api('/sessions', { method: 'POST', body: JSON.stringify({ ...form, scenarioId: selected._id, timeSpent }) });
      setActiveResult(result);
      setForm({ ...form, reasoning: '', promptText: '', reflection: '' });
      await refresh();
    } finally { setSubmitting(false); }
  }

  if (loading) return <main className="loading">Loading PyBe...</main>;

  return (
    <main className={`app-shell${darkMode ? ' dark' : ''}`}>
      <aside className="sidebar">
        <div className="brand"><Brain size={30} /><div><strong>PyBe</strong><span>Scenario-first Python</span></div></div>

        <button className="icon-btn dark-toggle" onClick={() => setDarkMode(d => !d)} title="Toggle dark mode">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <label className="search"><Search size={18} />
          <input value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} placeholder="Search scenarios" />
        </label>

        <select value={filters.difficulty} onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))}>
          <option value="">All levels</option>
          <option>Beginner</option><option>Explorer</option><option>Builder</option>
        </select>

        <select value={filters.concept} onChange={e => setFilters(f => ({ ...f, concept: e.target.value }))}>
          <option value="">All concepts</option>
          {concepts.map(c => <option key={c}>{c}</option>)}
        </select>

        <div className="scenario-list">
          {scenarios.map(sc => {
            const isBookmarked = bookmarks.includes(sc._id);
            return (
              <button key={sc._id} className={selected?._id === sc._id ? 'scenario active' : 'scenario'}
                onClick={() => handleSelect(sc)}>
                <span>
                  {sc.difficulty}
                  <span className="bookmark-icon" onClick={e => { e.stopPropagation(); toggleBookmark(sc._id); }}>
                    {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  </span>
                </span>
                <strong>{sc.title}</strong>
                <small>{sc.concepts.join(' / ')}</small>
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
            <span>{analytics?.streak?.current || 0}<small>Day streak</small></span>
          </div>
        </header>

        <nav className="tabs">
          <button className={activeTab === 'learn' ? 'tab active' : 'tab'} onClick={() => setActiveTab('learn')}><BookOpen size={16} /> Learn</button>
          <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}><BarChart3 size={16} /> Dashboard</button>
          <button className={activeTab === 'history' ? 'tab active' : 'tab'} onClick={() => setActiveTab('history')}><MessageSquareText size={16} /> History</button>
          <button className={activeTab === 'ai' ? 'tab active' : 'tab'} onClick={() => setActiveTab('ai')}><Sparkles size={16} /> AI Tools</button>
        </nav>

        {activeTab === 'learn' && (
          <>
            <div className="main-grid">
              <section className="panel learning-panel">
                <div className="section-title">
                  <Compass size={20} /><h2>{selected?.title || 'Select a scenario'}</h2>
                  {timerRunning && <span className="timer"><Clock size={14} /> {formatTime(timerElapsed)}</span>}
                </div>
                {selected?.context && <p className="context">{selected.context}</p>}
                {selected?.objectives && <div className="objective-row">{selected.objectives.map(o => <span key={o}>{o}</span>)}</div>}
                <form onSubmit={submitSession} className="learning-form">
                  <label>Your reasoning<textarea required value={form.reasoning} onChange={e => setForm(f => ({ ...f, reasoning: e.target.value }))} placeholder={selected?.prompt} /></label>
                  <label>Prompt you would give an AI mentor<textarea value={form.promptText} onChange={e => setForm(f => ({ ...f, promptText: e.target.value }))} placeholder="Explain my approach step by step..." /></label>
                  <label>Reflection<textarea value={form.reflection} onChange={e => setForm(f => ({ ...f, reflection: e.target.value }))} placeholder="What did you notice?" /></label>
                  <button className="primary" disabled={submitting}><Send size={18} />{submitting ? 'Mapping...' : 'Map My Reasoning'}</button>
                </form>
              </section>

              <section className="panel result-panel">
                <div className="section-title"><Sparkles size={20} /><h2>AI Mentor Output</h2></div>
                {!activeResult ? (
                  <div className="empty"><Lightbulb size={38} /><p>Submit reasoning to see abstraction mapping, Python code, prompt feedback, and misconception signals.</p></div>
                ) : (
                  <div className="result-stack">
                    <div className="score"><span>{activeResult.promptScore}</span><small>Prompt maturity</small></div>
                    {activeResult.promptClassification && <div className="classification"><strong>Interaction: {activeResult.promptClassification}</strong></div>}
                    {activeResult.promptDimensions && activeResult.promptDimensions.map(d => (
                      <div className="dim-bar" key={d.name}><span>{d.name}</span><meter min="0" max={d.max} value={d.score} /><strong>{d.score}/{d.max}</strong></div>
                    ))}
                    {activeResult.abstractionMap?.map(item => (
                      <article className="mapping" key={item.pattern}><strong>{item.pattern}</strong><span>{item.pythonConcept}</span><p>{item.explanation}</p></article>
                    ))}
                    <div className="code-block"><div><Code2 size={18} /> Generated Python</div><pre>{activeResult.generatedCode}</pre><p>{activeResult.codeExplanation}</p></div>
                    <ul className="feedback">{activeResult.promptFeedback?.map(i => <li key={i}>{i}</li>)}</ul>
                    {activeResult.misconceptions?.length > 0 && (
                      <div className="note"><strong>Misconception watch</strong>{activeResult.misconceptions.map(i => <p key={i}>{i}</p>)}</div>
                    )}
                  </div>
                )}
              </section>
            </div>
            {badges.length > 0 && (
              <div className="badge-bar">
                {badges.map(b => {
                  const Icon = b.icon;
                  return <span key={b.id} className="badge" title={b.desc}><Icon size={14} /> {b.name}</span>;
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'dashboard' && <Dashboard analytics={analytics} recommendations={recommendations} sessions={sessions} bookmarks={bookmarks} />}
        {activeTab === 'history' && <HistoryTab sessions={sessions} bookmarks={bookmarks} />}
        {activeTab === 'ai' && <AITools activeResult={activeResult} sessions={sessions} analytics={analytics} />}
      </section>
    </main>
  );

  function toggleBookmark(scenarioId) {
    const next = bookmarks.includes(scenarioId)
      ? bookmarks.filter(id => id !== scenarioId)
      : [...bookmarks, scenarioId];
    setBookmarks(next);
  }
}

function AITools({ activeResult, sessions, analytics }) {
  const [aiTab, setAiTab] = useState('chat');
  return (
    <div className="panel">
      <div className="ai-tabs">
        <button className={`ai-tab ${aiTab === 'chat' ? 'active' : ''}`} onClick={() => setAiTab('chat')}><MessageCircle size={16} /> Chat Mentor</button>
        <button className={`ai-tab ${aiTab === 'review' ? 'active' : ''}`} onClick={() => setAiTab('review')}><ClipboardCheck size={16} /> Code Review</button>
        <button className={`ai-tab ${aiTab === 'quiz' ? 'active' : ''}`} onClick={() => setAiTab('quiz')}><HelpCircle size={16} /> Quiz</button>
        <button className={`ai-tab ${aiTab === 'planner' ? 'active' : ''}`} onClick={() => setAiTab('planner')}><CalendarDays size={16} /> Study Plan</button>
        <button className={`ai-tab ${aiTab === 'graph' ? 'active' : ''}`} onClick={() => setAiTab('graph')}><Network size={16} /> Concepts</button>
        <button className={`ai-tab ${aiTab === 'insights' ? 'active' : ''}`} onClick={() => setAiTab('insights')}><BarChart2 size={16} /> Insights</button>
      </div>
      <div style={{ marginTop: 16 }}>
        {aiTab === 'chat' && <ChatMentor />}
        {aiTab === 'review' && <CodeReview activeResult={activeResult} />}
        {aiTab === 'quiz' && <QuizGenerator />}
        {aiTab === 'planner' && <StudyPlanner />}
        {aiTab === 'graph' && <ConceptGraph />}
        {aiTab === 'insights' && <ProgressInsights />}
      </div>
    </div>
  );
}

function ChatMentor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text) {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await api('/ai/chat', { method: 'POST', body: JSON.stringify({ message: msg }) });
      setMessages(prev => [...prev, { role: 'mentor', text: res.reply, suggestions: res.suggestions }]);
    } catch {
      setMessages(prev => [...prev, { role: 'mentor', text: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  }

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-msg mentor">
            <strong>PyBe AI Mentor</strong>
            <p>Hi! I can help you understand Python concepts, explain your reasoning patterns, or give practice tips.</p>
            <div className="chat-suggestions">
              <button onClick={() => send('Explain loops')}>Explain loops</button>
              <button onClick={() => send('How do functions work?')}>How do functions work?</button>
              <button onClick={() => send('Show my progress')}>Show my progress</button>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            {m.role === 'mentor' && <strong>AI Mentor</strong>}
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{m.text}</p>
            {m.suggestions && m.suggestions.length > 0 && (
              <div className="chat-suggestions">
                {m.suggestions.map((s, j) => (
                  <button key={j} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="chat-msg mentor"><strong>AI Mentor</strong><p>Thinking...</p></div>}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about Python concepts..." />
        <button onClick={() => send()}><Send size={16} /></button>
      </div>
    </div>
  );
}

function CodeReview({ activeResult }) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeResult?.generatedCode) {
      setLoading(true);
      api('/ai/review', { method: 'POST', body: JSON.stringify({ generatedCode: activeResult.generatedCode, reasoning: activeResult.reasoning, promptText: activeResult.promptText }) })
        .then(r => { setReview(r); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [activeResult]);

  if (!activeResult?.generatedCode) {
    return <div className="empty"><ClipboardCheck size={38} /><p>Submit a reasoning response in the Learn tab to see a code review.</p></div>;
  }

  if (loading) return <div className="empty"><p>Analyzing code quality...</p></div>;
  if (!review) return null;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className={`review-grade ${review.grade}`}>{review.grade}</div>
        <div><strong>Code Quality Score</strong><br /><span>{review.score}/100</span></div>
      </div>

      {review.strengths.length > 0 && (
        <div><h4 style={{ margin: '0 0 8px' }}>Strengths</h4>
          {review.strengths.map((s, i) => (
            <div className="review-item" key={i}><div className="review-dot success" /><span>{s}</span></div>
          ))}
        </div>
      )}

      {review.issues.length > 0 && (
        <div><h4 style={{ margin: '0 0 8px' }}>Issues</h4>
          {review.issues.map((issue, i) => (
            <div className="review-item" key={i}><div className={`review-dot ${issue.severity}`} /><span>{issue.message}</span></div>
          ))}
        </div>
      )}

      {review.suggestions.length > 0 && (
        <div><h4 style={{ margin: '0 0 8px' }}>Suggestions</h4>
          {review.suggestions.map((s, i) => (
            <div className="review-item" key={i}><div className="review-dot info" /><span>{s}</span></div>
          ))}
        </div>
      )}

      <div className="code-block"><div><Code2 size={18} /> Reviewed Code</div><pre>{activeResult.generatedCode}</pre></div>
    </div>
  );
}

function QuizGenerator() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api('/ai/quiz').then(q => { setQuiz(q); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function submitQuiz() {
    if (!quiz) return;
    const answerArray = quiz.questions.map((q, i) => ({ questionId: i, selected: answers[i] ?? -1 }));
    try {
      const r = await api('/ai/quiz/check', { method: 'POST', body: JSON.stringify({ answers: answerArray }) });
      setResults(r);
    } catch {}
  }

  function restart() {
    setQuiz(null); setAnswers({}); setResults(null);
    setLoading(true);
    api('/ai/quiz').then(q => { setQuiz(q); setLoading(false); });
  }

  if (loading) return <div className="empty"><p>Loading quiz...</p></div>;
  if (!quiz) return <div className="empty"><HelpCircle size={38} /><p>Could not load quiz.</p></div>;

  if (results) {
    return (
      <div className="quiz-results">
        <div className="score-display">{results.percentage}%</div>
        <p>{results.correct} of {results.total} correct</p>
        <div style={{ display: 'grid', gap: 12, marginTop: 16, textAlign: 'left' }}>
          {quiz.questions.map((q, i) => (
            <div className="quiz-question" key={i} style={{ borderColor: results.results[i]?.correct ? '#4ade80' : '#f87171' }}>
              <div className="concept-tag">{q.concept}</div>
              <h4>{q.question}</h4>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>
                {results.results[i]?.correct ? <CheckCircle size={14} style={{ verticalAlign: 'middle', color: '#4ade80' }} /> : <XCircle size={14} style={{ verticalAlign: 'middle', color: '#f87171' }} />}
                {' '}{results.results[i]?.explanation}
              </p>
            </div>
          ))}
        </div>
        <button className="primary" style={{ marginTop: 16 }} onClick={restart}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <p style={{ color: 'var(--text-muted)' }}>{quiz.totalQuestions} questions personalized to your learning progress</p>
      {quiz.questions.map((q, i) => (
        <div className="quiz-question" key={i}>
          <div className="concept-tag">{q.concept} · {q.difficulty}</div>
          <h4>{q.question}</h4>
          <div className="quiz-options">
            {q.options.map((opt, j) => (
              <button key={j} className={`quiz-option ${answers[i] === j ? 'selected' : ''}`}
                onClick={() => setAnswers(a => ({ ...a, [i]: j }))}>{opt}</button>
            ))}
          </div>
        </div>
      ))}
      <button className="primary" onClick={submitQuiz} disabled={Object.keys(answers).length < quiz.questions.length}>
        Check Answers ({Object.keys(answers).length}/{quiz.questions.length})
      </button>
    </div>
  );
}

function StudyPlanner() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/ai/planner').then(p => { setPlan(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty"><p>Loading study plan...</p></div>;
  if (!plan) return <div className="empty"><CalendarDays size={38} /><p>Could not load study plan.</p></div>;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="overview-grid">
        <div className="overview-stat"><strong>{plan.summary.totalSessions}</strong><small>Sessions done</small></div>
        <div className="overview-stat"><strong>{plan.summary.averageScore}%</strong><small>Avg score</small></div>
        <div className="overview-stat"><strong>{plan.summary.targetDifficulty}</strong><small>Target level</small></div>
        <div className="overview-stat"><strong>{plan.summary.weakConceptCount}</strong><small>Weak concepts</small></div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px' }}>Weekly Plan</h4>
        <div className="planner-grid">
          {plan.weeklyPlan.map((day, i) => (
            <div className="planner-day" key={i}>
              <h4>{day.day} <small>~{day.estimatedMinutes} min</small></h4>
              {day.tasks.map((task, j) => (
                <div className="planner-task" key={j}>
                  <span className={`task-type ${task.type}`}>{task.type}</span>
                  <div><strong>{task.title}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{task.reason}</small></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px' }}>Tips</h4>
        {plan.tips.map((tip, i) => (
          <div className="insight-card" key={i}><Info size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />{tip}</div>
        ))}
      </div>
    </div>
  );
}

function ConceptGraph() {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    api('/ai/graph').then(g => { setGraph(g); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty"><p>Loading concept graph...</p></div>;
  if (!graph) return <div className="empty"><Network size={38} /><p>Could not load concept graph.</p></div>;

  const nodeMap = {};
  graph.nodes.forEach((n, i) => { nodeMap[n.id] = { ...n, x: 80 + (i % 4) * 200, y: 60 + Math.floor(i / 4) * 120 }; });

  const levelColors = { not_started: '#9ca3af', needs_work: '#f87171', developing: '#facc15', mastered: '#4ade80' };

  return (
    <div className="graph-container">
      <h4 style={{ margin: '0 0 12px' }}>Concept Dependency Graph</h4>
      <svg className="graph-svg" viewBox="0 0 900 450">
        {graph.edges.map((e, i) => {
          const from = nodeMap[e.from];
          const to = nodeMap[e.to];
          if (!from || !to) return null;
          return <line key={i} x1={from.x + 60} y1={from.y + 20} x2={to.x + 60} y2={to.y + 20} stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrow)" />;
        })}
        <defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="var(--border-color)" /></marker></defs>
        {graph.nodes.map(n => {
          const pos = nodeMap[n.id];
          const mastery = n.mastery?.level || 'not_started';
          const isSelected = selectedNode?.id === n.id;
          return (
            <g key={n.id} className="graph-node" onClick={() => setSelectedNode(isSelected ? null : n)}>
              <rect x={pos.x} y={pos.y} width={120} height={40} rx={8}
                fill={isSelected ? 'var(--accent-bg)' : 'var(--bg-panel)'}
                stroke={levelColors[mastery]} strokeWidth={mastery === 'mastered' ? 3 : 2} />
              <text x={pos.x + 60} y={pos.y + 16} textAnchor="middle" fill="var(--text-primary)" fontSize="9" fontWeight="600">
                {n.label.length > 18 ? n.label.slice(0, 16) + '...' : n.label}
              </text>
              <text x={pos.x + 60} y={pos.y + 30} textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                {mastery === 'not_started' ? 'Not started' : mastery === 'needs_work' ? 'Needs work' : mastery === 'developing' ? 'Developing' : 'Mastered'}
              </text>
              {n.locked && <text x={pos.x + 110} y={pos.y + 10} fontSize="10">🔒</text>}
              {n.recommended && <text x={pos.x + 110} y={pos.y + 10} fontSize="10">⭐</text>}
            </g>
          );
        })}
      </svg>

      <div className="graph-legend">
        {Object.entries(graph.categories).map(([cat, color]) => (
          <div className="graph-legend-item" key={cat}><div className="graph-legend-dot" style={{ background: color }} /><span>{cat}</span></div>
        ))}
      </div>

      {selectedNode && (
        <div className="insight-card" style={{ marginTop: 12 }}>
          <strong>{selectedNode.label}</strong><br />
          <small>Category: {selectedNode.category} · Mastery: {selectedNode.mastery?.level || 'not_started'} · Sessions: {selectedNode.mastery?.sessions || 0} · Avg: {selectedNode.mastery?.avgPromptScore || 0}%</small><br />
          {selectedNode.prerequisites.length > 0 && <small>Prerequisites: {selectedNode.prerequisites.join(', ')}</small>}
          {selectedNode.dependents.length > 0 && <><br /><small>Unlocks: {selectedNode.dependents.join(', ')}</small></>}
          {selectedNode.recommended && <><br /><span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>Recommended next</span></>}
          {selectedNode.locked && <><br /><span style={{ color: '#f87171', fontWeight: 700 }}>Locked — master prerequisites first</span></>}
        </div>
      )}

      {graph.nextSteps.length > 0 && (
        <div style={{ marginTop: 12 }}><strong>Recommended next:</strong> {graph.nextSteps.join(', ')}</div>
      )}
    </div>
  );
}

function ProgressInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/ai/insights').then(r => { setInsights(r); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty"><p>Loading insights...</p></div>;
  if (!insights) return <div className="empty"><BarChart2 size={38} /><p>Could not load insights.</p></div>;

  const trendIcons = { improving: '↑', declining: '↓', stable: '→', none: '—', active: '↑', low: '→' };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="overview-grid">
        <div className="overview-stat"><strong>{insights.overview.totalSessions}</strong><small>Total sessions</small></div>
        <div className="overview-stat"><strong>{insights.overview.averageScore}%</strong><small>Average score</small></div>
        <div className="overview-stat"><strong>{insights.overview.overallLevel}</strong><small>Level</small></div>
        <div className="overview-stat"><strong>{insights.predictions.projectedScore}%</strong><small>Projected score</small></div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px' }}>Trends</h4>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="insight-card"><strong>Score: </strong><span className={`trend-badge ${insights.trends.scoreTrend}`}>{trendIcons[insights.trends.scoreTrend]} {insights.trends.scoreTrend}</span></div>
          <div className="insight-card"><strong>Pace: </strong><span className={`trend-badge ${insights.trends.paceTrend === 'active' ? 'improving' : 'stable'}`}>{trendIcons[insights.trends.paceTrend]} {insights.trends.paceTrend}</span></div>
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px' }}>AI Insights</h4>
        {insights.insights.map((insight, i) => (
          <div className="insight-card" key={i}><Lightbulb size={14} style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--accent-color)' }} />{insight}</div>
        ))}
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px' }}>Concept Breakdown</h4>
        {insights.conceptBreakdown.length > 0 ? insights.conceptBreakdown.map((c, i) => (
          <div className="insight-card" key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><strong>{c.name}</strong><br /><small>{c.sessions} sessions · {c.level}</small></div>
            <span className={`level-badge ${c.level}`}>{c.avgPromptScore}%</span>
          </div>
        )) : <p style={{ color: 'var(--text-muted)' }}>Complete sessions to see concept breakdown.</p>}
      </div>

      {insights.difficultyProgression && (
        <div>
          <h4 style={{ margin: '0 0 8px' }}>Difficulty Progression</h4>
          <div className="overview-grid">
            <div className="overview-stat"><strong>{insights.difficultyProgression.beginner}</strong><small>Beginner</small></div>
            <div className="overview-stat"><strong>{insights.difficultyProgression.explorer}</strong><small>Explorer</small></div>
            <div className="overview-stat"><strong>{insights.difficultyProgression.builder}</strong><small>Builder</small></div>
          </div>
        </div>
      )}

      {insights.misconceptionTrends.length > 0 && (
        <div>
          <h4 style={{ margin: '0 0 8px' }}>Common Misconceptions</h4>
          {insights.misconceptionTrends.map((m, i) => (
            <div className="insight-card" key={i}><AlertCircle size={14} style={{ verticalAlign: 'middle', marginRight: 6, color: '#f87171' }} />{m.text} <small>({m.count}x)</small></div>
          ))}
        </div>
      )}

      {insights.timeAnalysis.totalTime > 0 && (
        <div>
          <h4 style={{ margin: '0 0 8px' }}>Time Analysis</h4>
          <div className="overview-grid">
            <div className="overview-stat"><strong>{Math.floor(insights.timeAnalysis.totalTime / 60)}m</strong><small>Total time</small></div>
            <div className="overview-stat"><strong>{Math.floor(insights.timeAnalysis.averageTime / 60)}m</strong><small>Avg per session</small></div>
          </div>
        </div>
      )}

      <div>
        <h4 style={{ margin: '0 0 8px' }}>Prediction</h4>
        <div className="insight-card"><strong>Estimated mastery: </strong>{insights.predictions.estimatedMastery}</div>
      </div>
    </div>
  );
}

function Dashboard({ analytics, recommendations, sessions, bookmarks }) {
  const conceptMastery = analytics?.conceptMastery ? Object.entries(analytics.conceptMastery) : [];
  const weakest = analytics?.weakestConcept || null;
  const dailyCounts = analytics?.dailySessionCounts ? Object.entries(analytics.dailySessionCounts).slice(-7) : [];
  const colors = { mastered: '#4ade80', developing: '#facc15', needs_work: '#f87171' };
  const bookmarkedSessions = sessions.filter(s => bookmarks.includes(s._id) || (s.scenario?._id && bookmarks.includes(s.scenario._id)));
  const badges = getAchievements(analytics);

  return (
    <div className="dashboard-tab">
      <div className="dashboard-grid">
        <div className="panel">
          <div className="section-title"><Award size={18} /><h3>Learner Profile</h3></div>
          <div className="profile-card">
            <div className="profile-stat"><strong>{analytics?.sessionCount || 0}</strong><small>Sessions</small></div>
            <div className="profile-stat"><strong>{analytics?.averagePromptScore || 0}</strong><small>Avg Score</small></div>
            <div className="profile-stat"><strong>{analytics?.streak?.current || 0}</strong><small>Day Streak</small></div>
            <div className="profile-stat"><strong>{analytics?.streak?.longest || 0}</strong><small>Best Streak</small></div>
          </div>
          {weakest && <div className="weakest-concept"><AlertTriangle size={14} /><span>Focus on: {weakest.name} ({weakest.avgPromptScore} avg)</span></div>}
        </div>

        <div className="panel">
          <div className="section-title"><Target size={18} /><h3>Recommendations</h3></div>
          {recommendations?.length > 0 ? recommendations.map((r, i) => (
            <div className="rec-card" key={i}><strong>{r.reason}</strong></div>
          )) : <p>Complete sessions to get recommendations.</p>}
        </div>

        {badges.length > 0 && (
          <div className="panel">
            <div className="section-title"><Trophy size={18} /><h3>Achievements</h3></div>
            <div className="badge-grid">
              {badges.map(b => {
                const Icon = b.icon;
                return <div key={b.id} className="badge-card"><Icon size={20} /><span>{b.name}</span></div>;
              })}
            </div>
          </div>
        )}

        {conceptMastery.length > 0 && (
          <div className="panel">
            <div className="section-title"><Layers size={18} /><h3>Concept Mastery</h3></div>
            <div className="mastery-grid">
              {conceptMastery.map(([name, stats]) => (
                <div className="mastery-card" key={name} style={{ borderLeft: '4px solid ' + (colors[stats.level] || '#999') }}>
                  <strong>{name}</strong><span>{stats.avgPromptScore} avg</span><small>{stats.sessions} sessions</small>
                  <span className={'level-badge ' + stats.level}>{stats.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {dailyCounts.length > 0 && (
          <div className="panel">
            <div className="section-title"><Calendar size={18} /><h3>Learning Pace</h3></div>
            <div className="pace-row">
              {dailyCounts.map(([day, count]) => (
                <div className="pace-item" key={day}>
                  <div className="pace-bar" style={{ height: Math.max(count * 20, 4) + 'px' }}></div>
                  <small>{day.slice(5)}</small><span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookmarkedSessions.length > 0 && (
          <div className="panel">
            <div className="section-title"><BookmarkCheck size={18} /><h3>Favorites</h3></div>
            <div className="fav-list">
              {bookmarkedSessions.slice(0, 5).map(s => (
                <article className="session-item" key={s._id}>
                  <Play size={14} />
                  <div><strong>{s.scenario?.title || 'Unknown'}</strong><span>{s.promptScore} score</span></div>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="panel">
          <div className="section-title"><TrendingUp size={18} /><h3>Recent</h3></div>
          {sessions.length > 0 ? sessions.slice(0, 5).map(s => (
            <article className="session-item" key={s._id}>
              <Play size={14} />
              <div><strong>{s.scenario?.title || 'Unknown'}</strong><span>{(s.masterySignals || []).join(' / ')}</span></div>
              <small>{s.promptScore}</small>
            </article>
          )) : <p>No sessions yet.</p>}
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ sessions, bookmarks }) {
  return (
    <div className="history-tab">
      <div className="panel">
        <div className="section-title"><MessageSquareText size={20} /><h2>Session History</h2></div>
        {sessions.length > 0 ? (
          <table className="session-table">
            <thead><tr><th>Scenario</th><th>Score</th><th>Time</th><th>Concepts</th><th>Misconceptions</th><th>Date</th></tr></thead>
            <tbody>{sessions.slice(0, 30).map(s => (
              <tr key={s._id} className={s._id && bookmarks?.includes(s._id) ? 'bookmarked-row' : ''}>
                <td>{s.scenario?.title || 'Unknown'}</td>
                <td><span className="score-badge">{s.promptScore}</span></td>
                <td>{s.timeSpent ? `${Math.floor(s.timeSpent / 60)}:${String(s.timeSpent % 60).padStart(2, '0')}` : '-'}</td>
                <td>{(s.abstractionMap || []).map(m => m.pythonConcept).join(', ')}</td>
                <td>{(s.misconceptions || []).length}</td>
                <td>{s.createdAt?.slice(0, 10)}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : <p>No sessions yet.</p>}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);