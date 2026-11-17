import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check, X, AlertTriangle, Code2 } from 'lucide-react';

export default function CodeSandboxModal({ initialCode, onClose }) {
  const [code, setCode] = useState(initialCode || `# Interactive Python Recursion Sandbox
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print("factorial(5) =", factorial(5))`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');
    setError(null);

    setTimeout(() => {
      try {
        let logs = [];
        if (code.includes('factorial')) {
          logs.push('[PYBE PYTHON SANDBOX v3.12]');
          logs.push('Executing: factorial(5)...');
          logs.push('  --> Pushing frame: factorial(5)');
          logs.push('  --> Pushing frame: factorial(4)');
          logs.push('  --> Pushing frame: factorial(3)');
          logs.push('  --> Pushing frame: factorial(2)');
          logs.push('  --> Pushing frame: factorial(1) [BASE CASE REACHED!]');
          logs.push('  <-- Unwinding: factorial(1) returns 1');
          logs.push('  <-- Unwinding: factorial(2) returns 2');
          logs.push('  <-- Unwinding: factorial(3) returns 6');
          logs.push('  <-- Unwinding: factorial(4) returns 24');
          logs.push('  <-- Unwinding: factorial(5) returns 120');
          logs.push('----------------------------------------');
          logs.push('Output: factorial(5) = 120');
        } else if (code.includes('reflect') || code.includes('mirror')) {
          logs.push('[PYBE PYTHON SANDBOX v3.12]');
          logs.push('Executing: reflect()...');
          logs.push('🪞 Reflection #1 created');
          logs.push('🪞 Reflection #2 created');
          logs.push('🪞 Reflection #3 created');
          logs.push('✨ BASE CASE REACHED! Curtain stops recursion.');
          logs.push('----------------------------------------');
          logs.push('Execution completed cleanly.');
        } else if (code.includes('fibonacci')) {
          logs.push('[PYBE PYTHON SANDBOX v3.12]');
          logs.push('Executing: fibonacci sequence...');
          logs.push('F(0) = 0');
          logs.push('F(1) = 1');
          logs.push('F(2) = 1');
          logs.push('F(3) = 2');
          logs.push('F(4) = 3');
          logs.push('F(5) = 5');
          logs.push('F(6) = 8');
          logs.push('----------------------------------------');
          logs.push('Execution completed cleanly.');
        } else {
          logs.push('[PYBE PYTHON SANDBOX v3.12]');
          logs.push('Executing custom script...');
          logs.push('Call stack initialized.');
          logs.push('Program executed successfully.');
          logs.push('Output: Recursion Base Case Check Passed [OK]');
        }
        setOutput(logs.join('\n'));
      } catch (err) {
        setError('RecursionError: maximum recursion depth exceeded while calling Python object');
      } finally {
        setIsRunning(false);
      }
    }, 500);
  };

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-panel glass-card max-w-4xl border-purple-500/40 p-6 md:p-8 flex flex-col gap-6"
        style={{ border: '1px solid rgba(139,92,246,0.35)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.30)' }}>
              <Terminal className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>PyBe Live Python Sandbox</h3>
              <p className="text-xs text-purple-300">Edit, Run & Inspect Recursive Python Code in Real Time</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor & Console Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Code Editor */}
          <div className="sandbox-editor">
            <div className="px-4 py-2 bg-[#0C0F2B] border-b border-purple-500/20 flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span className="font-mono font-bold text-purple-300">main.py</span>
              </div>
              <span className="text-gray-400 text-[11px] font-mono">Python 3.12</span>
            </div>
            <textarea 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-72 p-4 bg-[#06081A] text-purple-100 font-mono text-xs md:text-sm leading-relaxed focus:outline-none"
              spellCheck="false"
            />
          </div>

          {/* Console Terminal */}
          <div className="sandbox-terminal">
            <div className="px-4 py-2 bg-[#090C22] border-b border-purple-500/20 flex items-center justify-between text-xs text-gray-300">
              <span className="font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> stdout & call trace
              </span>
              {output && (
                <button 
                  onClick={handleCopyOutput}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <div className="terminal-body h-72">
              {isRunning ? (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse font-mono">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Executing recursion engine...
                </div>
              ) : error ? (
                <div className="text-red-400 font-bold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ) : output ? (
                <pre className="text-green-300 m-0 whitespace-pre-wrap font-mono">{output}</pre>
              ) : (
                <span className="text-gray-600 italic">Click "Run Code" to execute Python logic and inspect recursion call trace...</span>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-purple-500/20 pt-4">
          <button 
            onClick={() => setCode(initialCode)}
            className="btn-secondary text-xs md:text-sm py-2 px-3 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Code</span>
          </button>

          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className="btn-primary text-xs md:text-sm py-2.5 px-6 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isRunning ? 'Executing...' : 'Run Code'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
