import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Terminal, Sparkles, ChevronRight, Unlock, Lightbulb, Layers } from 'lucide-react';

/* ─── Annotated code lines shown in the editor ──────────────────────────── */
const CODE_LINES = [
  { ln:  1, text: '# A mirror creates smaller reflections',  type: 'comment'  },
  { ln:  2, text: '# until the final reflection is reached', type: 'comment'  },
  { ln:  3, text: '',                                         type: 'blank'    },
  { ln:  4, text: 'def mirror(depth):',                      type: 'def'      },
  { ln:  5, text: '',                                         type: 'blank'    },
  { ln:  6, text: '    # Base case:',                        type: 'comment'  },
  { ln:  7, text: '    # Stop when no more reflections',     type: 'comment'  },
  { ln:  8, text: '    if depth == 0:',                      type: 'keyword'  },
  { ln:  9, text: '        return',                          type: 'keyword'  },
  { ln: 10, text: '',                                         type: 'blank'    },
  { ln: 11, text: '    print("Reflection", depth)',           type: 'print'    },
  { ln: 12, text: '',                                         type: 'blank'    },
  { ln: 13, text: '    # Create the next smaller reflection',type: 'comment'  },
  { ln: 14, text: '    mirror(depth - 1)',                   type: 'recurse'  },
  { ln: 15, text: '',                                         type: 'blank'    },
  { ln: 16, text: '',                                         type: 'blank'    },
  { ln: 17, text: '# Start the mirror journey',              type: 'comment'  },
  { ln: 18, text: 'mirror(5)',                               type: 'call'     },
];

/* ─── Execution steps (one per animation tick) ───────────────────────────── */
const EXEC_STEPS = [
  { highlight: [18],    msg: 'Starting reflection journey…',          depth: null },
  { highlight: [4, 11], msg: 'Entering mirror(5) → printing…',        depth: 5    },
  { highlight: [14],    msg: 'Recursive call → mirror(4)',             depth: 4    },
  { highlight: [11],    msg: 'mirror(4) → printing…',                 depth: 4    },
  { highlight: [14],    msg: 'Recursive call → mirror(3)',             depth: 3    },
  { highlight: [11],    msg: 'mirror(3) → printing…',                 depth: 3    },
  { highlight: [14],    msg: 'Recursive call → mirror(2)',             depth: 2    },
  { highlight: [11],    msg: 'mirror(2) → printing…',                 depth: 2    },
  { highlight: [14],    msg: 'Recursive call → mirror(1)',             depth: 1    },
  { highlight: [11],    msg: 'mirror(1) → printing…',                 depth: 1    },
  { highlight: [8, 9],  msg: '🛑 Base case reached — depth == 0 → return!', depth: 0 },
];

/* ─── Token colour helper ────────────────────────────────────────────────── */
function lineColor(type) {
  return {
    comment: '#4E5D78',
    def:     '#C792EA',
    keyword: '#F07178',
    print:   '#80CBC4',
    recurse: '#82AAFF',
    call:    '#FFD54F',
    blank:   'transparent',
  }[type] ?? '#CDD6F4';
}

/* ═══════════════════════════════════════════════════════════════════════════
   MirrorMission
   Props: onMissionComplete — callback when student successfully runs code
   ═══════════════════════════════════════════════════════════════════════════ */
