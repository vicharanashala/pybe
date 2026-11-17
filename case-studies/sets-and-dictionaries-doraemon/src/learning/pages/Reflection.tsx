import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Heart, CheckCircle2, ChevronDown } from 'lucide-react';

// ── Question 1 — How did the rule help Nobita? ────────────────
const NOBITA_CHOICES = [
  "It let Nobita memorise every stamp faster",
  "It removed the need to check for repeats one by one — the pile stayed clean automatically",
  "It sorted his stamps from rarest to most common",
  "It helped Nobita win more trades by hiding duplicates from Suneo",
];
const NOBITA_CORRECT = NOBITA_CHOICES[1];

// ── Question 2 — Where else could this help Doraemon? ─────────
// Open-ended multi-select — no single right answer, all are valid
const DORAEMON_ADVENTURES = [
  { scene: "🏫 Nobita's test scores",   detail: "Tracking which subjects Nobita has already failed this term — no matter how many times he repeats the same subject." },
  { scene: "🎵 Gian's concert guest list",   detail: "Making sure no one is invited to Gian's singing recital twice — once on the list is enough suffering." },
  { scene: "🦕 Dinosaur expedition log",  detail: "Recording which species they found during time travel — duplicates from multiple visits don't clutter the record." },
  { scene: "🎮 Suneo's toy collection",   detail: "Keeping a record of all unique toys Suneo owns — 'I have ten of the same robot' still counts as one unique toy type." },
  { scene: "📍 Places visited by Anywhere Door", detail: "Logging every unique destination Doraemon and Nobita have travelled to — repeating the same trip doesn't create a second entry." },
];

// ── Checklist — what the learner now knows ────────────────────
const CHECKLIST = [
  "I can tell whether a collection is a Set by looking for repeated items.",
  "I understand that a Set refuses to store the same item more than once.",
  "I can predict how many items a Set will contain from a given list.",
  "I know that checking whether something is in a Set is instant.",
  "I understand why Doraemon's rule makes searches faster and storage cleaner.",
];

