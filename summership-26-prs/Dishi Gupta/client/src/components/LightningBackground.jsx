import React from 'react';

// Pure CSS/SVG storm: no external assets, no canvas, no API calls.
// A jagged bolt is drawn as an SVG polyline and "struck" by animating its
// stroke-dashoffset inside a very small slice of a long (~17s) cycle, paired
// with a two-beat sky flash. Occasional by design — atmosphere, not strobe.
// All motion is disabled under `prefers-reduced-motion`.

const BOLTS = [
  'M118,-8 L96,74 L124,80 L84,196 L108,200 L58,318',
  'M320,-8 L342,60 L312,70 L356,178 L330,186 L388,300',
  'M540,-8 L516,52 L548,66 L504,150 L536,158 L492,252'
];

export default function LightningBackground() {
  return (
    <div className="storm" aria-hidden="true">
      <div className="fog fog-a" />
      <div className="fog fog-b" />
      <svg className="bolts" viewBox="0 0 600 320" preserveAspectRatio="xMidYMin slice">
        {BOLTS.map((path, index) => (
          <path
            key={path}
            className={`bolt bolt-${index + 1}`}
            d={path}
            fill="none"
            pathLength="100"
          />
        ))}
      </svg>
      <div className="flash" />
      <svg className="light-streak" viewBox="0 0 600 320" preserveAspectRatio="xMidYMin slice">
        <path d="M82,-8 L142,70 L116,82 L188,168 L156,178 L236,280" fill="none" pathLength="1" />
      </svg>
      <div className="dust" />
    </div>
  );
}
