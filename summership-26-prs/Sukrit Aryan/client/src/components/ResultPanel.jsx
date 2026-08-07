import React from 'react';
import { Code2, Lightbulb, AlertTriangle, CheckCircle2, Star } from 'lucide-react';

function ScoreRing({ score }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 70 ? 'var(--accent)' : score >= 45 ? 'var(--chai-color)' : 'var(--builder-color)';
  const label = score >= 70 ? 'Excellent' : score >= 45 ? 'Developing' : 'Early stage';

  return (
    <div className="rp-score-ring">
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={45} cy={45} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={6} />
        <circle
          cx={45} cy={45} r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x={45} y={42} textAnchor="middle" fill={color} fontSize={16} fontWeight={700} fontFamily="Space Grotesk, sans-serif">{score}</text>
        <text x={45} y={58} textAnchor="middle" fill="var(--text-muted)" fontSize={9} fontFamily="Inter, sans-serif">/ 100</text>
      </svg>
      <div className="rp-score-label" style={{ color }}>
        <Star size={12} /> {label}
      </div>
    </div>
  );
}

export default function ResultPanel({ result }) {
  if (!result) {
    return (
      <div className="rp-empty">
        <div className="rp-empty__icon anim-float"><Lightbulb size={40} /></div>
        <h3>Your mapping will appear here</h3>
        <p>Submit your reasoning to see how your thinking maps to Python constructs, along with generated code and feedback.</p>
      </div>
    );
  }

  return (
    <div className="rp anim-fade-up">
      {/* Score header */}
      <div className="rp-header">
        <ScoreRing score={result.promptScore} />
        <div className="rp-header__text">
          <div className="section-label">Prompt Maturity Score</div>
          <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Abstraction Map</h3>
          <p style={{ fontSize: '0.82rem', margin: '4px 0 0' }}>
            Your reasoning detected {result.abstractionMap.length} pattern{result.abstractionMap.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Abstraction mappings */}
      {result.abstractionMap.length > 0 && (
        <div className="rp-section">
          {result.abstractionMap.map((item) => (
            <div key={item.pattern} className="rp-mapping">
              <div className="rp-mapping__pattern">{item.pattern}</div>
              <div className="rp-mapping__concept">
                <Code2 size={12} /> {item.pythonConcept}
              </div>
              <p className="rp-mapping__explanation">{item.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Generated code */}
      {result.generatedCode && (
        <div className="rp-code">
          <div className="rp-code__header">
            <Code2 size={14} /> Generated Python
            <span className="rp-code__lang">Python 3</span>
          </div>
          <pre className="rp-code__pre">{result.generatedCode}</pre>
          {result.codeExplanation && (
            <p className="rp-code__explanation">{result.codeExplanation}</p>
          )}
        </div>
      )}

      {/* Feedback */}
      {result.promptFeedback?.length > 0 && (
        <div className="rp-feedback">
          <div className="rp-feedback__title">
            <CheckCircle2 size={14} /> Prompt Feedback
          </div>
          <ul>
            {result.promptFeedback.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Misconceptions */}
      {result.misconceptions?.length > 0 && (
        <div className="rp-misconception">
          <div className="rp-misconception__title">
            <AlertTriangle size={14} /> Watch Out
          </div>
          {result.misconceptions.map((item, i) => (
            <p key={i}>{item}</p>
          ))}
        </div>
      )}

      {/* Mastery signals */}
      {result.masterySignals?.length > 0 && (
        <div className="rp-mastery">
          {result.masterySignals.map((sig, i) => (
            <span key={i} className="rp-mastery__tag">✓ {sig}</span>
          ))}
        </div>
      )}

      <style>{`
        .rp { display: flex; flex-direction: column; gap: var(--sp-4); }
        .rp-header {
          display: flex;
          gap: var(--sp-4);
          align-items: center;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: var(--sp-4);
        }
        .rp-score-ring { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
        .rp-score-label { display: flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; }
        .rp-header__text { flex: 1; }

        .rp-section { display: flex; flex-direction: column; gap: var(--sp-2); }
        .rp-mapping {
          border-left: 3px solid var(--accent);
          padding: var(--sp-3) var(--sp-4);
          background: var(--bg-elevated);
          border-radius: 0 var(--r-sm) var(--r-sm) 0;
        }
        .rp-mapping__pattern { font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
        .rp-mapping__concept {
          display: flex; align-items: center; gap: 5px;
          font-weight: 700; color: var(--accent); font-size: 0.9rem; margin-bottom: 4px;
        }
        .rp-mapping__explanation { font-size: 0.82rem; color: var(--text-secondary); margin: 0; line-height: 1.5; }

        .rp-code {
          background: #0A0F14;
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          overflow: hidden;
        }
        .rp-code__header {
          display: flex; align-items: center; gap: var(--sp-2);
          padding: var(--sp-2) var(--sp-4);
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border);
          font-size: 0.82rem; color: var(--text-secondary);
        }
        .rp-code__lang { margin-left: auto; font-size: 0.7rem; color: var(--text-muted); }
        .rp-code__pre {
          padding: var(--sp-4);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.6;
          color: #79C0FF;
          white-space: pre-wrap;
          overflow-x: auto;
          margin: 0;
        }
        .rp-code__explanation { padding: 0 var(--sp-4) var(--sp-3); font-size: 0.8rem; color: var(--text-secondary); margin: 0; }

        .rp-feedback {
          background: rgba(52,211,153,0.06);
          border: 1px solid rgba(52,211,153,0.15);
          border-radius: var(--r-md);
          padding: var(--sp-4);
        }
        .rp-feedback__title { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem; color: var(--beginner-color); margin-bottom: var(--sp-2); }
        .rp-feedback ul { padding-left: 1.2em; display: flex; flex-direction: column; gap: 5px; }
        .rp-feedback li { font-size: 0.83rem; color: var(--text-secondary); }

        .rp-misconception {
          background: rgba(244,114,182,0.06);
          border: 1px solid rgba(244,114,182,0.15);
          border-radius: var(--r-md);
          padding: var(--sp-4);
        }
        .rp-misconception__title { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem; color: var(--builder-color); margin-bottom: var(--sp-2); }
        .rp-misconception p { font-size: 0.83rem; color: var(--text-secondary); margin: 0; }

        .rp-mastery { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
        .rp-mastery__tag {
          font-size: 0.75rem; font-weight: 600;
          color: var(--accent);
          background: var(--accent-glow);
          border: 1px solid var(--border-accent);
          padding: 3px 10px;
          border-radius: var(--r-full);
        }

        .rp-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center;
          min-height: 300px; gap: var(--sp-4);
          color: var(--text-muted);
        }
        .rp-empty__icon { color: var(--accent); opacity: 0.5; }
        .rp-empty h3 { color: var(--text-secondary); font-size: 1rem; margin: 0; }
        .rp-empty p { font-size: 0.85rem; max-width: 280px; margin: 0; }
      `}</style>
    </div>
  );
}
