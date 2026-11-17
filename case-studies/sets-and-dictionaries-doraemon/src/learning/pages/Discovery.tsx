import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Lightbulb, ChevronRight } from 'lucide-react';

// ── The three Socratic questions the learner must answer ──────
// Each question builds on the previous. Nothing is revealed until
// the learner commits to an answer.

interface SocraticQ {
  id: string;
  context: React.ReactNode;   // scene-setting text above the choices
  question: string;
  choices: string[];
  correct: string;
  doraemonReply: string;      // Doraemon's reaction after the right pick
}

const QUESTIONS: SocraticQ[] = [
  {
    id: 'q1',
    context: (
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
        You just sorted stamps, checked-as-you-added, and built a unique pile.
        Doraemon watched silently the whole time. Now he asks:
      </p>
    ),
    question: "\"Every time you solved it, you were following the same silent rule. What was it?\"",
    choices: [
      "I put stamps in alphabetical order",
      "I only kept a stamp if I hadn't seen it before",
      "I kept the rarest stamps and threw away the common ones",
      "I grouped stamps by size and colour",
    ],
    correct: "I only kept a stamp if I hadn't seen it before",
    doraemonReply: "Exactly! You were tracking what you had already seen — and the moment you saw something again, you skipped it.",
  },
  {
    id: 'q2',
    context: (
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
        Doraemon lays out Nobita's final pile of unique stamps — just 5 of them, from 12 originals.
        He points at it and asks:
      </p>
    ),
    question: "\"What is special about this pile compared to Nobita's original box?\"",
    choices: [
      "It has fewer stamps so it takes less space",
      "Each stamp in this pile appears exactly once — no stamp repeats",
      "The stamps are sorted so they are easier to read",
      "Only the rarest stamps survived",
    ],
    correct: "Each stamp in this pile appears exactly once — no stamp repeats",
    doraemonReply: "Right. The pile is not just smaller — it has a strict rule baked in: every item inside is completely unique.",
  },
  {
    id: 'q3',
    context: (
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
        Doraemon smiles. He holds up the unique pile and asks one more question:
      </p>
    ),
    question: "\"If this pile had a rule book, what would the first rule say?\"",
    choices: [
      "Rule 1: Keep items sorted from A to Z at all times",
      "Rule 1: No item may appear in this collection more than once",
      "Rule 1: Only accept items that are older than the others",
      "Rule 1: Items must be stored in the order they arrived",
    ],
    correct: "Rule 1: No item may appear in this collection more than once",
    doraemonReply: "That is the rule. A collection that enforces uniqueness — it simply refuses to hold the same item twice.",
  },
];

// ── Visual: the final unique pile (Nobita's result) ───────────
const UNIQUE_STAMPS = [
  { name: 'Triceratops',   emoji: '🦕', color: '#f59e0b' },
  { name: 'T-Rex',         emoji: '🦖', color: '#ef4444' },
  { name: 'Brachiosaurus', emoji: '🦕', color: '#10b981' },
  { name: 'Pterodactyl',   emoji: '🦅', color: '#8b5cf6' },
  { name: 'Stegosaurus',   emoji: '🦕', color: '#3b82f6' },
];

