import React from 'react';

// ─── Shared colour tokens for the Learning page ───────────────────────────────
// These sit on the warm-beige (#f4f1ea) background, so they need to be dark
// enough for comfortable reading while still feeling lighter than the headings.
export const C = {
  text:       '#17201d',   // headings, option text near-black
  body:       '#2e3a35',   // paragraph / scenario body text readable dark green-grey
  muted:      '#516058',   // secondary labels, hints, counts
  label:      '#3d524c',   // UPPERCASE small labels (e.g. "SCENARIO", "AVAILABLE TOKENS")
  success:    '#166534',
  error:      '#dc2626',
  warning:    '#92660a',
  accent:     '#4a5e1a',   // olive-green accent (matches PyBe brand)
  accentBg:   '#e7f2cb',
  accentBorder:'#c9dc94',
  border:     '#ded7cb',
  cardBg:     '#fffdf7',
  darkBg:     '#17231f',
  darkText:   '#d8f07c',
};

// ─── Inline markdown renderer ─────────────────────────────────────────────────
// Handles **bold**, `inline code`, *italic*
export function InlineMarkdown({ text }) {
  const parts = [];
  const regex = /\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g;
  let lastIndex = 0, match, key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    if (match[1])
      parts.push(<strong key={key++} style={{ color: C.text, fontWeight: 700 }}>{match[1]}</strong>);
    else if (match[2])
      parts.push(
        <code key={key++} style={{ background: 'rgba(119,100,74,.15)', border: `1px solid ${C.accentBorder}`, borderRadius: 3, padding: '1px 6px', fontFamily: 'monospace', fontSize: '0.88em', color: C.accent }}>
          {match[2]}
        </code>
      );
    else if (match[3])
      parts.push(<em key={key++} style={{ color: C.muted }}>{match[3]}</em>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  return <>{parts}</>;
}

// ─── Concept reveal text renderer ─────────────────────────────────────────────
// Handles fenced ```code``` blocks, bullet lists starting with "- ", plain paragraphs.
export function ConceptRevealText({ text }) {
  const fenceRegex = /```[\w]*\n?([\s\S]*?)```/g;
  const segments = [];
  let last = 0, m, sid = 0;

  while ((m = fenceRegex.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'prose', content: text.slice(last, m.index), id: sid++ });
    segments.push({ type: 'code', content: m[1].trimEnd(), id: sid++ });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: 'prose', content: text.slice(last), id: sid++ });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
      {segments.map((seg) => {
        if (seg.type === 'code') {
          return (
            <pre key={seg.id} style={{ background: '#111916', color: '#e6f2eb', borderRadius: 8, padding: '12px 16px', margin: 0, fontFamily: 'monospace', fontSize: '0.88rem', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {seg.content}
            </pre>
          );
        }
        return seg.content.split('\n').map((line, i) => {
          if (!line.trim()) return <div key={`${seg.id}-${i}`} style={{ height: '0.3rem' }} />;
          if (line.trim().startsWith('- ')) {
            return (
              <div key={`${seg.id}-${i}`} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7b9f27', flexShrink: 0, marginTop: 8 }} />
                <p style={{ fontSize: '0.95rem', color: C.body, lineHeight: 1.7, margin: 0 }}>
                  <InlineMarkdown text={line.trim().slice(2)} />
                </p>
              </div>
            );
          }
          return (
            <p key={`${seg.id}-${i}`} style={{ fontSize: '0.95rem', color: C.body, lineHeight: 1.7, margin: 0 }}>
              <InlineMarkdown text={line} />
            </p>
          );
        });
      })}
    </div>
  );
}

// ─── Code template parser ─────────────────────────────────────────────────────
// Splits "some code ______ more code" into text/blank segments.
export function parseTemplate(template) {
  const parts = [], regex = /_{2,}/g;
  let lastIndex = 0, match, blankCount = 0;
  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', content: template.slice(lastIndex, match.index) });
    parts.push({ type: 'blank', index: blankCount++ });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < template.length) parts.push({ type: 'text', content: template.slice(lastIndex) });
  return { parts, blankCount };
}

// ─── Assemble final runnable code ─────────────────────────────────────────────
export function assembleCode(parts, filledValues) {
  return parts.map((p) => p.type === 'text' ? p.content : filledValues[p.index] ?? '_____').join('');
}
