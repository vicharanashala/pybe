import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Target, CheckCircle2 } from 'lucide-react';

// ── Activity 1: Spot the Dictionary ──────────────────────────
const SPOT_PUZZLES = [
  {
    title: "Doraemon's Gadget Storage",
    optA: { label: "['Door', 'Dial destination', 'Copter', 'Attach to head']", isDict: false, why: "This is a flat List. Gadget names and actions are mixed by index positions!" },
    optB: { label: "{'Door': 'Dial destination', 'Copter': 'Attach to head'}", isDict: true, why: "Correct! Curly braces with key:value pairs link each gadget directly to its action!" }
  },
  {
    title: "Nobita's Subject Test Scores",
    optA: { label: "{'Math': 0, 'English': 25, 'Science': 10}", isDict: true, why: "Correct! Subject names (Keys) map directly to test marks (Values)!" },
    optB: { label: "{'Math', 'English', 'Science'}", isDict: false, why: "This is a Set! It has no values mapped to the subjects." }
  }
];

// ── Activity 2: Predict the Lookup Value ──────────────────────
const LOOKUP_PUZZLES = [
  {
    code: `pocket = {"Door": "Dial destination", "Light": "Press yellow button"}\nprint(pocket["Light"])`,
    options: ['"Dial destination"', '"Press yellow button"', 'TypeError', '"Light"'],
    answer: 1,
    why: 'pocket["Light"] accesses the Value paired with the Key "Light", returning "Press yellow button".'
  },
  {
    code: `scores = {"Math": 0, "Math": 100}\nprint(scores["Math"])`,
    options: ['0', '100', 'TypeError: duplicate key', '[0, 100]'],
    answer: 1,
    why: 'Keys MUST be unique! When "Math": 100 is declared second, it updates the existing Key "Math" from 0 to 100.'
  }
];

export const DictGuidedPractice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [spotAns, setSpotAns] = useState<Record<number, boolean>>({});
  const [lookupAns, setLookupAns] = useState<Record<number, number>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));

  const switchTab = (i: number) => {
    setActiveTab(i);
    setVisited(prev => new Set(prev).add(i));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STAGE 8 — GUIDED PRACTICE ACTIVITIES
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Put Your Dictionary Knowledge to the Test!
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Conceptual activities using Doraemon's world — no coding required!
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['🔍 Act 1: Spot the Dict', '🔢 Act 2: Predict Lookup'].map((tabLabel, idx) => (
          <button
            key={idx}
            onClick={() => switchTab(idx)}
            style={{
              padding: '8px 16px', borderRadius: '10px',
              border: activeTab === idx ? '1.5px solid #008cff' : '1px solid rgba(0,0,0,0.1)',
              background: activeTab === idx ? 'rgba(0, 140, 255, 0.1)' : 'white',
              color: activeTab === idx ? '#008cff' : '#64748b',
              fontSize: '12px', fontWeight: activeTab === idx ? 800 : 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <span>{tabLabel}</span>
            {visited.has(idx) && <CheckCircle2 size={12} style={{ color: '#22c55e' }} />}
          </button>
        ))}
      </div>

      {/* Tab 1: Spot the Dict */}
      {activeTab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SPOT_PUZZLES.map((puz, pi) => {
            const chosen = spotAns[pi];
            return (
              <GlassCard key={pi} style={{ padding: '20px', background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  {puz.title}: Which one is a Dictionary?
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  {[puz.optA, puz.optB].map((opt, oi) => {
                    const isSelected = chosen === opt.isDict;
                    return (
                      <button
                        key={oi}
                        onClick={() => setSpotAns(prev => ({ ...prev, [pi]: opt.isDict }))}
                        style={{
                          padding: '12px', borderRadius: '10px', textAlign: 'left',
                          background: chosen !== undefined && isSelected ? (opt.isDict ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.06)') : 'white',
                          border: chosen !== undefined && isSelected ? (opt.isDict ? '1.5px solid #22c55e' : '1.5px solid #ef4444') : '1px solid rgba(0,0,0,0.1)',
                          fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#0f172a',
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {chosen !== undefined && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '8px',
                    background: chosen ? 'rgba(34, 197, 94, 0.06)' : 'rgba(239, 68, 68, 0.05)',
                    border: `1px solid ${chosen ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    fontSize: '12px', color: chosen ? '#15803d' : '#b91c1c', fontWeight: 600
                  }}>
                    {chosen ? puz.optB.why : puz.optA.why}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Tab 2: Predict Lookup */}
      {activeTab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {LOOKUP_PUZZLES.map((puz, pi) => {
            const chosenOpt = lookupAns[pi];
            const isRight = chosenOpt === puz.answer;

            return (
              <GlassCard key={pi} style={{ padding: '20px', background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
                <pre style={{
                  padding: '12px 14px', borderRadius: '10px', background: '#091124', color: '#f1f5f9',
                  fontFamily: 'var(--font-mono)', fontSize: '12px', margin: '0 0 14px', overflowX: 'auto'
                }}>
                  <code>{puz.code}</code>
                </pre>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  {puz.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => setLookupAns(prev => ({ ...prev, [pi]: oi }))}
                      style={{
                        padding: '10px 14px', borderRadius: '8px', textAlign: 'left',
                        background: chosenOpt === oi ? (oi === puz.answer ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.06)') : 'white',
                        border: chosenOpt === oi ? (oi === puz.answer ? '1.5px solid #22c55e' : '1.5px solid #ef4444') : '1px solid rgba(0,0,0,0.1)',
                        fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {chosenOpt !== undefined && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '8px',
                    background: isRight ? 'rgba(34, 197, 94, 0.06)' : 'rgba(239, 68, 68, 0.05)',
                    border: `1px solid ${isRight ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    fontSize: '12px', color: isRight ? '#15803d' : '#b91c1c', fontWeight: 600
                  }}>
                    {puz.why}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default DictGuidedPractice;
