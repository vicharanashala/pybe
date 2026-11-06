import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const GameContext = createContext(null);

export const BADGES_DATA = {
  slow_poke: {
    id: 'slow_poke',
    title: 'Patient Thief',
    chapter: 1,
    icon: '🐢',
    desc: 'Survives sequential search through 1,000 drawers without getting eaten!'
  },
  hash_wizard: {
    id: 'hash_wizard',
    title: 'Hash Wizard',
    chapter: 2,
    icon: '⚡',
    desc: 'Mastered O(1) instant key-to-value sticker teleportation!'
  },
  spellcaster: {
    id: 'spellcaster',
    title: 'Spellcaster',
    chapter: 3,
    icon: '📜',
    desc: 'Wrote flawless Python dictionary curly bracket enchantments!'
  },
  master_thief: {
    id: 'master_thief',
    title: 'Master Thief',
    chapter: 4,
    icon: '🗝️',
    desc: 'Popped the Wizard\'s magic chest live with zero hesitation!'
  },
  trap_dodger: {
    id: 'trap_dodger',
    title: 'Trap Dodger',
    chapter: 5,
    icon: '🛡️',
    desc: 'Disarmed the deadly KeyError booby trap using .get()!'
  },
  curious_cat: {
    id: 'curious_cat',
    title: 'Curious Cat',
    chapter: 2,
    icon: '🐱',
    desc: 'Fed 5 custom words into the Hash Visualizer to see the math magic!'
  }
};

export const GameProvider = ({ children }) => {
  // Dog Wake Meter: 0 to 100%
  const [dogMeter, setDogMeter] = useState(() => {
    const saved = localStorage.getItem('goblin_dog_meter');
    return saved !== null ? Math.min(100, Math.max(0, parseInt(saved, 10))) : 10;
  });

  // XP Points
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('goblin_xp');
    return saved !== null ? parseInt(saved, 10) : 50; // Start with 50 XP
  });

  // Badges Earned
  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('goblin_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Mode: Simple vs Nerd Mode
  const [nerdMode, setNerdMode] = useState(() => {
    return localStorage.getItem('goblin_nerd_mode') === 'true';
  });

  // Sound Muted (default true as requested)
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('goblin_muted');
    return saved !== null ? saved === 'true' : true;
  });

  // Max unlocked story page (1-5, 6 is finale)
  const [maxPage, setMaxPage] = useState(() => {
    const saved = localStorage.getItem('goblin_max_page');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Most recent badge toast
  const [newBadgeToast, setNewBadgeToast] = useState(null);

  // Custom visualizer words tested tracker
  const [visualizerWordsTested, setVisualizerWordsTested] = useState(() => {
    try {
      const saved = localStorage.getItem('goblin_vis_words');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('goblin_dog_meter', dogMeter.toString());
  }, [dogMeter]);

  useEffect(() => {
    localStorage.setItem('goblin_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('goblin_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem('goblin_nerd_mode', nerdMode.toString());
  }, [nerdMode]);

  useEffect(() => {
    localStorage.setItem('goblin_muted', isMuted.toString());
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('goblin_max_page', maxPage.toString());
  }, [maxPage]);

  useEffect(() => {
    localStorage.setItem('goblin_vis_words', JSON.stringify(visualizerWordsTested));
  }, [visualizerWordsTested]);

  // Raise dog wake meter
  const raiseDogMeter = (amount = 25) => {
    setDogMeter(prev => Math.min(100, Math.max(0, prev + amount)));
  };

  // Lower dog wake meter
  const lowerDogMeter = (amount = 15) => {
    setDogMeter(prev => Math.max(0, prev - amount));
  };

  // Reset dog meter after "Busted!"
  const resetDogMeter = () => {
    setDogMeter(15);
  };

  // Add XP
  const addXP = (amount) => {
    setXp(prev => prev + amount);
  };

  // Spend XP (e.g. For hints)
  const spendXP = (amount) => {
    setXp(prev => Math.max(0, prev - amount));
  };

  // Unlock badge
  const unlockBadge = (badgeId) => {
    if (!unlockedBadges.includes(badgeId) && BADGES_DATA[badgeId]) {
      setUnlockedBadges(prev => [...prev, badgeId]);
      setNewBadgeToast(BADGES_DATA[badgeId]);
      addXP(50); // +50 XP bonus for earning a badge!
      triggerConfetti();
    }
  };

  // Track words for Curious Cat badge
  const registerVisualizerWord = (word) => {
    const clean = (word || '').toLowerCase().trim();
    if (clean && !visualizerWordsTested.includes(clean)) {
      const updated = [...visualizerWordsTested, clean];
      setVisualizerWordsTested(updated);
      if (updated.length >= 5 && !unlockedBadges.includes('curious_cat')) {
        unlockBadge('curious_cat');
      }
    }
  };

  // Confetti trigger
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Unlock next story chapter
  const unlockNextPage = (currentPage) => {
    setMaxPage(prev => Math.max(prev, currentPage + 1));
  };

  // Reset all game data
  const resetAllProgress = () => {
    localStorage.removeItem('goblin_dog_meter');
    localStorage.removeItem('goblin_xp');
    localStorage.removeItem('goblin_badges');
    localStorage.removeItem('goblin_nerd_mode');
    localStorage.removeItem('goblin_max_page');
    localStorage.removeItem('goblin_vis_words');
    setDogMeter(10);
    setXp(50);
    setUnlockedBadges([]);
    setMaxPage(1);
    setVisualizerWordsTested([]);
  };

  const isBusted = dogMeter >= 100;

  return (
    <GameContext.Provider
      value={{
        dogMeter,
        raiseDogMeter,
        lowerDogMeter,
        resetDogMeter,
        isBusted,
        xp,
        addXP,
        spendXP,
        unlockedBadges,
        unlockBadge,
        newBadgeToast,
        setNewBadgeToast,
        nerdMode,
        setNerdMode,
        toggleNerdMode: () => setNerdMode(prev => !prev),
        isMuted,
        toggleMute: () => setIsMuted(prev => !prev),
        maxPage,
        unlockNextPage,
        triggerConfetti,
        registerVisualizerWord,
        visualizerWordsTested,
        resetAllProgress,
        BADGES_DATA
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
