import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, BookOpen, Cpu, BarChart3, Code2, Layers } from 'lucide-react';

const OBJECTIVES = [
  { icon: '🔁', text: 'Understand how recursive functions call themselves' },
  { icon: '📚', text: 'Visualise call stack construction and unwinding' },
  { icon: '🛑', text: 'Learn the role and design of a base case' },
  { icon: '🐍', text: 'Execute and trace recursive Python programs' },
  { icon: '📝', text: 'Evaluate conceptual understanding through assessment' },
];

const STATS = [
  { label: '7 Scenes', sub: 'Progressive lessons' },
  { label: 'Live IDE', sub: 'Interactive execution' },
  { label: '5 MCQs',  sub: 'Conceptual assessment' },
];

export default function IntroScene({ onBegin }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="intro-overlay" onClick={e => e.stopPropagation()}>
      {/* Background grid */}
      <div className="intro-grid-bg" />

      <div className={`intro-card ${visible ? 'intro-card--visible' : ''}`}>

        {/* ── Logo / Brand strip ────────────────────────────────────────── */}
        <div className="intro-brand-strip">
          <div className="intro-logo-box">
            <Code2 className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <p className="intro-brand-name">PyBe</p>
            <p className="intro-brand-tag">Interactive Visual Learning Framework</p>
          </div>
        </div>

        {/* ── Main heading ─────────────────────────────────────────────── */}
        <div className="intro-heading-block">
          <h1 className="intro-main-title">
            Understanding Python Recursion
          </h1>
          <p className="intro-subtitle">
            Through Visualization and Hands-On Practice
          </p>
        </div>

        {/* ── Problem statement ─────────────────────────────────────────── */}
        <div className="intro-problem-card">
          <div className="intro-problem-label">
            <BookOpen className="w-3.5 h-3.5" />
            Research Motivation
          </div>
          <p className="intro-problem-text">
            Recursion is one of the most challenging programming concepts for beginners because
            its execution process is <strong>invisible to the learner</strong>. PyBe converts
            abstract recursive behaviour into a <strong>visual, interactive experience</strong> —
            enabling students to observe, trace, and execute recursion step-by-step.
          </p>
        </div>

        {/* ── Learning objectives ───────────────────────────────────────── */}
        <div className="intro-objectives-grid">
          {OBJECTIVES.map((obj, i) => (
            <div
              key={i}
              className="intro-obj-row"
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <span className="intro-obj-icon">{obj.icon}</span>
              <span className="intro-obj-text">{obj.text}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-auto opacity-60" />
            </div>
          ))}
        </div>

        {/* ── Quick stats ───────────────────────────────────────────────── */}
        <div className="intro-stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="intro-stat-pill">
              <span className="intro-stat-value">{s.label}</span>
              <span className="intro-stat-sub">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <button className="intro-begin-btn" onClick={onBegin}>
          Begin Learning Adventure
          <ChevronRight className="w-5 h-5" />
        </button>

        <p className="intro-keyboard-note">
          or press <kbd className="intro-kbd">Enter</kbd> to start
        </p>

      </div>
    </div>
  );
}
