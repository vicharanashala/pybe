import React, { useState } from 'react';

/**
 * ConceptBridge — Piece-by-Piece Code Mastery Flow:
 * 1. Piece-by-Piece Breakdown (Disassemble code into microscopic building blocks)
 * 2. Quick Check (MCQ testing the exact piece)
 * 3. Fill in the Blank (Interactive code completion)
 * 4. "🎉 You Just Wrote and Mastered This Code!"
 *
 * Props:
 *   concept: {
 *     conceptName: string,
 *     pythonTerm: string,
 *     englishExplanation: string,
 *     parts: [{ code, label, explanation }],
 *     mcq: {
 *       question: string,
 *       options: [{ id, text, correct, feedback }]
 *     },
 *     fillBlank: {
 *       instruction: string,
 *       template: string,
 *       options: string[],
 *       answer: string,
 *     },
 *     codeSnippet: string,
 *     codeExplanation: string
 *   }
 *   chapterColor: string
 *   onComplete: function
 */
export default function ConceptBridge({
  concept,
  chapterColor = '#39d353',
  onComplete,
}) {
  // Sub-steps: 'breakdown' -> 'mcq' -> 'fill' -> 'celebrate'
  const [subStep, setSubStep] = useState('breakdown');

  // Piece-by-piece explorer state
  const [activePartIdx, setActivePartIdx] = useState(0);
  const [viewedParts, setViewedParts] = useState(new Set([0]));

  // MCQ state
  const [selectedOption, setSelectedOption] = useState(null);
  const [mcqRevealed, setMcqRevealed] = useState(false);

  // Fill in blank state
  const [chosenBlank, setChosenBlank] = useState(null);
  const [blankRevealed, setBlankRevealed] = useState(false);

  if (!concept) return null;

  const parts = concept.parts || [
    { code: concept.pythonTerm, label: 'The Command', explanation: concept.englishExplanation }
  ];

  function handleSelectPart(idx) {
    setActivePartIdx(idx);
    setViewedParts((prev) => new Set([...prev, idx]));
  }

  function handleNextPart() {
    if (activePartIdx < parts.length - 1) {
      handleSelectPart(activePartIdx + 1);
    } else {
      setSubStep('mcq');
    }
  }

  function handlePrevPart() {
    if (activePartIdx > 0) {
      handleSelectPart(activePartIdx - 1);
    }
  }

  function handleMcqSelect(opt) {
    if (mcqRevealed) return;
    setSelectedOption(opt);
    setMcqRevealed(true);
  }

  function handleBlankSelect(opt) {
    if (blankRevealed) return;
    setChosenBlank(opt);
    setBlankRevealed(true);
  }

  const isMcqCorrect = selectedOption?.correct;
  const isBlankCorrect = chosenBlank === concept?.fillBlank?.answer;
  const currentPart = parts[activePartIdx] || parts[0];

  return (
    <div
      className="concept-bridge"
      style={{
        marginTop: '20px',
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${chapterColor}44`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.35)`,
      }}
    >
      {/* ── Sub-step Progress Tabs ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🧩</span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Code Mastery: <span style={{ color: chapterColor }}>{concept.conceptName}</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'breakdown', label: '1. Piece by Piece' },
            { id: 'mcq', label: '2. Quick Check' },
            { id: 'fill', label: '3. Fill in Blank' },
            { id: 'celebrate', label: '4. Code Mastered!' },
          ].map((item) => {
            const stepOrder = ['breakdown', 'mcq', 'fill', 'celebrate'];
            const currentIdx = stepOrder.indexOf(subStep);
            const thisIdx = stepOrder.indexOf(item.id);
            const isDone = thisIdx < currentIdx;
            const isActive = thisIdx === currentIdx;

            return (
              <button
                key={item.id}
                onClick={() => setSubStep(item.id)}
                style={{
                  fontSize: '0.74rem',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? chapterColor : 'rgba(255,255,255,0.1)'}`,
                  background: isActive ? `${chapterColor}22` : isDone ? 'rgba(57, 211, 83, 0.1)' : 'transparent',
                  color: isActive ? chapterColor : isDone ? 'var(--green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                }}
              >
                {isDone ? `✓ ${item.label.split(' ')[1]}` : item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEP 1: Piece-by-Piece Code Breakdown ── */}
      {subStep === 'breakdown' && (
        <div className="bridge-step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: chapterColor, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Step 1 · Code Anatomy
            </span>
            <h3 style={{ margin: '4px 0 6px', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              Break It Down Piece by Piece
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Click each piece below to see what every single part does in plain English:
            </p>
          </div>

          {/* Interactive Code Building Blocks */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              padding: '16px 20px',
              borderRadius: '12px',
              background: '#0d1117',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              marginBottom: '18px',
            }}
          >
            {parts.map((p, idx) => {
              const isActive = idx === activePartIdx;
              const isViewed = viewedParts.has(idx);

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectPart(idx)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: `2px solid ${isActive ? chapterColor : isViewed ? 'rgba(57,211,83,0.4)' : 'rgba(255,255,255,0.15)'}`,
                    background: isActive ? `${chapterColor}25` : isViewed ? 'rgba(57,211,83,0.08)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? chapterColor : isViewed ? '#7ee787' : 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 0 16px ${chapterColor}44` : 'none',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                  title={`Click to inspect part ${idx + 1}: ${p.label}`}
                >
                  <span>{p.code}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.8, fontFamily: 'inherit', fontWeight: 500 }}>
                    {p.label.split('.')[0] ? `Part ${idx + 1}` : ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Piece Explanation Card */}
          <div
            style={{
              padding: '18px 22px',
              borderRadius: '12px',
              background: `${chapterColor}10`,
              border: `1px solid ${chapterColor}44`,
              marginBottom: '20px',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: chapterColor,
                    padding: '2px 10px',
                    borderRadius: '6px',
                    background: '#0d1117',
                    border: `1px solid ${chapterColor}66`,
                  }}
                >
                  {currentPart.code}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  {currentPart.label}
                </span>
              </div>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Piece {activePartIdx + 1} of {parts.length}
              </span>
            </div>

            <p style={{ margin: '8px 0 0', fontSize: '0.96rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              {currentPart.explanation}
            </p>
          </div>

          {/* Piece Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handlePrevPart}
              disabled={activePartIdx === 0}
              style={{ visibility: activePartIdx === 0 ? 'hidden' : 'visible' }}
            >
              ← Previous Piece
            </button>

            <button
              className="btn btn-primary"
              onClick={handleNextPart}
              style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))` }}
            >
              {activePartIdx < parts.length - 1 ? 'Next Piece →' : 'I Understand This Code → Quick Check'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Quick Check (MCQ) ── */}
      {subStep === 'mcq' && (
        <div className="bridge-step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', color: chapterColor, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Step 2 · Check Your Understanding
            </span>
            <h4 style={{ margin: '4px 0 12px', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              {concept.mcq.question}
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {concept.mcq.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              let bg = 'rgba(255, 255, 255, 0.04)';
              let border = 'rgba(255, 255, 255, 0.12)';
              let icon = '⚪';

              if (mcqRevealed) {
                if (opt.correct) {
                  bg = 'rgba(57, 211, 83, 0.15)';
                  border = 'var(--green)';
                  icon = '✅';
                } else if (isSelected) {
                  bg = 'rgba(255, 123, 114, 0.15)';
                  border = 'var(--error)';
                  icon = '❌';
                } else {
                  bg = 'rgba(255, 255, 255, 0.02)';
                  border = 'rgba(255, 255, 255, 0.06)';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleMcqSelect(opt)}
                  disabled={mcqRevealed}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: bg,
                    border: `1px solid ${border}`,
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: mcqRevealed ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.94rem',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{icon}</span>
                  <span style={{ flexGrow: 1 }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          {mcqRevealed && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 18px',
                borderRadius: '10px',
                background: isMcqCorrect ? 'rgba(57, 211, 83, 0.12)' : 'rgba(255, 123, 114, 0.12)',
                border: `1px solid ${isMcqCorrect ? 'var(--green)' : 'var(--error)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.92rem',
              }}
            >
              <span>{isMcqCorrect ? '🎉' : '💡'}</span>
              <span>{selectedOption?.feedback || concept.mcq.options.find((o) => o.correct)?.feedback}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSubStep('breakdown')}>
              ← Back to Code Breakdown
            </button>

            {mcqRevealed && (
              <button
                className="btn btn-primary"
                onClick={() => setSubStep('fill')}
                style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))` }}
              >
                Now Write the Code Piece (Fill in Blank) →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: Fill in the Blank ── */}
      {subStep === 'fill' && (
        <div className="bridge-step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', color: chapterColor, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Step 3 · Write the Missing Piece
            </span>
            <h4 style={{ margin: '4px 0 10px', fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              {concept.fillBlank.instruction}
            </h4>
          </div>

          {/* Interactive Code Display Box */}
          <div
            style={{
              padding: '18px 24px',
              borderRadius: '12px',
              background: '#0d1117',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              color: '#c9d1d9',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              marginBottom: '18px',
            }}
          >
            {(() => {
              const parts = concept.fillBlank.template.split('_____');
              return (
                <>
                  <span>{parts[0]}</span>
                  <span
                    style={{
                      padding: '3px 14px',
                      borderRadius: '6px',
                      background: blankRevealed
                        ? isBlankCorrect
                          ? 'rgba(57, 211, 83, 0.25)'
                          : 'rgba(255, 123, 114, 0.25)'
                        : `${chapterColor}25`,
                      border: `2px dashed ${
                        blankRevealed
                          ? isBlankCorrect
                            ? 'var(--green)'
                            : 'var(--error)'
                          : chapterColor
                      }`,
                      color: blankRevealed
                        ? isBlankCorrect
                          ? 'var(--green)'
                          : 'var(--error)'
                        : chapterColor,
                      fontWeight: 700,
                      minWidth: '70px',
                      textAlign: 'center',
                      display: 'inline-block',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {chosenBlank || '???'}
                  </span>
                  <span>{parts[1] || ''}</span>
                </>
              );
            })()}
          </div>

          {/* Blank Choice Options */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>
              Choose the correct piece:
            </span>
            {concept.fillBlank.options.map((opt) => {
              const isSelected = chosenBlank === opt;
              const isCorrectOpt = opt === concept.fillBlank.answer;
              let bg = 'rgba(255, 255, 255, 0.07)';
              let border = 'rgba(255, 255, 255, 0.2)';

              if (blankRevealed) {
                if (isCorrectOpt) {
                  bg = 'rgba(57, 211, 83, 0.2)';
                  border = 'var(--green)';
                } else if (isSelected) {
                  bg = 'rgba(255, 123, 114, 0.2)';
                  border = 'var(--error)';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleBlankSelect(opt)}
                  disabled={blankRevealed}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    background: bg,
                    border: `1px solid ${border}`,
                    fontFamily: 'monospace',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: blankRevealed && isCorrectOpt ? 'var(--green)' : 'var(--text-primary)',
                    cursor: blankRevealed ? 'default' : 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {blankRevealed && (
            <div
              style={{
                padding: '12px 18px',
                borderRadius: '10px',
                background: isBlankCorrect ? 'rgba(57, 211, 83, 0.12)' : 'rgba(255, 123, 114, 0.12)',
                border: `1px solid ${isBlankCorrect ? 'var(--green)' : 'var(--error)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.92rem',
                marginBottom: '16px',
              }}
            >
              <span>{isBlankCorrect ? '🎉' : '💡'}</span>
              <span>
                {isBlankCorrect
                  ? `Spot on! "${concept.fillBlank.answer}" completes the code perfectly.`
                  : `Close! The correct Python word is "${concept.fillBlank.answer}".`}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSubStep('mcq')}>
              ← Back to MCQ
            </button>

            {blankRevealed && (
              <button
                className="btn btn-primary"
                onClick={() => setSubStep('celebrate')}
                style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.2))` }}
              >
                See Assembled Code! →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 4: "🎉 You Mastered This Code!" ── */}
      {subStep === 'celebrate' && (
        <div className="bridge-step-content" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div
            style={{
              padding: '24px',
              borderRadius: '14px',
              background: `linear-gradient(145deg, rgba(57, 211, 83, 0.14), rgba(0, 0, 0, 0.45))`,
              border: `2px solid ${chapterColor}`,
              boxShadow: `0 0 28px ${chapterColor}33`,
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>🎉</div>
            <h3
              style={{
                margin: '0 0 6px',
                fontSize: '1.45rem',
                fontFamily: 'var(--font-heading)',
                color: '#ffffff',
                textShadow: '0 0 16px rgba(57, 211, 83, 0.5)',
              }}
            >
              You Mastered This Code Piece by Piece!
            </h3>
            <p style={{ margin: '0 0 18px', color: 'var(--text-secondary)', fontSize: '0.94rem' }}>
              You understand every single character in this command:
            </p>

            {/* Glowing Code Card */}
            <div
              style={{
                maxWidth: '480px',
                margin: '0 auto',
                background: '#0d1117',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '10px',
                padding: '16px 20px',
                textAlign: 'left',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: '0.75rem', color: '#8b949e', marginLeft: '6px' }}>python</span>
              </div>
              <pre
                style={{
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '1.15rem',
                  color: chapterColor,
                  fontWeight: 700,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {concept.codeSnippet}
              </pre>
            </div>

            <p style={{ margin: '18px auto 0', maxWidth: '520px', fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {concept.codeExplanation}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setSubStep('fill')}>
              ← Back to Code Fill
            </button>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => onComplete && onComplete()}
              style={{
                background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.25))`,
                boxShadow: `0 0 20px ${chapterColor}44`,
                padding: '12px 28px',
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              Continue to Next Level →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
