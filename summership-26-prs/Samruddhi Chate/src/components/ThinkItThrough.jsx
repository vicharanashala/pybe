import { useState } from "react";

/**
 * A short, accumulating list of questions — each one appears only after the
 * previous has been answered. Used sparingly, right before a concept "clicks".
 */
export default function ThinkItThrough({ questions, onDone }) {
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function handleAnswer(questionId, optionId) {
    if (answers[questionId]) return;
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionId };
      if (Object.keys(next).length === questions.length) {
        onDone && onDone();
      }
      return next;
    });
  }

  const visible = questions.slice(0, answeredCount + 1);

  return (
    <div className="think-wrap">
      <div className="think-header">
        <p className="think-eyebrow">THINK IT THROUGH · {answeredCount} OF {questions.length} ANSWERED</p>
      </div>
      {visible.map((q, i) => {
        const selected = answers[q.id];
        const isCorrect = selected === q.correctId;
        return (
          <div className="think-question-card" key={q.id}>
            <p className="story-text" style={{ fontSize: 16.5, marginBottom: 12 }}>
              <span className="think-question-index">{i + 1}</span>
              {q.prompt}
            </p>
            <div className="choice-list">
              {q.options.map((option) => {
                const showCorrect = selected && option.id === q.correctId;
                const showIncorrect = selected === option.id && option.id !== q.correctId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`choice-option ${showCorrect ? "is-correct" : ""} ${
                      showIncorrect ? "is-incorrect" : ""
                    }`}
                    onClick={() => handleAnswer(q.id, option.id)}
                    disabled={Boolean(selected)}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
            {selected && (
              <div className={`choice-feedback ${isCorrect ? "is-success" : "is-error"}`} style={{ marginTop: 10 }}>
                <span aria-hidden="true">{isCorrect ? "✓" : "→"}</span>
                <span>{isCorrect ? q.correctFeedback : q.incorrectFeedback || "Have another look above."}</span>
              </div>
            )}
          </div>
        );
      })}
      {!allAnswered && (
        <p className="story-text-sm" style={{ textAlign: "left" }}>
          Answer this one to see the next question.
        </p>
      )}
    </div>
  );
}
