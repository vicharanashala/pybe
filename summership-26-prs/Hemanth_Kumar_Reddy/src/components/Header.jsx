import React from 'react';
import { BookOpen, Trophy } from 'lucide-react';

export default function Header({ currentSlide, onOpenMenu }) {
  const isMenuDisabled = currentSlide === 0;

  return (
    <header>
      <div className="logo-area">
        <div className="logo-icon">🏰</div>
        <div className="logo-title">PyBe: Treasure Kingdom</div>
      </div>

      <div className="user-stats">
        <div className="stat-badge level-badge" title="Current Level">
          <Trophy size={16} color="var(--duo-blue)" /> Explorer
        </div>

        <button
          id="toc-open-btn"
          className="icon-btn"
          disabled={isMenuDisabled}
          onClick={onOpenMenu}
          title={isMenuDisabled ? 'Move forward to Page 2 to unlock Menu' : 'Open Adventure Map Menu'}
        >
          <BookOpen size={16} color="var(--duo-gold)" /> Menu
        </button>
      </div>
    </header>
  );
}
