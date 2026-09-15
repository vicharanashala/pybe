import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTour } from '../context/TourContext';


export default function BittuTourGlobal() {
  const { 
  activeTour, currentStep, tourSteps, skipTour, 
  nextStep, prevStep, taskCompleted, layoutTrigger 
} = useTour();
  const [targetRects, setTargetRects] = useState([]);

  

  useEffect(() => {
    if (!activeTour || !tourSteps[currentStep]) return;

    const updateRects = () => {
      const stepData = tourSteps[currentStep];
      const ids = stepData.targetIds || (stepData.targetId ? [stepData.targetId] : []);
      
      if (ids.length === 0) {
        setTargetRects([]);
        return;
      }

      const rects = ids.map(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return { id, top: rect.top, left: rect.left, width: rect.width, height: rect.height };
        }
        return null;
      }).filter(Boolean);

      setTargetRects(rects);
    };

    updateRects();
    window.addEventListener('resize', updateRects);
    window.addEventListener('scroll', updateRects, true);
    const timer = setTimeout(updateRects, 300);

    return () => {
      window.removeEventListener('resize', updateRects);
      window.removeEventListener('scroll', updateRects, true);
      clearTimeout(timer);
    };
  }, [currentStep, activeTour, tourSteps, layoutTrigger]);

  if (!activeTour || !tourSteps[currentStep]) return null;

  const stepData = tourSteps[currentStep];
  const padding = 12;
  const imageConfig = stepData.bittuImage || { url: '/image_c3e79d.jpg', bgSize: 'cover', bgPos: 'center' };
  const primaryTarget = targetRects.length > 0 ? targetRects[0] : null;

  const getBoxStyle = () => {
    if (stepData.boxPosition) return stepData.boxPosition;
    if (primaryTarget) return { top: Math.max(20, primaryTarget.bottom + 24), left: Math.max(20, Math.min(primaryTarget.left, window.innerWidth - 400)) };
    return { top: '40%', left: '50%', transform: 'translate(-50%, -50%)' };
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] pointer-events-none" 
      >
        {/* The Dark Overlay with Cutouts */}
        <svg className="w-full h-full absolute inset-0">
          <defs>
            <mask id="overlay-hole">
              <rect width="100%" height="100%" fill="white" />
              {targetRects.map((rect, index) => (
                <rect
                  key={`${rect.id}-${index}`}
                  x={rect.left - padding}
                  y={rect.top - padding}
                  width={rect.width + padding * 2}
                  height={rect.height + padding * 2}
                  fill="black"
                  rx="12"
                />
              ))}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.85)" mask="url(#overlay-hole)" />
        </svg>

        {/* Big Screen-Edge Navigation Arrows */}
        <div className="absolute inset-0 flex justify-between items-center px-4 md:px-12 pointer-events-none z-[10001]">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 0} 
            className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md border-2 border-white/20 transition-all disabled:opacity-0 disabled:pointer-events-none"
          >
            <ChevronLeft size={48} strokeWidth={2} />
          </button>

          <button 
            onClick={nextStep} 
            // Changed this to only disable if it's the very last step of the tour
            disabled={currentStep === tourSteps.length} 
            className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md border-2 border-white/20 transition-all disabled:opacity-30 disabled:hover:bg-white/10"
          >
            <ChevronRight size={48} strokeWidth={2} />
          </button>
        </div>

        {/* Bittu's Original Dialogue Box */}
        {/* Bittu's Original Dialogue Box */}
<motion.div
  layout
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
  className="absolute z-[10000] flex flex-col md:flex-row items-end md:items-start gap-4 max-w-md drop-shadow-2xl pointer-events-auto"
  style={getBoxStyle()}
>
  {/* Kept w-28 so the dialog box doesn't move. Added scale, translate, and origin to adjust it visually. */}
  <img 
    src={imageConfig.url} 
    alt={stepData.author}
    className="w-28 shrink-0 hidden sm:block object-contain scale-[1.6] -translate-y-1 origin-bottom"
  />

  <div className="bg-white border-4 border-black p-6 rounded-2xl rounded-tl-none relative shadow-xl">
    <h4 className="font-black text-emerald-600 mb-2 tracking-wide uppercase text-sm">
      {stepData.author}
    </h4>
    <p className="text-lg font-bold text-gray-800 leading-snug">
      {stepData.text}
    </p>
    
    <div className="flex justify-between items-center mt-6">
      <span className={`text-xs font-black tracking-widest uppercase ${taskCompleted ? 'text-emerald-500' : 'text-gray-400'}`}>
        {taskCompleted ? "Task Done! Click Arrow ->" : stepData.actionText}
      </span>
      <button
        onClick={skipTour}
        className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors ml-4"
      >
        Skip Tour
      </button>
    </div>
    
    {/* The little speech bubble triangle */}
    <div className="absolute -left-3 top-0 w-0 h-0 border-t-[12px] border-t-black border-l-[12px] border-l-transparent hidden sm:block" />
    <div className="absolute -left-[6px] top-1 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent hidden sm:block" />
  </div>
</motion.div>

      </motion.div>
    </AnimatePresence>
  );
}