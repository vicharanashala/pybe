import React, { useState } from 'react';

/**
 * MatchingActivity — click-left-then-click-right pairing.
 * Used in Practice sub-activity A.
 *
 * Props:
 *   pairs       — array of { story: string, python: string }
 *   onComplete  — called when all pairs correctly matched
 *   chapterColor
 */
export default function MatchingActivity({ pairs = [], onComplete, chapterColor = '#39d353' }) {
  const [selectedStory,  setSelectedStory]  = useState(null);
  const [selectedPython, setSelectedPython] = useState(null);
  const [matched,   setMatched]   = useState([]); // array of matched story strings
  const [wrongFlash, setWrongFlash] = useState(false);

  // Shuffle Python column once (stable across re-renders)
  const [shuffledPython] = useState(() => {
    const arr = [...pairs.map((p) => p.python)];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const allDone = matched.length === pairs.length;

  function handleStoryClick(story) {
    if (matched.includes(story)) return;
    setSelectedStory(story);
    setSelectedPython(null);
  }

  function handlePythonClick(python) {
    if (!selectedStory) return;
    const correct = pairs.find((p) => p.story === selectedStory)?.python;
    if (python === correct) {
      const newMatched = [...matched, selectedStory];
      setMatched(newMatched);
      setSelectedStory(null);
      setSelectedPython(null);
      if (newMatched.length === pairs.length) {
        setTimeout(() => onComplete && onComplete(), 600);
      }
    } else {
      // Wrong — flash red briefly
      setSelectedPython(python);
      setWrongFlash(true);
      setTimeout(() => {
        setWrongFlash(false);
        setSelectedStory(null);
        setSelectedPython(null);
      }, 900);
    }
  }

  function isStoryMatched(story) { return matched.includes(story); }
  function isPythonMatched(python) {
    const pair = pairs.find((p) => p.python === python);
    return pair ? matched.includes(pair.story) : false;
  }

  return (
    <div className="matching-activity" style={{ '--chapter-color': chapterColor }}>
      <div className="activity-label">🔗 Matching — {matched.length} of {pairs.length} matched</div>
      <h3 className="activity-title">Match the Backpack Action to the Python Operation</h3>
      <p className="activity-instruction" style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Click a backpack action on the left, then click the matching Python operation on the right.
      </p>

      <div className="matching-columns">
        {/* Left — story actions */}
        <div className="matching-col">
          <div className="matching-col__header">🎒 Backpack Action</div>
          {pairs.map((p) => {
            const isMatched  = isStoryMatched(p.story);
            const isSelected = selectedStory === p.story;
            return (
              <button
                key={p.story}
                className={`match-item${isMatched ? ' matched' : isSelected ? ' selected' : ''}`}
                onClick={() => handleStoryClick(p.story)}
                disabled={isMatched}
                style={isSelected ? { borderColor: chapterColor, color: chapterColor } : {}}
                aria-pressed={isSelected}
              >
                {isMatched && <span className="match-item__check">✓</span>}
                {p.story}
              </button>
            );
          })}
        </div>

        {/* Connector dots (visual) */}
        <div className="matching-connector" aria-hidden="true">
          {pairs.map((_, i) => <div key={i} className="matching-connector__dot" />)}
        </div>

        {/* Right — Python operations */}
        <div className="matching-col">
          <div className="matching-col__header">🐍 Python</div>
          {shuffledPython.map((python) => {
            const isMatched  = isPythonMatched(python);
            const isSelected = selectedPython === python;
            const isWrong    = wrongFlash && isSelected;
            return (
              <button
                key={python}
                className={`match-item match-item--python${isMatched ? ' matched' : isWrong ? ' wrong' : isSelected ? ' selected' : ''}`}
                onClick={() => handlePythonClick(python)}
                disabled={isMatched || !selectedStory}
                style={isMatched ? { borderColor: chapterColor } : {}}
              >
                {isMatched && <span className="match-item__check">✓</span>}
                <code>{python}</code>
              </button>
            );
          })}
        </div>
      </div>

      {allDone && (
        <div className="feedback-banner success" style={{ marginTop: '16px' }}>
          <span className="feedback-icon">🎊</span>
          <div className="feedback-text">
            <strong>Perfect!</strong> You matched all Python operations to their backpack actions!
          </div>
        </div>
      )}
    </div>
  );
}
