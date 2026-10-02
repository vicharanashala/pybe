import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle, Brain, Play, Code, XCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_BEATS = 13;

// baseQuizzes is now fetched from backend

const CaseStudyOne = ({ onScoreUpdate, resetSignal, onBack, onProceed, isCompleted }) => {
  const [currentBeat, setCurrentBeat] = useState(1);
  
  // Quiz states
  const [q1Answered, setQ1Answered] = useState(false);
  const [q1Selected, setQ1Selected] = useState(null);
  const [q2Answered, setQ2Answered] = useState(false);
  const [q2Selected, setQ2Selected] = useState(null);

  // Code Challenge states
  const [codeAnswers, setCodeAnswers] = useState({ flow1: '', flow2: '' });
  const [codeVerified, setCodeVerified] = useState(null);

  const [codeAnswers2, setCodeAnswers2] = useState({ flow1: '', flow2: '' });
  const [codeVerified2, setCodeVerified2] = useState(null);

  const [quizzes, setQuizzes] = useState([]);
  const [isQuizzesLoading, setIsQuizzesLoading] = useState(true);
  
  // Results map for validated options (red/green)
  const [q1Results, setQ1Results] = useState({});
  const [q2Results, setQ2Results] = useState({});

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then(data => {
        setQuizzes(data);
        setIsQuizzesLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch quizzes:", err);
        // Fallback if backend is not running
        setQuizzes([
          { id: "q1", scenario: "If the machine finds a torn note, what should it do?", options: ["Halt immediately", "Skip it and continue counting", "Restart counting", "Alert manager"] },
          { id: "q2", scenario: "If the machine finds a fake note, what should it do?", options: ["Skip it", "Continue counting", "Stop immediately", "Ignore it"] }
        ]);
        setIsQuizzesLoading(false);
      });
  }, []);

  useEffect(() => {
    setCurrentBeat(1);
    setQ1Answered(false);
    setQ1Selected(null);
    setQ2Answered(false);
    setQ2Selected(null);
    setCodeAnswers({ flow1: '', flow2: '' });
    setCodeVerified(null);
    setCodeAnswers2({ flow1: '', flow2: '' });
    setCodeVerified2(null);
    setQ1Results({});
    setQ2Results({});
  }, [resetSignal]);

  const isNextDisabled = () => {
    if (currentBeat === TOTAL_BEATS) return true;
    if (currentBeat === 10 && !q1Answered) return true;
    if (currentBeat === 11 && !q2Answered) return true;
    if (currentBeat === 12 && !codeVerified) return true;
    return false;
  };

  const handleNext = () => {
    if (!isNextDisabled()) setCurrentBeat(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentBeat > 1) setCurrentBeat(prev => prev - 1);
  };

  const handleVerifyCode = () => {
    const isCorrect = 
      codeAnswers.flow1.trim().toLowerCase() === 'continue' && 
      codeAnswers.flow2.trim().toLowerCase() === 'break';
    setCodeVerified(isCorrect);
    onScoreUpdate('cs1_code', isCorrect ? 1 : 0);
  };

  const handleVerifyCode2 = () => {
    const isCorrect = 
      codeAnswers2.flow1.trim().toLowerCase() === 'continue' && 
      codeAnswers2.flow2.trim().toLowerCase() === 'break';
    setCodeVerified2(isCorrect);
    onScoreUpdate('cs1_code2', isCorrect ? 1 : 0);
  };

  // Determine active step based on current beat
  const getActiveStep = () => {
    if (currentBeat <= 3) return 1; // Story
    if (currentBeat <= 9) return 2; // Logic
    if (currentBeat <= 11) return 3; // Concept Check
    return 4; // Code Challenge
  };

  const currentStep = getActiveStep();

  // Jump to start beat of a step
  const handleStepClick = (stepId) => {
    const isStep2Allowed = currentBeat >= 3;
    const isStep3Allowed = currentBeat >= 9;
    const isStep4Allowed = q1Answered && q2Answered;

    if (stepId === 1) setCurrentBeat(1);
    else if (stepId === 2 && (isStep2Allowed || currentStep > 2)) setCurrentBeat(4);
    else if (stepId === 3 && (isStep3Allowed || currentStep > 3)) setCurrentBeat(10);
    else if (stepId === 4 && (isStep4Allowed || currentStep > 4)) setCurrentBeat(12);
  };

  const steps = [
    { id: 1, title: 'The Story', icon: Play },
    { id: 2, title: 'The Logic', icon: Brain },
    { id: 3, title: 'Concept Check', icon: CheckCircle },
    { id: 4, title: 'Code Challenge', icon: Code }
  ];

  const renderBeatContent = () => {
    switch(currentBeat) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-500">Case Study 1: The Note Counter</h2>
            <p className="text-xl text-slate-300">The Note Counter: Managing the flow.</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">A high-speed bank cashier machine is rapidly counting a massive bundle of cash.</p>
            <p className="text-lg text-slate-300 leading-relaxed">Everything is going smoothly, but occasionally, the machine encounters problem notes.</p>
            <div className="bg-slate-800/60 border-l-4 border-yellow-500 p-4 rounded-r">
              <p className="text-yellow-400 font-bold mb-2">Scenario A: The Torn Note</p>
              <p className="text-slate-300">A slightly torn note goes through the scanner. The machine recognizes it's valid, but damaged. It rejects the note into a separate bin. It doesn't stop counting the rest of the bundle; it simply <strong>skips</strong> that one torn note and continues with the next one.</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/60 border-l-4 border-red-500 p-4 rounded-r">
              <p className="text-red-400 font-bold mb-2">Scenario B: The Fake Note</p>
              <p className="text-slate-300">A counterfeit note is detected. This is a severe security issue! The machine sounds an alarm and <strong>stops completely</strong>.</p>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed mt-6">It will not process any more notes in that bundle until a manager overrides the system. The counting process is entirely halted.</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-lg text-slate-300">Did you notice something common in both problem notes?</p>
            <p className="text-lg text-slate-300">They both forced the machine to <span className="italic text-yellow-400">change its normal counting routine.</span></p>
            
            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-6">
              <p className="text-yellow-400 font-bold">This is what Loop Control is!</p>
            </div>

            <p className="text-slate-300"><strong>Loop Control Statements:</strong> Just like a bank machine handling exceptions, a program can alter its loop flow based on special conditions. There are two main controls:</p>
            
            <ul className="list-disc pl-5 text-slate-300 space-y-3 mt-6">
              <li><strong>Skipping (continue):</strong> What happens when we bypass an item? <em>(e.g., The machine ignores the torn note and moves to the next one).</em></li>
              <li><strong>Emergency Stop (break):</strong> What happens when we halt completely? <em>(e.g., The machine sounds an alarm and completely stops counting).</em></li>
            </ul>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">The Note Loop: Skipping</h2>
            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r my-4 shadow-lg shadow-blue-500/10 space-y-4">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Skipping an Action (continue)</h3>
              <p className="text-lg text-slate-300">When a damaged note is detected, the machine does not crash.</p>
              <p className="text-lg text-slate-300">It simply bypasses the torn note.</p>
              <p className="text-lg text-slate-300">It stops the <strong>current cycle</strong> for that single note and jumps right back to the top for the next item.</p>
              <div className="bg-slate-800/50 p-4 mt-2 rounded-lg border border-slate-700/50">
                <p className="text-lg text-blue-200">This models the <strong className="text-white">continue</strong> statement, which skips the rest of the current iteration but keeps the loop running for future items.</p>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">The Note Loop: Halting</h2>
            <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r my-4 shadow-lg shadow-red-500/10 space-y-4">
              <h3 className="text-xl font-bold text-red-400 mb-2">Emergency Stop (break)</h3>
              <p className="text-lg text-slate-300">When a fake note is detected, the machine must STOP completely.</p>
              <p className="text-lg text-slate-300">It forces an immediate termination of the <strong>entire process</strong>.</p>
              <p className="text-lg text-slate-300">It doesn't matter how many notes were still left to be counted.</p>
              <div className="bg-slate-800/50 p-4 mt-2 rounded-lg border border-slate-700/50">
                <p className="text-lg text-red-200">This models the <strong className="text-white">break</strong> statement, which shatters the loop and completely exits the process immediately.</p>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Let's code: Skipping an action</h2>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
              <p className="text-sm font-bold text-yellow-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="bg-yellow-500/20 px-2 py-1 rounded">continue</span> in Python
              </p>
              <p className="text-slate-300 mb-6">The `continue` keyword immediately stops the current iteration and forces the loop to start the next iteration.</p>
              <div className="bg-[#0a0f1c] p-4 rounded-lg font-mono text-sm text-yellow-300 shadow-inner">
                <p>if note == "Torn":</p>
                <p className="pl-4">continue  <span className="text-slate-500"># Skips counting this note</span></p>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Let's code: Emergency Stop</h2>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <p className="text-sm font-bold text-red-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                <span className="bg-red-500/20 px-2 py-1 rounded">break</span> in Python
              </p>
              <p className="text-slate-300 mb-6">The `break` keyword completely shatters the loop. The loop is immediately terminated, and the program moves on to the code after the loop.</p>
              <div className="bg-[#0a0f1c] p-4 rounded-lg font-mono text-sm text-red-300 shadow-inner">
                <p>if note == "Fake":</p>
                <p className="pl-4">break  <span className="text-slate-500"># Exits the loop entirely</span></p>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">In a Nutshell</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Sometimes we need to override the normal behavior of a loop from the inside.
            </p>
            <p className="text-slate-300 font-bold mb-4">Loop Control Statements:</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-4">
              <li><strong>continue:</strong> Skips the rest of the code inside the loop for the current iteration only. Loop does not terminate but continues on with the next iteration.</li>
              <li><strong>break:</strong> Terminates the loop completely. Execution proceeds to the first statement following the loop body.</li>
            </ul>
          </div>
        );
      case 10:
        if (isQuizzesLoading || !quizzes[0]) return <div className="text-white">Loading...</div>;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">Concept Check 1</h2>
            <p className="text-lg text-slate-300 mb-8">{quizzes[0].scenario}</p>
            <div className="space-y-3">
              {quizzes[0].options.map(opt => {
                const isSelected = q1Selected === opt;
                const result = q1Results[opt];
                let btnClass = "w-full text-left p-4 rounded-xl border transition-all text-sm md:text-base font-medium ";
                if (result === true) btnClass += "bg-emerald-900/60 border-emerald-400 text-emerald-200";
                else if (result === false) btnClass += "bg-red-900/60 border-red-500 text-red-200";
                else btnClass += "bg-slate-800/80 border-slate-600 text-slate-200 hover:border-slate-400";

                return (
                  <button 
                    key={opt}
                    disabled={q1Answered}
                    onClick={() => {
                      setQ1Selected(opt);
                      fetch('/api/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ answers: [{ id: quizzes[0].id, answer: opt }] })
                      })
                      .then(res => res.json())
                      .then(data => {
                        const isCorrect = data.results[0].isCorrect;
                        setQ1Results(prev => ({...prev, [opt]: isCorrect}));
                        if(isCorrect) {
                          setQ1Answered(true);
                          onScoreUpdate('cs1_q1', 1);
                        }
                      })
                      .catch(() => {
                        // fallback check
                        const isCorrect = (opt === "Skip it and continue counting" || opt === "Skip it");
                        setQ1Results(prev => ({...prev, [opt]: isCorrect}));
                        if (isCorrect) {
                          setQ1Answered(true);
                          onScoreUpdate('cs1_q1', 1);
                        }
                      });
                    }}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {q1Answered && <p className="text-emerald-400 font-bold mt-4 flex items-center gap-2"><CheckCircle size={20}/> Correct! Click Next.</p>}
          </div>
        );
      case 11:
        if (isQuizzesLoading || !quizzes[1]) return <div className="text-white">Loading...</div>;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">Concept Check 2</h2>
            <p className="text-lg text-slate-300 mb-8">{quizzes[1].scenario}</p>
            <div className="space-y-3">
              {quizzes[1].options.map(opt => {
                const isSelected = q2Selected === opt;
                const result = q2Results[opt];
                let btnClass = "w-full text-left p-4 rounded-xl border transition-all text-sm md:text-base font-medium ";
                if (result === true) btnClass += "bg-emerald-900/60 border-emerald-400 text-emerald-200";
                else if (result === false) btnClass += "bg-red-900/60 border-red-500 text-red-200";
                else btnClass += "bg-slate-800/80 border-slate-600 text-slate-200 hover:border-slate-400";

                return (
                  <button 
                    key={opt}
                    disabled={q2Answered}
                    onClick={() => {
                      setQ2Selected(opt);
                      fetch('/api/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ answers: [{ id: quizzes[1].id, answer: opt }] })
                      })
                      .then(res => res.json())
                      .then(data => {
                        const isCorrect = data.results[0].isCorrect;
                        setQ2Results(prev => ({...prev, [opt]: isCorrect}));
                        if(isCorrect) {
                          setQ2Answered(true);
                          onScoreUpdate('cs1_q2', 1);
                        }
                      })
                      .catch(() => {
                        // fallback check
                        const isCorrect = (opt === "Stop immediately" || opt === "Halt immediately");
                        setQ2Results(prev => ({...prev, [opt]: isCorrect}));
                        if (isCorrect) {
                          setQ2Answered(true);
                          onScoreUpdate('cs1_q2', 1);
                        }
                      });
                    }}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {q2Answered && <p className="text-emerald-400 font-bold mt-4 flex items-center gap-2"><CheckCircle size={20}/> Correct! Click Next.</p>}
          </div>
        );
      case 12:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Code Challenge 🔓</h2>
            <p className="text-slate-300 mb-8">Fill in the blanks to program the note counter.</p>
            
            <div className="bg-[#0a0f1c] rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">note_counter.py</span>
              </div>
              <div className="p-6 font-mono text-slate-300 leading-loose">
                cash_bundle = ["500", "Phata_500", "200", "Fake_500", "100"]<br /><br />
                <span className="text-blue-400">for</span> note <span className="text-blue-400">in</span> cash_bundle:<br />
                {'    '}<span className="text-blue-400">if</span> "Phata" <span className="text-blue-400">in</span> note:<br />
                {'        '}<input 
                  type="text" 
                  value={codeAnswers.flow1}
                  onChange={e => setCodeAnswers({...codeAnswers, flow1: e.target.value})}
                  className="bg-slate-900 text-yellow-400 px-2 py-1 rounded border-b-2 border-yellow-500 focus:outline-none w-24 text-center mx-1 font-bold" 
                  disabled={codeVerified}
                /> <span className="text-slate-500"># Skip torn note</span><br /><br />
                {'    '}<span className="text-blue-400">if</span> "Fake" <span className="text-blue-400">in</span> note:<br />
                {'        '}<input 
                  type="text" 
                  value={codeAnswers.flow2}
                  onChange={e => setCodeAnswers({...codeAnswers, flow2: e.target.value})}
                  className="bg-slate-900 text-red-400 px-2 py-1 rounded border-b-2 border-red-500 focus:outline-none w-20 text-center mx-1 font-bold" 
                  disabled={codeVerified}
                /> <span className="text-slate-500"># Emergency stop</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              {!codeVerified && (
                <button 
                  onClick={handleVerifyCode}
                  className="px-6 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                >
                  Verify Code
                </button>
              )}
              {codeVerified !== null && (
                <span className={`flex items-center gap-2 font-bold ${codeVerified ? 'text-emerald-400' : 'text-red-400'}`}>
                  {codeVerified ? <><CheckCircle size={20} /> Verified!</> : <><XCircle size={20} /> Try Again</>}
                </span>
              )}
            </div>
          </div>
        );
      case 13:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Mid-Level Challenge 🧑💻</h2>
            <p className="text-slate-300 mb-8">We are checking a list of bank transactions. Skip any $0 transactions. But if any transaction is over $10000, trigger a security check and STOP processing!</p>
            
            <div className="bg-[#0a0f1c] rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">transaction_scanner.py</span>
              </div>
              <div className="p-6 font-mono text-slate-300 leading-loose">
                transactions = [500, 0, 1200, 15000, 300]<br /><br />
                <span className="text-blue-400">for</span> amount <span className="text-blue-400">in</span> transactions:<br />
                {'    '}<span className="text-blue-400">if</span> amount == 0:<br />
                {'        '}<input 
                  type="text" 
                  value={codeAnswers2.flow1}
                  onChange={e => setCodeAnswers2({...codeAnswers2, flow1: e.target.value})}
                  className="bg-slate-900 text-yellow-400 px-2 py-1 rounded border-b-2 border-yellow-500 focus:outline-none w-24 text-center mx-1 font-bold" 
                  disabled={codeVerified2}
                /> <span className="text-slate-500"># Skip zero amounts</span><br />
                {'    '}<span className="text-blue-400">if</span> amount &gt; 10000:<br />
                {'        '}<input 
                  type="text" 
                  value={codeAnswers2.flow2}
                  onChange={e => setCodeAnswers2({...codeAnswers2, flow2: e.target.value})}
                  className="bg-slate-900 text-red-400 px-2 py-1 rounded border-b-2 border-red-500 focus:outline-none w-20 text-center mx-1 font-bold" 
                  disabled={codeVerified2}
                /> <span className="text-slate-500"># Stop for security check</span><br />
                {'    '}approve_transaction(amount)
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              {!codeVerified2 && (
                <button 
                  onClick={handleVerifyCode2}
                  className="px-6 py-2.5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                >
                  Verify Code
                </button>
              )}
              {codeVerified2 !== null && (
                <span className={`flex items-center gap-2 font-bold ${codeVerified2 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {codeVerified2 ? <><CheckCircle size={20} /> Verified!</> : <><XCircle size={20} /> Try Again</>}
                </span>
              )}
            </div>

            {codeVerified2 && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-8 border-t border-slate-700/50 pt-8 flex flex-col items-center">
                <p className="text-xl font-bold text-emerald-400 mb-6 text-center">🎉 Case Study 1 Complete!</p>
                <button 
                  onClick={onProceed}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-[1.02] transition-transform"
                >
                  Continue to Case Study 2 🍿
                </button>
              </motion.div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderLeftTitle = () => {
    if (currentBeat <= 3) return "The Note Counter";
    if (currentBeat === 4) return "Overview";
    if (currentBeat === 5) return "The Note Loop: Skipping";
    if (currentBeat === 6) return "The Note Loop: Halting";
    if (currentBeat === 7) return "Let's code: continue";
    if (currentBeat === 8) return "Let's code: break";
    if (currentBeat === 9) return "In a Nutshell";
    if (currentBeat >= 10 && currentBeat <= 11) return "Concept Checks";
    if (currentBeat >= 12) return "Code Challenges";
    return "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1120] w-full text-slate-200">
      
      {/* Sticky Progress Toolbar */}
      <div className="sticky top-0 z-40 bg-[#0b1120]/90 backdrop-blur-md border-b border-slate-800/80 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto no-scrollbar">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center gap-4">
                  <div 
                    onClick={() => handleStepClick(step.id)}
                    className={`flex flex-col lg:flex-row items-center gap-2 lg:gap-3 cursor-pointer transition-all ${
                      isActive ? 'opacity-100' : isPast ? 'opacity-70 hover:opacity-100' : 'opacity-40'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                        : isPast
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-slate-700 bg-slate-800 text-slate-500'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider hidden md:block ${
                      isActive ? 'text-yellow-400' : isPast ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 lg:w-16 h-[2px] rounded-full transition-colors ${
                      isPast ? 'bg-emerald-500/50' : 'bg-slate-800'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slideshow Area */}
      <div className="flex flex-col lg:flex-row flex-grow w-full">
        
        {/* Left Column - Visual Container */}
        <div className="w-full lg:w-5/12 bg-[#050810] border-r border-slate-800 flex flex-col justify-center items-center p-8 relative min-h-[30vh] lg:min-h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentBeat}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center w-full"
            >
              {(currentBeat <= 3 || currentBeat >= 10) && (
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 mb-8 max-w-sm w-full opacity-80">
                  <img src="/bank_note_counter.jpg" alt="Bank Note Counter" className="w-full h-auto object-cover" />
                </div>
              )}
              {currentBeat === 5 && (
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-blue-500/50 mb-8 max-w-sm w-full opacity-90">
                  <img src="/skip_note.jpg" alt="Skipping Note" className="w-full h-auto object-cover" />
                </div>
              )}
              {currentBeat === 6 && (
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-red-500/50 mb-8 max-w-sm w-full opacity-90">
                  <img src="/fake_note_alarm.jpg" alt="Emergency Stop Alarm" className="w-full h-auto object-cover" />
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-500 text-center tracking-tight drop-shadow-md">
                {renderLeftTitle()}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - Dynamic Content */}
        <div className="w-full lg:w-7/12 flex flex-col min-h-[calc(100vh-80px)]">
          
          <div className="px-8 py-4 flex items-center justify-end border-b border-slate-800/30">
            <span className="text-xs font-bold tracking-widest text-slate-500 uppercase bg-slate-800/50 px-3 py-1 rounded-full">
              Slide {currentBeat} of {TOTAL_BEATS}
            </span>
          </div>

          <div className="flex-grow p-8 lg:p-16 flex flex-col justify-center max-w-3xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBeat}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {renderBeatContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-8 py-6 border-t border-slate-800/50 flex items-center justify-between bg-slate-900/20">
            <button 
              onClick={handlePrev}
              disabled={currentBeat === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                currentBeat === 1 ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <ArrowLeft size={16} /> Previous
            </button>
            
            <button 
              onClick={handleNext}
              disabled={isNextDisabled()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${
                isNextDisabled() ? 'opacity-30 cursor-not-allowed bg-yellow-600 text-white' : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
              }`}
            >
              Next <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CaseStudyOne;
