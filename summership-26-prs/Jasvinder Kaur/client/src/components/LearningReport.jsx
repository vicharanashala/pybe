import React from 'react';
import { CheckCircle2, RotateCcw, BookOpen, BarChart3, ArrowRight } from 'lucide-react';

const CONCEPTS = [
  'Recursion Fundamentals',
  'Recursive Function Calls',
  'Call Stack Behaviour',
  'Base Case Design',
  'Stack Unwinding',
  'Python Implementation',
];

const LEVEL_MAP = [
  { min: 80, label: 'Mastered',       colour: '#34D399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.40)' },
  { min: 60, label: 'Proficient',     colour: '#60A5FA', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.40)' },
  { min: 40, label: 'Developing',     colour: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.40)' },
  { min:  0, label: 'Needs Review',   colour: '#F87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.40)' },
];

function getLevel(pct) {
  return LEVEL_MAP.find(l => pct >= l.min) ?? LEVEL_MAP[LEVEL_MAP.length - 1];
}

export default function LearningReport({ score, total, onRetry, onClose }) {
  const percentage = Math.round((score / total) * 100);
  const level      = getLevel(percentage);
  const passed     = percentage >= 50;

  return (
    <div className="lr-overlay" onClick={e => e.stopPropagation()}>
      <div className="lr-card">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="lr-header">
          <div className="lr-header-icon">
            <BarChart3 className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h2 className="lr-title">Learning Progress Report</h2>
            <p className="lr-subtitle">PyBe · Recursion Module · Assessment Summary</p>
          </div>
        </div>

        {/* ── Score block ────────────────────────────────────────── */}
        <div className="lr-score-block" style={{ borderColor: level.border, background: level.bg }}>
          <div className="lr-percentage" style={{ color: level.colour }}>
            {percentage}%
          </div>
          <div className="lr-score-details">
            <span className="lr-raw-score">Score: <strong>{score}/{total}</strong></span>
            <span
              className="lr-level-badge"
              style={{ background: level.bg, borderColor: level.border, color: level.colour }}
            >
              {level.label}
            </span>
          </div>
        </div>

        {/* ── Concepts checklist ─────────────────────────────────── */}
        <div className="lr-concepts-section">
          <div className="lr-section-label">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Concepts Completed
          </div>
          <div className="lr-concepts-grid">
            {CONCEPTS.map((concept, i) => (
              <div key={i} className="lr-concept-row">
                <CheckCircle2
                  className="w-4 h-4 shrink-0"
                  style={{ color: i < 5 || passed ? '#34D399' : '#F87171' }}
                />
                <span className="lr-concept-text">{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Progress bar ────────────────────────────────────────── */}
        <div className="lr-progress-section">
          <div className="lr-section-label">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            Quiz Performance
          </div>
          <div className="lr-progress-track">
            <div
              className="lr-progress-fill"
              style={{ width: `${percentage}%`, background: `linear-gradient(90deg, #8B5CF6, ${level.colour})` }}
            />
          </div>
          <div className="lr-progress-labels">
            <span>0%</span>
            <span style={{ color: level.colour }}>{percentage}% achieved</span>
            <span>100%</span>
          </div>
        </div>

        {/* ── Module verdict ───────────────────────────────────────── */}
        <div
          className="lr-verdict"
          style={{ borderColor: level.border, background: level.bg }}
        >
          <span className="lr-verdict-label" style={{ color: level.colour }}>
            {passed ? '✓ Module Status:' : '⚠ Module Status:'}
          </span>
          <span className="lr-verdict-text">
            {passed
              ? 'Recursion fundamentals successfully understood. Proceed to advanced recursion patterns.'
              : 'Further review recommended. Re-attempt the quiz to strengthen conceptual understanding.'}
          </span>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className="lr-actions">
          {!passed && (
            <button className="lr-retry-btn" onClick={onRetry}>
              <RotateCcw className="w-4 h-4" />
              Retry Assessment
            </button>
          )}
          <button className="lr-close-btn" onClick={onClose}>
            {passed ? 'Complete Module' : 'Exit Report'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
