// Cinematic photograph stage for the reality-bridge scenes (10–12).
//
// Renders a framed, responsive image card that fades in with a slow Ken Burns
// zoom, a soft vignette, and a caption. Photos cross-fade as narration
// advances (driven by `activeIndex`); an optional compare layout shows two
// photos side by side so the learner can answer "what changed" questions.
// The whole stage sits above the colony background and is decorative
// (pointer-events: none), so it never blocks camera panning.

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SceneImage } from '@/data';

interface PhotoStageProps {
  images: SceneImage[];
  /** Index of the photo to highlight (clamped by the caller). */
  activeIndex: number;
  /** Show two photos side by side (comparison). */
  compare?: boolean;
  /** True while an activity is running → gentle focus pulse. */
  active?: boolean;
  /** Shrink the stage so the bottom dock never overlaps it. */
  compact?: boolean;
}

const KEN_BURNS = {
  scale: [1.05, 1.14],
  opacity: 1,
};

export default function PhotoStage({ images, activeIndex, compare = false, active = false, compact = false }: PhotoStageProps) {
  // Warm the browser cache so cross-fades are smooth.
  useEffect(() => {
    images.forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
  }, [images]);

  const current = images[Math.min(activeIndex, images.length - 1)];
  const pair = useMemo(() => images.slice(0, 2), [images]);

  if (images.length === 0) return null;

  const height = compact
    ? 'h-[22vh] max-h-[320px] sm:h-[32vh]'
    : 'h-[30vh] max-h-[430px] sm:h-[44vh]';
  const stage = `relative flex items-center justify-center overflow-hidden bg-[#1c1208] ${height}`;
  const frame = 'w-full overflow-hidden rounded-2xl border border-amber-200/15 bg-stone-900/70 p-2 shadow-2xl backdrop-blur';

  const vignette = (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)',
      }}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, scale: active ? 1.02 : 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="pointer-events-none relative z-10 mx-auto mt-3 w-[min(92vw,26rem)] sm:mt-4"
    >
      <div className={frame}>
        {compare && pair.length > 1 ? (
          <div className="grid grid-cols-2 gap-2">
            {pair.map((img) => (
              <figure key={img.id} className="min-w-0">
                <div className={stage}>
                  <motion.img
                    src={img.src}
                    alt={img.caption ?? ''}
                    className="max-h-full max-w-full object-contain"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={KEN_BURNS}
                    transition={{
                      opacity: { duration: 0.6 },
                      scale: { duration: 12, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
                    }}
                  />
                  {vignette}
                </div>
                {img.caption && (
                  <figcaption className="mt-1.5 text-center text-[10px] leading-tight text-stone-400 sm:text-xs">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <figure className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                className={stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.img
                  src={current.src}
                  alt={current.caption ?? ''}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={KEN_BURNS}
                  transition={{
                    opacity: { duration: 0.6 },
                    scale: { duration: 12, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
                  }}
                />
                {vignette}
              </motion.div>
            </AnimatePresence>
            {current.caption && (
              <figcaption className="mt-2 text-center text-xs leading-snug text-stone-400">
                {current.caption}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </motion.div>
  );
}
