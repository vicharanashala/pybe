import React from 'react';
import Maya from './Maya';

// The farm itself — the main visual, drawn as original flat SVG. It has no idea
// what a mission is; it renders whatever farm state it is handed, so the only way
// anything here changes is if the learner's code actually changed the state.
//
// props:
//   farm       the farm state (seeds, water, coins, weather, crops)
//   mayaMood   which face Maya is wearing
//   highlight  'seeds' | 'water' | 'crops' | null — pulses one part of the scene
//   delta      { target, text } — a floating label such as +10 over the seed sack

const TANK_CAPACITY = 50;

const SKY = {
  sunny: { top: '#8ECBF0', bottom: '#DCEFF8' },
  rain: { top: '#6B7C90', bottom: '#A9B8C4' },
};

function Tree({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-4" y="-18" width="8" height="20" rx="2" fill="#6B4A2B" />
      <circle cx="0" cy="-32" r="18" fill="#3F8E52" />
      <circle cx="-12" cy="-24" r="13" fill="#4A9E5E" />
      <circle cx="12" cy="-25" r="13" fill="#377F49" />
    </g>
  );
}

/** One crop plant. `state` decides whether it stands up green or droops pale. */
function Crop({ x, y, state }) {
  const dry = state === 'dry';
  const stem = dry ? '#A8A055' : '#3F8E52';
  const leaf = dry ? '#B9AE62' : '#57AE68';

  return (
    <g transform={`translate(${x} ${y})`} className={dry ? 'pf-crop pf-crop-dry' : 'pf-crop pf-crop-lush'}>
      <path
        d={dry ? 'M0 0 q-3 -10 2 -16' : 'M0 0 q0 -12 0 -20'}
        fill="none"
        stroke={stem}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx={dry ? -5 : -6} cy={dry ? -11 : -14} rx="5" ry="3" fill={leaf} transform={dry ? 'rotate(20 -5 -11)' : 'rotate(-18 -6 -14)'} />
      <ellipse cx={dry ? 4 : 6} cy={dry ? -13 : -17} rx="5" ry="3" fill={leaf} transform={dry ? 'rotate(30 4 -13)' : 'rotate(18 6 -17)'} />
      {!dry && <circle cx="0" cy="-21" r="3" fill="#E8C34A" />}
    </g>
  );
}

