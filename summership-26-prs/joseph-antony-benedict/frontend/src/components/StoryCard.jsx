import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Terminal } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const StoryCard = ({ 
  icon = '🧰',
  title, 
  storySentences = [], 
  realWorld, 
  nerdNote 
}) => {
  const { nerdMode } = useGame();

  return (
    <div className="story-card-wrapper" style={{ marginBottom: '24px' }}>
      {/* Sly Dialogue Box */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '24px', 
          borderLeft: '4px solid var(--secondary)',
          background: 'rgba(15, 20, 35, 0.6)',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '1.6rem' }}>{icon}</span>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.08em' }}>
              Sly the Goblin Whispers:
            </span>
            <h3 style={{ color: '#fff', margin: 0, fontSize: '1.25rem' }}>{title}</h3>
          </div>
        </div>

        {/* Max 3 Short Sentences */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#E0E0F0', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {storySentences.slice(0, 3).map((sentence, idx) => (
            <p key={idx} style={{ margin: 0 }}>
              {sentence}
            </p>
          ))}
        </div>
      </div>

      {/* Concept Boxes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {/* Real-World Connection Box */}
        {realWorld && (
          <div 
            style={{
              background: 'rgba(0, 240, 255, 0.06)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.92rem',
              color: '#D8F8FF'
            }}
          >
            <Globe size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--secondary)' }}>Real-World Connection:</strong> {realWorld}
            </div>
          </div>
        )}

        {/* Nerd Mode Box (Revealed when nerdMode is active) */}
        {nerdMode && nerdNote && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              background: 'rgba(138, 43, 226, 0.12)',
              border: '1px solid rgba(138, 43, 226, 0.35)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.88rem',
              color: '#E6D3FF',
              fontFamily: 'monospace'
            }}
          >
            <Terminal size={18} color="#D4AAFF" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#D4AAFF' }}>NERD MODE INSIGHT:</strong> {nerdNote}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
