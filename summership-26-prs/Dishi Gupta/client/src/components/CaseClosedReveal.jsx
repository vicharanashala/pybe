import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import CodePanel from './CodePanel';
import { WaxSeal } from './Motifs';

export default function CaseClosedReveal({
  slide,
  scenario,
  onContinue,
  isModal = false,
  onClose
}) {
  const storyRecap = slide.storyRecap || scenario.prompt;
  const conceptName = slide.conceptName || (scenario.concepts && scenario.concepts[0]) || 'Python deduction';
  const analogy = slide.analogy || 'Like testing keys in a lock to find the single match.';
  const code = slide.code || scenario.idealSolution;

  return (
    <article className="case-closed-reveal-card" aria-label="Case file closed reveal">
      <header className="reveal-header">
        <div className="reveal-badge-row">
          <span className="reveal-kicker">
            <CheckCircle2 size={15} />
            <span>Case file closed</span>
          </span>
          <WaxSeal state="sealed" label="" size={28} />
        </div>
        <h3 className="reveal-main-title">
          {scenario.partLabel || scenario.title.replace(/^Rosewood Manor:\s*/, '')}
        </h3>
        <p className="reveal-story-recap">{storyRecap}</p>
      </header>

      <section className="reveal-concept-box" aria-label="Core concept">
        <div className="concept-box-header">
          <Sparkles size={18} className="concept-sparkle-icon" />
          <div className="concept-box-meta">
            <span className="concept-box-eyebrow">Programmer's Method</span>
            <h4 className="concept-name-title">{conceptName}</h4>
          </div>
        </div>
        <div className="concept-analogy-box">
          <span className="analogy-label">Everyday Life Comparison</span>
          <p className="analogy-text">{analogy}</p>
        </div>
      </section>

      <section className="reveal-code-section" aria-label="Readable Python code">
        <CodePanel code={code} title={`${conceptName} — ${scenario.partLabel || 'Case solution'}`} />
      </section>

      <footer className="reveal-footer-actions">
        {isModal ? (
          <button type="button" className="primary reveal-continue-btn" onClick={onClose}>
            <span>Back to investigation</span>
          </button>
        ) : (
          <button
            type="button"
            className="primary reveal-continue-btn"
            onClick={onContinue}
          >
            <span>Continue to next file</span>
            <ArrowRight size={16} />
          </button>
        )}
      </footer>
    </article>
  );
}
