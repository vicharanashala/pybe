import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import usePyodide from './hooks/usePyodide';
import { Play, Terminal } from 'lucide-react';
import CompanionGuide from './CompanionGuide';
import './styles.css';

export default function PythonSandbox({ scenario, learnerName }) {
  const [code, setCode] = useState('# Select a scenario to load starter code');
  const { isLoading, output, runCode, pyodide } = usePyodide();
  const [isExecuting, setIsExecuting] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [rewardMsg, setRewardMsg] = useState('');

  useEffect(() => {
    if (scenario && scenario.starter_code) {
      setCode(scenario.starter_code);
      setValidationStatus(null);
      setRewardMsg('');
    }
  }, [scenario]);

  const handleRun = async () => {
    setIsExecuting(true);
    setValidationStatus(null);
    setRewardMsg('');
    
    const result = await runCode(code);
    
    if (result.success && scenario?.validation_tests?.length > 0) {
      try {
        pyodide.globals.set('__output__', result.stdout);
        const validationScript = scenario.validation_tests.join('\n');
        await pyodide.runPythonAsync(validationScript);
        setValidationStatus('success');
        
        // Trigger XP Reward
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${API_URL}/leaderboard/reward`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ learnerName, scenarioId: scenario._id })
        });
        
        if (res.ok) {
          const data = await res.json();
          setRewardMsg(`+${data.xpRewarded} XP Earned!`);
        }
      } catch (err) {
        setValidationStatus('error');
        console.error('Validation failed:', err);
      }
    } else if (!result.success) {
      setValidationStatus('error');
    }
    
    setIsExecuting(false);
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      {validationStatus === 'success' && (
        <CompanionGuide
          type="success"
          title="Tests Passed!"
          message={`All scenario tests passed smoothly! ${rewardMsg}`}
        />
      )}
      {validationStatus === 'error' && (
        <CompanionGuide
          type="hint"
          title="Tests Need Attention"
          message="One or more tests failed. Check your logic and stdout output in the terminal below!"
        />
      )}

      {/* Code Editor Card */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-lg">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-amber-100">
          <h3 className="m-0 font-extrabold text-slate-800 text-lg">Scenario Code Editor</h3>
          <button 
            className="px-5 py-2.5 bg-[#C85A32] hover:bg-[#B34927] text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50" 
            onClick={handleRun} 
            disabled={isLoading || isExecuting || !scenario}
          >
            <Play size={16} /> {isLoading ? 'Loading Pyodide...' : isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>

        <div className={`bg-[#FFFDF9] rounded-2xl border transition-all ${
          validationStatus === 'success' ? 'border-emerald-400 ring-2 ring-emerald-200' : validationStatus === 'error' ? 'border-rose-400 ring-2 ring-rose-200' : 'border-amber-300'
        } overflow-hidden shadow-inner`}>
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => Prism.highlight(code, Prism.languages.python, 'python')}
            padding={20}
            style={{
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: 15,
              backgroundColor: '#FFFDF9',
              color: '#1E293B',
              minHeight: '220px'
            }}
          />
        </div>
      </div>

      {/* Terminal Output */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 color-teal-300 shadow-xl">
        <div className="flex items-center gap-2 mb-3 text-teal-400 border-b border-slate-800 pb-3 font-mono text-xs uppercase tracking-wider font-bold">
          <Terminal size={18} />
          <span>Terminal Output</span>
        </div>
        <pre className="m-0 whitespace-pre-wrap font-mono text-sm text-teal-300 leading-relaxed">
          {output || '> Ready...'}
        </pre>
      </div>
    </div>
  );
}
