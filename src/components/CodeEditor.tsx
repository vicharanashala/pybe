import { useState, useEffect, useRef } from 'react';
import { usePythonRuntime } from './PythonRuntime';
import { Play, RotateCcw, Save, FileCode, Check, AlertCircle, ChevronDown, Sparkles, AlertTriangle, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProgress } from '../types';

interface CodeEditorProps {
  initialCode?: string;
  onRunSuccess?: (stdout: string) => void;
  onRunFailure?: (stderr: string) => void;
  onValidationFailure?: (actualOutput: string, expectedKeywords: string[]) => void;
  onValidationSuccess?: () => void;
  expectedOutputContains?: string[];
  lessonContext?: string;
  onCodeReview?: (feedback: string, isCorrect: boolean) => void;
  isSecureExercise?: boolean;
  progress?: UserProgress;
  onUpdateProgress?: (updater: (prev: UserProgress) => UserProgress) => void;
}

export default function CodeEditor({
  initialCode = '',
  onRunSuccess,
  onRunFailure,
  onValidationFailure,
  onValidationSuccess,
  expectedOutputContains,
  lessonContext = 'General Playground',
  onCodeReview,
  isSecureExercise = false,
  progress,
  onUpdateProgress,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [consoleOutput, setConsoleOutput] = useState<string>('Console loaded. Write some code and click "Run Code"!\n');
  const [isConsoleError, setIsConsoleError] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  const [showPasteWarning, setShowPasteWarning] = useState(false);

  // Check if paste protection is active
  let isPasteProtectionOn = true;
  if (progress !== undefined && progress.pasteProtectionEnabled !== undefined) {
    isPasteProtectionOn = progress.pasteProtectionEnabled;
  } else {
    try {
      const saved = localStorage.getItem('pyverse_user_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pasteProtectionEnabled !== undefined) {
          isPasteProtectionOn = parsed.pasteProtectionEnabled;
        }
      }
    } catch (e) {}
  }

  const triggerPasteAttempt = (pastedText: string) => {
    setShowPasteWarning(true);
    const exerciseContext = lessonContext || 'General Sandbox / Exercise';
    const attemptedText = pastedText ? pastedText.substring(0, 300) : 'N/A';

    if (onUpdateProgress) {
      onUpdateProgress((prev) => {
        const attempts = prev.pasteAttempts || [];
        const newAttempt = {
          id: `paste_${Date.now()}`,
          timestamp: new Date().toISOString(),
          exerciseContext,
          attemptedText,
        };
        return {
          ...prev,
          pasteAttempts: [newAttempt, ...attempts],
        };
      });
    } else {
      try {
        const saved = localStorage.getItem('pyverse_user_progress');
        if (saved) {
          const parsed = JSON.parse(saved);
          const attempts = parsed.pasteAttempts || [];
          const newAttempt = {
            id: `paste_${Date.now()}`,
            timestamp: new Date().toISOString(),
            exerciseContext,
            attemptedText,
          };
          parsed.pasteAttempts = [newAttempt, ...attempts];
          localStorage.setItem('pyverse_user_progress', JSON.stringify(parsed));
        }
      } catch (err) {
        console.error('Error saving paste attempt:', err);
      }
    }
  };

  const { isReady, isLoading, runPythonCode } = usePythonRuntime();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Handle auto-expanding text-area or line numbers
  const lines = code.split('\n');

  const handleRun = async () => {
    if (!isReady) {
      setConsoleOutput('Please wait, local WebAssembly Python compiler is initializing...\n');
      return;
    }
    setIsExecuting(true);
    setConsoleOutput((prev) => prev + '\n>>> RUNNING PYTHON CODE...\n');

    try {
      const result = await runPythonCode(code);
      if (result.success) {
        setIsConsoleError(false);
        setConsoleOutput(`>>> OUTPUT:\n${result.stdout || '(Code ran successfully with no print output)'}\n`);
        if (onRunSuccess) {
          onRunSuccess(result.stdout);
        }

        // Auto validation check if we have matching criteria
        if (expectedOutputContains && expectedOutputContains.length > 0) {
          const lowerOut = result.stdout.toLowerCase();
          const matches = expectedOutputContains.every((word) => lowerOut.includes(word.toLowerCase()));
          if (matches) {
            setConsoleOutput(
              (prev) => prev + '\n🏆 EXERCISE VERIFICATION: SUCCESSFUL! Code produced correct answers.\n'
            );
            if (onValidationSuccess) {
              onValidationSuccess();
            }
          } else {
            setConsoleOutput(
              (prev) =>
                prev +
                `\n⚠️ EXERCISE VERIFICATION: Output did not contain expected words: [${expectedOutputContains.join(
                  ', '
                )}]\n`
            );
            if (onValidationFailure) {
              onValidationFailure(result.stdout, expectedOutputContains);
            }
          }
        }
      } else {
        setIsConsoleError(true);
        setConsoleOutput(`>>> PYTHON ERROR:\n${result.stderr}\n`);
        if (onRunFailure) {
          onRunFailure(result.stderr);
        }
      }
    } catch (err: any) {
      setIsConsoleError(true);
      const errMsg = err.message || String(err);
      setConsoleOutput(`>>> EXECUTION ERROR:\n${errMsg}\n`);
      if (onRunFailure) {
        onRunFailure(errMsg);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem(`pyverse_saved_code_${lessonContext}`, code);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleLoadSaved = () => {
    const saved = localStorage.getItem(`pyverse_saved_code_${lessonContext}`);
    if (saved) {
      setCode(saved);
      setConsoleOutput((prev) => prev + '>>> Loaded previously saved code!\n');
    } else {
      setConsoleOutput((prev) => prev + '>>> No saved draft found for this topic.\n');
    }
  };

  const requestAIReview = async () => {
    if (reviewing) return;
    setReviewing(true);
    setReviewFeedback(null);
    setConsoleOutput((prev) => prev + '\n>>> CONTACTING AI TUTOR FOR DETAILED CODE REVIEWS...\n');

    try {
      const res = await fetch('/api/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          challengeContext: lessonContext,
          instruction: expectedOutputContains ? `Code must print values related to: ${expectedOutputContains.join(', ')}` : 'Create valid syntax'
        })
      });

      if (!res.ok) {
        throw new Error('Review API offline or failed.');
      }

      const data = await res.json();
      setReviewFeedback(data.feedback);
      setConsoleOutput((prev) => prev + `\n>>> AI REVIEW STATUS: ${data.isCorrect ? 'VALID' : 'DEVELOPING'} (Quality Score: ${data.score}/100)\n`);
      if (onCodeReview) {
        onCodeReview(data.feedback, data.isCorrect);
      }
    } catch (err: any) {
      console.error(err);
      setConsoleOutput((prev) => prev + '>>> AI REVIEW ERROR: AI Reviewer offline. Use standard Run button to execute local tests.\n');
    } finally {
      setReviewing(false);
    }
  };

  // Preset snippets
  const insertSnippet = (snippet: string) => {
    setCode((prev) => prev + '\n' + snippet);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-[520px]" id="python-editor">
      {/* Header toolbar */}
      <div className="bg-slate-950 border-b border-slate-900 px-5 py-3.5 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <FileCode className="h-4.5 w-4.5 text-indigo-400" />
          <span className="text-xs font-mono font-black text-slate-300 truncate max-w-[200px]">{lessonContext}</span>
          <div className="flex items-center gap-2 ml-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
            <span className={`h-2 w-2 rounded-full ${isReady ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-amber-500 animate-ping'}`} />
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
              {isLoading ? 'Booting Python...' : isReady ? 'Python Core Online' : 'Standby'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset templates */}
          <div className="relative group">
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all">
              <span>Snippets</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl hidden group-hover:block z-50 min-w-[170px] p-1">
              <button
                onClick={() => insertSnippet('print("Hello, World!")')}
                className="w-full text-left text-[10px] text-slate-400 hover:text-white hover:bg-slate-900 px-2.5 py-2 rounded-lg font-mono font-bold"
              >
                print()
              </button>
              <button
                onClick={() => insertSnippet('for i in range(5):\n    print(i)')}
                className="w-full text-left text-[10px] text-slate-400 hover:text-white hover:bg-slate-900 px-2.5 py-2 rounded-lg font-mono font-bold"
              >
                for loop
              </button>
              <button
                onClick={() => insertSnippet('if True:\n    print("Yes")\nelse:\n    print("No")')}
                className="w-full text-left text-[10px] text-slate-400 hover:text-white hover:bg-slate-900 px-2.5 py-2 rounded-lg font-mono font-bold"
              >
                if/else
              </button>
              <button
                onClick={() => insertSnippet('def main():\n    return "Ready"\nprint(main())')}
                className="w-full text-left text-[10px] text-slate-400 hover:text-white hover:bg-slate-900 px-2.5 py-2 rounded-lg font-mono font-bold"
              >
                def function
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            title="Save code draft"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 p-2 rounded-xl hover:text-indigo-400 transition-all cursor-pointer"
          >
            {savedStatus ? <Check className="h-4 w-4 text-emerald-500" /> : <Save className="h-4 w-4" />}
          </button>

          <button
            onClick={handleLoadSaved}
            title="Load saved code draft"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] px-3 py-2 rounded-xl font-bold hover:text-indigo-400 transition-all cursor-pointer"
          >
            Drafts
          </button>

          <button
            onClick={requestAIReview}
            disabled={reviewing}
            className="bg-indigo-600 hover:bg-indigo-550 disabled:opacity-40 text-white text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{reviewing ? 'Analyzing...' : 'Review'}</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="bg-emerald-600 hover:bg-emerald-550 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/15"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isExecuting ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {/* Main workspace layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden bg-slate-900 border-r border-slate-950">
          {/* Line Numbers Rail */}
          <div className="w-12 bg-slate-950/40 border-r border-slate-950 py-4 text-right pr-3.5 select-none flex flex-col font-mono text-[10px] text-slate-600 space-y-0 leading-6 font-bold">
            {lines.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          {/* Text Area Code Editor with security restrictions */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (isSecureExercise && isPasteProtectionOn) {
                const key = e.key.toLowerCase();
                const isShortcut = (e.ctrlKey || e.metaKey) && ['c', 'v', 'x'].includes(key);
                if (isShortcut) {
                  e.preventDefault();
                  if (key === 'v') {
                    triggerPasteAttempt('');
                  }
                }
              }
            }}
            onPaste={(e) => {
              if (isSecureExercise && isPasteProtectionOn) {
                e.preventDefault();
                const pastedText = e.clipboardData?.getData('text') || '';
                triggerPasteAttempt(pastedText);
              }
            }}
            onCopy={(e) => {
              if (isSecureExercise && isPasteProtectionOn) {
                e.preventDefault();
              }
            }}
            onCut={(e) => {
              if (isSecureExercise && isPasteProtectionOn) {
                e.preventDefault();
              }
            }}
            onDrop={(e) => {
              if (isSecureExercise && isPasteProtectionOn) {
                e.preventDefault();
                const droppedText = e.dataTransfer?.getData('text') || '';
                triggerPasteAttempt(droppedText || 'Dropped text');
              }
            }}
            onDragOver={(e) => {
              if (isSecureExercise && isPasteProtectionOn) {
                e.preventDefault();
              }
            }}
            onContextMenu={(e) => {
              if (isSecureExercise && isPasteProtectionOn) {
                e.preventDefault(); // Prevents context menu right-click entirely inside textarea to block Right-click copy/paste
              }
            }}
            spellCheck={false}
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs md:text-sm p-4 focus:outline-none resize-none leading-6 whitespace-pre overflow-auto font-medium"
            placeholder="# Write your Python wizardry here..."
          />
        </div>

        {/* Output Console & AI Review Box */}
        <div className="w-full md:w-[320px] bg-slate-950 flex flex-col overflow-y-auto border-t md:border-t-0 border-slate-900">
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-900 text-[9px] uppercase font-black tracking-widest text-slate-500 flex justify-between items-center">
            <span>Execution Console</span>
            <button
              onClick={() => setConsoleOutput('Console cleared.\n')}
              className="text-slate-600 hover:text-slate-400 font-black text-[9px] uppercase tracking-wider transition-colors"
            >
              Clear Log
            </button>
          </div>

          <pre className={`flex-1 p-4 font-mono text-[11px] leading-5 overflow-auto select-text whitespace-pre-wrap ${isConsoleError ? 'text-rose-400 bg-rose-950/5' : 'text-slate-300'}`}>
            {consoleOutput}
          </pre>

          {/* Inline AI feedback summary if present */}
          {reviewFeedback && (
            <div className="p-4 bg-indigo-950/40 border-t border-indigo-900/50 text-slate-300">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-400 mb-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Tutor Feedback</span>
              </div>
              <div className="text-[11px] leading-relaxed max-h-[120px] overflow-y-auto font-semibold prose prose-invert prose-xs">
                {reviewFeedback}
              </div>
              <button 
                onClick={() => setReviewFeedback(null)}
                className="mt-2.5 text-[9px] text-slate-400 hover:text-white underline font-bold uppercase tracking-wider"
              >
                Dismiss review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Friendly Paste Protection Warning Modal */}
      <AnimatePresence>
        {showPasteWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-sky-100 dark:border-slate-800 text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-full text-amber-500 animate-pulse">
                  <Lock className="h-10 w-10 text-amber-600" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Nice try, Code Explorer! 😄
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold leading-relaxed">
                  Type the code yourself so your brain can learn the magic.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowPasteWarning(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs md:text-sm font-black uppercase tracking-wider rounded-2xl transition cursor-pointer shadow-md shadow-blue-500/20"
                >
                  I'll type it myself! 🪄
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
