import React, { useMemo } from 'react';
import { BookOpen, Sparkles, X } from 'lucide-react';
import { computeLedger } from '../lib/ledger';
import { loadProgress } from '../lib/progress';

// The Learner's Ledger (case notebook).
// Displays the concept(s) picked up in each completed case file.
// Purely derived from completed case files — cannot drift out of sync with progress.

export default function LedgerDrawer({
  open,
  onClose,
  onReset,
  completedParts,
  completedAt,
  scenarios = []
}) {
  const activeCompleted = Array.isArray(completedParts)
    ? completedParts
    : loadProgress().completedParts || [];

  const activeTimestamps = completedAt || loadProgress().completedAt || {};

  const entries = useMemo(
    () => computeLedger(activeCompleted, scenarios, { timestamps: activeTimestamps }),
    [activeCompleted, scenarios, activeTimestamps]
  );

  const totalFiles = scenarios.length || 6;
  const latestEntryId = entries.length ? entries[entries.length - 1].id : null;

  if (!open) return null;

  return (
    <div className="ledger-scrim" onClick={onClose} role="presentation">
      <aside
        className="ledger"
        role="dialog"
        aria-label="Learner ledger"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ledger-head">
          <div className="ledger-title-wrap">
            <BookOpen size={18} className="ledger-brand-icon" />
            <h3>The Learner's Ledger</h3>
          </div>
          <button type="button" className="bar-btn" onClick={onClose}>
            <X size={16} /> Close
          </button>
        </header>

        <div className="ledger-announcer" aria-live="polite" role="status">
          {entries.length
            ? `${entries.length} case ${entries.length === 1 ? 'note' : 'notes'} recorded in your ledger.`
            : 'Nothing logged yet tonight.'}
        </div>

        <section>
          <h4>Case notes</h4>
          <div className="ledger-stats">
            <span>
              <strong>{totalFiles}</strong> case files
            </span>
            <span>
              <strong>{entries.length === 0 ? 'No' : entries.length}</strong>{' '}
              {entries.length === 1 ? 'note saved' : 'notes saved'}
            </span>
          </div>
        </section>

        <section>
          <h4>Completed file notes</h4>
          {entries.length > 0 ? (
            <ul className="ledger-log" aria-label="Learned case file concepts">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className={`ledger-entry ${entry.id === latestEntryId ? 'ledger-entry-highlight' : ''}`}
                >
                  <div className="ledger-entry-header">
                    <strong className="ledger-entry-title">{entry.title}</strong>
                    <span className="ledger-entry-time">{entry.formattedTime}</span>
                  </div>
                  <div className="ledger-entry-concept">
                    <span className="ledger-concept-badge">{entry.conceptName}</span>
                  </div>
                  <p className="ledger-entry-explanation">{entry.explanation}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ledger-empty">Nothing logged yet tonight.</p>
          )}
        </section>

        {onReset && (
          <footer className="ledger-footer">
            <small>Progress lives only in this browser — nothing syncs to any server.</small>
            <button
              type="button"
              className="ghost danger"
              onClick={() => {
                if (window.confirm('Burn your trail? All local progress will be lost.')) onReset();
              }}
            >
              Burn my trail (reset progress)
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
