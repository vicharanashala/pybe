import React, { useRef } from 'react';
import { GadgetShell } from './GadgetShell';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onRun }) => {
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const numbersRef = useRef<HTMLDivElement>(null);

  // Sync scroll position between lines numbers and textarea
  const handleScroll = () => {
    if (textareaRef.current && numbersRef.current) {
      numbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Support indenting with tab key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const val = e.currentTarget.value;
      const newVal = val.substring(0, start) + '    ' + val.substring(end);
      onChange(newVal);
      
      // Put cursor back in correct spot asynchronously
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    } else if (e.key === 'Enter' && e.ctrlKey && onRun) {
      e.preventDefault();
      onRun();
    }
  };

  return (
    <GadgetShell gadgetId="GD-01" gadgetName="Anywhere Editor" status={code ? 'idle' : 'idle'}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0a0f1d',
        overflow: 'hidden'
      }}>
        {/* Editor Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 18px',
          backgroundColor: '#070b14',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--font-mono)', marginLeft: '12px' }}>
              main.py
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#475569', fontFamily: 'var(--font-mono)' }}>
            Ctrl + Enter to Run
          </span>
        </div>

        {/* Editor Main Content Area */}
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Line Numbers */}
          <div 
            ref={numbersRef}
            style={{
              width: '40px',
              padding: '16px 0',
              textAlign: 'right',
              paddingRight: '10px',
              backgroundColor: '#070b14',
              color: '#334155',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.6',
              userSelect: 'none',
              overflow: 'hidden',
              borderRight: '1px solid rgba(255, 255, 255, 0.04)'
            }}
          >
            {lineNumbers.map((num) => (
              <div key={num}>{num}</div>
            ))}
          </div>

          {/* Code Input Box */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            className="editor-textarea"
            style={{
              flex: 1,
              padding: '16px',
              height: '100%',
              outline: 'none',
              border: 'none',
              background: 'transparent',
              color: '#cbd5e1',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.6',
              overflowY: 'auto'
            }}
            placeholder="# Type your Python code here..."
            spellCheck={false}
          />
        </div>
      </div>
    </GadgetShell>
  );
};
export default CodeEditor;
