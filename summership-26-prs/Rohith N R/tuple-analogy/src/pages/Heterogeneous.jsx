import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Play, ChevronRight, RotateCcw } from 'lucide-react';
import { useTour } from '../context/TourContext';
// import PythonTerminal from '../components/PythonTerminal';
import Quiz from '../components/Quiz';
// import { TERMINAL_DATA } from '../data/snippets';
import CodeSnippetActivity from '../components/CodeSnippetActivity';
import { SNIPPET_DATA } from '../data/snippets';
import { QUIZ_DATA } from '../data/quiz';
import { useNavigate } from 'react-router-dom';

// --- BISCUIT SVG ASSETS ---
const JAM = {
  red:   { fill: '#ef4444', dark: '#b91c1c', highlight: '#fca5a5' },
  green: { fill: '#22c55e', dark: '#15803d', highlight: '#86efac' },
  blue:  { fill: '#3b82f6', dark: '#1d4ed8', highlight: '#93c5fd' },
  yellow:{ fill: '#eab308', dark: '#a16207', highlight: '#fde68a' },
  pink:  { fill: '#ec4899', dark: '#be185d', highlight: '#f9a8d4' },
};

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

// --- OTHER ITEM SVGs (same illustrated style as the biscuit) ---
const OBJECT_COLORS = {
  watch:  { fill: '#6366f1', dark: '#3730a3', highlight: '#a5b4fc' },
  ring:   { fill: '#8b5cf6', dark: '#5b21b6', highlight: '#ddd6fe' },
  shoes:  { fill: '#4f46e5', dark: '#312e81', highlight: '#a5b4fc' },
  camera: { fill: '#7c3aed', dark: '#4c1d95', highlight: '#c4b5fd' },
  apple:  { fill: '#f43f5e', dark: '#9f1239', highlight: '#fda4af' },
  coffee: { fill: '#92400e', dark: '#451a03', highlight: '#fcd34d' },
};

const iconShadow = { filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.25))' };

function WatchIcon({ size = 80 }) {
  const c = OBJECT_COLORS.watch;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={iconShadow}>
      <defs>
        <radialGradient id="watch-face" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="60%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <rect x="38" y="4" width="24" height="26" rx="6" fill="#78350f" stroke="#000" strokeWidth="3" />
      <rect x="38" y="70" width="24" height="26" rx="6" fill="#78350f" stroke="#000" strokeWidth="3" />
      <circle cx="50" cy="50" r="28" fill="url(#watch-face)" stroke="#000" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="21" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="50" y2="35" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="60" y2="54" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="50" r="2.5" fill="#1e1b4b" />
      <ellipse cx="43" cy="42" rx="5" ry="3" fill="white" opacity="0.5" />
    </svg>
  );
}

function RingIcon({ size = 80 }) {
  const c = OBJECT_COLORS.ring;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={iconShadow}>
      <defs>
        <radialGradient id="ring-band" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
        <radialGradient id="ring-gem" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="60%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="62" r="26" fill="none" stroke="url(#ring-band)" strokeWidth="10" />
      <circle cx="50" cy="62" r="26" fill="none" stroke="#000" strokeWidth="3" />
      <polygon points="50,18 63,33 57,46 43,46 37,33" fill="url(#ring-gem)" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="50,18 63,33 50,33" fill="white" opacity="0.35" />
    </svg>
  );
}

function ShoeIcon({ size = 80 }) {
  const c = OBJECT_COLORS.shoes;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={iconShadow}>
      <defs>
        <radialGradient id="shoe-body" cx="35%" cy="30%" r="90%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="55%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <path d="M10,78 Q10,60 28,58 L40,46 Q48,38 58,42 L66,50 Q78,52 88,62 Q94,68 90,78 Q88,84 78,84 L18,84 Q10,84 10,78 Z" fill="url(#shoe-body)" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M18,84 L78,84 L78,90 Q78,94 74,94 L22,94 Q18,94 18,90 Z" fill="#1e1b4b" stroke="#000" strokeWidth="3" />
      <path d="M40,46 Q48,38 58,42 L66,50" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="46" cy="52" r="1.8" fill="#1e1b4b" />
      <circle cx="54" cy="50" r="1.8" fill="#1e1b4b" />
      <ellipse cx="30" cy="65" rx="6" ry="3.5" fill="white" opacity="0.4" />
    </svg>
  );
}

