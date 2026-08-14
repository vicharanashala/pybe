import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Eye, CheckCircle2 } from 'lucide-react';

export const DictObservation: React.FC = () => {
  const [selectedObs, setSelectedObs] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const questions = [
    {
      q: "1. What is the biggest danger of storing Gadget Names and Actions in two separate lists?",
      options: [
        "A) The lists take up too much paper",
        "B) If one list changes, index positions get out of sync and match the wrong action",
        "C) List names cannot be written in English"
      ],
      correct: 1,
      why: "If List A is reordered or an item is added, List B's index positions no longer line up with the correct gadget!"
    },
    {
      q: "2. Instead of using index numbers (0, 1, 2), what would be a safer way to find a gadget's action?",
      options: [
        "A) Memory search through all pages every time",
        "B) Directly attach the gadget name ('Small Light') as the label for its action ('Press yellow button')",
        "C) Color-code every piece of paper manually"
      ],
      correct: 1,
      why: "Using the gadget name itself as the label guarantees that looking up 'Small Light' always returns its exact action regardless of order!"
    }
  ];

  const handleSelect = (qIdx: number, _optIdx: number, choiceText: string) => {
    setSelectedObs(prev => ({ ...prev, [qIdx]: choiceText }));
    setRevealed(prev => ({ ...prev, [qIdx]: true }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STAGE 4 — OBSERVATION ACTIVITY
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          What Do You Notice About Nobita's Lists?
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Think before revealing anything. What happens when you look up information using labels versus numbers?
        </p>
      </div>

      {/* Observation Questions Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {questions.map((item, qIdx) => {
          const chosen = selectedObs[qIdx];
          const isRev = revealed[qIdx];

          return (
            <GlassCard key={qIdx} style={{ padding: '20px', background: 'white', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px', lineHeight: 1.5 }}>
                {item.q}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                {item.options.map((opt, optIdx) => {
                  const isSelected = chosen === opt;
                  const isRight = optIdx === item.correct;

                  let bg = 'white';
                  let border = '1px solid rgba(0, 0, 0, 0.08)';
                  let color = '#334155';

                  if (isRev && isSelected) {
                    if (isRight) { bg = 'rgba(34, 197, 94, 0.08)'; border = '1.5px solid #22c55e'; color = '#15803d'; }
                    else { bg = 'rgba(239, 68, 68, 0.06)'; border = '1.5px solid #ef4444'; color = '#b91c1c'; }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx, opt)}
                      style={{
                        textAlign: 'left', padding: '12px 16px', borderRadius: '10px',
                        background: bg, border, color,
                        fontSize: '13px', fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer', transition: 'all 0.15s ease'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isRev && (
                <div style={{
                  padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(0, 140, 255, 0.06)', border: '1px solid rgba(0, 140, 255, 0.2)',
                  fontSize: '12.5px', color: '#0369a1', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px'
                }} className="animate-fade-in">
                  <CheckCircle2 size={16} />
                  <span>{item.why}</span>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};

export default DictObservation;
