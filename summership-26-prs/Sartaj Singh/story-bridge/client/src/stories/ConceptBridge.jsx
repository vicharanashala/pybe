import React, { useEffect, useState } from 'react';

/**
 * The signature stage. Story elements on the left, Python elements on the right,
 * joined by connectors that draw themselves in sequence. The product's whole
 * argument — that these are the same shape — made literal.
 */
export default function ConceptBridge({ story, onContinue }) {
  const { bridge, conceptLabel } = story;
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(bridge.mapping.length);
      return undefined;
    }
    setDrawn(0);
    const timers = bridge.mapping.map((_, index) =>
      setTimeout(() => setDrawn((current) => Math.max(current, index + 1)), 320 + index * 260)
    );
    return () => timers.forEach(clearTimeout);
  }, [story.storyId]);

  return (
    <div className="sb-bridge">
      <header className="sb-bridge-head">
        <p className="sb-eyebrow">The bridge · {conceptLabel}</p>
        <p className="sb-hook">{bridge.hook}</p>
      </header>

      <ol className="sb-rows">
        {bridge.mapping.map((row, index) => (
          <li key={row.python} className={index < drawn ? 'sb-row is-drawn' : 'sb-row'}>
            <div className="sb-side sb-side-story">
              <span className="sb-side-label">
                {story.collection === 'real-world' ? 'In the real world' : 'In the story'}
              </span>
              <p>{row.story}</p>
            </div>

            <div className="sb-span" aria-hidden="true">
              <svg viewBox="0 0 120 40" preserveAspectRatio="none">
                <path d="M2 20 C 40 20, 80 20, 118 20" className="sb-span-line" />
              </svg>
            </div>

            <div className="sb-side sb-side-code">
              <span className="sb-side-label">In Python</span>
              <p>{row.python}</p>
              <span className="sb-side-detail">{row.detail}</span>
            </div>
          </li>
        ))}
      </ol>

      <section className="sb-code-block">
        <p className="sb-eyebrow">The same rule, written in Python</p>
        <pre>
          <code>{bridge.code}</code>
        </pre>
        {bridge.codeNotes && <p className="sb-code-note">{bridge.codeNotes}</p>}
      </section>

      {bridge.gotcha && (
        <aside className="sb-gotcha">
          <span className="sb-gotcha-label">Where this breaks</span>
          <p>{bridge.gotcha}</p>
        </aside>
      )}

      <div className="sb-advance">
        <button className="sb-next" onClick={onContinue}>
          Check what stuck
        </button>
      </div>
    </div>
  );
}
