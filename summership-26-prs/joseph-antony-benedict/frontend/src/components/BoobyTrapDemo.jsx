import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertOctagon, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const BoobyTrapDemo = ({ onTrapDisarmed }) => {
  const { addXP, raiseDogMeter, lowerDogMeter, triggerConfetti, unlockBadge } = useGame();
  const { playSuccess, playWrong, playDogBark, playClick } = useSoundFX();

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isCrashing, setIsCrashing] = useState(false);
  const [trapCleared, setTrapCleared] = useState(false);

  const methods = [
    {
      id: 'bracket',
      code: 'treasure = wizard_chest["dragon"]',
      title: 'Square Brackets: wizard_chest["dragon"]',
      status: 'fatal',
      summary: 'Direct lookup with square brackets when the key is missing.',
      errorOutput: `Traceback (most recent call last):
  File "heist.py", line 12, in <module>
    treasure = wizard_chest["dragon"]
KeyError: 'dragon'`,
      explanation: 'Python searched all 1,000 drawers for "dragon". Since the sticker doesn\'t exist, it threw an unhandled KeyError and crashed the entire spell! The loud crash woke the dog!'
    },
    {
      id: 'get_basic',
      code: 'treasure = wizard_chest.get("dragon")',
      title: 'Safe .get(): wizard_chest.get("dragon")',
      status: 'safe',
      summary: 'Safely queries the dictionary without ever crashing if missing.',
      output: `None  # Safe fallback! No alarm triggered.`,
      explanation: 'Genius! The .get() method gently asks: "Is \'dragon\' in the chest?" If not, it returns None safely instead of crashing the program. The dog snores right through it!'
    },
    {
      id: 'get_default',
      code: 'treasure = wizard_chest.get("dragon", "Empty hands!")',
      title: 'Custom Default: wizard_chest.get("dragon", "Empty hands!")',
      status: 'bonus',
      summary: 'Provides a custom fallback message if the key doesn\'t exist.',
      output: `"Empty hands!"  # Custom fallback!`,
      explanation: 'Master thief level! You specified your own custom backup value. If "dragon" isn\'t found, it gracefully yields "Empty hands!" with zero alarms.'
    }
  ];

  const handleSelect = (m) => {
    playClick();
    setSelectedMethod(m);

    if (m.status === 'fatal') {
      setIsCrashing(true);
      setTimeout(() => setIsCrashing(false), 800);
      playWrong();
      playDogBark();
      raiseDogMeter(30);
    } else {
      playSuccess();
      lowerDogMeter(25);
      addXP(30);
      triggerConfetti();
      setTrapCleared(true);
      unlockBadge('trap_dodger');
      if (onTrapDisarmed) onTrapDisarmed();
    }
  };

  return (
    <div className="booby-trap-container" style={{ margin: '20px 0' }}>
      {/* Dynamic Code Preview */}
      <div 
        style={{
          background: 'rgba(5, 5, 15, 0.9)',
          border: selectedMethod?.status === 'fatal' ? '2px solid var(--error)' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '20px',
          fontFamily: "'Fira Code', monospace",
          fontSize: '0.98rem',
          lineHeight: '1.7',
          color: '#E0E0E0',
          marginBottom: '18px'
        }}
      >
        <div style={{ color: '#6A737D', marginBottom: '4px' }}># How should Sly query the missing "dragon" key?</div>
        <pre style={{ margin: 0, color: selectedMethod?.status === 'fatal' ? '#FFA3A3' : '#7EE787' }}>
          {selectedMethod ? selectedMethod.code : 'treasure = ???  # Select an approach below'}
        </pre>
      </div>

      {/* Vertical Option Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {methods.map(m => {
          const isSelected = selectedMethod?.id === m.id;
          let borderStyle = '1px solid rgba(255, 255, 255, 0.12)';
          let bgStyle = 'rgba(255, 255, 255, 0.04)';

          if (isSelected) {
            if (m.status === 'fatal') {
              borderStyle = '1px solid var(--error)';
              bgStyle = 'rgba(255, 76, 76, 0.15)';
            } else {
              borderStyle = '1px solid var(--success)';
              bgStyle = 'rgba(0, 255, 163, 0.15)';
            }
          }

          return (
            <motion.button
              key={m.id}
              onClick={() => handleSelect(m)}
              animate={isSelected && m.status === 'fatal' && isCrashing ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.6 }}
              style={{
                background: bgStyle,
                border: borderStyle,
                borderRadius: '14px',
                padding: '16px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
            >
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 'bold', color: m.status === 'fatal' ? '#FF8C8C' : 'var(--secondary)', marginBottom: '4px' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {m.summary}
                </div>
              </div>

              {isSelected && m.status === 'fatal' && <AlertOctagon size={24} color="var(--error)" />}
              {isSelected && m.status !== 'fatal' && <CheckCircle2 size={24} color="var(--success)" />}
            </motion.button>
          );
        })}
      </div>

      {/* Breakdown Output */}
      <AnimatePresence>
        {selectedMethod && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: selectedMethod.status === 'fatal' 
                ? 'rgba(255, 76, 76, 0.12)' 
                : 'rgba(0, 255, 163, 0.1)',
              border: `1px solid ${selectedMethod.status === 'fatal' ? 'var(--error)' : 'var(--success)'}`,
              borderRadius: '16px',
              padding: '20px'
            }}
          >
            {selectedMethod.status === 'fatal' ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>
                  <ShieldAlert size={20} /> ALARM TRIGGERED: Python KeyError Crash!
                </div>
                <pre style={{
                  background: 'rgba(0,0,0,0.7)',
                  padding: '14px',
                  borderRadius: '10px',
                  fontFamily: 'monospace',
                  fontSize: '0.88rem',
                  color: '#FF6B6B',
                  marginBottom: '12px',
                  overflowX: 'auto'
                }}>
                  {selectedMethod.errorOutput}
                </pre>
                <p style={{ color: '#FFA3A3', fontSize: '0.92rem', lineHeight: '1.5', margin: 0 }}>
                  <strong>How it works:</strong> {selectedMethod.explanation}
                </p>
                <div style={{ color: 'var(--error)', fontSize: '0.82rem', marginTop: '8px', fontWeight: 'bold' }}>
                  ⚠️ The guard dog jumped up! (+30% Dog Wake Meter). Try a safe method above!
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>
                  <ShieldCheck size={20} /> BOOBY TRAP BYPASSED SAFELY!
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.6)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontFamily: 'monospace',
                  fontSize: '0.95rem',
                  color: 'var(--success)',
                  marginBottom: '10px'
                }}>
                  Result: {selectedMethod.output}
                </div>
                <p style={{ color: '#D8F8FF', fontSize: '0.92rem', lineHeight: '1.5', margin: 0 }}>
                  <strong>How it works:</strong> {selectedMethod.explanation}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
