// Compact minimap of the colony cross-section. Mirrors the same 800x620
// viewBox as the main renderer: soil band, visible chambers, shaft, bedrock,
// and a live viewport rectangle that tracks the camera. Clicking anywhere
// jumps the camera to that point.

import { motion } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { ChamberSpec, ObstacleSpec } from '@/data';
import {
  COLONY_W,
  COLONY_H,
  SURFACE_Y,
  SHAFT_X,
  ROW_H,
  CHAMBER_RX,
  CHAMBER_RY,
  GALLERY_RX,
  GALLERY_RY,
  chamberCenter,
  isGallery,
  shaftBottomY,
} from './geometry';

interface ColonyMinimapProps {
  chambers: ChamberSpec[];
  visibleChamberIds: string[];
  shaftRevealed: boolean;
  obstacle: ObstacleSpec | null;
  viewport: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    w: MotionValue<number>;
    h: MotionValue<number>;
  };
  onJump: (x: number, y: number) => void;
}

export default function ColonyMinimap({
  chambers,
  visibleChamberIds,
  shaftRevealed,
  obstacle,
  viewport,
  onJump,
}: ColonyMinimapProps) {
  const bottom = shaftBottomY(chambers, visibleChamberIds, shaftRevealed, obstacle);
  const rockY = obstacle ? SURFACE_Y + obstacle.depth * ROW_H : null;

  const handleClick = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * COLONY_W;
    const y = ((e.clientY - rect.top) / rect.height) * COLONY_H;
    onJump(x, y);
  };

  return (
    <svg
      viewBox={`0 0 ${COLONY_W} ${COLONY_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      onClick={handleClick}
      style={{ cursor: 'crosshair', touchAction: 'manipulation' }}
      aria-label="Colony minimap — click to jump the camera"
    >
      {/* soil backdrop */}
      <rect x={0} y={0} width={COLONY_W} height={COLONY_H} fill="#1c1208" opacity={0.9} />
      <rect x={0} y={SURFACE_Y} width={COLONY_W} height={COLONY_H - SURFACE_Y} fill="#2c1d12" />
      <rect x={0} y={SURFACE_Y - 3} width={COLONY_W} height={3} fill="#2f4a2e" />

      {/* chambers */}
      {chambers
        .filter((c) => visibleChamberIds.includes(c.id))
        .map((c) => {
          const center = chamberCenter(c);
          const rx = isGallery(c) ? GALLERY_RX : CHAMBER_RX;
          const ry = isGallery(c) ? GALLERY_RY : CHAMBER_RY;
          return (
            <ellipse
              key={c.id}
              cx={center.x}
              cy={center.y}
              rx={rx}
              ry={ry}
              fill="#5b4128"
              stroke="#3a2a18"
              strokeWidth={1}
            />
          );
        })}

      {/* shaft */}
      <line
        x1={SHAFT_X}
        y1={SURFACE_Y}
        x2={SHAFT_X}
        y2={bottom}
        stroke="#1d1208"
        strokeWidth={4}
      />

      {/* bedrock */}
      {rockY !== null && (
        <rect x={0} y={rockY - 6} width={COLONY_W} height={12} fill="#4a4a52" opacity={0.9} />
      )}

      {/* camera viewport */}
      <motion.rect
        x={viewport.x}
        y={viewport.y}
        width={viewport.w}
        height={viewport.h}
        fill="#fbbf24"
        fillOpacity={0.14}
        stroke="#fbbf24"
        strokeWidth={2}
        rx={4}
      />
    </svg>
  );
}
