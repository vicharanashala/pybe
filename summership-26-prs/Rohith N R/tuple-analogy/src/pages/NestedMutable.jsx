import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Power,
  Lock,
  Zap,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useTour } from '../context/TourContext';
import CodeSnippetActivity from '../components/CodeSnippetActivity';
import Quiz from '../components/Quiz';
import { SNIPPET_DATA } from '../data/snippets';
import { QUIZ_DATA } from '../data/quiz';
import { useNavigate } from 'react-router-dom';

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

const initialBatteries = [
  { id: 'b1', charge: 'old', location: 'slot0' },
  { id: 'b2', charge: 'old', location: 'slot1' },
  { id: 'b3', charge: 'new', location: 'tray' },
  { id: 'b4', charge: 'new', location: 'tray' },
];

export default function NestedMutable() {
  const [view, setView] = useState('analogy'); // 'analogy' | 'terminal' | 'quiz'

  const [batteries, setBatteries] = useState(initialBatteries);
  const [locked, setLocked] = useState(false);
  const [dragOverZone, setDragOverZone] = useState(null);
  const [remoteId] = useState(() => '0x' + Math.random().toString(16).slice(2, 8));

  const { startTour, activeTour, completeTask, updateTourLayout } = useTour();

  const slot0Ref = useRef(null);
  const slot1Ref = useRef(null);
  const trayRef = useRef(null);
  const discardRef = useRef(null);

  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  const zoneRefs = { slot0: slot0Ref, slot1: slot1Ref, tray: trayRef, discard: discardRef };

  const zoneAt = (point) => {
    const pad = 16;
    for (const zone of ['slot0', 'slot1', 'tray', 'discard']) {
      const el = zoneRefs[zone].current;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const left = r.left + window.scrollX;
      const right = r.right + window.scrollX;
      const top = r.top + window.scrollY;
      const bottom = r.bottom + window.scrollY;
      if (point.x >= left - pad && point.x <= right + pad && point.y >= top - pad && point.y <= bottom + pad) {
        return zone;
      }
    }
    return null;
  };

  const handleDrag = (_e, info) => setDragOverZone(zoneAt(info.point));

  const handleDragEnd = (id, info) => {
    const target = zoneAt(info.point);
    setDragOverZone(null);
    if (!target) return;

    setBatteries((prev) => {
      let updated = prev.map((b) => (b.id === id ? { ...b, location: target } : b));
      if (target === 'slot0' || target === 'slot1') {
        const occupant = prev.find((b) => b.location === target && b.id !== id);
        if (occupant) {
          const newLoc = occupant.charge === 'old' ? 'discard' : 'tray';
          updated = updated.map((b) => (b.id === occupant.id ? { ...b, location: newLoc } : b));
        }
      }
      return updated;
    });
    
    setTimeout(() => updateTourLayout(), 750);
  };

  const tryModifyButtons = () => {
    setLocked(true);
    setTimeout(() => setLocked(false), 900);
  };
  const lockedClickNext=()=>{
    completeTask(4);
  }

  const inSlot = (slot) => batteries.find((b) => b.location === slot);

  const reset = () => {
    setBatteries(initialBatteries);
    setLocked(false);
    setDragOverZone(null);
  };

  // --- RENDERING VIEWS ---
  if (view === 'terminal') {
    const dataArray = SNIPPET_DATA.nested || [];
    return (
      <CodeSnippetActivity 
        title="3. Nested Mutable" 
        score={score}
        setScore={setScore}
        snippets={dataArray}
        onPrev={() => setView('analogy')} 
        onNext={() => setView('quiz')} 
      />
    );
  }

  if (view === 'quiz') {
    const totalScore = (SNIPPET_DATA.nested?.length || 0) + (QUIZ_DATA.nested?.length || 0);
    return (
      <Quiz
        title="3. Nested Mutable"
        questions={QUIZ_DATA.nested || []}
        score={score}
        setScore={setScore}
        totalPossibleScore={totalScore}
        onPrev={() => setView('terminal')}
        // Routes back to the Home Dashboard when the whole tutorial is done!
        onNextSection={() => navigate('/finalTest')} 
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col min-h-[calc(100vh-6rem)] relative pb-12">
      
      {/* BIG FLOATING NEXT BUTTON */}
      <button
        onClick={() => setView('terminal')}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-[40] bg-orange-400 border-4 border-black px-4 py-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-30 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:-translate-y-30 active:shadow-none transition-all font-black flex flex-col items-center gap-4 text-xl text-black"
      >
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>NEXT SECTION</span>
        <ChevronRightIcon size={32} strokeWidth={4} />
      </button>

      {/* TOP HEADER */}
      <div className="flex flex-col gap-4 mb-12">
        <div className="flex justify-between items-start pr-24">
          <h2 className="text-4xl font-black uppercase bg-orange-400 text-black inline-block self-start px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl">
            3. Nested Mutable
          </h2>
          
          {activeTour !== 'nested' && (
            <button 
              onClick={() => { reset(); startTour('nested'); }} 
              className="px-4 py-2 bg-yellow-300 border-4 border-black font-black rounded-lg hover:bg-yellow-400 flex items-center gap-2 transition-transform hover:-translate-y-1"
            >
              <Play size={20}/> Play Story
            </button>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-800 pr-24">
          A tuple can't change. But if it holds a <span className="text-orange-500 font-black">list</span> inside it, that list CAN change. Try dragging batteries in and out of the remote.
        </p>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-[#FFF8E7]/95 border-4 border-black rounded-3xl p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full mr-24">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10">
          
          {/* ============ SPARES TRAY ============ */}
          <div id="unused slot" className="flex flex-col items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Spares</span>
            <div
              ref={trayRef}
              className={`w-24 min-h-[140px] rounded-2xl border-4 border-dashed p-3 flex flex-wrap content-start items-start justify-center gap-2 transition-colors ${
                dragOverZone === 'tray' ? 'border-orange-500 bg-orange-50' : 'border-zinc-300 bg-zinc-50'
              }`}
            >
              {batteries
                .filter((b) => b.location === 'tray')
                .map((b) => (
                  <DraggableBattery key={b.id} battery={b} onDrag={handleDrag} onDragEnd={handleDragEnd} />
                ))}
            </div>
          </div>

          {/* ============ THE REMOTE ============ */}
          <motion.div
            animate={locked ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-64 select-none relative z-10"
          >
            <div className="relative bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-900 border-4 border-black rounded-[2rem] rounded-t-[3rem] p-4 pt-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-4">
              {/* IR window */}
              <div className="w-14 h-4 bg-zinc-950 rounded-full border-2 border-black flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
              </div>

              {/* ===== LOCKED ZONE: buttons / pcb ===== */}
              <div id='locked zone'
                onClick={() => { tryModifyButtons(); lockedClickNext(); }}
                className="relative w-full flex flex-col items-center gap-4 rounded-2xl cursor-pointer"
              >
                {locked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -inset-2 z-20 bg-red-500/85 rounded-2xl flex flex-col items-center justify-center gap-1 border-4 border-black"
                  >
                    <Lock size={22} className="text-white" />
                    <span className="text-white font-black text-xs text-center leading-tight px-2">
                      TUPLE LOCKED
                    </span>
                  </motion.div>
                )}

                <div className="w-12 h-12 rounded-full bg-red-500 border-4 border-black flex items-center justify-center">
                  <Power size={20} className="text-white" />
                </div>

                <div className="relative w-24 h-24 rounded-full bg-zinc-600 border-4 border-black flex items-center justify-center">
                  <ChevronUp size={16} className="absolute top-1.5 text-zinc-300" />
                  <ChevronDown size={16} className="absolute bottom-1.5 text-zinc-300" />
                  <ChevronLeft size={16} className="absolute left-1.5 text-zinc-300" />
                  <ChevronRight size={16} className="absolute right-1.5 text-zinc-300" />
                  <span className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-black text-white text-[10px] font-black flex items-center justify-center">
                    OK
                  </span>
                </div>

                <div className="flex gap-6">
                  <div className="w-8 h-16 rounded-full bg-zinc-600 border-4 border-black flex flex-col items-center justify-between py-1.5">
                    <ChevronUp size={12} className="text-zinc-300" />
                    <div className="w-4 h-[2px] bg-black" />
                    <ChevronDown size={12} className="text-zinc-300" />
                  </div>
                  <div className="w-8 h-16 rounded-full bg-zinc-600 border-4 border-black flex flex-col items-center justify-between py-1.5">
                    <ChevronUp size={12} className="text-zinc-300" />
                    <div className="w-4 h-[2px] bg-black" />
                    <ChevronDown size={12} className="text-zinc-300" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {NUMPAD.map((k) => (
                    <div
                      key={k}
                      className="w-6 h-6 rounded-md bg-zinc-600 border-2 border-black text-white text-[9px] font-bold flex items-center justify-center"
                    >
                      {k}
                    </div>
                  ))}
                </div>

                <span className="text-zinc-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Lock size={9} /> fixed part
                </span>
              </div>

              {/* Hinge */}
              <div className="w-full flex items-center gap-2 px-2">
                <div className="w-2 h-2 rounded-full bg-zinc-950 border border-black" />
                <div className="flex-1 h-1 bg-zinc-950 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-zinc-950 border border-black" />
              </div>

              {/* ===== BATTERY COMPARTMENT: mutable list ===== */}
              <div id="Battery Case" className="relative w-full bg-orange-400 border-4 border-black rounded-xl p-3">
                <span className="block text-orange-900 text-[9px] font-black uppercase tracking-wider mb-2 text-center">
                  battery slots (list) — drag me
                </span>

                <div className="flex justify-center gap-4">
                  <div
                    ref={slot0Ref}
                    className={`relative w-10 h-24 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                      dragOverZone === 'slot0'
                        ? 'border-white bg-orange-300 ring-4 ring-white'
                        : 'border-orange-900/40 bg-orange-300/50'
                    }`}
                  >
                    {!inSlot('slot0') && (
                      <div className="flex flex-col items-center text-orange-900/50 text-[9px] font-black">
                        <span>+</span>
                        <span>−</span>
                      </div>
                    )}
                    {inSlot('slot0') && (
                      <DraggableBattery
                        battery={inSlot('slot0')}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                      />
                    )}
                  </div>
                  <div
                    ref={slot1Ref}
                    className={`relative w-10 h-24 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                      dragOverZone === 'slot1'
                        ? 'border-white bg-orange-300 ring-4 ring-white'
                        : 'border-orange-900/40 bg-orange-300/50'
                    }`}
                  >
                    {!inSlot('slot1') && (
                      <div className="flex flex-col items-center text-orange-900/50 text-[9px] font-black">
                        <span>+</span>
                        <span>−</span>
                      </div>
                    )}
                    {inSlot('slot1') && (
                      <DraggableBattery
                        battery={inSlot('slot1')}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                      />
                    )}
                  </div>
                </div>
              </div>

              <span className="text-zinc-500 text-[8px] font-mono">
                remote id {remoteId} <span className="text-emerald-500">· never changes</span>
              </span>
            </div>
          </motion.div>

          {/* ============ USED PILE ============ */}
          <div id="used slot" className="flex flex-col items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Used</span>
            <div
              ref={discardRef}
              className={`w-24 min-h-[140px] rounded-2xl border-4 border-dashed p-3 flex flex-wrap content-start items-start justify-center gap-2 transition-colors ${
                dragOverZone === 'discard' ? 'border-zinc-500 bg-zinc-100' : 'border-zinc-300 bg-zinc-50'
              }`}
            >
              {batteries
                .filter((b) => b.location === 'discard')
                .map((b) => (
                  <DraggableBattery key={b.id} battery={b} onDrag={handleDrag} onDragEnd={handleDragEnd} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableBattery({ battery, onDrag, onDragEnd }) {
  const charged = battery.charge === 'new';
  return (
    <motion.div
      layout
      drag
      dragSnapToOrigin
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 22 }}
      whileDrag={{ scale: 1.15, rotate: 6, zIndex: 9999 }}
      onDrag={onDrag}
      onDragEnd={(e, info) => onDragEnd(battery.id, info)}
      className="cursor-grab active:cursor-grabbing relative z-50"
      style={{ touchAction: 'none' }}
    >
      {/* terminal nub */}
      <div className="w-3 h-2 rounded-t-[3px] bg-zinc-300 border-2 border-b-0 border-black mx-auto" />
      {/* body */}
      <div
        className={`relative w-8 h-20 rounded-md border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] ${
          charged
            ? 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500'
            : 'bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-400'
        }`}
      >
        {/* cylindrical sheen */}
        <div className="absolute inset-y-0 left-1 w-1 bg-white/50 rounded-full" />

        {/* top plus */}
        <div
          className={`absolute top-1 inset-x-0 text-center text-[8px] font-black ${
            charged ? 'text-amber-900' : 'text-zinc-500'
          }`}
        >
          +
        </div>

        {/* label band */}
        <div
          className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 flex flex-col items-center justify-center border-y-2 border-black/70 ${
            charged ? 'bg-zinc-900' : 'bg-zinc-500'
          }`}
        >
          <span className="text-[7px] font-black text-white leading-none">AA</span>
          {charged ? (
            <Zap size={9} className="text-amber-300 fill-amber-300 mt-0.5" />
          ) : (
            <span className="text-[6px] text-zinc-300 mt-0.5">flat</span>
          )}
        </div>

        {/* bottom minus / cap */}
        <div className="absolute bottom-0 inset-x-0 h-2 bg-zinc-950" />
      </div>
    </motion.div>
  );
}