import React, { useState } from 'react';
import { CODING_CHALLENGES } from '../data/challengesData';
import { executePythonCode } from '../utils/pythonRunner';
import { Play, CheckCircle2, AlertCircle, HelpCircle, Code2, Award, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function PythonSandbox() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [codeState, setCodeState] = useState(
    CODING_CHALLENGES.reduce((acc, ch) => ({ ...acc, [ch.id]: ch.initialCode }), {})
  );
  const [outputs, setOutputs] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [passedChallenges, setPassedChallenges] = useState([]);

  const currentChallenge = CODING_CHALLENGES[activeChallengeIdx];
  const currentCode = codeState[currentChallenge.id] || currentChallenge.initialCode;
  const currentOutput = outputs[currentChallenge.id];

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCodeState(prev => ({ ...prev, [currentChallenge.id]: val }));
  };

  const handleRunCode = () => {
    soundFx.playClick();
    const res = executePythonCode(currentCode, currentChallenge.testType);
    setOutputs(prev => ({ ...prev, [currentChallenge.id]: res }));

    if (res.isPassed) {
      soundFx.playSuccess();
      if (!passedChallenges.includes(currentChallenge.id)) {
        const nextPassed = [...passedChallenges, currentChallenge.id];
        setPassedChallenges(nextPassed);
        if (nextPassed.length === CODING_CHALLENGES.length) {
          soundFx.playFanfare();
          try {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
          } catch (e) {
            // confetti fallback
          }
        }
      }
    } else {
      soundFx.playWarning();
    }
  };

  return (
    <div className="space-y-6 bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 lg:p-8 shadow-2xl">
      
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-600 text-black rounded-2xl shadow-lg shadow-amber-500/20 font-bold">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-amber-200">Python Loop Coding Laboratory</h3>
            <p className="text-xs text-stone-400">Write Python loop code to solve story challenges in real time!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-800/40">
            {passedChallenges.length} / {CODING_CHALLENGES.length} Completed
          </span>
        </div>
      </div>

      {/* Challenge Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CODING_CHALLENGES.map((ch, idx) => {
          const isPassed = passedChallenges.includes(ch.id);
          const isActive = idx === activeChallengeIdx;

          return (
            <button
              key={ch.id}
              onClick={() => {
                soundFx.playClick();
                setActiveChallengeIdx(idx);
                setShowHint(false);
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                  : isPassed
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-amber-300'
              }`}
            >
              <span>Task #{idx + 1}</span>
              {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Challenge Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Code Editor */}
        <div className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 mb-3 space-y-1">
              <h4 className="font-extrabold text-amber-300 text-base">{currentChallenge.title}</h4>
              <p className="text-stone-300 text-xs leading-relaxed">{currentChallenge.description}</p>
            </div>

            <div className="relative rounded-2xl border border-amber-500/30 overflow-hidden bg-[#121110] shadow-2xl">
              <div className="bg-stone-950 px-4 py-2 border-b border-stone-800 flex items-center justify-between font-mono text-xs text-stone-400">
                <span>main.py</span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              </div>

              {showHint && (
                <div className="bg-amber-950/40 p-3 border-b border-amber-800/40 text-amber-200 text-xs font-mono">
                  💡 {currentChallenge.hint}
                </div>
              )}

              <textarea
                value={currentCode}
                onChange={handleCodeChange}
                rows={12}
                spellCheck={false}
                className="w-full bg-[#121110] text-amber-300 font-mono text-xs sm:text-sm p-4 focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunCode}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transform transition hover:scale-105"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Run Python Code</span>
            </button>
          </div>
        </div>

        {/* Right: Execution Output & Tests */}
        <div className="space-y-4">
          <div className="bg-stone-950 rounded-2xl border border-stone-800 p-4 h-full flex flex-col justify-between space-y-4 shadow-inner">
            <div>
              <div className="font-mono text-xs text-stone-400 border-b border-stone-800 pb-2 mb-3 flex items-center justify-between">
                <span>TERMINAL STDOUT</span>
                {currentOutput?.isPassed && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> TEST PASSED
                  </span>
                )}
              </div>

              {!currentOutput ? (
                <div className="text-stone-600 font-mono text-xs italic py-8 text-center">
                  Press "Run Python Code" to execute and see stdout results...
                </div>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-[#121110] p-4 rounded-xl border border-stone-800 space-y-1 text-stone-200 overflow-y-auto max-h-56">
                    {currentOutput.stdout.map((line, i) => (
                      <div key={i} className="text-emerald-300">
                        &gt; {line}
                      </div>
                    ))}
                  </div>

                  {currentOutput.errors.length > 0 && (
                    <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-800/40 text-rose-300 space-y-1">
                      {currentOutput.errors.map((err, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hint Box */}
            <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-800/30 text-xs text-amber-200 space-y-1">
              <span className="font-bold text-amber-400">Concept Highlight:</span>
              <p className="text-stone-300 leading-relaxed">
                Python loops replace repetitive logic with clean, automated statements!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* FINAL TROPHY BANNER WHEN ALL 6 COMPLETED */}
      {passedChallenges.length === CODING_CHALLENGES.length && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-8 rounded-3xl text-black text-center space-y-4 shadow-2xl transform animate-fade-in mt-8">
          <div className="w-20 h-20 rounded-full bg-black text-amber-400 flex items-center justify-center text-4xl mx-auto shadow-2xl">
            👑
          </div>
          <h2 className="font-extrabold text-3xl tracking-tight">🐍 LOOP MASTER UNLOCKED!</h2>
          <div className="text-base font-medium max-w-xl mx-auto space-y-2">
            <p>"Today we didn't learn loops from a textbook." — Lakshmi</p>
            <p>"We discovered them by repeating the same kind of problem!" — Vikram</p>
            <p>"And by eating samosas!" — Rahul 😂</p>
          </div>
          <div className="font-mono text-sm font-bold bg-black/20 text-stone-900 inline-block px-6 py-2 rounded-full">
            You didn't memorize loops. You discovered why they exist.
          </div>
        </div>
      )}

    </div>
  );
}
