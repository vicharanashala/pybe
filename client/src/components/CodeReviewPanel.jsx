import React, { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { reviewCode } from '../api/client';

const DIMENSION_LABELS = {
  correctness: 'Correctness',
  readability: 'Readability',
  variableNaming: 'Variable Naming',
  computationalThinking: 'Computational Thinking',
  pythonBestPractices: 'Python Best Practices'
};

/**
 * Feature 9: AI Code Review. The learner's code is never executed here -
 * only read and reviewed - so this is safe to offer without a sandboxed
 * execution environment.
 */
function CodeReviewPanel({ scenarioId }) {
  const [code, setCode] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      setReview(await reviewCode(code, scenarioId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="code-review-panel">
      <form onSubmit={handleSubmit}>
        <label>
          Paste your Python code for a review
          <textarea
            className="code-review-input"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="bag_weight = 12&#10;print(bag_weight)"
          />
        </label>
        {error && <p className="error-inline">{error}</p>}
        <button type="submit" className="primary" disabled={loading}>
          <ClipboardCheck size={16} /> {loading ? 'Reviewing...' : 'Review my code'}
        </button>
      </form>

      {review && (
        <div className="code-review-results">
          {Object.entries(DIMENSION_LABELS).map(([key, label]) => (
            <div className="code-review-dimension" key={key}>
              <strong>{label}</strong>
              <p>{review[key]}</p>
            </div>
          ))}
          {review.suggestions?.length > 0 && (
            <div className="code-review-dimension">
              <strong>Suggestions</strong>
              <ul>{review.suggestions.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          {review.mistakes?.length > 0 && (
            <div className="code-review-dimension">
              <strong>Worth double-checking</strong>
              <ul>{review.mistakes.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          <p className="code-review-overall">{review.overallImpression}</p>
        </div>
      )}
    </div>
  );
}

export default CodeReviewPanel;
