import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play, Info, ArrowRight, Cpu } from 'lucide-react';
import Quiz from '../components/Quiz';
import StorySlider from '../components/StorySlider';
import { playThud, playPop, unlockAudio } from '../utils/audio';

const Level2 = ({ onCrash, onPass, RamBar }) => {
  const [ram, setRam] = useState(20); // 20MB for base wallet system
  const [wallets, setWallets] = useState([]);
  const [mode, setMode] = useState('duplicate');
  const [showQuiz, setShowQuiz] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [balance, setBalance] = useState(100);
  const [executingLine, setExecutingLine] = useState(0);
  const [hasCrashed, setHasCrashed] = useState(false);
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

  const getCodeLineBg = (lineNum) => {
    if (selectedLine === lineNum) {
      return '#fff8f2';
    }
    return undefined;
  };

  const questions = [
    {
      type: 'mcq',
      question: "Why does calling `wallet.copy()` on every recharge waste memory compared to modifying in-place?",
      options: [
        { text: "copy() allocates a brand-new dictionary hash table in RAM every time, whereas in-place updates mutate existing memory.", isCorrect: true },
        { text: "copy() encrypts the dictionary and compresses it on the call stack.", isCorrect: false },
        { text: "Dictionaries cannot store integers without creating new heap boxes.", isCorrect: false }
      ]
    },
    {
      type: 'jumble',
      question: "Jumbled Syntax: Compare memory addresses before and after an in-place update to verify zero reallocation:",
      words: ["id(before)", "==", "id(after)"],
      correctOrder: ["id(before)", "==", "id(after)"]
    },
    {
      type: 'debug',
      question: "Fill in the Blank: Which operator updates a dictionary numeric key in-place without creating a new dictionary copy?",
      codeSnippet: "wallet['balance'] ___ 20",
      correctWord: "+=",
      acceptableWords: ["+=", "+ ="]
    }
  ];

  const level2CodeChallenge = {
    levelNumber: 2,
    title: "Level 2: Fix the Wallet Reallocation",
    subtitle: "In-Place Dictionary Mutation Challenge",
    description: "The current recharge function calls wallet.copy(), cloning the dictionary into brand-new heap memory on every single transaction. Drag the correct replacement block into Line 2 to mutate the balance in-place with zero memory reallocation!",
    codeLinesBefore: [
      "def update_wallet(wallet):"
    ],
    slotLineNumber: 2,
    buggyCode: "    new_wallet = wallet.copy()",
    codeLinesAfter: [
      "    return wallet"
    ],
    replacementOptions: [
      {
        id: "dict_copy",
        codeText: "    new_wallet = dict(wallet)",
        shortText: "new_wallet = dict(wallet)",
        label: "dict(wallet)",
        isCorrect: false,
        tag: "Dict Constructor",
        feedbackTitle: "⚠️ Still Reallocating!",
        feedbackText: "Calling dict(wallet) instantiates a completely separate dictionary hash table on the heap, still wasting 20 MB on every recharge."
      },
      {
        id: "mutate_inplace",
        codeText: "    wallet['balance'] += 20",
        shortText: "wallet['balance'] += 20",
        label: "wallet['balance'] += 20",
        isCorrect: true,
        tag: "In-Place Mutation",
        feedbackTitle: "🎉 Zero-Reallocation Fix Confirmed!",
        feedbackText: "Brilliant! Python dictionaries are mutable in-place. Updating the existing key modifies the memory box directly without allocating any new objects!"
      },
      {
        id: "deepcopy_wallet",
        codeText: "    new_wallet = copy.deepcopy(wallet)",
        shortText: "new_wallet = copy.deepcopy(wallet)",
        label: "copy.deepcopy(wallet)",
        isCorrect: false,
        tag: "Deep Copy",
        feedbackTitle: "⚠️ Severe Memory Overhead!",
        feedbackText: "deepcopy() recursively copies every key-value object, causing even worse memory fragmentation and triggering early crashes."
      }
    ]
  };

  const handleDrag = () => {
    unlockAudio();
    if (isBuilding || hasCrashed) return;
    setIsBuilding(true);

    if (mode === 'duplicate') {
      setExecutingLine(1); // call
      setTimeout(() => {
        setExecutingLine(2); // def
        setTimeout(() => {
          setExecutingLine(3); // copy
          setTimeout(() => {
            setExecutingLine(4); // balance += 20
            setTimeout(() => {
              setExecutingLine(5); // return
              setTimeout(() => {
                setExecutingLine(0);
                let count = wallets.length + 1;
                let currentRam = ram + 20;

                playThud();
                setRam(currentRam);
                setWallets(prev => [...prev, { id: count, balance: 100 + (count * 20) }]);

                if (currentRam >= 100) {
                  setTimeout(() => {
                    onCrash();
                    setIsBuilding(false);
                    setHasCrashed(true);
                  }, 400);
                } else {
                  setIsBuilding(false);
                }
              }, 600);
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    } else {
      setExecutingLine(1); // call
      setTimeout(() => {
        setExecutingLine(2); // def
        setTimeout(() => {
          setExecutingLine(3); // balance += 20
          setTimeout(() => {
            setExecutingLine(5); // return
            setTimeout(() => {
              setExecutingLine(0);
              playPop();
              setBalance(b => b + 20);
              setIsBuilding(false);
            }, 600);
          }, 600);
        }, 600);
      }, 600);
    }
  };

  const getLineStyle = (lineNum) => {
    const isLineActive = executingLine === lineNum;
    const isSelected = selectedLine === lineNum;
    return {
      background: isLineActive
        ? (mode === 'duplicate' ? '#fff3e8' : '#e9f4ec')
        : (isSelected ? '#fff8f2' : 'transparent'),
      borderLeft: isLineActive
        ? (mode === 'duplicate' ? '3px solid #FA994F' : '3px solid #4f9a63')
        : (isSelected ? '3px solid #e8a33d' : '3px solid transparent'),
      paddingLeft: '6px',
      transition: 'all 0.2s',
      color: isLineActive
        ? (mode === 'duplicate' ? '#7c4a2d' : '#256038')
        : '#2b2b2b'
    };
  };

  const storySlides = [
    {
      title: "Scene 1: The ₹20 Recharge Rush",
      image: "/canteen_wallet_intro.jpg",
      text: "It's lunchtime, and thousands of students are recharging their digital canteen wallets with ₹20 while the checkout screen and receipt generator need the correct balance. Every transaction must update the student's wallet quickly and consistently, without creating unnecessary objects every time money is added.",
      buttonText: "See what happens...",
      color: "#60a5fa"
    },
    {
      title: "Scene 2: The Wallet Copycat Disaster",
      image: "/canteen_wallet_bad.jpg",
      text: "The naive approach copies the entire wallet dictionary for every recharge, adds ₹20 to the copy, and returns the new wallet. Memory Bloat: repeated dictionary allocations waste memory at scale; Data Desync: components still referring to the original wallet may show the old balance while another uses the updated copy; CPU Lag: unnecessary copying and object allocation add avoidable work to every transaction.",
      buttonText: "Simulate Disaster",
      color: "#ef4444"
    },
    null,
    {
      title: "Scene 3: Recharge the Original",
      image: "/canteen_wallet_good.jpg",
      text: "The smart solution is to modify the existing wallet directly with wallet[\"balance\"] += 20 instead of creating a replacement dictionary. The wallet's identity, checked using id(wallet), remains unchanged; every component holding a reference to that same wallet sees its updated balance, and no new wallet dictionary is needed for the recharge.",
      buttonText: "Start Smart Simulation",
      color: "#10b981",
      action: () => {
        setRam(20);
        setWallets([]);
        setBalance(100);
        setMode('pointer');
        setPrediction(null);
        setQ1Choice(null);
        setQ2Choice(null);
        setHasCrashed(false);
        setStoryStep(4);
      }
    }
  ];

  const copyLineExplanations = {
    1: {
      code: "wallet = update_wallet(wallet)",
      desc: "• Invokes update_wallet() and reassigns the global 'wallet' variable to the returned clone.\n• Discards the reference to the original dictionary, forcing the variable to point to new RAM.\n• Causes constant pointer rebinding on every transaction instead of updating data in-place.\n• When called thousands of times across students, it rapidly floods server RAM with orphan objects."
    },
    2: {
      code: "def update_wallet(wallet):",
      desc: "• Defines the wallet updating function that accepts a dictionary as an input argument.\n• Pushes a new execution stack frame into memory when called by the transaction system.\n• The parameter 'wallet' receives the memory address of the caller's dictionary.\n• Establishes local variable scope to process student canteen balance recharges."
    },
    3: {
      code: "    new_wallet = wallet.copy()",
      desc: "• ⚠️ CRITICAL DANGER: Calls .copy() to generate a brand new duplicate dictionary in RAM.\n• Allocates a fresh hash table and key-value pair memory cells for every single ₹20 recharge.\n• Consumes +20 MB of physical memory per transaction instead of reusing existing storage.\n• Quickly exhausts server memory as hundreds of students recharge simultaneously!"
    },
    4: {
      code: "    new_wallet['balance'] += 20",
      desc: "• Modifies the 'balance' key by adding ₹20 ONLY on the newly cloned dictionary.\n• The original dictionary in memory remains completely untouched and out of sync.\n• Demonstrates how unintended copies can cause data divergence and state synchronization bugs.\n• Extra CPU cycles and RAM are wasted writing to a temporary detached clone."
    },
    5: {
      code: "    return new_wallet",
      desc: "• Returns the newly duplicated dictionary reference back to the calling function.\n• Hands over the memory pointer to the cloned object before popping the stack frame.\n• The caller must capture this new address, otherwise the clone becomes unreachable garbage.\n• In copy mode, recurring duplication crashes the server before transactions complete."
    }
  };

  const pointerLineExplanations = {
    1: {
      code: "update_wallet(wallet)",
      desc: "• Calls the update_wallet() function, passing the original dictionary by reference.\n• Passes only the lightweight memory pointer (8 bytes) without duplicating any key-value data.\n• No reassignment needed since the function directly modifies the target object in-place.\n• Scales effortlessly to millions of transactions with constant, zero-overhead memory consumption."
    },
    2: {
      code: "def update_wallet(wallet):",
      desc: "• Defines the in-place updating function receiving the active canteen wallet reference.\n• The parameter 'wallet' directly aliases the master dictionary in heap memory.\n• Python dictionaries are mutable: changes made inside this function affect the original object.\n• Prevents unnecessary memory allocations across the entire transaction pipeline."
    },
    3: {
      code: "    wallet['balance'] += 20",
      desc: "• ⚡ IN-PLACE MUTATION: Directly updates the existing 'balance' integer in physical RAM.\n• Changes the value at the original memory address; id(wallet) remains completely identical!\n• Allocates exactly 0 extra MB of memory—the wallet mutates cleanly in place.\n• All parts of the canteen application instantly see the updated ₹120 balance!"
    },
    5: {
      code: "    return wallet",
      desc: "• Returns the reference to the exact same updated dictionary object.\n• Allows method chaining while confirming that the single master object was updated.\n• No redundant objects are created or left behind for Python's Garbage Collector to clean up.\n• The server runs at lightning speed with 100% memory safety and zero lag."
    }
  };

  if (storySlides[storyStep] !== null && storyStep < storySlides.length) {
    const steps = [
      { id: 0, label: "1. The ₹20 Rush" },
      { id: 1, label: "2. The Copycat Disaster" },
      { id: 3, label: "3. Recharge Original" }
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

  const renderAnimatedExplanation = (isDanger, explanations) => {
    if (!selectedLine || !explanations[selectedLine]) {
      return null;
    }

    const data = explanations[selectedLine];
    const rawLines = data.desc ? data.desc.split('\n').map(l => l.replace(/^[•\s*-]+/, '').trim()).filter(Boolean) : [];
    const meta = [
      { shortTag: "1. Code", category: "Python Action", color: isDanger ? '#7c4a2d' : '#256038', bg: isDanger ? '#fff2e8' : '#e9f4ec', icon: "💻", label: "Execution Logic" },
      { shortTag: "2. RAM", category: "In Physical RAM", color: isDanger ? '#8c5914' : '#2f6564', bg: isDanger ? '#fdf3e2' : '#eaf2ee', icon: "🧠", label: "Physical Memory" },
      { shortTag: "3. Scale", category: "Scale & Transactions", color: isDanger ? '#9c4d3d' : '#15803d', bg: isDanger ? '#fbf0ed' : '#f0fdf4', icon: isDanger ? "⚠️" : "⚡", label: "Transaction Impact" },
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
                {mode === 'duplicate' ? "Pre-Flight Check: Canteen Wallet" : "Pre-Flight Check: In-Place Mutation"}
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
              ? "Look at the recharge function on the left. What happens in RAM when 'wallet.copy()' is called?"
              : "Look at the updated code on the left. What happens when we execute 'wallet[\"balance\"] += 20'?"}
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
                  <span><strong>A.</strong> Python overwrites the balance in-place inside the existing memory box without creating anything new.</span>
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
                  <span><strong>B.</strong> Python creates a brand-new dictionary hash table at a new memory address in heap RAM.</span>
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
                  <span><strong>A.</strong> The existing dictionary mutates directly in-place in Memory Box #1 (zero new memory allocated).</span>
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
                  <span><strong>B.</strong> Python clones the dictionary into another heap memory slot before adding ₹20.</span>
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
              ? "As students repeatedly recharge their wallets in this system, what will happen to server RAM?"
              : "With in-place mutation, how will server RAM behave as students recharge throughout lunch?"}
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
                  <span><strong>A.</strong> The server merges redundant wallet copies automatically, keeping memory steady.</span>
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
                  <span><strong>B.</strong> Every recharge creates an orphan dictionary (+20 MB), quickly exhausting the 100 MB RAM limit and crashing!</span>
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
                  <span><strong>A.</strong> RAM stays completely flat at ~20 MB because updates modify the master wallet without allocating new objects!</span>
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
                  <span><strong>B.</strong> RAM continually inflates by 20 MB per transaction until the server crashes.</span>
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
                mode === 'duplicate'
                  ? "Calling wallet.copy() instantiates an entirely new dictionary hash table for every transaction, quickly filling the 100 MB RAM limit. Launch the simulation to watch RAM crash live!"
                  : "Python dictionaries are mutable! Updating wallet['balance'] directly mutates the existing memory box with 0 extra memory allocation. Launch to verify zero RAM growth!"
              ) : (
                mode === 'duplicate'
                  ? "Calling wallet.copy() does not update in-place; it forces Python to allocate a brand-new dictionary in heap RAM for every recharge, multiplying memory footprint until RAM crashes."
                  : "Dictionaries in Python are mutable in-place. Updating keys does NOT create new dictionaries; it directly edits the original object without extra memory overhead."
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontFamily: '"Fraunces", Georgia, serif', color: '#2f6564' }}>Code Execution</h2>
        </div>

        {mode === 'duplicate' ? (
          <div style={{ background: '#fdfbf7', borderLeft: '4px solid #e8a33d', border: '1.5px solid #e4dcc8', padding: '14px', marginTop: '16px', borderRadius: '14px' }}>
            <div>
              <strong style={{ color: '#2b2b2b', fontFamily: '"Fraunces", Georgia, serif', fontSize: '0.95rem' }}>Code Execution: Copy Approach</strong>
            </div>
            <pre style={{ marginTop: '8px', fontFamily: '"SFMono-Regular", Consolas, monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>def update_wallet(wallet):</div>
              <div style={{ color: '#b45309', padding: '2px 4px', fontWeight: 600 }}>    # DANGER: Allocating new memory for every update</div>

              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>
                {`    new_wallet = wallet.copy()`}
              </div>
              <div onClick={() => selectLine(4)} style={{ ...getLineStyle(4), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(4) }}>    new_wallet["balance"] += 20</div>
              <div onClick={() => selectLine(5)} style={{ ...getLineStyle(5), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(5) }}>    return new_wallet</div>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>wallet = update_wallet(wallet)</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(true, copyLineExplanations)}
          </div>
        ) : (
          <div style={{ background: '#e9f4ec', borderLeft: '4px solid #4f9a63', border: '1px solid #c6e6cd', padding: '14px', marginTop: '16px', borderRadius: '14px' }}>
            <div>
              <strong style={{ color: '#2b2b2b', fontFamily: '"Fraunces", Georgia, serif', fontSize: '0.95rem' }}>Optimized Execution: Shared Reference</strong>
            </div>
            <pre style={{ marginTop: '8px', fontFamily: '"SFMono-Regular", Consolas, monospace', background: '#ffffff', border: '1px solid #e4dcc8', color: '#2b2b2b', padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}>
              <div onClick={() => selectLine(2)} style={{ ...getLineStyle(2), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(2) }}>def update_wallet(wallet):</div>
              <div style={{ color: '#256038', padding: '2px 4px', fontWeight: 600 }}>    # SUCCESS: Updates existing object in-place</div>

              <div onClick={() => selectLine(3)} style={{ ...getLineStyle(3), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(3) }}>
                {`    wallet["balance"] += 20`}
              </div>

              <div onClick={() => selectLine(5)} style={{ ...getLineStyle(5), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(5) }}>    return wallet</div>
              <div onClick={() => selectLine(1)} style={{ ...getLineStyle(1), cursor: 'pointer', padding: '2px 4px', borderRadius: '3px', background: getCodeLineBg(1) }}>update_wallet(wallet)</div>
            </pre>

            {/* Purpose shows ONLY when clicked on a line */}
            {renderAnimatedExplanation(false, pointerLineExplanations)}
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', flexDirection: 'column' }}>
          {hasCrashed && (
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
              <span>View Smart Approach</span> <ArrowRight size={18} />
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
                <span>⚡</span> Wallet Memory & Mutation Lab
              </h2>
              <button
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
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} fill="#ffffff" />
                    <span>Run Simulation (Add ₹20)</span>
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
                      Physical RAM Allocation (100 MB)
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
                    RAM: {ram.toFixed(0)}% ({ram.toFixed(2)} MB / 100 MB)
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

              {/* RAM Floor Content: Master Central Wallet + Available Memory */}
              <div style={{ display: 'flex', flex: 1, width: '100%', minHeight: '220px' }}>
                {/* Master Central Wallet Zone */}
                <div style={{ width: '30%', borderRight: '2px dashed #e4dcc8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
                  <p style={{ color: '#5b5648', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600 }}>Central Canteen Database</p>
                  <div style={{ background: '#fdf3e2', padding: '12px', border: '2px solid #e8a33d', borderRadius: '12px', textAlign: 'center', width: '130px', zIndex: 10, boxShadow: '0 2px 0 #e4dcc8' }}>
                    <h3 style={{ margin: 0, color: '#2b2b2b', fontFamily: '"Fraunces", serif', fontSize: '0.85rem' }}>Rahul's Wallet</h3>
                    <div style={{ background: '#ffffff', color: '#2b2b2b', border: '1px solid #e4dcc8', padding: '6px', marginTop: '8px', fontSize: '1.05rem', fontWeight: 'bold', borderRadius: '6px' }}>
                      ₹{mode === 'duplicate' ? 100 : balance}
                    </div>
                  </div>
                  <span style={{ marginTop: '8px', background: '#eaf2ee', color: '#2f6564', border: '1px solid #3a7d7c', padding: '2px 9px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>Location: 1000</span>
                  <span style={{ marginTop: '4px', color: '#5b5648', fontSize: '0.7rem' }}>Size: 20 MB</span>
                </div>

                {/* Available Memory Zone */}
                <div style={{ width: '70%', padding: '12px 16px', display: 'flex', flexDirection: 'column', position: 'relative', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ margin: 0, color: '#5b5648', fontSize: '0.78rem', fontWeight: 600 }}>Available Memory</p>
                  </div>

                  {mode === 'duplicate' ? (
                    /* 2x2 Grid covering 100% of Available Memory when copies are added */
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gridTemplateRows: 'repeat(2, 1fr)',
                      gap: '10px',
                      flex: 1,
                      width: '100%',
                      minHeight: '190px'
                    }}>
                      {wallets.map((w, i) => (
                        <div
                          key={w.id}
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
                          <span style={{ fontSize: '1.4rem', marginBottom: '2px' }}>💳</span>
                          <strong style={{ fontSize: '0.82rem', color: '#2b2b2b' }}>Copy #{i + 1}</strong>
                          <span style={{ fontSize: '0.74rem', color: '#7c4a2d', fontWeight: 600 }}>₹{w.balance}</span>
                          <span style={{
                            marginTop: '4px',
                            background: '#fbeae7',
                            color: '#c25b4a',
                            border: '1px solid #c25b4a',
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            20 MB
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      width: '100%',
                      minHeight: '190px'
                    }}>
                      {balance > 100 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <p style={{ color: '#256038', fontSize: '1.15rem', fontWeight: 'bold', animation: 'popIn 0.3s', margin: 0 }}>
                            ✅ Database Updated In-Place!
                          </p>
                          <p style={{ color: '#5b5648', fontSize: '0.86rem', marginTop: '6px' }}>Zero new memory allocated. rahul['balance'] = ₹{balance}</p>
                        </div>
                      ) : (
                        <div style={{ color: '#7c7365', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
                          Click 'Run Simulation' to observe safe in-place wallet modification.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calculation Bar */}
            <div style={{ background: '#fdfbf5', padding: '14px 16px', borderRadius: '14px', marginTop: '14px', width: '100%', border: '1px solid #e4dcc8', boxShadow: '0 2px 0 #e4dcc8', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '1.05rem', fontFamily: '"Fraunces", serif', marginBottom: '8px', color: '#2b2b2b' }}>
                <strong>RAM Capacity: 100 MB</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '0.98rem', fontFamily: '"SFMono-Regular", Consolas, monospace' }}>
                <span style={{ color: '#3a7d7c', fontWeight: 600 }}>20 MB (System)</span>
                <span style={{ color: '#5b5648' }}>+</span>
                <span style={{ color: mode === 'duplicate' ? '#c25b4a' : '#4f9a63', fontWeight: 600 }}>
                  {mode === 'duplicate' ? `${wallets.length * 20} MB (Copies)` : `0 MB (In-Place)`}
                </span>
                <span style={{ color: '#5b5648' }}>=</span>
                <span style={{ fontWeight: 'bold', color: ram >= 100 ? '#c25b4a' : '#2b2b2b' }}>
                  {ram.toFixed(2)} MB Total
                </span>
              </div>
            </div>

            {/* Memory Verdict Strip */}
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
                ? `🛑 Memory Bloat: Each recharge creates a new duplicate box in RAM (Wasted: ${wallets.length * 20} MB)!`
                : `✅ Efficient In-Place Update: Balance updated directly inside original Memory Box #1 with zero memory copies!`
              }
            </div>
          </>
        )}
      </div>

      {/* Quiz Modal Overlay */}
      {showQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(36, 30, 26, 0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(10px)', padding: '16px' }}>
          <div style={{ width: '920px', maxWidth: '96%', maxHeight: '92vh', overflowY: 'auto' }}>
            <Quiz questions={questions} codeChallenge={level2CodeChallenge} onPass={onPass} onClose={() => setShowQuiz(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Level2;
