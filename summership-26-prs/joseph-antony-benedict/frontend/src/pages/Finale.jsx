import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Zap, BookKey, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import { HeistExam } from '../components/HeistExam';
import { CertificateGenerator } from '../components/CertificateGenerator';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const Finale = () => {
  const navigate = useNavigate();
  const { xp, unlockedBadges, BADGES_DATA, resetAllProgress } = useGame();
  const { playClick } = useSoundFX();

  const [examPassed, setExamPassed] = useState(false);

  const recapCards = [
    {
      icon: <Zap size={28} color="var(--secondary)" />,
      title: '1. O(N) vs O(1) Speed',
      summary: 'Checking boxes one by one O(N) takes forever as N grows. Hashmaps use math to open the exact drawer in 1 step O(1) every single time!',
      nerd: 'Linear search has O(N) complexity. Hash table direct addressing with efficient hash functions delivers amortized O(1) lookup.'
    },
    {
      icon: <BookKey size={28} color="var(--primary)" />,
      title: '2. Key ➡️ Value Dictionaries',
      summary: 'In Python, { "key": "value" } binds a unique sticker (key) to its treasure (value) with a colon.',
      nerd: 'Dictionaries store associative key-value pairs with unique, hashable keys mapped to arbitrary value objects.'
    },
    {
      icon: <ShieldCheck size={28} color="var(--success)" />,
      title: '3. KeyError vs .get() Safety',
      summary: 'Using chest["dragon"] crashes the program if missing! Using chest.get("dragon", fallback) handles missing keys safely without waking the dog.',
      nerd: 'Direct index access throws KeyError on missing keys. Dict.get() safely returns None or an optional default fallback.'
    }
  ];

  return (
    <div className="story-container">
      <motion.div 
        className="story-chapter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card chapter-content-card" style={{ maxWidth: '1200px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <motion.div 
              style={{ fontSize: '4rem', marginBottom: '10px' }}
              animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👑 💎 📜
            </motion.div>
            <h1 className="gradient-text-accent" style={{ fontSize: '2.6rem', marginBottom: '8px' }}>
              The Heist is Complete!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
              <em>"Psst! Look at us! We grabbed the Wizard's treasures, disarmed the booby traps, and left the guard dog fast asleep!"</em> — Sly
            </p>
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '35px'
          }}>
            <div style={{ background: 'rgba(242, 201, 76, 0.1)', border: '1px solid var(--accent)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Heist XP</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>✨ {xp}</div>
            </div>

            <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--secondary)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Badges Unlocked</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>🏆 {unlockedBadges.length} / {Object.keys(BADGES_DATA).length}</div>
            </div>

            <div style={{ background: 'rgba(0, 255, 163, 0.1)', border: '1px solid var(--success)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--success)', textTransform: 'uppercase', fontWeight: 'bold' }}>Guard Dog Status</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fff', marginTop: '4px' }}>💤 Fast Asleep</div>
            </div>
          </div>

          {/* 3 "What You Learned" Cards */}
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '18px', textAlign: 'center' }}>
            What You Learned (The Master Thief Rulebook)
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {recapCards.map((card, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {card.icon}
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1.15rem' }}>{card.title}</h3>
                </div>
                <p style={{ color: '#D8F8FF', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                  <strong>Key Takeaway:</strong> {card.summary}
                </p>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  CS Concept: {card.nerd}
                </div>
              </div>
            ))}
          </div>

          {/* Final Heist Exam */}
          <HeistExam onExamPassed={() => setExamPassed(true)} />

          {/* Certificate Generator */}
          <CertificateGenerator />

          {/* Restart Adventure Button */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              className="web3-button"
              onClick={() => {
                playClick();
                navigate('/story/1');
              }}
              style={{
                padding: '16px 36px',
                fontSize: '1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <RotateCcw size={18} /> Replay Adventure from Chapter 1
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
