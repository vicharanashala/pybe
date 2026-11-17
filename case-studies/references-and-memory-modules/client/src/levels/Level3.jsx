import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play, Info, ArrowRight, Layers, Cpu } from 'lucide-react';
import Quiz from '../components/Quiz';
import StorySlider from '../components/StorySlider';
import { playThud, playPop, unlockAudio } from '../utils/audio';

const StackBar = ({ usage }) => (
  <div className="glass-panel" style={{ padding: '16px', marginBottom: '20px', borderLeft: '4px solid #8b5cf6', background: '#fffdfa', border: '1px solid #e4dcc8' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Layers size={20} color="#7c4a2d" />
        <span style={{ fontWeight: 600, color: '#2b2b2b' }}>Call Stack Depth</span>
      </div>
      <span style={{ color: usage > 80 ? '#c25b4a' : usage > 50 ? '#8c5914' : '#2f6564', fontWeight: 'bold' }}>
        {usage.toFixed(0)}%
      </span>
    </div>
    <div className={`ram-bar-container ${usage > 80 ? 'ram-bar-danger' : ''}`} style={{ background: '#f0ece0' }}>
      <div className="ram-bar-fill" style={{ width: `${usage}%`, background: 'linear-gradient(90deg, #FA994F, #e8a33d)' }}></div>
    </div>
  </div>
);

const Level3 = ({ onCrash, onPass, RamBar }) => {
  const [ram, setRam] = useState(35);
  const [stack, setStack] = useState(0);
  const [mode, setMode] = useState('copy');
  const [showQuiz, setShowQuiz] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [explainStep, setExplainStep] = useState(1);
  const [executingLine, setExecutingLine] = useState(0);
  const [conditionMet, setConditionMet] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [q1Choice, setQ1Choice] = useState(null);
  const [q2Choice, setQ2Choice] = useState(null);
  const [showHeapInspector, setShowHeapInspector] = useState(true);

  const selectLine = (lineNum) => {
    setSelectedLine(lineNum);
    setExplainStep(1);
  };

  const getCodeLineBg = (lineNum) => {
    if (selectedLine === lineNum) {
      return '#fff8f2';
    }
    return undefined;
  };

  const [ramObjects, setRamObjects] = useState([[1, 2, 3, 4, 5]]);
  const [stackFrames, setStackFrames] = useState([]);

  const getLineStyle = (lineNum) => {
    const isLineActive = executingLine === lineNum;
    const isSelected = selectedLine === lineNum;
    return {
      background: isLineActive
        ? (mode === 'copy' ? '#fff3e8' : '#e9f4ec')
        : (isSelected ? '#fff8f2' : 'transparent'),
      borderLeft: isLineActive
        ? (mode === 'copy' ? '3px solid #FA994F' : '3px solid #4f9a63')
        : (isSelected ? '3px solid #e8a33d' : '3px solid transparent'),
      paddingLeft: '6px',
      transition: 'all 0.2s',
      color: isLineActive
        ? (mode === 'copy' ? '#7c4a2d' : '#256038')
        : '#2b2b2b'
    };
  };

  const questions = [
    {
      type: 'mcq',
      question: "In recursive algorithms, why do intermediate copies created via `items.copy()` explode memory so quickly?",
      options: [
        { text: "All caller stack frames remain active until the base case returns, forcing all intermediate copies to stay alive in RAM at the same time.", isCorrect: true },
        { text: "Recursion automatically disables Python's heap memory management.", isCorrect: false },
        { text: "The call stack can only hold up to 3 objects simultaneously.", isCorrect: false }
      ]
    },
    {
      type: 'jumble',
      question: "Jumbled Syntax: Form the base-case condition to safely terminate recursion when the orders list is empty:",
      words: ["if", "not", "orders:", "return"],
      correctOrder: ["if", "not", "orders:", "return"]
    },
    {
      type: 'debug',
      question: "Fill in the Blank: Which method removes and returns the first element in-place from the shared list without copying?",
      codeSnippet: "current_order = orders.___(0)",
      correctWord: "pop",
      acceptableWords: ["pop", "pop()"]
    }
  ];

  const level3CodeChallenge = {
    levelNumber: 3,
    title: "Level 3: Fix Recursive Memory Accumulation",
    subtitle: "In-Place Recursive List Mutation Challenge",
    description: "The recursive removal function calls items.copy() at every level of the call stack. Because all stack frames remain alive until the base case, memory bloats exponentially! Drag the in-place pruning block into Line 3 to share one single list across all stack frames.",
    codeLinesBefore: [
      "def remove_order(items):",
      "    if not items: return"
    ],
    slotLineNumber: 3,
    buggyCode: "    new_list = items.copy()",
    codeLinesAfter: [
      "    remove_order(items)"
    ],
    replacementOptions: [
      {
        id: "slice_copy",
        codeText: "    new_list = items[:]",
        shortText: "new_list = items[:]",
        label: "items[:]",
        isCorrect: false,
        tag: "Slice Copy",
        feedbackTitle: "⚠️ Slice Still Clones Memory!",
        feedbackText: "List slicing items[:] still creates a brand-new list object in RAM on each recursive call. Compounding stack copies will still crash the server."
      },
      {
        id: "pop_inplace",
        codeText: "    items.pop(0)",
        shortText: "items.pop(0)",
        label: "items.pop(0)",
        isCorrect: true,
        tag: "In-Place Mutation",
        feedbackTitle: "🎉 Zero-Copy Recursion Fix Confirmed!",
        feedbackText: "Outstanding! Pruning the single shared list in-place means every recursive frame operates on the exact same Memory Box #1. Physical RAM stays 100% green and stable!"
      },
      {
        id: "list_constructor_l3",
        codeText: "    new_list = list(items)",
        shortText: "new_list = list(items)",
        label: "list(items)",
        isCorrect: false,
        tag: "List Constructor",
        feedbackTitle: "⚠️ Heap Object Duplication!",
        feedbackText: "list(items) duplicates the array on every call, retaining multiple heavy copies in active heap memory."
      }
    ]
  };

  const handleDrag = () => {
    unlockAudio();
    if (isBuilding || hasCrashed) return;
    setIsBuilding(true);

    if (mode === 'copy') {
      playThud(); // Unlock audio context on click
      let currentRam = ram;
      let currentStack = stack;

      const recurseExecute = () => {
        playThud(); // Sync sound with each recursive allocation
        setExecutingLine(1); // def
        setTimeout(() => {
          setExecutingLine(3); // copy
          setTimeout(() => {
            setExecutingLine(4); // pop
            setTimeout(() => {
              setExecutingLine(5); // recurse
              setTimeout(() => {
                setExecutingLine(0);

                let nextLength = 0;
                setRamObjects(prev => {
                  const lastList = prev[prev.length - 1];
                  const newList = lastList.slice(1);
                  nextLength = newList.length;
                  return [...prev, newList];
                });

                setTimeout(() => {
                  currentRam += (nextLength * 7);
                  currentStack += 5;
                  setRam(currentRam);
                  setStack(currentStack);
                  setStackFrames(prev => [...prev, 1]);

                  if (nextLength === 1 || currentRam >= 100) {
                    setTimeout(() => {
                      onCrash();
                      setIsBuilding(false);
                      setHasCrashed(true);
                    }, 400);
                  } else {
                    setTimeout(recurseExecute, 100);
                  }
                }, 50); // slight delay to allow state update
              }, 400);
            }, 400);
          }, 400);
        }, 400);
      };

      // Start by highlighting the caller
      setExecutingLine(6);
      setTimeout(recurseExecute, 600);

    } else {
      playPop(); // Unlock audio context on click
      let currentStack = stack;

      const recurseExecute = (currentListLength) => {
        if (currentListLength === 0) {
          setExecutingLine(1); // def
          setTimeout(() => {
            setExecutingLine(2); // if not items: return
            setTimeout(() => {
              setExecutingLine(0);
              setIsBuilding(false);
              setConditionMet(true);
            }, 800);
          }, 400);
          return;
        }

        playPop(); // Sync sound with each recursive call
        setExecutingLine(1); // def
        setTimeout(() => {
          setExecutingLine(3); // pop
          setTimeout(() => {
            setExecutingLine(5); // recurse
            setTimeout(() => {
              setExecutingLine(0);
              currentStack += 5;

              setStack(currentStack);
              const nextLength = currentListLength > 0 ? currentListLength - 1 : 0;

              setRamObjects(prev => {
                const lastList = prev[0];
                return [lastList.slice(0, -1)];
              });
              setRam(nextLength * 7);
              setStackFrames(prev => [...prev, 1]);

              setTimeout(() => recurseExecute(nextLength), 100);
            }, 400);
          }, 400);
        }, 400);
      };

      // Start by highlighting the caller
      setExecutingLine(6);
      setTimeout(() => recurseExecute(5), 600);
    }
  };

  // No more pop-ups!

  const storySlides = [
    {
      title: "Scene 1: 10,000 Orders, One Master Tray",
      image: "/orders_tray_intro.jpg",
      text: "The campus delivery desk must process 10,000 order slips, one at a time, using a single master tray. The dispatcher removes the top slip with items.pop(), calls the same procedure to process the remaining orders, and leaves a small return note on the call stack while waiting for the next call to finish.",
      buttonText: "See what happens...",
      color: "#60a5fa"
    },
    {
      title: "Scene 2: The Photocopied Order Nightmare",
      image: "/orders_tray_bad.jpg",
      text: "The naive dispatcher photocopies the entire remaining order tray before handling each order and calling the next recursive step. Memory Bloat: each active call retains another list copy, potentially producing quadratic total list storage and exhausting memory; Data Desync: separate copies can disagree about which orders remain; CPU Lag: repeatedly copying shrinking lists creates quadratic copying work and makes processing painfully slow.",
      buttonText: "Simulate Disaster",
      color: "#ef4444"
    },
    null,
    {
      title: "Scene 3: One Tray, Many References",
      image: "/orders_tray_good.jpg",
      text: "The breakthrough is to pass the same list reference into every recursive call and remove each order directly from that one master tray using items.pop(). Each active call refers to the same list, so no full list copy is allocated per call; when the tray becomes empty, the base case returns and the waiting calls unwind in reverse order, just like the return notes being removed from a stack.",
      buttonText: "Start Smart Simulation",
      color: "#10b981",
      action: () => {
        setRam(35);
        setStack(0);
        setRamObjects([[1, 2, 3, 4, 5]]);
        setStackFrames([]);
        setMode('pointer');
        setPrediction(null);
        setQ1Choice(null);
        setQ2Choice(null);
        setHasCrashed(false);
        setConditionMet(false);
        setStoryStep(4);
      }
    }
  ];

  if (storySlides[storyStep] !== null && storyStep < storySlides.length) {
    const steps = [
      { id: 0, label: "1. The Master Tray" },
      { id: 1, label: "2. Copy Nightmare" },
      { id: 3, label: "3. Shared References" }
    ];

    return (
      <StorySlider
        slides={storySlides}
        storyStep={storyStep}
        setStoryStep={setStoryStep}
        steps={steps}
      />
    );
  }

  const copyLineExplanations = {
    1: {
      code: "def remove_order(items):",
      desc: "• Defines the recursive order cancellation function taking the remaining orders list.\n• Pushes a new execution stack frame into the Call Stack for every recursive invocation.\n• Expects to chip away items step-by-step until the list reaches the base case.\n• Without careful memory control, recursive chains can easily multiply data allocations."
    },
    2: {
      code: "    if not items: return",
      desc: "• 🛑 BASE CONDITION: Checks if the items list is empty, stopping the recursion.\n• Critical guard condition to prevent infinite recursion and stack overflow errors.\n• When the condition evaluates to True, Python begins unwinding the call stack.\n• Without this guard, the function would run indefinitely until system exhaustion."
    },
    3: {
      code: "    new_list = items.copy()",
      desc: "• ⚠️ RECURSIVE DISASTER: Calls .copy() to duplicate the entire order list on every call!\n• With 10,000 items, creates 10,000 separate lists in RAM, causing O(N²) memory allocation.\n• Every single step clones megabytes of existing data instead of operating on the original.\n• System RAM rapidly skyrockets toward 100 GB, crashing the recursive waiter!"
    },
    4: {
      code: "    new_list.pop(0)",
      desc: "• Removes the first item from the newly cloned list at index 0.\n• In Python lists, popping from index 0 forces every subsequent item to shift left in RAM.\n• Wastes O(N) CPU operations in addition to the memory waste from the prior .copy().\n• Modifies only the temporary duplicate, leaving the previous list versions in RAM."
    },
    5: {
      code: "    remove_order(new_list)",
      desc: "• Makes a recursive call by passing the newly cloned list into the next frame.\n• Creates a nested chain of call frames where each frame locks its own duplicate list in RAM.\n• Prevents Python's Garbage Collector from reclaiming previous lists while recursion is active.\n• Leads directly to an Out-Of-Memory system crash before the orders can finish."
    },
    6: {
      code: "remove_order(orders)",
      desc: "• Main entry point: Starts recursive processing on the original 10,000 orders list.\n• Initializes the recursive call sequence and triggers the initial memory allocation.\n• If the function creates copies recursively, memory usage balloons exponentially.\n• Shows why recursive algorithms in production must use Pass-by-Reference in-place operations."
    }
  };

  const pointerLineExplanations = {
    1: {
      code: "def remove_order(items):",
      desc: "• Defines the in-place recursive function processing orders by shared reference.\n• Receives the pointer to the master orders list directly without duplicating elements.\n• Pushes lightweight call frames on the stack that all reference the exact same memory block.\n• Keeps heap memory allocation strictly at O(1) throughout all recursive steps."
    },
    2: {
      code: "    if not items: return",
      desc: "• 🛑 BASE CONDITION: Successfully halts the recursive unwinding when the list is empty.\n• Protects against IndexError and terminates the recursive call chain safely.\n• Each completed frame is popped from the stack, recovering call stack memory.\n• Ensures that the recursion exits cleanly as soon as all orders are processed."
    },
    3: {
      code: "    items.pop()",
      desc: "• ⚡ IN-PLACE POP: Directly removes the last item from the existing list in RAM!\n• Shrinks the list buffer in-place with O(1) time complexity and 0 extra memory allocated.\n• Mutates the single master object directly; id(items) never changes across calls.\n• Physical RAM footprint steadily DECREASES instead of blowing up the machine!"
    },
    5: {
      code: "    remove_order(items)",
      desc: "• Re-invokes remove_order() passing the exact same list reference to the next frame.\n• Adds only a lightweight Call Stack pointer (~80 bytes), leaving Heap RAM completely flat.\n• Allows deep recursion without creating orphan duplicate lists in physical memory.\n• Processes all 10,000 orders smoothly and completes safely in milliseconds."
    },
    6: {
      code: "remove_order(orders)",
      desc: "• Main function call starting the in-place recursive order processing.\n• Passes the master list by reference, proving scalable recursion in Python.\n• Demonstrates how in-place mutation turns dangerous O(N²) memory explosions into O(1) safety.\n• Successfully completes processing with 100% memory efficiency and zero crashes!"
    }
  };

  const renderAnimatedExplanation = (isDanger, explanations) => {
    if (!selectedLine || !explanations[selectedLine]) {
      return null;
    }

    const data = explanations[selectedLine];
    const rawLines = data.desc ? data.desc.split('\n').map(l => l.replace(/^[•\s*-]+/, '').trim()).filter(Boolean) : [];
    const meta = [
      { shortTag: "1. Code", category: "Python Action", color: isDanger ? '#7c4a2d' : '#256038', bg: isDanger ? '#fff2e8' : '#e9f4ec', icon: "💻", label: "Execution Logic" },
      { shortTag: "2. RAM", category: "In Physical RAM", color: isDanger ? '#8c5914' : '#2f6564', bg: isDanger ? '#fdf3e2' : '#eaf2ee', icon: "🧠", label: "Physical Memory" },
      { shortTag: "3. Scale", category: "Scale & Recursion", color: isDanger ? '#9c4d3d' : '#15803d', bg: isDanger ? '#fbf0ed' : '#f0fdf4', icon: isDanger ? "⚠️" : "⚡", label: "Recursion Scale" },
      { shortTag: "4. Rule", category: "Architecture Rule", color: isDanger ? '#7c4a2d' : '#0f766e', bg: isDanger ? '#fff2e8' : '#ccfbf1', icon: "🎯", label: "Key Rule" }
    ];

    const points = rawLines.map((text, idx) => ({
      step: idx + 1,
      shortTag: meta[idx]?.shortTag || `${idx + 1}. Point`,
      category: meta[idx]?.category || "Detail",
      color: meta[idx]?.color || (isDanger ? '#7c4a2d' : '#256038'),
      bg: meta[idx]?.bg || '#f4efe4',
      icon: meta[idx]?.icon || "💡",
      label: meta[idx]?.label || "Explanation",
      text
    }));

    const currentIdx = Math.min(Math.max(explainStep - 1, 0), Math.max(points.length - 1, 0));
    const activePoint = points[currentIdx] || {
      step: 1,
      shortTag: "1. Info",
      category: "Explanation",
      color: isDanger ? '#7c4a2d' : '#256038',
      bg: '#f4efe4',
      icon: "💡",
      label: "Information",
      text: data.desc || ""
    };

    return (
      <div
        key={`${selectedLine}-${explainStep}`}
        className="line-explain-card"
        style={{
          borderLeft: `4px solid ${activePoint.color}`,
          border: '1.5px solid #e4dcc8',
          background: '#ffffff',
          borderRadius: '14px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Top Header & Step Navigation */}
        <div className="explain-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="explain-step-pills" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {points.map((p) => {
              const isActive = explainStep === p.step;
              return (
                <button
                  key={p.step}
                  type="button"
                  onClick={() => setExplainStep(p.step)}
                  style={{
                    background: isActive ? p.bg : '#ffffff',
                    border: isActive ? `1.5px solid ${p.color}` : '1px solid #e4dcc8',
                    color: isActive ? p.color : '#7c7365',
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.shortTag}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSelectedLine(null)}
            type="button"
            style={{
              background: '#ffffff',
              border: '1px solid #e4dcc8',
              color: '#5b5648',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '999px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#2b2b2b'; e.currentTarget.style.background = '#f4efe4'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#5b5648'; e.currentTarget.style.background = '#ffffff'; }}
          >
            ✕ Close
          </button>
        </div>

        {/* The 1 Active Focus Point Card */}
        <div className="single-point-hero" style={{
          background: '#fffdfa',
          border: '1px solid #e4dcc8',
          borderLeft: `3px solid ${activePoint.color}`,
          borderRadius: '12px',
          padding: '14px 16px'
        }}>

          <div className="single-point-body" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div className="single-point-icon-bubble" style={{
              background: '#f4efe4',
              border: '1px solid #e4dcc8',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '1.25rem',
              lineHeight: 1
            }}>
              {activePoint.icon}
            </div>
            <div className="single-point-content" style={{ flex: 1 }}>
              <span className="single-point-title" style={{
                color: activePoint.color,
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'block',
                marginBottom: '4px'
              }}>
                {activePoint.label}
              </span>
              <p className="single-point-desc" style={{
                color: '#4a443b',
                fontSize: '0.88rem',
                lineHeight: '1.6',
                margin: 0
              }}>
                {activePoint.text}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="explain-progress-bar" style={{
          background: '#f0ece0',
          height: '4px',
          borderRadius: '2px',
          margin: '14px 0 10px',
          overflow: 'hidden'
        }}>
          <div
            className="explain-progress-fill"
            style={{
              width: `${(explainStep / Math.max(points.length, 1)) * 100}%`,
              height: '100%',
              background: isDanger
                ? 'linear-gradient(90deg, #FA994F, #e8a33d)'
                : 'linear-gradient(90deg, #2f6564, #4f9a63)',
              transition: 'width 0.25s ease'
            }}
          />
        </div>

        {/* Bottom Interactive Flow Bar */}
        <div className="explain-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setExplainStep(s => Math.max(s - 1, 1))}
            disabled={explainStep === 1}
            type="button"
            className="explain-nav-btn prev"
            style={{
              background: '#ffffff',
              border: '1px solid #e4dcc8',
              color: explainStep === 1 ? '#b8b0a2' : '#5b5648',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: explainStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <span>← Prev</span>
          </button>

          <span style={{ fontSize: '0.78rem', color: '#7c7365', fontWeight: 600 }}>
            Point {explainStep} of {points.length}
          </span>

          {explainStep < points.length ? (
            <button
              onClick={() => setExplainStep(s => Math.min(s + 1, points.length))}
              type="button"
              className="explain-nav-btn next"
              style={{
                background: isDanger ? '#fff2e8' : '#e9f4ec',
                color: isDanger ? '#7c4a2d' : '#2f6564',
                border: isDanger ? '1px solid #FA994F' : '1px solid #4f9a63',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <span>Next Point</span>
              <span className="arrow-slide-anim" style={{ display: 'flex' }}>
                <ArrowRight size={14} strokeWidth={2.8} />
              </span>
            </button>
          ) : (
            <button
              onClick={() => setSelectedLine(null)}
              type="button"
              className="explain-nav-btn next"
              style={{
                background: '#e9f4ec',
                color: '#256038',
                border: '1px solid #4f9a63',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span>Got it! ✓</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPreFlightCard = () => {
    const isBothSelected = q1Choice !== null && q2Choice !== null;
    const isQ1Correct = mode === 'copy' ? q1Choice === 'B' : q1Choice === 'A';
    const isQ2Correct = mode === 'copy' ? q2Choice === 'B' : q2Choice === 'A';
    const isBothCorrect = isBothSelected && isQ1Correct && isQ2Correct;

    return (
      <div style={{
        width: '100%',
        background: '#fdfbf5',
        border: isBothSelected
          ? (isBothCorrect ? '1.5px solid #4f9a63' : '1.5px solid #e8a33d')
          : '1.5px solid #e4dcc8',
        borderRadius: '18px',
        padding: '24px 26px',
        boxShadow: '0 4px 20px rgba(91, 86, 72, 0.06)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4dcc8', paddingBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🎯</span>
            <div>
              <strong style={{ fontSize: '1.15rem', fontFamily: '"Fraunces", Georgia, serif', color: '#2b2b2b', letterSpacing: '0.2px' }}>
                {mode === 'copy' ? "Pre-Flight Check: Orders Tray & Recursion" : "Pre-Flight Check: Shared List Mutation"}
              </strong>
              <span style={{ display: 'block', fontSize: '0.78rem', color: '#7c7365' }}>
                Answer both questions before running the live simulation
              </span>
            </div>
          </div>
        </div>

        {/* QUESTION 1 */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e4dcc8',
          borderRadius: '14px',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#7c4a2d',
              background: '#fff2e8',
              border: '1px solid rgba(246, 159, 92, 0.4)',
              padding: '3px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              Question 1
            </span>
          </div>

          <p style={{ fontSize: '0.94rem', color: '#2b2b2b', margin: 0, lineHeight: '1.5', fontWeight: 600 }}>
            {mode === 'copy'
              ? "Look at 'new_list = items.copy()' on the left. What happens in RAM on every recursive step?"
              : "Look at 'items.pop()' on the left. How does Python manage memory when orders are removed?"}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mode === 'copy' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('A');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q1Choice === 'A' ? '#fff8f2' : '#ffffff',
                    border: q1Choice === 'A' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q1Choice === 'A' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q1Choice === 'A' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>A.</strong> Python simply moves an internal index pointer without duplicating any list elements.</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('B');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q1Choice === 'B' ? '#fff8f2' : '#ffffff',
                    border: q1Choice === 'B' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q1Choice === 'B' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q1Choice === 'B' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>B.</strong> Python allocates a brand-new list object in heap memory for each recursive call frame.</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('A');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q1Choice === 'A' ? '#fff8f2' : '#ffffff',
                    border: q1Choice === 'A' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q1Choice === 'A' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q1Choice === 'A' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>A.</strong> It mutates the single shared list in-place directly in Memory Box #1 (0 extra list allocations).</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('B');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q1Choice === 'B' ? '#fff8f2' : '#ffffff',
                    border: q1Choice === 'B' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q1Choice === 'B' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q1Choice === 'B' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>B.</strong> It generates a full duplicate backup array before each item is popped.</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* QUESTION 2 */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e4dcc8',
          borderRadius: '14px',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#7c4a2d',
              background: '#fff2e8',
              border: '1px solid rgba(246, 159, 92, 0.4)',
              padding: '3px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px'
            }}>
              Question 2
            </span>
          </div>

          <p style={{ fontSize: '0.94rem', color: '#2b2b2b', margin: 0, lineHeight: '1.5', fontWeight: 600 }}>
            {mode === 'copy'
              ? "Because recursive stack frames remain active until the base case, what happens to those list copies?"
              : "When all recursive frames process the same single list in-place, what happens to RAM?"}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mode === 'copy' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('A');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q2Choice === 'A' ? '#fff8f2' : '#ffffff',
                    border: q2Choice === 'A' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q2Choice === 'A' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q2Choice === 'A' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>A.</strong> Python frees each sub-list immediately as soon as the next recursive call begins.</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('B');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q2Choice === 'B' ? '#fff8f2' : '#ffffff',
                    border: q2Choice === 'B' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q2Choice === 'B' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q2Choice === 'B' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>B.</strong> All waiting stack frames retain their separate copies simultaneously in RAM, causing cumulative memory explosion!</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('A');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q2Choice === 'A' ? '#fff8f2' : '#ffffff',
                    border: q2Choice === 'A' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q2Choice === 'A' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q2Choice === 'A' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>A.</strong> All stack frames point to the single master list in Memory Box #1, keeping RAM completely safe and flat!</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('B');
                  }}
                  style={{
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    padding: '12px 14px',
                    background: q2Choice === 'B' ? '#fff8f2' : '#ffffff',
                    border: q2Choice === 'B' ? '2px solid #FA994F' : '1.5px solid #e4dcc8',
                    borderRadius: '12px',
                    color: '#2b2b2b',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                    boxShadow: q2Choice === 'B' ? '0 2px 8px rgba(250, 153, 79, 0.2)' : 'none'
                  }}
                >
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: q2Choice === 'B' ? '5px solid #FA994F' : '2px solid #d1c7b7',
                    background: '#ffffff',
                    marginTop: '2px',
                    flexShrink: 0
                  }} />
                  <span><strong>B.</strong> Every call frame consumes an extra 35 MB of duplicate list data, overwhelming server RAM.</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* FEEDBACK & CONFIRMATION */}
        {isBothSelected ? (
          <div style={{
            background: isBothCorrect ? '#eaf2ee' : '#fdf3e2',
            border: isBothCorrect ? '1.5px solid #4f9a63' : '1.5px solid #e8a33d',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'fadeIn 0.25s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>{isBothCorrect ? "🎉" : "💡"}</span>
              <strong style={{ fontSize: '0.98rem', color: isBothCorrect ? '#256038' : '#8c5914', fontFamily: '"Fraunces", Georgia, serif' }}>
                {isBothCorrect ? "Spot-on! Your Intuition is 100% Correct" : "Hold on — Review Your Intuition"}
              </strong>
            </div>

            <p style={{ margin: 0, fontSize: '0.88rem', color: '#2b2b2b', lineHeight: '1.55' }}>
              {isBothCorrect ? (
                mode === 'copy'
                  ? "Because stack frames remain active until the base case, each intermediate list copy stays alive simultaneously in RAM. Launch to watch the cumulative memory explosion live!"
                  : "Passing the master list by reference allows items.pop() to prune the single heap object in-place with zero duplicate list allocations. Launch to watch RAM stay safe!"
              ) : (
                mode === 'copy'
                  ? "Even though each sub-list is shorter, none of the copies are freed until recursion unwinds from the base case. That cumulative retention crashes memory."
                  : "items.pop() mutates the existing array in-place without generating extra copies. Every recursive call operates directly on the same memory box."
              )}
            </p>

            {isBothCorrect ? (
              <button
                type="button"
                onClick={() => {
                  unlockAudio();
                  playPop();
                  setPrediction({ choice: mode, isCorrect: true });
                }}
                className="btn primary"
                style={{
                  alignSelf: 'flex-start',
                  background: 'linear-gradient(135deg, #FA994F, #EB8975)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '10px 22px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(235, 137, 117, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🚀</span> Launch Live Simulation & RAM Lab →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  unlockAudio();
                  playPop();
                  setQ1Choice(null);
                  setQ2Choice(null);
                }}
                style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  border: '1px solid #e8a33d',
                  color: '#8c5914',
                  padding: '7px 18px',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🔄</span> Revise Answers
              </button>
            )}
          </div>
        ) : (
          <div style={{
            background: '#faf6ee',
            border: '1px dashed #e4dcc8',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#7c7365',
            fontSize: '0.86rem',
            textAlign: 'center'
          }}>
            👉 Select your answers for <strong>Question 1</strong> and <strong>Question 2</strong> above.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="level-container level1-light-theme">
      <div className="story-panel glass-panel">
        <h2>Code Execution</h2>

        {mode === 'copy' ? (
          <div style={{ background: '#faf6ee', border: '1.5px solid #e4dcc8', borderRadius: '16px', padding: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ color: '#2b2b2b' }}>Code execution: Full Copy</strong>
              <span style={{ fontSize: '0.75rem', color: '#c4682c', background: '#fdf3e2', border: '1px solid #e8a33d', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Memory Danger ⚠️</span>
            </div>
            <pre style={{ margin: '8px 0 0 0', fontFamily: 'monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '10px', fontSize: '0.85rem' }}>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>def remove_order(items):</div>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>    if not items: return</div>
              <div style={{ color: '#b91c1c', padding: '2px 4px', fontWeight: 600 }}>    # DANGER: Creates a massive new copy!</div>

              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>
                {`    new_list = items.copy()`}
              </div>
              <div onClick={() => selectLine(4)} style={{ ...getLineStyle(4), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(4) }}>    new_list.pop(0)</div>
              <div onClick={() => selectLine(5)} style={{ ...getLineStyle(5), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(5) }}>    remove_order(new_list)</div>
              <div style={{ color: '#7c7365', marginTop: '10px', padding: '2px 4px' }}>orders = [1, 2, 3, 4, 5]</div>
              <div onClick={() => selectLine(6)} style={{ ...getLineStyle(6), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(6) }}>remove_order(orders)</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(true, copyLineExplanations)}
          </div>
        ) : (
          <div style={{ background: '#faf6ee', border: '1.5px solid #e4dcc8', borderRadius: '16px', padding: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ color: '#2b2b2b' }}>Optimized execution: In-Place Pop</strong>
              <span style={{ fontSize: '0.75rem', color: '#256038', background: '#eaf2ee', border: '1px solid #4f9a63', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Memory Safe ✓</span>
            </div>
            <pre style={{ margin: '8px 0 0 0', fontFamily: 'monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '10px', fontSize: '0.85rem' }}>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>def remove_order(items):</div>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>    if not items: return</div>
              <div style={{ color: '#256038', padding: '2px 4px', fontWeight: 600 }}>    # SUCCESS: Mutates same list in-place</div>

              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>
                {`    items.pop()`}
              </div>

              <div onClick={() => selectLine(5)} style={{ ...getLineStyle(5), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(5) }}>    remove_order(items)</div>
              <div style={{ color: '#7c7365', marginTop: '10px', padding: '2px 4px' }}>orders = [1, 2, 3, 4, 5]</div>
              <div onClick={() => selectLine(6)} style={{ ...getLineStyle(6), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(6) }}>remove_order(orders)</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(false, pointerLineExplanations)}
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', flexDirection: 'column' }}>
          {mode === 'pointer' && !showQuiz && conditionMet && (
            <button
              type="button"
              style={{
                background: 'linear-gradient(135deg, #FA994F 0%, #c4682c 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.94rem',
                borderRadius: '999px',
                padding: '12px 24px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(250, 153, 79, 0.3)'
              }}
              onClick={() => setShowQuiz(true)}
            >
              Check Knowledge
            </button>
          )}
          {hasCrashed && mode === 'copy' && (
            <button
              type="button"
              style={{
                background: 'linear-gradient(135deg, #FA994F, #EB8975)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                borderRadius: '999px',
                padding: '12px 22px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(235, 137, 117, 0.3)'
              }}
              onClick={() => {
                setStoryStep(3);
              }}
            >
              <span>View Smart Approach</span> <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="interaction-panel glass-panel" style={{ justifyContent: 'flex-start' }}>
        {!prediction?.isCorrect ? (
          renderPreFlightCard()
        ) : (
          <>
            {/* Right Side Heading */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4dcc8', paddingBottom: '12px', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontFamily: '"Fraunces", Georgia, serif', color: '#2f6564', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡</span> Call Stack & Memory Simulation Lab
              </h2>
              <button
                type="button"
                onClick={handleDrag}
                disabled={isBuilding || showQuiz || hasCrashed}
                style={{
                  background: (isBuilding || hasCrashed)
                    ? '#b0a999'
                    : 'linear-gradient(135deg, #e67635 0%, #cf5717 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: (isBuilding || showQuiz || hasCrashed) ? 'not-allowed' : 'pointer',
                  boxShadow: (isBuilding || hasCrashed) ? 'none' : '0 4px 14px rgba(230, 118, 53, 0.35)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.01em'
                }}
                onMouseEnter={(e) => {
                  if (!isBuilding && !showQuiz && !hasCrashed) {
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(230, 118, 53, 0.45)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = (isBuilding || hasCrashed) ? 'none' : '0 4px 14px rgba(230, 118, 53, 0.35)';
                }}
              >
                {isBuilding ? (
                  <>
                    <div className="spinner" style={{ width: '13px', height: '13px', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span>Recursion Running...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} fill="#ffffff" />
                    <span>Run Simulation (remove_order)</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual RAM & Stack Floor (Animated Area - Top) */}
            <div style={{
              width: '100%',
              marginTop: '10px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '2px dashed #e4dcc8',
              borderRadius: '14px',
              minHeight: '270px',
              background: '#faf6ee',
              overflow: 'hidden'
            }}>
              {/* Upper Line: Real-Time RAM & Call Stack Dual Meters */}
              <div style={{
                width: '100%',
                borderBottom: '1.5px solid #e4dcc8',
                background: '#f6f0e2',
                padding: '10px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* RAM Metric */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Cpu size={15} color="#2f6564" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2f6564' }}>
                          Physical RAM (100 MB)
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        fontFamily: '"SFMono-Regular", Consolas, monospace',
                        color: ram >= 100 ? '#c25b4a' : ram > 50 ? '#d97706' : '#2f6564',
                        background: ram >= 100 ? '#fbeae7' : ram > 50 ? '#fdf3e2' : '#eaf2ee',
                        padding: '1px 8px',
                        borderRadius: '999px',
                        border: `1px solid ${ram >= 100 ? '#c25b4a' : ram > 50 ? '#e8a33d' : '#3a7d7c'}`
                      }}>
                        RAM: {ram.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e6ded0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(ram, 100)}%`,
                        background: ram >= 100
                          ? 'linear-gradient(90deg, #e77338, #c25b4a)'
                          : ram > 50
                            ? 'linear-gradient(90deg, #3a7d7c, #e8a33d)'
                            : 'linear-gradient(90deg, #2f6564, #4f9a63)',
                        borderRadius: '999px',
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                    </div>
                  </div>

                  {/* Call Stack Metric */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Layers size={15} color="#7c4a2d" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c4a2d' }}>
                          Call Stack Depth
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        fontFamily: '"SFMono-Regular", Consolas, monospace',
                        color: stack >= 80 ? '#c25b4a' : stack > 40 ? '#d97706' : '#2f6564',
                        background: stack >= 80 ? '#fbeae7' : stack > 40 ? '#fdf3e2' : '#eaf2ee',
                        padding: '1px 8px',
                        borderRadius: '999px',
                        border: `1px solid ${stack >= 80 ? '#c25b4a' : stack > 40 ? '#e8a33d' : '#3a7d7c'}`
                      }}>
                        Stack: {stack.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e6ded0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(stack, 100)}%`,
                        background: 'linear-gradient(90deg, #FA994F, #e8a33d)',
                        borderRadius: '999px',
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inside RAM & Stack container: Left: Physical RAM (Heap), Right: Call Stack */}
              <div style={{ display: 'flex', flex: 1, width: '100%', minHeight: '220px' }}>
                {/* Left: Physical RAM (Heap) */}
                <div style={{ flex: 1.6, borderRight: '2px dashed #e4dcc8', padding: '14px 16px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                  <p style={{ color: '#5b5648', fontSize: '0.8rem', fontWeight: 700, margin: '0 0 10px 0' }}>
                    Physical RAM (Heap Tray Objects)
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', overflowY: 'auto', alignContent: 'flex-start', flex: 1 }}>
                    {ramObjects.map((list, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          background: '#ffffff',
                          border: mode === 'copy' ? (i === 0 ? '1.5px solid #2f6564' : '1.5px solid #e8a33d') : '1.5px solid #4f9a63',
                          padding: '8px 12px',
                          color: '#2b2b2b',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          animation: 'popIn 0.2s',
                          boxShadow: '0 2px 0 #e4dcc8'
                        }}>
                          📄 [{list.join(', ')}]
                        </div>
                        <span style={{
                          marginTop: '4px',
                          background: mode === 'copy' && i > 0 ? '#fbeae7' : '#eaf2ee',
                          color: mode === 'copy' && i > 0 ? '#c25b4a' : '#256038',
                          border: `1px solid ${mode === 'copy' && i > 0 ? '#c25b4a' : '#4f9a63'}`,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {list.length * 7} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Call Stack */}
                <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column-reverse', position: 'relative', boxSizing: 'border-box' }}>
                  <p style={{ color: '#5b5648', fontSize: '0.8rem', fontWeight: 700, margin: '8px 0 0 0', textAlign: 'center' }}>
                    Call Stack
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1, justifyContent: 'flex-end' }}>
                    {conditionMet && (
                      <div style={{ background: '#eaf2ee', border: '1.5px solid #4f9a63', color: '#256038', padding: '6px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', animation: 'bounceIn 0.5s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✅ BASE CASE REACHED
                      </div>
                    )}
                    {stackFrames.map((_, i) => (
                      <div key={i} style={{ background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '6px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', animation: 'slideInRight 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        remove_order() Frame #{i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Bar */}
            <div style={{
              background: '#fdfbf5',
              padding: '14px 16px',
              borderRadius: '14px',
              marginTop: '14px',
              width: '100%',
              border: '1px solid #e4dcc8',
              boxShadow: '0 2px 0 #e4dcc8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '1.05rem', fontFamily: '"Fraunces", serif', marginBottom: '8px', color: '#2b2b2b' }}>
                <strong>RAM Capacity: 100 MB</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.98rem', fontFamily: '"SFMono-Regular", Consolas, monospace', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ color: '#2f6564', fontWeight: 600 }}>35 MB (Original)</span>
                <span style={{ color: '#5b5648' }}>+</span>
                <span style={{ color: mode === 'copy' ? '#c25b4a' : '#4f9a63', fontWeight: 600 }}>
                  {mode === 'copy' ? `${ramObjects.slice(1).map(l => l.length * 7).join(' + ') || '0'} MB (Copies)` : `0 MB (In-Place)`}
                </span>
                <span style={{ color: '#5b5648' }}>=</span>
                <span style={{ fontWeight: 'bold', color: ram >= 100 ? '#c25b4a' : '#2b2b2b' }}>
                  {ram.toFixed(0)} MB Total RAM
                </span>
              </div>
            </div>

            {/* Memory Verdict Strip */}
            <div style={{
              width: '100%',
              marginTop: '12px',
              background: mode === 'copy' ? '#fbeae7' : '#e9f4ec',
              border: mode === 'copy' ? '1px solid #c25b4a' : '1px solid #4f9a63',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '0.84rem',
              color: mode === 'copy' ? '#c25b4a' : '#4f9a63',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 0 #e4dcc8',
              textAlign: 'center'
            }}>
              {mode === 'copy'
                ? `🛑 Compounding Copies: Every recursive call duplicates the tray box in RAM simultaneously!`
                : `✅ Single Shared Tray: All recursive call frames pop items directly from Memory Box #1 without making duplicates!`
              }
            </div>
          </>
        )}
      </div>

      {/* Quiz Modal Overlay */}
      {showQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(36, 30, 26, 0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(10px)', padding: '16px' }}>
          <div style={{ width: '920px', maxWidth: '96%', maxHeight: '92vh', overflowY: 'auto' }}>
            <Quiz questions={questions} codeChallenge={level3CodeChallenge} onPass={onPass} onClose={() => setShowQuiz(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Level3;
