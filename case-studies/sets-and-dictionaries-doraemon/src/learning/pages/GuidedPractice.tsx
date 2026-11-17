import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Target, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// ACTIVITY 1 — Spot the Set
// Given a list of Doraemon items, choose which version is a Set
// ─────────────────────────────────────────────────────────────
const Act1: React.FC = () => {
  const scenarios = [
    {
      label: "Doraemon's gadget shelf",
      options: [
        { items: ['Anywhere Door', 'Bamboo Copter', 'Anywhere Door', 'Small Light', 'Bamboo Copter'], isSet: false },
        { items: ['Anywhere Door', 'Bamboo Copter', 'Small Light', 'Take-copter'], isSet: true },
      ],
    },
    {
      label: "Suneo's brag list today",
      options: [
        { items: ['New bicycle', 'Game console', 'Movie ticket', 'New bicycle', 'Game console'], isSet: false },
        { items: ['New bicycle', 'Game console', 'Movie ticket'], isSet: true },
      ],
    },
    {
      label: "Gian's song titles this week",
      options: [
        { items: ['Poem of Love', 'Poem of Love', 'My Heart Song', 'Poem of Love'], isSet: false },
        { items: ['Poem of Love', 'My Heart Song'], isSet: true },
      ],
    },
  ];

  const [picks, setPicks] = useState<Record<number, number>>({});

  const choose = (si: number, oi: number) => {
    if (picks[si] !== undefined) return;
    setPicks(p => ({ ...p, [si]: oi }));
  };

  const allDone = Object.keys(picks).length === scenarios.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
        Each situation below shows two versions of a collection. Tap the one that <strong>behaves like a Set</strong> — where every item appears exactly once.
      </p>
      {scenarios.map((sc, si) => {
        const chosen = picks[si];
        return (
          <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{sc.label}</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {sc.options.map((opt, oi) => {
                const isPicked  = chosen === oi;
                const isCorrect = opt.isSet;
                const showColor = chosen !== undefined;

                let border = '1.5px solid rgba(0,0,0,0.08)';
                let bg     = 'white';
                if (showColor && isPicked && isCorrect)  { border = '2px solid #22c55e'; bg = 'rgba(34,197,94,0.06)'; }
                if (showColor && isPicked && !isCorrect) { border = '2px solid #ef4444'; bg = 'rgba(239,68,68,0.05)'; }
                if (showColor && !isPicked && isCorrect) { border = '1.5px dashed rgba(34,197,94,0.4)'; }

                return (
                  <button
                    key={oi}
                    onClick={() => choose(si, oi)}
                    disabled={chosen !== undefined}
                    style={{
                      flex: '1 1 0', minWidth: '130px',
                      padding: '12px 14px', borderRadius: '12px',
                      background: bg, border, cursor: chosen !== undefined ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {opt.items.map((item, ii) => {
                        const isDup = opt.items.indexOf(item) !== ii;
                        return (
                          <span key={ii} style={{
                            fontSize: '11px', fontWeight: 600,
                            padding: '3px 7px', borderRadius: '5px',
                            background: isDup ? 'rgba(239,68,68,0.06)' : 'rgba(0,0,0,0.04)',
                            border: `1px solid ${isDup ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.06)'}`,
                            color: isDup ? '#b91c1c' : '#334155',
                          }}>
                            {item}
                          </span>
                        );
                      })}
                    </div>
                    {showColor && isPicked && (
                      <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 700, color: isCorrect ? '#15803d' : '#b91c1c' }}>
                        {isCorrect ? '✅ Correct — no duplicates!' : '❌ This one has repeats.'}
                      </div>
                    )}
                    {showColor && !isPicked && isCorrect && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#64748b' }}>
                        ← This was the Set
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {allDone && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '13px', color: '#15803d', fontWeight: 600 }} className="animate-fade-in">
          ✅ A Set always picks the version with no repeats — regardless of how many items were in the original pile.
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ACTIVITY 2 — Predict the Size
// Show a collection, ask: how many items will remain in the Set?
// ─────────────────────────────────────────────────────────────
const Act2: React.FC = () => {
  const puzzles = [
    {
      character: 'Nobita',
      avatar: '😅',
      scene: 'empties his school bag',
      items: ['Textbook', 'Eraser', 'Textbook', 'Pencil', 'Eraser', 'Eraser'],
      answer: 3,
      choices: [2, 3, 4, 6],
      reveal: '"Textbook", "Eraser", "Pencil" — 3 unique items. The three extra eraser and textbook copies vanish.',
    },
    {
      character: 'Doraemon',
      avatar: '🤖',
      scene: "lists today's gadgets used",
      items: ['Anywhere Door', 'Small Light', 'Anywhere Door', 'Take-copter', 'Anywhere Door', 'Small Light'],
      answer: 3,
      choices: [2, 3, 4, 6],
      reveal: '"Anywhere Door", "Small Light", "Take-copter" — 3 unique gadgets despite 6 entries.',
    },
    {
      character: 'Gian',
      avatar: '😤',
      scene: 'lists everyone he challenged to listen to his singing',
      items: ['Nobita', 'Shizuka', 'Suneo', 'Nobita', 'Shizuka'],
      answer: 3,
      choices: [2, 3, 4, 5],
      reveal: 'Only Nobita, Shizuka, and Suneo — 3 unique victims, no matter how many times Gian "invited" them.',
    },
  ];

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
        If each collection below was put into a Set, <strong>how many items would remain?</strong> Make your prediction before checking.
      </p>
      {puzzles.map((p, pi) => {
        const chosen  = answers[pi];
        const shown   = revealed[pi];

        return (
          <GlassCard key={pi} style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.07)' }}>
            {/* Scene header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>{p.avatar}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{p.character}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{p.scene}:</div>
              </div>
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {p.items.map((item, ii) => {
                const isDup = p.items.indexOf(item) !== ii;
                return (
                  <span key={ii} style={{
                    fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '7px',
                    background: isDup ? 'rgba(239,68,68,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${isDup ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.06)'}`,
                    color: isDup ? '#94a3b8' : '#334155',
                  }}>
                    {item}
                    {isDup && <span style={{ marginLeft: '4px', fontSize: '10px' }}>×2+</span>}
                  </span>
                );
              })}
            </div>

            {/* Choices */}
            <div style={{ marginBottom: '4px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
              How many unique items will the Set contain?
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: chosen ? '10px' : '0' }}>
              {p.choices.map((c) => {
                const isPicked = chosen === c;
                const showColor = chosen !== undefined;
                const isRight = c === p.answer;

                let bg = 'white'; let border = '1px solid rgba(0,0,0,0.1)'; let color = '#334155';
                if (showColor && isPicked && isRight)   { bg = 'rgba(34,197,94,0.09)';  border = '2px solid #22c55e'; color = '#15803d'; }
                if (showColor && isPicked && !isRight)  { bg = 'rgba(239,68,68,0.06)';  border = '2px solid #ef4444'; color = '#b91c1c'; }
                if (showColor && !isPicked && isRight)  { border = '1.5px dashed rgba(34,197,94,0.4)'; color = '#15803d'; }

                return (
                  <button
                    key={c}
                    onClick={() => { if (chosen === undefined) setAnswers(a => ({ ...a, [pi]: c })); }}
                    disabled={chosen !== undefined}
                    style={{
                      width: '52px', height: '52px', borderRadius: '12px',
                      background: bg, border, color,
                      fontSize: '18px', fontWeight: 900, cursor: chosen !== undefined ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >{c}</button>
                );
              })}
            </div>

            {/* Reveal */}
            {chosen !== undefined && (
              <>
                <button
                  onClick={() => setRevealed(r => ({ ...r, [pi]: !r[pi] }))}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#7c3aed', padding: 0, marginTop: '6px' }}
                >
                  <ChevronRight size={13} style={{ transform: shown ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  {shown ? 'Hide' : 'See why'}
                </button>
                {shown && (
                  <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(124,58,237,0.05)', border: '1px dashed rgba(124,58,237,0.25)', fontSize: '12px', color: '#5b21b6', fontWeight: 600 }} className="animate-fade-in">
                    {p.reveal}
                  </div>
                )}
              </>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ACTIVITY 3 — Is it in the Set? (Membership predictions)
// ─────────────────────────────────────────────────────────────
const Act3: React.FC = () => {
  // A fixed Set — Doraemon's 4D Pocket contents today
  const theSet = ['Anywhere Door', 'Take-copter', 'Small Light', 'Memory Bread', 'Gulliver Tunnel'];

  const questions = [
    { item: 'Take-copter',    expected: true },
    { item: 'Anywhere Door',  expected: true },
    { item: 'Mochi Camera',   expected: false },
    { item: 'Memory Bread',   expected: true },
    { item: 'Dokodemo Door',  expected: false },
    { item: 'Small Light',    expected: true },
  ];

  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const score    = Object.entries(answers).filter(([i, v]) => v === questions[+i].expected).length;
  const allDone  = Object.keys(answers).length === questions.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
        Doraemon's 4D Pocket currently holds these gadgets:
      </p>

      {/* The Set display */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(0,140,255,0.05)', border: '1.5px solid rgba(0,140,255,0.15)' }}>
        {theSet.map(g => (
          <span key={g} style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '7px', background: 'rgba(0,140,255,0.08)', border: '1px solid rgba(0,140,255,0.2)', color: '#0369a1' }}>
            🤖 {g}
          </span>
        ))}
      </div>

      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
        For each gadget below — predict: <strong>inside</strong> or <strong>not inside</strong> the pocket?
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {questions.map((q, qi) => {
          const picked = answers[qi];
          const done   = picked !== undefined;
          const correct = picked === q.expected;

          return (
            <div key={qi} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px',
              background: done ? (correct ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.04)') : 'white',
              border: done ? (correct ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.2)') : '1px solid rgba(0,0,0,0.07)',
              transition: 'all 0.2s ease',
            }}>
              <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                {q.item}
              </span>
              {!done ? (
                <>
                  <button
                    onClick={() => setAnswers(a => ({ ...a, [qi]: true }))}
                    style={{ padding: '5px 14px', borderRadius: '7px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#15803d', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                    ✅ Inside
                  </button>
                  <button
                    onClick={() => setAnswers(a => ({ ...a, [qi]: false }))}
                    style={{ padding: '5px 14px', borderRadius: '7px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#b91c1c', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                    ❌ Not inside
                  </button>
                </>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 700, color: correct ? '#15803d' : '#b91c1c' }}>
                  {correct ? `✅ Correct — ${q.expected ? 'it is inside' : 'not inside'}` : `❌ ${q.expected ? 'It is inside!' : "It's not there."}`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(0,140,255,0.06)', border: '1px solid rgba(0,140,255,0.2)', fontSize: '13px', color: '#0369a1', fontWeight: 600 }} className="animate-fade-in">
          {score}/{questions.length} correct — membership checks either confirm or deny. The Set doesn't search one-by-one; it knows instantly.
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ACTIVITY 4 — Add or Block?
// Learner predicts whether adding an item to an existing Set
// will change the Set's size
// ─────────────────────────────────────────────────────────────
const Act4: React.FC = () => {
  const currentSet = ['Shizuka', 'Nobita', 'Suneo', 'Gian', 'Doraemon'];

  const additions = [
    { item: 'Dekisugi',  willChange: true,  reason: "Dekisugi is not in the Set yet — he joins and the size goes from 5 to 6." },
    { item: 'Nobita',    willChange: false, reason: "Nobita is already in the Set — the Set blocks the duplicate and stays at 5." },
    { item: 'Gian',      willChange: false, reason: "Gian is already there — no change. The Set refuses the duplicate silently." },
    { item: 'Jaiko',     willChange: true,  reason: "Jaiko is new — she gets added and the Set grows to 6 (or 7 after Dekisugi)." },
    { item: 'Shizuka',   willChange: false, reason: "Shizuka is already in — the Set stays unchanged." },
  ];

  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
        This Set contains the main cast of the show:
      </p>

      {/* Current Set */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(245,158,11,0.05)', border: '1.5px solid rgba(245,158,11,0.2)' }}>
        {currentSet.map(c => (
          <span key={c} style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '7px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#92400e' }}>
            👤 {c}
          </span>
        ))}
        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', alignSelf: 'center' }}>size = {currentSet.length}</span>
      </div>

      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
        If we try to add each person below — will the Set's size change?
      </div>

      {additions.map((add, ai) => {
        const chosen = answers[ai];
        const done   = chosen !== undefined;
        const correct = chosen === add.willChange;
        const shown  = revealed[ai];

        return (
          <div key={ai} style={{
            padding: '14px 16px', borderRadius: '12px',
            background: done ? (correct ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.04)') : 'white',
            border: done ? (correct ? '1.5px solid rgba(34,197,94,0.25)' : '1.5px solid rgba(239,68,68,0.2)') : '1px solid rgba(0,0,0,0.07)',
            transition: 'all 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: done ? '10px' : '0', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', flex: 1 }}>
                Add <strong style={{ color: currentSet.includes(add.item) ? '#b91c1c' : '#0369a1' }}>"{add.item}"</strong>
              </span>
              {!done ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setAnswers(a => ({ ...a, [ai]: true }))}
                    style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#15803d', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                    📈 Size changes
                  </button>
                  <button
                    onClick={() => setAnswers(a => ({ ...a, [ai]: false }))}
                    style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#b91c1c', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                    🚫 Blocked
                  </button>
                </div>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 700, color: correct ? '#15803d' : '#b91c1c' }}>
                  {correct ? '✅ Right!' : `❌ Actually: ${add.willChange ? 'size changes' : 'blocked'}`}
                </span>
              )}
            </div>
            {done && (
              <button
                onClick={() => setRevealed(r => ({ ...r, [ai]: !r[ai] }))}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#7c3aed', padding: 0 }}
              >
                <ChevronRight size={12} style={{ transform: shown ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                {shown ? 'Hide' : 'Explain'}
              </button>
            )}
            {shown && done && (
              <div style={{ marginTop: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(124,58,237,0.05)', border: '1px dashed rgba(124,58,237,0.2)', fontSize: '12px', color: '#5b21b6', fontWeight: 600 }} className="animate-fade-in">
                {add.reason}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Root component
// ─────────────────────────────────────────────────────────────
const ACTIVITIES = [
  { id: 'act1', icon: '🔍', label: 'Spot the Set',        desc: 'Which version has no repeats?',      component: Act1 },
  { id: 'act2', icon: '🔢', label: 'Predict the Size',   desc: 'How many unique items remain?',      component: Act2 },
  { id: 'act3', icon: '📡', label: 'Is It Inside?',       desc: 'Membership predictions',             component: Act3 },
  { id: 'act4', icon: '➕', label: 'Add or Block?',       desc: 'Will the Set size change?',          component: Act4 },
];

export const GuidedPractice: React.FC = () => {
  const [active, setActive]    = useState<string>('act1');
  const [visited, setVisited]  = useState<Set<string>>(new Set(['act1']));

  const select = (id: string) => {
    setActive(id);
    setVisited(v => new Set([...v, id]));
  };

  const ActiveComp = ACTIVITIES.find(a => a.id === active)!.component;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>GUIDED PRACTICE</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Put It to the Test</h2>
        <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
          Four activities. Each one tests a different part of your understanding — no coding required.
        </p>
      </div>

      {/* Activity tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {ACTIVITIES.map(a => {
          const isActive  = active === a.id;
          const hasVisited = visited.has(a.id);
          return (
            <button
              key={a.id}
              onClick={() => select(a.id)}
              style={{
                flex: '1 1 0', minWidth: '110px',
                padding: '11px 12px', borderRadius: '12px', cursor: 'pointer',
                background: isActive ? 'rgba(0,140,255,0.08)' : 'white',
                border: isActive ? '2px solid #008cff' : '1.5px solid rgba(0,0,0,0.07)',
                boxShadow: isActive ? '0 0 0 3px rgba(0,140,255,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '18px', marginBottom: '3px' }}>{a.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: isActive ? '#0369a1' : '#0f172a', marginBottom: '1px' }}>
                {a.label}
                {hasVisited && !isActive && (
                  <span style={{ marginLeft: '5px', fontSize: '10px', color: '#22c55e' }}>✓</span>
                )}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.3 }}>{a.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <GlassCard style={{ padding: '22px 24px', background: 'rgba(255,255,255,0.88)', border: '1.5px solid rgba(0,140,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <span style={{ fontSize: '20px' }}>{ACTIVITIES.find(a => a.id === active)!.icon}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>
              {ACTIVITIES.find(a => a.id === active)!.label}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {ACTIVITIES.find(a => a.id === active)!.desc}
            </div>
          </div>
        </div>
        <ActiveComp key={active} />
      </GlassCard>

      {/* Progress nudge when all 4 visited */}
      {visited.size === 4 && (
        <GlassCard style={{ padding: '16px 20px', background: 'linear-gradient(135deg,rgba(0,140,255,0.06) 0%,rgba(255,255,255,0.75) 100%)', border: '1.5px solid rgba(0,140,255,0.2)' }} className="animate-fade-in">
          <p style={{ fontSize: '13px', color: '#0369a1', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
            🎯 All four activities explored. You can now spot a Set by sight, predict its size, check membership, and know when an addition gets blocked — without writing a single line of code.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default GuidedPractice;
