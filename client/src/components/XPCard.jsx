import React from 'react';
import { Zap, Flame } from 'lucide-react';
import ProgressBar from './ProgressBar';

/**
 * Displays current XP, level, progress to next level, and streak.
 */
function XPCard({ xp, level, progressToNextLevel, xpIntoLevel, xpForNextLevel, streak }) {
  return (
    <div className="xp-card">
      <div className="xp-card-top">
        <div className="xp-level-badge">
          <Zap size={20} />
          <span>Level {level}</span>
        </div>
        <div className="xp-streak">
          <Flame size={18} />
          <span>{streak?.current || 0} day streak</span>
        </div>
      </div>

      <ProgressBar percent={progressToNextLevel} label={`${xpIntoLevel} / ${xpForNextLevel} XP to next level`} />

      <p className="xp-total">{xp} total XP earned</p>
    </div>
  );
}

export default XPCard;
