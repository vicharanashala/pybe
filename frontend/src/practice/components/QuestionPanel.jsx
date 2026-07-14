import React, { useState } from "react";
import MarkdownLite from "./MarkdownLite.jsx";

export default function QuestionPanel({ problem }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="question-panel">
      <div className="question-header">
        <h2>
          {problem.order}. {problem.title}
        </h2>
        <span className={`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </span>
      </div>

      <MarkdownLite text={problem.description} />

      <div className="samples-block">
        <h4>Examples</h4>
        {problem.samples.map((s) => (
          <div className="sample-card" key={s.idx}>
            <div className="sample-row">
              <span className="sample-label">Input</span>
              <code>{s.input}</code>
            </div>
            <div className="sample-row">
              <span className="sample-label">Output</span>
              <code>{JSON.stringify(s.expected)}</code>
            </div>
          </div>
        ))}
      </div>

      {problem.hint && (
        <div className="hint-block">
          <button className="hint-toggle" onClick={() => setShowHint((v) => !v)}>
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          {showHint && <p className="hint-text">{problem.hint}</p>}
        </div>
      )}
    </div>
  );
}
