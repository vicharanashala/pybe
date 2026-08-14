import React from 'react';
import { Terminal as TerminalIcon, Play, Trash2 } from 'lucide-react';
import { GadgetShell } from './GadgetShell';

interface TerminalProps {
  stdout: string;
  error: string | null;
  isLoading: boolean;
  onClear: () => void;
  onRun: () => void;
  isRunning?: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ 
  stdout, 
  error, 
  isLoading, 
  onClear, 
  onRun,
  isRunning = false 
}) => {
  return (
    <GadgetShell 
      gadgetId="GD-02" 
      gadgetName="Pocket Console" 
      status={isRunning ? 'running' : error ? 'error' : 'idle'}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(3, 7, 18, 0.95)',
        overflow: 'hidden'
      }}>
        {/* Title / Action bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 18px',
          backgroundColor: '#070b14',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
            <TerminalIcon size={16} />
            <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Terminal Output</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={onClear} 
              title="Clear Console"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
            >
              <Trash2 size={14} />
            </button>
            
            <button 
              onClick={onRun} 
              disabled={isLoading || isRunning}
              style={{
                background: 'hsl(var(--primary))',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                opacity: isLoading || isRunning ? 0.6 : 1,
                transition: 'all 0.2s',
                boxShadow: '0 4px 10px rgba(0, 140, 255, 0.2)'
              }}
            >
              {isRunning ? (
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <Play size={10} fill="white" />
              )}
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Console output display */}
        <div 
          className="terminal-console"
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative'
          }}
        >
          {isLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(3, 7, 18, 0.85)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              color: '#38bdf8',
              fontSize: '12px',
              zIndex: 10
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid #008cff',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span>Initializing Python Engine (Pyodide)...</span>
            </div>
          )}

          {!stdout && !error && !isLoading && (
            <div style={{ color: '#475569', fontSize: '12px', fontStyle: 'italic', fontFamily: 'var(--font-mono)' }}>
              # Python WebAssembly Console. Write code above and hit Run.
            </div>
          )}

          {stdout && (
            <pre style={{ 
              margin: 0, 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all', 
              color: '#e2e8f0', 
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: 1.5 
            }}>
              {stdout}
            </pre>
          )}

          {error && (
            <pre className="terminal-error" style={{ 
              margin: 0, 
              whiteSpace: 'pre-wrap', 
              wordBreak: 'break-all', 
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              lineHeight: 1.5 
            }}>
              {error}
            </pre>
          )}
        </div>
      </div>
    </GadgetShell>
  );
};
export default Terminal;