// ── Component ─────────────────────────────────────────────────
export const Discovery: React.FC = () => {
  const [answers, setAnswers]     = useState<Record<string, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});

  // The current question index the learner should be on
  const unlockedUpTo = QUESTIONS.findIndex(q => !answers[q.id]);
  const activeIdx    = unlockedUpTo === -1 ? QUESTIONS.length : unlockedUpTo;
  const allDone      = activeIdx === QUESTIONS.length;

  const handleAnswer = (qid: string, choice: string) => {
    if (answers[qid]) return;
    setAnswers(prev => ({ ...prev, [qid]: choice }));
  };

  const toggleReply = (qid: string) => {
    setReplyOpen(prev => ({ ...prev, [qid]: !prev[qid] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={16} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>DISCOVERY</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>What Rule Did You Follow?</h2>
        <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
          Doraemon watched you work. He noticed a pattern — and now he wants <em>you</em> to put it into words.
        </p>
      </div>

      {/* Nobita's unique pile visual */}
      <GlassCard style={{ padding: '18px 22px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '12px' }}>
          📋 Nobita's final unique pile — 5 stamps from 12 originals:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {UNIQUE_STAMPS.map((s) => (
            <div key={s.name} style={{
              padding: '8px 14px', borderRadius: '10px',
              background: `${s.color}10`,
              border: `1.5px solid ${s.color}44`,
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 700, color: s.color,
            }}>
              <span style={{ fontSize: '18px' }}>{s.emoji}</span>
              {s.name}
              <span style={{
                fontSize: '10px', fontWeight: 800,
                background: `${s.color}20`, padding: '1px 6px',
                borderRadius: '4px', color: s.color,
              }}>×1</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
          No stamp appears twice. The 7 duplicates are gone.
        </div>
      </GlassCard>

      {/* Socratic questions — sequential unlock */}
      {QUESTIONS.map((q, qi) => {
        const isLocked    = qi > activeIdx;
        const chosen      = answers[q.id];
        const isCorrect   = chosen === q.correct;
        const replyShown  = replyOpen[q.id];

        if (isLocked) return null;

        return (
          <GlassCard key={q.id} style={{
            padding: '22px 24px',
            background: chosen
              ? (isCorrect ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.82)')
              : 'rgba(255,255,255,0.82)',
            border: chosen
              ? (isCorrect ? '1.5px solid rgba(245,158,11,0.35)' : '1.5px solid rgba(239,68,68,0.2)')
              : '1.5px solid rgba(0,0,0,0.07)',
            transition: 'border-color 0.2s ease',
          }}>
            {/* Step label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: chosen
                  ? (isCorrect ? '#f59e0b' : '#ef4444')
                  : '#e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 800, color: 'white',
                transition: 'background 0.2s ease',
              }}>
                {chosen ? (isCorrect ? '✓' : '✗') : (qi + 1)}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Doraemon asks
              </span>
            </div>

            {/* Context */}
            <div style={{ marginBottom: '12px' }}>{q.context}</div>

            {/* Question */}
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px', lineHeight: 1.5, fontStyle: 'italic' }}>
              {q.question}
            </p>

            {/* Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {q.choices.map((c) => {
                const isSel     = chosen === c;
                const showColor = !!chosen;
                const correct   = c === q.correct;

                let bg     = 'white';
                let border = '1px solid rgba(0,0,0,0.08)';
                let color  = '#334155';
                if (showColor && isSel && correct)   { bg = 'rgba(245,158,11,0.08)';  border = '1.5px solid #f59e0b'; color = '#92400e'; }
                if (showColor && isSel && !correct)  { bg = 'rgba(239,68,68,0.06)';   border = '1.5px solid #ef4444'; color = '#b91c1c'; }

                return (
                  <button
                    key={c}
                    onClick={() => handleAnswer(q.id, c)}
                    disabled={!!chosen}
                    style={{
                      textAlign: 'left', padding: '11px 16px', borderRadius: '10px',
                      background: bg, border, color,
                      fontSize: '13px', fontWeight: isSel ? 700 : 500,
                      cursor: chosen ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <span style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      background: isSel ? (correct ? '#f59e0b' : '#ef4444') : 'rgba(0,0,0,0.07)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', color: 'white', fontWeight: 900,
                    }}>
                      {isSel ? (correct ? '✓' : '✗') : ''}
                    </span>
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Wrong answer — gentle nudge, no spoiler */}
            {chosen && !isCorrect && (
              <p style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                Think back to what you actually did when sorting stamps — what made you keep one and skip another?
              </p>
            )}

            {/* Doraemon's reply — toggled after correct answer */}
            {chosen && isCorrect && (
              <div style={{ marginTop: '14px' }}>
                <button
                  onClick={() => toggleReply(q.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 700, color: '#b45309', padding: 0,
                  }}
                >
                  <ChevronRight
                    size={14}
                    style={{ transform: replyShown ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}
                  />
                  {replyShown ? "Hide Doraemon's reply" : "See what Doraemon says"}
                </button>

                {replyShown && (
                  <div style={{
                    marginTop: '10px', padding: '14px 16px', borderRadius: '12px',
                    background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)',
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                  }} className="animate-fade-in">
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #00bfff, #0060ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', boxShadow: '0 2px 10px rgba(0,140,255,0.25)',
                    }}>🤖</div>
                    <p style={{ fontSize: '13px', color: '#78350f', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                      {q.doraemonReply}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Wrong — try again nudge */}
            {chosen && !isCorrect && (
              <button
                onClick={() => setAnswers(prev => { const n = {...prev}; delete n[q.id]; return n; })}
                style={{
                  marginTop: '12px', padding: '8px 16px', borderRadius: '8px',
                  background: 'none', border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '12px', fontWeight: 700, color: '#64748b',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                ↩ Try again
              </button>
            )}
          </GlassCard>
        );
      })}

      {/* Final reveal — the rule, in the learner's own words */}
      {allDone && (
        <GlassCard style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(255,255,255,0.8) 100%)',
          border: '2px solid rgba(245,158,11,0.4)',
        }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '22px' }}>💡</span>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#78350f' }}>
              You discovered the rule yourself.
            </span>
          </div>

          <div style={{
            padding: '16px 20px', borderRadius: '12px',
            background: 'white', border: '1.5px solid rgba(245,158,11,0.3)',
            marginBottom: '14px',
          }}>
            <p style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
              "A collection where no item may appear more than once."
            </p>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
            Every approach you tried in Exploration was enforcing this exact rule manually —
            with your own eyes and hands. You were the rule. <br /><br />
            In the next step, you will meet a container that enforces this rule <em>automatically</em>,
            the moment an item is added — so you never have to check yourself.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default Discovery;
