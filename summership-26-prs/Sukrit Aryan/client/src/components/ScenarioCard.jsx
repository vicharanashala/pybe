import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

const DIFFICULTY_BADGE = {
  Beginner: 'badge-beginner',
  Explorer: 'badge-explorer',
  Builder:  'badge-builder',
};

const THEME_COLORS = {
  'chai-stall':    'var(--chai-color)',
  'isro':          'var(--isro-color)',
  'instagram':     'var(--insta-color)',
  'food-delivery': 'var(--food-color)',
  'ai-playlist':   'var(--playlist-color)',
  'kota':          'var(--kota-color)',
  'classic':       'var(--text-muted)',
};

const THEME_EMOJIS = {
  'chai-stall':    '🍵',
  'isro':          '🚀',
  'instagram':     '📸',
  'food-delivery': '🍕',
  'ai-playlist':   '🎵',
  'kota':          '📚',
  'classic':       '⚡',
};

export default function ScenarioCard({ scenario, onClick, compact = false }) {
  const navigate = useNavigate();
  const themeColor = THEME_COLORS[scenario.theme] || 'var(--text-muted)';
  const themeEmoji = THEME_EMOJIS[scenario.theme] || '⚡';
  const badgeClass  = DIFFICULTY_BADGE[scenario.difficulty] || 'badge-beginner';

  const handleClick = () => {
    if (onClick) onClick(scenario);
    else navigate(`/learn/${scenario._id}`);
  };

  if (compact) {
    return (
      <button
        className="scenario-card-compact hover-lift"
        onClick={handleClick}
        style={{ '--theme-color': themeColor }}
      >
        <div className="scenario-card-compact__accent" />
        <div className="scenario-card-compact__body">
          <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
            <span className={`badge ${badgeClass}`}>{scenario.difficulty}</span>
            {scenario.theme !== 'classic' && (
              <span className="scenario-card-compact__theme">{themeEmoji}</span>
            )}
          </div>
          <strong className="scenario-card-compact__title">{scenario.title}</strong>
          <div className="scenario-card-compact__concepts">
            {scenario.concepts.slice(0, 3).map(c => (
              <span key={c} className="scenario-card-compact__tag">{c}</span>
            ))}
          </div>
        </div>
        <ChevronRight size={16} className="scenario-card-compact__arrow" />
      </button>
    );
  }

  return (
    <button
      className="scenario-card card hover-lift hover-glow"
      onClick={handleClick}
      style={{ '--theme-color': themeColor }}
    >
      {/* Theme stripe */}
      <div className="scenario-card__stripe" />

      <div className="scenario-card__header">
        <div className="flex items-center gap-2">
          <span className={`badge ${badgeClass}`}>{scenario.difficulty}</span>
          {scenario.theme !== 'classic' && (
            <span className="scenario-card__theme-pill" style={{ color: themeColor }}>
              {themeEmoji} {scenario.caseStudyId?.replace('cs-', '').replace(/-/g, ' ')}
            </span>
          )}
        </div>
        {scenario.themeStep && (
          <span className="scenario-card__step">Step {scenario.themeStep}</span>
        )}
      </div>

      <h3 className="scenario-card__title">{scenario.title}</h3>
      <p className="scenario-card__context">{scenario.context}</p>

      <div className="scenario-card__footer">
        <div className="scenario-card__concepts">
          {scenario.concepts.map(c => (
            <span key={c} className="scenario-card__tag">{c}</span>
          ))}
        </div>
        <span className="scenario-card__cta">
          Explore <ArrowRight size={14} />
        </span>
      </div>

      <style>{`
        .scenario-card {
          text-align: left;
          cursor: pointer;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--border);
          background: var(--bg-glass);
          position: relative;
        }
        .scenario-card__stripe {
          height: 3px;
          background: var(--theme-color, var(--accent));
          opacity: 0.7;
        }
        .scenario-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--sp-4) var(--sp-4) 0;
          gap: var(--sp-2);
        }
        .scenario-card__theme-pill {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .scenario-card__step {
          font-size: 0.68rem;
          color: var(--text-muted);
          background: var(--bg-elevated);
          padding: 2px 8px;
          border-radius: var(--r-full);
          border: 1px solid var(--border);
        }
        .scenario-card__title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
          padding: var(--sp-3) var(--sp-4) 0;
        }
        .scenario-card__context {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.55;
          padding: var(--sp-2) var(--sp-4);
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scenario-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--sp-3) var(--sp-4) var(--sp-4);
          border-top: 1px solid var(--border);
          margin-top: var(--sp-3);
          gap: var(--sp-2);
        }
        .scenario-card__concepts { display: flex; flex-wrap: wrap; gap: 4px; flex: 1; }
        .scenario-card__tag {
          font-size: 0.7rem;
          color: var(--text-muted);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 2px 8px;
          border-radius: var(--r-full);
        }
        .scenario-card__cta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent);
          white-space: nowrap;
          flex-shrink: 0;
        }
        /* Compact variant */
        .scenario-card-compact {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: var(--sp-3) var(--sp-4);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          cursor: pointer;
          text-align: left;
          width: 100%;
          overflow: hidden;
          position: relative;
          transition: all 0.2s ease;
        }
        .scenario-card-compact:hover { border-color: var(--border-hover); }
        .scenario-card-compact__accent {
          width: 3px;
          height: 100%;
          background: var(--theme-color);
          border-radius: 2px;
          flex-shrink: 0;
          opacity: 0.7;
        }
        .scenario-card-compact__body { flex: 1; min-width: 0; }
        .scenario-card-compact__title {
          display: block;
          font-size: 0.9rem;
          color: var(--text-primary);
          line-height: 1.3;
          margin-bottom: var(--sp-1);
        }
        .scenario-card-compact__theme { font-size: 0.9rem; }
        .scenario-card-compact__concepts { display: flex; flex-wrap: wrap; gap: 4px; }
        .scenario-card-compact__tag {
          font-size: 0.68rem;
          color: var(--text-muted);
          background: var(--bg-glass);
          border: 1px solid var(--border);
          padding: 1px 6px;
          border-radius: var(--r-full);
        }
        .scenario-card-compact__arrow { color: var(--text-muted); flex-shrink: 0; }
      `}</style>
    </button>
  );
}
