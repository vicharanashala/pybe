import React from 'react';
import { BookOpenText, Moon, Sun } from 'lucide-react';
import { MagnifierBrand, WaxSeal } from './Motifs';

// Top zone: the case trail. Progress reads as case files sealing shut —
// a wax seal per part — rather than a generic progress bar.

export default function TopBar({ storyParts, completedParts, activePartId, onJumpToPart, onOpenLedger, theme, onToggleTheme }) {
  const sealed = storyParts.filter((part) => completedParts.includes(part._id)).length;
  const total = storyParts.length;

  return (
    <header className="top-bar">
      <div className="top-brand">
        <MagnifierBrand size={30} />
        <div className="top-wordmark">
          <strong>PyBe</strong>
          <span>case files</span>
        </div>
      </div>

      {total > 0 && (
        <nav className="case-trail" aria-label="Case progress">
          <span className="trail-label">Rosewood Manor</span>
          <ol className="trail-seals">
            {storyParts.map((part) => {
              const state = completedParts.includes(part._id)
                ? 'sealed'
                : part._id === activePartId ? 'current' : 'upcoming';
              return (
                <li key={part._id}>
                  <button
                    type="button"
                    className="trail-seal-btn"
                    onClick={() => onJumpToPart(part)}
                    title={part.partLabel || part.title}
                  >
                    <WaxSeal state={state} label={part.partLabel || part.title} />
                  </button>
                </li>
              );
            })}
          </ol>
          <span className="trail-count">{sealed} of {total} sealed</span>
        </nav>
      )}

      <div className="top-actions">
        <button type="button" className="bar-btn icon-btn" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button type="button" className="bar-btn" onClick={onOpenLedger}>
          <BookOpenText size={16} />
          Ledger
        </button>
      </div>
    </header>
  );
}