function CameraIcon({ size = 80 }) {
  const c = OBJECT_COLORS.camera;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={iconShadow}>
      <defs>
        <radialGradient id="cam-body" cx="35%" cy="25%" r="90%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="55%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
        <radialGradient id="cam-lens" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="60%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>
      <rect x="12" y="15" width="24" height="12" rx="3" fill={c.dark} stroke="#000" strokeWidth="2.5" />
      <rect x="8" y="26" width="84" height="56" rx="10" fill="url(#cam-body)" stroke="#000" strokeWidth="3.5" />
      <circle cx="50" cy="56" r="20" fill="url(#cam-lens)" stroke="#000" strokeWidth="3" />
      <circle cx="50" cy="56" r="10" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.7" />
      <circle cx="80" cy="36" r="4" fill="#fde68a" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="43" cy="49" rx="4" ry="2.5" fill="white" opacity="0.6" />
    </svg>
  );
}

function AppleIcon({ size = 80 }) {
  const c = OBJECT_COLORS.apple;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={iconShadow}>
      <defs>
        <radialGradient id="apple-body" cx="32%" cy="28%" r="80%">
          <stop offset="0%" stopColor={c.highlight} />
          <stop offset="55%" stopColor={c.fill} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <path d="M50,38 C30,30 14,44 15,64 C16,82 32,92 44,92 C48,92 48,88 50,88 C52,88 52,92 56,92 C68,92 84,82 85,64 C86,44 70,30 50,38 Z" fill="url(#apple-body)" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M50,38 Q48,26 50,18" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      <path d="M50,22 Q60,14 68,20 Q60,26 50,28 Z" fill="#22c55e" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="32" cy="52" rx="7" ry="10" fill="white" opacity="0.35" />
    </svg>
  );
}

