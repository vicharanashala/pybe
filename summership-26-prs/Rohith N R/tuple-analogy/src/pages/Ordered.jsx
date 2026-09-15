import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, RefreshCw, RotateCcw, ShieldCheck, X, Check, Play, ChevronRight } from 'lucide-react';
import { useTour } from '../context/TourContext';
// import PythonTerminal from '../components/CodeSnippetActivity';
import Quiz from '../components/Quiz';
// import { TERMINAL_DATA } from '../data/snippets';
import CodeSnippetActivity from '../components/CodeSnippetActivity';
import { SNIPPET_DATA } from '../data/snippets';
import { QUIZ_DATA } from '../data/quiz';
import { useNavigate } from 'react-router-dom';

const JAM = {
  red:   { fill: '#ef4444', dark: '#b91c1c', highlight: '#fca5a5' },
  green: { fill: '#22c55e', dark: '#15803d', highlight: '#86efac' },
  blue:  { fill: '#3b82f6', dark: '#1d4ed8', highlight: '#93c5fd' },
  yellow:{ fill: '#eab308', dark: '#a16207', highlight: '#fde68a' },
  pink:  { fill: '#ec4899', dark: '#be185d', highlight: '#f9a8d4' },
};
const JAM_KEYS = Object.keys(JAM);

function scallopedPath(cx, cy, rOuter, rInner, points) {
  let d = '';
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d + 'Z';
}

function Biscuit({ jam = 'red', size = 80 }) {
  const c = JAM[jam];
  const outer = scallopedPath(50, 50, 47, 40, 18);
  const dots = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const x = 50 + 32 * Math.cos(angle);
    const y = 50 + 32 * Math.sin(angle);
    return <circle key={i} cx={x} cy={y} r={2.2} fill="#c9812f" opacity={0.55} />;
  });
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.25))' }}>
      <defs>
        <radialGradient id={`crust-${jam}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fde9b8" />
          <stop offset="55%" stopColor="#eab35c" />
          <stop offset="100%" stopColor="#c9812f" />
        </radialGradient>
        <radialGradient id={`jam-${jam}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="60%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <path d={outer} fill={`url(#crust-${jam})`} stroke="#78350f" strokeWidth="3" strokeLinejoin="round" />
      {dots}
      <circle cx="50" cy="50" r="17" fill={`url(#jam-${jam})`} stroke="#78350f" strokeWidth="2.5" />
      <ellipse cx="44" cy="43" rx="5" ry="3" fill="white" opacity="0.5" />
    </svg>
  );
}

function TwistEnd({ side = 'left' }) {
  const clip =
    side === 'left'
      ? 'polygon(100% 20%,55% 0%,100% 12%,35% 30%,100% 42%,25% 50%,100% 58%,35% 70%,100% 88%,55% 100%,100% 80%)'
      : 'polygon(0% 20%,45% 0%,0% 12%,65% 30%,0% 42%,75% 50%,0% 58%,65% 70%,0% 88%,45% 100%,0% 80%)';
  return (
    <motion.div
      layout
      className="w-9 h-28 border-y-4 border-black shrink-0"
      style={{
        clipPath: clip,
        background: 'linear-gradient(135deg,#e5e7eb,#9ca3af 40%,#e5e7eb 60%,#9ca3af)',
      }}
    />
  );
}

const DraggableBiscuit = ({ jam, onDrop, id }) => {
  return (
    <motion.div
      id={id} 
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} 
      dragElastic={1} 
      dragMomentum={false}
      onDragEnd={(e, info) => onDrop(jam, info.point)}
      whileDrag={{ scale: 1.2, zIndex: 50, cursor: 'grabbing' }}
      whileHover={{ scale: 1.05 }}
      className="cursor-grab relative z-40"
    >
      <Biscuit jam={jam} size={65} />
    </motion.div>
  );
};

