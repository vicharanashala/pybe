import React, { useState, useMemo } from 'react';
import { usePyodide, runPython } from './usePyodide.js';
import { C, parseTemplate, assembleCode } from './utils.jsx';

// ─── Code display with interactive blank slots ────────────────────────────────
function CodeDisplay({ parts, filledValues, currentBlankIndex }) {
  return (
    <pre style={{
      background: '#111916', border: '1px solid #2a3d35', borderRadius: 12,
      padding: '1.25rem 1.5rem', fontFamily: 'monospace', fontSize: '0.88rem',
      lineHeight: 1.75, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    }}>
      {parts.map((part, i) => {
        if (part.type === 'text') return <span key={i} style={{ color: '#e6f2eb' }}>{part.content}</span>;

        const filled   = filledValues[part.index];
        const isActive = part.index === currentBlankIndex && !filled;

        return (
          <span key={i} style={{
            display: 'inline-block', minWidth: 80, padding: '1px 10px', borderRadius: 4,
            background: filled   ? 'rgba(74,222,128,.15)'
                      : isActive ? 'rgba(216,240,124,.2)'
                      : 'rgba(255,255,255,.04)',
            border: filled   ? '1px solid rgba(74,222,128,.5)'
                  : isActive ? '1px solid #d8f07c'
                  : '1px dashed #2a3d35',
            color: filled   ? '#4ade80'
                 : isActive ? '#d8f07c'
                 : '#8a9e97',
            animation: isActive ? 'blankPulse 1.8s ease-in-out infinite' : 'none',
            textAlign: 'center', fontSize: '0.85rem', fontWeight: filled ? 600 : 400,
          }}>
            {filled ?? (isActive ? '▮ fill' : '···')}
          </span>
        );
      })}
      <style>{`@keyframes blankPulse { 0%,100%{box-shadow:0 0 0 0 rgba(216,240,124,.3)} 50%{box-shadow:0 0 0 5px rgba(216,240,124,0)} }`}</style>
    </pre>
  );
}

