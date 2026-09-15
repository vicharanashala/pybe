import { useEffect, useRef, useState } from 'react';

/* ---------- small math helpers used by every act ---------- */
export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;

/** Remap p into 0→1 across the window [a, b]. Outside the window it saturates. */
export const range = (p, a, b) => clamp((p - a) / (b - a));

/** Standard ease-in-out — used for camera moves so nothing snaps. */
export const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Ease-out — used for things that arrive and settle (sprites, cards). */
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * How far the viewport has travelled through a tall section, 0 → 1.
 * 0 = the section's top just hit the top of the screen,
 * 1 = the section's bottom just reached the bottom of the screen.
 * Every scroll-driven animation in the journey is a pure function of this number,
 * which is what makes scrubbing backwards work for free.
 */
export function useScrollProgress(ref) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      if (travel <= 0) {
        setP(r.top <= 0 ? 1 : 0);
        return;
      }
      setP(clamp(-r.top / travel));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref]);

  return p;
}

/** True once the element has been anywhere near the viewport (one-way, for reveals). */
export function useHasEntered(ref, rootMargin = '0px 0px -15% 0px') {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setSeen(true);
      },
      { rootMargin, threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, seen]);

  return seen;
}

/** Reports `label` upward whenever this section owns the middle of the screen. */
export function useSectionLabel(ref, label, onActive) {
  const cb = useRef(onActive);
  cb.current = onActive;

  useEffect(() => {
    const el = ref.current;
    if (!el || !cb.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && cb.current) cb.current(label);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, label]);
}

/**
 * Deterministic pseudo-random from an integer seed (mulberry32).
 * Expedition outcomes need to survive re-renders and backwards scrubbing,
 * so they are derived from a seed rather than Math.random() at paint time.
 */
export function rngFrom(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Everything the scene needs to lay itself out at the current viewport.
 *
 * `centreOn(x)` is the whole camera: give it a position along the strip and it
 * returns the translateX that puts it in frame — nudged left of the code panel
 * on wide screens, dead centre on narrow ones where the panel is a bottom sheet.
 */
export function useFraming() {
  const [w, setW] = useState(typeof window === 'undefined' ? 1280 : window.innerWidth);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setW(window.innerWidth);
      });
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const wide = w > 860;
  /* Wide enough that neighbouring islands are most of a screen apart. */
  const stripWidth = Math.max(2800, w * 4.6);

  return {
    width: w,
    wide,
    stripWidth,
    /* where the sky ends (% of the stage), then where props sit within the
       water below it (% of the water's own height, at z = 0 and across z) */
    horizon: wide ? 30 : 15,
    top0: wide ? 14 : 8,
    span: wide ? 92 : 66,
    /* global sprite scale */
    scale: clamp(w / 1280, 0.6, 1),
    centreOn: (x) => w / 2 - (x / 100) * stripWidth + (wide ? -0.14 * w : 0),
  };
}


