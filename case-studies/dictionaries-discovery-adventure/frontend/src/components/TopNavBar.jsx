import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Award, RotateCcw, BookOpen, Compass } from 'lucide-react';
import { DogMeter } from './DogMeter';

import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const TopNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    nerdMode, 
    toggleNerdMode, 
    isMuted, 
    toggleMute, 
    maxPage, 
    resetAllProgress
  } = useGame();
  const { playClick } = useSoundFX();


  // Determine current chapter from URL
  const match = location.pathname.match(/\/story\/(\d+|finale)/);
  const currentChapter = match ? match[1] : '1';

  const chapters = [
    { num: '1', title: 'Sequential Search' },
    { num: '2', title: 'The Hashmap' },
    { num: '3', title: 'Python Syntax' },
    { num: '4', title: 'Execution' },
    { num: '5', title: 'Booby Trap' },
    { num: 'finale', title: 'Heist Exam' }
  ];

  const handleNav = (num) => {
    playClick();
    if (num === 'finale') {
      navigate('/story/finale');
    } else {
      navigate(`/story/${num}`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset this story back to Chapter 1?')) {
      resetAllProgress();
      navigate('/story/1');
    }
  };

  return (
    <>
      <header className="top-navbar-container">
        <div className="navbar-top-row">
          {/* Logo / Title */}
          <div className="brand-badge" onClick={() => navigate('/story/1')} style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '1.6rem' }}>🧰</span>
            <div>
              <div className="brand-title">The Goblin Heist</div>
              <div className="brand-sub">Magic Treasure Chest</div>
            </div>
          </div>

          {/* Persistent Dog Wake Meter */}
          <DogMeter />

          {/* Stats & Controls */}
          <div className="nav-controls-group">
            {/* Mode Switch: Simple vs Nerd Mode */}
            <button 
              className={`mode-toggle-btn ${nerdMode ? 'nerd' : 'simple'}`}
              onClick={() => { playClick(); toggleNerdMode(); }}
              title={nerdMode ? "Nerd Mode: Formal CS terms like hash function, collisions, and buckets" : "Simple Mode: Friendly terms for beginners and kids"}
            >
              {nerdMode ? '🤓 Nerd Mode' : '🧒 Simple Mode'}
            </button>

            {/* Audio Toggle */}
            <button 
              className={`icon-control-btn ${isMuted ? 'muted' : 'active'}`}
              onClick={() => { playClick(); toggleMute(); }}
              title={isMuted ? "Sound is MUTED. Click to turn audio ON." : "Sound is ON. Click to mute."}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} color="var(--success)" />}
            </button>

            {/* Reset Progress Button */}
            <button 
              className="icon-control-btn reset-btn"
              onClick={handleReset}
              title="Reset progress to Chapter 1"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Story Progress Map Trail */}
        <nav className="chapter-map-trail">
          {chapters.map((ch, idx) => {
            const isCurrent = currentChapter === ch.num;
            const isUnlocked = ch.num === 'finale' ? maxPage >= 5 : parseInt(ch.num, 10) <= maxPage;

            return (
              <button
                key={ch.num}
                className={`chapter-step-btn ${isCurrent ? 'current' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
                onClick={() => isUnlocked && handleNav(ch.num)}
                disabled={!isUnlocked}
              >
                <span className="step-number">{ch.num === 'finale' ? '🏆' : `Ch.${ch.num}`}</span>
                <span className="step-title">{ch.title}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Badges modal */}

    </>
  );
};
