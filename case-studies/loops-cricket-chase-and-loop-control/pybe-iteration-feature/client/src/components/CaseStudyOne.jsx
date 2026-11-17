import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle, Brain, Play, Code, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_BEATS = 17;

const baseQuizzes = [
  {
    id: 'q1',
    question: "You need to print the names of all 11 players in a cricket team list. Which loop is best?",
    options: [
      { id: 'opt1', text: "for loop (iterating through a known, fixed sequence)", isCorrect: true },
      { id: 'opt2', text: "while loop (waiting for an unknown, dynamic condition)", isCorrect: false },
      { id: 'opt3', text: "if-else statement (making a single conditional decision)", isCorrect: false },
      { id: 'opt4', text: "switch statement (selecting one of many fixed conditions)", isCorrect: false }
    ]
  },
  {
    id: 'q2',
    question: "The match is delayed due to rain. The umpires will wait UNTIL it stops raining. Which loop models this?",
    options: [
      { id: 'opt1', text: "for loop (running a fixed number of delay intervals)", isCorrect: false },
      { id: 'opt2', text: "while loop (running continuously as long as it's raining)", isCorrect: true },
      { id: 'opt3', text: "if-else statement (checking exactly once if rain stopped)", isCorrect: false },
      { id: 'opt4', text: "continue statement (skipping current rain delay check)", isCorrect: false }
    ]
  }
];

