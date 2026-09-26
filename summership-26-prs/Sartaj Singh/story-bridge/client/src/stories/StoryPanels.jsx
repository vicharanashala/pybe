import React, { useEffect, useRef, useState } from 'react';

/**
 * The narrative stage. Text and image only — no Python vocabulary appears
 * anywhere on this screen, by design. The learner reasons about the story
 * before a single construct is named.
 */
export default function StoryPanels({ story, onContinue }) {
  const isReal = story.collection === 'real-world';
  const [revealed, setRevealed] = useState(() => new Set([1]));
  const refs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(new Set(story.panels.map((panel) => panel.n)));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const n = Number(entry.target.dataset.panel);
          setRevealed((current) => new Set(current).add(n));
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );

    refs.current.filter(Boolean).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [story.storyId]);

  return (
    <div className="sb-story">
      <header className="sb-story-head">
        <p className="sb-eyebrow">{story.source}</p>
        <h1 className="sb-display">{story.title}</h1>
      </header>

      <ol className="sb-panels">
        {story.panels.map((panel, index) => (
          <li
            key={panel.n}
            data-panel={panel.n}
            ref={(node) => {
              refs.current[index] = node;
            }}
            className={revealed.has(panel.n) ? 'sb-panel is-in' : 'sb-panel'}
          >
            <figure className="sb-panel-art">
              <img src={panel.image} alt={panel.alt} loading={panel.n === 1 ? 'eager' : 'lazy'} />
            </figure>
            <div className="sb-panel-text">
              <span className="sb-folio" aria-hidden="true">
                {isReal ? `FIG. ${panel.n}` : String(panel.n).padStart(2, '0')}
              </span>
              <p>{panel.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Real-world stories make factual claims, so the reader gets the receipts. */}
      {story.sources?.length > 0 && (
        <aside className="sb-sources">
          <p className="sb-eyebrow">Sources</p>
          <ul>
            {story.sources.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="sb-advance">
        <p className="sb-advance-ask">
          Before you go on, put the rule of this story into your own words. What got repeated, or
          decided, or looked up? You will see it again in a moment, wearing different clothes.
        </p>
        <button className="sb-next" onClick={onContinue}>
          Now show me the Python
        </button>
      </div>
    </div>
  );
}
