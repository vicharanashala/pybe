import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Lightbulb } from 'lucide-react';

export const DictDiscovery: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  const ruleOptions = [
    {
      text: "Rule A: Store items in two separate lists and count position numbers manually",
      isCorrect: false,
      feedback: "Incorrect. Position numbers easily get out of sync when items are added or removed."
    },
    {
      text: "Rule B: Pair each unique Key (Label) directly to its Value, so looking up the Key returns its Value instantly",
      isCorrect: true,
      feedback: "Bingo! By pairing a unique Key (e.g. 'Small Light') to its Value ('Press yellow button'), lookups are instant and immune to position changes!"
    },
    {
      text: "Rule C: Repeat every action 5 times so you don't forget them",
      isCorrect: false,
      feedback: "Incorrect. Repeating actions creates clutter without helping lookups."
    }
  ];

  const handleSelectRule = (idx: number) => {
    setSelectedRule(idx);
    setRevealed(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={16} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STAGE 6 — DISCOVERY SCENE
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          What Rule Did You Follow to Solve Nobita's Mystery?
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Doraemon asks: "What fundamental rule made your codebook search instant and crash-proof?"
        </p>
      </div>

      {/* Socratic Choice Card */}
      <GlassCard style={{ padding: '24px', background: 'white', border: '1.5px solid rgba(245, 158, 11, 0.25)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ruleOptions.map((item, idx) => {
            const isSelected = selectedRule === idx;
            const isRight = item.isCorrect;

            let bg = 'white';
            let border = '1px solid rgba(0,0,0,0.08)';
            let color = '#334155';

            if (revealed && isSelected) {
              if (isRight) { bg = 'rgba(34, 197, 94, 0.08)'; border = '1.5px solid #22c55e'; color = '#15803d'; }
              else { bg = 'rgba(239, 68, 68, 0.06)'; border = '1.5px solid #ef4444'; color = '#b91c1c'; }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectRule(idx)}
                style={{
                  textAlign: 'left', padding: '16px 20px', borderRadius: '12px',
                  background: bg, border, color,
                  fontSize: '13.5px', fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                  background: isSelected ? (isRight ? '#22c55e' : '#ef4444') : 'rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: 'white', fontWeight: 900
                }}>
                  {revealed && isSelected ? (isRight ? '✓' : '✗') : String.fromCharCode(65 + idx)}
                </div>
                <span style={{ lineHeight: 1.5 }}>{item.text}</span>
              </button>
            );
          })}
        </div>

        {/* Revealed Discovery Rule Card */}
        {revealed && selectedRule !== null && (
          <div style={{
            marginTop: '20px', padding: '18px 20px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(254, 240, 138, 0.25) 0%, rgba(255, 255, 255, 0.95) 100%)',
            border: '1.5px solid #f59e0b', color: '#92400e',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }} className="animate-fade-in">
            <div style={{ fontWeight: 900, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={18} style={{ color: '#d97706' }} />
              <span>You Discovered the Key-Value Rule!</span>
            </div>
            <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.6, color: '#334155', fontWeight: 500 }}>
              {ruleOptions[selectedRule].feedback}
            </p>
          </div>
        )}

      </GlassCard>

    </div>
  );
};

export default DictDiscovery;
