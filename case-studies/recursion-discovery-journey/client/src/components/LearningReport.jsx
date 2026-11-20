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

export default function LearningReport({ passed, onRetry, onClose }) {
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

        {/* ── Concepts checklist ─────────────────────────────────── */}
        <div className="lr-concepts-section">
          <div className="lr-section-label">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Concepts Explored
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

        {/* ── Module verdict ───────────────────────────────────────── */}
        <div
          className="lr-verdict"
          
        >
          <span className="lr-verdict-label" >
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
