// Camera controller for the colony viewer.
//
// The camera is a center (cx, cy) plus a zoom level in the 800x620 SVG
// viewBox space, wrapped in Framer springs so every move is a smooth
// cinematic pan/zoom (never an instant jump). The springs feed a transform
// that is clamped against the current colony frame every frame, so the
// colony can never be panned off-screen.
//
// Auto-follow: while `follow` is on (default, re-enabled on every scene
// change), starting an activity always centers the camera on its dig site so
// a freshly carved chamber is never hidden behind the bottom dock. A manual
// camera gesture (drag, zoom, minimap jump) only suppresses re-centering
// during an in-progress activity; the next activity click follows again. The
// follow toggle turns the behavior fully on/off.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { RefObject, PointerEvent as ReactPointerEvent } from 'react';
import type { ChamberSpec, ObstacleSpec, SceneAction } from '@/data';
import { COLONY_W, COLONY_H, type Pt } from './geometry';
import {
  activityFocus,
  clampCenter,
  clampZoom,
  computeFrame,
  visibleView,
  type ColonyFrame,
} from './focus';

const SPRING = { stiffness: 62, damping: 18, mass: 0.9 };

interface UseColonyCameraArgs {
  chambers: ChamberSpec[];
  visibleChamberIds: string[];
  shaftRevealed: boolean;
  obstacle: ObstacleSpec | null;
  activeActivity: SceneAction | null;
  plannedBottom: number;
  ventXs: number[];
}

export interface ColonyCamera {
  frame: ColonyFrame;
  x: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
  /** Visible viewport in viewBox units (feeds the minimap). */
  viewport: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    w: MotionValue<number>;
    h: MotionValue<number>;
  };
  follow: boolean;
  toggleFollow: () => void;
  centerOnActivity: () => void;
  flyTo: (x: number, y: number) => void;
  reset: () => void;
  intro: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  containerRef: RefObject<HTMLDivElement>;
  dragProps: {
    onPointerDown: (e: ReactPointerEvent) => void;
    onPointerMove: (e: ReactPointerEvent) => void;
    onPointerUp: () => void;
    onDoubleClick: () => void;
    onWheel: (e: React.WheelEvent) => void;
  };
}