function CoffeeIcon({ size = 80 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={iconShadow}>
      <defs>
        <radialGradient id="coffee-liquid" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="60%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
      </defs>
      <path d="M20,40 L76,40 L72,84 Q70,92 60,92 L36,92 Q26,92 24,84 Z" fill="#fde68a" stroke="#000" strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="48" cy="42" rx="28" ry="7" fill="url(#coffee-liquid)" stroke="#000" strokeWidth="3" />
      <path d="M76,48 Q94,48 94,62 Q94,76 76,74" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      <path d="M35,30 Q32,22 38,16" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M50,30 Q47,22 53,16" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

const ICONS = {
  watch: WatchIcon,
  ring: RingIcon,
  shoes: ShoeIcon,
  camera: CameraIcon,
  apple: AppleIcon,
  coffee: CoffeeIcon,
};

// --- ITEM DATA ---
const PANTRY_ITEMS = [
  { key: 'biscuit-red', type: 'biscuit', jam: 'red', label: 'Biscuit' },
  { key: 'biscuit-blue', type: 'biscuit', jam: 'blue', label: 'Biscuit' },
  { key: 'watch', type: 'watch', label: 'Watch' },
  { key: 'ring', type: 'ring', label: 'Ring' },
  { key: 'shoes', type: 'shoes', label: 'Shoes' },
  { key: 'camera', type: 'camera', label: 'Camera' },
  { key: 'apple', type: 'apple', label: 'Apple' },
  { key: 'coffee', type: 'coffee', label: 'Coffee' },
];

let uid = 0;
const nextId = () => ++uid;

// --- SHARED RENDER COMPONENT ---
function RenderItem({ item, size = 60 }) {
  if (item.type === 'biscuit') {
    return <Biscuit jam={item.jam} size={size} />;
  }
  const IconComp = ICONS[item.type];
  return IconComp ? <IconComp size={size} /> : null;
}

function DraggableItem({ item, onDrop, id }) {
  return (
    <motion.div
      id={id}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={1}
      dragMomentum={false}
      onDragEnd={(e, info) => onDrop(item, info.point)}
      whileDrag={{ scale: 1.2, zIndex: 9999, cursor: 'grabbing' }}
      whileHover={{ scale: 1.05 }}
      className="cursor-grab relative z-[100] flex flex-col items-center gap-1 shrink-0"
    >
      <RenderItem item={item} size={56} />
      <span className="text-[11px] font-black text-gray-800">{item.label}</span>
    </motion.div>
  );
}

export default function HeterogeneousSlide() {
  const [view, setView] = useState('analogy'); // 'analogy' | 'terminal' | 'quiz'

  const [wrapperItems, setWrapperItems] = useState([]);
  const [shakeWrapper, setShakeWrapper] = useState(false);

  const [bagItems, setBagItems] = useState([]);
  const [bagPulse, setBagPulse] = useState(false);

  const navigate = useNavigate();
  const [score, setScore]=useState(0);

  const { startTour, completeTask, activeTour, updateTourLayout } = useTour();

  const wrapperRef = useRef(null);
  const bagRef = useRef(null);

  const isPointInside = (point, ref) => {
    if (!ref.current) return false;
    const rect = ref.current.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const right = rect.right + window.scrollX;
    return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
  };

  const rejectWrapper = () => {
    setShakeWrapper(true);
    setTimeout(() => setShakeWrapper(false), 1000);
  };

  const handleDrop = (item, point) => {
    if (isPointInside(point, wrapperRef)) {
      if (item.type !== 'biscuit') {
        rejectWrapper();
        return;
      }
      if (wrapperItems.length < 5) {
        setWrapperItems((items) => [...items, { id: nextId(), ...item }]);
        setTimeout(() => updateTourLayout(), 750);
      }
    } else if (isPointInside(point, bagRef)) {
      setBagItems((items) => [...items, { id: nextId(), ...item }]);
      setBagPulse(true);
      setTimeout(() => setBagPulse(false), 400);
      setTimeout(() => updateTourLayout(), 750);
    }
  };

  const reset = () => {
    setWrapperItems([]);
    setBagItems([]);
  };

  if (view === 'terminal') {
    const dataArray = SNIPPET_DATA.heterogeneous || [];
    return (
      <CodeSnippetActivity 
        title="2. Heterogeneous" 
        score={score}
        setScore={setScore}
        snippets={dataArray}
        onPrev={() => setView('analogy')} 
        onNext={() => setView('quiz')} 
      />
    );
  }

  if (view === 'quiz') {
    const totalScore = (SNIPPET_DATA.heterogeneous?.length || 0) + (QUIZ_DATA.heterogeneous?.length || 0);
    return (
      <Quiz
        title="2. Heterogeneous"
        questions={QUIZ_DATA.heterogeneous || []}
        score={score}
        setScore={setScore}
        totalPossibleScore={totalScore}
        onPrev={() => setView('terminal')}
        // Routes to Nested next!
        onNextSection={() => navigate('/nested')} 
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-6rem)] relative pb-12">

      <button
        onClick={() => setView('terminal')}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-[40] bg-amber-400 border-4 border-black px-4 py-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-30 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:-translate-y-30 active:shadow-none transition-all font-black flex flex-col items-center gap-4 text-xl text-black"
      >
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>NEXT SECTION</span>
        <ChevronRight size={32} strokeWidth={4} />
      </button>

      <div className="flex flex-col gap-4 mb-12">
        <div className="flex justify-between items-start pr-24">
          <h2 className="text-4xl font-black uppercase bg-amber-400 text-black inline-block self-start px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            2. Heterogeneous
          </h2>

          {activeTour !== 'heterogeneous' && (
            <button
              onClick={() => { reset(); startTour('heterogeneous'); }}
              className="px-4 py-2 bg-yellow-300 border-4 border-black font-black rounded-lg hover:bg-yellow-400 flex items-center gap-2 transition-transform hover:-translate-y-1"
            >
              <Play size={20}/> Play Story
            </button>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-800">
          Can data structures hold mixed items? Try dropping random objects into the Biscuit Wrapper versus the Shopping Bag.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 mb-12 w-full">

        <div id="wrapper div" ref={wrapperRef} className="bg-[#FFF8E7]/95 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[500px]">
          <div >
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
              <X className="text-red-500" size={28} strokeWidth={3} />
              Homogeneous Wrapper
            </h3>
            <p className="font-medium text-gray-600 mb-8">
              This wrapper is strictly homogeneous. It will ONLY accept biscuits. It rejects everything else.
            </p>

            <div className="flex justify-center items-center min-h-[220px] mb-8 relative">
              <motion.div
                animate={shakeWrapper ? { x: [-15, 15, -15, 15, 0], rotate: [-1.5, 1.5, -1.5, 1.5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center"
              >
                <div className="w-9 h-28 border-y-4 border-black shrink-0" style={{ clipPath: 'polygon(100% 20%,55% 0%,100% 12%,35% 30%,100% 42%,25% 50%,100% 58%,35% 70%,100% 88%,55% 100%,100% 80%)', background: 'linear-gradient(135deg,#e5e7eb,#9ca3af 40%,#e5e7eb 60%,#9ca3af)' }} />

                <motion.div
                  id="tour-wrapper-zone"
                  layout
                  className="flex items-center gap-1 px-2 py-4 border-y-4 border-black min-w-[80px] min-h-[110px] justify-center transition-all duration-300 relative"
                  style={{
                    background: 'repeating-linear-gradient(135deg,#fcd34d 0px,#fcd34d 14px,#fbbf24 14px,#fbbf24 28px)',
                  }}
                >
                  <AnimatePresence>
                    {wrapperItems.length === 0 && (
                      <motion.span exit={{ opacity: 0 }} className="text-amber-900/40 font-black tracking-widest absolute text-center">DROP<br/>HERE</motion.span>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {wrapperItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <RenderItem item={item} size={70} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <div className="w-9 h-28 border-y-4 border-black shrink-0" style={{ clipPath: 'polygon(0% 20%,45% 0%,0% 12%,65% 30%,0% 42%,75% 50%,0% 58%,65% 70%,0% 88%,45% 100%,0% 80%)', background: 'linear-gradient(135deg,#e5e7eb,#9ca3af 40%,#e5e7eb 60%,#9ca3af)' }} />
              </motion.div>

              <AnimatePresence>
                {shakeWrapper && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: -40 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                  >
                    <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-xl border-4 border-black rotate-[-6deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      REJECTED! Wrapper is for Biscuits only!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="w-full py-4 bg-red-100 border-4 border-black rounded-xl font-black text-xl text-red-500 flex items-center justify-center gap-2">
              <X size={24} strokeWidth={3} /> Homogeneous Only
            </div>
          </div>
        </div>

        <div id="bag div" ref={bagRef} className="bg-[#FFF8E7]/95 border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[500px]">
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
              <Check className="text-emerald-500" size={28} strokeWidth={3} />
              Heterogeneous Bag
            </h3>
            <p className="font-medium text-gray-600 mb-8">
              This bag is heterogeneous. It doesn't care about types. Drop biscuits, shoes, or cameras inside!
            </p>
                      
            <div className="relative mx-auto w-full max-w-[260px] mb-2" style={{ height: 220 }}>
                {/* Bag Handles */}
                <svg width="100%" height="40" viewBox="0 0 200 40" className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <path d="M 60 40 Q 60 4 100 4 Q 140 4 140 40" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 60 40 Q 60 4 100 4 Q 140 4 140 40" fill="none" stroke="#F472B6" strokeWidth="3" strokeLinecap="round" />
                </svg>

                {/* Bag Body */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-[180px] z-10">
                  {/* SVG shape gives a clean, consistent border on ALL sides, including the slanted ones */}
                  <svg
                    viewBox="0 0 100 180"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full"
                  >
                    <polygon
                      points="8,0 92,0 100,180 0,180"
                      fill="#fdf2f8" /* pink-50 */
                      stroke="black"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* Content sits on top, clipped to the same trapezoid so items don't spill past the slanted edges */}
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)' }}
                  >
                    <motion.div
                      animate={bagPulse ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full pt-8 px-4 pb-3 flex flex-wrap content-start justify-center gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      {bagItems.length === 0 && (
                        <span className="text-pink-900/30 font-black text-sm m-auto tracking-widest">DROP ANYTHING HERE</span>
                      )}
                      <AnimatePresence>
                        {bagItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ scale: 0, y: -16, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                          >
                            <RenderItem item={item} size={50} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              </div>
          </div>
                    
          <div className="mt-auto pt-4 flex flex-col gap-3">
             <div className="w-full py-4 bg-emerald-100 border-4 border-black rounded-xl font-black text-xl text-emerald-600 flex items-center justify-center gap-2">
                <Check size={24} strokeWidth={3} /> Accepts Mixed Types
             </div>
          </div>
        </div>
      </div>

      <div className="sticky mt-auto bottom-6 w-full bg-[#FFF8E7]/95 border-4 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[999] flex flex-col lg:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-6 relative w-full">
          <span className="font-black text-xl uppercase tracking-widest hidden sm:block shrink-0">Shelf:</span>
          <p className="text-sm font-bold text-black-500 absolute -top-12 left-0 sm:left-24 bg-[#FFF8E7]/95 px-3 py-1 border-2 border-black rounded-lg hidden sm:block">
            Drag items to containers ↓
          </p>

          <div className="flex gap-4 pb-2 sm:pb-0 px-2 flex-wrap justify-center sm:justify-start">
            {PANTRY_ITEMS.map((item) => (
              <DraggableItem
                key={item.key}
                item={item}
                onDrop={handleDrop}
                id={`pantry-item-${item.key}`}
              />
            ))}
          </div>
        </div>

        <button onClick={reset} className="px-6 py-4 bg-zinc-200 border-4 border-black rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-300 transition-colors shrink-0">
          <RotateCcw size={20} strokeWidth={3} /> Reset
        </button>
      </div>

    </div>
  );
}