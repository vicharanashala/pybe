import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  introImage,
  fox3DTransparentImage,
  exhaustedImage,
  scrollImage,
  forestBlueprintSuccessImage,
  finalSummoningSuccessImage,
} from '../assets/assets';

function getStageImage(currentStage) {
  if (!currentStage || currentStage === 'intro') {
    return introImage;
  }
  if (currentStage === 'exhaustion' || currentStage === 'exhausted') {
    return exhaustedImage;
  }
  if (currentStage === 'blueprint_success' || currentStage === 'blueprint_forged') {
    return forestBlueprintSuccessImage;
  }
  if (currentStage === 'summoning' || currentStage === 'summoning_ritual') {
    return finalSummoningSuccessImage;
  }
  if (currentStage === 'epiphany' || currentStage === 'full_editor') {
    return scrollImage;
  }
  return null;
}

export default function ImageStage({ currentStage = 'intro' }) {
  const selectedImage = getStageImage(currentStage);
  const isIntro = !currentStage || currentStage === 'intro';
  const isSuccessStage =
    currentStage === 'blueprint_success' ||
    currentStage === 'blueprint_forged' ||
    currentStage === 'summoning' ||
    currentStage === 'summoning_ritual';

  if (!selectedImage) {
    return <div className="w-full h-full relative pointer-events-none select-none" />;
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center pointer-events-none select-none overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedImage || currentStage}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={
            isSuccessStage
              ? "relative rounded-2xl p-1 bg-[#2A1D13] border-4 border-[#5E8C31] shadow-[0_0_30px_rgba(94,140,49,0.5)] overflow-hidden max-h-[380px] w-auto"
              : isIntro
              ? "w-full h-full aspect-video object-cover rounded-t-2xl"
              : "max-h-[380px] w-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] object-contain relative z-10"
          }
        >
          <img
            src={selectedImage}
            alt={`Stage: ${currentStage}`}
            className="max-h-[360px] w-auto object-cover rounded-xl"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}