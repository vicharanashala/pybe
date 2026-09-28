import React from 'react';

// ─── Shared colour tokens for the Learning page ───────────────────────────────
export const C = {
  text:       '#ffffff',   // headings white
  body:       '#a4b3bf',   // readable light grey-blue text
  muted:      '#7f93a1',   // secondary labels, hints, counts
  label:      '#00f3ff',   // bright cyberpunk cyan
  success:    '#39ff14',   // neon green
  error:      '#ff007f',   // neon pink
  warning:    '#ffea00',   // neon yellow
  accent:     '#00f3ff',   // neon cyan
  accentBg:   'rgba(0, 243, 255, 0.05)',
  accentBorder:'#1c2730',
  border:     '#1c2730',
  cardBg:     '#12181e',   // dark iron card bg
  darkBg:     '#070a0e',   // pure black code bg
  darkText:   '#39ff14',   // glowing green terminal text
};

// ─── Inline markdown renderer ─────────────────────────────────────────────────
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
        <code key={key++} style={{ background: 'rgba(0, 243, 255, 0.12)', border: `1px solid ${C.accentBorder}`, borderRadius: 3, padding: '1px 6px', fontFamily: 'monospace', fontSize: '0.88em', color: C.accent }}>
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
            <pre key={seg.id} style={{ background: '#070a0e', color: '#39ff14', border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px', margin: 0, fontFamily: 'monospace', fontSize: '0.88rem', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
              {seg.content}
            </pre>
          );
        }
        return seg.content.split('\n').map((line, i) => {
          if (!line.trim()) return <div key={`${seg.id}-${i}`} style={{ height: '0.3rem' }} />;
          if (line.trim().startsWith('- ')) {
            return (
              <div key={`${seg.id}-${i}`} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f3ff', flexShrink: 0, marginTop: 8 }} />
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
