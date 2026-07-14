import React, { useState, useEffect } from "react";
import { Check, X } from 'lucide-react';

export default function ResultsPanel({ status, response, samples }) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActiveTab(0);
  }, [response]);

  if (status === "idle") {
    return (
      <div className="results-panel results-idle">
        <p className="muted">Run your code to see the output here.</p>
      </div>
    );
  }

  if (status === "running") {
    return (
      <div className="results-panel">
        <p className="muted running-text">Running…</p>
      </div>
    );
  }

  if (status === "error" && !response) {
    return (
      <div className="results-panel">
        <p className="error-text">Something went wrong contacting the server. Please try again.</p>
      </div>
    );
  }

  if (response?.compileError) {
    return (
      <div className="results-panel">
        <div className="result-summary result-fail">
          <span className="result-summary-icon"><X size={14} /></span>
          {response.mode === "submit" ? "Error" : "Runtime Error"}
        </div>
        <pre className="stack-trace">{response.compileError}</pre>
      </div>
    );
  }

  if (!response) return null;

  const { results, allPassed, mode } = response;
  const passCount = results.filter((r) => r.passed).length;

  return (
    <div className="results-panel">
      <div className={`result-summary ${allPassed ? "result-pass" : "result-fail"}`}>
        <span className="result-summary-icon">{allPassed ? <Check size={14} /> : <X size={14} />}</span>
        {allPassed
          ? mode === "submit"
            ? "Accepted"
            : "All test cases passed"
          : `${passCount}/${results.length} test cases passed`}
      </div>

      <div className="testcase-tabs">
        {results.map((r, i) => (
          <button
            key={i}
            className={`testcase-tab ${i === activeTab ? "active" : ""} ${
              r.passed ? "tab-pass" : "tab-fail"
            }`}
            onClick={() => setActiveTab(i)}
          >
            <span className={`tab-dot ${r.passed ? "dot-pass" : "dot-fail"}`} />
            Case {i + 1}
          </button>
        ))}
      </div>

      {results[activeTab] && (
        <div className="testcase-detail">
          <div className="detail-row">
            <span className="detail-label">Input</span>
            <code>{samples?.[activeTab]?.input ?? results[activeTab].input}</code>
          </div>
          <div className="detail-row">
            <span className="detail-label">Expected</span>
            <code>{JSON.stringify(results[activeTab].expected)}</code>
          </div>
          <div className="detail-row">
            <span className="detail-label">Your Output</span>
            {results[activeTab].error ? (
              <code className="output-error">{results[activeTab].error}</code>
            ) : (
              <code className={results[activeTab].passed ? "output-pass" : "output-fail"}>
                {JSON.stringify(results[activeTab].actual)}
              </code>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
