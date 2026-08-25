import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Sparkles, Code2, CheckCircle2, MessageSquare, Terminal } from 'lucide-react';

export function LineByLineGenerator({ story, onActivityDone }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [typedCodeLines, setTypedCodeLines] = useState([]);
  const [activeExplanation, setActiveExplanation] = useState('');
  const generatorRef = useRef(null);
  const activityFiredRef = useRef(false);

  const sentences = story.sentenceMappings || [];

  const resetGenerator = () => {
    setIsAutoGenerating(false);
    clearInterval(generatorRef.current);
    setCurrentLineIndex(0);
    setTypedCodeLines([]);
    setActiveExplanation('');
  };


  useEffect(() => {
    resetGenerator();
  }, [story.id]);

  useEffect(() => {
    if (isAutoGenerating) {
      generatorRef.current = setInterval(() => {
        setCurrentLineIndex((prev) => {
          if (prev >= sentences.length) {
            setIsAutoGenerating(false);
            clearInterval(generatorRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    } else {
      clearInterval(generatorRef.current);
    }
    return () => clearInterval(generatorRef.current);
  }, [isAutoGenerating, sentences.length]);

  useEffect(() => {
    if (currentLineIndex > 0) {
      const active = sentences[currentLineIndex - 1];
      setTypedCodeLines(sentences.slice(0, currentLineIndex));
      if (active) setActiveExplanation(active.explanation);
      // Fire activity done when at least 80% of code lines are generated
      const reqLines = Math.ceil(sentences.length * 0.8);
      if (currentLineIndex >= reqLines && !activityFiredRef.current) {
        activityFiredRef.current = true;
        onActivityDone && onActivityDone();
      }
    } else {
      setTypedCodeLines([]);
      setActiveExplanation('');
    }
  }, [currentLineIndex, story.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const stepNextLine = () => {
    if (currentLineIndex < sentences.length) {
      setCurrentLineIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="lbl-generator-root">
      {/* Header */}
      <div className="lbl-header">
        <div className="lbl-header-title">
          <Sparkles className="lbl-sparkle-icon" size={20} />
          <div>
            <h3>Line-by-Line Code Generator & Plain English Breakdown</h3>
            <p>Click <strong>"Generate Line"</strong> or <strong>"Auto Build"</strong> to watch Python code assemble step-by-step from English story actions.</p>
          </div>
        </div>

        <div className="lbl-controls">
          <button
            className={`lbl-btn auto ${isAutoGenerating ? 'active' : ''}`}
            onClick={() => setIsAutoGenerating(!isAutoGenerating)}
            disabled={currentLineIndex >= sentences.length}
          >
            {isAutoGenerating ? <Pause size={15} /> : <Play size={15} />}
            {isAutoGenerating ? 'Pause Generation' : 'Auto Generate All'}
          </button>

          <button
            className="lbl-btn step"
            onClick={stepNextLine}
            disabled={currentLineIndex >= sentences.length || isAutoGenerating}
          >
            Generate Next Line <ChevronRight size={15} />
          </button>

          <button className="lbl-btn reset" onClick={resetGenerator}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="lbl-progress-bar-wrap">
        <div
          className="lbl-progress-bar-fill"
          style={{ width: `${(currentLineIndex / (sentences.length || 1)) * 100}%` }}
        />
      </div>

      {/* Main Grid: Left English Sentence Stepper | Right Live Code Generator */}
      <div className="lbl-grid">
        {/* Left: Sentence breakdown */}
        <div className="lbl-left-panel">
          <div className="lbl-panel-hdr">
            <MessageSquare size={16} />
            <span>Story Action Breakdown (English)</span>
          </div>

          <div className="lbl-sentence-list">
            {sentences.map((map, idx) => {
              const isDone = idx < currentLineIndex;
              const isActive = idx === currentLineIndex - 1;
              return (
                <div
                  key={map.stepNumber}
                  className={`lbl-sentence-card ${isActive ? 'active' : isDone ? 'done' : 'pending'}`}
                  onClick={() => setCurrentLineIndex(idx + 1)}
                >
                  <div className="lbl-card-top">
                    <span className="lbl-step-num">Step {map.stepNumber}</span>
                    <span className="lbl-tag">{map.conceptTag}</span>
                    {isDone && <CheckCircle2 size={14} className="lbl-check-ic" />}
                  </div>
                  <p className="lbl-sentence-text">"{map.sentence}"</p>
                  <small className="lbl-exp">💡 {map.explanation}</small>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Code Generator Window */}
        <div className="lbl-right-panel">
          <div className="lbl-panel-hdr dark">
            <Terminal size={16} />
            <span>Generated Python Code Simulator</span>
            <span className="lbl-counter-chip">{currentLineIndex} / {sentences.length} Lines Generated</span>
          </div>

          <div className="lbl-code-terminal">
            {typedCodeLines.length === 0 ? (
              <div className="lbl-terminal-empty">
                <Code2 size={32} />
                <p>Press <strong>"Generate Next Line"</strong> to start generating Python code line-by-line...</p>
              </div>
            ) : (
              typedCodeLines.map((item, i) => (
                <div key={item.stepNumber} className={`lbl-code-row ${i === typedCodeLines.length - 1 ? 'newly-typed' : ''}`}>
                  <span className="lbl-ln">L{String(i + 1).padStart(2, '0')}</span>
                  <pre className="lbl-code-line">{item.codeLine}</pre>
                  <span className="lbl-inline-tag">{item.conceptTag}</span>
                </div>
              ))
            )}
          </div>

          {/* Active explanation tooltip */}
          {activeExplanation && (
            <div className="lbl-live-explanation-box">
              <strong>⚡ Active Code Explanation:</strong>
              <p>{activeExplanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
