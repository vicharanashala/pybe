// Reusable animated ant colony cross-section rendered as an SVG.
//
// The colony is one continuous vertical shaft at SHAFT_X. The deep chambers
// are bulbous pockets hollowed directly on the shaft, one below the next, so
// the shaft threads through them like beads on a string — no elbow
// connectors. The shallow side galleries (marked by an `x` fraction) are the
// only rooms that branch off, with a straight horizontal tunnel each, and
// they appear near the surface once the bedrock stops the downward dig.
//
// The shaft reaches exactly as far as the deepest revealed feature — and
// stops at the top of the base-case rock — so ants animated along the graph
// never travel outside the drawn tunnels.
//
// Progressive disclosure is driven by props: `visibleChamberIds` controls
// which chambers are drawn, `revealedLayers` gates shaft/eggs/food/larvae,
// and `ventilation`/`obstacle` gate the late-game features. Everything new
// grows in with an animation when it first appears.
//
// Excavation sync: a chamber is NOT walkable the moment it becomes visible.
// It passes through a short "digging" phase (rough pocket expanding outward,
// dust settling) before it settles into a smooth, glowing room. Ants only
// route into settled chambers, so the colony builds itself in story order.

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { ChamberSpec, ObstacleSpec, SceneAction } from '@/data';
import {
  COLONY_W,
  COLONY_H,
  SURFACE_Y,
  SHAFT_X,
  CHAMBER_RX,
  CHAMBER_RY,
  GALLERY_RX,
  GALLERY_RY,
  chamberCenter,
  isGallery,
  shaftBottomY,
  rockTopY,
  VENT_XS,
  type Pt,
} from './colony/geometry';
import AntWalker from './colony/AntWalker';
import type { AntPayload } from './colony/AntWalker';
import ObstacleBarrier from './colony/ObstacleBarrier';
import { activityFocus } from './colony/focus';

interface AntColonyProps {
  ants: number;
  chambers: ChamberSpec[];
  visibleChamberIds: string[];
  eggs: number;
  larvae: number;
  ventilation: boolean;
  obstacle: ObstacleSpec | null;
  /** Layers currently revealed: 'shaft' | 'eggs' | 'food' | 'larvae'. */
  revealedLayers: string[];
  activeActivity: SceneAction | null;
  highlightedChamber: string | null;
  /** The founding chamber's clutch was laid in a previous scene and stays
   *  visible even before this scene reveals the eggs layer. */
  foundingEggsSettled: boolean;
  onChamberClick: (chamber: ChamberSpec) => void;
  /** Optional cinematic camera applied to the whole scene. */
  camera?: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    scale: MotionValue<number>;
  };
}

interface Ant {
  id: number;
  pts: Pt[];
  dur: number;
  delay: number;
  scale: number;
  payload?: AntPayload;
}

const EXCAVATE_MS = 2200;
// How far the camera can translate the colony before the viewBox edge shows.
// The colony sits on the left of the 800-wide viewBox, so centering it pushes
// everything right; the sky/soil background must extend at least this far in
// every direction or a black void appears at the edges of the screen.
const BG_MARGIN = 700;

// Build ants that only ever walk along rendered tunnels: down the shaft, into
// a settled chamber (a pocket on the shaft, or a side gallery), and back out.
// A subset patrols the length of the open shaft, turning around at the
// deepest reach — the bedrock top once the base case is revealed.
//
// Each tour ant is bound to a FIXED slot in the (depth/side-sorted) chamber
// list, so revealing a new chamber only changes the routes of the ants whose
// slot matches it — the rest keep their current tunnel route untouched.
//
// Some ants carry a payload into chambers that hold it: eggs into the
// nursery, seeds into the store room.
function buildAnts(
  count: number,
  chambers: ChamberSpec[],
  settledChamberIds: string[],
  turnBottom: number,
  eggsRevealed: boolean,
  foodRevealed: boolean,
): Ant[] {
  const settled = new Set(settledChamberIds);
  const ordered = [...chambers].sort(
    (a, b) => a.depth - b.depth || (a.side === b.side ? 0 : a.side === 'left' ? -1 : 1),
  );
  const ants: Ant[] = [];
  const topY = SURFACE_Y - 8;
  for (let i = 0; i < count; i++) {
    const target = ordered.length > 0 && i % 3 !== 0 ? ordered[(i + 1) % ordered.length] : null;
    if (target && settled.has(target.id)) {
      const center = chamberCenter(target);
      const junction: Pt = { x: SHAFT_X, y: center.y };
      const onShaft = junction.x === center.x && junction.y === center.y;
      const pts: Pt[] = onShaft
        ? [{ x: SHAFT_X, y: topY }, center]
        : i % 2 === 0
          ? [junction, center, junction]
          : [{ x: SHAFT_X, y: topY }, junction, center, junction, { x: SHAFT_X, y: topY }];
      let payload: AntPayload | undefined;
      if (target.id === 'nursery' && eggsRevealed && i % 2 === 0) payload = 'egg';
      else if (target.id === 'food' && foodRevealed && i % 2 === 0) payload = 'seed';
      ants.push({ id: i, pts, dur: 6 + (i % 4) * 0.7, delay: (i % 6) * 0.5, scale: 0.8 + (i % 3) * 0.1, payload });
    } else {
      const pts: Pt[] =
        i % 2 === 0
          ? [{ x: SHAFT_X, y: topY }, { x: SHAFT_X, y: turnBottom }]
          : [{ x: SHAFT_X, y: turnBottom }, { x: SHAFT_X, y: topY }];
      ants.push({ id: i, pts, dur: 5 + (i % 3), delay: (i % 5) * 0.6, scale: 0.8 + (i % 3) * 0.1 });
    }
  }
  return ants;
}

