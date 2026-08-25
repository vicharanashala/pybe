import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, RotateCcw, Trophy, Zap, ArrowRight } from 'lucide-react';
import { getStoryBugHunterPuzzles } from '../storyData';

export function BugHunterGame({ story, onScoreUpdate, onActivityDone }) {
  const PUZZLES = getStoryBugHunterPuzzles(story);

  const [pIdx,     setPIdx]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);

  // Reset when story changes
  useEffect(() => {
    setPIdx(0); setSelected(null); setAnswered(false); setScore(0); setDone(false);
  }, [story.id]);

  const puzzle = PUZZLES[pIdx];


  const choose = (opt) => {
    if (answered) return;
    setSelected(opt.id);
    setAnswered(true);
    if (opt.correct) {
      const next = score + 1;
      setScore(next);
      onScoreUpdate && onScoreUpdate(next);
    }
  };

  const nextPuzzle = () => {
    if (pIdx < PUZZLES.length - 1) {
      setPIdx(p => p + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
      onActivityDone && onActivityDone();
    }
  };

  const restartGame = () => {
    setPIdx(0); setSelected(null); setAnswered(false); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / PUZZLES.length) * 100);
    return (
      <div className="bug-done">
        <div className="bug-done-inner">
          <div className="bug-done-icon">
            {pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '🔁'}
          </div>
          <h3 className="bug-done-title">{pct >= 80 ? 'Exception Master!' : pct >= 50 ? 'Good Effort!' : 'Keep Practicing!'}</h3>
          <p className="bug-done-desc">You caught <strong>{score}</strong> out of <strong>{PUZZLES.length}</strong> bugs correctly ({pct}%)</p>
          <div className="bug-progress-bar-wrap">
            <div className="bug-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <button className="bug-restart-btn" onClick={restartGame}>
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const codeLines = puzzle.bugCode.split('\n');

  return (
    <div className="bug-root">
      {/* Top Header Section */}
      <div className="bug-header-panel">
        <div className="bug-header-left">
          <span className="bug-story-avatar">{puzzle.icon}</span>
          <div>
            <h4 className="bug-story-title">{puzzle.story}</h4>
            <span className="bug-pills-row">
              <span className="bug-p-badge">Puzzle {pIdx + 1} of {PUZZLES.length}</span>
              <span className="bug-status-indicator blink">⚡ DEBUGGING ACTIVE</span>
            </span>
          </div>
        </div>
        <div className="bug-header-score">
          <Trophy size={16} />
          <span>Score: <strong>{score} / {PUZZLES.length}</strong></span>
        </div>
      </div>

      {/* Progress Strip */}
      <div className="bug-progress-track">
        {PUZZLES.map((_, i) => (
          <div 
            key={i} 
            className={`bug-track-seg ${i < pIdx ? 'seg-done' : i === pIdx ? 'seg-active' : 'seg-pending'}`} 
            title={`Puzzle ${i+1}`}
          />
        ))}
      </div>

      {/* Scene Mission Panel */}
      <div className="bug-scene-card">
        <div className="bug-scene-hdr">
          <ShieldAlert size={16} />
          <span>EXCEPTION SCENARIO</span>
        </div>
        <p className="bug-scene-desc">{puzzle.scene}</p>
      </div>

      {/* Code Workspace */}
      <div className="bug-ide-workspace">
        <div className="bug-ide-tab-bar">
          <div className="bug-ide-tab active">
            <span>{puzzle.story.toLowerCase().replace(/\s+/g, '_')}_bug.py</span>
            <span className="tab-dot" />
          </div>
          <div className="ide-actions-dummy">
            <span className="action-circle" />
            <span className="action-circle" />
            <span className="action-circle" />
          </div>
        </div>

        <div className="bug-ide-editor">
          <div className="line-numbers-gutter">
            {codeLines.map((_, idx) => (
              <span key={idx} className="ln-num">{idx + 1}</span>
            ))}
          </div>
          <pre className="bug-code-pre-ide">
            <code>
              {codeLines.map((line, idx) => (
                <div key={idx} className="editor-code-line">{line || ' '}</div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      {/* Option Selectors Grid */}
      <div className="bug-options-title">
        <span>Select the correct statement to catch the exception safely:</span>
      </div>
      
      <div className="bug-options-grid">
        {puzzle.options.map(opt => {
          let extraClass = '';
          if (answered && opt.id === selected) extraClass = opt.correct ? ' opt-correct' : ' opt-wrong';
          if (answered && opt.correct && opt.id !== selected) extraClass = ' opt-reveal';
          return (
            <button
              key={opt.id}
              className={`bug-opt-btn-modern ${opt.color}${extraClass}`}
              onClick={() => choose(opt)}
              disabled={answered}
            >
              <div className="btn-inner-wrap">
                <span className="opt-key-badge">{opt.id.toUpperCase()}</span>
                <span className="opt-lbl-text">{opt.label}</span>
                {answered && opt.correct && <CheckCircle2 size={16} className="state-icon-green" />}
                {answered && !opt.correct && opt.id === selected && <Zap size={16} className="state-icon-red" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result Panel */}
      {answered && (
        <div className={`bug-result-panel-modern ${puzzle.options.find(o => o.id === selected)?.correct ? 'result-success' : 'result-failure'}`}>
          <div className="panel-glow-overlay" />
          <div className="panel-header-strip">
            <div className="panel-status-light" />
            <span>{puzzle.options.find(o => o.id === selected)?.correct ? 'COMPILER STABLE — RESOLVED' : 'COMPILER ERROR — TRACEBACK'}</span>
          </div>

          <div className="panel-body">
            <div className="traceback-fixed-area">
              <div className="fixed-code-header">🔥 FIXED RUNTIME CODE:</div>
              <pre className="fixed-code-pre">{puzzle.fixedCode}</pre>
            </div>
            
            <div className="explanation-bubble">
              <span className="exp-icon">💡</span>
              <p className="explanation-p">{puzzle.explanation}</p>
            </div>

            <button className="bug-next-btn-modern" onClick={nextPuzzle}>
              <span>{pIdx < PUZZLES.length - 1 ? 'Execute Next Puzzle' : 'See Final Evaluation'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
