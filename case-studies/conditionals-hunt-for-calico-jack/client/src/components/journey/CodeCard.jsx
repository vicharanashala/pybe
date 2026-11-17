import React, { useEffect, useRef } from 'react';

/* =========================================================
   CodeCard — the Python source, floating beside the sea as a
   tilted glass panel. Lines light up as the story reaches them:

     active  — Python is evaluating this condition right now
     hit     — condition was True, this branch is the one that ran
     miss    — condition was False, Python moved on
     skipped — never reached, because an earlier branch already won
   ========================================================= */

export default function CodeCard({ title, subtitle, lines, note, enter = 1, compact = false }) {
  const bodyRef = useRef(null);

  /* Follow the line Python is on. Between beats — when a condition has just come
     back False and the next one has not been reached — follow the last line that
     was actually evaluated, so the panel never drifts off somewhere unrelated. */
  let activeIndex = lines.findIndex((l) => l.state === 'active' || l.state === 'hit');
  if (activeIndex < 0) {
    for (let i = lines.length - 1; i >= 0; i -= 1) {
      if (lines[i].state === 'miss') {
        activeIndex = i;
        break;
      }
    }
  }

  /* Keep that line in view without ever scrolling the page itself. */
  useEffect(() => {
    const body = bodyRef.current;
    if (!body || activeIndex < 0) return;
    const el = body.querySelector('[data-live="1"]');
    if (!el) return;
    const target = el.offsetTop - body.clientHeight / 2 + el.offsetHeight / 2;
    body.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
  }, [activeIndex, lines]);

  return (
    <div
      className={`jr-code ${compact ? 'is-compact' : ''}`}
      style={{
        '--jr-enter': enter,
        opacity: enter,
        transform: `perspective(1400px) translateX(${(1 - enter) * 60}px) rotateY(${-10 + (1 - enter) * -14}deg) rotateX(2deg)`,
      }}
    >
      <div className="jr-code-head">
        <span className="jr-code-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="jr-code-title">{title}</span>
      </div>

      {subtitle && <div className="jr-code-sub">{subtitle}</div>}

      <div className="jr-code-body" ref={bodyRef}>
        {lines.map((l, i) => (
          <div
            key={l.key}
            data-live={i === activeIndex ? '1' : undefined}
            className={`jr-line is-${l.state || 'idle'}`}
          >
            <span className="jr-line-no">{i + 1}</span>
            <code className="jr-line-src" dangerouslySetInnerHTML={{ __html: l.html }} />
            {l.tag && <span className={`jr-line-tag jr-tag-${l.state}`}>{l.tag}</span>}
          </div>
        ))}
      </div>

      {note && <div className="jr-code-note" dangerouslySetInnerHTML={{ __html: note }} />}
    </div>
  );
}

/* Tiny syntax colouriser — enough for the handful of keywords this course uses.
   Strings and comments are lifted out first so a word like "return" inside a
   printed message does not get painted as a keyword. */
const KEYWORDS = /\b(if|elif|else|not|and|or|True|False|None|return|def|for|while|in|print)\b/g;
const LITERALS = /"[^"]*"|#[^\n]*/g;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s) => esc(s).replace(KEYWORDS, '<span class="jr-kw">$1</span>');

export function py(src) {
  let out = '';
  let last = 0;
  let m;
  LITERALS.lastIndex = 0;
  while ((m = LITERALS.exec(src)) !== null) {
    out += code(src.slice(last, m.index));
    out += `<span class="${m[0][0] === '"' ? 'jr-str' : 'jr-com'}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + code(src.slice(last));
}
