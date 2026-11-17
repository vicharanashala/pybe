import React, { useState, useEffect } from 'react';
import { Cpu, Database, FolderTree, Box, Activity, Scissors, Zap, Trash2, Lock, Trophy, Menu } from 'lucide-react';
import './App.css';

import Level1 from './levels/Level1';
import Level2 from './levels/Level2';
import Level3 from './levels/Level3';
import Level4 from './levels/Level4';
import Level5 from './levels/Level5';
import { playCrash } from './utils/audio';

// The Memory Crash Overlay - ONLY dismisses on button click
const CrashScreen = ({ level = 1, onRestart }) => {
  const levelConfigs = {
    1: {
      capacity: '100 GB',
      original: '20 GB (Noticeboard)',
      whatHappened: 'Made 4 full duplicate copies in a loop',
      result: '20 GB (Original) + 80 GB (4 Copies) = 100 GB (RAM Full!)',
      heavyLine: 'copy.deepcopy(announcement)',
      solution: (
        <>
          Instead of making a heavy separate photocopy for every student, keep <strong>one single noticeboard</strong> on the wall! In Python, write <code style={{ background: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>student = announcement</code> so all students reference the same data with zero extra RAM.
        </>
      ),
      buttonText: 'Try the Smart Way (Shared Noticeboard)'
    },
    2: {
      capacity: '100 MB',
      original: '20 MB (Canteen Database)',
      whatHappened: 'Created duplicate dictionary copies on each recharge',
      result: '20 MB (System) + 80 MB (4 Copies) = 100 MB (RAM Full!)',
      heavyLine: 'wallet.copy()',
      solution: (
        <>
          Instead of copying the entire wallet on every recharge, update Rahul's balance <strong>directly in-place</strong>! In Python, write <code style={{ background: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>wallet["balance"] += 20</code> to reuse the existing memory box without allocating copies.
        </>
      ),
      buttonText: 'Try In-Place Update (No Duplicates)'
    },
    3: {
      capacity: '100 MB',
      original: '35 MB (Order Tray)',
      whatHappened: 'Each recursive call sliced a new list copy into RAM without a base return guard',
      result: 'Compounding slice copies exhausted RAM & Call Stack Depth limit!',
      heavyLine: 'cancel_orders(items[1:])',
      solution: (
        <>
          Instead of slicing new list copies, pop elements directly from the <strong>single shared tray</strong> using <code style={{ background: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>items.pop()</code> and always add a return guard when the tray is empty!
        </>
      ),
      buttonText: 'Try In-Place Recursion (Shared Tray)'
    },
    4: {
      capacity: '100 GB',
      original: '15 GB (Base Sessions)',
      whatHappened: 'Departed students remained trapped in the global list, preventing memory reclamation',
      result: '15 GB (Base) + 85 GB (Ghost Sessions) = 100 GB (Memory Leak!)',
      heavyLine: 'sessions.append(student) # never removed',
      solution: (
        <>
          When an attendee leaves, remove their reference from the list using <code style={{ background: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>sessions.remove(student)</code> so Python's Garbage Collector can immediately reclaim their RAM!
        </>
      ),
      buttonText: 'Try Safe Cleanup (Run Garbage Collector)'
    }
  };

  const config = levelConfigs[level] || levelConfigs[1];

  return (
    <div className="crash-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="crash-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#fbeae7',
            border: '1px solid #f4cbc4',
            color: '#c25b4a',
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '999px',
            letterSpacing: '0.4px',
            textTransform: 'uppercase'
          }}>
            ⚠️ Memory Full (100% Used)
          </span>
          <span style={{ fontSize: '0.78rem', color: '#8c5914', background: '#fdf3e2', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>
            Total RAM Space: {config.capacity}
          </span>
        </div>

        <div>
          <h1 style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: '1.7rem',
            color: '#2b2b2b',
            margin: '0 0 6px 0',
            fontWeight: 700
          }}>
            Oops! The Computer Ran Out of Space
          </h1>
          <p style={{ margin: 0, color: '#5b5648', fontSize: '0.92rem', lineHeight: '1.5' }}>
            When a program tries to store more data than the computer has room for, it has to stop to protect itself.
          </p>
        </div>

        {/* Diagnostic Breakdown in Warm Light Theme */}
        <div style={{
          background: '#faf6ee',
          border: '1.5px solid #e4dcc8',
          borderRadius: '14px',
          padding: '16px 18px',
          fontFamily: '"SFMono-Regular", Consolas, "JetBrains Mono", monospace',
          fontSize: '0.84rem',
          lineHeight: '1.7',
          color: '#2b2b2b',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            color: '#c25b4a',
            fontWeight: 800,
            fontSize: '0.88rem',
            borderBottom: '1.5px dashed #e4dcc8',
            paddingBottom: '8px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>🔍</span> What Just Happened?
          </div>
          <div><span style={{ color: '#8c5914', fontWeight: 600 }}>• Baseline / System  :</span> <strong style={{ color: '#2f6564' }}>{config.original}</strong></div>
          <div><span style={{ color: '#8c5914', fontWeight: 600 }}>• Total Capacity     :</span> <strong style={{ color: '#2b2b2b' }}>{config.capacity}</strong></div>
          <div><span style={{ color: '#8c5914', fontWeight: 600 }}>• What the Code Did  :</span> {config.whatHappened}</div>
          <div><span style={{ color: '#8c5914', fontWeight: 600 }}>• Result in Memory   :</span> <strong style={{ color: '#c25b4a' }}>{config.result}</strong></div>
          <div><span style={{ color: '#8c5914', fontWeight: 600 }}>• Heavy Code Line    :</span> <code style={{ color: '#c25b4a', background: '#fbeae7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #f4cbc4' }}>{config.heavyLine}</code></div>
        </div>

        {/* Thematic Takeaway Box */}
        <div style={{
          background: '#fdf3e2',
          borderLeft: '4px solid #e8a33d',
          border: '1px solid #f4debe',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '0.86rem',
          color: '#8c5914',
          lineHeight: '1.5'
        }}>
          <strong>💡 Easy Solution for Beginners:</strong> {config.solution}
        </div>

        {/* Action Button: The ONLY way to dismiss the error screen */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px' }}>
          <button
            onClick={onRestart}
            style={{
              background: 'linear-gradient(135deg, #e67635 0%, #cf5717 100%)',
              border: 'none',
              color: '#ffffff',
              padding: '13px 34px',
              borderRadius: '999px',
              fontFamily: '"Nunito Sans", sans-serif',
              fontWeight: 700,
              fontSize: '0.96rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(230, 118, 53, 0.4)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 118, 53, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(230, 118, 53, 0.4)';
            }}
          >
            <span>🔄</span> {config.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

// The Welcome / Starting Screen
const WelcomeScreen = ({ onStart }) => (
  <div className="welcome-screen-container" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: '1380px',
    margin: '0 auto',
    width: '100%',
    padding: '24px 20px 48px',
    fontFamily: '"Nunito Sans", sans-serif'
  }}>
    {/* Top Header */}
    <div style={{
      width: '100%',
      textAlign: 'left',
      marginBottom: '44px',
      borderBottom: '1px solid #e4dcc8',
      paddingBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
        <h1 style={{
          fontSize: '3.1rem',
          margin: 0,
          color: '#3b2012',
          fontFamily: '"Fraunces", Georgia, serif',
          fontWeight: 700,
          letterSpacing: '-0.5px'
        }}>
          PyBE: Machine Constraints
        </h1>
        <span style={{
          background: 'linear-gradient(135deg, rgba(255, 188, 87, 0.22), rgba(250, 153, 79, 0.22))',
          border: '1.5px solid #FA994F',
          color: '#c44d18',
          fontSize: '0.85rem',
          padding: '5px 16px',
          borderRadius: '999px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          Interactive Lab
        </span>
      </div>
      <p style={{ margin: 0, color: '#634b3f', fontSize: '1.2rem', lineHeight: '1.6' }}>
        Programming is not just math. Your code occupies physical space in RAM.
      </p>
    </div>

    {/* Two-Column Widespread Layout */}
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '50px',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexWrap: 'wrap'
    }}>
      {/* Left: Physical RAM Hardware Image (No glow aura) */}
      <div style={{ flex: '1', minWidth: '380px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1.5px solid rgba(246, 159, 92, 0.35)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.07)',
          background: '#fffdfa',
          width: '100%',
          maxWidth: '620px',
          height: '420px'
        }}>
          <img
            src="/ram_storage_hero.svg"
            alt="Physical RAM & Memory Architecture"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            background: 'rgba(255, 253, 249, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(246, 159, 92, 0.35)',
            borderRadius: '12px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.88rem',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c4a2d', fontWeight: 700 }}>
              <span style={{ color: '#FA994F' }}>⚡</span>
              <span>Physical RAM & System Bus</span>
            </div>
            <span style={{
              color: '#3a7d7c',
              fontSize: '0.82rem',
              background: 'rgba(58, 125, 124, 0.12)',
              border: '1px solid rgba(58, 125, 124, 0.25)',
              padding: '4px 12px',
              borderRadius: '999px',
              fontWeight: 800
            }}>
              32 GB 8200 MHz
            </span>
          </div>
        </div>
      </div>

      {/* Right: Overview & Modules */}
      <div style={{ flex: '1.1', minWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left' }}>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '28px', color: '#3b2518' }}>
          In this interactive learning experience, you will discover what happens when you write inefficient code, and learn how to optimize memory usage through visual simulations.
        </p>

        {/* Topics Upper Heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ color: '#FA994F', fontSize: '1.2rem' }}>📌</span>
          <h3 style={{
            fontSize: '1rem',
            color: '#c44d18',
            fontFamily: '"Fraunces", Georgia, serif',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 800,
            margin: 0
          }}>
            Study Topics & Modules
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '36px', width: '100%' }}>
          <div style={{
            flex: '1',
            minWidth: '220px',
            background: '#fffdfa',
            border: '1.5px solid rgba(246, 159, 92, 0.3)',
            borderLeft: '5px solid #FA994F',
            borderRadius: '16px',
            padding: '18px 22px',
            boxShadow: '0 4px 16px rgba(246, 159, 92, 0.08)'
          }}>
            <h4 style={{ color: '#c44d18', margin: '0 0 6px 0', fontSize: '1.05rem', fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 }}>
              Level 1 & 2
            </h4>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#634b3f', fontWeight: 500 }}>
              Pointers & Mutability
            </p>
          </div>
          <div style={{
            flex: '1',
            minWidth: '220px',
            background: '#fffdfa',
            border: '1.5px solid rgba(58, 125, 124, 0.3)',
            borderLeft: '5px solid #3a7d7c',
            borderRadius: '16px',
            padding: '18px 22px',
            boxShadow: '0 4px 16px rgba(58, 125, 124, 0.08)'
          }}>
            <h4 style={{ color: '#3a7d7c', margin: '0 0 6px 0', fontSize: '1.05rem', fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700 }}>
              Level 3 & 4
            </h4>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#634b3f', fontWeight: 500 }}>
              Recursion & Garbage Collection
            </p>
          </div>
        </div>

        <button
          className="btn primary welcome-start-btn"
          style={{
            fontSize: '1.25rem',
            padding: '15px 44px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #FA994F 0%, #EB8975 100%)',
            color: '#ffffff',
            fontWeight: 800,
            border: 'none',
            boxShadow: '0 8px 24px rgba(235, 137, 117, 0.4)',
            fontFamily: '"Nunito Sans", sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onClick={onStart}
        >
          <span>Start Learning</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  </div>
);

// The Global RAM Bar
const RamBar = ({ usage }) => (
  <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Cpu size={20} color="#3b82f6" />
        <span style={{ fontWeight: 600 }}>System RAM Allocation</span>
      </div>
      <span style={{ color: usage > 80 ? 'var(--danger)' : usage > 50 ? '#eab308' : 'var(--success)', fontWeight: 'bold' }}>
        {usage.toFixed(0)}%
      </span>
    </div>
    <div className={`ram-bar-container ${usage > 80 ? 'ram-bar-danger' : ''}`}>
      <div className="ram-bar-fill" style={{ width: `${usage}%` }}></div>
    </div>
  </div>
);

// Main App Component
function App() {
  const [crashed, setCrashed] = useState(false);
  const [activeLevel, setActiveLevel] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([1, 2, 3, 4, 5]); // All levels unlocked
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (crashed) {
      playCrash();
      setShake(true);
      const t = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(t);
    }
  }, [crashed]);

  // When opening a level, collapse sidebar to keep screen minimal as requested
  useEffect(() => {
    if (activeLevel > 0) {
      setSidebarCollapsed(true);
    }
  }, [activeLevel]);

  const triggerCrash = () => setCrashed(true);
  const handleRestart = () => setCrashed(false);

  const handlePassLevel = (levelId) => {
    if (!unlockedLevels.includes(levelId + 1)) {
      setUnlockedLevels([...unlockedLevels, levelId + 1]);
    }
    // Optionally auto-advance after a short delay
    setTimeout(() => setActiveLevel(levelId + 1), 2000);
  };

  const navItemClass = (id) => {
    if (activeLevel === id) return "nav-item active";
    return "nav-item";
  };

  const navigateTo = (id) => {
    setActiveLevel(id);
    setCrashed(false);
  };

  return (
    <div className={`app-container light-theme-global ${shake ? 'crash-shake' : ''}`}>
      {crashed && <CrashScreen level={activeLevel} onRestart={handleRestart} />}

      {/* File Explorer Sidebar with three-line toggle */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2><FolderTree size={20} /> Memory Modules</h2>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(true)}
            title="Hide Memory Modules"
            aria-label="Hide Memory Modules"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              color: '#7c4a2d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <Menu size={19} />
          </button>
        </div>

        <div className={navItemClass(0)} onClick={() => navigateTo(0)}>
          <FolderTree size={18} /> Overview & Intro
        </div>

        <div className={navItemClass(1)} onClick={() => navigateTo(1)}>
          <Box size={18} /> 1. Variables as References
        </div>

        <div className={navItemClass(2) + (!unlockedLevels.includes(2) ? " locked" : "")} onClick={() => unlockedLevels.includes(2) && navigateTo(2)}>
          {!unlockedLevels.includes(2) ? <Lock size={18} /> : <Activity size={18} />} 2. Mutable Objects
        </div>

        <div className={navItemClass(3) + (!unlockedLevels.includes(3) ? " locked" : "")} onClick={() => unlockedLevels.includes(3) && navigateTo(3)}>
          {!unlockedLevels.includes(3) ? <Lock size={18} /> : <Zap size={18} />} 3. Recursion Memory
        </div>

        <div className={navItemClass(4) + (!unlockedLevels.includes(4) ? " locked" : "")} onClick={() => unlockedLevels.includes(4) && navigateTo(4)}>
          {!unlockedLevels.includes(4) ? <Lock size={18} /> : <Trash2 size={18} />} 4. Garbage Collection
        </div>

        <div className={navItemClass(5) + (!unlockedLevels.includes(5) ? " locked" : "")} onClick={() => unlockedLevels.includes(5) && navigateTo(5)}>
          {!unlockedLevels.includes(5) ? <Lock size={18} /> : <Trophy size={18} />} 5. Final Exam
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ position: 'relative' }}>
        {/* Floating toggle button when sidebar is collapsed */}
        {sidebarCollapsed && (
          <button
            className="floating-sidebar-toggle"
            onClick={() => setSidebarCollapsed(false)}
            title="Show Memory Modules"
            aria-label="Show Memory Modules"
            style={{
              position: 'fixed',
              top: '16px',
              left: '16px',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#fffdfa',
              border: '1.5px solid rgba(246, 159, 92, 0.45)',
              borderRadius: '999px',
              padding: '7px 16px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              color: '#7c4a2d',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: '"Nunito Sans", sans-serif'
            }}
          >
            <Menu size={18} />
            <span>Modules</span>
          </button>
        )}

        {activeLevel === 0 && <WelcomeScreen onStart={() => setActiveLevel(1)} />}
        {activeLevel === 1 && <Level1 onCrash={triggerCrash} onPass={() => handlePassLevel(1)} RamBar={RamBar} />}
        {activeLevel === 2 && <Level2 onCrash={triggerCrash} onPass={() => handlePassLevel(2)} RamBar={RamBar} />}
        {activeLevel === 3 && <Level3 onCrash={triggerCrash} onPass={() => handlePassLevel(3)} RamBar={RamBar} />}
        {activeLevel === 4 && <Level4 onCrash={triggerCrash} onPass={() => handlePassLevel(4)} RamBar={RamBar} />}
        {activeLevel === 5 && <Level5 />}
      </div>
    </div>
  );
}

export default App;
