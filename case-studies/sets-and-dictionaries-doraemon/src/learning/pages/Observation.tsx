import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Eye, ChevronDown } from 'lucide-react';

// Same stamp box from the Problem scene
const ALL_STAMPS = [
  'Triceratops', 'T-Rex', 'Triceratops', 'Brachiosaurus',
  'T-Rex', 'Pterodactyl', 'Triceratops', 'Pterodactyl',
  'Stegosaurus', 'T-Rex', 'Brachiosaurus', 'Pterodactyl',
];

const STAMP_EMOJI: Record<string, string> = {
  Triceratops:   '🦕',
  'T-Rex':       '🦖',
  Brachiosaurus: '🦕',
  Pterodactyl:   '🦅',
  Stegosaurus:   '🦕',
};

// Count occurrences
const countMap = ALL_STAMPS.reduce<Record<string, number>>((acc, s) => {
  acc[s] = (acc[s] || 0) + 1;
  return acc;
}, {});
const uniqueNames = Object.keys(countMap);

// ── Question definitions ──────────────────────────────────────
interface Question {
  id: string;
  text: string;
  choices: string[];
  correct: string;
  revealLabel: string;        // label on the reveal button after answering
  revealContent: React.ReactNode;
}

const questions: Question[] = [
  {
    id: 'q1',
    text: "Look at Nobita's box. What do you notice?",
    choices: [
      'Every stamp in the box is different',
      'Some stamps appear more than once',
      'The stamps are sorted alphabetically',
      'There are exactly 5 stamps in the box',
    ],
    correct: 'Some stamps appear more than once',
    revealLabel: 'See the count',
    revealContent: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
        {uniqueNames.map((name) => (
          <div key={name} style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: countMap[name] > 1 ? 'rgba(239,68,68,0.07)' : 'rgba(34,197,94,0.07)',
            border: `1px solid ${countMap[name] > 1 ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
            fontSize: '12px', fontWeight: 700,
            color: countMap[name] > 1 ? '#b91c1c' : '#15803d',
            display: 'flex', alignItems: 'center', gap: '5px'
          }}>
            <span>{STAMP_EMOJI[name]}</span>
            <span>{name}</span>
            <span style={{ fontWeight: 900 }}>×{countMap[name]}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'q2',
    text: "Which stamps repeat in the box?",
    choices: [
      'Only Triceratops repeats',
      'T-Rex and Pterodactyl repeat',
      'Triceratops, T-Rex, and Pterodactyl all repeat',
      'None of the stamps repeat',
    ],
    correct: 'Triceratops, T-Rex, and Pterodactyl all repeat',
    revealLabel: 'Highlight repeats',
    revealContent: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
        <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
          These three appear more than once in Nobita's box:
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Triceratops', 'T-Rex', 'Pterodactyl'].map((name) => (
            <span key={name} style={{
              fontSize: '12px', fontWeight: 700,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#b91c1c', padding: '4px 10px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              {STAMP_EMOJI[name]} {name} ×{countMap[name]}
            </span>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
          These two appear only once:
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['Brachiosaurus', 'Stegosaurus'].map((name) => (
            <span key={name} style={{
              fontSize: '12px', fontWeight: 700,
              background: 'rgba(34,197,94,0.07)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#15803d', padding: '4px 10px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              {STAMP_EMOJI[name]} {name} ×1
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'q3',
    text: "Which stamps are different — each one appearing exactly once?",
    choices: [
      'T-Rex and Triceratops',
      'Brachiosaurus and Stegosaurus',
      'Pterodactyl and Stegosaurus',
      'All stamps are unique',
    ],
    correct: 'Brachiosaurus and Stegosaurus',
    revealLabel: 'Show the unique ones',
    revealContent: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
        <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
          Out of {ALL_STAMPS.length} stamps in the box, only <strong>5 are truly distinct</strong>:
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {uniqueNames.map((name) => (
            <span key={name} style={{
              fontSize: '12px', fontWeight: 700,
              background: 'rgba(0,140,255,0.07)',
              border: '1px solid rgba(0,140,255,0.2)',
              color: '#0369a1', padding: '4px 10px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              {STAMP_EMOJI[name]} {name}
            </span>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontStyle: 'italic' }}>
          No matter how many copies exist, the distinct count stays at 5.
        </p>
      </div>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────
export const Observation: React.FC = () => {
  const [answers, setAnswers]   = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const allAnswered = questions.every((q) => answers[q.id]);

  const handleAnswer = (qid: string, choice: string) => {
    if (answers[qid]) return;
    setAnswers((prev) => ({ ...prev, [qid]: choice }));
  };

  const handleReveal = (qid: string) => {
    setRevealed((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={16} style={{ color: '#7c3aed' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.5px', textTransform: 'uppercase' }}>OBSERVATION</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Take a Closer Look</h2>
        <p style={{ fontSize: '14px', color: '#475569', margin: 0 }}>
          Before Doraemon steps in — you investigate. Inspect Nobita's stamp box and answer each question on your own.
        </p>
      </div>

      {/* Interactive stamp box — tap to highlight */}
      <GlassCard style={{ padding: '20px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
          📦 Nobita's box — {ALL_STAMPS.length} stamps total. Tap a stamp to inspect it.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {ALL_STAMPS.map((name, idx) => {
            const isHighlighted = highlighted === name;
            return (
              <div
                key={idx}
                onClick={() => setHighlighted(highlighted === name ? null : name)}
                style={{
                  padding: '7px 11px',
                  borderRadius: '9px',
                  background: isHighlighted ? 'rgba(124,58,237,0.1)' : 'white',
                  border: isHighlighted ? '1.5px solid #7c3aed' : '1px solid rgba(0,0,0,0.07)',
                  fontSize: '12px', fontWeight: 600, color: '#1e293b',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isHighlighted ? '0 0 0 3px rgba(124,58,237,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                  userSelect: 'none',
                }}
              >
                <span>{STAMP_EMOJI[name]}</span>
                <span>{name}</span>
              </div>
            );
          })}
        </div>
        {highlighted && (
          <div style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '8px',
            background: 'rgba(124,58,237,0.06)', border: '1px dashed rgba(124,58,237,0.3)',
            fontSize: '13px', color: '#5b21b6', fontWeight: 600,
          }}>
            {STAMP_EMOJI[highlighted]} <strong>{highlighted}</strong> appears{' '}
            <strong>{countMap[highlighted]} time{countMap[highlighted] > 1 ? 's' : ''}</strong> in the box.
          </div>
        )}
      </GlassCard>

      {/* Three observation questions */}
      {questions.map((q, qi) => {
        const chosen  = answers[q.id];
        const correct = chosen === q.correct;
        const isOpen  = revealed[q.id];

        return (
          <GlassCard key={q.id} style={{
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.82)',
            border: `1.5px solid ${chosen ? (correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)') : 'rgba(0,0,0,0.07)'}`,
            transition: 'border-color 0.2s ease',
          }}>
            {/* Question label + text */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: chosen ? (correct ? '#22c55e' : '#ef4444') : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 800, color: 'white',
                transition: 'background 0.2s ease',
              }}>
                {chosen ? (correct ? '✓' : '✗') : (qi + 1)}
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                {q.text}
              </p>
            </div>

            {/* Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginLeft: '34px' }}>
              {q.choices.map((c) => {
                const isChosen = chosen === c;
                const isCorrect = c === q.correct;
                const showColors = !!chosen;

                let bg = 'white';
                let border = '1px solid rgba(0,0,0,0.08)';
                let color = '#334155';

                if (showColors && isChosen && isCorrect)  { bg = 'rgba(34,197,94,0.07)';  border = '1.5px solid #22c55e'; color = '#15803d'; }
                if (showColors && isChosen && !isCorrect) { bg = 'rgba(239,68,68,0.06)';  border = '1.5px solid #ef4444'; color = '#b91c1c'; }

                return (
                  <button
                    key={c}
                    onClick={() => handleAnswer(q.id, c)}
                    disabled={!!chosen}
                    style={{
                      textAlign: 'left', padding: '10px 14px', borderRadius: '9px',
                      background: bg, border, color,
                      fontSize: '13px', fontWeight: isChosen ? 700 : 500,
                      cursor: chosen ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    <span style={{
                      width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                      background: isChosen
                        ? (isCorrect ? '#22c55e' : '#ef4444')
                        : 'rgba(0,0,0,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: 'white', fontWeight: 900,
                    }}>
                      {isChosen ? (isCorrect ? '✓' : '✗') : ''}
                    </span>
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Reveal toggle — only available after answering */}
            {chosen && (
              <div style={{ marginTop: '14px', marginLeft: '34px' }}>
                <button
                  onClick={() => handleReveal(q.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 700, color: '#7c3aed', padding: 0,
                  }}
                >
                  <ChevronDown
                    size={14}
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                  />
                  {isOpen ? 'Hide' : q.revealLabel}
                </button>
                {isOpen && (
                  <div style={{ marginTop: '10px' }}>
                    {q.revealContent}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        );
      })}

      {/* Nudge after all answered */}
      {allAnswered && (
        <GlassCard style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.05) 0%, rgba(255,255,255,0.7) 100%)',
          border: '1.5px solid rgba(124,58,237,0.2)',
        }} className="animate-fade-in">
          <p style={{ fontSize: '13px', color: '#5b21b6', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
            🔍 You've spotted the pattern. Now — can we imagine a smarter way to store these stamps so duplicates never creep in to begin with? Let's explore in the next step.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default Observation;
