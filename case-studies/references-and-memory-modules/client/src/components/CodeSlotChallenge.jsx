import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Play, RefreshCw, X, ArrowRight, Zap, Code, HelpCircle } from 'lucide-react';
import { playThud, playPop, unlockAudio } from '../utils/audio';

const CodeSlotChallenge = ({
  levelNumber = 1,
  title = "Level 1: Fix the Memory Leak",
  subtitle = "Interactive Drag-and-Drop Patch Challenge",
  description = "The current function deep-copies a 20 GB noticeboard inside a 1,000-iteration loop, crashing the server. Drag the correct replacement block into Line 4 to patch the memory leak!",
  codeLinesBefore = [
    "def distribute(announcement):",
    "    students = []",
    "    for i in range(1000):"
  ],
  slotLineNumber = 4,
  buggyCode = "        copy_obj = copy.deepcopy(announcement)",
  codeLinesAfter = [
    "        students.append(student_pointer)",
    "    return students"
  ],
  replacementOptions = [
    {
      id: "copy_shallow",
      codeText: "        student_pointer = copy.copy(announcement)",
      shortText: "student_pointer = copy.copy(announcement)",
      label: "copy.copy(announcement)",
      isCorrect: false,
      tag: "Shallow Copy",
      feedbackTitle: "⚠️ Memory Still Explodes!",
      feedbackText: "Even copy.copy() allocates a brand-new list object container in RAM on every iteration! 1,000 clones will still overload the 100 GB memory limit."
    },
    {
      id: "pointer_assign",
      codeText: "        student_pointer = announcement",
      shortText: "student_pointer = announcement",
      label: "student_pointer = announcement",
      isCorrect: true,
      tag: "Reference Assignment",
      feedbackTitle: "🎉 Zero-RAM Pointer Patch Confirmed!",
      feedbackText: "Brilliant! In Python, assignment binds a tiny 64-bit reference to the existing noticeboard in Memory Box #1. 0 duplicate copies are created and 0 extra GB of RAM is wasted!"
    },
    {
      id: "list_constructor",
      codeText: "        student_pointer = list(announcement)",
      shortText: "student_pointer = list(announcement)",
      label: "student_pointer = list(announcement)",
      isCorrect: false,
      tag: "List Constructor",
      feedbackTitle: "⚠️ Duplicate Container Allocated!",
      feedbackText: "Calling list(...) instantiates a completely new list object in heap memory for each student. This continues to generate duplicate boxes and crashes RAM."
    }
  ],
  onApplyFix,
  onUnlockNextLevel,
  onClose
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [testResult, setTestResult] = useState(null); // { isCorrect, title, message }
  const [isRunning, setIsRunning] = useState(false);

  const selectedOption = replacementOptions.find(o => o.id === selectedOptionId);

  const handleSelectOption = (optionId) => {
    unlockAudio();
    playPop();
    setSelectedOptionId(optionId);
    setTestResult(null);
  };

  const handleRemoveOption = () => {
    unlockAudio();
    playPop();
    setSelectedOptionId(null);
    setTestResult(null);
  };

  const handleDragStart = (e, optionId) => {
    e.dataTransfer.setData('text/plain', optionId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const optionId = e.dataTransfer.getData('text/plain');
    if (optionId && replacementOptions.some(o => o.id === optionId)) {
      handleSelectOption(optionId);
    }
  };

  const handleRunPatch = () => {
    unlockAudio();
    if (!selectedOption) return;
    setIsRunning(true);

    setTimeout(() => {
      setIsRunning(false);
      if (selectedOption.isCorrect) {
        playPop();
        setTestResult({
          isCorrect: true,
          title: selectedOption.feedbackTitle,
          message: selectedOption.feedbackText
        });
      } else {
        playThud();
        setTestResult({
          isCorrect: false,
          title: selectedOption.feedbackTitle,
          message: selectedOption.feedbackText
        });
      }
    }, 600);
  };

  return (
    <div style={{
      background: '#fffdfa',
      border: '1.5px solid #e4dcc8',
      borderRadius: '18px',
      padding: '26px',
      boxShadow: '0 12px 36px rgba(43, 30, 20, 0.08)',
      width: '100%',
      maxWidth: '920px',
      margin: '0 auto',
      position: 'relative'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e4dcc8', paddingBottom: '16px', marginBottom: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧩</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontFamily: '"Fraunces", Georgia, serif', color: '#2b2b2b', fontWeight: 800, letterSpacing: '-0.2px' }}>
                Fix the Bug: Code Slot Challenge
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#7c7365' }}>
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            type="button"
            style={{
              background: '#ffffff',
              border: '1.5px solid #e4dcc8',
              borderRadius: '999px',
              color: '#5b5648',
              cursor: 'pointer',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={16} /> Back to Lab
          </button>
        )}
      </div>

      {/* Challenge Mission Brief */}
      <div style={{
        background: '#fdf3e2',
        border: '1.5px solid #e8a33d',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        fontSize: '0.88rem',
        color: '#634316',
        lineHeight: '1.55'
      }}>
        <strong style={{ color: '#8c5914', fontWeight: 800 }}>Mission Brief: </strong>
        {description}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Code Snippet with Drop Slot */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#2b2b2b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={16} color="#FA994F" /> Target Python Script:
            </span>
            <span style={{ fontSize: '0.74rem', color: '#7c7365', fontWeight: 600 }}>
              Line {slotLineNumber} needs patching
            </span>
          </div>

          <div style={{
            background: '#241e1a',
            border: '1.5px solid #3d352e',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '0.86rem',
            lineHeight: '1.6'
          }}>
            {/* Preceding Lines */}
            {codeLinesBefore.map((line, idx) => (
              <div key={idx} style={{ color: '#94a3b8', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#8c7d70', userSelect: 'none', width: '18px', textAlign: 'right' }}>{idx + 1}</span>
                <span style={{ color: '#f4efe4' }}>{line}</span>
              </div>
            ))}

            {/* The Interactive Code Drop Slot */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                margin: '8px 0',
                padding: selectedOption ? '8px 12px' : '14px 12px',
                borderRadius: '8px',
                border: isDragOver
                  ? '2px dashed #FA994F'
                  : selectedOption
                    ? (testResult?.isCorrect ? '2px solid #4f9a63' : testResult?.isCorrect === false ? '2px solid #c25b4a' : '2px solid #FA994F')
                    : '2px dashed #FA994F',
                background: isDragOver
                  ? 'rgba(250, 153, 79, 0.2)'
                  : selectedOption
                    ? (testResult?.isCorrect ? 'rgba(79, 154, 99, 0.15)' : testResult?.isCorrect === false ? 'rgba(194, 91, 74, 0.15)' : 'rgba(250, 153, 79, 0.12)')
                    : 'rgba(250, 153, 79, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <span style={{ color: '#FA994F', fontWeight: 800, width: '18px', textAlign: 'right' }}>{slotLineNumber}</span>
                {selectedOption ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{
                      color: testResult?.isCorrect ? '#6ee7b7' : testResult?.isCorrect === false ? '#fca5a5' : '#fbd38d',
                      fontWeight: 700,
                      wordBreak: 'break-all'
                    }}>
                      {selectedOption.codeText}
                    </span>
                    <button
                      onClick={handleRemoveOption}
                      type="button"
                      title="Remove block from slot"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: 'none',
                        color: '#f4efe4',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '2px 6px',
                        fontSize: '0.72rem',
                        marginLeft: '8px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div style={{ color: '#FA994F', fontStyle: 'italic', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <span>📥</span>
                    <span>Drop replacement block here (or click block below)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Following Lines */}
            {codeLinesAfter.map((line, idx) => (
              <div key={idx} style={{ color: '#94a3b8', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#8c7d70', userSelect: 'none', width: '18px', textAlign: 'right' }}>{slotLineNumber + 1 + idx}</span>
                <span style={{ color: '#f4efe4' }}>{line}</span>
              </div>
            ))}
          </div>

          {/* Test Button */}
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={handleRunPatch}
              disabled={!selectedOption || isRunning}
              type="button"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.94rem',
                fontWeight: 700,
                background: (!selectedOption || isRunning) ? '#f0ece0' : 'linear-gradient(135deg, #FA994F 0%, #c4682c 100%)',
                color: (!selectedOption || isRunning) ? '#9e978a' : '#ffffff',
                border: 'none',
                borderRadius: '999px',
                cursor: (!selectedOption || isRunning) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: (!selectedOption || isRunning) ? 'none' : '0 4px 14px rgba(250, 153, 79, 0.3)'
              }}
            >
              {isRunning ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Compiling & Testing in Virtual RAM...
                </>
              ) : (
                <>
                  <Play size={18} /> Test Patched Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 3 Replacement Blocks & Test Results */}
        <div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#2b2b2b' }}>
              Select Replacement Block:
            </span>
            <span style={{ display: 'block', fontSize: '0.74rem', color: '#7c7365' }}>
              Drag into slot or click to equip
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {replacementOptions.map((opt, i) => {
              const isEquipped = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, opt.id)}
                  onClick={() => handleSelectOption(opt.id)}
                  style={{
                    background: isEquipped ? '#fff8f2' : '#ffffff',
                    border: isEquipped ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    cursor: 'grab',
                    transition: 'all 0.18s ease',
                    boxShadow: isEquipped ? '0 4px 14px rgba(250, 153, 79, 0.22)' : '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#7c4a2d',
                      background: '#f4efe4',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      Option {String.fromCharCode(65 + i)} • {opt.tag}
                    </span>
                    {isEquipped && (
                      <span style={{ fontSize: '0.74rem', color: '#FA994F', fontWeight: 700 }}>
                        ✓ Equipped in Slot
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    color: isEquipped ? '#7c4a2d' : '#2b2b2b',
                    background: '#faf6ee',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e4dcc8'
                  }}>
                    {opt.shortText}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Test Feedback Area */}
          {testResult && (
            <div style={{
              marginTop: '16px',
              padding: '14px 16px',
              borderRadius: '12px',
              background: testResult.isCorrect ? '#e9f4ec' : '#fbeae7',
              border: `1.5px solid ${testResult.isCorrect ? '#4f9a63' : '#c25b4a'}`,
              animation: 'popIn 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                {testResult.isCorrect ? (
                  <CheckCircle size={18} color="#2f6564" />
                ) : (
                  <AlertTriangle size={18} color="#c25b4a" />
                )}
                <strong style={{ fontSize: '0.9rem', color: testResult.isCorrect ? '#256038' : '#a83220' }}>
                  {testResult.title}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: testResult.isCorrect ? '#3d6049' : '#6e2d23', lineHeight: '1.45' }}>
                {testResult.message}
              </p>

              {testResult.isCorrect && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                  {onApplyFix && (
                    <button
                      onClick={onApplyFix}
                      type="button"
                      style={{
                        background: '#2f6564',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Zap size={15} /> Apply Fix to Live Simulation
                    </button>
                  )}

                  {onUnlockNextLevel && (
                    <button
                      onClick={onUnlockNextLevel}
                      type="button"
                      style={{
                        background: 'linear-gradient(135deg, #FA994F 0%, #c4682c 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        padding: '8px 16px',
                        borderRadius: '999px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(250, 153, 79, 0.3)'
                      }}
                    >
                      Unlock Level {levelNumber + 1} <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSlotChallenge;
