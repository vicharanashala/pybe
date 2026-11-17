import React from 'react';

const KEYWORDS = new Set([
  "class", "def", "try", "except", "finally", "raise",
  "print", "pass", "return", "Exception", "import", "from", "as"
]);

// ─── Syntax highlighting tokenizer (port of storyCodeModule.highlightLine) ────
export function highlightLine(text) {
  const parts = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === '#') { parts.push({ type: 'comment', text: text.slice(i) }); break; }
    if (text[i] === '"' || text[i] === "'") {
      const quote = text[i]; let j = i + 1;
      while (j < text.length && text[j] !== quote) j++;
      if (text[j] === quote) j++;
      parts.push({ type: 'string', text: text.slice(i, j) }); i = j; continue;
    }
    if (/\d/.test(text[i]) && (i === 0 || /[\s\(,=\+\-]/.test(text[i - 1]))) {
      let j = i; while (j < text.length && /[\d\.]/.test(text[j])) j++;
      parts.push({ type: 'number', text: text.slice(i, j) }); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(text[i])) {
      let j = i; while (j < text.length && /[\w]/.test(text[j])) j++;
      const word = text.slice(i, j);
      if (KEYWORDS.has(word)) parts.push({ type: 'keyword', text: word });
      else if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) parts.push({ type: 'class', text: word });
      else if (text[j] === '(') parts.push({ type: 'func', text: word });
      else parts.push({ type: 'plain', text: word });
      i = j; continue;
    }
    parts.push({ type: 'plain', text: text[i] }); i++;
  }
  return parts;
}

export function renderHighlightedLine(text) {
  const tokens = highlightLine(text);
  return (
    <>
      {tokens.map((t, i) =>
        t.type === 'plain'
          ? <span key={i}>{t.text}</span>
          : <span key={i} className={'pb-tok-' + t.type}>{t.text}</span>
      )}
    </>
  );
}
