import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { AlertCircle, HelpCircle } from 'lucide-react';

// Nobita's chaotic stamp box — full of duplicates
const STAMP_BOX: { id: number; label: string; emoji: string }[] = [
  { id: 1,  label: 'Triceratops',    emoji: '🦕' },
  { id: 2,  label: 'T-Rex',          emoji: '🦖' },
  { id: 3,  label: 'Triceratops',    emoji: '🦕' },
  { id: 4,  label: 'Brachiosaurus',  emoji: '🦕' },
  { id: 5,  label: 'T-Rex',          emoji: '🦖' },
  { id: 6,  label: 'Pterodactyl',    emoji: '🦅' },
  { id: 7,  label: 'Triceratops',    emoji: '🦕' },
  { id: 8,  label: 'Pterodactyl',    emoji: '🦅' },
  { id: 9,  label: 'Stegosaurus',    emoji: '🦕' },
  { id: 10, label: 'T-Rex',          emoji: '🦖' },
  { id: 11, label: 'Brachiosaurus',  emoji: '🦕' },
  { id: 12, label: 'Pterodactyl',    emoji: '🦅' },
];

// What Suneo is demanding
const SUNEO_DEMAND = ['T-Rex', 'Pterodactyl', 'Stegosaurus'];

interface ProblemProps {
  obstacleTitle?: string;
  problemStatement?: string;
  constraints?: string[];
}

export const Problem: React.FC<ProblemProps> = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const choices = [
    "There are too many stamps and it takes forever to search",
    "Some stamps appear more than once in the box",
    "The stamps are in the wrong order",
    "Nobita doesn't have all the stamps Suneo wants",
  ];

  const correctAnswer = choices[1]; // duplicate stamps are the core issue

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.5px', textTransform: 'uppercase' }}>THE PROBLEM</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Suneo's 3-Second Challenge!</h2>
      </div>

      {/* Scene: Suneo's demand banner */}
      <GlassCard style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(255,255,255,0.7) 100%)',
        border: '1.5px solid rgba(239,68,68,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          {/* Suneo avatar placeholder */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px',
            boxShadow: '0 4px 14px rgba(251,191,36,0.3)'
          }}>😏</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Suneo says:</div>
            <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
              "Prove you have a <strong>T-Rex</strong>, a <strong>Pterodactyl</strong>, and a <strong>Stegosaurus</strong> stamp — in exactly <strong>3 seconds</strong>. 
              Start… now!"
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Nobita's panic */}
      <GlassCard style={{
        padding: '20px 24px',
        background: 'rgba(255,255,255,0.75)',
        border: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px',
            boxShadow: '0 4px 14px rgba(59,130,246,0.25)'
          }}>😰</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Nobita panics:</div>
            <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
              "W-wait! They're all in this box somewhere…"
            </p>
          </div>
        </div>
      </GlassCard>

      {/* The chaotic stamp box — visual dump */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📦</span> Nobita's Stamp Box (all {STAMP_BOX.length} stamps, dumped out):
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '18px',
          borderRadius: '16px',
          background: 'linear-gradient(to bottom right, #f1f5f9, #e2e8f0)',
          border: '1.5px dashed rgba(0,0,0,0.1)',
        }}>
          {STAMP_BOX.map((stamp) => (
            <div
              key={stamp.id}
              onClick={() => setSelectedId(stamp.id === selectedId ? null : stamp.id)}
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: selectedId === stamp.id ? '#eff6ff' : 'white',
                border: selectedId === stamp.id ? '1.5px solid #3b82f6' : '1px solid rgba(0,0,0,0.07)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
                boxShadow: selectedId === stamp.id ? '0 0 0 3px rgba(59,130,246,0.1)' : '0 2px 6px rgba(0,0,0,0.04)',
                userSelect: 'none',
              }}
            >
              <span>{stamp.emoji}</span>
              <span>{stamp.label}</span>
            </div>
          ))}
        </div>

        {/* Suneo's demand strip */}
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SUNEO NEEDS:</span>
          {SUNEO_DEMAND.map((s) => (
            <span key={s} style={{
              fontSize: '12px', fontWeight: 700,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#b91c1c',
              padding: '3px 10px',
              borderRadius: '6px',
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Question to learner — no hint */}
      <GlassCard style={{
        padding: '20px 24px',
        background: 'rgba(255,255,255,0.8)',
        border: '1.5px solid rgba(0,140,255,0.12)'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
          <HelpCircle size={15} style={{ color: '#008cff', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
            Look at the stamp box. What is making this so hard for Nobita?
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {choices.map((choice) => {
            const isSelected = userAnswer === choice;
            const isCorrect  = choice === correctAnswer;
            const showResult = userAnswer !== null;

            let bg     = 'white';
            let border = '1px solid rgba(0,0,0,0.08)';
            let color  = '#1e293b';

            if (showResult && isSelected && isCorrect)  { bg = 'rgba(34,197,94,0.08)';  border = '1.5px solid #22c55e'; color = '#15803d'; }
            if (showResult && isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.06)';  border = '1.5px solid #ef4444'; color = '#b91c1c'; }

            return (
              <button
                key={choice}
                onClick={() => !userAnswer && setUserAnswer(choice)}
                disabled={userAnswer !== null}
                style={{
                  textAlign: 'left',
                  padding: '11px 16px',
                  borderRadius: '10px',
                  background: bg,
                  border,
                  color,
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: userAnswer ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: isSelected ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: 'white', fontWeight: 800, flexShrink: 0,
                }}>
                  {isSelected ? (isCorrect ? '✓' : '✗') : ''}
                </span>
                {choice}
              </button>
            );
          })}
        </div>

        {userAnswer && userAnswer !== correctAnswer && (
          <p style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', margin: '12px 0 0' }}>
            Look again at the box — count how many times each stamp name appears.
          </p>
        )}
      </GlassCard>
    </div>
  );
};

export default Problem;
