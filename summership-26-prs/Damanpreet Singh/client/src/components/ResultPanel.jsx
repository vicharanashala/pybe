import React from 'react';
import { Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import CodeViewer from './CodeViewer.jsx';

function ResultPanel() {
  const activeResult = useAppStore((s) => s.activeResult);

  return (
    <section className="panel result-panel">
      <div className="section-title">
        <Sparkles size={20} />
        <h2>AI Mentor Output</h2>
      </div>
      {!activeResult ? <EmptyResult /> : <Result result={activeResult} />}
    </section>
  );
}

function EmptyResult() {
  return (
    <div className="empty">
      <Lightbulb size={38} />
      <p>
        Submit reasoning to see abstraction mapping, Python code, prompt
        feedback, and misconception signals.
      </p>
    </div>
  );
}

function Result({ result }) {
  // abstractionMap shape from learning.service.js:
  // { matched: [{ concept, pythonConstruct }], unmatched: [...], summary }
  const abstractionMap = result.abstractionMap || {};
  const matched = abstractionMap.matched || [];
  const unmatched = abstractionMap.unmatched || [];

  return (
    <div className="result-stack">
      <div className="score">
        <span>{result.promptScore}</span>
        <small>Prompt maturity</small>
      </div>

      {/* Abstraction summary */}
      {abstractionMap.summary && (
        <p className="context" style={{ fontStyle: 'italic' }}>
          {abstractionMap.summary}
        </p>
      )}

      {/* Matched concepts */}
      {matched.length > 0 && (
        <div>
          {matched.map((item) => (
            <article className="mapping" key={item.concept}>
              <strong>{item.concept}</strong>
              <span>{item.pythonConstruct}</span>
            </article>
          ))}
        </div>
      )}

      {/* Unmatched scenario concepts */}
      {unmatched.length > 0 && (
        <div className="note" style={{ marginBottom: '12px' }}>
          <strong>Concepts not yet addressed</strong>
          <p>{unmatched.join(', ')}</p>
        </div>
      )}

      <CodeViewer code={result.generatedCode} explanation={result.codeExplanation} />

      <ul className="feedback">
        {result.promptFeedback?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {result.misconceptions?.length > 0 && (
        <div className="note">
          <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px' }} />
          <strong>Misconception watch</strong>
          {result.misconceptions.map((item, index) => (
            <p key={index} style={{ margin: '8px 0 0 0' }}>
              {typeof item === 'string' ? (
                item
              ) : (
                <>
                  <span style={{ color: '#991b1b', fontWeight: '600' }}>{item.misconception}</span>
                  <br />
                  <span style={{ color: '#53615c' }}>↳ {item.correction}</span>
                </>
              )}
            </p>
          ))}
        </div>
      )}

      {result.masterySignals?.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <strong>Mastery signals</strong>
          <div className="objective-row">
            {result.masterySignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPanel;
