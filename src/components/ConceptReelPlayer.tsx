import { useState, useEffect, useRef } from 'react';
import { CONCEPT_REELS, CodeReel, ReelStep } from '../utils/conceptReels';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Cpu, Terminal, Sparkles, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConceptReelPlayerProps {
  concept: string;
  scenario: string;
}

export default function ConceptReelPlayer({ concept, scenario }: ConceptReelPlayerProps) {
  // Map user scenario IDs to reel group keys ('story', 'economic', 'gaming')
  const getReelGroup = (scen: string): string => {
    const s = scen.toLowerCase();
    if (s === 'books' || s === 'story' || s === 'history') return 'story';
    if (s === 'business' || s === 'economic' || s === 'civics') return 'economic';
    return 'gaming'; // default or fallback
  };

  const reelGroup = getReelGroup(scenario);
  const matchedReel: CodeReel | undefined = CONCEPT_REELS[concept]?.[reelGroup];

  // If there's no exact match, let's create a generic fallback reel for other concepts so the feature is always active!
  const getFallbackReel = (activeConcept: string): CodeReel => {
    if (activeConcept.includes('Functions')) {
      return {
        id: 'reel_func_fallback',
        title: 'Function Assembly & Spellcasting',
        concept: activeConcept,
        codeLines: [
          '# Define a custom reusable calculation function',
          'def calculate_power(level, gear_bonus):',
          '    base = level * 10',
          '    return base + gear_bonus',
          '',
          '# Execute (call) the function and print outcome',
          'strike_force = calculate_power(5, 12)',
          'print("Total damage force:", strike_force)'
        ],
        steps: [
          {
            lineIndex: 0,
            narration: "Functions allow us to pack lines of code into a single, reusable action box.",
            variables: {},
            output: []
          },
          {
            lineIndex: 1,
            narration: "We define a function named 'calculate_power' using the 'def' keyword. It accepts two parameters: 'level' and 'gear_bonus'. This line merely sets up the recipe; it doesn't run it yet!",
            variables: {},
            output: []
          },
          {
            lineIndex: 2,
            narration: "Inside the function body (which is indented), we calculate 'base' by multiplying the passed level by 10.",
            variables: {},
            output: []
          },
          {
            lineIndex: 3,
            narration: "We return the sum of base and the gear bonus. This is the output that shoots out of our function box.",
            variables: {},
            output: []
          },
          {
            lineIndex: 5,
            narration: "Python skips empty lines and continues.",
            variables: {},
            output: []
          },
          {
            lineIndex: 6,
            narration: "Now we Call (execute) our function! We pass in 5 for 'level' and 12 for 'gear_bonus'. Python runs the internal code lines, receives '62' back, and stores it in 'strike_force'.",
            variables: { level: 5, gear_bonus: 12, base: 50, strike_force: 62 },
            output: []
          },
          {
            lineIndex: 7,
            narration: "We print the variable 'strike_force' containing our returned function result. Mission successful!",
            variables: { level: 5, gear_bonus: 12, base: 50, strike_force: 62 },
            output: ["Total damage force: 62"]
          }
        ]
      };
    }

    // Default general fallback
    return {
      id: 'reel_default_fallback',
      title: 'Python Statements Execution Pipeline',
      concept: activeConcept,
      codeLines: [
        '# Let\'s examine sequential execution',
        'items_count = 100',
        'added_bonus = 25',
        'total_amount = items_count + added_bonus',
        'print("Grand Total:", total_amount)'
      ],
      steps: [
        {
          lineIndex: 0,
          narration: "Python reads and executes your script starting from the very top line and progressing downward.",
          variables: {},
          output: []
        },
        {
          lineIndex: 1,
          narration: "We create a variable named 'items_count' and initialize its value to 100.",
          variables: { items_count: 100 },
          output: []
        },
        {
          lineIndex: 2,
          narration: "We store 25 in another variable called 'added_bonus'.",
          variables: { items_count: 100, added_bonus: 25 },
          output: []
        },
        {
          lineIndex: 3,
          narration: "We compute the sum of items_count and added_bonus, and write the resulting 125 to total_amount.",
          variables: { items_count: 100, added_bonus: 25, total_amount: 125 },
          output: []
        },
        {
          lineIndex: 4,
          narration: "Finally, the output is pushed to the user terminal console via print()!",
          variables: { items_count: 100, added_bonus: 25, total_amount: 125 },
          output: ["Grand Total: 125"]
        }
      ]
    };
  };

  const activeReel = matchedReel || getFallbackReel(concept);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5); // seconds per step
  const [activeView, setActiveView] = useState<'simulator' | 'flowchart'>('simulator');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flowchartImg = new URL('../assets/images/if_else_flowchart_1783328493937.jpg', import.meta.url).href;

  const currentStep: ReelStep = activeReel.steps[currentStepIndex] || activeReel.steps[0];

  useEffect(() => {
    // Reset player on concept change
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setActiveView('simulator');
  }, [concept, scenario]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= activeReel.steps.length - 1) {
            setIsPlaying(false);
            return prev; // End of reel
          }
          return prev + 1;
        });
      }, playbackSpeed * 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, activeReel]);

  const handlePlayPause = () => {
    if (currentStepIndex >= activeReel.steps.length - 1) {
      setCurrentStepIndex(0); // auto replay if reached end
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < activeReel.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl border border-slate-800/80 overflow-hidden" id="concept-reel-player">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 bg-indigo-950/80 text-indigo-300 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border border-indigo-500/20">
            <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
            <span>Interactive Concept Short Reel</span>
          </span>
          <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
            <span>🎥 {activeReel.title}</span>
          </h3>
        </div>

        {/* Speed Controls */}
        {activeView === 'simulator' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase">
              <Sliders className="h-3 w-3" /> Playback Speed:
            </span>
            {[2.5, 1.5, 0.8].map((speed) => {
              const label = speed === 2.5 ? 'Slow' : speed === 1.5 ? '1.0x' : 'Fast';
              const isActive = playbackSpeed === speed;
              return (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 rounded text-[9px] font-black uppercase transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {concept === 'Conditions (if-else)' && (
        <div className="flex bg-slate-950/65 p-1 rounded-2xl border border-slate-800/60 self-start mb-5 max-w-xs shadow-inner">
          <button
            onClick={() => { setActiveView('simulator'); setIsPlaying(false); }}
            className={`flex-1 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeView === 'simulator'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎥 Play Short
          </button>
          <button
            onClick={() => { setActiveView('flowchart'); setIsPlaying(false); }}
            className={`flex-1 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeView === 'flowchart'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Flowchart
          </button>
        </div>
      )}

      {activeView === 'simulator' ? (
        <>
          {/* Main Player Display Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Left Column: Visual Highlight Code Editor screen */}
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-850 flex flex-col justify-between font-mono text-xs relative min-h-[220px]">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] text-slate-500 bg-slate-900/60 px-2 py-0.5 rounded-full border border-slate-800">
                <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{isPlaying ? 'PLAYING REEL' : 'PAUSED'}</span>
              </div>

              <div className="space-y-1 select-none overflow-y-auto max-h-[190px] pr-2">
                {activeReel.codeLines.map((line, idx) => {
                  const isHighlighted = idx === currentStep.lineIndex;
                  return (
                    <div
                      key={idx}
                      className={`relative flex items-start gap-4 py-0.5 px-2 rounded-lg transition-all duration-150 ${
                        isHighlighted
                          ? 'bg-yellow-500/15 border-l-4 border-yellow-500 text-yellow-200'
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-600 w-4 text-right select-none">
                        {idx + 1}
                      </span>
                      <span className={`whitespace-pre-wrap ${isHighlighted ? 'font-bold' : ''}`}>
                        {line}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Captions / Text Narration subtitiles */}
              <div className="mt-4 pt-3 border-t border-slate-900 text-[11px] leading-relaxed text-indigo-200 bg-indigo-950/20 px-3.5 py-3 rounded-xl border border-indigo-500/10 min-h-[60px] flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <p className="font-semibold">{currentStep.narration}</p>
              </div>
            </div>

            {/* Right Column: Dynamic System Monitor (CPU Memory & Console Output) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Top Half: Virtual Memory / Variable Monitor */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 flex-1 flex flex-col">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                  <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Variables (CPU Memory)</span>
                </h4>

                <div className="flex-1 overflow-y-auto max-h-[110px] space-y-1.5 pr-1">
                  {Object.keys(currentStep.variables).length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-600 text-[10px] italic">
                      No active variables allocated yet
                    </div>
                  ) : (
                    Object.entries(currentStep.variables).map(([name, val]) => (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={name}
                        className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5"
                      >
                        <span className="text-[11px] font-mono font-bold text-emerald-400">
                          {name}
                        </span>
                        <span className="text-[10px] font-mono bg-indigo-950/40 border border-indigo-900 px-2 py-0.5 rounded text-indigo-300 font-extrabold truncate max-w-[120px]">
                          {String(val)}
                        </span>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom Half: Live Simulated Console Output */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 flex-1 flex flex-col">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Simulated Console Output</span>
                </h4>

                <div className="flex-1 bg-black/40 border border-slate-900 rounded-lg p-2.5 font-mono text-[10px] text-amber-300 overflow-y-auto max-h-[110px] min-h-[70px]">
                  {currentStep.output.length === 0 ? (
                    <span className="text-slate-600 italic">Console idle... waiting for print()</span>
                  ) : (
                    currentStep.output.map((line, idx) => (
                      <div key={idx} className="leading-relaxed font-semibold">
                        &gt; {line}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Step Indicator Slider */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                Frame: {currentStepIndex + 1}/{activeReel.steps.length}
              </span>
              <div className="relative flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200"
                  style={{ width: `${((currentStepIndex + 1) / activeReel.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Button Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                title="Restart Reel"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition disabled:opacity-30 cursor-pointer"
                title="Previous Frame"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handlePlayPause}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 font-black text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Play Short</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIndex === activeReel.steps.length - 1}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition disabled:opacity-30 cursor-pointer"
                title="Next Frame"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Flowchart Visual Guide view */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[300px]" id="flowchart-guide">
          {/* Left Column: Flowchart Image Box */}
          <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-4 border border-slate-850 flex flex-col justify-center items-center relative overflow-hidden">
            <span className="absolute top-2 left-2 bg-indigo-950/80 text-indigo-300 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border border-indigo-500/20">
              Visual Decision-Tree
            </span>
            <img
              src={flowchartImg}
              alt="If-Else Decision Flowchart"
              className="max-h-[260px] object-contain rounded-xl shadow-xl border border-slate-800/80 hover:scale-102 transition duration-200"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right Column: Narrative explanation step-by-step */}
          <div className="lg:col-span-6 bg-slate-950/40 rounded-2xl p-5 border border-slate-850 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-indigo-300">
                  <span>🚦</span> The Basics: What is If-Else?
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Normally, programs run line-by-line from top to bottom. But sometimes, we want our program to make <strong>decisions</strong> dynamically based on facts! 
                  <br /><br />
                  An <code>if</code> statement evaluates a comparison expression (e.g., <code>score &gt;= 10</code>). If it evaluates to <strong>True</strong>, the computer executes the block directly study-indented underneath it. If it is <strong>False</strong>, the <code>else</code> backup block runs instead.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60">
                <h4 className="text-xs font-black text-white flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-indigo-300">
                  <span>⚡</span> Why We Use It Here
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {scenario === 'books' || scenario === 'story' || scenario === 'history' ? (
                    <span>
                      In our <strong>Story & History Modes</strong>, we use <code>if-else</code> to let your code branch dialogue choices! If the player answers the Sphinx correctly, they win; otherwise, the boss strike is triggered. This models choice-based narrative logic.
                    </span>
                  ) : scenario === 'business' || scenario === 'economic' || scenario === 'civics' ? (
                    <span>
                      In our <strong>Economic & Civic simulations</strong>, <code>if-else</code> is how we automatically enforce legislative check and balance rules. We check if votes cross thresholds to pass constitutional bills, or if net imports warrant tariff additions.
                    </span>
                  ) : (
                    <span>
                      In our <strong>Gaming Modes</strong>, <code>if-else</code> checks combat conditions and inventory items. We check if the player has enough mana points or a special scroll in their inventory to cast spells or complete zombie defense blocks!
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Flow Diagram Ready</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
