import React, { useState } from 'react';
import { RefreshCw, Play, ArrowRight, Eye, HelpCircle, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';
import Quiz from '../components/Quiz';
import StorySlider from '../components/StorySlider';
import { playThud, playPop, unlockAudio } from '../utils/audio';

const Level1 = ({ onCrash, onPass, RamBar }) => {
  const [ram, setRam] = useState(20);
  const [crates, setCrates] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [mode, setMode] = useState('duplicate');
  const [showQuiz, setShowQuiz] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [executingLine, setExecutingLine] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [explainStep, setExplainStep] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [q1Choice, setQ1Choice] = useState(null);
  const [q2Choice, setQ2Choice] = useState(null);
  const [showHeapInspector, setShowHeapInspector] = useState(true);
  const isLightMode = true; // Always in light theme

  const selectLine = (lineNum) => {
    setSelectedLine(lineNum);
    setExplainStep(1);
  };

  const getLineStyle = (lineNum) => {
    const isLineActive = executingLine === lineNum;
    return {
      background: isLineActive
        ? (mode === 'duplicate'
          ? '#fff3e8'
          : '#e9f4ec')
        : 'transparent',
      borderLeft: isLineActive
        ? (mode === 'duplicate' ? '3px solid #FA994F' : '3px solid #4f9a63')
        : '3px solid transparent',
      paddingLeft: '5px',
      transition: 'all 0.2s',
      color: isLineActive
        ? (mode === 'duplicate' ? '#7c4a2d' : '#256038')
        : '#2b2b2b'
    };
  };

  const getCodeLineBg = (lineNum) => {
    if (selectedLine === lineNum) {
      return '#fff8f2';
    }
    return getLineStyle(lineNum).background;
  };

  const questions = [
    {
      type: 'mcq',
      question: "When you execute `student_notice = master_announcement`, what physically happens inside RAM?",
      options: [
        { text: "Python creates a lightweight 64-bit reference address pointing to the exact same heap memory object.", isCorrect: true },
        { text: "Python duplicates all list elements into a brand-new physical RAM memory block.", isCorrect: false },
        { text: "Python clears the announcement out of memory and writes it to temporary disk swap.", isCorrect: false }
      ]
    },
    {
      type: 'jumble',
      question: "Jumbled Syntax: Form the expression to verify that two variables point to the exact same memory box in RAM:",
      words: ["student_notice", "is", "master_announcement"],
      correctOrder: ["student_notice", "is", "master_announcement"]
    },
    {
      type: 'debug',
      question: "Fill in the Blank: Which built-in Python function returns the unique integer memory address of an object?",
      codeSnippet: "address = ___(master_announcement)",
      correctWord: "id",
      acceptableWords: ["id", "id()"]
    }
  ];

  const level1CodeChallenge = {
    levelNumber: 1,
    title: "Level 1: Fix the Memory Leak",
    subtitle: "Drag-and-Drop Replacement Block Challenge",
    description: "The current function clones a 20 GB noticeboard 1,000 times using deepcopy(), crashing the server. Drag the correct replacement block into Line 4 to patch the memory leak with zero duplication!",
    codeLinesBefore: [
      "def distribute(announcement):",
      "    students = []",
      "    for i in range(1000):"
    ],
    slotLineNumber: 4,
    buggyCode: "        copy_obj = copy.deepcopy(announcement)",
    codeLinesAfter: [
      "        students.append(student_pointer)",
      "    return students"
    ],
    replacementOptions: [
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
    ]
  };

  const handleDrag = () => {
    unlockAudio();
    if (isBuilding || hasCrashed) return;
    setIsBuilding(true);

    if (mode === 'duplicate') {
      let currentRam = ram;
      let currentCrates = crates;

      const loopIteration = () => {
        setExecutingLine(3); // for loop
        setTimeout(() => {
          setExecutingLine(4); // deepcopy
          playThud();
          currentRam += 20;
          setRam(currentRam);
          currentCrates = [...currentCrates, { id: currentCrates.length }];
          setCrates(currentCrates);

          setTimeout(() => {
            setExecutingLine(5); // append
            setTimeout(() => {
              if (currentRam >= 100) {
                setExecutingLine(0);
                setIsBuilding(false);
                setTimeout(() => {
                  onCrash();
                  setHasCrashed(true);
                }, 400);
              } else {
                setTimeout(loopIteration, 100);
              }
            }, 300);
          }, 300);
        }, 300);
      };

      setExecutingLine(7); // announcement = ...
      setTimeout(() => {
        setExecutingLine(8); // distribute(announcement)
        setTimeout(() => {
          setExecutingLine(1); // def
          setTimeout(() => {
            setExecutingLine(2); // students = []
            setTimeout(loopIteration, 400);
          }, 400);
        }, 400);
      }, 400);

    } else {
      let currentSticky = stickyNotes;

      const loopIteration = () => {
        setExecutingLine(3); // for loop
        setTimeout(() => {
          setExecutingLine(4); // pointer assignment
          playPop();
          setRam(r => r + 0.01);
          currentSticky = [...currentSticky, { id: currentSticky.length }];
          setStickyNotes(currentSticky);

          setTimeout(() => {
            setExecutingLine(5); // append
            setTimeout(() => {
              if (currentSticky.length >= 10) {
                // Done simulating pointers!
                setExecutingLine(6); // return
                setTimeout(() => {
                  setExecutingLine(0);
                  setIsBuilding(false);
                }, 400);
              } else {
                setTimeout(loopIteration, 100);
              }
            }, 200);
          }, 200);
        }, 200);
      };

      setExecutingLine(7); // announcement = ...
      setTimeout(() => {
        setExecutingLine(8); // distribute(announcement)
        setTimeout(() => {
          setExecutingLine(1); // def
          setTimeout(() => {
            setExecutingLine(2); // students = []
            setTimeout(loopIteration, 400);
          }, 400);
        }, 400);
      }, 400);
    }
  };

  const copyLineExplanations = {
    0: {
      code: "import copy",
      part1: {
        title: "Module Loading",
        point1: { icon: "📦", label: "Python Import", text: "Loads the built-in copy module into the global script namespace." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Allocates copy module functions into memory, including copy() and deepcopy()." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚠️", label: "Duplicate Hazard", text: "The copy module enables deep duplication, allocating separate memory blocks for each clone." },
        point2: { icon: "🎯", label: "Key Rule", text: "Importing copy is cheap, but invoking deepcopy() in a loop causes explosive RAM consumption." }
      }
    },
    1: {
      code: "def distribute(announcement):",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Defines the distribution function in memory, accepting the announcement argument." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Pushes a new call frame to the stack; parameter binds directly to caller's object reference." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "Prepares a loop that will multiply all memory allocations inside by 1,000 students." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Function entry boundaries should be lightweight and avoid duplicating input objects." }
      }
    },
    2: {
      code: "    students = []",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Initializes an empty list on the heap with dynamic pointer array capacity." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Consumes only ~56 bytes initially; ready to collect appended student references." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "Will store 1,000 objects sequentially as append() is triggered in each loop cycle." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "List containers hold strong references, keeping whatever is inside alive in memory." }
      }
    },
    3: {
      code: "    for i in range(1000):",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Spawns an O(1) range generator iterator to cycle 1,000 times (indices 0 to 999)." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Only a single 8-byte integer loop counter variable exists on the execution stack." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "Multiplier effect: Any memory allocation inside this loop body runs 1,000 times!" },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Minor allocations in large loops balloon into fatal Out-Of-Memory crashes." }
      }
    },
    4: {
      code: "        copy_obj = copy.deepcopy(announcement)",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💥", label: "Critical Hazard", text: "Recursively clones the entire announcement structure into separate physical RAM blocks." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Forces OS to allocate brand-new memory addresses: id(copy_obj) != id(announcement)." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "1,000 copies × 20 GB duplicate = 20,000 GB attempted RAM allocation!" },
        point2: { icon: "🎯", label: "System Crash", text: "Instantly overloads the 100 GB system RAM ceiling, triggering an unrecoverable crash." }
      }
    },
    5: {
      code: "        students.append(copy_obj)",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Appends the 20 GB duplicate object reference into the active students list." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Binds active pointer references in the list (refcount ≥ 1), locking it into heap RAM." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "Python's Garbage Collector cannot clean up clones because the list keeps them active." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Compounds the memory crisis by forcing all 1,000 heavy clones to survive at once." }
      }
    },
    6: {
      code: "    return students",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Returns the finished 1,000-item array back to caller, unwinding local stack frame." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Yields pointer reference to the master list container holding all entries." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "Intended to supply each student their verified independent record." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Never reached in copy mode: Memory overflow crashes the server during the loop!" }
      }
    },
    7: {
      code: 'announcement = ["Exam Date", "Room 101"]',
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Allocates the master exam notice list in heap memory with 20 GB baseline size." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Binds the variable name 'announcement' to this master RAM address (e.g. 0x7f9a1b40)." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "Serves as the single authoritative source of truth for the entire institution." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Read-only shared resources should be pointed to, never duplicated needlessly." }
      }
    },
    8: {
      code: "distribute(announcement)",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Invokes distribute() passing the master announcement list reference." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Passes pointer into the function stack and begins recursive loop execution." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "📈", label: "At 1,000x Scale", text: "Triggers the runaway deepcopy loop, skyrocketing RAM from 20 GB straight to 100 GB." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Always inspect loop operations for unintentional cloning before production deployment!" }
      }
    }
  };

  const pointerLineExplanations = {
    1: {
      code: "def distribute(announcement):",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Defines the distribution routine receiving the master announcement notice." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Parameter receives the existing 8-byte pointer directly to master memory." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "Runs in milliseconds with zero redundant data allocations across all students." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Pass-by-Reference shares existing data seamlessly with zero memory waste." }
      }
    },
    2: {
      code: "    students = []",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Creates an empty list on the heap to store 1,000 lightweight pointers." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Allocates standard list container overhead (~56 bytes) without duplicating data." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "Ready to safely collect 1,000 student pointer entries without memory pressure." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Pointers allow large collections to remain featherlight in physical RAM." }
      }
    },
    3: {
      code: "    for i in range(1000):",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Runs 1,000 loop cycles using Python's O(1) range generator iterator." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Registers each student with constant execution time per cycle." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "Because body operations are 8-byte pointer assignments, scale overhead is negligible." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Loop finishes almost instantaneously without stressing CPU or RAM." }
      }
    },
    4: {
      code: "        student_pointer = announcement",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "⚡", label: "Smart Pointer", text: "Simple assignment copies ONLY the 8-byte memory address, NOT the data!" },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Zero duplicate in RAM: id(student_pointer) == id(announcement) is True." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "Allocates 0 extra GB of RAM—all 1,000 students share the single master notice!" },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Pointers give each student instant access with 100% memory efficiency." }
      }
    },
    5: {
      code: "        students.append(student_pointer)",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Stores the 8-byte pointer address into the students list container." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Appends tiny reference markers instead of 20 GB heavy duplicate objects." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "1,000 references × 8 bytes = only ~8 KB total memory overhead." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Total RAM stays flat at ~20.01 GB, completely safe from crashing." }
      }
    },
    6: {
      code: "    return students",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Returns the completed pointer list to caller, unwinding stack frame." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Preserves 1,000 pointer records while discarding temporary local variables." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "Every student in the list can instantly access the master announcement." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Demonstrates production-grade speed and pristine memory efficiency." }
      }
    },
    7: {
      code: 'announcement = ["Exam Date", "Room 101"]',
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Allocates master announcement list once in physical RAM (20 GB baseline)." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Pinned at a fixed memory location (e.g., notice board address 0x7f9a1b40)." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "Serves as authoritative single source of truth for all 1,000 students." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Updates to this single master are immediately seen by all pointer holders." }
      }
    },
    8: {
      code: "distribute(announcement)",
      part1: {
        title: "Runtime & Memory",
        point1: { icon: "💻", label: "Python Execution", text: "Invokes distribute() utilizing Pass-by-Reference semantics." },
        point2: { icon: "🧠", label: "In Physical RAM", text: "Passes pointer to master object without copying megabytes or gigabytes." }
      },
      part2: {
        title: "Scale & Consequence",
        point1: { icon: "⚡", label: "At 1,000x Scale", text: "Distributes to 1,000 students safely within hardware constraints." },
        point2: { icon: "🎯", label: "Key Takeaway", text: "Sharing memory references prevents Out-Of-Memory disasters in production!" }
      }
    }
  };

  const storySlides = [
    {
      title: "Scene 1: The 1,000-Copy Crisis",
      image: "/notice_board_intro.jpg",
      text: "The principal has a massive exam announcement that 1,000 students must receive before the morning bell. The school administration faces a dilemma: how can every student access the latest notice without flooding the school with thousands of duplicate copies?",
      buttonText: "See what happens...",
      color: "#60a5fa"
    },
    {
      title: "Scene 2: The Photocopier Apocalypse",
      image: "/notice_board_bad.jpg",
      text: "The panicked staff decides to photocopy the entire announcement for every single student! Memory Bloat: duplicating the 20 GB noticeboard for 1,000 students rapidly consumes 20,000 GB of attempted RAM; Data Desync: students holding detached copies never see last-minute room or schedule corrections; Hardware Crash: cloning heavy nested objects in a tight loop overloads the machine and triggers a fatal OOM crash.",
      buttonText: "Simulate Disaster",
      color: "#ef4444"
    },
    // Index 2 is the actual simulation (no slide)
    null,
    {
      title: "Scene 3: One Master, One Brilliant Idea",
      image: "/notice_board_good.jpg",
      text: "The breakthrough is simple: keep one master announcement on the central noticeboard and let every student reference that same shared board instead of carrying a separate duplicate copy. The announcement is created once, and when updated, everyone sees the change instantly with zero waste.",
      buttonText: "Start Smart Simulation",
      color: "#10b981",
      action: () => {
        setRam(20);
        setCrates([]);
        setStickyNotes([]);
        setMode('pointer');
        setPrediction(null);
        setQ1Choice(null);
        setQ2Choice(null);
        setStoryStep(4);
        setHasCrashed(false);
      }
    }
  ];

  if (storySlides[storyStep] !== null && storyStep < storySlides.length) {
    const steps = [
      { id: 0, label: "1. The Dilemma" },
      { id: 1, label: "2. The Crash" },
      { id: 3, label: "3. The Solution" }
    ];

    return (
      <StorySlider
        slides={storySlides}
        storyStep={storyStep}
        setStoryStep={setStoryStep}
        steps={steps}
        isLightMode={true}
      />
    );
  }

  const renderAnimatedExplanation = (isDanger, explanations) => {
    if (selectedLine === null || selectedLine === undefined || !explanations[selectedLine]) {
      return null;
    }

    const data = explanations[selectedLine];
    const accentColor = isDanger ? '#ef4444' : '#10b981';
    const glowColor = isDanger ? 'rgba(239, 68, 68, 0.28)' : 'rgba(16, 185, 129, 0.28)';
    const nextBtnBg = isDanger
      ? 'linear-gradient(135deg, #ef4444, #f97316)'
      : 'linear-gradient(135deg, #10b981, #06b6d4)';

    // Flatten into 4 distinct single points with light, warm editorial styling
    const points = [
      {
        step: 1,
        shortTag: "1. Code",
        category: "Python Execution",
        icon: data.part1.point1.icon,
        label: data.part1.point1.label,
        text: data.part1.point1.text,
        color: isDanger ? '#7c4a2d' : '#2f6564',
        bg: isDanger ? '#fff2e8' : '#e9f4ec'
      },
      {
        step: 2,
        shortTag: "2. RAM",
        category: "In Physical RAM",
        icon: data.part1.point2.icon,
        label: data.part1.point2.label,
        text: data.part1.point2.text,
        color: isDanger ? '#8c5914' : '#1e3a8a',
        bg: isDanger ? '#fdf3e2' : '#eff6ff'
      },
      {
        step: 3,
        shortTag: "3. Scale",
        category: "At 1,000x Iterations",
        icon: data.part2.point1.icon,
        label: data.part2.point1.label,
        text: data.part2.point1.text,
        color: isDanger ? '#9c4d3d' : '#15803d',
        bg: isDanger ? '#fbf0ed' : '#f0fdf4'
      },
      {
        step: 4,
        shortTag: "4. Rule",
        category: "Key Architecture Rule",
        icon: data.part2.point2.icon,
        label: data.part2.point2.label,
        text: data.part2.point2.text,
        color: isDanger ? '#7c4a2d' : '#0f766e',
        bg: isDanger ? '#fff2e8' : '#ccfbf1'
      }
    ];

    const currentIdx = Math.min(Math.max(explainStep - 1, 0), points.length - 1);
    const activePoint = points[currentIdx];

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
              width: `${(explainStep / 4) * 100}%`,
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
            Point {explainStep} of 4
          </span>

          {explainStep < 4 ? (
            <button
              onClick={() => setExplainStep(s => Math.min(s + 1, 4))}
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
              <span>Done ✓</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPreFlightCard = () => {
    const isBothSelected = q1Choice !== null && q2Choice !== null;
    const isQ1Correct = mode === 'duplicate' ? q1Choice === 'B' : q1Choice === 'A';
    const isQ2Correct = mode === 'duplicate' ? q2Choice === 'B' : q2Choice === 'A';
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
                {mode === 'duplicate' ? "Pre-Flight Check" : "Pre-Flight Check: Shared References"}
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
            {mode === 'duplicate'
              ? "Look at the loop on the left. What happens when each student opens the portal?"
              : "Look at the updated code on the left. What happens when we execute 'student_pointer = announcement'?"}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mode === 'duplicate' ? (
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
                  <span><strong>A.</strong> Python will smartly share the existing noticeboard so memory stays low (&lt; 25 GB).</span>
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
                  <span><strong>B.</strong> Python will literally clone an entire separate 20 GB duplicate noticeboard in RAM for every single student!</span>
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
                  <span><strong>A.</strong> All 1,000 students simply point to the original noticeboard — zero duplicate copies are made!</span>
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
                  <span><strong>B.</strong> Assigning with '=' still creates another full 20 GB duplicate copy behind the scenes for each student.</span>
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
            {mode === 'duplicate'
              ? "Our server has a limit of 100 GB RAM. What happens when 1,000 students hit this noticeboard at the same time?"
              : "When 1,000 students read the noticeboard simultaneously using shared pointers, what happens to server RAM?"}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mode === 'duplicate' ? (
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
                  <span><strong>A.</strong> The server quietly compresses the data in the background and runs smoothly without crashing.</span>
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
                  <span><strong>B.</strong> The server rapidly runs out of RAM (1,000 × 20 GB = 20,000 GB needed!) and violently crashes!</span>
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
                  <span><strong>A.</strong> RAM stays completely stable at ~20 GB because everyone is looking at the same original board!</span>
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
                  <span><strong>B.</strong> RAM will still steadily climb and crash the server because 1,000 students are connected.</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* VALIDATION & VERDICT (Directly below Question 2) */}
        {isBothSelected ? (
          <div style={{
            background: isBothCorrect ? '#e9f4ec' : '#fdf3e2',
            borderLeft: `5px solid ${isBothCorrect ? '#4f9a63' : '#e8a33d'}`,
            border: `1px solid ${isBothCorrect ? '#c6e6cd' : '#f4debe'}`,
            padding: '16px 20px',
            borderRadius: '14px',
            fontSize: '0.92rem',
            lineHeight: '1.55',
            color: isBothCorrect ? '#2f6564' : '#8c5914',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div>
              <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '4px' }}>
                {isBothCorrect ? "🎯 Correct! You Nailed It!" : "💡 Common Newbie Misconception:"}
              </strong>
              <p style={{ margin: 0 }}>
                {isBothCorrect ? (
                  mode === 'duplicate'
                    ? "Exactly right! Every single call to deepcopy() forces Python to make a physical 20 GB duplicate in RAM. When 1,000 students attempt to allocate 20,000 GB, our 100 GB server will instantly crash! Click below to see the disaster unfold in the live lab."
                    : "Exactly right! In Python, '=' doesn't duplicate anything — it simply hands out a sticky-note reference pointer to the original noticeboard. All 1,000 students share the single 20 GB board without using extra RAM!"
                ) : (
                  mode === 'duplicate'
                    ? "Almost everyone thinks Python would automatically share or compress data — but deepcopy() literally creates full 20 GB duplicates! And 1,000 clones × 20 GB is 20,000 GB, which blows right past our 100 GB server limit!"
                    : "Unlike in some languages where variables hold separate copies, Python variables are just sticky-note labels pointing to existing objects! It won't clone 20 GB for each student."
                )}
              </p>
            </div>

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', color: '#2f6564' }}>Code Execution</h2>
        </div>

        {mode === 'duplicate' ? (
          <div style={{ background: '#fdfbf7', borderLeft: '4px solid #e8a33d', border: '1.5px solid #e4dcc8', padding: '14px', marginTop: '16px', borderRadius: '14px' }}>
            <div>
              <strong style={{ color: '#2b2b2b', fontFamily: '"Fraunces", Georgia, serif', fontSize: '0.95rem' }}>Code Execution: Deep Copy</strong>
            </div>
            <pre style={{ marginTop: '8px', fontFamily: '"SFMono-Regular", Consolas, monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
              <div onClick={() => selectLine(0)} style={{ ...getLineStyle(0), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(0) }}>import copy</div>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>def distribute(announcement):</div>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>    students = []</div>
              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>    for i in range(1000):</div>
              <div style={{ color: '#b45309', padding: '2px 4px', fontWeight: 600 }}>        # DANGER: Creates a massive duplicate in RAM</div>

              <div onClick={() => selectLine(4)} style={{ ...getLineStyle(4), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(4) }}>
                {`        copy_obj = copy.deepcopy(announcement)`}
              </div>
              <div onClick={() => selectLine(5)} style={{ ...getLineStyle(5), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(5) }}>        students.append(copy_obj)</div>
              <div onClick={() => selectLine(6)} style={{ ...getLineStyle(6), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(6) }}>    return students</div>
              <div onClick={() => selectLine(7)} style={{ ...getLineStyle(7), marginTop: '8px', cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(7) }}>announcement = ["Exam Date", "Room 101"]</div>
              <div onClick={() => selectLine(8)} style={{ ...getLineStyle(8), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(8) }}>distribute(announcement)</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(true, copyLineExplanations)}
          </div>
        ) : (
          <div style={{ background: '#e9f4ec', borderLeft: '4px solid #4f9a63', border: '1px solid #c6e6cd', padding: '14px', marginTop: '16px', borderRadius: '14px' }}>
            <div>
              <strong style={{ color: '#2b2b2b', fontFamily: '"Fraunces", Georgia, serif', fontSize: '0.95rem' }}>Optimized Execution: Shared Pointers</strong>
            </div>
            <pre style={{ marginTop: '8px', fontFamily: '"SFMono-Regular", Consolas, monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>def distribute(announcement):</div>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>    students = []</div>
              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>    for i in range(1000):</div>
              <div style={{ color: '#4f9a63', padding: '2px 4px', fontWeight: 600 }}>        # SUCCESS: Creates a lightweight reference</div>

              <div onClick={() => selectLine(4)} style={{ ...getLineStyle(4), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(4) }}>
                {`        student_pointer = announcement`}
              </div>
              <div onClick={() => selectLine(5)} style={{ ...getLineStyle(5), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(5) }}>        students.append(student_pointer)</div>
              <div onClick={() => selectLine(6)} style={{ ...getLineStyle(6), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(6) }}>    return students</div>
              <div onClick={() => selectLine(7)} style={{ ...getLineStyle(7), marginTop: '8px', cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(7) }}>announcement = ["Exam Date", "Room 101"]</div>
              <div onClick={() => selectLine(8)} style={{ ...getLineStyle(8), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(8) }}>distribute(announcement)</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(false, pointerLineExplanations)}
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', flexDirection: 'column' }}>
          {hasCrashed && mode === 'duplicate' && (
            <button className="btn" style={{ background: '#e8a33d', border: 'none', color: '#2b2b2b', fontWeight: 'bold', borderRadius: '999px', padding: '12px 22px' }} onClick={() => setStoryStep(3)}>
              View the Better Approach <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          )}
          {mode === 'pointer' && (
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
                <span>⚡</span> Memory & RAM Allocation Lab
              </h2>
              <button
                onClick={handleDrag}
                disabled={isBuilding || showQuiz}
                style={{
                  background: isBuilding
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
                  cursor: (isBuilding || showQuiz) ? 'not-allowed' : 'pointer',
                  boxShadow: isBuilding ? 'none' : '0 4px 14px rgba(230, 118, 53, 0.35)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.01em'
                }}
                onMouseEnter={(e) => {
                  if (!isBuilding && !showQuiz) {
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(230, 118, 53, 0.45)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isBuilding ? 'none' : '0 4px 14px rgba(230, 118, 53, 0.35)';
                }}
              >
                {isBuilding ? (
                  <>
                    <div className="spinner" style={{ width: '13px', height: '13px', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span>Simulating...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} fill="#ffffff" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual RAM Floor (Animated RAM Area - Top) */}
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

              {/* Upper Line: Real-Time RAM Percentage & Dynamic Progress Meter */}
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
                    RAM: {ram.toFixed(0)}% ({ram.toFixed(2)} GB / 100 GB)
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

              {/* RAM Floor Content: Master Notice Board + Available Memory */}
              <div style={{ display: 'flex', flex: 1, width: '100%', minHeight: '220px' }}>
                {/* Master Notice Board Zone */}
                <div style={{ width: '30%', borderRight: '2px dashed #e4dcc8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
                  <p style={{ color: '#5b5648', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600 }}>Original Announcement</p>
                  <div style={{ background: '#fdf3e2', padding: '12px', border: '2px solid #e8a33d', borderRadius: '12px', textAlign: 'center', width: '125px', zIndex: 10, boxShadow: '0 2px 0 #e4dcc8' }}>
                    <h3 style={{ margin: 0, color: '#2b2b2b', fontFamily: '"Fraunces", serif', fontSize: '0.82rem' }}>NOTICE BOARD</h3>
                    <div style={{ background: '#ffffff', color: '#2b2b2b', border: '1px solid #e4dcc8', padding: '6px', marginTop: '8px', fontSize: '0.85rem', fontWeight: 'bold', borderRadius: '6px' }}>
                      [10, 20, 30]
                    </div>
                  </div>
                  <span style={{ marginTop: '8px', background: '#eaf2ee', color: '#2f6564', border: '1px solid #3a7d7c', padding: '2px 9px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>Location: 1000</span>
                  <span style={{ marginTop: '4px', color: '#5b5648', fontSize: '0.7rem' }}>Size: 20 GB</span>
                </div>

                {/* New Items Zone (Where crates / sticky notes animate in) */}
                <div style={{ width: '70%', padding: '12px 16px', display: 'flex', flexDirection: 'column', position: 'relative', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ margin: 0, color: '#5b5648', fontSize: '0.78rem', fontWeight: 600 }}>Available Memory</p>
                  </div>

                  {mode === 'duplicate' ? (
                    /* 2x2 Grid covering 100% of Available Memory when all 4 copies are added */
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gridTemplateRows: 'repeat(2, 1fr)',
                      gap: '10px',
                      flex: 1,
                      width: '100%',
                      minHeight: '190px'
                    }}>
                      {crates.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid #e8a33d',
                            borderRadius: '12px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px',
                            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          }}
                        >
                          <div style={{
                            background: '#fdfbf5',
                            border: '1px solid #e4dcc8',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: '#2b2b2b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span>📄</span> [10, 20, 30]
                          </div>
                          <span style={{
                            marginTop: '6px',
                            background: '#fbeae7',
                            color: '#c25b4a',
                            border: '1px solid #c25b4a',
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            20 GB
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      alignContent: 'flex-start',
                      flex: 1,
                      paddingTop: '6px'
                    }}>
                      {stickyNotes.map((n, index) => (
                        <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', animation: 'popIn 0.3s' }}>
                          {index === 0 && (
                            <div style={{ width: '26px', height: '2px', background: '#4f9a63', position: 'relative', animation: 'fadeOutArrow 2s forwards' }}>
                              <div style={{ position: 'absolute', left: 0, top: '-4px', width: '0', height: '0', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '8px solid #4f9a63' }}></div>
                            </div>
                          )}
                          <div className="sticky-note" style={{ background: '#fdf3e2', color: '#2b2b2b', border: '1px solid #e8a33d', padding: '6px 10px', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 0 #e4dcc8' }}>
                            <strong>Student {index + 1}</strong>
                            <span>➔ 1000</span>
                            <span style={{ fontSize: '0.55rem', marginTop: '2px', color: '#5b5648' }}>0.01 GB</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calculation Bar */}
            <div style={{ background: '#fdfbf5', padding: '14px 16px', borderRadius: '14px', marginTop: '14px', width: '100%', border: '1px solid #e4dcc8', boxShadow: '0 2px 0 #e4dcc8', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '1.05rem', fontFamily: '"Fraunces", serif', marginBottom: '8px', color: '#2b2b2b' }}>
                <strong>RAM Capacity: 100 GB</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.98rem', fontFamily: '"SFMono-Regular", Consolas, monospace' }}>
                <span style={{ color: '#3a7d7c', fontWeight: 600 }}>20 GB (Original)</span>
                <span style={{ color: '#5b5648' }}>+</span>
                <span style={{ color: mode === 'duplicate' ? '#c25b4a' : '#4f9a63', fontWeight: 600 }}>
                  {mode === 'duplicate' ? `${crates.length * 20} GB (Photocopies)` : `${(stickyNotes.length * 0.01).toFixed(2)} GB (References)`}
                </span>
                <span style={{ color: '#5b5648' }}>=</span>
                <span style={{ fontWeight: 'bold', color: ram >= 100 ? '#c25b4a' : '#2b2b2b' }}>
                  {ram.toFixed(2)} GB Total
                </span>
              </div>
            </div>

            {/* Memory Verdict / Bloat Strip */}
            <div style={{
              width: '100%',
              marginTop: '12px',
              background: mode === 'duplicate' ? '#fbeae7' : '#e9f4ec',
              border: mode === 'duplicate' ? '1px solid #c25b4a' : '1px solid #4f9a63',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '0.84rem',
              color: mode === 'duplicate' ? '#c25b4a' : '#4f9a63',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 0 #e4dcc8',
              textAlign: 'center'
            }}>
              {mode === 'duplicate'
                ? `🛑 Memory Bloat: ${crates.length} separate boxes created in RAM (Wasted: ${crates.length * 20} GB)!`
                : `✅ Zero Memory Waste: All ${stickyNotes.length} students share the single original Memory Box #1!`
              }
            </div>
          </>
        )}
      </div>

      {/* Quiz Modal Overlay */}
      {showQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(36, 30, 26, 0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(10px)', padding: '16px' }}>
          <div style={{ width: '920px', maxWidth: '96%', maxHeight: '92vh', overflowY: 'auto' }}>
            <Quiz questions={questions} codeChallenge={level1CodeChallenge} onPass={onPass} onClose={() => setShowQuiz(false)} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Level1;