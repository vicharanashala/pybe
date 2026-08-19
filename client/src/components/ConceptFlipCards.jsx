import React, { useState, useEffect } from 'react';
import { Code2, HelpCircle, RotateCcw, Sparkles } from 'lucide-react';
import { getStoryFlipCards } from '../storyData';

export function ConceptFlipCards({ story, onActivityDone }) {
  const CARDS = getStoryFlipCards(story);
  const [flipped, setFlipped] = useState({});
  const activityFiredRef = React.useRef(false);


  // Reset when story changes
  useEffect(() => {
    setFlipped({});
    activityFiredRef.current = false;
  }, [story.id]);

  const toggle = (id) => {
    setFlipped(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const flippedCount = Object.keys(next).filter(k => next[k]).length;
      const reqCount = Math.ceil(CARDS.length * 0.8);
      if (flippedCount >= reqCount && !activityFiredRef.current) {
        activityFiredRef.current = true;
        onActivityDone && onActivityDone();
      }
      return next;
    });
  };

  return (
    <div className="flip-section">
      <div className="flip-section-header">
        <div className="flip-header-text">
          <span className="section-label"><Sparkles size={14} /> {story.icon} {story.title} — Concept Cards</span>
          <h2>Interactive Exception Flip Cards</h2>
          <p>Click any card to flip between its <strong>Fairytale Story Analogy</strong> and <strong>Live Python Code Snippet</strong></p>
        </div>
        <button className="reset-btn" onClick={() => setFlipped({})}>
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      <div className="flip-grid">
        {CARDS.map(card => {
          const isFlipped = !!flipped[card.id];
          return (
            <div
              key={card.id}
              className={`flip-card-root fc-${card.colorVar}${isFlipped ? ' is-flipped' : ''}`}
              onClick={() => toggle(card.id)}
            >
              <div className="flip-card-scene">
                {/* FRONT */}
                <div className="flip-face flip-front">
                  <div className="fc-badge-row">
                    <span className="fc-icon">{card.frontIcon}</span>
                    <span className="fc-badge">{card.badge}</span>
                  </div>
                  <div className="fc-keyword">{card.keyword}</div>
                  <div className="fc-story-title">{card.storyTitle}</div>
                  <p className="fc-story-text">{card.storyText}</p>
                  <div className="fc-flip-hint">
                    <Code2 size={13} /> Click to see Python code
                  </div>
                </div>

                {/* BACK */}
                <div className="flip-face flip-back">
                  <div className="fc-badge-row">
                    <span className="fc-badge python-badge">Python Code</span>
                    <span className="fc-icon">{card.frontIcon}</span>
                  </div>
                  <div className="fc-keyword back-keyword">{card.keyword}</div>
                  <pre className="fc-code-pre">{card.codeSnippet}</pre>
                  <p className="fc-back-note">{card.backNote}</p>
                  <div className="fc-flip-hint">
                    <HelpCircle size={13} /> Click for story analogy
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
