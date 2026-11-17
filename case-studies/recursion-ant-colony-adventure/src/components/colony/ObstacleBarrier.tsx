// The base-case obstacle: a slab of rock that stops the digging. Rendered
// across the main shaft with a jagged top edge and a few mineral veins.

import { motion } from 'framer-motion';
import type { ObstacleSpec } from '@/data';
import { SURFACE_Y, SHAFT_X, ROW_H } from './geometry';

interface ObstacleBarrierProps {
  obstacle: ObstacleSpec;
}

export default function ObstacleBarrier({ obstacle }: ObstacleBarrierProps) {
  const y = SURFACE_Y + obstacle.depth * ROW_H;

  return (
    <motion.g
      initial={{ opacity: 0, y: -14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 16 }}
      style={{ transformOrigin: `${SHAFT_X}px ${y}px` }}
    >
      {/* jagged bedrock slab spanning the full width of the cross-section */}
      <motion.path
        d={`M 24 ${y + 4}
            L 80 ${y - 16}
            L 150 ${y - 6}
            L 220 ${y - 18}
            L 290 ${y - 8}
            L 360 ${y - 14}
            L 430 ${y - 5}
            L 500 ${y - 17}
            L 570 ${y - 7}
            L 640 ${y - 15}
            L 710 ${y - 4}
            L 776 ${y - 12}
            L 776 ${y + 18}
            L 700 ${y + 9}
            L 630 ${y + 16}
            L 560 ${y + 8}
            L 490 ${y + 15}
            L 420 ${y + 7}
            L 350 ${y + 14}
            L 280 ${y + 6}
            L 210 ${y + 16}
            L 140 ${y + 8}
            L 70 ${y + 15}
            L 24 ${y + 6} Z`}
        fill="#4a4a52"
        stroke="#2b2b31"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      {/* mineral veins */}
      <g stroke="#5d5d68" strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.9}>
        <path d={`M ${SHAFT_X - 44} ${y - 6} q 10 4 18 -2`} />
        <path d={`M ${SHAFT_X + 6} ${y + 8} q 12 -4 22 2`} />
        <path d={`M 130 ${y - 2} q 16 6 30 0`} />
        <path d={`M 560 ${y - 4} q -14 6 -28 0`} />
      </g>
      {/* impact spark when it first appears */}
      <motion.circle
        cx={SHAFT_X}
        cy={y - 8}
        r={5}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={2}
        initial={{ opacity: 0.9, scale: 0.4 }}
        animate={{ opacity: 0, scale: 2.6 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ transformOrigin: `${SHAFT_X}px ${y - 8}px` }}
      />
    </motion.g>
  );
}