// ── Component ─────────────────────────────────────────────────
export const Reflection: React.FC = () => {
  const [nobitaPick, setNobitaPick]       = useState<string | null>(null);
  const [adventurePicks, setAdventurePicks] = useState<Set<number>>(new Set());
  const [checkItems, setCheckItems]       = useState<Set<number>>(new Set());
  const [adventureOpen, setAdventureOpen] = useState<Record<number, boolean>>({});

  const nobitaDone    = nobitaPick !== null;
  const nobitaCorrect = nobitaPick === NOBITA_CORRECT;
  const adventureDone = adventurePicks.size >= 2;
  const allChecked    = checkItems.size === CHECKLIST.length;

  const toggleAdventure = (i: number) => {
    setAdventurePicks(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  const toggleCheck = (i: number) => {
    setCheckItems(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.5px', textTransform: 'uppercase' }}>REFLECTION</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Episode Wrap-Up</h2>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
          Nobita beat Suneo's challenge. Doraemon put his gadget away with a smile.
          Before the credits roll — take a moment to look back.
        </p>
      </div>

      {/* ── Q1: How did the rule help Nobita? ── */}
      <GlassCard style={{ padding: '22px 24px', background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#93c5fd,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>😅</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Nobita asks you</div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
              "What exactly was it about the rule that helped me beat Suneo's challenge?"
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {NOBITA_CHOICES.map((c) => {
            const isPicked  = nobitaPick === c;
            const isCorrect = c === NOBITA_CORRECT;
            const showColor = nobitaDone;

            let bg = 'white'; let border = '1px solid rgba(0,0,0,0.08)'; let color = '#334155';
            if (showColor && isPicked && isCorrect)  { bg = 'rgba(34,197,94,0.07)';  border = '1.5px solid #22c55e'; color = '#15803d'; }
            if (showColor && isPicked && !isCorrect) { bg = 'rgba(239,68,68,0.05)';  border = '1.5px solid #ef4444'; color = '#b91c1c'; }

            return (
              <button
                key={c}
                onClick={() => !nobitaDone && setNobitaPick(c)}
                disabled={nobitaDone}
                style={{
                  textAlign: 'left', padding: '11px 16px', borderRadius: '10px',
                  background: bg, border, color,
                  fontSize: '13px', fontWeight: isPicked ? 700 : 500,
                  cursor: nobitaDone ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                  background: isPicked ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(0,0,0,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: 'white', fontWeight: 900,
                }}>{isPicked ? (isCorrect ? '✓' : '✗') : ''}</span>
                {c}
              </button>
            );
          })}
        </div>

        {/* Doraemon's confirmation */}
        {nobitaDone && nobitaCorrect && (
          <div style={{
            marginTop: '14px', padding: '14px 16px', borderRadius: '12px',
            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }} className="animate-fade-in">
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#00bfff,#0060ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
            }}>🤖</div>
            <p style={{ fontSize: '13px', color: '#15803d', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
              "That's it, Nobita. The rule meant you never had to scan the pile twice for the same stamp.
              The collection itself was already clean — and checking a clean, unique collection is instant."
            </p>
          </div>
        )}
        {nobitaDone && !nobitaCorrect && (
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
            Think about what happened when duplicates were removed — what changed about the search?
          </p>
        )}
      </GlassCard>

      {/* ── Q2: Where else could this help Doraemon? ── */}
      {nobitaDone && nobitaCorrect && (
        <GlassCard style={{ padding: '22px 24px', background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(0,0,0,0.07)' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#00bfff,#0060ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🤖</div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>Doraemon wonders</div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                "Where else in our adventures could this same idea be useful?
                Pick at least two that make sense to you."
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DORAEMON_ADVENTURES.map((adv, i) => {
              const picked = adventurePicks.has(i);
              const open   = adventureOpen[i];
              return (
                <div key={i} style={{
                  borderRadius: '12px', overflow: 'hidden',
                  border: picked ? '1.5px solid rgba(0,140,255,0.35)' : '1px solid rgba(0,0,0,0.07)',
                  transition: 'border 0.15s ease',
                }}>
                  <button
                    onClick={() => toggleAdventure(i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      background: picked ? 'rgba(0,140,255,0.06)' : 'white',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                      background: picked ? '#008cff' : 'rgba(0,0,0,0.06)',
                      border: picked ? 'none' : '1px solid rgba(0,0,0,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}>
                      {picked && <CheckCircle2 size={13} style={{ color: 'white' }} />}
                    </div>
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: picked ? 700 : 500, color: '#0f172a' }}>
                      {adv.scene}
                    </span>
                    <ChevronDown
                      size={14}
                      style={{ color: '#94a3b8', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                      onClick={(e) => { e.stopPropagation(); setAdventureOpen(prev => ({ ...prev, [i]: !prev[i] })); }}
                    />
                  </button>
                  {open && (
                    <div style={{
                      padding: '10px 16px 14px 46px',
                      fontSize: '12px', color: '#475569', lineHeight: 1.6,
                      borderTop: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,140,255,0.02)',
                    }} className="animate-fade-in">
                      {adv.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {adventureDone && (
            <div style={{ marginTop: '14px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(0,140,255,0.06)', border: '1px solid rgba(0,140,255,0.2)', fontSize: '13px', color: '#0369a1', fontWeight: 600 }} className="animate-fade-in">
              🤖 The idea travels well. Any time you need a collection that stays clean and searches fast — the same rule applies.
            </div>
          )}
        </GlassCard>
      )}

      {/* ── Checklist — self-assessment ── */}
      {adventureDone && (
        <GlassCard style={{ padding: '22px 24px', background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(0,0,0,0.07)' }} className="animate-fade-in">
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '14px' }}>
            Before you go — tick what feels true for you
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CHECKLIST.map((pt, i) => {
              const ticked = checkItems.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  style={{
                    textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                    background: ticked ? 'rgba(34,197,94,0.06)' : 'white',
                    border: ticked ? '1.5px solid rgba(34,197,94,0.3)' : '1px solid rgba(0,0,0,0.07)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
                    background: ticked ? '#22c55e' : 'rgba(0,0,0,0.06)',
                    border: ticked ? 'none' : '1.5px solid rgba(0,0,0,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}>
                    {ticked && <CheckCircle2 size={14} style={{ color: 'white' }} />}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: ticked ? 600 : 400, color: ticked ? '#15803d' : '#475569', lineHeight: 1.5 }}>
                    {pt}
                  </span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* ── Closing card — only after all checked ── */}
      {allChecked && (
        <GlassCard style={{
          padding: '22px 24px',
          background: 'linear-gradient(135deg, rgba(0,140,255,0.06) 0%, rgba(255,255,255,0.85) 100%)',
          border: '2px solid rgba(0,140,255,0.2)',
        }} className="animate-fade-in">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#00bfff,#0060ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              boxShadow: '0 4px 14px rgba(0,140,255,0.25)',
            }}>🤖</div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1', marginBottom: '6px' }}>Doraemon</div>
              <p style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600, margin: '0 0 8px', lineHeight: 1.6 }}>
                "You didn't just learn a rule, Nobita. You discovered it yourself. That's the only kind of knowledge that sticks."
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                Episode complete. The 4D Pocket closes. Suneo is still jealous.
              </p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Reflection;
