import React from 'react';
import { motion } from 'framer-motion';
import {
  forestBgImage,
  workbenchCleanImage,
  firstFoxBgImage,
  twoFoxesBgImage,
  exhaustedBgImage,
  waxSealBgImage,
  blueprintSketchCleanImage,
  wireframeFoxBgImage,
  foxOnBenchBgImage,
} from '../assets/assets';

// Configuration for 8 ambient drifting glowing orbs
const orbs = [
  { id: 1, color: 'bg-amber-500', size: 'w-72 h-72', top: '10%', left: '5%', opacity: 'opacity-10', duration: 25 },
  { id: 2, color: 'bg-emerald-500', size: 'w-96 h-96', top: '50%', left: '70%', opacity: 'opacity-15', duration: 30 },
  { id: 3, color: 'bg-orange-500', size: 'w-64 h-64', top: '75%', left: '20%', opacity: 'opacity-10', duration: 22 },
  { id: 4, color: 'bg-lime-500', size: 'w-80 h-80', top: '20%', left: '80%', opacity: 'opacity-10', duration: 28 },
  { id: 5, color: 'bg-amber-400', size: 'w-96 h-96', top: '65%', left: '40%', opacity: 'opacity-15', duration: 32 },
  { id: 6, color: 'bg-emerald-400', size: 'w-64 h-64', top: '5%', left: '50%', opacity: 'opacity-10', duration: 24 },
  { id: 7, color: 'bg-orange-400', size: 'w-72 h-72', top: '80%', left: '85%', opacity: 'opacity-10', duration: 27 },
  { id: 8, color: 'bg-amber-500', size: 'w-64 h-64', top: '40%', left: '15%', opacity: 'opacity-10', duration: 29 },
];

export default function MagicalBackground({ currentStage = 'intro', isFoxSummoned = false }) {
  let activeBgImage = forestBgImage;
  let placeholderText = '';

  if (currentStage === 'molding_1') {
    activeBgImage = workbenchCleanImage || forestBgImage;
  } else if (currentStage === 'molding_2') {
    activeBgImage = firstFoxBgImage || workbenchCleanImage || forestBgImage;
  } else if (currentStage === 'molding_3') {
    activeBgImage = twoFoxesBgImage || firstFoxBgImage || forestBgImage;
  } else if (currentStage === 'exhaustion' || currentStage === 'exhausted') {
    activeBgImage = exhaustedBgImage || twoFoxesBgImage || forestBgImage;
  } else if (currentStage === 'eureka' || currentStage === 'epiphany') {
    activeBgImage = waxSealBgImage || exhaustedBgImage || forestBgImage;
  } else if (currentStage === 'fill_in_the_blank') {
    activeBgImage = blueprintSketchCleanImage || forestBgImage;
  } else if (currentStage === 'summoning' || currentStage === 'summoning_ritual') {
    activeBgImage = forestBgImage;
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden pointer-events-none z-0 select-none transition-all duration-700"
      style={{ backgroundImage: `url(${activeBgImage})` }}
    >
      {/* Dark subtle overlay for depth & readability */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Image Placeholder Watermark Badge (when rendering fallback image slots) */}
      {placeholderText && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/70 border border-emerald-400/40 text-emerald-300 font-mono text-xs backdrop-blur-md shadow-2xl z-20 pointer-events-auto">
          {placeholderText}
        </div>
      )}

      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.25, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className={`absolute rounded-full blur-3xl ${orb.color} ${orb.size} ${orb.opacity}`}
          style={{ top: orb.top, left: orb.left }}
        />
      ))}
    </div>
  );
}





