import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Code2,
  HelpCircle,
  Play,
  Sparkles,
  AlertCircle,
  Terminal,
  CheckCircle2,
  RefreshCw,
  RotateCcw
} from 'lucide-react';
import { verifyScenario } from '../utils/verification';
import { getScenarioHint } from '../utils/hints';
import CodeFlowChart from './CodeFlowChart';

// Shared global Pyodide loaders inside the workspace module context
let pyodideInstance = null;
let pyodideLoadingPromise = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadingPromise) return pyodideLoadingPromise;

  pyodideLoadingPromise = (async () => {
    if (!window.loadPyodide) {
      throw new Error("Pyodide execution environment could not be found. Check connection or index.html.");
    }
    const py = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
    });
    pyodideInstance = py;
    return py;
  })();

  return pyodideLoadingPromise;
}

export default function ChallengeWorkspace({ result, scenario }) {
  const [challengeState, setChallengeState] = useState('locked'); // 'locked', 'active', 'revealed'
  const [setupStep, setSetupStep] = useState('choose_path'); // 'choose_path', 'config_timer'
  const [customMinutes, setCustomMinutes] = useState(10);
  const [isZen, setIsZen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [consoleError, setConsoleError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [solvedBeforeReveal, setSolvedBeforeReveal] = useState(false);

  const [hintIndex, setHintIndex] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [pyodideState, setPyodideState] = useState('idle');
  const [hoveredLine, setHoveredLine] = useState(null);
  const [resetArmed, setResetArmed] = useState(false);
  const resetArmTimerRef = useRef(null);

  const [leftWidth, setLeftWidth] = useState(55);
  const splitContainerRef = useRef(null);

  const startResize = (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchmove', handleTouchResizeMove);
    document.addEventListener('touchend', handleResizeEnd);
  };

  const handleResizeMove = (e) => {
    if (!splitContainerRef.current) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    let percentage = ((e.clientX - rect.left) / rect.width) * 100;
    if (percentage < 30) percentage = 30;
    if (percentage > 80) percentage = 80;
    setLeftWidth(percentage);
  };

  const handleTouchResizeMove = (e) => {
    if (!splitContainerRef.current || !e.touches[0]) return;
    const rect = splitContainerRef.current.getBoundingClientRect();
    let percentage = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    if (percentage < 30) percentage = 30;
    if (percentage > 80) percentage = 80;
    setLeftWidth(percentage);
  };

  const handleResizeEnd = () => {
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.removeEventListener('touchmove', handleTouchResizeMove);
    document.removeEventListener('touchend', handleResizeEnd);
  };

  const timerRef = useRef(null);

  useEffect(() => {
    setChallengeState('locked');
    setSetupStep('choose_path');
    setCustomMinutes(10);
    setIsZen(false);
    setTimerActive(false);
    setTimeLeft(600);
    setUserCode('');
    setConsoleOutput('');
    setConsoleError(null);
    setVerifyStatus(null);
    setSolvedBeforeReveal(false);
    setHintIndex(0);
    setCurrentHint('');
    if (timerRef.current) clearInterval(timerRef.current);
  }, [result, scenario?._id]);

  useEffect(() => {
    if (timerActive && challengeState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            setChallengeState('revealed');
            setSolvedBeforeReveal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, challengeState]);

  const buildStarterTemplate = () => {
    const objectivesList = scenario?.objectives?.map(obj => `# - ${obj}`).join('\n') || '';
    return `# Scenario: ${scenario?.title || 'Challenge'}\n# Objectives:\n${objectivesList}\n\n# Write your code to solve this scenario below:\n\n`;
  };

  const startChallenge = () => {
    const seconds = isZen ? 0 : customMinutes * 60;
    setTimeLeft(seconds);
    setTimerActive(!isZen);
    setChallengeState('active');
    setUserCode(buildStarterTemplate());
  };

  const handleResetEditor = () => {
    if (!resetArmed) {
      // First click — arm the reset, auto-disarm after 3 seconds
      setResetArmed(true);
      if (resetArmTimerRef.current) clearTimeout(resetArmTimerRef.current);
      resetArmTimerRef.current = setTimeout(() => setResetArmed(false), 3000);
    } else {
      // Second click — actually reset
      clearTimeout(resetArmTimerRef.current);
      setResetArmed(false);
      setUserCode(buildStarterTemplate());
      setConsoleOutput('');
      setConsoleError(null);
      setVerifyStatus(null);
      setCurrentHint('');
      setHintIndex(0);
    }
  };

  const handleGetHint = () => {
    const nextHint = getScenarioHint(scenario?.title, hintIndex);
    setCurrentHint(nextHint);
    setHintIndex((prev) => prev + 1);
  };

  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleError(null);
    setPyodideState('loading');
    try {
      const py = await getPyodide();
      setPyodideState('loaded');

      let logs = '';
      const decodeBuffer = (buf) => {
        if (typeof buf === 'string') return buf;
        try { return new TextDecoder().decode(buf); } catch { return String(buf); }
      };

      py.setStdout({
        write: (buf) => {
          logs += decodeBuffer(buf);
          return buf.length;
        }
      });
      py.setStderr({
        write: (buf) => {
          logs += decodeBuffer(buf);
          return buf.length;
        }
      });

      py.runPython(`
import sys
for name in list(globals().keys()):
    if not name.startswith('__') and name not in ['sys', 'io', 'pyodide']:
        del globals()[name]
      `);

      await py.runPythonAsync(userCode);
      setConsoleOutput(logs || '(Success: Program ran with no output)');
      setConsoleError(null);
    } catch (err) {
      setConsoleError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setConsoleError(null);
    setPyodideState('loading');
    try {
      const py = await getPyodide();
      setPyodideState('loaded');

      let logs = '';
      const decodeBuffer = (buf) => {
        if (typeof buf === 'string') return buf;
        try { return new TextDecoder().decode(buf); } catch { return String(buf); }
      };

      py.setStdout({
        write: (buf) => {
          logs += decodeBuffer(buf);
          return buf.length;
        }
      });
      py.setStderr({
        write: (buf) => {
          logs += decodeBuffer(buf);
          return buf.length;
        }
      });

      py.runPython(`
import sys
for name in list(globals().keys()):
    if not name.startswith('__') and name not in ['sys', 'io', 'pyodide']:
        del globals()[name]
      `);

      await py.runPythonAsync(userCode);

      const status = await verifyScenario(scenario?.title, userCode, py);
      setVerifyStatus(status);
      setConsoleOutput(logs);
      setConsoleError(null);

      if (status.success) {
        setSolvedBeforeReveal(true);
        setChallengeState('revealed');
        setTimerActive(false);
      }
    } catch (err) {
      setConsoleError(err.message);
      setVerifyStatus({
        success: false,
        errors: ["Execution error: " + err.message],
        warnings: []
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const revealEarly = () => {
    setChallengeState('revealed');
    setSolvedBeforeReveal(false);
    setTimerActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const lineCount = userCode.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 6) }, (_, i) => i + 1);

  return (
    <div className="result-stack">
      <div className="score"><span>{result.promptScore}</span><small>Prompt maturity</small></div>
      <div>
        {result.abstractionMap.map((item) => (
          <article className="mapping" key={item.pattern}>
            <strong>{item.pattern}</strong>
            <span>{item.pythonConcept}</span>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>

      {challengeState === 'locked' && (
        <div className="challenge-launcher">
          {setupStep === 'choose_path' ? (
            <>
              <div className="launcher-title">
                <Sparkles size={24} className="icon-gold" />
                <h3>How would you like to review the code?</h3>
              </div>
              <p className="launcher-desc">
                You can try writing the Python code solution yourself inside our interactive sandbox, or display the AI Mentor's recommended solution immediately.
              </p>
              <div className="choice-buttons">
                <button
                  type="button"
                  className="btn-choice-try"
                  onClick={() => setSetupStep('config_timer')}
                >
                  ✍️ Try Solving It Myself
                </button>
                <button
                  type="button"
                  className="btn-choice-reveal"
                  onClick={revealEarly}
                >
                  👁️ Display Solution Immediately
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="launcher-title">
                <Timer size={24} className="icon-timer" />
                <h3>Configure Challenge Timer</h3>
              </div>
              <p className="launcher-desc">
                Set a time limit for your practice run. The solution will reveal when the countdown hits zero or when you successfully solve the scenario checks.
              </p>

              <div className="timer-config-controls">
                <div className="time-input-group" style={{ opacity: isZen ? 0.4 : 1 }}>
                  <label htmlFor="custom-minutes-input">Practice Duration (mins):</label>
                  <input
                    id="custom-minutes-input"
                    type="number"
                    min="1"
                    max="60"
                    disabled={isZen}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                <label className="zen-toggle-label">
                  <input
                    type="checkbox"
                    checked={isZen}
                    onChange={(e) => setIsZen(e.target.checked)}
                  />
                  <span>🐢 Zen Mode (No timer pressure)</span>
                </label>
              </div>

              <div className="launcher-actions-row">
                <button type="button" className="btn-secondary" onClick={() => setSetupStep('choose_path')}>
                  Back
                </button>
                <button type="button" className="btn-launch-start" onClick={startChallenge}>
                  Start Practice
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {challengeState === 'active' && (
        <div className="sandbox-split-layout" ref={splitContainerRef}>
          <div className="code-block editor-block" style={{ width: `calc(${leftWidth}% - 4px)`, flexShrink: 0 }}>
            <div className="editor-header">
              <span><Code2 size={16} /> Challenge Sandbox</span>
              <div className="timer-display">
                {isZen ? (
                  <span className="timer-text zen">🐢 Zen Mode</span>
                ) : (
                  <span className={`timer-text ${timeLeft < 60 ? 'critical-pulse' : ''}`}>
                    ⏱️ {formatTime(timeLeft)}
                  </span>
                )}
              </div>
            </div>

            <div className="code-editor-container">
              <div className="code-gutter">
                {lines.map((num) => (
                  <span key={num} className={hoveredLine === num ? 'gutter-active' : ''}>
                    {num}
                  </span>
                ))}
              </div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="code-textarea"
                spellCheck={false}
                placeholder="Write your Python code to solve the scenario..."
              />
            </div>

            <div className="editor-actions">
              <div className="action-group">
                <button type="button" className="btn-secondary" onClick={handleGetHint} title="Need a Hint?">
                  <HelpCircle size={14} /> Need a Hint
                </button>
                <button
                  type="button"
                  className={`btn-reset-editor ${resetArmed ? 'armed' : ''}`}
                  onClick={handleResetEditor}
                  title={resetArmed ? 'Click again to confirm reset' : 'Reset editor to starter template'}
                >
                  <RotateCcw size={14} /> {resetArmed ? 'Confirm Reset?' : 'Reset Editor'}
                </button>
              </div>
              <div className="action-group">
                <button type="button" className="btn-secondary btn-reveal" onClick={revealEarly}>
                  Give Up &amp; Reveal
                </button>
                <button
                  type="button"
                  className="btn-run"
                  onClick={handleRunCode}
                  disabled={isRunning || isVerifying}
                >
                  <Play size={14} /> {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <button
                  type="button"
                  className="btn-verify"
                  onClick={handleVerify}
                  disabled={isRunning || isVerifying}
                >
                  <Sparkles size={14} /> {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>

            {currentHint && (
              <div className="live-hint-box">
                <strong>💡 Mentor Hint #{hintIndex}:</strong>
                <p>{currentHint}</p>
              </div>
            )}

            {verifyStatus && !verifyStatus.success && (
              <div className="challenge-failed-banner">
                <AlertCircle size={16} />
                <span>Some checks failed. Keep improving your code!</span>
              </div>
            )}

            <div className="console-panel">
              <div className="console-header">
                <Terminal size={14} />
                <span>Console Output</span>
              </div>
              <div className="console-body">
                {consoleError && <pre className="console-err">{consoleError}</pre>}
                {consoleOutput && <pre className="console-out">{consoleOutput}</pre>}
                {!consoleError && !consoleOutput && <span className="console-placeholder">Console is idle. Write your code and click Run Code.</span>}
              </div>
            </div>
          </div>
          <div
            className="resizer-bar"
            onMouseDown={startResize}
            onTouchStart={startResize}
            title="Drag to resize panels"
          />
          <CodeFlowChart
            code={userCode}
            style={{ width: `calc(${100 - leftWidth}% - 4px)`, flexShrink: 0 }}
            hoveredLine={hoveredLine}
            onHoverLine={setHoveredLine}
          />
        </div>
      )}

      {challengeState === 'revealed' && (
        <div className="revealed-challenge-block">
          {solvedBeforeReveal ? (
            <div className="status-banner victory-card">
              <CheckCircle2 size={24} className="icon-success" />
              <div>
                <strong>🏆 Challenge Cleared! Excellent Job!</strong>
                <p>You matched all the scenario objectives! Compare your logic with the AI model solution below.</p>
              </div>
            </div>
          ) : (
            <div className="status-banner timeout-card">
              <Timer size={24} className="icon-timer" />
              <div>
                <strong>⌛ Challenge Ended</strong>
                <p>Here is the AI Mentor's recommended model solution. Contrast it with your code draft to reflect on your approach.</p>
              </div>
            </div>
          )}

          <div className="side-by-side-comparison">
            <div className="comparison-pane">
              <div className="pane-header">Your Draft Code</div>
              <pre className="read-only-code">{userCode || '# No code written'}</pre>
            </div>

            <div className="comparison-pane">
              <div className="pane-header highlighted-header">AI Mentor Solution</div>
              <pre className="read-only-code model-code">{result.generatedCode}</pre>
            </div>
          </div>

          <div className="code-block-footer">
            <p className="code-exp"><strong>AI Solution Explanation:</strong> {result.codeExplanation}</p>
            <button type="button" className="btn-secondary restart-btn" onClick={() => setChallengeState('locked')}>
              <RefreshCw size={14} /> Try Challenge Again
            </button>
          </div>
        </div>
      )}

      <ul className="feedback">
        {result.promptFeedback.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {result.misconceptions.length > 0 && (
        <div className="note">
          <strong>Misconception watch</strong>
          {result.misconceptions.map((item) => <p key={item}>{item}</p>)}
        </div>
      )}
    </div>
  );
}
