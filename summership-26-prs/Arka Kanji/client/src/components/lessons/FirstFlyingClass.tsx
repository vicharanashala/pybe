import { useState, useRef, useEffect } from 'react';
import { LessonLayout } from '../LessonLayout';
import { CodeViewer } from '../CodeViewer';
import { RotateCcw, Crosshair, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function FirstFlyingClass({ onComplete, isLastLesson }: { onComplete: () => void, isLastLesson: boolean }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSize, setCurrentSize] = useState(60);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [activeLines, setActiveLines] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const requestRef = useRef<number>();
  const sizeRef = useRef(60);
  const directionRef = useRef(1);
  const lastTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (lastTimeRef.current != null) {
      const deltaTime = time - lastTimeRef.current;
      sizeRef.current += directionRef.current * (220 * (deltaTime / 1000));
      
      if (sizeRef.current >= 300) {
        sizeRef.current = 300;
        directionRef.current = -1;
      } else if (sizeRef.current <= 60) {
        sizeRef.current = 60;
        directionRef.current = 1;
      }
      setCurrentSize(sizeRef.current);
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying]);

  const handleUpClick = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
    
    // Target center is 200px
    const distance = Math.abs(sizeRef.current - 200);
    
    // 0 distance = 100%. 15 distance = 85%.
    let acc = Math.round(100 - distance);
    if (acc < 0) acc = 0;
    if (acc > 100) acc = 100;
    
    setAccuracy(acc);
  };

  const handleRetry = () => {
    setAccuracy(null);
    setIsPlaying(true);
  };

  const code = [
    { text: '# Ternary Operator: value_if_true if condition else value_if_false', indent: 0 },
    { text: `timing_accuracy = ${accuracy !== null ? accuracy : '??'}`, indent: 0 },
    { text: '', indent: 0 },
    { text: 'broom_status = "In Hand!" if timing_accuracy >= 85 else "Hit your nose!"', indent: 0 },
    { text: 'print(f"Result: {broom_status}")', indent: 0 },
  ];

  const handleRevealCode = () => {
    const runAnimation = () => {
      setActiveLines([1]);
      timeoutRef.current = window.setTimeout(() => {
        setActiveLines([3]);
        timeoutRef.current = window.setTimeout(() => {
          setActiveLines([4]);
          timeoutRef.current = window.setTimeout(() => {
            setActiveLines([]);
            timeoutRef.current = window.setTimeout(runAnimation, 1500);
          }, 800);
        }, 600);
      }, 600);
    };
    runAnimation();
  };

  const conceptExplanation = (
    <p>
      The Ternary operator is a clean, one-line shorthand for assigning a value based on a simple condition. It reads exactly like English: <code>[value_if_true] if [condition] else [value_if_false]</code>. It's a faster, more elegant way to write a basic <code>if/else</code> statement when setting a variable.
    </p>
  );
  
  const isCorrect = accuracy !== null && accuracy >= 85;

  const interaction = (
    <div className="flex flex-col items-center justify-center h-full p-4 w-full">
      <div className="relative w-full max-w-sm h-80 bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm flex flex-col items-center justify-center p-6 mb-8">
        
        {/* Target Donut/Ring */}
        <div className="absolute border-[20px] border-amber-200/50 rounded-full w-[220px] h-[220px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute border-2 border-amber-300/60 rounded-full w-[220px] h-[220px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute border-2 border-amber-300/60 rounded-full w-[180px] h-[180px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="absolute text-amber-900/40 font-bold tracking-widest uppercase text-xs top-4">Sweet Spot</div>
        
        {/* Focus Circle */}
        <div 
          className="absolute border-4 border-blue-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-none shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          style={{ width: `${currentSize}px`, height: `${currentSize}px` }}
        ></div>

        <AnimatePresence>
          {accuracy !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-10 backdrop-blur-sm"
            >
              <div className="text-4xl font-black mb-2 text-stone-900">{accuracy}%</div>
              <div className="text-stone-500 font-medium text-sm mb-6 uppercase tracking-wider">Accuracy</div>
              
              {isCorrect && (
                <motion.div
                  initial={{ y: 150, rotate: 15, opacity: 0 }}
                  animate={{ y: 0, rotate: -5, opacity: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                  className="flex flex-col items-center mb-6"
                >
                  <Wind className="w-6 h-6 text-stone-400 mb-2 opacity-50 absolute -left-4 -top-4" />
                  <div className="w-32 h-3 bg-amber-700 rounded-full shadow-lg relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-6 bg-amber-900 rounded-l-full rounded-r-sm"></div>
                  </div>
                </motion.div>
              )}

              <div className={`text-2xl font-black mb-8 px-6 py-2 rounded-xl border ${
                isCorrect ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {isCorrect ? 'In Hand!' : 'Hit your nose!'}
              </div>
              
              {!isCorrect && (
                <button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleUpClick}
        disabled={!isPlaying}
        className={`px-12 py-5 rounded-2xl font-black text-2xl transition-all shadow-lg flex items-center gap-3 cursor-pointer ${
          isPlaying 
            ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 shadow-blue-500/20 active:scale-95' 
            : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed shadow-none'
        }`}
      >
        <Crosshair className="w-6 h-6" />
        "UP!"
      </button>

      <div className="mt-6 text-stone-500 font-medium text-sm text-center max-w-xs">
        <p>Shout "UP!" when the blue circle is exactly inside the golden ring.</p>
      </div>
    </div>
  );

  return (
    <LessonLayout
      title="First Flying Class"
      narrative={<p>You are standing on the training grounds with Madam Hooch. You must yell "UP!" at the exact right moment to catch your broom without it hitting you in the face. A conditional expression (ternary operator) lets you write a quick <code>if/else</code> on a single line based on your accuracy!</p>}
      instruction={<p>Click "UP!" when the blue ring perfectly overlaps the golden sweet spot ring to catch your broom.</p>}
      interactionArea={interaction}
      codeArea={<CodeViewer code={code} activeLineIndices={activeLines} />}
      showSuccess={isCorrect}
      successMessage="Result: In Hand! Excellent timing. You've mastered the ternary operator!"
      onComplete={onComplete}
      isLastLesson={isLastLesson}
      onRevealCode={handleRevealCode}
      conceptExplanation={conceptExplanation}
    />
  );
}
