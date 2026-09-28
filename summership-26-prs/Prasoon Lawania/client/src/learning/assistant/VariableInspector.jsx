import React, { useState } from 'react';
import { C } from '../utils.jsx';

export default function VariableInspector({ variables = {}, trace = [], executionTime = '0.00' }) {
  const [isOpen, setIsOpen] = useState(true);

  const hasVariables = Object.keys(variables).length > 0;
  
  // Extract loop iterations from the trace
  const iterations = (() => {
    if (!trace || trace.length === 0) return [];
    
    // Find lines executed more than once
    const lineHits = {};
    trace.forEach(step => {
      lineHits[step.line] = (lineHits[step.line] || 0) + 1;
    });

    const loopLines = Object.keys(lineHits)
      .map(Number)
      .filter(line => lineHits[line] > 1);
      
    if (loopLines.length === 0) return [];

    // The loop header is typically the smallest line number in the repeatedly hit lines
    const loopHeader = Math.min(...loopLines);
    
    const visits = [];
    let iterCount = 1;
    
    trace.forEach(step => {
      if (step.line === loopHeader) {
        // Exclude internal helper keys if any
        const filteredLocals = {};
        for (const [k, v] of Object.entries(step.locals)) {
          filteredLocals[k] = v;
        }
        visits.push({
          number: iterCount++,
          variables: filteredLocals
        });
      }
    });
    
    return visits;
  })();

  const formatValue = (val) => {
    if (val === null) return 'None';
    if (val === true) return 'True';
    if (val === false) return 'False';
    if (typeof val === 'string') return `"${val}"`;
    if (Array.isArray(val)) {
      return `[${val.map(formatValue).join(', ')}]`;
    }
    if (typeof val === 'object') {
      return `{ ${Object.entries(val).map(([k, v]) => `${k}: ${formatValue(v)}`).join(', ')} }`;
    }
    return String(val);
  };

  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: '1rem',
      boxShadow: '0 4px 12px rgba(40,34,23,.03)',
      animation: 'csFadeIn .3s ease-out'
    }}>
      {/* Header bar / Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: C.darkBg,
          color: C.darkText,
          border: 'none',
          padding: '0.8rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          fontWeight: 700,
          textAlign: 'left'
        }}
      >
        <span>🔍 EXECUTION DETAILS (VARIABLE INSPECTOR)</span>
        <span>{isOpen ? '▲ Collapse' : '▼ Expand'}</span>
      </button>

      {isOpen && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Execution Time */}
          <div style={{ fontSize: '0.8rem', color: C.muted, borderBottom: `1px dashed ${C.border}`, paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>⏱️ Execution Duration</span>
            <strong style={{ color: C.text }}>{executionTime} ms</strong>
          </div>

          {/* Active Variable States */}
          <div>
            <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: C.label, margin: '0 0 0.6rem 0', letterSpacing: '0.08em' }}>
              Final Variable States
            </h4>
            {hasVariables ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {Object.entries(variables).map(([name, val]) => (
                  <div key={name} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                    <strong style={{ color: C.accent }}>{name}</strong>
                    <span style={{ color: C.muted }}>=</span>
                    <span style={{ color: C.text, wordBreak: 'break-all' }}>{formatValue(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: C.muted, margin: 0, fontStyle: 'italic' }}>
                No active variables defined in this scope.
              </p>
            )}
          </div>

          {/* Loop Iterations Trace */}
          {iterations.length > 0 && (
            <div style={{ borderTop: `1px dashed ${C.border}`, paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: C.label, margin: '0 0 0.6rem 0', letterSpacing: '0.08em' }}>
                🔄 Loop Execution Trace ({iterations.length} Iterations)
              </h4>
              <div style={{
                background: '#16231f',
                borderRadius: 8,
                padding: '0.8rem 1rem',
                maxHeight: '180px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontFamily: 'monospace',
                fontSize: '0.82rem'
              }}>
                {iterations.map((iter) => (
                  <div key={iter.number} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', borderBottom: iter.number < iterations.length ? '1px solid rgba(255,255,255,.05)' : 'none', paddingBottom: iter.number < iterations.length ? '0.4rem' : 0 }}>
                    <span style={{ color: '#d8f07c', fontWeight: 700 }}>Iteration {iter.number}</span>
                    <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', color: '#a7f3d0', paddingLeft: '0.5rem' }}>
                      {Object.entries(iter.variables).length > 0 ? (
                        Object.entries(iter.variables).map(([name, val]) => (
                          <span key={name}>
                            <strong>{name}</strong>: {formatValue(val)}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#8fa099', fontStyle: 'italic' }}>no locals active</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
