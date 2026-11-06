import React, { useState } from 'react';
import { KeyholeMark, WaxSeal } from './Motifs';

// Left zone: the case archive. The only case PyBe tracks is the chained
// story (Rosewood Manor); its parts are listed here. Parts are freely
// navigable — a learner may always return to an earlier part.
// States: sealed (done), current, upcoming (dimmed keyhole, still openable).
// Completed files with code show a small </> icon to reopen that file's reveal.

export default function Sidebar({
  stories,
  activeCaseId,
  activePartId,
  completedParts,
  onSelectPart,
  onViewCode
}) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();

  const storyMatches = (story) => (
    !needle
    || story.title.toLowerCase().includes(needle)
    || story.parts.some((part) => (
      (part.title || '').toLowerCase().includes(needle)
          || (part.partLabel || '').toLowerCase().includes(needle)
    ))
  );

  const visibleStories = stories.filter(storyMatches);

  return (
    <aside className="sidebar">
      <label className="archive-search">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search case files…"
          aria-label="Search case files"
        />
      </label>

      <div className="archive">
        {visibleStories.map((story) => {
          const sealed = story.parts.filter((part) => completedParts.includes(part._id)).length;
          return (
            <section className={story.id === activeCaseId ? 'case-folder open' : 'case-folder'} key={story.id}>
              <header className="case-folder-head">
                <h3>{story.title}</h3>
                <span>{sealed} / {story.parts.length} sealed</span>
              </header>
              <ul className="part-list">
                {story.parts.map((part) => {
                  const isCompleted = completedParts.includes(part._id);
                  const state = isCompleted
                    ? 'sealed'
                    : part._id === activePartId ? 'current' : 'upcoming';

                  // Only files with code (parts 1-4) that are completed get the </> button
                  const hasCode = Boolean(part.idealSolution && part.order > 0 && part.nextScenarioId != null);
                  const canViewCode = isCompleted && hasCode;

                  return (
                    <li key={part._id} className="part-list-item">
                      <button
                        type="button"
                        className={`part-item ${state} ${part._id === activePartId ? 'active' : ''}`}
                        onClick={() => onSelectPart(part)}
                      >
                        {state === 'upcoming'
                          ? <KeyholeMark />
                          : <WaxSeal state={state} label="" size={20} />}
                        <span className="part-name">{part.partLabel || part.title}</span>
                      </button>
                      {canViewCode && (
                        <button
                          type="button"
                          className="sidebar-code-icon-btn"
                          title={`Reopen code for ${part.partLabel || part.title}`}
                          aria-label={`Reopen code for ${part.partLabel || part.title}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCode?.(part);
                          }}
                        >
                          <span className="code-glyph" aria-hidden="true">&lt;/&gt;</span>
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        {visibleStories.length === 0 && (
          <p className="archive-empty">No case matches that search.</p>
        )}
      </div>
    </aside>
  );
}
