import React, { useState, useEffect } from 'react';
import { Bot, Lightbulb, AlertTriangle, Eye, RefreshCw, ChevronRight, X, Sparkles, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function PairCompanionDrawer({ liveCode, scenarioTitle }) {
  const [companionData, setCompanionData] = useState(null);
  const [activeHintLevel, setActiveHintLevel] = useState(0); // 0 = none, 1, 2, 3
  const [hintContent, setHintContent] = useState(null);
  const [errorInput, setErrorInput] = useState('');
  const [errorExplanation, setErrorExplanation] = useState(null);
  const [showFix, setShowFix] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Watch live code typing (Debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!liveCode) return;
      try {
        const res = await fetch(`${API_URL}/pair/watch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: liveCode, editCount: 2, timeSpentMs: 5000 })
        }).then(r => r.json());
        
        setCompanionData(res);
      } catch (err) {
        console.warn('Pair companion watch error:', err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [liveCode]);

  // Fetch Socratic Hint
  async function fetchHint(level) {
    setActiveHintLevel(level);
    try {
      const res = await fetch(`${API_URL}/pair/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: liveCode, hintLevel: level, scenarioTitle })
      }).then(r => r.json());
      
      setHintContent(res);
    } catch (err) {
      console.warn('Fetch hint error:', err);
    }
  }

  // Fetch Explain-First Error Breakdown
  async function handleExplainError() {
    if (!errorInput.trim()) return;
    try {
      const res = await fetch(`${API_URL}/pair/explain-error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: liveCode, errorText: errorInput })
      }).then(r => r.json());

      setErrorExplanation(res);
      setShowFix(false);
    } catch (err) {
      console.warn('Error explanation error:', err);
    }
  }

  if (!isOpen) {
    return (
      <button className="pair-companion-toggle" onClick={() => setIsOpen(true)} title="Open AI Pair Companion">
        <Bot size={22} />
        <span>AI Pair Companion</span>
      </button>
    );
  }

  return (
    <aside className="pair-companion-panel">
      <header className="companion-header">
        <div className="companion-title">
          <div className="companion-avatar">
            <Bot size={20} />
          </div>
          <div>
            <strong>AI Pair Programmer</strong>
            <span className="live-status">🟢 Live Watching Code</span>
          </div>
        </div>
        <button className="close-icon-btn" onClick={() => setIsOpen(false)}>
          <X size={16} />
        </button>
      </header>

      {/* Observation Banner */}
      {companionData && (
        <div className={`observation-card ${companionData.status}`}>
          <div className="card-top">
            <Eye size={16} />
            <span>AI Observation</span>
          </div>
          <p>{companionData.observation}</p>
          {companionData.proactiveHint && (
            <div className="proactive-clue">
              💡 <strong>Proactive Clue:</strong> {companionData.proactiveHint}
            </div>
          )}
        </div>
      )}

      {/* Socratic Progressive Hints Section */}
      <section className="companion-section">
        <div className="section-header">
          <Lightbulb size={18} className="hint-icon" />
          <h4>Socratic Hint System</h4>
        </div>
        <p className="hint-sub">Get progressive clues instead of direct code answers.</p>

        <div className="hint-buttons-row">
          <button
            className={`hint-tier-btn ${activeHintLevel === 1 ? 'active' : ''}`}
            onClick={() => fetchHint(1)}
          >
            Level 1: Nudge
          </button>
          <button
            className={`hint-tier-btn ${activeHintLevel === 2 ? 'active' : ''}`}
            onClick={() => fetchHint(2)}
          >
            Level 2: Concept
          </button>
          <button
            className={`hint-tier-btn ${activeHintLevel === 3 ? 'active' : ''}`}
            onClick={() => fetchHint(3)}
          >
            Level 3: Template
          </button>
        </div>

        {hintContent && (
          <div className="socratic-hint-display">
            <strong>{hintContent.title}</strong>
            <pre><code>{hintContent.text}</code></pre>
          </div>
        )}
      </section>

      {/* Explain-First Error Assistant Section */}
      <section className="companion-section error-explain-section">
        <div className="section-header">
          <AlertTriangle size={18} className="error-icon" />
          <h4>Explain-First Error Assistant</h4>
        </div>

        <div className="error-input-row">
          <input
            type="text"
            value={errorInput}
            onChange={(e) => setErrorInput(e.target.value)}
            placeholder="Got an error? (e.g. TypeError, IndexError)"
          />
          <button className="explain-btn" onClick={handleExplainError}>
            Explain Why
          </button>
        </div>

        {errorExplanation && (
          <div className="error-explanation-card">
            <div className="error-badge">{errorExplanation.rootCause}</div>
            
            <div className="explain-block">
              <strong>❓ Why did this happen?</strong>
              <p>{errorExplanation.whyItHappened}</p>
            </div>

            <div className="explain-block">
              <strong>💡 Python Concept:</strong>
              <p>{errorExplanation.conceptualExplanation}</p>
            </div>

            {!showFix ? (
              <button className="reveal-fix-btn" onClick={() => setShowFix(true)}>
                Reveal Suggested Fix
              </button>
            ) : (
              <div className="fix-revealed-box">
                <strong>✅ Suggested Fix:</strong>
                <code>{errorExplanation.suggestedFix}</code>
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
}
