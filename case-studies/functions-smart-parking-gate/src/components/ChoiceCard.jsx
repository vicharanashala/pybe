import { useState } from "react";

/**
 * A single short question with a few options and immediate, brief feedback.
 * Only a handful of these appear across the whole story.
 */
export default function ChoiceCard({ prompt, options, correctId, correctFeedback, onCorrect }) {
  const [selectedId, setSelectedId] = useState(null);
  const isCorrect = selectedId === correctId;

  function handleSelect(id) {
    if (selectedId) return;
    setSelectedId(id);
    if (id === correctId) onCorrect && onCorrect();
  }

  return (
    <div className="code-card" role="group" aria-label="Quick question" style={{ textAlign: "left" }}>
      <p className="story-text" style={{ fontSize: 18, marginBottom: 14 }}>{prompt}</p>
      <div className="choice-list">
        {options.map((option) => {
          const showCorrect = selectedId && option.id === correctId;
          const showIncorrect = selectedId === option.id && option.id !== correctId;
          return (
            <button
              key={option.id}
              type="button"
              className={`choice-option ${showCorrect ? "is-correct" : ""} ${
                showIncorrect ? "is-incorrect" : ""
              }`}
              onClick={() => handleSelect(option.id)}
              disabled={Boolean(selectedId)}
            >
              {option.text}
            </button>
          );
        })}
      </div>
      {selectedId && (
        <div className={`choice-feedback ${isCorrect ? "is-success" : "is-error"}`} style={{ marginTop: 12 }}>
          <span aria-hidden="true">{isCorrect ? "✓" : "→"}</span>
          <span>{isCorrect ? correctFeedback : "Not quite — take another look at the scene above."}</span>
        </div>
      )}
    </div>
  );
}
