import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, Check, AlertCircle } from 'lucide-react';

const NODES = [
  { id: 'start',   label: 'START',            icon: '▶',  type: 'start'   },
  { id: 'try',     label: 'try: Block',        icon: '🛡️', type: 'try'    },
  { id: 'risky',   label: 'Risky Operation',   icon: '⚡',  type: 'risky'  },
  { id: 'error',   label: 'Exception Raised?', icon: '❓',  type: 'branch' },
  { id: 'except',  label: 'except: Handler',   icon: '🚨',  type: 'except' },
  { id: 'else',    label: 'else: Block',       icon: '✨',  type: 'else'   },
  { id: 'finally', label: 'finally: Block',    icon: '🔒',  type: 'finally'},
  { id: 'end',     label: 'END',               icon: '✔',  type: 'end'    },
];

// Which nodes to traverse when there IS an error vs. no error
const PATH_ERROR   = ['start','try','risky','error','except','finally','end'];
const PATH_SUCCESS = ['start','try','risky','error','else','finally','end'];

const NODE_DESC = {
  start:   'Program execution begins.',
  try:     'Python enters the try: block — wrapping risky code.',
  risky:   'The risky statement runs (file open, division, attribute access…)',
  error:   'Python checks: did an exception occur?',
  except:  'Exception caught! The except: handler runs to fix or log the error.',
  else:    'No exception! The else: block runs (success path).',
  finally: 'Finally block always runs regardless — cleanup, file close, etc.',
  end:     'Execution continues after the try/except structure.',
};

export function ExecutionFlowchart({ hasError = false, story, onActivityDone }) {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const path = hasError ? PATH_ERROR : PATH_SUCCESS;

  // Fire activity done when animation plays to the end
  useEffect(() => {
    if (!isRunning && activeIdx >= path.length - 1 && activeIdx >= 0) {
      onActivityDone && onActivityDone();
    }
  }, [isRunning, activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setActiveIdx(-1);
    setIsRunning(false);
  }, [hasError, story?.id]);

  useEffect(() => {
    if (!isRunning) return;
    if (activeIdx >= path.length - 1) {
      setIsRunning(false);
      return;
    }
    const t = setTimeout(() => setActiveIdx(i => i + 1), 700);
    return () => clearTimeout(t);
  }, [isRunning, activeIdx, path.length]);

  const getNodeState = (nodeId) => {
    const pos = path.indexOf(nodeId);
    if (pos === -1) return 'skipped';
    const curPos = path.indexOf(path[activeIdx]);
    if (pos < activeIdx) return 'done';
    if (pos === activeIdx) return 'active';
    return 'pending';
  };

  const runFlow = () => { setActiveIdx(0); setIsRunning(true); };
  const resetFlow = () => { setActiveIdx(-1); setIsRunning(false); };

  const activeNode = NODES.find(n => n.id === path[activeIdx]);

  return (
    <div className="flowchart-root">
      <div className="flowchart-header">
        <h4>⚡ Execution Flow Visualizer</h4>
        <div className="flowchart-mode">
          <span className={`mode-pill ${hasError ? 'mode-err' : 'mode-ok'}`}>
            {hasError ? '🚨 Error Path' : '✅ Success Path'}
          </span>
        </div>
      </div>

      <div className="flowchart-body">
        {/* NODE GRAPH — vertical */}
        <div className="flowchart-nodes">
          {NODES.map((node, idx) => {
            const state  = getNodeState(node.id);
            const inPath = path.includes(node.id);
            return (
              <div key={node.id} className="flowchart-item">
                <div className={`fc-node fc-node-${node.type} fc-state-${state}${!inPath ? ' fc-skip' : ''}`}>
                  <span className="fc-node-icon">{node.icon}</span>
                  <span className="fc-node-label">{node.label}</span>
                  {state === 'done'   && <Check size={13} className="fc-check"/>}
                  {state === 'active' && <Zap size={13}  className="fc-zap" />}
                </div>
                {idx < NODES.length - 1 && (
                  <div className={`fc-arrow ${state === 'done' || (state === 'active' && activeIdx > 0) ? 'fc-arrow-active' : ''}`}>
                    {node.id === 'error' && (
                      <div className="fc-branch-labels">
                        <span className="branch-yes">Yes ↓ except</span>
                        <span className="branch-no">No → else</span>
                      </div>
                    )}
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DESCRIPTION PANEL */}
        <div className="flowchart-desc-panel">
          {activeNode ? (
            <div className="fc-desc-box">
              <div className="fc-desc-icon">{activeNode.icon}</div>
              <div className="fc-desc-text">
                <strong>{activeNode.label}</strong>
                <p>{NODE_DESC[activeNode.id]}</p>
                {story && (
                  <div className="fc-story-hint">
                    <span>📖 In the story:</span>
                    <em>{story.sentenceMappings.find(m => m.conceptTag.toLowerCase().includes(activeNode.id)) ?.sentence || story.description}</em>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="fc-desc-idle">
              <AlertCircle size={20} />
              <span>Press "Run Flow" to animate the execution path</span>
            </div>
          )}
        </div>
      </div>

      <div className="flowchart-controls">
        <button className="fc-run-btn" onClick={runFlow} disabled={isRunning}>
          <Zap size={14} /> {isRunning ? 'Running…' : 'Run Flow'}
        </button>
        <button className="fc-reset-btn" onClick={resetFlow}>
          Reset
        </button>
      </div>
    </div>
  );
}
