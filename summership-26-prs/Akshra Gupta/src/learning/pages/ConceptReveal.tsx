import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Sparkles, Terminal, ChevronDown } from 'lucide-react';
import { SetAnimator } from './SetAnimator';

// ── Syntax token colours (manual, no library needed) ─────────
interface Token { text: string; color: string }

function tokenise(line: string): Token[] {
  // Very simple rule-based colouring for our specific code lines
  const KEYWORD  = '#c792ea';   // purple  — def / in / not in
  const BUILTIN  = '#82aaff';   // blue    — set()
  const STRING   = '#c3e88d';   // green   — "strings"
  const COMMENT  = '#546e7a';   // grey    — # ...
  const NUMBER   = '#f78c6c';   // orange  — digits
  const VAR      = '#eeffff';   // white   — identifiers
  const PUNCT    = '#89ddff';   // cyan    — {  }  ,  (  )

  if (line.trimStart().startsWith('#')) {
    return [{ text: line, color: COMMENT }];
  }

  const tokens: Token[] = [];
  // Tokenise character-by-character (good enough for 4 demo lines)
  let i = 0;
  while (i < line.length) {
    // Comment mid-line
    if (line[i] === '#') { tokens.push({ text: line.slice(i), color: COMMENT }); break; }
    // String
    if (line[i] === '"' || line[i] === "'") {
      const q = line[i]; let j = i + 1;
      while (j < line.length && line[j] !== q) j++;
      tokens.push({ text: line.slice(i, j + 1), color: STRING }); i = j + 1; continue;
    }
    // Number
    if (/[0-9]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[0-9]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: NUMBER }); i = j; continue;
    }
    // Word
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const KEYWORDS = ['in', 'not', 'print', 'True', 'False'];
      const BUILTINS = ['set'];
      let color = VAR;
      if (KEYWORDS.includes(word)) color = KEYWORD;
      if (BUILTINS.includes(word))  color = BUILTIN;
      tokens.push({ text: word, color }); i = j; continue;
    }
    // Punctuation
    if ('{}(),='.includes(line[i])) {
      tokens.push({ text: line[i], color: PUNCT }); i++; continue;
    }
    tokens.push({ text: line[i], color: VAR }); i++;
  }
  return tokens;
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const lines = code.split('\n');
  return (
    <div style={{ borderRadius: '12px', border: '1px solid rgba(0,140,255,0.2)', overflow: 'hidden' }}>
      <div style={{
        padding: '8px 14px',
        background: 'rgba(0,140,255,0.08)',
        borderBottom: '1px solid rgba(0,140,255,0.12)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <Terminal size={13} style={{ color: '#38bdf8' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#38bdf8', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      <pre style={{
        background: '#0d1117', margin: 0, padding: '16px 18px',
        fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.8,
        overflowX: 'auto',
      }}>
        {lines.map((line, li) => (
          <div key={li}>
            {tokenise(line).map((tok, ti) => (
              <span key={ti} style={{ color: tok.color }}>{tok.text}</span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}

// ── The two things to connect ─────────────────────────────────
const RULE_ITEMS = [
  { rule: 'No item may appear more than once', python: 'Duplicates are silently ignored on insertion' },
  { rule: 'You only keep items you have not seen', python: 'Python tracks uniqueness automatically' },
  { rule: 'The order of stamps did not matter', python: 'A Set has no fixed order' },
];

// ── FAQ toggles — minimal extra theory ───────────────────────
const FAQS = [
  {
    q: 'What does { } mean here?',
    a: 'Curly braces create a Set when they contain values. An empty { } means a dictionary — use set() for an empty Set.',
  },
  {
    q: "Can a Set hold any type of item?",
    a: 'Items must be immutable — numbers, strings, and tuples are fine. Lists cannot go inside a Set.',
  },
];

// ── Component ─────────────────────────────────────────────────
export const ConceptReveal: React.FC = () => {
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [stampRevealed, setStampRevealed] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }} className="animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>CONCEPT REVEAL</span>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Python Already Has This.
        </h2>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
          The rule you discovered — <em>"no item may appear more than once"</em> — is built into Python as a data type called a <strong style={{ color: '#008cff' }}>Set</strong>.
        </p>
      </div>

      {/* Bridge: your rule → Python's rule */}
      <GlassCard style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Your rule → Python's behaviour
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {RULE_ITEMS.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'stretch', gap: '0',
              borderRadius: '10px', overflow: 'hidden',
              border: '1px solid rgba(0,140,255,0.1)',
            }}>
              <div style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(245,158,11,0.06)',
                borderRight: '1px solid rgba(0,140,255,0.1)',
                fontSize: '13px', fontWeight: 600, color: '#78350f', lineHeight: 1.5,
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ marginRight: '8px', fontSize: '14px' }}>📋</span>
                {item.rule}
              </div>
              <div style={{
                flex: 1, padding: '10px 14px',
                background: 'rgba(0,140,255,0.04)',
                fontSize: '13px', fontWeight: 600, color: '#0369a1', lineHeight: 1.5,
                display: 'flex', alignItems: 'center',
              }}>
                <span style={{ marginRight: '8px', fontSize: '14px' }}>🐍</span>
                {item.python}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Name reveal — dramatic moment */}
      <GlassCard style={{
        padding: '22px 24px',
        background: 'linear-gradient(135deg, rgba(0,140,255,0.06) 0%, rgba(255,255,255,0.85) 100%)',
        border: '2px solid rgba(0,140,255,0.25)',
      }}>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 16px' }}>
          Doraemon holds up a glowing blueprint:
        </p>
        <div style={{
          padding: '18px 22px', borderRadius: '14px',
          background: 'white', border: '1.5px solid rgba(0,140,255,0.2)',
          marginBottom: '16px',
          boxShadow: '0 4px 20px rgba(0,140,255,0.08)',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            In Python, a Set is written as:
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '20px',
            fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px',
          }}>
            <span style={{ color: '#89ddff' }}>{'{'}</span>
            <span style={{ color: '#f78c6c' }}>value1</span>
            <span style={{ color: '#475569' }}>, </span>
            <span style={{ color: '#f78c6c' }}>value2</span>
            <span style={{ color: '#475569' }}>, </span>
            <span style={{ color: '#f78c6c' }}>value3</span>
            <span style={{ color: '#89ddff' }}>{'}'}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
            Each value inside will appear <strong>exactly once</strong> — Python enforces that rule for you.
          </div>
        </div>

        {/* Live stamp demo */}
        <div>
          <button
            onClick={() => setStampRevealed(true)}
            disabled={stampRevealed}
            style={{
              padding: '10px 20px', borderRadius: '10px',
              background: stampRevealed ? 'rgba(34,197,94,0.08)' : 'rgba(0,140,255,0.09)',
              border: stampRevealed ? '1.5px solid rgba(34,197,94,0.3)' : '1.5px solid rgba(0,140,255,0.3)',
              color: stampRevealed ? '#15803d' : '#0369a1',
              fontWeight: 700, fontSize: '13px', cursor: stampRevealed ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {stampRevealed ? '✅' : '🤖'} {stampRevealed ? "Doraemon's unique pile" : "Show me Nobita's stamps as a Set"}
          </button>

          {stampRevealed && (
            <div style={{ marginTop: '14px' }} className="animate-fade-in">
              <CodeBlock
                label="PYTHON — NOBITA'S STAMPS"
                code={`stamps = {"T-Rex", "Triceratops", "Brachiosaurus", "Pterodactyl", "Stegosaurus"}\n\n# Try adding one that's already in there:\nstamps.add("T-Rex")\nstamps.add("T-Rex")\n\nprint(stamps)  # Still only 5 — no duplicates\nprint("T-Rex" in stamps)  # True\nprint("Ankylosaurus" in stamps)  # False`}
              />
              <div style={{
                marginTop: '10px', padding: '12px 14px', borderRadius: '10px',
                background: 'rgba(34,197,94,0.06)', border: '1px dashed rgba(34,197,94,0.3)',
                fontSize: '12px', color: '#15803d', fontWeight: 600,
              }}>
                Python's Set silently ignored the duplicate "T-Rex" additions — exactly what you did manually in Exploration.
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* 3 things to remember — minimal, no bloat */}
      <GlassCard style={{ padding: '18px 22px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          3 things to remember
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: '🚫', text: 'No duplicates — ever. Python refuses them silently.' },
            { icon: '🔀', text: 'No guaranteed order — items may appear in any sequence when printed.' },
            { icon: '⚡', text: 'Checking membership ("is X in this Set?") is instant, regardless of size.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '10px 14px', borderRadius: '9px',
              background: 'rgba(0,140,255,0.03)', border: '1px solid rgba(0,140,255,0.08)',
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Animated visual — stamp-by-stamp deduplication */}
      <SetAnimator />

      {/* Optional FAQs — collapsed by default */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
          Quick questions
        </div>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderRadius: '10px', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            <button
              onClick={() => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }))}
              style={{
                width: '100%', textAlign: 'left', padding: '12px 16px',
                background: faqOpen[i] ? 'rgba(0,140,255,0.04)' : 'white',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: '13px', fontWeight: 600, color: '#0f172a',
              }}
            >
              {faq.q}
              <ChevronDown
                size={14}
                style={{ color: '#94a3b8', transform: faqOpen[i] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
              />
            </button>
            {faqOpen[i] && (
              <div style={{
                padding: '10px 16px 14px',
                fontSize: '13px', color: '#475569', lineHeight: 1.6,
                borderTop: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,140,255,0.02)',
              }} className="animate-fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConceptReveal;
