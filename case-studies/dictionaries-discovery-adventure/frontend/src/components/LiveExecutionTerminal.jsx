import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getTreasure } from '../services/api';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const LiveExecutionTerminal = ({ onExecutedSuccess }) => {
  const { 
    addXP, 
    raiseDogMeter, 
    lowerDogMeter, 
    triggerConfetti, 
    unlockBadge 
  } = useGame();
  const { playSuccess, playWrong, playDogBark, playChestOpen, playClick } = useSoundFX();

  const [inputKey, setInputKey] = useState('star');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isShake, setIsShake] = useState(false);

  const suggestedKeys = ['star', 'heart', 'skull', 'crown'];

  const executeSpell = async (keyToRun) => {
    const key = (keyToRun || inputKey).trim().toLowerCase();
    if (!key) return;

    playClick();
    setLoading(true);
    setResult(null);

    const data = await getTreasure(key);
    setLoading(false);
    setResult(data);

    if (data.success) {
      if (data.isEasterEgg) {
        // Easter egg bonus!
        playChestOpen();
        triggerConfetti();
        addXP(40);
        lowerDogMeter(30);
      } else {
        playSuccess();
        playChestOpen();
        triggerConfetti();
        addXP(30);
        lowerDogMeter(20);
        unlockBadge('master_thief');
        if (onExecutedSuccess) onExecutedSuccess();
      }
    } else {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 600);
      playWrong();
      playDogBark();
      raiseDogMeter(25);
    }
  };

  const handleSuggestClick = (k) => {
    playClick();
    setInputKey(k);
    executeSpell(k);
  };

  const liveCode = `# Live Spell Terminal
wizard_chest = {
    "star": "Golden Coin 🌟",
    "heart": "Ruby 💖",
    "skull": "Cursed Ring ☠️",
    "crown": "Royal Gem 👑"
}

# Python instant O(1) hashmap retrieval:
treasure = wizard_chest["${inputKey || '...' }"]
print(treasure)`;

  return (
    <div className="live-terminal-wrapper" style={{ margin: '20px 0' }}>
      {/* Live Python Code Display */}
      <div 
        style={{
          background: 'rgba(5, 5, 15, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '20px',
          fontFamily: "'Fira Code', monospace",
          fontSize: '0.98rem',
          lineHeight: '1.7',
          color: '#E0E0E0',
          marginBottom: '16px'
        }}
      >
        <div style={{ color: '#6A737D', marginBottom: '4px' }}># Watch the Python code update as you type:</div>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          <span style={{ color: '#FF7B72' }}>treasure</span> = <span style={{ color: '#79C0FF' }}>wizard_chest</span>[<span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>"{inputKey}"</span>]
        </pre>
      </div>

      {/* Suggested Keys Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try sticker keys:</span>
        {suggestedKeys.map(k => (
          <button
            key={k}
            onClick={() => handleSuggestClick(k)}
            style={{
              background: inputKey === k ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.08)',
              color: inputKey === k ? '#000' : '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            "{k}"
          </button>
        ))}

        {/* Easter Egg hint */}
        <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: 'auto', fontStyle: 'italic' }}>
          🤫 Hint: Try typing "goblin" or "bone"!
        </span>
      </div>

      {/* Terminal Input Form */}
      <motion.form 
        onSubmit={(e) => { e.preventDefault(); executeSpell(); }}
        animate={isShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}
      >
        <input 
          type="text"
          className="web3-input"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Type key symbol (e.g. star, skull)..."
          style={{ 
            borderColor: result?.success ? 'var(--success)' : result && !result.success ? 'var(--error)' : 'var(--secondary)',
            fontSize: '1.1rem'
          }}
        />
        <button 
          type="submit"
          className="web3-button"
          disabled={loading || !inputKey.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            flexShrink: 0
          }}
        >
          {loading ? 'Executing...' : <>Cast Spell <Send size={16} /></>}
        </button>
      </motion.form>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: result.success 
                ? 'linear-gradient(135deg, rgba(0, 255, 163, 0.15), rgba(0, 240, 255, 0.1))' 
                : 'rgba(255, 76, 76, 0.15)',
              border: `1px solid ${result.success ? 'var(--success)' : 'var(--error)'}`,
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            {result.success ? (
              <div>
                <motion.div 
                  style={{ fontSize: '3.5rem', marginBottom: '10px' }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  🎉 💰 💎
                </motion.div>
                <h3 style={{ color: 'var(--success)', margin: '0 0 6px 0', fontSize: '1.4rem' }}>
                  {result.isEasterEgg ? 'SECRET EASTER EGG UNLOCKED!' : 'CHEST BURST OPEN!'}
                </h3>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', margin: '8px 0' }}>
                  {result.treasure}
                </div>
                <p style={{ color: '#D8F8FF', margin: 0, fontSize: '0.95rem' }}>
                  {result.hint}
                </p>
                <div style={{ marginTop: '10px', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  ✅ Instant O(1) hashmap lookup complete! Sly sneaks away with the prize!
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🐶⚡💥</div>
                <h3 style={{ color: 'var(--error)', margin: '0 0 6px 0', fontSize: '1.3rem' }}>
                  BOOM! INVALID KEY!
                </h3>
                <p style={{ color: '#FFA3A3', margin: '4px 0 10px 0', fontSize: '0.95rem' }}>
                  {result.message}
                </p>
                <div style={{ fontSize: '0.85rem', color: '#FFF1C5', background: 'rgba(255,255,255,0.06)', padding: '8px', borderRadius: '8px' }}>
                  💡 {result.hint} (Dog Wake Meter +25%)
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
