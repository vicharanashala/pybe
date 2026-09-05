import React from 'react';
import { ArrowRight, Code2 } from 'lucide-react';

function CodeExplanation({ storyTitle, code, explanation, storyConnection, onContinue }) {
  return (
    <section className="lj-panel" aria-labelledby="lj-code-title">
      <div className="lj-section-heading">
        <div className="lj-icon-badge"><Code2 size={22} /></div>
        <div>
          <p className="lj-eyebrow">Now meet the syntax</p>
          <h2 id="lj-code-title">{storyTitle} in Python</h2>
        </div>
      </div>
      <pre className="lj-code-block"><code>{code}</code></pre>
      <div className="lj-explanation-list">
        {explanation.map((item) => <p key={item}>{item}</p>)}
      </div>
      <div className="lj-story-connection"><strong>Back to the story</strong><p>{storyConnection}</p></div>
      <button type="button" className="lj-button lj-button-primary" onClick={onContinue}>
        Complete lesson <ArrowRight size={17} />
      </button>
    </section>
  );
}

export default CodeExplanation;
