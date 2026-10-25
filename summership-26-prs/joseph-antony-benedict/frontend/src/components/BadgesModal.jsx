import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, CheckCircle2, Lock } from 'lucide-react';
import { useGame, BADGES_DATA } from '../context/GameContext';

export const BadgesModal = ({ isOpen, onClose }) => {
  const { unlockedBadges } = useGame();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 5, 12, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <motion.div 
          className="glass-card"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '680px',
            width: '100%',
            padding: '35px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={32} color="var(--accent)" />
              <div>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Heist Badges & Trophies</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  Unlocked {unlockedBadges.length} of {Object.keys(BADGES_DATA).length} badges
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {Object.values(BADGES_DATA).map(badge => {
              const isUnlocked = unlockedBadges.includes(badge.id);
              return (
                <div 
                  key={badge.id}
                  style={{
                    background: isUnlocked ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isUnlocked ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    position: 'relative',
                    opacity: isUnlocked ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '2.5rem' }}>{badge.icon}</span>
                    {isUnlocked ? (
                      <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        <CheckCircle2 size={16} /> Unlocked
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                        <Lock size={16} /> Chapter {badge.chapter}
                      </span>
                    )}
                  </div>
                  <h4 style={{ color: isUnlocked ? 'var(--secondary)' : '#fff', fontSize: '1.15rem', margin: 0 }}>
                    {badge.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.4' }}>
                    {badge.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
