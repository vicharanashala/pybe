import React from 'react';
import { Send, Lightbulb, MessageSquare, Pencil } from 'lucide-react';

export default function LearningForm({ scenario, form, onChange, onSubmit, submitting }) {
  return (
    <form className="lf" onSubmit={onSubmit}>
      {/* Step 1 — Reasoning */}
      <div className="lf__step">
        <div className="lf__step-header">
          <div className="lf__step-num">1</div>
          <div>
            <div className="lf__step-label">Your Reasoning</div>
            <div className="lf__step-sub">Think out loud. Don't worry about Python yet — reason in plain English.</div>
          </div>
        </div>
        <textarea
          id="reasoning"
          required
          value={form.reasoning}
          onChange={e => onChange({ reasoning: e.target.value })}
          placeholder={scenario?.prompt || 'Describe how you would approach this problem…'}
          rows={5}
        />
        <div className="lf__char-count">{form.reasoning.length} chars — aim for 100+</div>
      </div>

      {/* Step 2 — AI Prompt */}
      <div className="lf__step">
        <div className="lf__step-header">
          <div className="lf__step-num lf__step-num--secondary">2</div>
          <div>
            <div className="lf__step-label">
              <MessageSquare size={14} /> Prompt for an AI Mentor
            </div>
            <div className="lf__step-sub">How would you ask an AI to help? Great prompts are specific, include examples, and mention the Python concept you suspect.</div>
          </div>
        </div>
        <textarea
          id="promptText"
          value={form.promptText}
          onChange={e => onChange({ promptText: e.target.value })}
          placeholder="E.g. Explain my approach step by step, then show the Python concept that matches, with an example input and output…"
          rows={4}
        />
      </div>

      {/* Step 3 — Reflection */}
      <div className="lf__step">
        <div className="lf__step-header">
          <div className="lf__step-num lf__step-num--tertiary">3</div>
          <div>
            <div className="lf__step-label">
              <Pencil size={14} /> Reflection
            </div>
            <div className="lf__step-sub">After seeing the result — what surprised you? What clicked?</div>
          </div>
        </div>
        <textarea
          id="reflection"
          value={form.reflection}
          onChange={e => onChange({ reflection: e.target.value })}
          placeholder="What did you notice about your own thinking process?"
          rows={3}
        />
      </div>

      <button
        type="submit"
        id="submit-reasoning-btn"
        className="btn btn-primary btn-lg lf__submit"
        disabled={submitting || !form.reasoning.trim()}
      >
        {submitting ? (
          <>
            <span className="lf__spinner" />
            Mapping your reasoning…
          </>
        ) : (
          <>
            <Send size={16} />
            Map My Reasoning
          </>
        )}
      </button>

      <div className="lf__hint">
        <Lightbulb size={13} />
        The system maps your reasoning to Python constructs — without you naming them first.
      </div>

      <style>{`
        .lf { display: flex; flex-direction: column; gap: var(--sp-5); }
        .lf__step {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }
        .lf__step-header {
          display: flex;
          gap: var(--sp-3);
          align-items: flex-start;
        }
        .lf__step-num {
          width: 28px; height: 28px;
          border-radius: var(--r-full);
          background: var(--accent);
          color: #0D1117;
          font-weight: 700;
          font-size: 0.85rem;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .lf__step-num--secondary { background: var(--explorer-color); }
        .lf__step-num--tertiary  { background: var(--builder-color); color: #fff; }
        .lf__step-label {
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }
        .lf__step-sub { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }
        .lf__char-count { font-size: 0.72rem; color: var(--text-muted); text-align: right; }
        .lf__submit { width: 100%; margin-top: var(--sp-2); }
        .lf__hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--text-muted);
          justify-content: center;
        }
        .lf__spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(13,17,23,0.3);
          border-top-color: #0D1117;
          border-radius: 50%;
          animation: spinSlow 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
