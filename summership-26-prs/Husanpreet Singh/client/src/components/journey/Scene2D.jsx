import React from 'react';

/* =========================================================
   Scene2D — a flat, side-scrolling sea.

   Everything is plain 2D: a sky band, a horizon, and a wide
   strip of water that slides sideways as the story moves down
   the page. Depth is suggested the way a 2D game suggests it —
   things further "back" sit higher on the water and are drawn
   a little smaller — and the wave layers behind and in front of
   the actors travel at different speeds for parallax.

   Coordinates:
     x — position along the strip, 0 → 100
     z — how near the front the prop sits, 0 (far) → 100 (near)
   ========================================================= */

export default function Scene2D({
  panX = 0,
  horizon = 30,
  top0 = 8,
  span = 78,
  scale = 1,
  stripWidth = 4800,
  sky = 'day',
  className = '',
  children,
}) {
  return (
    <div
      className={`jr-scene jr-sky-${sky} ${className}`}
      style={{
        '--jr-h': horizon,
        '--jr-t0': top0,
        '--jr-span': span,
        '--jr-scale': scale,
        '--jr-strip-w': `${stripWidth}px`,
      }}
    >
      <div className="jr-sky" />
      <div className="jr-sun" />
      <div className="jr-clouds" style={{ transform: `translateX(${panX * 0.1}px)` }} />
      <div className="jr-horizon" />

      <div className="jr-sea">
        <div className="jr-glitter" />
        <div className="jr-band jr-band-far" style={{ transform: `translateX(${panX * 0.35}px)` }} />
        <div className="jr-band jr-band-mid" style={{ transform: `translateX(${panX * 0.62}px)` }} />

        <div className="jr-strip" style={{ transform: `translateX(${panX}px)` }}>
          {children}
        </div>

        <div className="jr-band jr-band-near" style={{ transform: `translateX(${panX * 1.35}px)` }} />
      </div>
    </div>
  );
}

/** A thing standing on the water at (x, z). Its base sits on the waterline. */
export function Prop({ x, z, width, lift = 0, shadow = 0, className = '', style, children }) {
  const depth = 0.62 + (z / 100) * 0.86;
  return (
    <div
      className={`jr-anchor ${className}`}
      style={{
        left: `${x}%`,
        top: `calc((var(--jr-t0) + var(--jr-span) * ${z} / 100) * 1%)`,
        zIndex: 100 + Math.round(z),
        ...style,
      }}
    >
      {shadow > 0 && (
        <div
          className="jr-shadow"
          style={{ width: `${shadow * depth}px`, height: `${shadow * depth * 0.26}px` }}
        />
      )}
      <div
        className="jr-art"
        style={{
          width: `${width}px`,
          transform: `translateX(-50%) scale(calc(${depth} * var(--jr-scale))) translateY(${-lift}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A flat mark painted on the water — a wake, a ripple. */
export function Wake({ x, z, width, className = '' }) {
  const depth = 0.62 + (z / 100) * 0.86;
  return (
    <div
      className={`jr-anchor jr-wake ${className}`}
      style={{
        left: `${x}%`,
        top: `calc((var(--jr-t0) + var(--jr-span) * ${z} / 100) * 1%)`,
        zIndex: 100 + Math.round(z),
      }}
    >
      <div
        className="jr-wake-art"
        style={{ width: `${width * depth}px`, height: `${width * depth * 0.22}px` }}
      />
    </div>
  );
}
