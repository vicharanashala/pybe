import React from 'react';
import { ArrowDown, ArrowRight, GitBranch, Sparkles } from 'lucide-react';

function ConceptMapping({ mapping, onContinue }) {
  return (
    <section className="lj-panel" aria-labelledby="lj-mapping-title">
      <div className="lj-section-heading">
        <div className="lj-icon-badge"><GitBranch size={22} /></div>
        <div>
          <p className="lj-eyebrow">Make the connection</p>
          <h2 id="lj-mapping-title">The story is already Python logic</h2>
        </div>
      </div>
      <div className="lj-logic-bridge">
        <div className="lj-logic-card lj-story-logic-card">
          <span>Story Logic</span>
          <strong>{mapping.conditionPrompt}</strong>
        </div>
        <ArrowRight className="lj-bridge-arrow" size={28} />
        <div className="lj-logic-card lj-python-logic-card">
          <span>Python Logic</span>
          <code>{mapping.pythonCondition}</code>
        </div>
      </div>
      <div className="lj-paths">
        {[mapping.truePath, mapping.falsePath].map((path, index) => (
          <article className="lj-path-card" key={path.title}>
            <div className="lj-path-heading">
              <Sparkles size={17} />
              <h3>{path.title}</h3>
            </div>
            <div className="lj-path-row">
              <div><span>Story</span><strong>{path.story}</strong></div>
              <ArrowRight size={20} />
              <div><span>Python</span><code>{path.python}</code></div>
            </div>
            {index === 0 && <ArrowDown className="lj-path-arrow" size={20} aria-hidden="true" />}
          </article>
        ))}
      </div>
      <p className="lj-connection-note">The decision Riya follows in the library is the same decision Python can follow in code.</p>
      <button type="button" className="lj-button lj-button-primary" onClick={onContinue}>
        See the code <ArrowRight size={17} />
      </button>
    </section>
  );
}

export default ConceptMapping;