export default function MirrorMission({ onMissionComplete }) {
  const [runPhase,      setRunPhase]      = useState('idle');   // idle|running|done
  const [execIdx,       setExecIdx]       = useState(-1);
  const [highlighted,   setHighlighted]   = useState([]);
  const [statusMsg,     setStatusMsg]     = useState('');
  const [outputLines,   setOutputLines]   = useState([]);
  const [stackLevels,   setStackLevels]   = useState([]);
  const [missionDone,   setMissionDone]   = useState(false);
  const [showHint,      setShowHint]      = useState(false);
  const termRef                           = useRef(null);
  const runningRef                        = useRef(false);

  /* auto-scroll terminal */
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [outputLines]);

  /* ── Execution animation ──────────────────────────────────────────────── */
  const handleRun = () => {
    if (runningRef.current || missionDone) return;
    runningRef.current = true;
    setRunPhase('running');
    setExecIdx(-1);
    setHighlighted([]);
    setStatusMsg('');
    setOutputLines([]);
    setStackLevels([]);

    const printed = [];

    function tick(idx) {
      if (idx >= EXEC_STEPS.length) {
        /* finished */
        setHighlighted([]);
        setStatusMsg('');
        setStackLevels([]);
        setRunPhase('done');
        setMissionDone(true);
        runningRef.current = false;
        setTimeout(() => onMissionComplete?.(), 1800);
        return;
      }

      const step = EXEC_STEPS[idx];
      setExecIdx(idx);
      setHighlighted(step.highlight);
      setStatusMsg(step.msg);

      /* update call stack */
      if (step.depth !== null && step.depth > 0) {
        setStackLevels(
          Array.from({ length: step.depth }, (_, i) => step.depth - i)
        );
      } else if (step.depth === 0) {
        setStackLevels([]);
      }

      /* print output line when depth > 0 and it's a print step */
      if (step.highlight.includes(11) && step.depth && step.depth > 0) {
        printed.push(`Reflection ${step.depth}`);
        setOutputLines([...printed]);
      }

      const delay = idx === 0 ? 900 : 620;
      setTimeout(() => tick(idx + 1), delay);
    }

    setTimeout(() => tick(0), 300);
  };

  const handleReset = () => {
    if (runningRef.current) return;
    setRunPhase('idle');
    setExecIdx(-1);
    setHighlighted([]);
    setStatusMsg('');
    setOutputLines([]);
    setStackLevels([]);
    setMissionDone(false);
  };

  return (
    <div className="mission-chamber" onClick={e => e.stopPropagation()}>

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="mission-header">
        <div className="flex items-center gap-3 min-w-0">
          <div className="mission-icon-wrap">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
          <div className="min-w-0">
            <h3 className="mission-heading">Mirror Mission</h3>
            <p className="mission-subheading">Run the code to unlock the next challenge</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="mission-ghost-btn"
            onClick={() => setShowHint(h => !h)}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Hint
          </button>
          <button
            className="mission-ghost-btn"
            onClick={handleReset}
            disabled={runPhase === 'running'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            className={`mission-run-btn ${runPhase === 'running' ? 'running' : ''} ${missionDone ? 'done' : ''}`}
            onClick={handleRun}
            disabled={runPhase === 'running' || missionDone}
          >
            <Play className="w-4 h-4 fill-white" />
            {runPhase === 'running' ? 'Executing…' : missionDone ? '✓ Complete' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* ─── Hint banner ─────────────────────────────────────────────────── */}
      {showHint && (
        <div className="mission-hint-banner">
          <span className="text-amber-300 font-bold text-sm">💡 Every recursion needs:</span>
          <ol className="mt-1.5 text-amber-100 text-sm font-medium pl-5 list-decimal space-y-0.5">
            <li>A function that <strong>calls itself</strong></li>
            <li>A <strong>smaller problem</strong> each time</li>
            <li>A <strong>base case</strong> that stops the calls</li>
          </ol>
        </div>
      )}

      {/* ─── Status bar ──────────────────────────────────────────────────── */}
      {statusMsg && (
        <div className="mission-status-bar">
          <span className="status-dot" />
          <span className="text-xs font-bold font-mono">{statusMsg}</span>
        </div>
      )}

      {/* ─── Main split layout ───────────────────────────────────────────── */}
      <div className="mission-body-grid">

        {/* LEFT — code editor */}
        <div className="editor-wrap">
          <div className="editor-titlebar">
            <span className="window-dot" style={{ background: '#FF5F57' }} />
            <span className="window-dot" style={{ background: '#FEBC2E' }} />
            <span className="window-dot" style={{ background: '#28C840' }} />
            <span className="editor-filename">mirror.py</span>
            <span className="editor-badge">Python 3</span>
          </div>
          <div className="editor-scroll-area">
            {CODE_LINES.map(line => {
              const active = highlighted.includes(line.ln);
              return (
                <div
                  key={line.ln}
                  className={`editor-row${active ? ' editor-row--active' : ''}`}
                >
                  <span className="editor-gutter">{line.ln}</span>
                  <span className="editor-text" style={{ color: lineColor(line.type) }}>
                    {line.text || '\u00A0'}
                  </span>
                  {active && <span className="exec-flash" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — call stack + terminal */}
        <div className="right-panels">

          {/* Call stack visualiser */}
          <div className="stack-panel">
            <div className="sub-panel-label">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Call Stack
            </div>
            <div className="stack-body">
              {runPhase === 'idle' && (
                <span className="stack-empty">Press Run to see the call stack grow…</span>
              )}
              {runPhase === 'done' && stackLevels.length === 0 && (
                <span className="stack-empty text-green-400/80">All frames returned ✓</span>
              )}
              {stackLevels.map((d, i) => (
                <div
                  key={d}
                  className="stack-frame"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="frame-fn">mirror</span>
                  <span className="frame-arg">(depth={d})</span>
                </div>
              ))}
              {highlighted.includes(8) && (
                <div className="base-case-tag">
                  🛑 Base Case: depth == 0
                </div>
              )}
            </div>
          </div>

          {/* Terminal output */}
          <div className="terminal-panel">
            <div className="sub-panel-label">
              <Terminal className="w-3.5 h-3.5 text-green-400" />
              Output
              {runPhase === 'running' && (
                <span className="ml-auto text-[10px] text-green-400 animate-pulse font-mono">● live</span>
              )}
            </div>
            <div className="terminal-scroll" ref={termRef}>
              {outputLines.length === 0 && runPhase === 'idle' && (
                <span className="terminal-empty">Output will appear here…</span>
              )}
              {outputLines.map((line, i) => (
                <div
                  key={i}
                  className="terminal-row"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <span className="terminal-prompt">›</span>
                  <span className="terminal-text">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Completion card ─────────────────────────────────────────────── */}
      {missionDone && (
        <div className="mission-complete">
          <div className="complete-shimmer" />
          <div className="relative z-10 flex flex-col gap-2">
            <p className="complete-headline">✨ Mirror Activated!</p>
            <p className="complete-explain">
              <strong>What happened?</strong>{' '}
              The function kept creating smaller reflections by calling itself.
              The base case stopped the process when the reflection depth reached zero.
            </p>
          </div>
          <div className="complete-unlock">
            <Unlock className="w-4 h-4 text-green-300" />
            <span>Recursion Challenge Unlocked</span>
            <ChevronRight className="w-4 h-4 text-green-300 animate-pulse" />
          </div>
        </div>
      )}

    </div>
  );
}