export function useColonyCamera(args: UseColonyCameraArgs): ColonyCamera {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({
    w: COLONY_W,
    h: COLONY_H,
  });

  // The SVG is `slice`-fit, so only part of the viewBox is visible. The
  // camera frames/clamps against that visible region, not the full box.
  const view = useMemo(
    () => visibleView(containerSize.w, containerSize.h),
    [containerSize.w, containerSize.h],
  );
  const viewRef = useRef(view);
  viewRef.current = view;

  // Track container size so the visible region stays accurate on resize.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const frame = useMemo(
    () => computeFrame(args.chambers, args.visibleChamberIds, args.shaftRevealed, args.obstacle, view),
    [args.chambers, args.visibleChamberIds, args.shaftRevealed, args.obstacle, view],
  );
  const frameRef = useRef(frame);
  frameRef.current = frame;

  const argsRef = useRef(args);
  argsRef.current = args;

  // Camera center + zoom, spring-animated.
  const cx = useSpring(frame.defaultCenter.x, SPRING);
  const cy = useSpring(frame.defaultCenter.y, SPRING);
  const cz = useSpring(frame.fitZoom, SPRING);

  // Transform to the SVG <g> translate/scale, clamped every frame so the
  // colony never clips out of the viewport.
  const scale = useTransform([cx, cy, cz], (latest: number[]) =>
    clampZoom(latest[2], frameRef.current),
  );
  const posX = useTransform([cx, cy, scale], (latest: number[]) => {
    const z = latest[2];
    const p = clampCenter(latest[0], latest[1], frameRef.current, z, viewRef.current);
    return z * (COLONY_W / 2 - p.x);
  });
  const posY = useTransform([cx, cy, scale], (latest: number[]) => {
    const z = latest[2];
    const p = clampCenter(latest[0], latest[1], frameRef.current, z, viewRef.current);
    return z * (COLONY_H / 2 - p.y);
  });

  const viewport = {
    x: useTransform(
      [cx, cy, scale],
      (latest: number[]) =>
        clampCenter(latest[0], latest[1], frameRef.current, latest[2], viewRef.current).x -
        viewRef.current.w / (2 * latest[2]),
    ),
    y: useTransform(
      [cx, cy, scale],
      (latest: number[]) =>
        clampCenter(latest[0], latest[1], frameRef.current, latest[2], viewRef.current).y -
        viewRef.current.h / (2 * latest[2]),
    ),
    w: useTransform([cx, cy, scale], (latest: number[]) => viewRef.current.w / latest[2]),
    h: useTransform([cx, cy, scale], (latest: number[]) => viewRef.current.h / latest[2]),
  };

  const setTarget = useCallback(
    (x: number, y: number, z: number) => {
      const zz = clampZoom(z, frameRef.current);
      const p = clampCenter(x, y, frameRef.current, zz, viewRef.current);
      cz.set(zz);
      cx.set(p.x);
      cy.set(p.y);
    },
    [cx, cy, cz],
  );

  const [follow, setFollow] = useState(true);
  const followRef = useRef(follow);
  followRef.current = follow;
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (follow) userInteractedRef.current = false;
  }, [follow]);

  const toggleFollow = useCallback(() => setFollow((f) => !f), []);

  const currentFocus = useCallback(() => {
    const a = argsRef.current;
    return activityFocus(a.activeActivity, a.chambers, a.obstacle, a.plannedBottom, a.ventXs);
  }, []);

  // Target for a dig site: zoom to ~1.18x fit and bias the camera center just
  // BELOW the site, so the site sits above screen center — clear of the
  // narration/activity dock that overlays the bottom of the screen.
  const focusTarget = useCallback((f: Pt): Pt => {
    const fr = frameRef.current;
    const z = clampZoom(fr.fitZoom * 1.18, fr);
    const bias = (viewRef.current.h / (2 * z)) * 0.2;
    return { x: f.x, y: f.y + bias };
  }, []);

  // Auto-follow the dig site. A freshly started activity ALWAYS centers the
  // camera on where it happens (so new chambers are never hidden behind the
  // bottom dock); a mid-scene chamber reveal re-centers only while the user
  // has not taken over the camera with a manual gesture.
  const lastFollowActivityRef = useRef<string | null>(null);
  useEffect(() => {
    if (!followRef.current) return;
    const a = argsRef.current.activeActivity;
    const f = currentFocus();
    const isNewActivity = !!a && a.id !== lastFollowActivityRef.current;
    if (isNewActivity && f) {
      lastFollowActivityRef.current = a.id;
      const t = focusTarget(f);
      setTarget(t.x, t.y, clampZoom(frameRef.current.fitZoom * 1.18, frameRef.current));
    } else if (!isNewActivity && !userInteractedRef.current && f) {
      const t = focusTarget(f);
      setTarget(t.x, t.y, clampZoom(frameRef.current.fitZoom * 1.18, frameRef.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.activeActivity, args.visibleChamberIds]);

  const centerOnActivity = useCallback(() => {
    const f = currentFocus();
    const fr = frameRef.current;
    if (f) {
      const t = focusTarget(f);
      setTarget(t.x, t.y, clampZoom(fr.fitZoom * 1.18, fr));
    } else setTarget(fr.defaultCenter.x, fr.defaultCenter.y, fr.fitZoom);
  }, [setTarget, currentFocus, focusTarget]);

  const flyTo = useCallback(
    (x: number, y: number) => {
      setTarget(x, y, cz.get());
      userInteractedRef.current = true;
    },
    [setTarget, cz],
  );

  const reset = useCallback(() => {
    const fr = frameRef.current;
    setTarget(fr.defaultCenter.x, fr.defaultCenter.y, fr.fitZoom);
  }, [setTarget]);

  const intro = useCallback(() => {
    // Defer one frame so scene-change state has settled and frameRef holds
    // the frame for the NEW scene before we compute the intro shot.
    window.requestAnimationFrame(() => {
      const fr = frameRef.current;
      const z = clampZoom(fr.fitZoom * 1.15, fr);
      cx.jump(fr.defaultCenter.x);
      cy.jump(fr.defaultCenter.y - 150);
      cz.jump(z);
      // A new scene re-enables auto-follow so every fresh dig site gets
      // centered — the previous scene may have turned it off.
      userInteractedRef.current = false;
      lastFollowActivityRef.current = null;
      setFollow(true);
      setTarget(fr.defaultCenter.x, fr.defaultCenter.y, fr.fitZoom);
    });
  }, [cx, cy, cz, setTarget]);

  const zoomBy = useCallback(
    (factor: number) => {
      const next = clampZoom(cz.get() * factor, frameRef.current);
      cz.set(next);
      // Manual gestures suppress mid-scene recentering, but never stop a
      // freshly started activity from bringing its dig site into view.
      userInteractedRef.current = true;
    },
    [cz],
  );
  const zoomIn = useCallback(() => zoomBy(1.35), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(1 / 1.35), [zoomBy]);

  const dragRef = useRef<{ sx: number; sy: number; cx: number; cy: number; moved: boolean } | null>(null);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      dragRef.current = { sx: e.clientX, sy: e.clientY, cx: cx.get(), cy: cy.get(), moved: false };
    },
    [cx, cy],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 3) return;
      // Only capture once a real drag starts so simple clicks still reach
      // the chambers below.
      if (!d.moved) {
        d.moved = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const vpp = Math.min(COLONY_W / rect.width, COLONY_H / rect.height);
      const z = clampZoom(cz.get(), frameRef.current);
      const dx = ((e.clientX - d.sx) * vpp) / z;
      const dy = ((e.clientY - d.sy) * vpp) / z;
      const p = clampCenter(d.cx - dx, d.cy - dy, frameRef.current, z);
      cx.jump(p.x);
      cy.jump(p.y);
    },
    [cx, cy, cz],
  );

  const onPointerUp = useCallback(() => {
    if (dragRef.current) {
      if (dragRef.current.moved) {
        userInteractedRef.current = true;
      }
      dragRef.current = null;
    }
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const z = clampZoom(cz.get(), frameRef.current);
      const zNext = clampZoom(z * factor, frameRef.current);
      if (zNext === z) return;
      // ViewBox coordinate currently under the cursor.
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const vx = COLONY_W / 2 + (mx - posX.get() - rect.width / 2) / z;
      const vy = COLONY_H / 2 + (my - posY.get() - rect.height / 2) / z;
      const posXNext = mx - rect.width / 2 - (vx - COLONY_W / 2) * zNext;
      const posYNext = my - rect.height / 2 - (vy - COLONY_H / 2) * zNext;
      userInteractedRef.current = true;
      setFollow(false);
      setTarget(COLONY_W / 2 - posXNext / zNext, COLONY_H / 2 - posYNext / zNext, zNext);
    },
    [cz, posX, posY, setTarget],
  );

  const onDoubleClick = useCallback(() => reset(), [reset]);

  return {
    frame,
    x: posX,
    y: posY,
    scale,
    viewport,
    follow,
    toggleFollow,
    centerOnActivity,
    flyTo,
    reset,
    intro,
    zoomIn,
    zoomOut,
    containerRef,
    dragProps: { onPointerDown, onPointerMove, onPointerUp, onDoubleClick, onWheel },
  };
}
