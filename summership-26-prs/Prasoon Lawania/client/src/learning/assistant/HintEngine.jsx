import React from 'react';
import { C, InlineMarkdown } from '../utils.jsx';

export default function HintEngine({ hintObj, attempts }) {
  if (!hintObj || !hintObj.hint) {
    return (
      <div style={{
        background: '#fffdf7',
        border: `1px dashed ${C.border}`,
        borderRadius: 8,
        padding: '0.8rem 1rem',
        fontSize: '0.82rem',
        color: C.muted,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        💡 <span>Stuck? Repeated incorrect attempts will unlock progressive hints.</span>
      </div>
    );
  }

  const { hint, level, reveal } = hintObj;
  
  // Levels are:
  // 1: Concept
  // 2: Syntax
  // 3: Example
  // 4: Reveal / Explanation
  const maxLevels = 4;
  const levelLabel = 
    level === 1 ? 'Concept' :
    level === 2 ? 'Syntax' :
    level === 3 ? 'Example' :
    'Explanation & Answer';

  return (
    <div style={{
      background: reveal ? 'rgba(74,222,128,.05)' : 'rgba(251,191,36,.06)',
      border: reveal ? `1px solid rgba(74,222,128,.3)` : `1px solid rgba(251,191,36,.3)`,
      borderRadius: 10,
      padding: '1rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      animation: 'csFadeIn .3s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: reveal ? C.success : C.warning,
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          💡 Hint {level} of {maxLevels}: {levelLabel}
        </span>
        <span style={{ fontSize: '0.72rem', color: C.muted }}>
          Attempts: {attempts}
        </span>
      </div>
      <p style={{
        fontSize: '0.88rem',
        color: C.body,
        lineHeight: 1.6,
        margin: 0,
        fontWeight: reveal ? 600 : 400
      }}>
        <InlineMarkdown text={hint} />
      </p>
    </div>
  );
}
