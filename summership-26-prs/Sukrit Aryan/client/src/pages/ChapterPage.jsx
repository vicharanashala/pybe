import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext.jsx';
import { CHAPTERS_MAP, CURRICULUM, getThemedChapter } from '../data/curriculum.js';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Lightbulb,
  BookOpen, Sparkles, ChevronRight,
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchScenarios(concepts, activeTheme) {
  const themeToUse = activeTheme || 'default';
  const results = new Map();
  for (const concept of concepts) {
    try {
      const url = `${API}/scenarios?concept=${encodeURIComponent(concept)}&theme=${encodeURIComponent(themeToUse)}`;
      const r = await fetch(url);
      const data = await r.json();
      data.forEach(s => results.set(s._id, s));
    } catch { /* ignore */ }
  }
  let list = [...results.values()];
  if (list.length === 0 && themeToUse !== 'default') {
    for (const concept of concepts) {
      try {
        const r = await fetch(`${API}/scenarios?concept=${encodeURIComponent(concept)}&theme=default`);
        const data = await r.json();
        data.forEach(s => results.set(s._id, s));
      } catch { /* ignore */ }
    }
    list = [...results.values()];
  }
  return list.slice(0, 4);
}

async function submitSession(scenarioId, reasoning, promptText) {
  try {
    const r = await fetch(`${API}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario: scenarioId, learnerName: 'Guest', reasoning, promptText }),
    });
    return r.ok ? await r.json() : null;
  } catch { return null; }
}

// ── Client-side reasoning quality estimator ───────────────
function estimateScore(reasoning) {
  const text = (reasoning || '').toLowerCase().trim();
  if (text.length < 10) return 15;
  let score = 20;
  if (text.length > 60)  score += 8;
  if (text.length > 150) score += 8;
  if (text.length > 300) score += 7;
  const signals = [
    'because','since','so that','in order to','which means','this helps',
    'instead','rather than','problem','solution','better','easier','organize',
    'group','store','remember','track','manage','keep','avoid','think','believe',
    'would','could','should','maybe','one way','another',
  ];
  signals.forEach(w => { if (text.includes(w)) score += 3; });
  return Math.min(Math.max(score, 15), 88);
}

function scoreLevel(s) {
  if (s >= 80) return { label: 'Excellent thinking',  color: '#A8FF3E', emoji: '🔥', grade: 'A' };
  if (s >= 65) return { label: 'Strong reasoning',    color: '#60A5FA', emoji: '⚡', grade: 'B' };
  if (s >= 48) return { label: 'Good start',          color: '#F59E0B', emoji: '💡', grade: 'C' };
  if (s >= 30) return { label: 'Keep exploring',      color: '#F97316', emoji: '📈', grade: 'D' };
  return         { label: 'Just beginning',           color: '#F472B6', emoji: '🌱', grade: 'E' };
}

const PHASES = { INTRO: 'intro', QUESTION: 'question', SUMMARY: 'summary', THEORY: 'theory' };

export default function ChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { markChapterComplete, getChapterStatus } = useAuth();
  const { dashboardTheme } = useTheme();
  const chapter = getThemedChapter(chapterId, dashboardTheme);
  const pageRef = useRef(null);

  const [phase, setPhase] = useState(PHASES.INTRO);
  const [scenarios, setScenarios] = useState([]);
  const [loadingScenarios, setLoadingScenarios] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [form, setForm] = useState({ reasoning: '', promptText: '' });
  const [submitting, setSubmitting] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    if (!chapter) { navigate('/app'); }
  }, [chapter]);

  // ── CRITICAL: Reset all state when chapter or theme changes ────────
  useEffect(() => {
    setPhase(PHASES.INTRO);
    setCurrentIdx(0);
    setAnswers([]);
    setForm({ reasoning: '', promptText: '' });
    setSubmitting(false);
    setAlreadyDone(getChapterStatus(chapterId) === 'completed');
    setLoadingScenarios(true);
    if (chapter) {
      fetchScenarios(chapter.concepts, dashboardTheme)
        .then(s => setScenarios(s))
        .finally(() => setLoadingScenarios(false));
    }
  }, [chapterId, dashboardTheme]);

  // ── Phase animation ───────────────────────────────────────
  // Runs AFTER React commits the new phase DOM.
  useEffect(() => {
    if (!pageRef.current) return;

    if (phase === PHASES.THEORY) {
      // Page wrapper: make visible immediately
      gsap.set(pageRef.current, { opacity: 1, y: 0 });

      // Delay slightly to ensure React has fully painted the theory DOM
      const timer = setTimeout(() => {
        if (!pageRef.current) return;

        // Query ALL theory sections in the order they appear — do NOT use
        // both individual selectors AND a parent > * selector, as that
        // causes elements to be animated twice (disappear-then-reappear bug).
        const els = pageRef.current.querySelectorAll(
          '.theory-eyebrow, .theory-title, .theory-concept, ' +
          '.theory-divider, .bva, .theory-explanation, .theory-code, ' +
          '.msb, .mml, .theory-callout, .theory-takeaway, .theory-complete'
        );
        // Set all to invisible first, then stagger-in
        gsap.set(els, { opacity: 0, y: 16 });
        gsap.to(els, {
          opacity: 1, y: 0,
          duration: 0.45, stagger: 0.07, ease: 'power3.out',
        });
      }, 60);
      return () => clearTimeout(timer);
    } else {
      gsap.fromTo(pageRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [phase, currentIdx]);

  // ── Phase helpers ─────────────────────────────────────────
  function animateOut() {
    return new Promise(resolve => {
      if (!pageRef.current) { resolve(); return; }
      gsap.to(pageRef.current, {
        y: -14, opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: resolve,
      });
    });
  }

  async function startLearning() {
    await animateOut();
    setCurrentIdx(0);
    setAnswers([]);
    setForm({ reasoning: '', promptText: '' });
    setPhase(PHASES.QUESTION);
  }

  async function submitAnswer() {
    if (!form.reasoning.trim()) return;
    setSubmitting(true);
    const scenario = scenarios[currentIdx];
    const res = await submitSession(scenario._id, form.reasoning, form.promptText);

    // Fall back to client-side score estimate if backend returns null or no score
    const finalScore = res?.promptScore ?? estimateScore(form.reasoning);
    const enrichedRes = res ? { ...res, promptScore: finalScore } : { promptScore: finalScore };

    const newAnswers = [...answers, { scenario, reasoning: form.reasoning, result: enrichedRes }];
    setAnswers(newAnswers);

    if (currentIdx < scenarios.length - 1) {
      await animateOut();
      setCurrentIdx(i => i + 1);
      setForm({ reasoning: '', promptText: '' });
      setSubmitting(false);
    } else {
      await animateOut();
      setSubmitting(false);
      setPhase(PHASES.SUMMARY);
    }
  }

  async function revealTheory() {
    await animateOut();
    setPhase(PHASES.THEORY);
    // Animation is triggered by useEffect([phase]) above
  }

  function handleComplete() {
    markChapterComplete(chapterId);
    const allChapters = CURRICULUM.flatMap(s => s.chapters);
    const idx = allChapters.findIndex(c => c.id === chapterId);
    const next = allChapters[idx + 1];
    // Navigate to next chapter — the useEffect([chapterId]) reset will
    // ensure it starts at INTRO phase, not THEORY.
    navigate(next ? `/app/chapter/${next.id}` : '/app');
  }

  if (!chapter) return null;

  return (
    <div className="cp">
      <nav className="cp-breadcrumb">
        <button className="cp-breadcrumb__back" onClick={() => navigate('/app')}>
          <ArrowLeft size={13} /> Dashboard
        </button>
        <ChevronRight size={13} className="cp-breadcrumb__sep" />
        <span>{chapter.sectionTitle}</span>
        <ChevronRight size={13} className="cp-breadcrumb__sep" />
        <span className="cp-breadcrumb__current">{chapter.title}</span>
      </nav>

      {phase === PHASES.QUESTION && scenarios.length > 0 && (
        <div className="cp-progress">
          <div className="cp-progress__bar">
            {scenarios.map((_, i) => (
              <div key={i} className={`cp-progress__seg${i < currentIdx ? ' done' : i === currentIdx ? ' active' : ''}`} />
            ))}
          </div>
          <span className="cp-progress__label">Question {currentIdx + 1} / {scenarios.length}</span>
        </div>
      )}

      <div ref={pageRef} className="cp-content">
        {phase === PHASES.INTRO    && <IntroPhase    chapter={chapter} onStart={startLearning} loading={loadingScenarios} scenarioCount={scenarios.length} alreadyDone={alreadyDone} />}
        {phase === PHASES.QUESTION && scenarios.length > 0 && <QuestionPhase scenario={scenarios[currentIdx]} index={currentIdx} total={scenarios.length} form={form} onChange={p => setForm(f => ({ ...f, ...p }))} onSubmit={submitAnswer} submitting={submitting} />}
        {phase === PHASES.SUMMARY  && <SummaryPhase  answers={answers} onReveal={revealTheory} />}
        {phase === PHASES.THEORY   && <TheoryPhase   chapterId={chapterId} theory={chapter?.theory} onComplete={handleComplete} alreadyDone={alreadyDone} />}
      </div>

      <style>{`
        .cp { display: flex; flex-direction: column; gap: 24px; }
        .cp-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-muted); }
        .cp-breadcrumb__back { display: inline-flex; align-items: center; gap: 5px; background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; padding: 0; transition: color 0.15s; }
        .cp-breadcrumb__back:hover { color: var(--text-primary); }
        .cp-breadcrumb__sep { color: var(--border-hover); }
        .cp-breadcrumb__current { color: var(--text-secondary); font-weight: 500; }
        .cp-progress { display: flex; align-items: center; gap: 12px; }
        .cp-progress__bar { display: flex; gap: 4px; flex: 1; }
        .cp-progress__seg { height: 3px; flex: 1; border-radius: 2px; background: var(--border); transition: background 0.3s; }
        .cp-progress__seg.done   { background: var(--accent); }
        .cp-progress__seg.active { background: var(--accent-glow-md); }
        .cp-progress__label { font-size: 0.74rem; color: var(--text-muted); white-space: nowrap; }
        .cp-content { min-height: 60vh; }
        @keyframes cp-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// INTRO PHASE
// ─────────────────────────────────────────────────────────
function IntroPhase({ chapter, onStart, loading, scenarioCount, alreadyDone }) {
  return (
    <div className="intro">
      <p className="intro__section">{chapter.sectionTitle} · Chapter</p>
      <div className="intro__emoji">{chapter.emoji}</div>
      <h1 className="intro__title">{chapter.title}</h1>
      <p className="intro__subtitle">{chapter.subtitle}</p>

      <blockquote className="intro__hook">{chapter.intro.hook}</blockquote>

      <div className="intro__panels">
        <div className="intro__panel intro__panel--blue">
          <p className="intro__panel-label"><Lightbulb size={12} /> What you'll figure out</p>
          <p>{chapter.intro.whatYoullFigureOut}</p>
        </div>
        <div className="intro__panel intro__panel--dim">
          <p className="intro__panel-label">The setup</p>
          <p>{chapter.intro.vibe}</p>
        </div>
      </div>

      {loading ? (
        <p className="intro__loading"><Spinner /> Loading questions…</p>
      ) : scenarioCount === 0 ? (
        <p className="intro__none">No scenarios found for this chapter yet.</p>
      ) : (
        <button id="start-chapter-btn" className="btn-primary-action" onClick={onStart}>
          {alreadyDone ? '↩ Redo this chapter' : "Let's go →"}
        </button>
      )}
      {scenarioCount > 0 && !loading && (
        <p className="intro__note">{scenarioCount} question{scenarioCount !== 1 ? 's' : ''} · Think in plain English — Python comes at the very end</p>
      )}

      <style>{`
        .intro { display: flex; flex-direction: column; gap: 16px; }
        .intro__section { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin: 0; }
        .intro__emoji { font-size: 2.8rem; line-height: 1; margin-top: 4px; }
        .intro__title { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 800; margin: 4px 0 0; letter-spacing: -0.02em; color: var(--text-primary); line-height: 1.15; }
        .intro__subtitle { font-size: 1rem; color: var(--text-secondary); margin: 0 0 8px; }
        .intro__hook { border-left: 3px solid var(--accent); margin: 4px 0; padding: 12px 18px; font-size: 0.97rem; font-style: italic; color: var(--text-primary); line-height: 1.7; background: rgba(168,255,62,0.03); border-radius: 0 8px 8px 0; }
        .intro__panels { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 4px 0; }
        .intro__panel { padding: 16px 18px; border-radius: 10px; }
        .intro__panel--blue { background: rgba(96,165,250,0.05); border: 1px solid rgba(96,165,250,0.13); }
        .intro__panel--dim  { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); }
        .intro__panel-label { display: flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: #60A5FA; margin: 0 0 8px; }
        .intro__panel--dim .intro__panel-label { color: var(--text-muted); }
        .intro__panel p:last-child { font-size: 0.88rem; color: var(--text-secondary); margin: 0; line-height: 1.65; }
        .btn-primary-action { display: inline-block; padding: 12px 28px; background: var(--accent); color: #0D1117; border: none; border-radius: 9px; font-size: 0.93rem; font-weight: 700; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; margin-top: 4px; }
        .btn-primary-action:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(168,255,62,0.25); }
        .intro__loading { display: flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.875rem; margin: 0; }
        .intro__none { color: var(--text-muted); font-size: 0.875rem; margin: 0; }
        .intro__note { font-size: 0.76rem; color: var(--text-muted); margin: 0; }
        @media (max-width: 540px) { .intro__panels { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// QUESTION PHASE
// ─────────────────────────────────────────────────────────
function QuestionPhase({ scenario, index, total, form, onChange, onSubmit, submitting }) {
  const taRef = useRef(null);
  useEffect(() => { taRef.current?.focus(); }, [scenario?._id]);

  return (
    <div className="qp">
      <div className="qp__scenario">
        <p className="qp__scenario-label"><BookOpen size={12} /> The Scenario</p>
        <p className="qp__scenario-text">{scenario.context}</p>
      </div>

      <div className="qp__question">
        <span className="qp__q-icon">🤔</span>
        <p>{scenario.prompt || 'How would you solve this problem? Explain your thinking in plain words — no Python needed yet.'}</p>
      </div>

      <div className="qp__form">
        <div className="qp__label-row">
          <label htmlFor="reasoning-input" className="qp__label">Your thinking</label>
          <span className="qp__hint">Write like you're explaining to a friend</span>
        </div>
        <textarea
          id="reasoning-input"
          ref={taRef}
          value={form.reasoning}
          onChange={e => onChange({ reasoning: e.target.value })}
          placeholder="I think the best approach here is… because…"
          rows={6}
          className="qp__textarea"
        />
        <p className="qp__char">{form.reasoning.length} characters</p>
      </div>

      <details className="qp__optional">
        <summary>💬 Optional: How would you ask an AI mentor to explain this?</summary>
        <textarea
          value={form.promptText}
          onChange={e => onChange({ promptText: e.target.value })}
          placeholder="Help me understand why…"
          rows={3}
          className="qp__textarea"
          style={{ marginTop: 10 }}
        />
      </details>

      <div className="qp__footer">
        <p className="qp__tip">💡 Whatever comes to mind first is perfect.</p>
        <button id="submit-answer-btn" className="btn-primary-action" onClick={onSubmit} disabled={submitting || !form.reasoning.trim()}>
          {submitting
            ? <><Spinner size={16} color="#0D1117" /> Thinking…</>
            : index < total - 1
              ? <>Next <ArrowRight size={14} /></>
              : <>See how I did <ArrowRight size={14} /></>}
        </button>
      </div>

      <style>{`
        .qp { display: flex; flex-direction: column; gap: 26px; }
        .qp__scenario { padding: 18px 20px; border-radius: 10px; background: rgba(168,255,62,0.03); border: 1px solid rgba(168,255,62,0.1); }
        .qp__scenario-label { display: flex; align-items: center; gap: 5px; font-size: 0.67rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin: 0 0 10px; }
        .qp__scenario-text { font-size: 0.94rem; color: var(--text-secondary); margin: 0; line-height: 1.75; }
        .qp__question { display: flex; gap: 12px; align-items: flex-start; padding-bottom: 22px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .qp__q-icon { font-size: 1.25rem; flex-shrink: 0; line-height: 1.45; }
        .qp__question p { font-size: 1.02rem; font-weight: 600; color: var(--text-primary); margin: 0; line-height: 1.6; }
        .qp__form { display: flex; flex-direction: column; gap: 7px; }
        .qp__label-row { display: flex; align-items: baseline; justify-content: space-between; }
        .qp__label { font-size: 0.84rem; font-weight: 600; color: var(--text-secondary); }
        .qp__hint { font-size: 0.76rem; color: var(--text-muted); }
        .qp__textarea { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; padding: 13px 15px; font-size: 0.94rem; color: var(--text-primary); line-height: 1.7; resize: vertical; font-family: var(--font-body); transition: border-color 0.2s, box-shadow 0.2s; }
        .qp__textarea:focus { border-color: rgba(168,255,62,0.35); box-shadow: 0 0 0 3px rgba(168,255,62,0.07); outline: none; }
        .qp__char { font-size: 0.72rem; color: var(--text-muted); text-align: right; margin: 0; }
        .qp__optional summary { font-size: 0.81rem; color: var(--text-muted); cursor: pointer; list-style: none; padding: 2px 0; transition: color 0.15s; }
        .qp__optional summary:hover { color: var(--text-secondary); }
        .qp__footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .qp__tip { font-size: 0.79rem; color: var(--text-muted); margin: 0; }
        .btn-primary-action:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
        @media (max-width: 500px) { .qp__footer { flex-direction: column-reverse; align-items: flex-start; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUMMARY PHASE
// ─────────────────────────────────────────────────────────
function getSocraticFeedback(text = '') {
  const lower = text.toLowerCase();

  if (lower.includes('start from 1') || lower.includes('first element is 1') || lower.includes('position 1 is first')) {
    return {
      type: 'misconception',
      icon: '🧐',
      title: 'Socratic Prompt on Memory Indexing',
      text: 'Notice how in physical computer memory architecture, array positioning starts at index 0 (the offset distance from the first slot). How does counting from 0 shift item positions?',
    };
  }

  if (lower.includes('equal sign') && (lower.includes('compare') || lower.includes('check'))) {
    return {
      type: 'misconception',
      icon: '🧐',
      title: 'Socratic Prompt on Assignment vs Equality',
      text: 'In Python, = puts a value inside a memory box, while == asks a true/false question. How does separating assignment (=) from comparison (==) prevent unexpected logic bugs?',
    };
  }

  if (lower.includes('change the original text') || lower.includes('modify string directly')) {
    return {
      type: 'misconception',
      icon: '🧐',
      title: 'Socratic Prompt on Immutability',
      text: 'Strings in Python are immutable — operations create a brand new string rather than altering original RAM bytes. Why is immutable string memory safer for multi-threaded applications?',
    };
  }

  if (lower.includes('two lists') || lower.includes('separate list')) {
    return {
      type: 'misconception',
      icon: '🧐',
      title: 'Socratic Prompt on Data Association',
      text: 'If you remove an element from a names list, the prices list stays unchanged and falls out of sync! How would key-value pairing (dictionaries) keep item names and values connected permanently?',
    };
  }

  return {
    type: 'clean',
    icon: '✨',
    title: 'First-Principles Logic',
    text: 'Great intuition! Your reasoning focuses on the core problem breakdown before jumping to code syntax.',
  };
}

function SummaryPhase({ answers, onReveal }) {
  const scores = answers.map(a => a.result?.promptScore ?? 50);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const lvl = scoreLevel(avg);

  return (
    <div className="sp">
      <div className="sp__header">
        <Sparkles size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <div>
          <h2 className="sp__title">Your reasoning recap</h2>
          <p className="sp__sub">You answered {answers.length} question{answers.length !== 1 ? 's' : ''}. Here's what you came up with before we reveal the concept.</p>
        </div>
      </div>

      {/* Score card */}
      <div className="sp__score" style={{ borderColor: lvl.color + '30' }}>
        <div className="sp__score-left">
          <div className="sp__score-emoji">{lvl.emoji}</div>
          <div>
            <div className="sp__score-label" style={{ color: lvl.color }}>{lvl.label}</div>
            <div className="sp__score-desc">Reasoning quality across {answers.length} question{answers.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <div className="sp__score-grade" style={{ background: lvl.color + '18', color: lvl.color }}>
          {avg}/100
        </div>
      </div>

      {/* Per-answer breakdown */}
      <div className="sp__answers">
        {answers.map((a, i) => {
          const s = a.result?.promptScore ?? 50;
          const l = scoreLevel(s);
          const soc = getSocraticFeedback(a.reasoning);
          return (
            <div key={i} className="sp__answer">
              <div className="sp__answer-top">
                <div className="sp__answer-num">{i + 1}</div>
                <div className="sp__answer-meta">
                  <div className="sp__answer-title">{a.scenario.title}</div>
                  <div className="sp__answer-badge" style={{ color: l.color, background: l.color + '14' }}>
                    {l.emoji} {l.label} · {s}/100
                  </div>
                </div>
              </div>
              <p className="sp__answer-text">"{a.reasoning}"</p>

              {/* SOCRATIC MISCONCEPTION SPOTTER BANNER */}
              <div className={`sp__soc sp__soc--${soc.type}`}>
                <span className="sp__soc-icon">{soc.icon}</span>
                <div className="sp__soc-body">
                  <strong className="sp__soc-title">{soc.title}</strong>
                  <p className="sp__soc-text">{soc.text}</p>
                </div>
              </div>

              {a.result?.masterySignals?.length > 0 && (
                <div className="sp__signals">
                  {a.result.masterySignals.map(sig => (
                    <span key={sig} className="sp__signal">✓ {sig}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sp__cta">
        <button id="reveal-theory-btn" className="btn-primary-action" onClick={onReveal}>
          <Lightbulb size={15} /> Now discover why →
        </button>
        <p className="sp__cta-note">We'll explain the Python concept that solves all of this.</p>
      </div>

      <style>{`
        .sp { display: flex; flex-direction: column; gap: 26px; }
        .sp__header { display: flex; align-items: flex-start; gap: 14px; }
        .sp__title { font-size: 1.5rem; font-weight: 800; margin: 0 0 5px; color: var(--text-primary); }
        .sp__sub { font-size: 0.875rem; color: var(--text-secondary); margin: 0; line-height: 1.6; }
        .sp__score { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid; }
        .sp__score-left { display: flex; align-items: center; gap: 14px; }
        .sp__score-emoji { font-size: 1.8rem; }
        .sp__score-label { font-size: 0.95rem; font-weight: 700; margin-bottom: 3px; }
        .sp__score-desc { font-size: 0.78rem; color: var(--text-muted); }
        .sp__score-grade { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; padding: 8px 14px; border-radius: 8px; white-space: nowrap; }
        .sp__answers { display: flex; flex-direction: column; gap: 10px; }
        .sp__answer { padding: 14px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); display: flex; flex-direction: column; gap: 10px; }
        .sp__answer-top { display: flex; align-items: flex-start; gap: 12px; }
        .sp__answer-num { width: 22px; height: 22px; border-radius: 50%; background: var(--accent); color: #0D1117; font-size: 0.68rem; font-weight: 800; display: grid; place-items: center; flex-shrink: 0; margin-top: 1px; }
        .sp__answer-meta { flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .sp__answer-title { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
        .sp__answer-badge { font-size: 0.74rem; font-weight: 600; padding: 2px 9px; border-radius: 20px; display: inline-flex; align-items: center; gap: 4px; align-self: flex-start; }
        .sp__answer-text { font-size: 0.84rem; color: var(--text-secondary); font-style: italic; line-height: 1.6; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .sp__soc { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: 8px; border: 1px solid; margin-top: 2px; }
        .sp__soc--misconception { background: rgba(245, 158, 11, 0.06); border-color: rgba(245, 158, 11, 0.25); }
        .sp__soc--clean { background: rgba(168, 255, 62, 0.05); border-color: rgba(168, 255, 62, 0.18); }
        .sp__soc-icon { font-size: 1.1rem; line-height: 1; flex-shrink: 0; margin-top: 2px; }
        .sp__soc-body { display: flex; flex-direction: column; gap: 2px; }
        .sp__soc-title { font-size: 0.78rem; font-weight: 700; color: var(--text-primary); }
        .sp__soc-text { font-size: 0.76rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }
        .sp__signals { display: flex; flex-wrap: wrap; gap: 5px; }
        .sp__signal { font-size: 0.7rem; color: var(--accent); background: rgba(168,255,62,0.08); border: 1px solid rgba(168,255,62,0.18); padding: 2px 8px; border-radius: 20px; }
        .sp__cta { display: flex; flex-direction: column; gap: 8px; padding-top: 4px; }
        .sp__cta-note { font-size: 0.78rem; color: var(--text-muted); margin: 0; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BEFORE VS AFTER COMPARISON WIDGET
// ─────────────────────────────────────────────────────────
function BeforeVsAfter({ data }) {
  if (!data) return null;
  return (
    <div className="bva">
      <div className="bva__header">
        <span className="bva__tag">⚡ First-Principles Friction Simulator</span>
        <h3 className="bva__title">Why this abstraction was invented</h3>
      </div>
      <div className="bva__grid">
        {/* BEFORE CARD */}
        <div className="bva__card bva__card--before">
          <div className="bva__card-head">
            <span className="bva__badge bva__badge--red">❌ BEFORE</span>
            <span className="bva__card-title">{data.beforeTitle}</span>
          </div>
          <pre className="bva__code">{data.beforeCode}</pre>
          <div className="bva__insight bva__insight--red">
            <strong>The Pain Point:</strong> {data.beforePain}
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="bva__card bva__card--after">
          <div className="bva__card-head">
            <span className="bva__badge bva__badge--green">✓ AFTER</span>
            <span className="bva__card-title">{data.afterTitle}</span>
          </div>
          <pre className="bva__code">{data.afterCode}</pre>
          <div className="bva__insight bva__insight--green">
            <strong>The Abstraction Gain:</strong> {data.afterGain}
          </div>
        </div>
      </div>

      <style>{`
        .bva { margin: 24px 0; padding: 20px; border-radius: 14px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); }
        .bva__header { margin-bottom: 16px; }
        .bva__tag { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
        .bva__title { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 3px 0 0; }
        .bva__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .bva__card { padding: 14px; border-radius: 10px; display: flex; flex-direction: column; gap: 10px; border: 1px solid var(--border); }
        .bva__card--before { background: rgba(239, 68, 68, 0.04); border-color: rgba(239, 68, 68, 0.2); }
        .bva__card--after { background: rgba(168, 255, 62, 0.04); border-color: rgba(168, 255, 62, 0.2); }
        .bva__card-head { display: flex; align-items: center; gap: 8px; }
        .bva__badge { font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; }
        .bva__badge--red { background: rgba(239, 68, 68, 0.2); color: #EF4444; }
        .bva__badge--green { background: rgba(168, 255, 62, 0.2); color: var(--accent); }
        .bva__card-title { font-size: 0.82rem; font-weight: 700; color: var(--text-primary); }
        .bva__code { background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; font-family: var(--font-code); font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5; margin: 0; overflow-x: auto; }
        .bva__insight { font-size: 0.78rem; line-height: 1.5; padding: 8px 10px; border-radius: 6px; margin-top: auto; }
        .bva__insight--red { background: rgba(239, 68, 68, 0.08); color: #FCA5A5; }
        .bva__insight--green { background: rgba(168, 255, 62, 0.08); color: var(--text-primary); }
        @media (max-width: 640px) { .bva__grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// INTERACTIVE MENTAL MODEL LAB
// ─────────────────────────────────────────────────────────
function MentalModelLab({ chapterId }) {
  const [val, setVal] = useState('Ginger Chai');
  const [numA, setNumA] = useState(15);
  const [numB, setNumB] = useState(47);
  const [strVal, setStrVal] = useState('PyBe');
  const [score, setScore] = useState(75);
  const [loopIdx, setLoopIdx] = useState(0);
  const [list, setList] = useState(['Chai', 'Coffee', 'Samosa']);
  const [selectedKey, setSelectedKey] = useState('Gryffindor');
  const [rawList, setRawList] = useState(['Chai', 'Coffee', 'Chai', 'Tea']);
  const [setFilterActive, setSetFilterActive] = useState(false);
  const [funcInput, setFuncInput] = useState(12);
  const [searchTarget, setSearchTarget] = useState('Coffee');
  const [searchIdx, setSearchIdx] = useState(-1);
  const [errorSim, setErrorSim] = useState(false);
  const [sortList, setSortList] = useState([88, 45, 98, 62]);
  const [fileSaved, setFileSaved] = useState(false);

  const loopItems = ['Priya', 'Arjun', 'Dev', 'Meera'];
  const dictData = { Gryffindor: 450, Slytherin: 420, Ravenclaw: 390 };

  return (
    <div className="mml">
      <div className="mml__head">
        <span className="mml__tag">🧠 Interactive Mental Model Lab</span>
        <h4 className="mml__title">See memory & execution under the hood</h4>
      </div>

      <div className="mml__body">
        {/* 1. VARIABLES */}
        {chapterId === 'variables' && (
          <div className="mml__demo">
            <div className="mml__row">
              <label className="mml__label">Type value for variable <code>chai_type</code>:</label>
              <input type="text" className="mml__input" value={val} onChange={e => setVal(e.target.value)} />
            </div>
            <div className="mml__mem-grid">
              <div className="mml__mem-cell">
                <span className="mml__mem-addr">RAM 0x7F8</span>
                <span className="mml__mem-name">chai_type</span>
                <span className="mml__mem-val">"{val}"</span>
              </div>
            </div>
            <p className="mml__explain">Notice how typing in the box updates the RAM memory cell at address <code>0x7F8</code> instantly!</p>
          </div>
        )}

        {/* 2. OPERATORS */}
        {chapterId === 'operators' && (
          <div className="mml__demo">
            <div className="mml__row">
              <span>Price (₹):</span>
              <input type="number" className="mml__input mml__input--num" value={numA} onChange={e => setNumA(Number(e.target.value))} />
              <span>× Cups:</span>
              <input type="number" className="mml__input mml__input--num" value={numB} onChange={e => setNumB(Number(e.target.value))} />
            </div>
            <div className="mml__pipe">
              <div className="mml__pipe-box">{numA}</div>
              <span className="mml__pipe-op">×</span>
              <div className="mml__pipe-box">{numB}</div>
              <span className="mml__pipe-op">=</span>
              <div className="mml__pipe-res">{numA * numB}</div>
            </div>
            <p className="mml__explain">The arithmetic operator node <code>*</code> executes the multiplication on two inputs in nanoseconds.</p>
          </div>
        )}

        {/* 3. STRINGS */}
        {chapterId === 'strings' && (
          <div className="mml__demo">
            <div className="mml__row">
              <label className="mml__label">Text String:</label>
              <input type="text" className="mml__input" value={strVal} onChange={e => setStrVal(e.target.value)} />
            </div>
            <div className="mml__str-cells">
              {strVal.split('').map((char, i) => (
                <div key={i} className="mml__str-cell">
                  <span className="mml__str-idx">[{i}]</span>
                  <span className="mml__str-char">'{char}'</span>
                </div>
              ))}
            </div>
            <p className="mml__explain">In Python, strings are zero-indexed sequences of characters stored consecutively in memory.</p>
          </div>
        )}

        {/* 4. CONDITIONALS */}
        {chapterId === 'conditionals' && (
          <div className="mml__demo">
            <div className="mml__row">
              <label className="mml__label">Test Score Slider: <strong>{score}</strong></label>
              <input type="range" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))} className="mml__slider" />
            </div>
            <div className="mml__tree">
              <div className={`mml__node ${score >= 80 ? 'mml__node--active' : ''}`}>if score &gt;= 80 ➔ "A Grade 🔥"</div>
              <div className={`mml__node ${score >= 60 && score < 80 ? 'mml__node--active' : ''}`}>elif score &gt;= 60 ➔ "B Grade ⚡"</div>
              <div className={`mml__node ${score < 60 ? 'mml__node--active' : ''}`}>else ➔ "Needs Review 🌱"</div>
            </div>
          </div>
        )}

        {/* 5. LOOPS */}
        {chapterId === 'loops' && (
          <div className="mml__demo">
            <div className="mml__loop-stepper">
              <button className="btn-secondary" onClick={() => setLoopIdx((loopIdx + 1) % loopItems.length)}>Step Loop ⏭️ (Current: {loopIdx + 1}/{loopItems.length})</button>
            </div>
            <div className="mml__list-pills">
              {loopItems.map((item, i) => (
                <div key={item} className={`mml__pill ${i === loopIdx ? 'mml__pill--active' : ''}`}>
                  {item} {i === loopIdx ? '👈 Active Cursor' : ''}
                </div>
              ))}
            </div>
            <p className="mml__explain">The <code>for item in list</code> loop advances the active execution pointer one item at a time.</p>
          </div>
        )}

        {/* 6. LISTS */}
        {chapterId === 'lists' && (
          <div className="mml__demo">
            <div className="mml__list-pills">
              {list.map((item, i) => (
                <div key={i} className="mml__pill">
                  <span className="mml__pill-idx">[{i}]</span> {item}
                </div>
              ))}
            </div>
            <div className="mml__row" style={{ marginTop: 10 }}>
              <button className="btn-secondary" onClick={() => setList([...list, `Item ${list.length + 1}`])}>+ append()</button>
              <button className="btn-secondary" onClick={() => setList(list.slice(0, -1))} disabled={list.length <= 1}>- pop()</button>
              <span className="mml__explain">Length <code>len(list) = {list.length}</code></span>
            </div>
          </div>
        )}

        {/* 7. DICTIONARIES */}
        {chapterId === 'dictionaries' && (
          <div className="mml__demo">
            <div className="mml__dict-keys">
              {Object.keys(dictData).map(k => (
                <button key={k} className={`mml__key-btn ${selectedKey === k ? 'mml__key-btn--active' : ''}`} onClick={() => setSelectedKey(k)}>
                  Key: "{k}"
                </button>
              ))}
            </div>
            <div className="mml__dict-res">
              Hash Lookup ➔ <strong>dictData["{selectedKey}"] = {dictData[selectedKey]} Points</strong>
            </div>
            <p className="mml__explain">Dictionaries use hash functions to look up values directly by key in O(1) constant time!</p>
          </div>
        )}

        {/* 8. SETS */}
        {chapterId === 'sets' && (
          <div className="mml__demo">
            <div className="mml__row">
              <span className="mml__label">Incoming Items with Duplicates:</span>
              <code>[{rawList.join(', ')}]</code>
            </div>
            <button className="btn-secondary" onClick={() => setSetFilterActive(!setFilterActive)}>
              {setFilterActive ? 'Show Raw List' : 'Pass through set() ✨'}
            </button>
            <div className="mml__dict-res" style={{ marginTop: 10 }}>
              Stored Result: <strong>{setFilterActive ? `{${[...new Set(rawList)].join(', ')}}` : `[${rawList.join(', ')}]`}</strong>
            </div>
          </div>
        )}

        {/* 9. FUNCTIONS */}
        {chapterId === 'functions' && (
          <div className="mml__demo">
            <div className="mml__row">
              <label>Parameter <code>price</code>:</label>
              <input type="number" className="mml__input mml__input--num" value={funcInput} onChange={e => setFuncInput(Number(e.target.value))} />
            </div>
            <div className="mml__func-box">
              <span>def calculate_bill(price): return price * 1.05</span>
              <div className="mml__func-out">Return Value ➔ ₹{(funcInput * 1.05).toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* 10. SEARCH */}
        {chapterId === 'search-filter' && (
          <div className="mml__demo">
            <div className="mml__row">
              <span>Search Target:</span>
              <input type="text" className="mml__input" value={searchTarget} onChange={e => setSearchTarget(e.target.value)} />
              <button className="btn-secondary" onClick={() => {
                const found = ['Chai', 'Coffee', 'Samosa', 'Maggi'].findIndex(x => x.toLowerCase().includes(searchTarget.toLowerCase()));
                setSearchIdx(found);
              }}>Search 🔍</button>
            </div>
            <div className="mml__list-pills" style={{ marginTop: 10 }}>
              {['Chai', 'Coffee', 'Samosa', 'Maggi'].map((item, i) => (
                <div key={item} className={`mml__pill ${searchIdx === i ? 'mml__pill--active' : ''}`}>
                  [{i}] {item} {searchIdx === i ? '🎯 MATCH!' : ''}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. ERROR HANDLING */}
        {chapterId === 'error-handling' && (
          <div className="mml__demo">
            <div className="mml__row">
              <label>Simulate Input Error:</label>
              <button className="btn-secondary" onClick={() => setErrorSim(!errorSim)}>
                {errorSim ? 'Fix Input (Normal)' : 'Trigger Bad Input (-36)'}
              </button>
            </div>
            <div className={`mml__shield ${errorSim ? 'mml__shield--error' : 'mml__shield--ok'}`}>
              {errorSim ? '🛡️ try/except Shield Active: Bad input caught! Handled gracefully.' : '✓ Normal Execution: Inputs valid.'}
            </div>
          </div>
        )}

        {/* 12. ALGORITHMS */}
        {chapterId === 'algorithms' && (
          <div className="mml__demo">
            <div className="mml__row">
              <button className="btn-secondary" onClick={() => setSortList([...sortList].sort((a,b) => a-b))}>Sort Ascending 📶</button>
              <button className="btn-secondary" onClick={() => setSortList([...sortList].sort((a,b) => b-a))}>Sort Descending 📉</button>
            </div>
            <div className="mml__list-pills" style={{ marginTop: 10 }}>
              {sortList.map((num, i) => (
                <div key={i} className="mml__pill">[{i}] {num}</div>
              ))}
            </div>
          </div>
        )}

        {/* 13. FILES */}
        {chapterId === 'files' && (
          <div className="mml__demo">
            <button className="btn-secondary" onClick={() => setFileSaved(!fileSaved)}>
              {fileSaved ? 'Clear File' : 'with open("data.json", "w") as f 💾'}
            </button>
            <div className="mml__tree" style={{ marginTop: 10 }}>
              <div>RAM (Volatile): {fileSaved ? 'Data in RAM' : 'Data in RAM'}</div>
              <div className={fileSaved ? 'mml__node--active' : ''}>Disk File (Permanent): {fileSaved ? '💾 Saved to data.json ✓' : 'File Empty'}</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .mml { margin: 24px 0; padding: 20px; border-radius: 14px; background: rgba(96,165,250,0.04); border: 1px solid rgba(96,165,250,0.2); }
        .mml__head { margin-bottom: 14px; }
        .mml__tag { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #60A5FA; }
        .mml__title { font-size: 1.05rem; font-weight: 800; color: var(--text-primary); margin: 3px 0 0; }
        .mml__demo { display: flex; flex-direction: column; gap: 12px; }
        .mml__row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 0.84rem; color: var(--text-secondary); }
        .mml__input { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; font-family: var(--font-code); color: var(--text-primary); font-size: 0.85rem; }
        .mml__input--num { width: 70px; }
        .mml__mem-grid { display: flex; gap: 12px; }
        .mml__mem-cell { background: rgba(0,0,0,0.4); border: 1px solid var(--accent); padding: 12px; border-radius: 8px; display: flex; flex-direction: column; gap: 4px; }
        .mml__mem-addr { font-size: 0.68rem; color: var(--text-muted); font-family: var(--font-code); }
        .mml__mem-name { font-size: 0.85rem; font-weight: 700; color: #60A5FA; }
        .mml__mem-val { font-size: 0.95rem; font-weight: 800; color: var(--accent); font-family: var(--font-code); }
        .mml__pipe { display: flex; align-items: center; gap: 10px; font-family: var(--font-code); font-size: 1.1rem; }
        .mml__pipe-box { background: rgba(0,0,0,0.3); padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border); }
        .mml__pipe-res { background: rgba(168,255,62,0.15); border: 1px solid var(--accent); color: var(--accent); padding: 8px 14px; border-radius: 6px; font-weight: 800; }
        .mml__explain { font-size: 0.78rem; color: var(--text-muted); margin: 4px 0 0; line-height: 1.5; }
        .mml__str-cells { display: flex; gap: 6px; flex-wrap: wrap; }
        .mml__str-cell { background: rgba(0,0,0,0.3); border: 1px solid var(--border); padding: 8px; border-radius: 6px; text-align: center; display: flex; flex-direction: column; gap: 2px; }
        .mml__str-idx { font-size: 0.65rem; color: var(--text-muted); }
        .mml__str-char { font-size: 0.9rem; font-weight: 700; color: var(--accent); font-family: var(--font-code); }
        .mml__tree { display: flex; flex-direction: column; gap: 8px; }
        .mml__node { padding: 10px 14px; border-radius: 8px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); font-size: 0.84rem; color: var(--text-muted); }
        .mml__node--active { background: rgba(168,255,62,0.12) !important; border-color: var(--accent) !important; color: var(--text-primary) !important; font-weight: 700; }
        .mml__list-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .mml__pill { padding: 8px 12px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); font-size: 0.82rem; color: var(--text-secondary); }
        .mml__pill--active { background: rgba(168,255,62,0.15) !important; border-color: var(--accent) !important; color: var(--accent) !important; font-weight: 700; }
        .mml__dict-keys { display: flex; gap: 8px; }
        .mml__key-btn { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border); background: rgba(0,0,0,0.3); color: var(--text-secondary); font-size: 0.8rem; cursor: pointer; }
        .mml__key-btn--active { background: rgba(96,165,250,0.2); border-color: #60A5FA; color: #60A5FA; font-weight: 700; }
        .mml__dict-res { padding: 10px 14px; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); font-size: 0.85rem; color: var(--text-primary); }
        .mml__shield { padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; }
        .mml__shield--ok { background: rgba(168,255,62,0.1); color: var(--accent); border: 1px solid rgba(168,255,62,0.3); }
        .mml__shield--error { background: rgba(239,68,68,0.15); color: #FCA5A5; border: 1px solid rgba(239,68,68,0.4); }
        .btn-secondary { padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border); background: rgba(255,255,255,0.06); color: var(--text-primary); font-size: 0.8rem; font-weight: 600; cursor: pointer; }
        .btn-secondary:hover { background: rgba(255,255,255,0.12); }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// INSTANT MICRO-SANDBOX / INTERACTIVE TRY-IT WIDGET
// ─────────────────────────────────────────────────────────
function MicroSandbox({ initialCode }) {
  const [code, setCode] = useState(initialCode || '');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    setCode(initialCode || '');
    setOutput('');
    setHasRun(false);
  }, [initialCode]);

  function runPythonCode() {
    setRunning(true);
    setHasRun(true);

    setTimeout(() => {
      try {
        const logs = [];
        const lines = code.split('\n');
        let env = {};

        lines.forEach(line => {
          let trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return;

          // Emulate print(...)
          if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
            let inner = trimmed.slice(6, -1);
            let parts = inner.split(/,(?=(?:[^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/);
            let printedVals = parts.map(p => {
              p = p.trim();
              if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
                return p.slice(1, -1);
              }
              if (p.startsWith('f"') || p.startsWith("f'")) {
                let fstr = p.slice(2, -1);
                return fstr.replace(/\{([^}]+)\}/g, (_, expr) => {
                  try {
                    return evalWithEnv(expr, env);
                  } catch (e) {
                    return `{${expr}}`;
                  }
                });
              }
              return evalWithEnv(p, env);
            });
            logs.push(printedVals.join(' '));
            return;
          }

          // Emulate assignment var = expr
          if (trimmed.includes('=')) {
            let [varName, expr] = trimmed.split('=').map(s => s.trim());
            if (varName && expr && !trimmed.startsWith('if') && !trimmed.startsWith('for')) {
              env[varName] = evalWithEnv(expr, env);
            }
          }
        });

        if (logs.length === 0) {
          logs.push('✓ Code executed cleanly with 0 errors (No print output generated).');
        }

        setOutput(logs.join('\n'));
      } catch (err) {
        setOutput(`Traceback (most recent call last):\n  File "main.py", line 1\nSyntaxError/RuntimeError: ${err.message}`);
      } finally {
        setRunning(false);
      }
    }, 200);
  }

  function evalWithEnv(expr, env) {
    try {
      const keys = Object.keys(env);
      const vals = Object.values(env);
      const func = new Function(...keys, `return ${expr};`);
      return func(...vals);
    } catch {
      return expr;
    }
  }

  return (
    <div className="msb">
      <div className="msb__head">
        <div className="msb__title-row">
          <span className="msb__tag">⚡ Interactive Micro-Sandbox</span>
          <span className="msb__sub">Edit & execute Python code live in your browser</span>
        </div>
        <div className="msb__actions">
          <button className="msb__btn msb__btn--run" onClick={runPythonCode} disabled={running}>
            {running ? '⚙️ Running...' : '▶ Run Code'}
          </button>
          <button className="msb__btn msb__btn--reset" onClick={() => { setCode(initialCode || ''); setOutput(''); setHasRun(false); }}>
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="msb__editor">
        <textarea
          className="msb__textarea"
          value={code}
          onChange={e => setCode(e.target.value)}
          rows={Math.max(6, code.split('\n').length + 1)}
          spellCheck={false}
        />
      </div>

      {hasRun && (
        <div className="msb__terminal">
          <div className="msb__terminal-bar">
            <span className="msb__terminal-dot red"></span>
            <span className="msb__terminal-dot yellow"></span>
            <span className="msb__terminal-dot green"></span>
            <span className="msb__terminal-title">Terminal stdout ($ python main.py)</span>
          </div>
          <pre className="msb__terminal-out">{output}</pre>
        </div>
      )}

      <style>{`
        .msb { margin: 24px 0; border-radius: 14px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); overflow: hidden; }
        .msb__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--border); flex-wrap: wrap; }
        .msb__title-row { display: flex; flex-direction: column; gap: 2px; }
        .msb__tag { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
        .msb__sub { font-size: 0.8rem; color: var(--text-muted); }
        .msb__actions { display: flex; gap: 8px; }
        .msb__btn { padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: transform 0.15s, opacity 0.15s; border: none; }
        .msb__btn--run { background: var(--accent); color: #0D1117; }
        .msb__btn--run:hover { transform: translateY(-1px); }
        .msb__btn--reset { background: rgba(255,255,255,0.08); color: var(--text-secondary); border: 1px solid var(--border); }
        .msb__btn--reset:hover { background: rgba(255,255,255,0.15); }
        .msb__editor { padding: 14px 18px; background: rgba(0,0,0,0.4); }
        .msb__textarea { width: 100%; background: transparent; border: none; color: #F1F5F9; font-family: var(--font-code); font-size: 0.88rem; line-height: 1.6; resize: vertical; outline: none; }
        .msb__terminal { background: #0A0D12; border-top: 1px solid var(--border); }
        .msb__terminal-bar { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .msb__terminal-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .msb__terminal-dot.red { background: #EF4444; }
        .msb__terminal-dot.yellow { background: #F59E0B; }
        .msb__terminal-dot.green { background: #10B981; }
        .msb__terminal-title { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-code); margin-left: 6px; }
        .msb__terminal-out { padding: 12px 18px; margin: 0; font-family: var(--font-code); font-size: 0.84rem; color: var(--accent); line-height: 1.6; overflow-x: auto; white-space: pre-wrap; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// THEORY PHASE — docs-style
// ─────────────────────────────────────────────────────────
function TheoryPhase({ chapterId, theory, onComplete, alreadyDone }) {
  if (!theory) return null;

  // Split explanation into paragraphs — blank lines become spacers
  const explanationText = theory.explanation || '';
  const paragraphs = explanationText.split('\n').reduce((acc, line) => {
    if (line.trim() === '') {
      if (acc.length && acc[acc.length - 1] !== null) acc.push(null);
    } else { acc.push(line); }
    return acc;
  }, []);

  return (
    <div className="tp">
      {/* All elements below get targeted by the GSAP stagger in useEffect.
          DO NOT wrap in a single .theory-body — the bug was that animating
          .theory-body > * would re-animate elements already animated individually. */}

      <div className="theory-eyebrow">
        <span className="theory-eyebrow__tag">💡 You just discovered…</span>
      </div>

      <h1 className="theory-title">{theory.headline}</h1>

      <div className="theory-concept">{theory.concept}</div>

      <hr className="theory-divider" />

      {/* ── 1. BEFORE VS AFTER FRICTION SIMULATOR ───────────────── */}
      <BeforeVsAfter data={theory.beforeVsAfter} />

      <div className="theory-explanation">
        {paragraphs.map((p, i) =>
          p === null ? <div key={i} style={{ height: 6 }} /> : <p key={i}>{p}</p>
        )}
      </div>

      <div className="theory-code">
        <div className="theory-code__bar">
          <span className="theory-code__lang">Python</span>
          <span className="theory-code__run">Try it out!</span>
        </div>
        <pre className="theory-code__body">{theory.codeExample}</pre>
      </div>

      {/* ── 2. INSTANT MICRO-SANDBOX TRY-IT WIDGET ───────────────── */}
      <MicroSandbox initialCode={theory.codeExample} />

      {/* ── 3. INTERACTIVE MENTAL MODEL LAB ─────────────────────── */}
      <MentalModelLab chapterId={chapterId} />

      <div className="theory-callout">
        <div className="theory-callout__icon">🌍</div>
        <div>
          <p className="theory-callout__label">Real-world connection</p>
          <p className="theory-callout__text">{theory.realWorldConnection}</p>
        </div>
      </div>

      <div className="theory-takeaway">
        <CheckCircle2 size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
        <p><strong>Key takeaway:</strong> {theory.keyTakeaway}</p>
      </div>

      {/* Complete CTA — separate from the staggered elements */}
      <div className="theory-complete">
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: 0 }} />
        <div className="theory-complete__inner">
          <div>
            <p className="theory-complete__note">You've reached the end of this chapter.</p>
          </div>
          <button id="complete-chapter-btn" className="btn-complete" onClick={onComplete}>
            <CheckCircle2 size={16} />
            {alreadyDone ? 'Next chapter →' : 'Mark as Complete ✓'}
          </button>
        </div>
      </div>

      <style>{`
        .tp { display: flex; flex-direction: column; gap: 26px; }

        /* Each element is targeted directly by class name in GSAP — no parent > * */
        .theory-eyebrow {}
        .theory-eyebrow__tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--accent); background: rgba(168,255,62,0.08); border: 1px solid rgba(168,255,62,0.18);
          padding: 5px 12px; border-radius: 20px;
        }
        .theory-title {
          font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 800;
          color: var(--text-primary); margin: 0; letter-spacing: -0.02em; line-height: 1.2;
        }
        .theory-concept {
          font-family: var(--font-heading);
          font-size: clamp(2.4rem, 7vw, 4rem); font-weight: 900; line-height: 1;
          background: linear-gradient(135deg, var(--accent) 0%, #5BFFB0 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .theory-divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 0; }
        .theory-explanation { display: flex; flex-direction: column; gap: 2px; }
        .theory-explanation p { font-size: 0.96rem; color: var(--text-secondary); line-height: 1.85; margin: 0; }
        .theory-code { border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); background: #0D1117; }
        .theory-code__bar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .theory-code__lang { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
        .theory-code__run { font-size: 0.7rem; color: var(--text-muted); }
        .theory-code__body { padding: 20px; margin: 0; overflow-x: auto; font-family: var(--font-mono); font-size: 0.86rem; color: #c9d1d9; line-height: 1.7; white-space: pre; }
        .theory-callout { display: flex; gap: 14px; align-items: flex-start; padding: 16px 18px; border-radius: 10px; background: rgba(168,255,62,0.04); border-left: 3px solid var(--accent); }
        .theory-callout__icon { font-size: 1.1rem; flex-shrink: 0; }
        .theory-callout__label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.09em; color: var(--accent); margin: 0 0 6px; }
        .theory-callout__text { font-size: 0.89rem; color: var(--text-secondary); margin: 0; line-height: 1.7; }
        .theory-takeaway { display: flex; gap: 11px; align-items: flex-start; padding: 14px 16px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); }
        .theory-takeaway p { font-size: 0.89rem; color: var(--text-secondary); margin: 0; line-height: 1.6; }
        .theory-takeaway strong { color: var(--text-primary); }
        .theory-complete { display: flex; flex-direction: column; gap: 16px; padding-top: 4px; }
        .theory-complete__inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .theory-complete__note { font-size: 0.82rem; color: var(--text-muted); margin: 0; }
        .btn-complete { display: inline-flex; align-items: center; gap: 9px; padding: 12px 24px; background: var(--accent); color: #0D1117; border: none; border-radius: 9px; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap; }
        .btn-complete:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168,255,62,0.28); }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Shared Spinner
// ─────────────────────────────────────────────────────────
function Spinner({ size = 18, color = 'var(--accent)' }) {
  return (
    <span style={{
      width: size, height: size, display: 'inline-block', borderRadius: '50%',
      border: `2px solid rgba(0,0,0,0.15)`, borderTop: `2px solid ${color}`,
      animation: 'cp-spin 0.7s linear infinite', flexShrink: 0,
    }} />
  );
}
