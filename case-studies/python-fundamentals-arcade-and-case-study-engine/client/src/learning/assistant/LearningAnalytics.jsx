import React from 'react';
import { C } from '../utils.jsx';

export default function LearningAnalytics({ summaryObj }) {
  if (!summaryObj) return null;

  const {
    accuracy,
    firstTryRate,
    strengths,
    needsPractice,
    insight,
    recommendation,
    completionTime,
    hintsUsed
  } = summaryObj;

  const formatTime = (secs) => {
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${C.accentBorder}`,
      borderRadius: 16,
      padding: '1.75rem',
      maxWidth: 580,
      margin: '1.5rem auto',
      boxShadow: '0 8px 32px rgba(119,159,39,.08)',
      animation: 'csFadeIn .5s ease-out',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '2.5rem' }}>📊</span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: C.text, margin: '0.5rem 0 0.25rem 0' }}>
          Personalized Learning Summary
        </h3>
        <p style={{ fontSize: '0.82rem', color: C.muted, margin: 0 }}>
          Based on your performance in this level's case studies
        </p>
      </div>

      {/* KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        background: '#fffdf7',
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: '1rem',
        textAlign: 'center'
      }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: C.label, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Accuracy
          </span>
          <strong style={{ fontSize: '1.5rem', color: accuracy >= 80 ? C.success : C.warning }}>
            {accuracy}%
          </strong>
        </div>
        <div style={{ borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
          <span style={{ display: 'block', fontSize: '0.7rem', color: C.label, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            First Try
          </span>
          <strong style={{ fontSize: '1.5rem', color: C.text }}>
            {firstTryRate}%
          </strong>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.7rem', color: C.label, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Duration
          </span>
          <strong style={{ fontSize: '1.3rem', color: C.muted, lineHeight: '2.1rem' }}>
            {formatTime(completionTime)}
          </strong>
        </div>
      </div>

      {/* Strengths / Practice Split */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Strengths */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: C.success, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            💪 Strengths
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {strengths.map((item, idx) => (
              <li key={idx} style={{ fontSize: '0.88rem', color: C.body, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: C.success, fontWeight: 700 }}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Needs Practice */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: C.warning, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            📚 Needs Practice
          </h4>
          {needsPractice.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {needsPractice.map((item, idx) => (
                <li key={idx} style={{ fontSize: '0.88rem', color: C.body, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: C.warning, fontWeight: 700 }}>•</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.85rem', color: C.success, margin: 0, fontStyle: 'italic' }}>
              Excellent! No major practice focus items.
            </p>
          )}
        </div>
      </div>

      {/* Recommendations & Insights */}
      <div style={{
        background: C.accentBg,
        border: `1px solid ${C.accentBorder}`,
        borderRadius: 12,
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            🧠 Session Insight
          </h4>
          <span style={{ fontSize: '0.72rem', color: C.muted }}>
            Hints consulted: {hintsUsed}
          </span>
        </div>
        <p style={{ fontSize: '0.88rem', color: C.body, margin: 0, lineHeight: 1.5 }}>
          {insight}
        </p>
        <div style={{ borderTop: `1px solid ${C.accentBorder}`, paddingTop: '0.6rem', marginTop: '0.3rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <strong style={{ fontSize: '0.82rem', color: C.text }}>Recommendation:</strong>
          <span style={{ fontSize: '0.85rem', color: C.success, fontWeight: 600 }}>{recommendation}</span>
        </div>
      </div>
    </div>
  );
}
