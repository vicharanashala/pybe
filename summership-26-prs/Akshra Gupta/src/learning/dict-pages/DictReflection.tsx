import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Heart, CheckCircle2 } from 'lucide-react';

const NOBITA_CHOICES = [
  "It made the gadgets look prettier in his desk drawer",
  "It paired every gadget name directly to its action, making lookups instant without index position errors",
  "It automatically doubled the power of every gadget",
  "It hid the gadgets from Gian so Gian could never steal them"
];
const NOBITA_CORRECT = NOBITA_CHOICES[1];

const DORAEMON_SCENARIOS = [
  { scene: "📚 Nobita's Report Card", detail: "Mapping subjects ('Math', 'English') directly to grades (0, 25). Looking up 'Math' instantly returns 0 without scanning." },
  { scene: "📍 Anywhere Door Locations", detail: "Mapping location names ('Tokyo', 'Dinosaur Age') to GPS coordinates." },
  { scene: "👛 Doraemon's Pocket Inventory", detail: "Mapping gadget names to quantity remaining in stock ({'Dorayaki': 10, 'Bamboo Copter': 2})." },
  { scene: "🎵 Gian's Song Ratings", detail: "Mapping song titles to audience noise levels ({'Song 1': 'Ear shattering', 'Song 2': 'Window breaking'})." }
];

const CHECKLIST = [
  "I can identify a Python Dictionary by its {key: value} pair syntax.",
  "I understand that Keys in a Dictionary must be unique.",
  "I know that accessing dict[key] returns its paired Value in O(1) instant time.",
  "I understand why Dictionaries prevent index mismatch errors when updating collections."
];

export const DictReflection: React.FC = () => {
  const [nobitaPick, setNobitaPick] = useState<string | null>(null);
  const [advPicks, setAdvPicks] = useState<Set<number>>(new Set());
  const [checkItems, setCheckItems] = useState<Set<number>>(new Set());

  const nobitaDone = nobitaPick !== null;
  const nobitaCorrect = nobitaPick === NOBITA_CORRECT;
  const advDone = advPicks.size >= 2;
  const allChecked = checkItems.size === CHECKLIST.length;

  const toggleAdv = (i: number) => {
    setAdvPicks(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleCheck = (i: number) => {
    setCheckItems(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STAGE 9 — REFLECTION WRAP-UP
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Episode 2 Wrap-Up: Dictionaries
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Nobita activated the right gadget just in time to stop Gian! Take a moment to reflect on what made that possible.
        </p>
      </div>

      {/* Q1: Nobita's Question */}
      <GlassCard style={{ padding: '20px', background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '22px' }}>😅</span>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
            "What exactly was it about Key-Value pairs that saved me from Gian's challenge?"
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {NOBITA_CHOICES.map((choice) => {
            const isPicked = nobitaPick === choice;
            const isRight = choice === NOBITA_CORRECT;

            let bg = 'white';
            let border = '1px solid rgba(0,0,0,0.08)';
            let color = '#334155';

            if (nobitaDone && isPicked) {
              if (isRight) { bg = 'rgba(34, 197, 94, 0.08)'; border = '1.5px solid #22c55e'; color = '#15803d'; }
              else { bg = 'rgba(239, 68, 68, 0.06)'; border = '1.5px solid #ef4444'; color = '#b91c1c'; }
            }

            return (
              <button
                key={choice}
                onClick={() => !nobitaDone && setNobitaPick(choice)}
                style={{
                  textAlign: 'left', padding: '12px 16px', borderRadius: '10px',
                  background: bg, border, color,
                  fontSize: '13px', fontWeight: isPicked ? 700 : 500,
                  cursor: nobitaDone ? 'default' : 'pointer'
                }}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Q2: Doraemon's Future Adventures */}
      {nobitaDone && nobitaCorrect && (
        <GlassCard style={{ padding: '20px', background: 'white', border: '1px solid rgba(0,0,0,0.08)' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '22px' }}>🤖</span>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
              "Where else in our future adventures could Dictionaries be useful? Pick at least 2."
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DORAEMON_SCENARIOS.map((item, idx) => {
              const picked = advPicks.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleAdv(idx)}
                  style={{
                    textAlign: 'left', padding: '12px 16px', borderRadius: '10px',
                    background: picked ? 'rgba(0, 140, 255, 0.08)' : 'white',
                    border: picked ? '1.5px solid #008cff' : '1px solid rgba(0,0,0,0.08)',
                    color: picked ? '#008cff' : '#334155',
                    fontSize: '13px', fontWeight: picked ? 700 : 500,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: picked ? '#008cff' : '#cbd5e1' }} />
                  <div>
                    <div style={{ fontWeight: 800 }}>{item.scene}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>{item.detail}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Q3: Self-Check Checklist */}
      {advDone && (
        <GlassCard style={{ padding: '20px', background: 'white', border: '1px solid rgba(0,0,0,0.08)' }} className="animate-fade-in">
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
            SELF-ASSESSMENT CHECKLIST
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CHECKLIST.map((item, idx) => {
              const ticked = checkItems.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  style={{
                    textAlign: 'left', padding: '12px 16px', borderRadius: '10px',
                    background: ticked ? 'rgba(34, 197, 94, 0.08)' : 'white',
                    border: ticked ? '1.5px solid #22c55e' : '1px solid rgba(0,0,0,0.08)',
                    color: ticked ? '#15803d' : '#334155',
                    fontSize: '13px', fontWeight: ticked ? 700 : 500,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: ticked ? '#22c55e' : '#cbd5e1' }} />
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Episode Completion Badge */}
      {allChecked && (
        <GlassCard style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(0,140,255,0.08) 0%, rgba(255,255,255,0.95) 100%)', border: '1.5px solid #008cff' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🤖</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>"Mastered Dictionaries, Nobita!"</div>
              <div style={{ fontSize: '12.5px', color: '#0369a1', marginTop: '2px' }}>
                You now know how to build ultra-fast key-value database mappings. Time for the Q&A, Test, and Coding challenges!
              </div>
            </div>
          </div>
        </GlassCard>
      )}

    </div>
  );
};

export default DictReflection;
