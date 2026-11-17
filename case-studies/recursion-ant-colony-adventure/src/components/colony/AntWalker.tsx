// One ant walking along a closed tunnel route. Instead of keyframe-animating
// x/y/rotate (which lets framer-motion interpolate diagonally across open soil
// when a route is rebuilt), the ant animates a single scalar progress value
// and its position is always derived from the route polyline via
// `pointAlongRoute`. The ant is therefore constrained to the tunnel network
// by construction, and a route change simply re-projects it onto the new path.
//
// An ant may carry a payload — an egg or a seed — rendered just ahead of its
// head so it looks like it is transporting food or brood along the tunnels.

import { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import type { Pt } from './geometry';
import { pointAlongRoute } from './geometry';
import AntGlyph from './AntGlyph';

export type AntPayload = 'egg' | 'seed';

interface AntWalkerProps {
  pts: Pt[];
  dur: number;
  delay: number;
  scale: number;
  payload?: AntPayload;
}

export default function AntWalker({ pts, dur, delay, scale, payload }: AntWalkerProps) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: dur,
      repeat: Infinity,
      ease: 'linear',
      delay,
    });
    return () => controls.stop();
  }, [progress, dur, delay]);

  const pos = useTransform(progress, (t) => pointAlongRoute(pts, t));
  const x = useTransform(pos, (p) => p.x);
  const y = useTransform(pos, (p) => p.y);
  const rotate = useTransform(pos, (p) => p.angle);

  return (
    <motion.g style={{ x, y, rotate }}>
      <AntGlyph scale={scale} />
      {payload && (
        <g transform={`scale(${scale})`}>
          {payload === 'egg' ? (
            <ellipse cx={6.2} cy={-0.6} rx={2.1} ry={2.8} fill="#f3e6c8" stroke="#d9c39a" strokeWidth={0.4} />
          ) : (
            <circle cx={6.2} cy={-0.4} r={2.2} fill="#caa15a" stroke="#8a6a2f" strokeWidth={0.4} />
          )}
        </g>
      )}
    </motion.g>
  );
}
