import React, { useState, useEffect } from 'react';
import { Play, Info, Trash2, ArrowRight, Cpu } from 'lucide-react';
import Quiz from '../components/Quiz';
import StorySlider from '../components/StorySlider';
import { playThud, playSweep, playPop, unlockAudio } from '../utils/audio';

const Level4 = ({ onCrash, onPass, RamBar }) => {
  const [ram, setRam] = useState(15);
  const [attendees, setAttendees] = useState([{ id: 1, index: 1, active: true, sweeping: false }]);
  const [mode, setMode] = useState('leak');
  const [showQuiz, setShowQuiz] = useState(false);
  const [storyLog, setStoryLog] = useState("Attendees checking in. Check out sessions when done.");
  const [isSweeping, setIsSweeping] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [storyStep, setStoryStep] = useState(0);

  const [executingLine, setExecutingLine] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [explainStep, setExplainStep] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [q1Choice, setQ1Choice] = useState(null);
  const [q2Choice, setQ2Choice] = useState(null);
  const [showHeapInspector, setShowHeapInspector] = useState(true);

  const selectLine = (lineNum) => {
    setSelectedLine(lineNum);
    setExplainStep(1);
  };

  const storySlides = [
    {
      title: "Scene 1: The College Fest That Never Forgets",
      image: "/fest_registration_intro.jpg",
      text: "Your college is hosting a massive fest with thousands of students checking in for events, workshops, and competitions. The registration app tracks every student's details, but there's a hidden problem: when students leave the fest, what happens to the data their sessions no longer need?",
      buttonText: "See what happens...",
      color: "#60a5fa"
    },
    {
      title: "Scene 2: The Ghost Attendees Disaster",
      image: "/fest_registration_bad.jpg",
      text: "The developer makes a small but costly mistake: every student's temporary session data is appended to a permanent global list, and nothing is removed when the student leaves. Memory Bloat: thousands of unnecessary records keep consuming RAM; Ghost References: students who have already left still have their data retained in the application's tracking list; GC Blocked: Python cannot reclaim those objects while the list still references them, eventually slowing the registration system or crashing the server.",
      buttonText: "Simulate Disaster",
      color: "#ef4444"
    },
    null,
    {
      title: "Scene 3: Clear the Queue, Free the Memory",
      image: "/fest_registration_good.jpg",
      text: "The smart developer removes completed sessions from the temporary global list and releases any other unnecessary references. When an object's reference count reaches zero in CPython, its memory can be reclaimed automatically; del can remove a reference, but the object is freed only when no references remain. Now the registration system can reuse memory for incoming students instead of holding on to thousands of finished sessions.",
      buttonText: "Start Smart Simulation",
      color: "#10b981",
      action: () => {
        setRam(15);
        setAttendees([
          { id: 1, index: 1, active: true, sweeping: false },
          { id: 2, index: 2, active: true, sweeping: false },
          { id: 3, index: 3, active: true, sweeping: false }
        ]);
        setMode('gc');
        setPrediction(null);
        setQ1Choice(null);
        setQ2Choice(null);
        setSelectedLine(null);
        setHasCrashed(false);
        setStoryLog("Garbage Collector active! Click 'Check Out Attendee' to dereference sessions, then 'Run Garbage Collector' to sweep.");
        setStoryStep(4);
      }
    }
  ];

  const leakLineExplanations = {
    1: {
      code: "sessions = []",
      desc: "• Initializes a global Python list in module scope to store registered student sessions.\n• In RAM: Allocates an expandable pointer array in heap memory with permanent lifecycle.\n• Scale impact: Persists indefinitely across the entire application runtime until process shutdown.\n• Takeaway: Global collections hold strong references to items forever unless actively pruned."
    },
    2: {
      code: "def checkout_student(student):",
      desc: "• Defines the function handling student checkouts, accepting attendee metadata.\n• In RAM: Pushes a temporary local execution frame to the call stack upon invocation.\n• Scale impact: Executes for every arriving student, binding incoming arguments into local variables.\n• Takeaway: Local references normally expire when a function exits—unless leaked globally."
    },
    3: {
      code: "sessions.append(student)",
      desc: "• ⚠️ MEMORY LEAK: Appends departing student data into the permanent global list.\n• In RAM: sys.getrefcount() remains ≥ 1, blocking Python's Garbage Collector from freeing RAM.\n• Scale impact: With thousands of checkouts, accumulated ghost references exhaust physical memory.\n• Takeaway: Unbounded global caches and session logs are the #1 source of Python memory leaks."
    },
    4: {
      code: 'return "Checked out"',
      desc: "• Outputs status confirming that the student has visually departed the check-in desk.\n• In RAM: The session dictionary remains anchored in heap memory via the global list.\n• Scale impact: The UI reports success even while RAM is silently leaking in the background.\n• Takeaway: A successful return statement does not mean memory was freed!"
    },
    5: {
      code: `checkout_student(student_${attendees.length})`,
      desc: "• Calls the checkout routine passing the student session instance.\n• In RAM: Pushes reference pointer into the function stack.\n• Scale impact: Each call traps another finished session permanently in heap RAM.\n• Takeaway: Repeated calls accumulate ghost references until RAM hits 100% capacity."
    }
  };

  const gcLineExplanations = {
    1: {
      code: "def checkout_student(student):",
      desc: "• Defines the optimized checkout routine without persisting state to global scope.\n• In RAM: Creates an isolated local stack frame where variables are scoped strictly to the function.\n• Scale impact: High-throughput execution with no global residual data left behind.\n• Takeaway: Clean variable scoping prevents unintended reference retention across transactions."
    },
    2: {
      code: `del student`,
      desc: "• ⚡ EXPLICIT CLEANUP: Uses Python's 'del' keyword to sever the variable reference.\n• In RAM: Reference count drops to 0 (sys.getrefcount == 0); memory block is queued for instant reclamation.\n• Scale impact: Python's Garbage Collector frees the memory block immediately, keeping RAM low.\n• Takeaway: When an object has zero active references, its physical memory is promptly recycled."
    },
    3: {
      code: 'return "Checked out"',
      desc: "• Returns confirmation status with zero lingering references on the heap.\n• In RAM: Standard function exit unwinding with 0 heap leakage.\n• Scale impact: Constant memory profile regardless of how many thousands of students check out.\n• Takeaway: Demonstrates predictable, production-grade memory safety and lifecycle management."
    },
    4: {
      code: `checkout_student(student_${attendees.length})`,
      desc: "• Calls the clean checkout routine passing the attendee reference.\n• In RAM: Memory is reclaimed automatically as soon as the reference count hits zero.\n• Scale impact: Handles millions of transactions without expanding the memory footprint.\n• Takeaway: Python's automatic GC works efficiently when code doesn't hoard references."
    }
  };

  const getCodeLineBg = (lineNum) => {
    if (selectedLine === lineNum) return 'rgba(235, 137, 117, 0.25)';
    if (executingLine === lineNum) return mode === 'leak' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(79, 154, 99, 0.2)';
    return 'transparent';
  };

  const getLineStyle = (lineNum) => {
    const isLineActive = executingLine === lineNum;
    const isSelected = selectedLine === lineNum;
    return {
      background: isSelected
        ? 'rgba(235, 137, 117, 0.25)'
        : isLineActive
          ? (mode === 'leak' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(79, 154, 99, 0.2)')
          : 'transparent',
      borderLeft: isSelected
        ? '3px solid #EB8975'
        : isLineActive
          ? (mode === 'leak' ? '3px solid #b91c1c' : '3px solid #4f9a63')
          : '3px solid transparent',
      paddingLeft: '6px',
      transition: 'all 0.2s',
      color: '#2b2b2b'
    };
  };

  const questions = [
    {
      type: 'mcq',
      question: "When does CPython immediately deallocate an object and free its physical memory back to RAM?",
      options: [
        { text: "The exact moment its Reference Count drops to Zero (no active references remain).", isCorrect: true },
        { text: "Only when the entire computer process is restarted.", isCorrect: false },
        { text: "Periodically every 5 minutes regardless of active references.", isCorrect: false }
      ]
    },
    {
      type: 'jumble',
      question: "Jumbled Syntax: Form the code to inspect how many active references currently point to an attendee object in memory:",
      words: ["sys.getrefcount(", "attendee", ")"],
      correctOrder: ["sys.getrefcount(", "attendee", ")"]
    },
    {
      type: 'debug',
      question: "Fill in the Blank: Use the keyword that deletes a variable binding and decrements an object's reference count:",
      codeSnippet: "___ finished_session",
      correctWord: "del",
      acceptableWords: ["del"]
    }
  ];

  const level4CodeChallenge = {
    levelNumber: 4,
    title: "Level 4: Fix the Global Memory Leak",
    subtitle: "Garbage Collection & Dereferencing Challenge",
    description: "The checkout routine appends finished student sessions to a permanent global list. This keeps their reference count ≥ 1, blocking Python's Garbage Collector from freeing their memory. Drag the correct dereferencing block into Line 2 to allow automatic GC cleanup!",
    codeLinesBefore: [
      "def checkout_student(student):"
    ],
    slotLineNumber: 2,
    buggyCode: "    sessions.append(student)",
    codeLinesAfter: [
      "    return \"Checked out\""
    ],
    replacementOptions: [
      {
        id: "append_global",
        codeText: "    sessions.append(student)",
        shortText: "sessions.append(student)",
        label: "sessions.append(student)",
        isCorrect: false,
        tag: "Global Retention",
        feedbackTitle: "⚠️ Memory Leak Persists!",
        feedbackText: "Appending to a permanent global list keeps reference count at 1 forever! Python's Garbage Collector cannot sweep the attendee's memory box."
      },
      {
        id: "del_student",
        codeText: "    del student",
        shortText: "del student",
        label: "del student",
        isCorrect: true,
        tag: "Dereference (GC Trigger)",
        feedbackTitle: "🎉 Reference Count Dropped to Zero!",
        feedbackText: "Masterful! Using 'del student' severs the last active reference to the session object. Its reference count drops to 0, allowing the Garbage Collector to immediately reclaim RAM!"
      },
      {
        id: "pass_noop",
        codeText: "    pass",
        shortText: "pass",
        label: "pass",
        isCorrect: false,
        tag: "No Explicit Cleanup",
        feedbackTitle: "⚠️ Incomplete Lifecycle Management!",
        feedbackText: "Doing nothing doesn't actively manage lifecycle or ensure resources are safely freed when holding external session handles."
      }
    ]
  };

  const handleCheckout = () => {
    unlockAudio();
    if (isExecuting || hasCrashed) return;
    setIsExecuting(true);

    if (mode === 'leak') {
      setExecutingLine(5);
      setTimeout(() => {
        setExecutingLine(1);
        setTimeout(() => {
          setExecutingLine(2);
          setTimeout(() => {
            setExecutingLine(3);
            setTimeout(() => {
              setExecutingLine(4);
              setTimeout(() => {
                setExecutingLine(0);
                playThud();

                let newAttendees = [];
                setAttendees(prev => {
                  const updated = [...prev];
                  const activeItem = updated.find(s => s.active);
                  if (activeItem) {
                    activeItem.active = false;
                  }
                  const newCount = updated.length + 1;
                  updated.push({ id: Date.now(), index: newCount, active: true, sweeping: false });
                  newAttendees = updated;
                  return updated;
                });

                const ghostCount = attendees.filter(s => !s.active).length + 1;
                const newRam = 15 + (ghostCount * 20);
                setRam(newRam);

                if (newRam >= 100) {
                  setTimeout(() => {
                    onCrash();
                    setHasCrashed(true);
                    setIsExecuting(false);
                  }, 400);
                } else {
                  setIsExecuting(false);
                }
              }, 400);
            }, 400);
          }, 400);
        }, 400);
      }, 400);
    } else {
      setExecutingLine(4);
      setTimeout(() => {
        setExecutingLine(1);
        setTimeout(() => {
          setExecutingLine(2);
          setTimeout(() => {
            setExecutingLine(3);
            setTimeout(() => {
              setExecutingLine(0);
              playPop();

              let uncollectedCount = 0;
              let checkedStudentIndex = 1;
              setAttendees(prev => {
                const updated = [...prev];
                const activeIndex = updated.findIndex(s => s.active);
                if (activeIndex !== -1) {
                  // Dereference the active student (del student). Keep on screen awaiting GC!
                  checkedStudentIndex = updated[activeIndex].index || (activeIndex + 1);
                  updated[activeIndex] = { ...updated[activeIndex], active: false };
                } else {
                  // If all existing students are already dereferenced, check out the next one as awaiting GC
                  const maxIndex = updated.length > 0 ? Math.max(...updated.map(s => s.index || 1)) : 0;
                  checkedStudentIndex = maxIndex + 1;
                  updated.push({ id: Date.now(), index: checkedStudentIndex, active: false, sweeping: false });
                }
                uncollectedCount = updated.filter(s => !s.active).length;
                return updated;
              });

              // RAM accumulates uncollected objects until Garbage Collector runs
              setRam(Math.min(15 + (uncollectedCount * 15), 75));
              setStoryLog(`Student #${checkedStudentIndex} session dereferenced ('del student')! Object remains in RAM (Ref=0). Click 'Run Garbage Collector' to sweep.`);
              setIsExecuting(false);
            }, 400);
          }, 400);
        }, 400);
      }, 400);
    }
  };

  const handleGarbageCollect = () => {
    unlockAudio();
    if (isSweeping) return;

    const uncollectedCount = attendees.filter(s => !s.active).length;
    if (uncollectedCount === 0) {
      setStoryLog("RAM is already clean! Check out an attendee first to see GC sweep unreferenced memory.");
      return;
    }

    playSweep();
    setIsSweeping(true);
    setStoryLog(`Garbage Collector deployed! Sweeping ${uncollectedCount} dereferenced student session${uncollectedCount > 1 ? 's' : ''}...`);

    setAttendees(prev => prev.map(s => !s.active ? { ...s, sweeping: true } : s));

    setTimeout(() => {
      // ONLY NOW are the dereferenced students deleted!
      setAttendees(prev => prev.filter(s => s.active));
      setRam(15);
      setIsSweeping(false);
      setHasCrashed(false);
      setStoryLog(`SUCCESS: Garbage Collector purged ${uncollectedCount} dereferenced session${uncollectedCount > 1 ? 's' : ''} from physical RAM!`);
    }, 1200);
  };

  const renderAnimatedExplanation = (isDanger, explanations) => {
    if (!selectedLine || !explanations[selectedLine]) {
      return null;
    }

    const data = explanations[selectedLine];
    const accentColor = isDanger ? '#c4682c' : '#256038';
    const borderAccent = isDanger ? '#e8a33d' : '#4f9a63';

    const rawLines = data.desc ? data.desc.split('\n').map(l => l.replace(/^[•\s*-]+/, '').trim()).filter(Boolean) : [];
    const meta = [
      { shortTag: "1. Code", category: "Python Action", color: '#2f6564', bg: '#fdf3e2', icon: "💻", label: "Execution Logic" },
      { shortTag: "2. RAM", category: "In Physical RAM", color: isDanger ? '#c4682c' : '#256038', bg: isDanger ? '#fdf3e2' : '#eaf2ee', icon: "🧠", label: "Heap & GC Reference" },
      { shortTag: "3. Scale", category: "Scale & Lifecycle", color: isDanger ? '#b91c1c' : '#2f6564', bg: isDanger ? '#fdf3e2' : '#eaf2ee', icon: isDanger ? "⚠️" : "⚡", label: "System Scalability" },
      { shortTag: "4. Rule", category: "Memory Rule", color: '#2f6564', bg: '#fdf3e2', icon: "🎯", label: "Key Rule" }
    ];

    const points = rawLines.map((text, idx) => ({
      step: idx + 1,
      shortTag: meta[idx]?.shortTag || `${idx + 1}. Point`,
      category: meta[idx]?.category || "Detail",
      color: meta[idx]?.color || (isDanger ? '#c4682c' : '#256038'),
      bg: meta[idx]?.bg || '#faf6ee',
      icon: meta[idx]?.icon || "💡",
      label: meta[idx]?.label || "Explanation",
      text
    }));

    const currentIdx = Math.min(Math.max(explainStep - 1, 0), Math.max(points.length - 1, 0));
    const activePoint = points[currentIdx] || {
      step: 1,
      shortTag: "1. Info",
      category: "Info",
      color: accentColor,
      bg: '#faf6ee',
      icon: "💡",
      label: "Explanation",
      text: "Click any line above to inspect."
    };

    return (
      <div
        key={`${selectedLine}-${explainStep}`}
        className="line-explain-card"
        style={{
          borderLeft: `4px solid ${activePoint.color}`,
          border: `1.5px solid ${borderAccent}`,
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(47, 101, 100, 0.08)',
          marginTop: '16px',
          padding: '16px'
        }}
      >
        {/* Top Header & Step Navigation */}
        <div className="explain-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="explain-step-pills" style={{ display: 'flex', gap: '6px' }}>
            {points.map((p) => (
              <button
                key={p.step}
                type="button"
                onClick={() => setExplainStep(p.step)}
                style={{
                  background: explainStep === p.step ? p.color : '#faf6ee',
                  color: explainStep === p.step ? '#ffffff' : '#7c7365',
                  border: `1px solid ${explainStep === p.step ? p.color : '#e4dcc8'}`,
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {p.shortTag}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSelectedLine(null)}
            style={{
              background: '#faf6ee',
              border: '1px solid #e4dcc8',
              color: '#7c7365',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '3px 10px',
              borderRadius: '999px',
              fontWeight: 600
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Code Strip */}
        <div style={{
          background: '#faf6ee',
          border: '1px solid #e4dcc8',
          borderRadius: '8px',
          padding: '8px 12px',
          fontFamily: 'monospace',
          fontSize: '0.84rem',
          color: '#2b2b2b',
          fontWeight: 600,
          marginBottom: '12px'
        }}>
          {data.code}
        </div>

        {/* The 1 Active Focus Point Card */}
        <div style={{
          background: '#fffdfa',
          border: '1px solid #e4dcc8',
          borderLeft: `4px solid ${activePoint.color}`,
          borderRadius: '10px',
          padding: '12px 14px',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: activePoint.color, background: activePoint.bg, padding: '2px 8px', borderRadius: '6px' }}>
              POINT {activePoint.step} OF {points.length} • {activePoint.category}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem', lineHeight: '1' }}>{activePoint.icon}</span>
            <div>
              <strong style={{ fontSize: '0.9rem', color: '#2b2b2b', display: 'block', marginBottom: '4px' }}>
                {activePoint.label}
              </strong>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#2b2b2b', lineHeight: '1.5' }}>
                {activePoint.text}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: '#e4dcc8', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
          <div
            style={{
              width: `${(explainStep / Math.max(points.length, 1)) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #FA994F, #EB8975)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* Bottom Interactive Flow Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setExplainStep(s => Math.max(s - 1, 1))}
            disabled={explainStep === 1}
            style={{
              background: '#faf6ee',
              border: '1px solid #e4dcc8',
              color: explainStep === 1 ? '#c7beaf' : '#2b2b2b',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: explainStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Prev
          </button>

          <span style={{ fontSize: '0.76rem', color: '#7c7365', fontWeight: 600 }}>
            Point {explainStep} of {points.length}
          </span>

          {explainStep < points.length ? (
            <button
              type="button"
              onClick={() => setExplainStep(s => Math.min(s + 1, points.length))}
              style={{
                background: 'linear-gradient(135deg, #FA994F, #EB8975)',
                border: 'none',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Next Point</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSelectedLine(null)}
              style={{
                background: '#4f9a63',
                border: 'none',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Done ✓
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPreFlightCard = () => {
    const isQ1Correct = q1Choice === 'correct';
    const isQ2Correct = q2Choice === 'correct';
    const isBothSelected = q1Choice !== null && q2Choice !== null;
    const isBothCorrect = isQ1Correct && isQ2Correct;

    return (
      <div style={{
        width: '100%',
        background: '#fffdfa',
        border: '1.5px solid #e4dcc8',
        borderRadius: '16px',
        padding: '20px 22px',
        boxShadow: '0 4px 18px rgba(47, 101, 100, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e4dcc8', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>🎯</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#2f6564', fontFamily: '"Fraunces", Georgia, serif' }}>
                Pre-Flight Code Check: Garbage Collection & Dereferencing
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#7c7365' }}>
                Analyze the checkout routine below and predict memory behavior before running live simulation
              </span>
            </div>
          </div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '12px',
            background: isBothCorrect ? '#eaf2ee' : '#fdf3e2',
            color: isBothCorrect ? '#256038' : '#8c5914',
            border: isBothCorrect ? '1px solid #4f9a63' : '1px solid #e8a33d'
          }}>
            {isBothCorrect ? "Ready to Launch ✓" : "Pre-Flight Check Required"}
          </span>
        </div>

        {/* QUESTION 1 */}
        <div style={{
          background: '#faf6ee',
          border: '1px solid #e4dcc8',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ background: '#2f6564', color: '#ffffff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>1</span>
            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#2b2b2b', lineHeight: '1.45' }}>
              {mode === 'leak'
                ? "When a student leaves the fest but their session dictionary remains appended to 'sessions = []', what happens to physical RAM?"
                : "In CPython, what prerequisite must be fulfilled before Python's Garbage Collector can deallocate an attendee's session?"}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '28px' }}>
            {mode === 'leak' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('correct');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q1Choice === 'correct' ? '#eaf2ee' : '#ffffff',
                    border: q1Choice === 'correct' ? '2px solid #4f9a63' : '1px solid #e4dcc8',
                    color: q1Choice === 'correct' ? '#256038' : '#2b2b2b',
                    fontWeight: q1Choice === 'correct' ? 700 : 500
                  }}
                >
                  <span>A. <strong>Refcount ≥ 1</strong>: The global list holds an active reference, blocking GC from freeing the session and accumulating ghost memory.</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('wrong');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q1Choice === 'wrong' ? '#fdf3e2' : '#ffffff',
                    border: q1Choice === 'wrong' ? '2px solid #e8a33d' : '1px solid #e4dcc8',
                    color: q1Choice === 'wrong' ? '#8c5914' : '#2b2b2b',
                    fontWeight: q1Choice === 'wrong' ? 700 : 500
                  }}
                >
                  <span>B. Python automatically detects that the fest event ended and purges the session without checking references.</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('correct');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q1Choice === 'correct' ? '#eaf2ee' : '#ffffff',
                    border: q1Choice === 'correct' ? '2px solid #4f9a63' : '1px solid #e4dcc8',
                    color: q1Choice === 'correct' ? '#256038' : '#2b2b2b',
                    fontWeight: q1Choice === 'correct' ? 700 : 500
                  }}
                >
                  <span>A. <strong>Refcount = 0</strong>: All pointer references to the attendee session must be deleted, leaving zero active references.</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ1Choice('wrong');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q1Choice === 'wrong' ? '#fdf3e2' : '#ffffff',
                    border: q1Choice === 'wrong' ? '2px solid #e8a33d' : '1px solid #e4dcc8',
                    color: q1Choice === 'wrong' ? '#8c5914' : '#2b2b2b',
                    fontWeight: q1Choice === 'wrong' ? 700 : 500
                  }}
                >
                  <span>B. The attendee's memory box is automatically wiped after a fixed 60-second background timer.</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* QUESTION 2 */}
        <div style={{
          background: '#faf6ee',
          border: '1px solid #e4dcc8',
          borderRadius: '12px',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ background: '#2f6564', color: '#ffffff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>2</span>
            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#2b2b2b', lineHeight: '1.45' }}>
              {mode === 'leak'
                ? "Why does repeated checkouts calling 'sessions.append(student)' inevitably cause server memory exhaustion?"
                : "What does executing 'del student' achieve inside the checkout routine?"}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '28px' }}>
            {mode === 'leak' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('wrong');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q2Choice === 'wrong' ? '#fdf3e2' : '#ffffff',
                    border: q2Choice === 'wrong' ? '2px solid #e8a33d' : '1px solid #e4dcc8',
                    color: q2Choice === 'wrong' ? '#8c5914' : '#2b2b2b',
                    fontWeight: q2Choice === 'wrong' ? 700 : 500
                  }}
                >
                  <span>A. Python lists have a hard internal limit of 5 elements before raising an error.</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('correct');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q2Choice === 'correct' ? '#eaf2ee' : '#ffffff',
                    border: q2Choice === 'correct' ? '2px solid #4f9a63' : '1px solid #e4dcc8',
                    color: q2Choice === 'correct' ? '#256038' : '#2b2b2b',
                    fontWeight: q2Choice === 'correct' ? 700 : 500
                  }}
                >
                  <span>B. <strong>Ghost References Accumulate</strong>: Every departed student remains permanently trapped in heap memory, growing RAM monotonically with each checkout.</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('correct');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q2Choice === 'correct' ? '#eaf2ee' : '#ffffff',
                    border: q2Choice === 'correct' ? '2px solid #4f9a63' : '1px solid #e4dcc8',
                    color: q2Choice === 'correct' ? '#256038' : '#2b2b2b',
                    fontWeight: q2Choice === 'correct' ? 700 : 500
                  }}
                >
                  <span>A. <strong>Explicit Dereferencing</strong>: It severs the variable binding, decrementing refcount to 0 so the Garbage Collector can sweep and free physical RAM.</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio();
                    playPop();
                    setQ2Choice('wrong');
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: q2Choice === 'wrong' ? '#fdf3e2' : '#ffffff',
                    border: q2Choice === 'wrong' ? '2px solid #e8a33d' : '1px solid #e4dcc8',
                    color: q2Choice === 'wrong' ? '#8c5914' : '#2b2b2b',
                    fontWeight: q2Choice === 'wrong' ? 700 : 500
                  }}
                >
                  <span>B. It deletes the Python compiler files from the operating system disk.</span>
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
                mode === 'leak'
                  ? "Because 'sessions.append(student)' anchors finished checkouts to module scope, Python sees active references and cannot reclaim memory. Launch to witness the ghost leak live!"
                  : "Severing references with 'del student' drops the reference count to zero. The Garbage Collector sweeper can promptly reclaim and reuse RAM boxes. Launch to run GC!"
              ) : (
                mode === 'leak'
                  ? "Python deallocates memory strictly based on reference counts, not real-world assumptions. As long as the global list holds a pointer, that attendee's RAM is locked."
                  : "Python does not delete memory based on elapsed time. Memory deallocation requires references to hit zero so GC can sweep."
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
                <span>🚀</span> Launch Live Simulation & GC Lab →
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

  if (storySlides[storyStep] !== null && storyStep < storySlides.length) {
    const steps = [
      { id: 0, label: "1. Fest Check-In" },
      { id: 1, label: "2. Ghost Attendees" },
      { id: 3, label: "3. Clean Memory" }
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

  return (
    <div className="level-container level1-light-theme">
      <div className="story-panel glass-panel">
        <h2>Code Execution</h2>

        {mode === 'leak' ? (
          <div style={{ background: '#faf6ee', border: '1.5px solid #e4dcc8', borderRadius: '16px', padding: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ color: '#2b2b2b' }}>Code execution: Memory Leak</strong>
              <span style={{ fontSize: '0.75rem', color: '#c4682c', background: '#fdf3e2', border: '1px solid #e8a33d', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Memory Leak ⚠️</span>
            </div>
            <pre style={{ margin: '8px 0 0 0', fontFamily: 'monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', overflowX: 'auto' }}>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>sessions = []</div>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>def checkout_student(student):</div>
              <div style={{ color: '#b91c1c', padding: '2px 4px', fontWeight: 600 }}>    # DANGER: Appends departed session to global list!</div>
              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>
                {`    sessions.append(student)`}
              </div>
              <div onClick={() => selectLine(4)} style={{ ...getLineStyle(4), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(4) }}>    return "Checked out"</div>
              <div onClick={() => selectLine(5)} style={{ ...getLineStyle(5), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(5) }}>{`checkout_student(student_${attendees.length})`}</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(true, leakLineExplanations)}
          </div>
        ) : (
          <div style={{ background: '#faf6ee', border: '1.5px solid #e4dcc8', borderRadius: '16px', padding: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ color: '#2b2b2b' }}>Optimized execution: Garbage Collection</strong>
              <span style={{ fontSize: '0.75rem', color: '#256038', background: '#eaf2ee', border: '1px solid #4f9a63', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>Memory Clean ✓</span>
            </div>
            <pre style={{ margin: '8px 0 0 0', fontFamily: 'monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', overflowX: 'auto' }}>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>def checkout_student(student):</div>
              <div style={{ color: '#256038', padding: '2px 4px', fontWeight: 600 }}>    # SUCCESS: Explicitly cuts the variable reference!</div>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>
                {`    del student`}
              </div>
              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>    return "Checked out"</div>
              <div onClick={() => selectLine(4)} style={{ ...getLineStyle(4), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(4) }}>{`checkout_student(student_${attendees.length})`}</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(false, gcLineExplanations)}
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', flexDirection: 'column' }}>
          {hasCrashed && mode === 'leak' && (
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
              onClick={() => setStoryStep(3)}
            >
              <span>View Smart Solution</span> <ArrowRight size={18} />
            </button>
          )}
          {mode === 'gc' && (
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
                <span>⚡</span> Student Sessions & GC Simulation Lab
              </h2>
              {mode === 'leak' ? (
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isExecuting || isSweeping || showQuiz || hasCrashed}
                  style={{
                    background: (isExecuting || hasCrashed)
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
                    cursor: (isExecuting || isSweeping || showQuiz || hasCrashed) ? 'not-allowed' : 'pointer',
                    boxShadow: (isExecuting || hasCrashed) ? 'none' : '0 4px 14px rgba(230, 118, 53, 0.35)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    letterSpacing: '0.01em'
                  }}
                  onMouseEnter={(e) => {
                    if (!isExecuting && !showQuiz && !hasCrashed) {
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(230, 118, 53, 0.45)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = (isExecuting || hasCrashed) ? 'none' : '0 4px 14px rgba(230, 118, 53, 0.35)';
                  }}
                >
                  {isExecuting ? (
                    <>
                      <div className="spinner" style={{ width: '13px', height: '13px', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <span>Checking Out...</span>
                    </>
                  ) : (
                    <>
                      <Play size={15} fill="#ffffff" />
                      <span>Run Simulation (Check Out)</span>
                    </>
                  )}
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isExecuting || isSweeping || showQuiz || hasCrashed}
                    style={{
                      background: (isExecuting || hasCrashed)
                        ? '#b0a999'
                        : 'linear-gradient(135deg, #e67635 0%, #cf5717 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: (isExecuting || isSweeping || showQuiz || hasCrashed) ? 'not-allowed' : 'pointer',
                      boxShadow: (isExecuting || hasCrashed) ? 'none' : '0 4px 14px rgba(230, 118, 53, 0.35)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Play size={14} fill="#ffffff" />
                    <span>Check Out</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGarbageCollect}
                    disabled={isExecuting || isSweeping || showQuiz || hasCrashed}
                    style={{
                      background: '#4f9a63',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: (isExecuting || isSweeping || showQuiz || hasCrashed) ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(79, 154, 99, 0.3)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Run GC</span>
                  </button>
                </div>
              )}
            </div>

            {/* Visual RAM Floor (Registration Sessions Bay) */}
            <div style={{
              width: '100%',
              marginTop: '10px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '2px dashed #e4dcc8',
              borderRadius: '14px',
              minHeight: '260px',
              background: '#faf6ee',
              overflow: 'hidden'
            }}>
              {/* Upper Line: Real-Time RAM Allocation & Dynamic Progress Meter */}
              <div style={{
                width: '100%',
                borderBottom: '1.5px solid #e4dcc8',
                background: '#f6f0e2',
                padding: '10px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} color="#2f6564" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2f6564' }}>
                      Physical RAM Allocation (100 GB)
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    fontFamily: '"SFMono-Regular", Consolas, monospace',
                    color: ram >= 100 ? '#c25b4a' : ram > 50 ? '#d97706' : '#2f6564',
                    background: ram >= 100 ? '#fbeae7' : ram > 50 ? '#fdf3e2' : '#eaf2ee',
                    padding: '2px 10px',
                    borderRadius: '999px',
                    border: `1px solid ${ram >= 100 ? '#c25b4a' : ram > 50 ? '#e8a33d' : '#3a7d7c'}`,
                    transition: 'all 0.3s ease'
                  }}>
                    RAM: {ram.toFixed(0)}% ({ram.toFixed(0)} GB / 100 GB)
                  </span>
                </div>

                {/* Top Integrated Progress Bar Line */}
                <div style={{
                  width: '100%',
                  height: '7px',
                  background: '#e6ded0',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(ram, 100)}%`,
                    background: ram >= 100
                      ? 'linear-gradient(90deg, #e77338, #c25b4a)'
                      : ram > 50
                        ? 'linear-gradient(90deg, #3a7d7c, #e8a33d)'
                        : 'linear-gradient(90deg, #2f6564, #4f9a63)',
                    borderRadius: '999px',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: ram >= 100 ? '0 0 10px rgba(194, 91, 74, 0.7)' : 'none'
                  }} />
                </div>
              </div>

              {/* Sessions Bay Content */}
              <div style={{ padding: '16px', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ margin: '0 0 10px 0', color: '#5b5648', fontSize: '0.8rem', fontWeight: 700 }}>
                  Active Fest Registration Sessions (RAM Heap Space)
                </p>

                {isSweeping && (
                  <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '-100px',
                    zIndex: 10,
                    animation: 'droneSweep 1.5s linear forwards',
                    background: 'linear-gradient(135deg, #4f9a63, #2f6564)',
                    borderRadius: '50px',
                    padding: '8px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ffffff',
                    fontWeight: 700,
                    boxShadow: '0 0 20px rgba(79, 154, 99, 0.6)'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>🧹</span>
                    <span>GC Sweeper Active</span>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', flex: 1, alignContent: 'flex-start' }}>
                  {attendees.map((s) => {
                    const isGhost = mode === 'leak' && !s.active;
                    const isAwaitingGC = mode === 'gc' && !s.active;
                    const cardBg = '#ffffff';
                    const cardBorder = s.active 
                      ? '1.5px solid #2f6564' 
                      : isGhost 
                        ? '1.5px dashed #e8a33d' 
                        : '1.5px dashed #4f9a63';
                    const badgeBg = s.active 
                      ? '#fdf3e2' 
                      : isGhost 
                        ? '#fdf3e2' 
                        : '#eaf2ee';
                    const badgeColor = s.active 
                      ? '#2f6564' 
                      : isGhost 
                        ? '#8c5914' 
                        : '#256038';
                    const badgeBorder = s.active 
                      ? '1px solid #e4dcc8' 
                      : isGhost 
                        ? '1px solid #e8a33d' 
                        : '1px solid #4f9a63';
                    const avatarBg = s.active 
                      ? 'linear-gradient(135deg, #2f6564, #4f9a63)' 
                      : isGhost 
                        ? 'linear-gradient(135deg, #c4682c, #EB8975)' 
                        : 'linear-gradient(135deg, #e8a33d, #FA994F)';
                    const avatarIcon = s.active ? '🎓' : isGhost ? '👻' : '⏳';
                    const badgeLabel = s.active ? 'Active' : isGhost ? 'Ghost Ref' : 'Awaiting GC';

                    return (
                      <div
                        key={s.id}
                        style={{
                          position: 'relative',
                          animation: s.sweeping ? 'sweepAway 1s forwards' : 'popIn 0.3s',
                          background: cardBg,
                          border: cardBorder,
                          borderRadius: '12px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: '120px',
                          boxShadow: '0 2px 8px rgba(47, 101, 100, 0.08)',
                          opacity: s.active ? 1 : 0.88,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: avatarBg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.3rem',
                          marginBottom: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          {avatarIcon}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2b2b2b' }}>
                          {`Student #${s.index || 1}`}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          marginTop: '4px',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: badgeBg,
                          color: badgeColor,
                          border: badgeBorder
                        }}>
                          {badgeLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {attendees.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 20px', color: '#256038' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '6px' }}>✨</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#256038' }}>RAM Memory Cleared!</div>
                    <div style={{ fontSize: '0.82rem', color: '#5b5648', marginTop: '2px' }}>
                      All unreferenced attendee sessions have been purged by the Garbage Collector.
                    </div>
                  </div>
                )}
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
                <strong>RAM Capacity: 100 GB</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.98rem', fontFamily: '"SFMono-Regular", Consolas, monospace', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ color: '#2f6564', fontWeight: 600 }}>15 GB (Baseline)</span>
                <span style={{ color: '#5b5648' }}>+</span>
                <span style={{ color: attendees.filter(s => !s.active).length > 0 ? (mode === 'leak' ? '#c25b4a' : '#d97706') : '#4f9a63', fontWeight: 600 }}>
                  {mode === 'leak'
                    ? `${attendees.filter(s => !s.active).length * 20} GB (Ghost Sessions)`
                    : `${attendees.filter(s => !s.active).length * 15} GB (Uncollected Ref=0)`}
                </span>
                <span style={{ color: '#5b5648' }}>=</span>
                <span style={{ fontWeight: 'bold', color: ram >= 100 ? '#c25b4a' : '#2b2b2b' }}>
                  {ram.toFixed(0)} GB Total
                </span>
              </div>
            </div>

            {/* Memory Verdict Strip */}
            <div style={{
              width: '100%',
              marginTop: '12px',
              background: mode === 'leak' ? '#fbeae7' : '#e9f4ec',
              border: mode === 'leak' ? '1px solid #c25b4a' : '1px solid #4f9a63',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '0.84rem',
              color: mode === 'leak' ? '#c25b4a' : '#4f9a63',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 0 #e4dcc8',
              textAlign: 'center'
            }}>
              {mode === 'leak'
                ? `🛑 Memory Leak: Departed students are still held in global sessions list, so Python cannot free their memory!`
                : `✅ Clean Memory Management: Removing checked-out students allows Python's Garbage Collector to safely reclaim RAM!`
              }
            </div>
          </>
        )}
      </div>

      {/* Quiz Modal Overlay */}
      {showQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(36, 30, 26, 0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(10px)', padding: '16px' }}>
          <div style={{ width: '920px', maxWidth: '96%', maxHeight: '92vh', overflowY: 'auto' }}>
            <Quiz questions={questions} codeChallenge={level4CodeChallenge} onPass={onPass} onClose={() => setShowQuiz(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Level4;