const CaseStudyOne = ({ onScoreUpdate, resetSignal, onBack, onComplete, onProceed, isCompleted }) => {
  const [currentBeat, setCurrentBeat] = useState(1);
  
  // Quiz states
  const [q1Answered, setQ1Answered] = useState(false);
  const [q1Selected, setQ1Selected] = useState(null);
  const [q2Answered, setQ2Answered] = useState(false);
  const [q2Selected, setQ2Selected] = useState(null);

  // Code Challenge states
  const [codeAnswers, setCodeAnswers] = useState({ loop1: '', loop2: '' });
  const [codeVerified, setCodeVerified] = useState(null);

  const [codeAnswers2, setCodeAnswers2] = useState({ flow1: '', flow2: '' });
  const [codeVerified2, setCodeVerified2] = useState(null);

  useEffect(() => {
    setCurrentBeat(1);
    setQ1Answered(false);
    setQ1Selected(null);
    setQ2Answered(false);
    setQ2Selected(null);
    setCodeAnswers({ loop1: '', loop2: '' });
    setCodeVerified(null);
    setCodeAnswers2({ flow1: '', flow2: '' });
    setCodeVerified2(null);
  }, [resetSignal]);

  const isNextDisabled = () => {
    if (currentBeat === TOTAL_BEATS) return true;
    if (currentBeat === 14 && !q1Answered) return true;
    if (currentBeat === 15 && !q2Answered) return true;
    if (currentBeat === 16 && !codeVerified) return true;
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
      codeAnswers.loop1.trim().toLowerCase() === 'for' && 
      codeAnswers.loop2.trim().toLowerCase() === 'while';
    setCodeVerified(isCorrect);
    onScoreUpdate('cs1_code', isCorrect ? 1 : 0);
  };

  const handleVerifyCode2 = () => {
    const isCorrect = 
      codeAnswers2.flow1.trim().toLowerCase() === 'while' && 
      codeAnswers2.flow2.trim() === '>';
    setCodeVerified2(isCorrect);
    onScoreUpdate('cs1_code2', isCorrect ? 1 : 0);
    if (isCorrect) {
      onComplete();
    }
  };

  // Determine active step based on current beat
  const getActiveStep = () => {
    if (currentBeat <= 4) return 1; // Story
    if (currentBeat <= 13) return 2; // Logic
    if (currentBeat <= 15) return 3; // Concept Check
    return 4; // Code Challenge
  };

  const currentStep = getActiveStep();

  // Jump to start beat of a step
  const handleStepClick = (stepId) => {
    // Basic progression logic (can only jump forward if previous is completed)
    const isStep2Allowed = currentBeat >= 4;
    const isStep3Allowed = currentBeat >= 13;
    const isStep4Allowed = q1Answered && q2Answered;

    if (stepId === 1) setCurrentBeat(1);
    else if (stepId === 2 && (isStep2Allowed || currentStep > 2)) setCurrentBeat(5);
    else if (stepId === 3 && (isStep3Allowed || currentStep > 3)) setCurrentBeat(14);
    else if (stepId === 4 && (isStep4Allowed || currentStep > 4)) setCurrentBeat(16);
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
            <h2 className="text-3xl font-bold text-blue-400">Case Study on Cricket Chase</h2>
            <p className="text-xl text-slate-300">The Cricket Chase: A T20 Final Over.</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">It's the final over of a thrilling T20 cricket match.</p>
            <p className="text-lg text-slate-300 leading-relaxed">The batting team needs exactly 15 runs to win.</p>
            <div className="bg-slate-800/60 border-l-4 border-emerald-500 p-4 rounded-r">
              <p className="text-emerald-400 italic">"The pressure is on. Every single action counts."</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">The bowler starts his run-up.</p>
            <p className="text-lg text-slate-300 leading-relaxed">He knows the rules of cricket: he must bowl exactly <strong>6 legal deliveries</strong> to complete this final over.</p>
            <p className="text-lg text-slate-300 leading-relaxed">He bowls the first ball. Then the second ball. Then the third ball. and so on...</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">Meanwhile, the batsmen are at the crease.</p>
            <p className="text-lg text-blue-300 leading-relaxed">They don't know exactly how many balls they will face.</p>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <p className="text-slate-300">They might hit three sixes and finish it in 3 balls.</p>
              <p className="text-slate-300 mt-2">Or they might take singles and need all 6 balls.</p>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed">They just know one thing: they must keep hitting the ball <strong>until they score 15 runs</strong>.</p>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-lg text-slate-300">Did you notice something common in the actions of the bowler and the batsmen?</p>
            <p className="text-lg text-slate-300">They both did one common thing: <span className="italic text-yellow-400">repeating the same action again and again.</span></p>
            
            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-6">
              <p className="text-yellow-400 font-bold">This is what iteration is!</p>
            </div>

            <p className="text-slate-300"><strong>Iteration (Loops):</strong> Just like playing ball after ball in a cricket over, a program repeats actions until a goal is met. Every loop has three parts:</p>
            
            <ul className="list-disc pl-5 text-slate-300 space-y-3 mt-6">
              <li><strong>Condition (The Target):</strong> <em>Stop when 6 balls are bowled, or when 15 runs are scored.</em></li>
              <li><strong>Repeated Action (The Play):</strong> <em>The bowler bowls a ball, the batsman hits it.</em></li>
              <li><strong>Update Step (The Scoreboard):</strong> <em>Ball count increases, or runs are added.</em></li>
            </ul>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">The Cricket Loop: Bowler</h2>
            <div className="bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r my-4 shadow-lg shadow-blue-500/10 space-y-4">
              <p className="text-lg text-slate-300">The bowler has a very clear set of rules.</p>
              <p className="text-lg text-slate-300">His <strong>repeated action</strong> is running up to the crease and bowling a delivery.</p>
              <p className="text-lg text-slate-300">His <strong>condition</strong> is to repeat this exactly until 6 legal deliveries are completed.</p>
              <div className="bg-slate-800/50 p-4 mt-2 rounded-lg border border-slate-700/50">
                <p className="text-lg text-blue-200">Because the number of repetitions is fixed (6 times), this perfectly models a loop where we know exactly how many times it will run beforehand.</p>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">The Cricket Loop: Batsmen</h2>
            <div className="bg-emerald-900/20 border-l-4 border-emerald-500 p-6 rounded-r my-4 shadow-lg shadow-emerald-500/10 space-y-4">
              <p className="text-lg text-slate-300">The batsmen face a completely different challenge.</p>
              <p className="text-lg text-slate-300">Their <strong>repeated action</strong> is hitting the ball and trying to score runs.</p>
              <p className="text-lg text-slate-300">However, their <strong>condition</strong> is dynamic: they must keep playing <em>until</em> they score 15 runs.</p>
              <p className="text-lg text-slate-300">They do not know how many balls (repetitions) it will take.</p>
              <div className="bg-slate-800/50 p-4 mt-2 rounded-lg border border-slate-700/50">
                <p className="text-lg text-emerald-200">This perfectly models a loop that depends purely on a changing condition, rather than a fixed count.</p>
              </div>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Types of Loops</h2>
            <p className="text-lg text-slate-300 mb-4">Iteration is used in two types of scenarios:</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-3 mb-8">
              <li><strong>Scenario 1:</strong> When number of repetition is <strong>known</strong> beforehand (Like the bowler bowling exactly 6 balls).</li>
              <li><strong>Scenario 2:</strong> When number of repetition is <strong>unknown</strong> beforehand (Like batsmen chasing 15 runs).</li>
            </ul>

            <p className="text-lg text-slate-300 mb-4">These two scenarios are handled by two different types of loop:</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-3">
              <li><strong>for loop:</strong> used when number of repetition is <em>known</em>.</li>
              <li><strong>while loop:</strong> used when number of repetition is <em>unknown</em>.</li>
            </ul>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">For loop</h2>
            <p className="text-lg text-slate-300 mb-4">Let's learn for loop by example of the bowler.</p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <p className="text-slate-300 font-bold mb-4">In the bowler's case:</p>
              <ul className="list-disc pl-5 text-slate-300 space-y-3">
                <li><strong>Repeated Action:</strong> Bowling a delivery.</li>
                <li><strong>Condition:</strong> Till 6 balls are bowled.</li>
                <li><strong>Update Step:</strong> Going to the next ball.</li>
                <li><strong>Number of Repetition:</strong> Known beforehand (6 times).</li>
              </ul>
            </div>
            <p className="text-lg text-slate-300 mt-6">The bowler knew beforehand that he has to repeat the action 6 times. So the bowler's action is an example of a <strong>for</strong> loop.</p>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">While loop</h2>
            <p className="text-lg text-slate-300 mb-4">Let's learn while loop by example of the batsmen.</p>
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <p className="text-slate-300 font-bold mb-4">In the batsmen's case:</p>
              <ul className="list-disc pl-5 text-slate-300 space-y-3">
                <li><strong>Repeated Action:</strong> Hitting the ball.</li>
                <li><strong>Condition:</strong> Till 15 runs are scored.</li>
                <li><strong>Update Step:</strong> Adding runs to the total score.</li>
                <li><strong>Number of Repetition:</strong> Not known beforehand.</li>
              </ul>
            </div>
            <p className="text-lg text-slate-300 mt-6">The batsmen did not know beforehand how many times they have to hit. So the batsmen's chase is an example of a <strong>while</strong> loop.</p>
          </div>
        );
      case 11:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Let's code for loop</h2>
            <p className="text-lg text-slate-300 mb-6">Let's code the bowler bowling an over using for loop.</p>
            <div className="space-y-3 text-slate-300 mb-8">
              <p>1. <strong>What keeps the iteration continuing (condition):</strong> till 6 balls are bowled</p>
              <p>2. <strong>What is the repeated action:</strong> bowling a delivery</p>
              <p>3. <strong>What changes each round:</strong> ball count increases</p>
            </div>
            <p className="text-slate-300 font-bold mb-4">Python code:</p>
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 font-mono text-sm text-slate-300 shadow-inner">
              <p><span className="text-blue-400">for</span> ball_number <span className="text-blue-400">in</span> range(1, 7): <span className="text-slate-500"># repeats 6 times</span></p>
              <p className="pl-8">bowl_delivery() <span className="text-slate-500"># repeated action</span></p>
            </div>
          </div>
        );
      case 12:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Let's code while loop</h2>
            <p className="text-lg text-slate-300 mb-6">Let's code the batsmen chasing a target using while loop.</p>
            <div className="space-y-3 text-slate-300 mb-8">
              <p>1. <strong>What need to be tracked:</strong> total runs scored</p>
              <p>2. <strong>What keeps the iteration continuing:</strong> till runs &lt; 15</p>
              <p>3. <strong>What is the repeated action:</strong> hitting the ball</p>
            </div>
            <p className="text-slate-300 font-bold mb-4">Python code:</p>
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-slate-700 font-mono text-sm text-slate-300 shadow-inner">
              <p>runs_scored = 0 <span className="text-slate-500"># starting state</span></p>
              <p><span className="text-blue-400">while</span> runs_scored &lt; 15: <span className="text-slate-500"># condition</span></p>
              <p className="pl-8">runs_scored += hit_ball() <span className="text-slate-500"># repeated action & update</span></p>
            </div>
          </div>
        );
      case 13:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Summary</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              <strong>Iteration:</strong> Repeating certain actions again and again, for a fixed number of times, or as long as a condition is true.
            </p>
            <p className="text-slate-300 font-bold mb-4">Types of loop construct:</p>
            <ul className="list-disc pl-5 text-slate-300 space-y-4">
              <li><strong>for loop:</strong> used when the iteration has to be repeated for fixed number of times.</li>
              <li><strong>while loop:</strong> used when the iteration has to be repeated as long as a condition is true (i.e. number of iteration is not fixed).</li>
            </ul>
          </div>
        );
      case 14:
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
                        onScoreUpdate('cs1_q1', 1);
                      }
                    }}
                    className={btnClass}
                  >
                    {opt.text}
                  </button>
                )
              })}
            </div>
            {q1Answered && <p className="text-emerald-400 font-bold mt-4 flex items-center gap-2"><CheckCircle size={20}/> Correct! Click Next.</p>}
          </div>
        );
      case 15:
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
                        onScoreUpdate('cs1_q2', 1);
                      }
                    }}
                    className={btnClass}
                  >
                    {opt.text}
                  </button>
                )
              })}
            </div>
            {q2Answered && <p className="text-emerald-400 font-bold mt-4 flex items-center gap-2"><CheckCircle size={20}/> Correct! Click Next.</p>}
          </div>
        );
      case 16:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Code Challenge 🔓</h2>
            <p className="text-slate-300 mb-8">Fill in the blanks to complete the cricket simulation using what you've learned.</p>
            
            <div className="bg-[#0a0f1c] rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">cricket_match.py</span>
              </div>
              <div className="p-6 font-mono text-slate-300 leading-loose">
                <span className="text-slate-500"># Task 1: Complete the 6-ball over loop</span><br />
                <input 
                  type="text" 
                  value={codeAnswers.loop1}
                  onChange={e => setCodeAnswers({...codeAnswers, loop1: e.target.value})}
                  className="bg-slate-900 text-emerald-400 px-2 py-1 rounded border-b-2 border-emerald-500 focus:outline-none w-16 text-center mx-1 font-bold" 
                  disabled={codeVerified}
                />
                <span className="text-blue-400"> ball in range</span>(1, 7):<br />
                {'    '}<span className="text-blue-400">print</span>("Bowling ball #", ball)<br /><br />
                
                <span className="text-slate-500"># Task 2: Chase 15 runs target</span><br />
                runs = 0<br />
                <input 
                  type="text" 
                  value={codeAnswers.loop2}
                  onChange={e => setCodeAnswers({...codeAnswers, loop2: e.target.value})}
                  className="bg-slate-900 text-emerald-400 px-2 py-1 rounded border-b-2 border-emerald-500 focus:outline-none w-16 text-center mx-1 font-bold" 
                  disabled={codeVerified}
                />
                <span className="text-blue-400"> runs</span> &lt; 15:<br />
                {'    '}runs += 4
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
      case 17:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Mid-Level Challenge 🧑‍💻</h2>
            <p className="text-slate-300 mb-8">Now you are the umpire. You need to count how many balls are left in the over. You start at 6 and keep going as long as there are balls remaining.</p>
            
            <div className="bg-[#0a0f1c] rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center gap-2">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">umpire.py</span>
              </div>
              <div className="p-6 font-mono text-slate-300 leading-loose">
                balls_left = 6<br /><br />
                <span className="text-slate-500"># Keep checking as long as balls_left is greater than 0</span><br />
                <input 
                  type="text" 
                  value={codeAnswers2.flow1}
                  onChange={e => setCodeAnswers2({...codeAnswers2, flow1: e.target.value})}
                  className="bg-slate-900 text-emerald-400 px-2 py-1 rounded border-b-2 border-emerald-500 focus:outline-none w-16 text-center mx-1 font-bold" 
                  disabled={codeVerified2}
                />
                <span className="text-blue-400"> balls_left</span> <input 
                  type="text" 
                  value={codeAnswers2.flow2}
                  onChange={e => setCodeAnswers2({...codeAnswers2, flow2: e.target.value})}
                  className="bg-slate-900 text-emerald-400 px-2 py-1 rounded border-b-2 border-emerald-500 focus:outline-none w-10 text-center mx-1 font-bold" 
                  disabled={codeVerified2}
                /> 0:<br />
                {'    '}<span className="text-blue-400">print</span>(balls_left, "balls remaining")<br />
                {'    '}balls_left -= 1
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              {!codeVerified2 && (
                <button 
                  onClick={handleVerifyCode2}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20"
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

            {codeVerified2 && isCompleted && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-8 border-t border-slate-700/50 pt-8">
                <p className="text-xl font-bold text-emerald-400 mb-6">🎉 Incredible! Case Study 1 Complete!</p>
                <button onClick={onProceed} className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold w-full hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20">
                  Return to Home 🏠
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
    if (currentBeat <= 4) return "The Cricket Chase";
    if (currentBeat === 5) return "Concept of Iteration";
    if (currentBeat === 6) return "The Bowler's Loop";
    if (currentBeat === 7) return "The Batsmen's Loop";
    if (currentBeat === 8) return "Variety of Loops";
    if (currentBeat === 9) return "Example of for loop";
    if (currentBeat === 10) return "Example of while loop";
    if (currentBeat === 11) return "Let's code for loop";
    if (currentBeat === 12) return "Let's code while loop";
    if (currentBeat === 13) return "In a Nutshell";
    if (currentBeat >= 14 && currentBeat <= 15) return "Concept Checks";
    if (currentBeat >= 16) return "Code Challenges";
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
              {(currentBeat <= 4 || currentBeat >= 14) && (
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 mb-8 max-w-sm w-full opacity-80">
                  <img src="/cricket_story.jpg" alt="Cricket Match" className="w-full h-auto object-cover" />
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-extrabold text-blue-400 text-center tracking-tight drop-shadow-md">
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

export default CaseStudyOne;