export default function Ordered() {
  const [view, setView] = useState('analogy'); // 'analogy' | 'terminal' | 'quiz'

  const [wrapperBiscuits, setWrapperBiscuits] = useState([]);
  const [jarBiscuits, setJarBiscuits] = useState([]);
  const [shakeWrapper, setShakeWrapper] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  const { startTour, completeTask, activeTour, updateTourLayout } = useTour();
  const wrapperRef = useRef(null);
  const jarRef = useRef(null);

  const isPointInside = (point, ref) => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    const rectTop = rect.top + window.scrollY;
    const rectBottom = rect.bottom + window.scrollY;
    const rectLeft = rect.left + window.scrollX;
    const rectRight = rect.right + window.scrollX;
    return point.x >= rectLeft && point.x <= rectRight && point.y >= rectTop && point.y <= rectBottom;
  };

  const handleDrop = (jam, point) => {
    if (isPointInside(point, wrapperRef)) {
      if (!isSealed && wrapperBiscuits.length < 5) {
        setWrapperBiscuits(prev => [...prev, { id: `w${Date.now()}-${Math.random()}`, jam }]);
        setTimeout(() => completeTask(0), 400); 
        setTimeout(() => updateTourLayout(), 750);
      }
    } else if (isPointInside(point, jarRef)) {
      setJarBiscuits(prev => [...prev, { id: `j${Date.now()}-${Math.random()}`, jam }]);
      setTimeout(() => completeTask(3), 400);
      setTimeout(() => updateTourLayout(), 750);
    }
  };

  const handleSeal = () => {
    setIsSealed(true);
    completeTask(1);
  };

  const tryShuffleWrapper = () => {
    setShakeWrapper(true);
    setTimeout(() => setShakeWrapper(false), 500);
    completeTask(4);
  };

  const shuffleJar = () => {
    setJarBiscuits((prev) => [...prev].sort(() => Math.random() - 0.5));
    completeTask(7);
  };

  const reset = () => {
    setWrapperBiscuits([]);
    setJarBiscuits([]);
    setIsSealed(false);
  };

  // --- RENDERING VIEWS ---
 if (view === 'terminal') {
    const dataArray = SNIPPET_DATA.ordered || [];
    return (
      <CodeSnippetActivity 
        title="1. Ordered" 
        score={score}
        setScore={setScore}
        snippets={dataArray}
        onPrev={() => setView('analogy')} 
        onNext={() => setView('quiz')} 
      />
    );
  }

  if (view === 'quiz') {
    const totalScore = (SNIPPET_DATA.ordered?.length || 0) + (QUIZ_DATA.ordered?.length || 0);
    return (
      <Quiz
        title="1. Ordered"
        questions={QUIZ_DATA.ordered || []}
        score={score}
        setScore={setScore}
        totalPossibleScore={totalScore}
        onPrev={() => setView('terminal')}
        // Routes to Heterogeneous next!
        onNextSection={() => navigate('/heterogeneous')} 
      />
    );
  }

  return (
    // Note: The pb-12 and flex-col layout ensure the sticky dock naturally floats at the bottom
    <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-6rem)] relative pb-12">
      
      {/* BIG FLOATING NEXT BUTTON */}
      <button
        onClick={() => setView('terminal')}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-[40] bg-emerald-400 border-4 border-black px-4 py-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-30 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:-translate-y-30 active:shadow-none transition-all font-black flex flex-col items-center gap-4 text-xl"
      >
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>NEXT SECTION</span>
        <ChevronRight size={32} strokeWidth={4} />
      </button>

      {/* TOP HEADER */}
      <div className="flex flex-col gap-4 mb-12">
        <div className="flex justify-between items-start pr-24">
          <h2 className="text-4xl font-black uppercase bg-emerald-400 inline-block self-start px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            1. Ordered & Immutable
          </h2>
          
          {activeTour !== 'ordered' && (
            <button 
              onClick={() => { reset(); startTour('ordered'); }} 
              className="px-4 py-2 bg-yellow-300 border-4 border-black font-black rounded-lg hover:bg-yellow-400 flex items-center gap-2 transition-transform hover:-translate-y-1"
            >
              <Play size={20}/> Play Story
            </button>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-800">
          Tuples keep its elements in an ordered fashion. Press "Play Story" to learn this using an analogy.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 mb-12 w-full">
        {/* TUPLE (WRAPPER) */}
        <div 
          ref={wrapperRef} 
          className="bg-[#FFF8E7]/95 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[500px]"
        >
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
              <Check className="text-emerald-500" size={28} strokeWidth={3} />
              Biscuits packed in a wrapper
            </h3>
            <p className="font-medium text-gray-600 mb-8">
              Tuples are ordered, Biscuits will be preserved in the same order you input it. 
            </p>

            <div className="flex justify-center items-center min-h-[220px] mb-8">
              <motion.div
                animate={shakeWrapper ? { x: [-15, 15, -15, 15, 0], rotate: [-1.5, 1.5, -1.5, 1.5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center"
              >
                <TwistEnd side="left" />
                
                <motion.div
                  id="tour-wrapper-zone"
                  layout
                  className="flex items-center gap-1 px-2 py-4 border-y-4 border-black min-w-[80px] min-h-[110px] justify-center transition-all duration-300 relative"
                  style={{
                    background: 'repeating-linear-gradient(135deg,#fcd34d 0px,#fcd34d 14px,#fbbf24 14px,#fbbf24 28px)',
                  }}
                >
                  <AnimatePresence>
                    {wrapperBiscuits.length === 0 && (
                      <motion.span exit={{ opacity: 0 }} className="text-amber-900/40 font-black tracking-widest absolute text-center">DROP<br/>HERE</motion.span>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {wrapperBiscuits.map((b) => (
                      <motion.div
                        key={b.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Biscuit jam={b.jam} size={70} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                
                <TwistEnd side="right" />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!isSealed ? (
              <button
                id="btn-seal-wrapper"
                onClick={handleSeal}
                disabled={wrapperBiscuits.length === 0}
                className="w-full py-3 bg-amber-400 border-4 border-black rounded-xl font-black text-lg hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} strokeWidth={3} /> Seal Wrapper (Initialize)
              </button>
            ) : (
              <div className="w-full py-3 bg-zinc-200 border-4 border-black rounded-xl font-black text-lg text-zinc-500 flex items-center justify-center gap-2">
                <Lock size={20} strokeWidth={3} /> Wrapper Sealed
              </div>
            )}

            <button
              id="btn-shake-wrapper"
              onClick={tryShuffleWrapper}
              disabled={wrapperBiscuits.length === 0}
              className="w-full py-4 bg-emerald-400 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={24} strokeWidth={3} /> Shake Wrapper
            </button>
          </div>
        </div>

        
        {/* (JAR) */}
        <div 
          ref={jarRef}
          className="bg-[#FFF8E7]/95 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[500px]"
        >
          
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
              <X className="text-red-500" size={28} strokeWidth={3} />
              Biscuits inside a jar
            </h3>
            <p className="font-medium text-gray-600 mb-8">
              This example shows unordered behavior
            </p>

            <div className="flex justify-center min-h-[240px] mb-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-6 bg-gradient-to-b from-gray-200 to-gray-400 border-4 border-black rounded-t-md relative">
                  <div className="absolute inset-x-2 top-1.5 h-0.5 bg-black/25 rounded" />
                  <div className="absolute inset-x-2 top-3 h-0.5 bg-black/25 rounded" />
                </div>
                <div className="w-16 h-3 bg-gray-300 border-x-4 border-b-4 border-black" />
                
                <div
                  id="tour-jar-zone"
                  className="relative w-64 min-h-[220px] border-4 border-black rounded-b-[2.25rem] overflow-hidden transition-colors"
                  style={{
                    background: 'linear-gradient(135deg, rgba(191,219,254,0.55), rgba(147,197,253,0.2))',
                  }}
                >
                  <div className="absolute top-3 left-6 w-3 h-28 bg-white/50 rounded-full blur-[2px] rotate-6 pointer-events-none z-10" />
                  
                  <AnimatePresence>
                    {jarBiscuits.length === 0 && (
                      <motion.span exit={{ opacity: 0 }} className="text-sky-900/30 font-black tracking-widest absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">DROP<br/>HERE</motion.span>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-wrap items-end justify-center gap-2 p-5 pt-9 pb-14 min-h-[220px]">
                    <AnimatePresence>
                      {jarBiscuits.map((b) => (
                        <motion.div
                          layout
                          key={b.id}
                          initial={{ y: -50, opacity: 0, scale: 0.5 }}
                          animate={{ y: 0, opacity: 1, scale: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        >
                          <Biscuit jam={b.jam} size={58} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 border-2 border-black rounded px-3 py-1 text-xs font-black tracking-widest z-20">
                    BISCUITS
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            id="btn-shake-jar"
            onClick={shuffleJar}
            disabled={jarBiscuits.length === 0}
            className="w-full py-4 bg-purple-400 border-4 border-black rounded-xl font-black text-xl hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all flex items-center justify-center gap-2 mt-auto"
          >
            <RefreshCw size={24} strokeWidth={3} /> Shake Jar
          </button>
        </div>
        
      </div>
      {/* PANTRY - Floating Neo-Brutalist Dock */}
      {/* Changed from 'fixed' to 'sticky bottom-4 w-full' to perfectly respect the dynamic layout */}
      <div className="sticky mt-auto bottom-6 w-full bg-[#FFF8E7]/95 border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-6 relative ">
          <span className="font-black text-xl uppercase tracking-widest hidden sm:block">Pantry:</span>
          <p className="text-sm font-bold text-black-500 absolute -top-12 left-0 sm:left-24 bg-[#FFF8E7]/95 px-3 py-1 border-2 border-black rounded-lg">
            Drag a biscuit to a container ↓
          </p>
          
          <div className="flex gap-4">
            {JAM_KEYS.map((jam) => (
              <DraggableBiscuit 
                key={jam} 
                jam={jam} 
                onDrop={handleDrop} 
                id={`pantry-biscuit-${jam}`}
              />
            ))}
          </div>
        </div>
        
        <button onClick={reset} className="px-6 py-4 bg-zinc-200 border-4 border-black rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-300 transition-colors">
          <RotateCcw size={20} strokeWidth={3} /> Reset
        </button>
      </div>
      

    </div>
  );
}