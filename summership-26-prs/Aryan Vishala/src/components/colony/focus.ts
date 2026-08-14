// Camera framing and activity focus helpers for the colony viewer.
//
// The camera lives in the 800x620 SVG viewBox space and is described by a
// center point (cx, cy) plus a zoom level. These helpers resolve where an
// in-progress activity happens (so the camera can follow it) and where the
// colony actually sits (so the camera can clamp its pan/zoom and never drift
// off into empty soil).

import type { ChamberSpec, ObstacleSpec, SceneAction } from '@/data';
import {
  COLONY_W,
  COLONY_H,
  SURFACE_Y,
  SHAFT_X,
  ROW_H,
  CHAMBER_RX,
  CHAMBER_RY,
  GALLERY_RX,
  chamberCenter,
  isGallery,
  shaftBottomY,
  type Pt,
} from './geometry';

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ColonyFrame {
  bounds: Bounds;
  /** Zoom that fits the whole colony on screen. */
  fitZoom: number;
  minZoom: number;
  maxZoom: number;
  /** Center of the colony (for reset / intro shots). */
  defaultCenter: Pt;
}

/**
 * The fraction of the 800x620 viewBox actually visible inside the container.
 * The SVG uses `preserveAspectRatio="xMidYMid slice"`, which crops the
 * vertical extent on wide screens (and the horizontal on tall ones), so the
 * camera must clamp against the *visible* region, not the whole viewBox.
 */
export function visibleView(containerW: number, containerH: number): { w: number; h: number } {
  if (!containerW || !containerH) return { w: COLONY_W, h: COLONY_H };
  const sliceW = (containerW / containerH) * COLONY_H; // viewBox width if height-driven
  const sliceH = (containerH / containerW) * COLONY_W; // viewBox height if width-driven
  // slice picks the LARGER scale, i.e. the SMALLER visible dimension.
  if (sliceW <= COLONY_W) return { w: sliceW, h: COLONY_H };
  return { w: COLONY_W, h: sliceH };
}

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Where an in-progress activity is throwing its dust, so the camera can
 * center on the actual dig site instead of always at the surface.
 */
export function activityFocus(
  active: SceneAction | null,
  chambers: ChamberSpec[],
  obstacle: ObstacleSpec | null,
  plannedBottom: number,
  ventXs: number[],
): Pt | null {
  if (!active) return null;
  if (active.chamberId) {
    const c = chambers.find((x) => x.id === active.chamberId);
    if (c) return chamberCenter(c);
  }
  if (active.id === 'signal' || active.id === 'brigade') return { x: SHAFT_X, y: SURFACE_Y - 6 };
  if (active.id === 'vent') return { x: ventXs[1], y: SURFACE_Y + 40 };
  if (active.id === 'probe' && obstacle) return { x: SHAFT_X, y: SURFACE_Y + obstacle.depth * ROW_H - 16 };
  if (active.id === 'dig') return { x: SHAFT_X, y: plannedBottom - 20 };
  if (active.id === 'hatch' || active.id === 'inspect' || active.id === 'found')
    return { x: SHAFT_X, y: SURFACE_Y + 30 };
  // Stocking activities ("move the eggs in", "stockpile food", "tend the
  // larvae") carry no chamberId but fill a specific room — aim at it.
  const revealTarget: Record<string, string> = { eggs: 'nursery', food: 'food', larvae: 'brood' };
  const rel = active.reveals;
  if (rel) {
    const layers = Array.isArray(rel) ? rel : [rel];
    const target = layers.find((l) => revealTarget[l]);
    if (target) {
      const c = chambers.find((x) => x.id === revealTarget[target]);
      if (c) return chamberCenter(c);
    }
  }
  return null;
}

/**
 * The rectangle the colony actually occupies (visible chambers, the shaft,
 * the surface band and the bedrock top once present). The camera clamps its
 * pan so the whole colony stays on screen.
 */
export function colonyBounds(
  chambers: ChamberSpec[],
  visibleChamberIds: string[],
  shaftRevealed: boolean,
  obstacle: ObstacleSpec | null,
): Bounds {
  const visible = chambers.filter(
    (c) => shaftRevealed || visibleChamberIds.includes(c.id),
  );

  let minX = SHAFT_X;
  let maxX = SHAFT_X;
  let maxCenterY = SURFACE_Y;
  for (const c of visible) {
    const center = chamberCenter(c);
    const rx = isGallery(c) ? GALLERY_RX : CHAMBER_RX;
    minX = Math.min(minX, center.x - rx);
    maxX = Math.max(maxX, center.x + rx);
    maxCenterY = Math.max(maxCenterY, center.y);
  }

  // Shaft width keeps the camera from clipping the main tunnel.
  minX = Math.min(minX, SHAFT_X - 8);
  maxX = Math.max(maxX, SHAFT_X + 8);

  const bottom = shaftBottomY(chambers, visibleChamberIds, shaftRevealed, obstacle);
  let maxY = Math.max(maxCenterY + CHAMBER_RY + 14, bottom + 10);
  if (obstacle) maxY = Math.max(maxY, SURFACE_Y + obstacle.depth * ROW_H + 16);

  return {
    minX,
    maxX,
    minY: SURFACE_Y - 46, // a little sky so the entrance glow reads
    maxY,
  };
}

/** Clamp a zoom level into the colony's allowed range. */
export function clampZoom(z: number, frame: ColonyFrame): number {
  return clamp(z, frame.minZoom, frame.maxZoom);
}

/**
 * Clamp a camera center so the viewport can roam over the colony plus a small
 * margin of surrounding soil. The margin (not a hard colony-edge clamp) lets
 * the camera center on a deep dig site even when that scrolls the surface out
 * of view; the colony viewer paints an oversized background so no void shows.
 */
export function clampCenter(
  cx: number,
  cy: number,
  frame: ColonyFrame,
  zoom: number,
  view: { w: number; h: number } = { w: COLONY_W, h: COLONY_H },
  margin = 220,
): Pt {
  const b = frame.bounds;
  const halfW = view.w / (2 * zoom);
  const halfH = view.h / (2 * zoom);
  const loX = b.minX - margin + halfW;
  const hiX = b.maxX + margin - halfW;
  const loY = b.minY - margin + halfH;
  const hiY = b.maxY + margin - halfH;
  return {
    x: loX > hiX ? (loX + hiX) / 2 : clamp(cx, loX, hiX),
    y: loY > hiY ? (loY + hiY) / 2 : clamp(cy, loY, hiY),
  };
}

/** Build the framing rectangle and zoom limits from the current colony. */
export function computeFrame(
  chambers: ChamberSpec[],
  visibleChamberIds: string[],
  shaftRevealed: boolean,
  obstacle: ObstacleSpec | null,
  view: { w: number; h: number } = { w: COLONY_W, h: COLONY_H },
): ColonyFrame {
  const bounds = colonyBounds(chambers, visibleChamberIds, shaftRevealed, obstacle);
  const contentW = Math.max(bounds.maxX - bounds.minX, 160);
  const contentH = Math.max(bounds.maxY - bounds.minY, 160);
  const rawFit = Math.min(view.w / contentW, view.h / contentH);
  const maxZoom = 2.6;
  // Default view fits the whole colony, but never so close that a nearly
  // empty early scene stares at a single dirt speck.
  const fitZoom = Math.min(rawFit, 1.6);
  return {
    bounds,
    fitZoom,
    minZoom: clamp(fitZoom * 0.9, 0.8, 1.4),
    maxZoom,
    defaultCenter: {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    },
  };
}
