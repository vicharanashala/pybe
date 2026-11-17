import React from 'react';

// A very small Python colouriser for the read-only code shown during the story
// beats. It covers only what these two chapters use, and it builds React elements
// rather than raw HTML, so no learner- or content-supplied text is ever injected
// as markup.
//
// Strings and comments are matched first so a keyword inside a message — "No need
// to water" — is not painted as a keyword.

const TOKEN = /("[^"]*"|'[^']*'|#.*$)/;
const KEYWORD = /\b(if|elif|else|not|and|or|True|False|None|def|return|print|for|while|in|is)\b/g;

function highlightPlain(text, keyPrefix) {
  const parts = [];
  let last = 0;
  let match;
  KEYWORD.lastIndex = 0;

  while ((match = KEYWORD.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <span className="pf-tok-kw" key={`${keyPrefix}-k${match.index}`}>
        {match[0]}
      </span>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function highlightLine(line, lineIndex) {
  return line
    .split(TOKEN)
    .filter((chunk) => chunk !== '' && chunk !== undefined)
    .map((chunk, i) => {
      const key = `l${lineIndex}-c${i}`;
      if (chunk.startsWith('#')) {
        return (
          <span className="pf-tok-com" key={key}>
            {chunk}
          </span>
        );
      }
      if ((chunk.startsWith('"') && chunk.endsWith('"')) || (chunk.startsWith("'") && chunk.endsWith("'"))) {
        return (
          <span className="pf-tok-str" key={key}>
            {chunk}
          </span>
        );
      }
      return <React.Fragment key={key}>{highlightPlain(chunk, key)}</React.Fragment>;
    });
}

export default function PyCode({ code, className = '' }) {
  const lines = code.split('\n');
  return (
    <pre className={`pf-code ${className}`}>
      <code>
        {lines.map((line, i) => (
          <span className="pf-code-line" key={`${i}-${line}`}>
            {highlightLine(line, i)}
            {i < lines.length - 1 ? '\n' : ''}
          </span>
        ))}
      </code>
    </pre>
  );
}
