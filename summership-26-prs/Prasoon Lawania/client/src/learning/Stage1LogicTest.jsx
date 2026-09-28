import React, { useState, useMemo } from 'react';
import { C, InlineMarkdown } from './utils.jsx';

// ─── Single option button ─────────────────────────────────────────────────────
function OptionCard({ option, onClick, state }) {
  const isCorrect  = state === 'selected-correct';
  const isWrong    = state === 'selected-incorrect';
  const isDimmed   = state === 'dimmed';

  return (
    <button
      onClick={() => !state && onClick(option)}
      disabled={!!state}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '1rem 1.25rem',
        borderRadius: 12,
        border: isCorrect
          ? '1.5px solid #4ade80'
          : isWrong
          ? '1.5px solid #f87171'
          : `1.5px solid ${C.border}`,
        background: isCorrect
          ? 'rgba(74,222,128,.08)'
          : isWrong
          ? 'rgba(248,113,113,.08)'
          : C.cardBg,
        color: isDimmed ? C.muted : C.text,
        fontSize: '0.93rem',
        lineHeight: 1.6,
        cursor: state ? 'default' : 'pointer',
        opacity: isDimmed ? 0.45 : 1,
        transition: 'all .2s ease',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}
      onMouseEnter={(e) => {
        if (!state) {
          e.currentTarget.style.borderColor = '#7b9f27';
          e.currentTarget.style.background  = '#f5fbeb';
        }
      }}
      onMouseLeave={(e) => {
        if (!state) {
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.background  = C.cardBg;
        }
      }}
    >
      {/* Status dot */}
      <span style={{
        width: 20, height: 20, borderRadius: '50%',
        background: isCorrect ? '#4ade80' : isWrong ? '#f87171' : '#e7dfd2',
        border: isCorrect || isWrong ? 'none' : `2px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: '0.7rem', marginTop: 2,
        color: '#fff', fontWeight: 700,
      }}>
        {isCorrect ? '✓' : isWrong ? '✕' : ''}
      </span>

      <span><InlineMarkdown text={option.text} /></span>
    </button>
  );
}

// ─── Reflection callout ───────────────────────────────────────────────────────
function ReflectionPrompt({ prompt }) {
  return (
    <div style={{
      background: 'rgba(251,191,36,.07)',
      border: '1px solid rgba(251,191,36,.4)',
      borderRadius: 12,
      padding: '1rem 1.25rem',
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💭</span>
      <p style={{ fontSize: '0.92rem', color: C.body, lineHeight: 1.65, margin: 0 }}>
        <InlineMarkdown text={prompt} />
      </p>
    </div>
  );
}

// ─── Stage 1 Logic Test ─────────────────────────────────────────────────────
export default function Stage1LogicTest({ caseStudy, onComplete }) {
  const { stage1, scenario } = caseStudy;
  const { attempt1, reflections } = stage1;

  const [phase, setPhase]                     = useState(1);
  const [activeReflection, setActiveReflection] = useState(null);
  const [optionStates, setOptionStates]       = useState({});
  const [attempt2States, setAttempt2States]   = useState({});
  const [completing, setCompleting]           = useState(false);

  // Shuffle helper
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Shuffle attempt1 once per case study mount
  const shuffledAttempt1 = useMemo(() => shuffle(attempt1), [attempt1]);

  // Shuffle attempt2 when a reflection becomes active
  const shuffledAttempt2 = useMemo(
    () => activeReflection ? shuffle(activeReflection.attempt2) : [],
    [activeReflection]
  );

  const handleAttempt1Click = (option, index) => {
    if (option.status === 'correct') {
      setOptionStates({ [index]: 'selected-correct' });
      setCompleting(true);
      setTimeout(() => onComplete(), 1000);
    } else {
      const states = {};
      shuffledAttempt1.forEach((_, i) => { states[i] = i === index ? 'selected-incorrect' : 'dimmed'; });
      setOptionStates(states);
      setActiveReflection(reflections[option.routesTo]);
      setPhase(2);
    }
  };

  const handleAttempt2Click = (option, index) => {
    const states = {};
    shuffledAttempt2.forEach((_, i) => {
      states[i] = i === index
        ? (option.status === 'correct' ? 'selected-correct' : 'selected-incorrect')
        : 'dimmed';
    });
    setAttempt2States(states);
    setCompleting(true);
    setTimeout(() => onComplete(), 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* ── Scenario card ── */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎯</span>
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: C.label, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', marginTop: 0 }}>
            Scenario
          </p>
          <p style={{ fontSize: '1.05rem', color: C.text, lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
            {scenario}
          </p>
        </div>
      </div>

      {/* ── Attempt 1 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          {phase === 1 ? 'How would you approach this?' : 'Your initial choice'}
        </p>
        {shuffledAttempt1.map((option, i) => (
          <OptionCard
            key={i}
            option={option}
            onClick={(o) => handleAttempt1Click(o, i)}
            state={optionStates[i] || null}
          />
        ))}
      </div>

      {/* ── Reflection + Attempt 2 ── */}
      {phase === 2 && activeReflection && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'csSlideIn .3s ease-out' }}>
          <style>{`@keyframes csSlideIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }`}</style>

          <ReflectionPrompt prompt={activeReflection.prompt} />

          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.5rem', marginBottom: 0 }}>
            Try again what fits better?
          </p>

          {shuffledAttempt2.map((option, i) => (
            <OptionCard
              key={i}
              option={option}
              onClick={(o) => handleAttempt2Click(o, i)}
              state={attempt2States[i] || null}
            />
          ))}
        </div>
      )}

      {completing && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '0.88rem', fontWeight: 600 }}>
          <span>✓</span> Moving to Concept Reveal…
        </div>
      )}
    </div>
  );
}