// ─── Clickable token chip ─────────────────────────────────────────────────────
function TokenButton({ token, onClick, used, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <button
        onClick={() => !used && onClick(token)}
        disabled={used}
        style={{
          background: used ? 'transparent' : C.cardBg,
          border: used ? `1px solid ${C.border}` : `1px solid ${C.accentBorder}`,
          borderRadius: 8, padding: '0.45rem 0.9rem',
          color: used ? C.muted : C.accent,
          fontFamily: 'monospace', fontSize: '0.82rem',
          cursor: used ? 'not-allowed' : 'pointer',
          opacity: used ? 0.4 : 1, transition: 'all .18s ease', whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => { if (!used) { e.currentTarget.style.background = C.accentBg; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
        onMouseLeave={(e) => { if (!used) { e.currentTarget.style.background = C.cardBg;   e.currentTarget.style.transform = 'translateY(0)'; } }}
      >
        {token.value}
      </button>
      {hint && (
        <p style={{ fontSize: '0.72rem', color: C.warning, padding: '0.25rem 0.5rem', background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)', borderRadius: 6, margin: 0 }}>
          ⚠️ {hint}
        </p>
      )}
    </div>
  );
}

// ─── Terminal output panel ────────────────────────────────────────────────────
function TerminalOutput({ output, error }) {
  return (
    <div style={{ background: '#111916', border: `1px solid ${error ? 'rgba(248,113,113,.4)' : 'rgba(74,222,128,.3)'}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: error ? '#f87171' : '#4ade80', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', marginTop: 0 }}>
        {error ? '✕ Error' : '✓ Output'}
      </p>
      <pre style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: error ? '#f87171' : '#4ade80', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.6 }}>
        {error || output}
      </pre>
    </div>
  );
}

// ─── Stage 3 Guided Code Build ─────────────────────────────────────────────
export default function Stage3CodeBuild({ caseStudy, onComplete }) {
  const { stage3 } = caseStudy;
  const { codeTemplate, tokens } = stage3;

  const { pyodide, loading: pyodideLoading, error: pyodideError } = usePyodide();

  const { parts, blankCount } = useMemo(() => parseTemplate(codeTemplate), [codeTemplate]);

  // Correct tokens in fill order (uses correctOrder if provided for multi-blank cases)
  const correctTokensInOrder = useMemo(() => {
    if (stage3.correctOrder) return stage3.correctOrder.map((val) => ({ value: val }));
    return tokens.filter((t) => t.correct);
  }, [tokens, stage3.correctOrder]);

  // Shuffle display order so the correct token is not always first
  const shuffledTokens = useMemo(() => {
    const arr = [...tokens];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [tokens]);

  const [filledValues, setFilledValues] = useState({});
  const [tokenHints, setTokenHints]     = useState({});
  const [runOutput, setRunOutput]       = useState(null);
  const [running, setRunning]           = useState(false);
  const [completed, setCompleted]       = useState(false);

  const currentBlankIndex = Object.keys(filledValues).length;
  const allBlanksFilled   = currentBlankIndex >= blankCount;
  const isFreeForm        = blankCount === 0 && tokens.length === 0;

  const handleTokenClick = (token, tokenIndex) => {
    if (allBlanksFilled) return;
    const correctToken = correctTokensInOrder[currentBlankIndex];
    if (token.value === correctToken?.value) {
      setFilledValues((prev) => ({ ...prev, [currentBlankIndex]: token.value }));
      setTokenHints({});
    } else {
      setTokenHints((prev) => ({ ...prev, [tokenIndex]: token.hint || 'Not quite try a different option.' }));
    }
  };

  const handleRun = async () => {
    if (!pyodide) return;
    setRunning(true); setRunOutput(null);
    const assembled = assembleCode(parts, filledValues);
    const result    = await runPython(pyodide, assembled);
    setRunOutput(result); setRunning(false);
    if (!result.error) setCompleted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'csFadeIn .4s ease-out' }}>
      {/* ── Header badge ── */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.3)', borderRadius: '2rem', padding: '0.3rem 0.9rem', fontSize: '0.75rem', fontWeight: 700, color: C.success, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          ⚡ Guided Code Build
        </div>
        <p style={{ color: C.muted, fontSize: '0.88rem', margin: 0 }}>
          {isFreeForm
            ? 'Open-ended exercise design your own case study.'
            : allBlanksFilled
            ? 'All blanks filled! Run the code to see it in action.'
            : `Fill blank ${currentBlankIndex + 1} of ${blankCount} click the correct token below.`}
        </p>
      </div>

      <CodeDisplay parts={parts} filledValues={filledValues} currentBlankIndex={currentBlankIndex} />

      {/* ── Pyodide status ── */}
      {pyodideLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: C.muted, fontSize: '0.85rem' }}>
          <div style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderTop: '2px solid #7b9f27', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
          Loading Python engine…
          <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
        </div>
      )}
      {pyodideError && <p style={{ color: C.error, fontSize: '0.85rem', margin: 0 }}>⚠️ Could not load Python engine: {pyodideError}</p>}

      {/* ── Token palette ── */}
      {!isFreeForm && tokens.length > 0 && !allBlanksFilled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.label, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            Available tokens
          </p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {shuffledTokens.map((token, i) => {
              // How many times this token value must be placed in blanks (0 = wrong token)
              const quota    = correctTokensInOrder.filter(t => t.value === token.value).length;
              // How many times it has already been placed
              const timesPlaced = Object.values(filledValues).filter(v => v === token.value).length;
              // Only exhaust a token if it has a quota > 0 (correct tokens only)
              const isUsed   = quota > 0 && timesPlaced >= quota;
              return (
                <TokenButton
                  key={i}
                  token={token}
                  onClick={() => handleTokenClick(token, i)}
                  used={isUsed}
                  hint={tokenHints[i]}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Run button ── */}
      {(allBlanksFilled || isFreeForm) && pyodide && !completed && (
        <button
          onClick={handleRun}
          disabled={running}
          style={{
            background: running ? C.cardBg : C.darkBg,
            color: running ? C.muted : C.darkText,
            border: `1px solid ${C.border}`, borderRadius: 10,
            padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: 700,
            cursor: running ? 'not-allowed' : 'pointer', alignSelf: 'flex-start',
            display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all .2s ease',
          }}
        >
          {running
            ? (<><div style={{ width: 14, height: 14, border: '2px solid transparent', borderTop: `2px solid ${C.muted}`, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />Running…</>)
            : '▶ Run Code'}
        </button>
      )}

      {runOutput && <TerminalOutput output={runOutput.output} error={runOutput.error} />}

      {/* ── Success card + Continue ── */}
      {completed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'csFadeIn .4s ease-out' }}>
          <div style={{ background: 'rgba(74,222,128,.07)', border: '1px solid rgba(74,222,128,.3)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🎉</span>
            <div>
              <p style={{ fontWeight: 600, color: C.success, fontSize: '0.95rem', margin: 0 }}>Code ran successfully!</p>
              <p style={{ color: C.muted, fontSize: '0.82rem', margin: '0.2rem 0 0' }}>You've completed this case study.</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onComplete}
              style={{ background: C.darkBg, color: C.darkText, border: 'none', borderRadius: 10, padding: '0.75rem 1.75rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
