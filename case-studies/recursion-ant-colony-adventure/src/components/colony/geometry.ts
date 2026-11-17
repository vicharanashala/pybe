// Colony geometry helpers shared by the renderer and the ant animator.
// All coordinates live in the 800x620 SVG viewBox space.
//
// The colony is a single continuous vertical shaft at SHAFT_X. The deep
// chambers (founding, nursery, stores, brood, queen) are bulbous pockets
// hollowed DIRECTLY on the shaft — one below the next — so the shaft threads
// through them like beads on a string, with no elbow connectors. Depth is
// measured in integer "levels" (ROW_H pixels apart).
//
// The shallow side galleries are the exception: after the bedrock stops the
// downward dig, workers expand sideways near the surface. Galleries are
// horizontal rooms connected to the shaft by a straight horizontal tunnel
// (no elbows) and are marked by an `x` fraction (0-1) that spreads them out.

import type { ChamberSpec, ObstacleSpec } from '@/data';

export interface Pt {
  x: number;
  y: number;
}

export const COLONY_W = 800;
export const COLONY_H = 620;
export const SURFACE_Y = 90;
export const SHAFT_X = 280;
export const ROW_H = 76; // pixels per depth level
export const CHAMBER_RX = 56; // deep chamber pocket bulging on the shaft
export const CHAMBER_RY = 26;
export const GALLERY_RX = 40; // shallow horizontal gallery rooms
export const GALLERY_RY = 15;
export const GALLERY_GAP = 100; // lateral offset of the nearest gallery room
export const SIDE_SPREAD = 170; // extra lateral spread from a gallery's `x` fraction
export const GALLERY_RISE = 38; // galleries sit shallower than their nominal depth
export const ROCK_CLEARANCE = 20; // ants turn around this far above the bedrock top
// Horizontal positions of the narrow ventilation shafts, clustered on the
// (empty) right side of the main shaft so they read as part of the colony.
export const VENT_XS = [SHAFT_X + 60, SHAFT_X + 120, SHAFT_X + 180];

/** Galleries are horizontal rooms; everything else sits directly on the shaft. */
export function isGallery(c: ChamberSpec): boolean {
  return c.x !== undefined;
}

export function chamberCenter(c: ChamberSpec): Pt {
  if (isGallery(c)) {
    const cy = SURFACE_Y + c.depth * ROW_H - GALLERY_RISE;
    const offset = GALLERY_GAP + (c.x ?? 0) * SIDE_SPREAD;
    const cx = c.side === 'left' ? SHAFT_X - offset : SHAFT_X + offset;
    return { x: cx, y: cy };
  }
  return { x: SHAFT_X, y: SURFACE_Y + c.depth * ROW_H };
}

/**
 * Sample the point (and heading) a distance fraction `t` along a closed route
 * polyline. `t` is clamped into [0, 1). Segments are weighted by their real
 * length so an ant walking with linear progress moves at a constant speed.
 *
 * The polyline is treated as a loop: the last waypoint wraps back to the first
 * (skipped when it is zero-length, i.e. the route already ends where it
 * starts). Angles are unwrapped so consecutive headings never jump by more
 * than 180 degrees, which keeps the ant's `rotate` value continuous and
 * prevents it spinning on sharp turns or across the loop seam.
 */
export function pointAlongRoute(pts: Pt[], t: number): Pt & { angle: number } {
  const n = pts.length;
  if (n === 0) return { x: 0, y: 0, angle: 0 };
  if (n === 1) return { x: pts[0].x, y: pts[0].y, angle: 0 };

  // Build the segment list. The wrap-back segment (last -> first) is only
  // included when it has real length.
  const segs: { from: Pt; to: Pt; len: number; angle: number }[] = [];
  for (let i = 0; i < n; i++) {
    const from = pts[i];
    const to = pts[(i + 1) % n];
    const len = Math.hypot(to.x - from.x, to.y - from.y);
    if (len > 0) {
      segs.push({
        from,
        to,
        len,
        angle: Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI),
      });
    }
  }
  if (segs.length === 0) return { x: pts[0].x, y: pts[0].y, angle: 0 };

  // Unwrap angles so consecutive segments differ by at most 180 degrees,
  // including the wrap from the last segment back to the first.
  let prev = segs[0].angle;
  for (let i = 1; i < segs.length; i++) {
    let a = segs[i].angle;
    while (a - prev > 180) a -= 360;
    while (a - prev < -180) a += 360;
    segs[i].angle = a;
    prev = a;
  }
  let first = segs[0].angle;
  while (first - prev > 180) first -= 360;
  while (first - prev < -180) first += 360;
  segs[0].angle = first;

  const total = segs.reduce((sum, s) => sum + s.len, 0);
  let dist = ((t % 1) + 1) % 1 * total;
  for (const s of segs) {
    if (dist <= s.len) {
      const k = s.len === 0 ? 0 : dist / s.len;
      return {
        x: s.from.x + (s.to.x - s.from.x) * k,
        y: s.from.y + (s.to.y - s.from.y) * k,
        angle: s.angle,
      };
    }
    dist -= s.len;
  }
  const last = segs[segs.length - 1];
  return { x: last.to.x, y: last.to.y, angle: last.angle };
}

/**
 * How far the main shaft extends below the surface, based on what has been
 * revealed so far: the deepest visible chamber, plus (once the 'shaft' layer
 * is revealed) the full planned depth, plus the base-case obstacle when hit.
 * The shaft always stops just at the bedrock top when the rock is present, so
 * it never pokes through the base case.
 */
export function shaftBottomY(
  chambers: ChamberSpec[],
  visibleChamberIds: string[],
  shaftRevealed: boolean,
  obstacle: ObstacleSpec | null,
): number {
  let maxDepth = 0;
  for (const c of chambers) {
    if (shaftRevealed || visibleChamberIds.includes(c.id)) {
      maxDepth = Math.max(maxDepth, c.depth);
    }
  }
  if (obstacle) maxDepth = Math.max(maxDepth, obstacle.depth);
  if (maxDepth === 0) return SURFACE_Y + ROW_H - 10; // entrance stub only
  const bottom = SURFACE_Y + maxDepth * ROW_H + CHAMBER_RY + 8;
  return obstacle ? Math.min(bottom, SURFACE_Y + obstacle.depth * ROW_H - 18) : bottom;
}

/** Where patrolling ants turn around: just above the top edge of the rock. */
export function rockTopY(obstacle: ObstacleSpec): number {
  return SURFACE_Y + obstacle.depth * ROW_H - ROCK_CLEARANCE;
}
