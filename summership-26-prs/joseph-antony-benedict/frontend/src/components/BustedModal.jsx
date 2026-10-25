import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RotateCcw, Volume2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const BustedModal = () => {
  const { isBusted, resetDogMeter } = useGame();
  const { playDogBark, playClick } = useSoundFX();

  if (!isBusted) return null;

  const handleTryAgain = () => {
    playClick();
    resetDogMeter();
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="busted-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 12, 0.92)',
          backdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <motion.div 
          className="glass-card"
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          style={{
            maxWidth: '540px',
            width: '100%',
            textAlign: 'center',
            padding: '40px 30px',
            border: '2px solid var(--error)',
            boxShadow: '0 0 50px rgba(255, 76, 76, 0.4)'
          }}
        >
          <motion.div 
            style={{ fontSize: '4.5rem', marginBottom: '15px' }}
            animate={{ rotate: [-8, 8, -8], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          >
            🐶💥
          </motion.div>

          <h2 style={{ color: 'var(--error)', fontSize: '2rem', marginBottom: '10px', textTransform: 'uppercase' }}>
            BUSTED! THE DOG IS AWAKE!
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '25px' }}>
            <em>"Yikes! All that clattering and wrong drawer pulling woke the Wizard's guard dog! Sly got chased under the spellbook table!"</em>
          </p>

          <div style={{
            background: 'rgba(255, 76, 76, 0.1)',
            border: '1px solid rgba(255, 76, 76, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '30px',
            fontSize: '0.95rem',
            color: 'var(--text-main)'
          }}>
            🦴 <strong>Don't worry!</strong> Real master thieves learn by experimenting. Toss the dog a sleepy biscuit to quiet him down and try again!
          </div>

          <button 
            className="web3-button"
            onClick={handleTryAgain}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #FF8C00, #FF2E93)',
              fontSize: '1.1rem'
            }}
          >
            <RotateCcw size={20} />
            Toss Sleep Biscuit & Try Again
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