export default function AntColony({
  ants: antCount,
  chambers,
  visibleChamberIds,
  eggs,
  larvae,
  ventilation,
  obstacle,
  revealedLayers,
  activeActivity,
  highlightedChamber,
  foundingEggsSettled,
  onChamberClick,
  camera,
}: AntColonyProps) {
  const shaftRevealed = revealedLayers.includes('shaft');
  const eggsRevealed = revealedLayers.includes('eggs');
  const foodRevealed = revealedLayers.includes('food');
  const larvaeRevealed = revealedLayers.includes('larvae');

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [diggingIds, setDiggingIds] = useState<ReadonlySet<string>>(new Set());
  const prevVisibleRef = useRef<string[]>([]);
  const digTimersRef = useRef<number[]>([]);

  // Chambers that just became visible enter a short digging phase, then
  // settle. Ants only enter once settled.
  useEffect(() => {
    const prev = new Set(prevVisibleRef.current);
    const newlyAdded = visibleChamberIds.filter((id) => !prev.has(id));
    prevVisibleRef.current = visibleChamberIds;
    if (newlyAdded.length === 0) return;
    setDiggingIds((prevSet) => {
      const next = new Set(prevSet);
      newlyAdded.forEach((id) => next.add(id));
      return next;
    });
    const t = window.setTimeout(() => {
      setDiggingIds((prevSet) => {
        const next = new Set(prevSet);
        newlyAdded.forEach((id) => next.delete(id));
        return next;
      });
    }, EXCAVATE_MS);
    digTimersRef.current.push(t);
  }, [visibleChamberIds]);

  useEffect(() => {
    const timers = digTimersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const allIds = useMemo(() => chambers.map((c) => c.id), [chambers]);
  const plannedBottom = shaftBottomY(chambers, allIds, true, obstacle);
  const shaftBottom = shaftBottomY(chambers, visibleChamberIds, shaftRevealed, obstacle);
  const turnBottom = obstacle ? rockTopY(obstacle) : shaftBottom;
  const settledChamberIds = visibleChamberIds.filter((id) => !diggingIds.has(id));
  const ants = useMemo(
    () => buildAnts(antCount, chambers, settledChamberIds, turnBottom, eggsRevealed, foodRevealed),
    [antCount, chambers, settledChamberIds, turnBottom, eggsRevealed, foodRevealed],
  );
  const focus = activityFocus(activeActivity, chambers, obstacle, plannedBottom, VENT_XS);

  const emphasizedId = highlightedChamber ?? activeActivity?.chamberId ?? null;

  // Fallback identity camera when none is supplied (e.g. the title screen).
  const defaultCamX = useMotionValue(0);
  const defaultCamY = useMotionValue(0);
  const defaultCamScale = useMotionValue(1);
  const camX = camera?.x ?? defaultCamX;
  const camY = camera?.y ?? defaultCamY;
  const camScale = camera?.scale ?? defaultCamScale;

  const topY = SURFACE_Y - 8;
  const showVent = ventilation;

  return (
    <svg
      viewBox={`0 0 ${COLONY_W} ${COLONY_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Animated ant colony cross-section"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b3a2b" />
          <stop offset="100%" stopColor="#3a5a40" />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b4128" />
          <stop offset="55%" stopColor="#4a3320" />
          <stop offset="100%" stopColor="#2c1d12" />
        </linearGradient>
        <radialGradient id="chamberFill" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#7a5a38" />
          <stop offset="100%" stopColor="#4a3320" />
        </radialGradient>
        <radialGradient id="entranceGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#caa46a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#caa46a" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Everything below is under the cinematic camera */}
      <motion.g
        style={{ x: camX, y: camY, scale: camScale, transformBox: 'view-box', transformOrigin: '0 0' }}
      >
        {/* Sky / surface band — oversized so the camera can never pan past it */}
        <rect x={-BG_MARGIN} y={-BG_MARGIN} width={COLONY_W + 2 * BG_MARGIN} height={SURFACE_Y + BG_MARGIN} fill="url(#sky)" />
        <rect x={-BG_MARGIN} y={SURFACE_Y - 6} width={COLONY_W + 2 * BG_MARGIN} height={10} fill="#2f4a2e" />
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.path
            key={`grass-${i}`}
            d={`M ${i * ((COLONY_W + 2 * BG_MARGIN) / 70) - BG_MARGIN + 8} ${SURFACE_Y - 4} l ${i % 2 ? 2 : -2} -7 l ${i % 2 ? -2 : 3} 4`}
            stroke="#3f6b3a"
            strokeWidth={1.6}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, rotate: i % 2 ? 2 : -2 }}
            transition={{ duration: 0.6, delay: i * 0.02 }}
          />
        ))}

        {/* Soil mass — oversized for the same reason */}
        <rect
          x={-BG_MARGIN}
          y={SURFACE_Y}
          width={COLONY_W + 2 * BG_MARGIN}
          height={COLONY_H - SURFACE_Y + BG_MARGIN}
          fill="url(#soil)"
        />
        <g opacity={0.25} fill="#2c1d12">
          {Array.from({ length: 120 }).map((_, i) => (
            <circle
              key={`speck-${i}`}
              cx={((i * 53) % (COLONY_W + 2 * BG_MARGIN)) - BG_MARGIN}
              cy={SURFACE_Y + ((i * 37) % (COLONY_H + BG_MARGIN))}
              r={i % 3 ? 1.5 : 2.5}
            />
          ))}
        </g>

        {/* Entrance glow at the surface opening */}
        <circle cx={SHAFT_X} cy={SURFACE_Y} r={26} fill="url(#entranceGlow)" />

        {/* Main vertical shaft — regrows when its target depth increases */}
        <motion.path
          key={`shaft-${shaftBottom}`}
          d={`M ${SHAFT_X} ${topY} L ${SHAFT_X} ${shaftBottom}`}
          stroke="#1d1208"
          strokeWidth={12}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />

        {/* Ventilation shafts */}
        {showVent &&
          VENT_XS.map((vx, i) => {
            const bottom = SURFACE_Y + 120 + i * 90;
            return (
              <g key={`vent-${i}`}>
                <motion.path
                  d={`M ${vx} ${SURFACE_Y} L ${vx} ${bottom}`}
                  stroke="#2a1d11"
                  strokeWidth={4}
                  strokeDasharray="2 5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: i * 0.15 }}
                />
                <motion.circle
                  cx={vx}
                  cy={bottom - 20}
                  r={2}
                  fill="#cfe8d0"
                  opacity={0.5}
                  animate={{ cy: [bottom - 20, SURFACE_Y + 12], opacity: [0.5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                />
              </g>
            );
          })}

        {/* Base-case obstacle */}
        {obstacle && <ObstacleBarrier obstacle={obstacle} />}

        {/* Chambers: deep pockets on the shaft, plus shallow side galleries */}
        {chambers
          .filter((c) => visibleChamberIds.includes(c.id))
          .map((c, idx) => {
            const center = chamberCenter(c);
            const cy = center.y;
            const gallery = isGallery(c);
            const rx = gallery ? GALLERY_RX : CHAMBER_RX;
            const ry = gallery ? GALLERY_RY : CHAMBER_RY;
            const isHighlight = highlightedChamber === c.id;
            const digging = diggingIds.has(c.id);
            const emphasized = emphasizedId === c.id || hoveredId === c.id;
            return (
              <motion.g
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.06 }}
                onPointerEnter={() => setHoveredId(c.id)}
                onPointerLeave={() => setHoveredId((h) => (h === c.id ? null : h))}
              >
                {/* straight horizontal connector tunnel shaft -> gallery */}
                {gallery && (
                  <motion.path
                    d={`M ${SHAFT_X} ${cy} L ${center.x + (c.side === 'left' ? rx - 4 : -(rx - 4))} ${cy}`}
                    stroke="#1d1208"
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, delay: idx * 0.06 + 0.2 }}
                  />
                )}

                {/* chamber pocket */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 15, delay: idx * 0.06 + 0.35 }}
                  style={{ transformOrigin: `${center.x}px ${cy}px` }}
                >
                  {/* expanding rough pocket while the chamber is being dug */}
                  {digging && (
                    <motion.g
                      initial={{ scale: 0.15, opacity: 0 }}
                      animate={{ scale: [0.15, 1.04, 1], opacity: [0, 1, 1] }}
                      transition={{ duration: EXCAVATE_MS / 1000, ease: 'easeOut' }}
                      style={{ transformOrigin: `${center.x}px ${cy}px` }}
                    >
                      <ellipse
                        cx={center.x}
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        fill="#4a3320"
                        stroke="#8a6a42"
                        strokeWidth={1.5}
                        strokeDasharray="3 4"
                        strokeLinecap="round"
                      />
                      {Array.from({ length: 5 }).map((_, d) => (
                        <motion.circle
                          key={`dig-${d}`}
                          cx={center.x + (d % 2 ? 1 : -1) * (rx * 0.5)}
                          cy={cy + (d % 2 ? -1 : 1) * (ry * 0.6)}
                          r={1.6}
                          fill="#7a5a38"
                          animate={{ opacity: [0, 0.9, 0], y: [0, -8], x: [0, (d % 2 ? 5 : -5)] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.22, ease: 'easeOut' }}
                        />
                      ))}
                    </motion.g>
                  )}

                  {/* settled smooth chamber */}
                  <motion.ellipse
                    cx={center.x}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    fill="url(#chamberFill)"
                    stroke={isHighlight ? '#fbbf24' : '#3a2a18'}
                    strokeWidth={isHighlight ? 3 : 1.5}
                    filter="url(#soft)"
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{
                      opacity: digging ? 0 : 1,
                      scale: isHighlight ? [1, 1.06, 1] : 1,
                    }}
                    transition={
                      digging
                        ? { duration: 0.2 }
                        : { duration: 1.4, repeat: isHighlight ? Infinity : 0 }
                    }
                    style={{
                      transformOrigin: `${center.x}px ${cy}px`,
                      cursor: 'pointer',
                    }}
                    onClick={() => onChamberClick(c)}
                  />

                  {/* settled room glow fades in once the dust settles */}
                  {!digging && (
                    <motion.circle
                      cx={center.x}
                      cy={cy}
                      r={rx * 1.5}
                      fill="url(#entranceGlow)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.45 }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* context-aware label: emphasized or hovered, others fade */}
                  <g
                    style={{
                      pointerEvents: 'none',
                      opacity: emphasized ? 1 : 0.28,
                      transition: 'opacity 0.25s ease',
                    }}
                  >
                    <text
                      x={center.x}
                      y={gallery ? cy + ry + 20 : cy - ry - 14}
                      textAnchor="middle"
                      fontSize={emphasized ? 14 : 12.5}
                      fontWeight={emphasized ? 700 : 400}
                      fill={emphasized ? '#f3e6c8' : '#e8d9bf'}
                      style={{
                        fontFamily: 'ui-sans-serif, system-ui',
                        paintOrder: 'stroke',
                        stroke: 'rgba(12,8,4,0.55)',
                        strokeWidth: 3,
                      }}
                    >
                      {c.name}
                    </text>
                  </g>

                  {/* founding chamber holds the queen's first clutch — it
                      appears once the eggs are revealed, and stays put in
                      later scenes even before their egg step fires */}
                  {c.id === 'founding' && (eggsRevealed || foundingEggsSettled) && eggs > 0 && (
                    <g>
                      {Array.from({ length: Math.min(eggs, 8) }).map((_, e) => (
                        <motion.ellipse
                          key={`egg-${e}`}
                          cx={center.x - 26 + (e % 4) * 9}
                          cy={cy + 4 + Math.floor(e / 4) * 10}
                          rx={3}
                          ry={4}
                          fill="#f3e6c8"
                          initial={{ scale: 0, y: -10, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          transition={{ delay: e * 0.04 }}
                          style={{ transformOrigin: `${center.x - 26 + (e % 4) * 9}px ${cy + 4 + Math.floor(e / 4) * 10}px` }}
                        />
                      ))}
                    </g>
                  )}

                  {/* nursery eggs appear once they are carried in */}
                  {c.id === 'nursery' && eggsRevealed && eggs > 0 && (
                    <g>
                      {Array.from({ length: Math.min(eggs, 14) }).map((_, e) => (
                        <motion.ellipse
                          key={`egg-${e}`}
                          cx={center.x - 26 + (e % 7) * 8}
                          cy={cy + 6 + Math.floor(e / 7) * 9}
                          rx={3}
                          ry={4}
                          fill="#f3e6c8"
                          initial={{ scale: 0, y: -12, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          transition={{ delay: e * 0.04 }}
                          style={{ transformOrigin: `${center.x - 26 + (e % 7) * 8}px ${cy + 6 + Math.floor(e / 7) * 9}px` }}
                        />
                      ))}
                    </g>
                  )}

                  {/* brood larvae appear once tended */}
                  {c.id === 'brood' && larvaeRevealed && (
                    <g>
                      {Array.from({ length: Math.min(larvae, 10) }).map((_, l) => (
                        <motion.ellipse
                          key={`larva-${l}`}
                          cx={center.x - 24 + (l % 5) * 11}
                          cy={cy + 4 + Math.floor(l / 5) * 12}
                          rx={4.5}
                          ry={3}
                          fill="#d9c39a"
                          initial={{ scale: 0, y: -8, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1, rotate: l % 2 ? 10 : -10 }}
                          transition={{ delay: l * 0.05 }}
                          style={{ transformOrigin: `${center.x - 24 + (l % 5) * 11}px ${cy + 4 + Math.floor(l / 5) * 12}px` }}
                        />
                      ))}
                    </g>
                  )}

                  {/* food piles in the store room and pantry-like galleries */}
                  {(c.id === 'food' || (c.id.startsWith('gallery') && foodRevealed)) && foodRevealed && (
                    <g>
                      {Array.from({ length: c.id === 'food' ? 8 : 5 }).map((_, f) => (
                        <circle
                          key={`seed-${f}`}
                          cx={center.x - 20 + (f % 4) * 10}
                          cy={gallery ? cy + 6 : cy + 8 + Math.floor(f / 4) * 8}
                          r={3}
                          fill="#caa15a"
                        />
                      ))}
                    </g>
                  )}

                  {/* queen glyph */}
                  {c.id === 'queen' && (
                    <g>
                      <ellipse cx={center.x} cy={cy + 6} rx={9} ry={5.5} fill="#1c1208" />
                      <ellipse cx={center.x - 7} cy={cy + 6} rx={4} ry={3.4} fill="#3b2a1a" />
                    </g>
                  )}
                </motion.g>
              </motion.g>
            );
          })}

        {/* Carrying-soil motes at the surface (brigade activity) */}
        {activeActivity?.id === 'brigade' &&
          Array.from({ length: 6 }).map((_, i) => (
            <motion.circle
              key={`mote-${i}`}
              cx={SHAFT_X + 20}
              cy={SURFACE_Y - 4}
              r={2.4}
              fill="#6b4a2a"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: [0, 40 + i * 30], y: [0, -6 - (i % 2) * 4], opacity: [0, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}

        {/* Pheromone signal ripples (signal activity) */}
        {activeActivity?.id === 'signal' &&
          Array.from({ length: 3 }).map((_, i) => (
            <motion.circle
              key={`signal-${i}`}
              cx={SHAFT_X}
              cy={SURFACE_Y - 6}
              r={6}
              fill="none"
              stroke="#86efac"
              strokeWidth={2}
              initial={{ opacity: 0.7, scale: 0.4 }}
              animate={{ opacity: 0, scale: 4 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }}
              style={{ transformOrigin: `${SHAFT_X}px ${SURFACE_Y - 6}px` }}
            />
          ))}

        {/* Excavation dust at the dig/carve/probe site */}
        {focus &&
          activeActivity &&
          activeActivity.id !== 'signal' &&
          activeActivity.id !== 'brigade' &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.circle
              key={`dust-${i}`}
              cx={focus.x}
              cy={focus.y}
              r={2}
              fill="#7a5a38"
              animate={{ y: [0, -10 - (i % 3) * 6], x: [0, (i % 2 ? 1 : -1) * 6], opacity: [0.8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}

        {/* Procedurally crawling ants along rendered tunnels only */}
        <g>
          {ants.map((a) => (
            <AntWalker key={a.id} pts={a.pts} dur={a.dur} delay={a.delay} scale={a.scale} payload={a.payload} />
          ))}
        </g>
      </motion.g>
    </svg>
  );
}
