import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, AlertTriangle, TrendingUp } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const DrawerSimulation = () => {
  const { raiseDogMeter, nerdMode } = useGame();
  const { playDogGrowl, playClick } = useSoundFX();

  const [totalDrawers, setTotalDrawers] = useState(100);
  const [currentDrawer, setCurrentDrawer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [searchSpeed, setSearchSpeed] = useState(30); // ms per step
  const [found, setFound] = useState(false);
  const [historyRuns, setHistoryRuns] = useState([
    { n: 10, steps: 10 },
    { n: 100, steps: 100 }
  ]);

  const intervalRef = useRef(null);

  // Target item placed at the very last drawer for worst-case demonstration
  const targetDrawer = totalDrawers;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentDrawer(prev => {
          if (prev >= targetDrawer) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setFound(true);
            // Record run in history for graph
            setHistoryRuns(h => {
              if (!h.some(item => item.n === totalDrawers)) {
                return [...h, { n: totalDrawers, steps: totalDrawers }].sort((a, b) => a.n - b.n);
              }
              return h;
            });
            return targetDrawer;
          }
          // Slight dog meter pressure during search
          if (prev % 150 === 0 && prev > 0) {
            raiseDogMeter(8);
            playDogGrowl();
          }
          return prev + 1;
        });
      }, searchSpeed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, searchSpeed, targetDrawer, totalDrawers, raiseDogMeter, playDogGrowl]);

  const handleStart = () => {
    playClick();
    if (found) {
      setCurrentDrawer(0);
      setFound(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    playClick();
    setIsRunning(false);
  };

  const handleReset = () => {
    playClick();
    setIsRunning(false);
    setCurrentDrawer(0);
    setFound(false);
  };

  const handleSelectN = (n) => {
    playClick();
    setIsRunning(false);
    setTotalDrawers(n);
    setCurrentDrawer(0);
    setFound(false);
    // Auto adjust speed so 1000 doesn't take 5 minutes
    if (n === 10) setSearchSpeed(80);
    else if (n === 100) setSearchSpeed(25);
    else if (n === 1000) setSearchSpeed(6);
  };

  // Dog status based on current progress
  const progressPercent = Math.round((currentDrawer / totalDrawers) * 100) || 0;
  let dogStatus = '😴 Dog snoozing gently...';
  let dogEmoji = '🐶💤';
  if (progressPercent > 70) {
    dogStatus = '🐺 DOG EYELIDS FLICKERING OPEN!';
    dogEmoji = '🐶👀';
  } else if (progressPercent > 35) {
    dogStatus = '🐕 Dog shifting and grumbling...';
    dogEmoji = '🐕👂';
  }

  return (
    <div className="drawer-simulation-card glass-card" style={{ padding: '28px', border: '1px solid rgba(255, 46, 147, 0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.25rem' }}>
            Interactive Simulation: Sequential Search
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            {nerdMode 
              ? "Linear Search O(N): Traverses elements sequentially in the worst-case." 
              : "Opening drawers one by one until finding the Golden Coin at the back."}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.3rem' }}>{dogEmoji}</span>
          <div style={{ fontSize: '0.75rem', color: progressPercent > 70 ? 'var(--error)' : 'var(--accent)', fontWeight: 'bold' }}>
            {dogStatus}
          </div>
        </div>
      </div>

      {/* Select N Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Choose Chest Size (N):</span>
        {[10, 100, 1000].map(n => (
          <button
            key={n}
            onClick={() => handleSelectN(n)}
            style={{
              background: totalDrawers === n ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: totalDrawers === n ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: totalDrawers === n ? '0 0 15px rgba(255, 46, 147, 0.5)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {n.toLocaleString()} Drawers
          </button>
        ))}
      </div>

      {/* Active Scan Visualizer */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '1.1rem', fontFamily: 'monospace' }}>
            Checking Drawer: <strong style={{ color: 'var(--secondary)' }}>#{currentDrawer}</strong> of {totalDrawers.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontFamily: 'monospace' }}>
            {progressPercent}% Searched
          </div>
        </div>

        {/* Live scanning progress bar */}
        <div style={{
          height: '14px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '7px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <motion.div 
            style={{
              height: '100%',
              background: found 
                ? 'linear-gradient(90deg, #00FFA3, #00F0FF)' 
                : 'linear-gradient(90deg, var(--primary), var(--secondary))'
            }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: 'linear', duration: 0.05 }}
          />
        </div>

        {/* Visual Mini Drawer Samples */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
          gap: '6px',
          maxHeight: '110px',
          overflow: 'hidden',
          padding: '4px'
        }}>
          {Array.from({ length: Math.min(totalDrawers, 36) }).map((_, idx) => {
            const drawerIndex = Math.floor((idx / Math.min(totalDrawers, 36)) * totalDrawers) + 1;
            const isPassed = currentDrawer >= drawerIndex;
            const isCurrent = currentDrawer === drawerIndex;
            const isTarget = drawerIndex === targetDrawer && found;

            return (
              <div 
                key={idx}
                style={{
                  height: '32px',
                  background: isTarget 
                    ? 'rgba(0, 255, 163, 0.4)' 
                    : isCurrent 
                      ? 'var(--primary)' 
                      : isPassed 
                        ? 'rgba(255, 46, 147, 0.15)' 
                        : 'rgba(255, 255, 255, 0.03)',
                  border: isCurrent 
                    ? '1px solid #fff' 
                    : isPassed 
                      ? '1px solid rgba(255, 46, 147, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  color: isTarget ? '#00FFA3' : isPassed ? '#ffb3d9' : '#555',
                  transition: 'background 0.1s'
                }}
              >
                {isTarget ? '🌟' : drawerIndex}
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '22px' }}>
        {!isRunning ? (
          <button 
            className="web3-button"
            onClick={handleStart}
            style={{
              padding: '10px 20px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Play size={16} /> {found ? 'Search Again' : 'Start Pulling Drawers'}
          </button>
        ) : (
          <button 
            className="web3-button"
            onClick={handlePause}
            style={{
              padding: '10px 20px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FF8C00'
            }}
          >
            <Pause size={16} /> Pause
          </button>
        )}

        <button 
          onClick={handleReset}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem'
          }}
        >
          <RotateCcw size={16} /> Reset
        </button>

        {found && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.95rem' }}
          >
            🎉 Coin Found after {currentDrawer} pulls!
          </motion.span>
        )}
      </div>

      {/* Live O(N) Growth Mini Line Graph */}
      <div style={{
        background: 'rgba(10, 10, 20, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: 'var(--secondary)' }}>
          <TrendingUp size={16} />
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            Live Graph: Drawer Count (N) vs Worst-Case Inspection Time
          </span>
        </div>

        {/* SVG Line Chart */}
        <div style={{ height: '110px', width: '100%', position: 'relative' }}>
          <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="40" y1="10" x2="380" y2="10" stroke="rgba(255,255,255,0.06)" />
            <line x1="40" y1="50" x2="380" y2="50" stroke="rgba(255,255,255,0.06)" />
            <line x1="40" y1="90" x2="380" y2="90" stroke="rgba(255,255,255,0.2)" />
            <line x1="40" y1="10" x2="40" y2="90" stroke="rgba(255,255,255,0.2)" />

            {/* O(N) Linear Slope Line */}
            <motion.path 
              d="M 50 85 L 180 55 L 370 15" 
              fill="none" 
              stroke="var(--primary)" 
              strokeWidth="3"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />

            {/* Data Points */}
            <circle cx="50" cy="85" r="4" fill="var(--secondary)" />
            <text x="50" y="98" fill="#aaa" fontSize="9" textAnchor="middle">N=10</text>

            <circle cx="180" cy="55" r="5" fill="var(--secondary)" />
            <text x="180" y="98" fill="#aaa" fontSize="9" textAnchor="middle">N=100</text>

            <circle cx="370" cy="15" r="6" fill="var(--accent)" />
            <text x="370" y="98" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">N=1,000</text>

            {/* Y Axis Label */}
            <text x="35" y="15" fill="var(--accent)" fontSize="8" textAnchor="end">1,000 pulls</text>
            <text x="35" y="85" fill="#aaa" fontSize="8" textAnchor="end">10 pulls</text>
          </svg>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
          📈 <strong>Notice the straight diagonal line!</strong> As N multiplies by 10, the required checks also multiply by 10. That is <strong style={{ color: 'var(--primary)' }}>O(N) Linear Time</strong>!
        </div>
      </div>
    </div>
  );
};