export default function FarmScene({ farm, mayaMood = 'normal', highlight = null, delta = null }) {
  const raining = farm.weather === 'rain';
  const sky = raining ? SKY.rain : SKY.sunny;

  const level = Math.max(0, Math.min(TANK_CAPACITY, farm.water));
  const tankTop = 168;
  const tankHeight = 68;
  const fillHeight = (level / TANK_CAPACITY) * tankHeight;

  const cropState = farm.crops === 'dry' ? 'dry' : 'lush';

  // A concise text description of the farm, so the scene is not the only way to
  // know what happened. Paired with aria-live in the challenge feedback, this is
  // what makes success legible without relying on colour or animation.
  const summary =
    `Maya's farm. ${farm.seeds} seeds in store, water tank at ${level} of ${TANK_CAPACITY}, ` +
    `${farm.coins} coins. The weather is ${raining ? 'rainy' : 'sunny'} and the crops are ` +
    `${farm.crops === 'dry' ? 'dry' : farm.crops === 'rain-watered' ? 'watered by the rain' : 'watered'}.`;

  return (
    <div className="pf-farm">
      <svg viewBox="0 0 480 300" className="pf-farm-svg" role="img" aria-label={summary}>
        <defs>
          <linearGradient id="pf-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky.top} />
            <stop offset="100%" stopColor={sky.bottom} />
          </linearGradient>
          <clipPath id="pf-tank-clip">
            <rect x="392" y={tankTop} width="56" height={tankHeight} rx="4" />
          </clipPath>
        </defs>

        <rect width="480" height="300" fill="url(#pf-sky)" />

        {/* weather */}
        {raining ? (
          <g className="pf-weather-rain">
            <g fill="#5A6675">
              <ellipse cx="120" cy="46" rx="42" ry="20" />
              <ellipse cx="86" cy="54" rx="26" ry="15" />
              <ellipse cx="156" cy="54" rx="28" ry="15" />
              <ellipse cx="330" cy="38" rx="36" ry="17" />
              <ellipse cx="360" cy="46" rx="24" ry="13" />
            </g>
            <g stroke="#BBD5E6" strokeWidth="2.5" strokeLinecap="round" className="pf-raindrops">
              {[70, 100, 130, 160, 195, 230, 265, 300, 330, 360, 400, 435].map((x, i) => (
                <line key={x} x1={x} y1={72 + (i % 3) * 14} x2={x - 5} y2={92 + (i % 3) * 14} opacity="0.75" />
              ))}
            </g>
          </g>
        ) : (
          <g className="pf-weather-sun">
            <circle cx="404" cy="52" r="26" fill="#FFD34E" />
            <circle cx="404" cy="52" r="34" fill="#FFD34E" opacity="0.25" />
          </g>
        )}

        {/* distant hills */}
        <path d="M0 148 q70 -34 140 -6 q80 32 150 -8 q100 -40 190 6 v20 H0 z" fill="#96C67F" opacity="0.75" />

        {/* ground */}
        <rect y="160" width="480" height="140" fill="#7CB569" />
        <path d="M0 200 q120 -16 240 0 q120 16 240 0 v100 H0 z" fill="#6AA659" />

        {/* the field the crops grow in */}
        <path d="M132 236 h176 l16 44 H116 z" fill="#8B6540" />
        <path d="M132 236 h176 l4 11 H128 z" fill="#7A5734" opacity="0.7" />

        <Tree x={38} y={214} scale={1.05} />
        <Tree x={86} y={226} scale={0.8} />
        <Tree x={456} y={220} scale={0.9} />

        {/* farmhouse */}
        <g>
          <rect x="196" y="150" width="86" height="60" fill="#F0E2C8" />
          <path d="M188 152 L239 116 L290 152 z" fill="#B4553C" />
          <rect x="228" y="176" width="24" height="34" fill="#7A5334" />
          <circle cx="247" cy="193" r="1.8" fill="#E8C34A" />
          <rect x="205" y="163" width="17" height="15" fill="#8FC0D8" stroke="#F0E2C8" strokeWidth="2" />
          <rect x="258" y="163" width="17" height="15" fill="#8FC0D8" stroke="#F0E2C8" strokeWidth="2" />
          <rect x="262" y="120" width="10" height="18" fill="#8C6448" />
        </g>

        {/* crops */}
        <g className={highlight === 'crops' ? 'pf-pulse' : undefined}>
          {[150, 182, 214, 246, 278].map((x) => (
            <Crop key={x} x={x} y={272} state={cropState} />
          ))}
          {farm.crops === 'rain-watered' && (
            <g stroke="#BBD5E6" strokeWidth="2" strokeLinecap="round" opacity="0.9">
              {[158, 190, 222, 254, 286].map((x) => (
                <line key={x} x1={x} y1="250" x2={x - 3} y2="262" />
              ))}
            </g>
          )}
        </g>

        {/* water tank */}
        <g className={highlight === 'water' ? 'pf-pulse' : undefined}>
          <rect x="388" y="160" width="64" height="84" rx="6" fill="#C9D6DE" stroke="#8FA2AE" strokeWidth="3" />
          <g clipPath="url(#pf-tank-clip)">
            <rect
              x="392"
              y={tankTop + (tankHeight - fillHeight)}
              width="56"
              height={fillHeight}
              fill="#4FA3D1"
              className="pf-tank-fill"
            />
            <rect
              x="392"
              y={tankTop + (tankHeight - fillHeight)}
              width="56"
              height="4"
              fill="#7FC4E8"
              className="pf-tank-fill"
            />
          </g>
          <rect x="384" y="152" width="72" height="10" rx="4" fill="#8FA2AE" />
          <rect x="404" y="244" width="32" height="8" rx="3" fill="#6E8290" />
          <text x="420" y="140" className="pf-scene-label" textAnchor="middle">
            {`💧 Water: ${level}`}
          </text>
        </g>

        {/* seed store */}
        <g className={highlight === 'seeds' ? 'pf-pulse' : undefined}>
          <path d="M318 244 q-10 -34 12 -34 h16 q22 0 12 34 z" fill="#D8B478" stroke="#B08D53" strokeWidth="2" />
          <path d="M328 212 q10 -8 20 0 q-10 5 -20 0 z" fill="#B08D53" />
          <circle cx="330" cy="232" r="2.4" fill="#8A6A3A" />
          <circle cx="340" cy="238" r="2.4" fill="#8A6A3A" />
          <circle cx="348" cy="230" r="2.4" fill="#8A6A3A" />
          <text x="338" y="264" className="pf-scene-label" textAnchor="middle">
            {`🌱 Seeds: ${farm.seeds}`}
          </text>
        </g>

        {/* the floating +10 that makes a change feel like an event */}
        {delta && (
          <text
            x={delta.target === 'water' ? 420 : 338}
            y={delta.target === 'water' ? 158 : 204}
            className="pf-delta"
            textAnchor="middle"
          >
            {delta.text}
          </text>
        )}
      </svg>

      <div className="pf-farm-maya">
        <Maya mood={mayaMood} size={116} />
      </div>

      <p className="pf-farm-weather">
        {raining ? '🌧️ Weather: Rain' : '☀️ Weather: Sunny'}
      </p>
    </div>
  );
}
