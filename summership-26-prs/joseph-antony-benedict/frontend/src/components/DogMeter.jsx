import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export const DogMeter = () => {
  const { dogMeter } = useGame();

  let stateIcon = '💤';
  let stateText = 'Fast Asleep';
  let stateColor = 'var(--success)';
  let barGradient = 'linear-gradient(90deg, #00FFA3, #00F0FF)';

  if (dogMeter > 75) {
    stateIcon = '🐶💢';
    stateText = 'GUARD DOG GROWLING!';
    stateColor = 'var(--error)';
    barGradient = 'linear-gradient(90deg, #FF9900, #FF2E93, #FF0000)';
  } else if (dogMeter > 40) {
    stateIcon = '🐕👂';
    stateText = 'Ears Twitching...';
    stateColor = 'var(--accent)';
    barGradient = 'linear-gradient(90deg, #00FFA3, #F2C94C, #FF8C00)';
  }

  return (
    <div 
      className="dog-meter-container"
      title="Wrong moves wake the guard dog! Keep the meter low."
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(10, 10, 20, 0.7)',
        padding: '8px 16px',
        borderRadius: '30px',
        border: `1px solid ${dogMeter > 75 ? 'var(--error)' : 'rgba(255, 255, 255, 0.15)'}`,
        boxShadow: dogMeter > 75 ? '0 0 15px rgba(255, 76, 76, 0.5)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <motion.span 
        style={{ fontSize: '1.4rem' }}
        animate={dogMeter > 75 ? { rotate: [-5, 5, -5], scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.4, repeat: Infinity }}
      >
        {stateIcon}
      </motion.span>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '130px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span style={{ color: stateColor }}>{stateText}</span>
          <span style={{ color: '#fff', opacity: 0.8 }}>{dogMeter}%</span>
        </div>
        
        {/* Progress Bar Track */}
        <div 
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <motion.div 
            style={{
              height: '100%',
              background: barGradient,
              borderRadius: '4px'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${dogMeter}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};
