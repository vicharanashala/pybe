import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, RotateCcw, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const RaceMode = () => {
  const { nerdMode } = useGame();
  const { playSuccess, playClick } = useSoundFX();

  const [chestSize, setChestSize] = useState(1000); // 10, 1000, 1000000
  const [isRacing, setIsRacing] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);

  // Steps
  const [linearSteps, setLinearSteps] = useState(0);
  const [hashmapSteps, setHashmapSteps] = useState(0);

  const linearTimerRef = useRef(null);

  const sizes = [
    { label: '10 Drawers', value: 10 },
    { label: '1,000 Drawers', value: 1000 },
    { label: '1,000,000 Drawers', value: 1000000 }
  ];

  const handleStartRace = () => {
    playClick();
    setIsRacing(true);
    setRaceFinished(false);
    setLinearSteps(0);

    // Hashmap finishes immediately in 1 step!
    setHashmapSteps(1);

    // Linear Search steps up
    const stepIncrement = chestSize === 10 ? 1 : chestSize === 1000 ? 25 : 25000;
    const intervalTime = chestSize === 10 ? 80 : 25;

    linearTimerRef.current = setInterval(() => {
      setLinearSteps(prev => {
        const next = prev + stepIncrement;
        if (next >= chestSize) {
          clearInterval(linearTimerRef.current);
          setIsRacing(false);
          setRaceFinished(true);
          playSuccess();
          return chestSize;
        }
        return next;
      });
    }, intervalTime);
  };

  const handleReset = () => {
    playClick();
    clearInterval(linearTimerRef.current);
    setIsRacing(false);
    setRaceFinished(false);
    setLinearSteps(0);
    setHashmapSteps(0);
  };

  useEffect(() => {
    return () => clearInterval(linearTimerRef.current);
  }, []);

  return (
    <div className="race-mode-container glass-card" style={{ padding: '24px', border: '1px solid var(--secondary)', background: 'rgba(0, 240, 255, 0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--secondary)', margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} /> The Grand Heist Race: O(N) vs O(1)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Watch Sly the Searcher (Sequential) race against Sly the Wizard (Hashmap)!
          </p>
        </div>

        {/* Chest Size Selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {sizes.map(s => (
            <button
              key={s.value}
              onClick={() => {
                handleReset();
                setChestSize(s.value);
              }}
              style={{
                background: chestSize === s.value ? 'var(--secondary)' : 'rgba(255,255,255,0.06)',
                color: chestSize === s.value ? '#000' : '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Racers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Racer 1: Linear Search */}
        <div style={{
          background: 'rgba(255, 46, 147, 0.08)',
          border: '1px solid rgba(255, 46, 147, 0.3)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.95rem' }}>
              🐢 Sly the Searcher (List)
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,46,147,0.2)', padding: '2px 8px', borderRadius: '10px', color: '#ffb3d9' }}>
              {nerdMode ? 'Sequential O(N)' : 'One-by-One'}
            </span>
          </div>

          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#fff', marginBottom: '8px' }}>
            {linearSteps.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {chestSize.toLocaleString()} checks</span>
          </div>

          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: 'var(--primary)' }}
              animate={{ width: `${Math.min(100, (linearSteps / chestSize) * 100)}%` }}
              transition={{ ease: 'linear', duration: 0.05 }}
            />
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', margin: '8px 0 0 0' }}>
            {linearSteps >= chestSize 
              ? '🏁 Finally done... But the dog is wide awake!' 
              : isRacing 
                ? 'Sweating, pulling every drawer...' 
                : 'Waiting at drawer #0'}
          </p>
        </div>

        {/* Racer 2: Hashmap */}
        <div style={{
          background: 'rgba(0, 240, 255, 0.08)',
          border: '1px solid var(--secondary)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: hashmapSteps === 1 ? '0 0 20px rgba(0, 240, 255, 0.2)' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '0.95rem' }}>
              ⚡ Sly the Wizard (Hashmap)
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(0, 240, 255, 0.2)', padding: '2px 8px', borderRadius: '10px', color: '#B5F8FF' }}>
              {nerdMode ? 'Instant O(1)' : 'Direct Lookup'}
            </span>
          </div>

          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--secondary)', marginBottom: '8px' }}>
            {hashmapSteps} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>check only!</span>
          </div>

          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: 'var(--secondary)' }}
              animate={{ width: hashmapSteps === 1 ? '100%' : '0%' }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--secondary)', marginTop: '8px', margin: '8px 0 0 0' }}>
            {hashmapSteps === 1 
              ? '⚡ Finished on step 1! Snatched coin silently!' 
              : 'Spell ready to cast'}
          </p>
        </div>
      </div>

      {/* Control Actions */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          className="web3-button"
          onClick={handleStartRace}
          disabled={isRacing}
          style={{
            padding: '10px 22px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, var(--secondary), var(--primary))',
            color: '#000'
          }}
        >
          <Play size={16} /> {raceFinished ? 'Race Again' : 'Start Heist Race!'}
        </button>

        <button
          onClick={handleReset}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>

        {hashmapSteps === 1 && (
          <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 'bold' }}>
            💡 Notice: Whether the chest has 10 drawers or 1,000,000 drawers, Hashmap ALWAYS takes 1 step!
          </span>
        )}
      </div>
    </div>
  );
};
