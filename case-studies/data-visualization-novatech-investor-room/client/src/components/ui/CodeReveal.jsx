import { useState } from 'react';
import { codeFor } from '../../data/content';

export function CodeReveal({ plot, visible, onToggle, onContinue, isLast }) {
  const [copied, setCopied] = useState(false);
  const code = codeFor(plot.id);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* clipboard blocked */ }
  };
  return (
    <div className="code-panel">
      <div>
        <span className="eyebrow">OPTIONAL / PYTHON TRANSLATION</span>
        <h3>You made the visual decision.</h3>
        <p>Want to see the Matplotlib move behind it?</p>
      </div>
      <button className="text-button" onClick={onToggle}>{visible ? 'Hide code' : 'Show code'} <span>{visible ? '−' : '+'}</span></button>
      {visible && (
        <>
          <pre className="code-reveal"><code>
            {code.trimEnd().split('\n').map((line, i) => (
              <span key={i} className={line.includes(plot.keyCall) ? 'code-line hl' : 'code-line'}>{line || ' '}</span>
            ))}
          </code></pre>
          <div className="code-tools">
            <small>The highlighted line is the one that draws this chart. Paste the code into Colab or any .py file to run it.</small>
            <button className="text-button" onClick={copy}>{copied ? 'Copied ✓' : 'Copy code'}</button>
          </div>
        </>
      )}
      <button className="primary compact" onClick={onContinue}>{isLast ? 'Close the pitch' : 'Continue the pitch'} <span>→</span></button>
    </div>
  );
}
