import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle, Brain, Play, Code, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_BEATS = 10;

const baseQuizzes = [
  {
    id: 'q1',
    question: "In a nested loop, which loop completes its entire cycle first?",
    options: [
      { id: 'opt1', text: "The outer loop", isCorrect: false },
      { id: 'opt2', text: "The inner loop (it runs fully for each single step of the outer loop)", isCorrect: true },
      { id: 'opt3', text: "Both finish at the exact same time", isCorrect: false },
      { id: 'opt4', text: "It randomly depends on the compiler", isCorrect: false }
    ]
  },
  {
    id: 'q2',
    question: "If the outer loop runs 3 times, and the inner loop runs 4 times, how many total times does the action happen?",
    options: [
      { id: 'opt1', text: "7 times (3 + 4)", isCorrect: false },
      { id: 'opt2', text: "12 times (3 * 4)", isCorrect: true },
      { id: 'opt3', text: "3 times", isCorrect: false },
      { id: 'opt4', text: "4 times", isCorrect: false }
    ]
  }
];

const CaseStudyTwo = ({ onScoreUpdate, resetSignal, onBack, onComplete, isCompleted }) => {
  const [currentBeat, setCurrentBeat] = useState(1);
  
  // Quiz states
  const [q1Answered, setQ1Answered] = useState(false);
  const [q1Selected, setQ1Selected] = useState(null);
  const [q2Answered, setQ2Answered] = useState(false);
  const [q2Selected, setQ2Selected] = useState(null);

  // Code Challenge states
  const [codeAnswers, setCodeAnswers] = useState({ loop1: '', loop2: '' });
  const [codeVerified, setCodeVerified] = useState(null);

  useEffect(() => {
    setCurrentBeat(1);
    setQ1Answered(false);
    setQ1Selected(null);
    setQ2Answered(false);
    setQ2Selected(null);
    setCodeAnswers({ loop1: '', loop2: '' });
    setCodeVerified(null);
  }, [resetSignal]);

  const isNextDisabled = () => {
    if (currentBeat === TOTAL_BEATS) return true;
    if (currentBeat === 7 && !q1Answered) return true;
    if (currentBeat === 8 && !q2Answered) return true;
    if (currentBeat === 9 && !codeVerified) return true;
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
      codeAnswers.loop1.trim() === '6' && 
      codeAnswers.loop2.trim() === '11';
    setCodeVerified(isCorrect);
    if(isCorrect) {
        onScoreUpdate('cs2_code', 1);
        if (onComplete) onComplete();
    } else {
        onScoreUpdate('cs2_code', 0);
    }
  };

  const getActiveStep = () => {
    if (currentBeat <= 4) return 1; // Story
    if (currentBeat <= 6) return 2; // Logic
    if (currentBeat <= 8) return 3; // Concept Check
    return 4; // Code Challenge
  };

  const currentStep = getActiveStep();

  const handleStepClick = (stepId) => {
    const isStep2Allowed = currentBeat >= 4;
    const isStep3Allowed = currentBeat >= 6;
    const isStep4Allowed = q1Answered && q2Answered;

    if (stepId === 1) setCurrentBeat(1);
    else if (stepId === 2 && (isStep2Allowed || currentStep > 2)) setCurrentBeat(5);
    else if (stepId === 3 && (isStep3Allowed || currentStep > 3)) setCurrentBeat(7);
    else if (stepId === 4 && (isStep4Allowed || currentStep > 4)) setCurrentBeat(9);
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
            <h2 className="text-3xl font-bold text-blue-400">Case Study 2: The Cinema Hall</h2>
            <p className="text-xl text-slate-300">Learning Nested Loops (A loop inside a loop).</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">The movie has ended. The cleaning staff needs to clean the entire cinema hall.</p>
            <p className="text-lg text-slate-300 leading-relaxed">The hall is organized into a perfect grid:</p>
            <div className="bg-slate-800/60 border-l-4 border-blue-500 p-4 rounded-r">
              <p className="text-blue-400 font-bold">5 Rows (Row 1 to 5).</p>
              <p className="text-blue-400 font-bold mt-2">Each Row has 10 Seats.</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">The cleaner starts at <strong>Row 1</strong>. This is the <span className="text-yellow-400 font-bold">Outer Loop</span>.</p>
            <p className="text-lg text-slate-300 leading-relaxed">But moving to Row 2 isn't instant.</p>
            <p className="text-lg text-slate-300 leading-relaxed">While standing in Row 1, the cleaner must clean <strong>Seat 1, then Seat 2, then Seat 3... all the way to Seat 10.</strong></p>
            <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl mt-4">
              <p className="text-slate-300">Cleaning the seats one by one is the <span className="text-emerald-400 font-bold">Inner Loop</span>.</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">The Magic Rule</h2>
            <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r my-4 shadow-lg shadow-red-500/10 space-y-4">
              <p className="text-lg text-slate-300">You cannot move to Row 2 until ALL 10 seats in Row 1 are cleaned.</p>
              <p className="text-lg text-slate-300">The <strong>Outer Loop</strong> is paused while the <strong>Inner Loop</strong> does its entire job.</p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">The Python Logic</h2>
            <p className="text-lg text-slate-300">In Python, we simply write a loop inside another loop with indentation.</p>
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 font-mono text-sm text-slate-300 shadow-inner">
              <p><span className="text-blue-400">for</span> row <span className="text-blue-400">in</span> range(1, 6): <span className="text-slate-500"># The Outer Loop (5 rows)</span></p>
              <p className="pl-8"><span className="text-blue-400">for</span> seat <span className="text-blue-400">in</span> range(1, 11): <span className="text-slate-500"># The Inner Loop (10 seats)</span></p>
              <p className="pl-16">clean_seat()</p>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Total Iterations</h2>
            <p className="text-lg text-slate-300">How many seats are cleaned in total?</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-3 mt-6">
              <li><strong>Row 1:</strong> 10 seats cleaned.</li>
              <li><strong>Row 2:</strong> 10 seats cleaned.</li>
              <li><strong>...</strong></li>
              <li><strong>Row 5:</strong> 10 seats cleaned.</li>
            </ul>
            <p className="text-lg text-yellow-400 font-bold mt-4">Total = 5 rows × 10 seats = 50 total cleanings.</p>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">Concept Check 1</h2>
            <p className="text-lg text-slate-300 mb-8">{baseQuizzes[0].question}</p>
            <div className="space-y-3">
              {baseQuizzes[0].options.map(opt => {
                const isSelected = q1Selected === opt.id;
                let btnClass = "w-full text-left p-4 rounded-xl border transition-all text-sm md:text-base font-medium ";
                if (isSelected && opt.isCorrect) btnClass += "bg-emerald-900/60 border-emerald-400 text-emerald-200";
                else if (isSelected && !opt.isCorrect) btnClass += "bg-red-900/60 border-red-500 text-red-200";
                else btnClass += "bg-slate-800/80 border-slate-600 text-slate-200 hover:border-slate-400";

                return (
                  <button 
                    key={opt.id}
                    disabled={q1Answered}
                    onClick={() => {
                      setQ1Selected(opt.id);
                      if(opt.isCorrect) {
                        setQ1Answered(true);
                        onScoreUpdate('cs2_q1', 1);
                      }
                    }}
                    className={btnClass}
                  >
                    {opt.text}
                  </button>
                )
              })}
            </div>
            {q1Answered && <p className="text-emerald-400 font-bold mt-4 flex items-center gap-2"><CheckCircle size={20}/> Correct!</p>}
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-2">Concept Check 2</h2>
            <p className="text-lg text-slate-300 mb-8">{baseQuizzes[1].question}</p>
            <div className="space-y-3">
              {baseQuizzes[1].options.map(opt => {
                const isSelected = q2Selected === opt.id;
                let btnClass = "w-full text-left p-4 rounded-xl border transition-all text-sm md:text-base font-medium ";
                if (isSelected && opt.isCorrect) btnClass += "bg-emerald-900/60 border-emerald-400 text-emerald-200";
                else if (isSelected && !opt.isCorrect) btnClass += "bg-red-900/60 border-red-500 text-red-200";
                else btnClass += "bg-slate-800/80 border-slate-600 text-slate-200 hover:border-slate-400";

                return (
                  <button 
                    key={opt.id}
                    disabled={q2Answered}
                    onClick={() => {
                      setQ2Selected(opt.id);
                      if(opt.isCorrect) {
                        setQ2Answered(true);
                        onScoreUpdate('cs2_q2', 1);
                      }
                    }}
                    className={btnClass}
                  >
                    {opt.text}
                  </button>
                )
              })}
            </div>
            {q2Answered && <p className="text-emerald-400 font-bold mt-4 flex items-center gap-2"><CheckCircle size={20}/> Exactly! 3 times 4 = 12.</p>}
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Code Challenge 🔓</h2>
            <p className="text-slate-300 mb-8">Fill in the blanks to complete the cinema nested loop. The cinema has 5 rows and 10 seats per row. (Remember python `range` stops one number before the end, so `range(1, 6)` means 1 to 5).</p>
            
            <div className="bg-[#0a0f1c] rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">cinema.py</span>
              </div>
              <div className="p-6 font-mono text-slate-300 leading-loose">
                <span className="text-blue-400">for</span> row_num <span className="text-blue-400">in</span> range(1, <input 
                  type="text" 
                  value={codeAnswers.loop1}
                  onChange={e => setCodeAnswers({...codeAnswers, loop1: e.target.value})}
                  className="bg-slate-900 text-emerald-400 px-2 py-1 rounded border-b-2 border-emerald-500 focus:outline-none w-10 text-center mx-1 font-bold" 
                  disabled={codeVerified}
                />):<br />
                {'    '}<span className="text-blue-400">for</span> seat_num <span className="text-blue-400">in</span> range(1, <input 
                  type="text" 
                  value={codeAnswers.loop2}
                  onChange={e => setCodeAnswers({...codeAnswers, loop2: e.target.value})}
                  className="bg-slate-900 text-emerald-400 px-2 py-1 rounded border-b-2 border-emerald-500 focus:outline-none w-10 text-center mx-1 font-bold" 
                  disabled={codeVerified}
                />):<br />
                {'        '}<span className="text-blue-400">print</span>("Cleaning Row", row_num, "Seat", seat_num)<br />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              {!codeVerified && (
                <button 
                  onClick={handleVerifyCode}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20"
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
      case 10:
        return (
          <div className="space-y-6">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-8 pt-8">
                <p className="text-xl font-bold text-emerald-400 mb-6">🎉 Incredible! Nested Loops Completed!</p>
                <button onClick={onBack} className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold w-full hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20">
                  Return to Home 🏠
                </button>
            </motion.div>
          </div>
        )
      default:
        return null;
    }
  };

  const renderLeftTitle = () => {
    if (currentBeat <= 4) return "The Cinema Hall";
    if (currentBeat === 5) return "Python Logic";
    if (currentBeat === 6) return "Total Iterations";
    if (currentBeat >= 7 && currentBeat <= 8) return "Concept Checks";
    if (currentBeat >= 9) return "Code Challenge";
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
                        ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                        : isPast
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-slate-700 bg-slate-800 text-slate-500'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider hidden md:block ${
                      isActive ? 'text-blue-400' : isPast ? 'text-emerald-400' : 'text-slate-500'
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

      <div className="flex flex-col lg:flex-row flex-grow w-full">
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
              {(currentBeat <= 4 || currentBeat >= 9) && (
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 mb-8 max-w-sm w-full opacity-80">
                  <img src="/cinema_hall.jpg" alt="Cinema Hall Rows" className="w-full h-auto object-cover" />
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-blue-400 text-center tracking-tight drop-shadow-md">
                {renderLeftTitle()}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

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
                isNextDisabled() ? 'opacity-30 cursor-not-allowed bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
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

export default CaseStudyTwo;
