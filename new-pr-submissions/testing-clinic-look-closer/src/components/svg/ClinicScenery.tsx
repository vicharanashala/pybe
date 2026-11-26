import React from 'react';

const INK = '#24303C';

export const PottedPlant: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  paused?: boolean;
}> = ({ x = 0, y = 0, scale = 1 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Floor shadow */}
    <ellipse cx="50" cy="146" rx="34" ry="7" fill={INK} fillOpacity="0.12" />

    {/* Static Leaves seated cleanly inside the pot */}
    <g>
      {/* Back dark-green leaves */}
      <path
        d="M46 96 C26 84 20 56 30 34 C42 44 46 68 46 96 Z"
        fill="#2E7D3B"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M54 96 C74 84 80 56 70 34 C58 44 54 68 54 96 Z"
        fill="#2E7D3B"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Mid green leaves */}
      <path
        d="M44 98 C28 96 18 76 24 58 C36 62 42 78 44 98 Z"
        fill="#3E9A4D"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M56 98 C72 96 82 76 76 58 C64 62 58 78 56 98 Z"
        fill="#3E9A4D"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Center tall leaf */}
      <path
        d="M50 98 C36 68 40 30 50 14 C60 30 64 68 50 98 Z"
        fill="#4CB35C"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Leaf vein lines */}
      <path d="M50 90 L50 28" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M44 92 L32 48" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 92 L68 48" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>

    {/* Terracotta / Coral-Orange Pot */}
    <path
      d="M24 98 L76 98 L68 142 C67 146 63 148 58 148 L42 148 C37 148 33 146 32 142 Z"
      fill="#E8A33D"
      stroke={INK}
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <rect
      x="18"
      y="90"
      width="64"
      height="14"
      rx="7"
      fill="#D9544D"
      stroke={INK}
      strokeWidth="4"
    />
  </g>
);

export const ClinicBench: React.FC<{ x?: number; y?: number; width?: number }> = ({
  x = 0,
  y = 0,
  width = 180,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Ground shadow */}
    <ellipse cx={width / 2} cy="84" rx={width / 2 - 6} ry="7" fill={INK} fillOpacity="0.12" />
    {/* Legs */}
    <rect x="20" y="52" width="12" height="30" rx="5" fill="#24303C" />
    <rect x={width - 32} y="52" width="12" height="30" rx="5" fill="#24303C" />
    {/* Backrest */}
    <rect
      x="8"
      y="10"
      width={width - 16}
      height="26"
      rx="10"
      fill="#D9544D"
      stroke={INK}
      strokeWidth="4"
    />
    {/* Seat */}
    <rect
      x="0"
      y="40"
      width={width}
      height="18"
      rx="9"
      fill="#E56861"
      stroke={INK}
      strokeWidth="4"
    />
    {/* Cushion stitch */}
    <line
      x1="18"
      y1="23"
      x2={width - 18}
      y2="23"
      stroke="#FFFDF7"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="10 10"
      strokeOpacity="0.55"
    />
  </g>
);

export const ClinicHallBackground: React.FC<{
  paused?: boolean;
}> = ({ paused = false }) => {
  return (
    <svg
      viewBox="0 0 1000 520"
      className="w-full h-full object-cover select-none"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pale blue upper wall */}
      <rect width="1000" height="350" fill="#A8D8E8" />

      {/* Subtle sunny wall stripes */}
      <rect x="0" y="0" width="1000" height="44" fill="#7FC4D6" />
      <line x1="0" y1="44" x2="1000" y2="44" stroke={INK} strokeWidth="4" />

      {/* Teal wainscoting lower wall */}
      <rect y="220" width="1000" height="140" fill="#7FC4D6" />
      <line x1="0" y1="220" x2="1000" y2="220" stroke={INK} strokeWidth="4" />
      <rect y="212" width="1000" height="14" fill="#F5EFE0" stroke={INK} strokeWidth="3.5" />

      {/* Cream tiled clinic floor */}
      <rect y="360" width="1000" height="160" fill="#F5EFE0" />
      <line x1="0" y1="360" x2="1000" y2="360" stroke={INK} strokeWidth="4" />

      {/* Subtle floor tile lines */}
      <g stroke="#E3D9C1" strokeWidth="3">
        <line x1="0" y1="410" x2="1000" y2="410" />
        <line x1="0" y1="468" x2="1000" y2="468" />
        <line x1="160" y1="360" x2="90" y2="520" />
        <line x1="330" y1="360" x2="290" y2="520" />
        <line x1="500" y1="360" x2="500" y2="520" />
        <line x1="670" y1="360" x2="710" y2="520" />
        <line x1="840" y1="360" x2="910" y2="520" />
      </g>

      {/* Left Clinic Window */}
      <g transform="translate(88, 72)">
        <rect width="136" height="114" rx="18" fill="#FFFDF7" stroke={INK} strokeWidth="4" />
        <rect x="10" y="10" width="116" height="94" rx="12" fill="#D5F0F8" stroke={INK} strokeWidth="3.5" />
        <line x1="68" y1="10" x2="68" y2="104" stroke={INK} strokeWidth="3.5" />
        <line x1="10" y1="57" x2="126" y2="57" stroke={INK} strokeWidth="3.5" />
        <path d="M22 24 L42 24" stroke="#FFFDF7" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Center Framed Clinic Poster ("Wash & Shine") */}
      <g transform="translate(425, 68)">
        <rect width="150" height="112" rx="14" fill="#E8A33D" stroke={INK} strokeWidth="4" />
        <rect x="10" y="10" width="130" height="92" rx="8" fill="#FFFDF7" stroke={INK} strokeWidth="3" />
        {/* Water drop illustration */}
        <path
          d="M54 32 C54 32 36 52 36 65 C36 75 44 82 54 82 C64 82 72 75 72 65 C72 52 54 32 54 32 Z"
          fill="#7FC4D6"
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Soap bar illustration */}
        <rect x="82" y="54" width="42" height="24" rx="10" fill="#D9544D" stroke={INK} strokeWidth="3.5" />
        <circle cx="92" cy="40" r="6" fill="#A8D8E8" stroke={INK} strokeWidth="2.5" />
        <circle cx="110" cy="34" r="4.5" fill="#A8D8E8" stroke={INK} strokeWidth="2.5" />
      </g>

      {/* Right Clinic Window */}
      <g transform="translate(776, 72)">
        <rect width="136" height="114" rx="18" fill="#FFFDF7" stroke={INK} strokeWidth="4" />
        <rect x="10" y="10" width="116" height="94" rx="12" fill="#D5F0F8" stroke={INK} strokeWidth="3.5" />
        <line x1="68" y1="10" x2="68" y2="104" stroke={INK} strokeWidth="3.5" />
        <line x1="10" y1="57" x2="126" y2="57" stroke={INK} strokeWidth="3.5" />
        <path d="M22 24 L42 24" stroke="#FFFDF7" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Coral-red waiting benches */}
      <ClinicBench x={152} y={290} width={175} />
      <ClinicBench x={672} y={290} width={175} />

      {/* Big Green Potted Plants */}
      <PottedPlant x={32} y={244} scale={1.08} paused={paused} />
      <PottedPlant x={866} y={244} scale={1.08} paused={paused} />
    </svg>
  );
};

export const SinkUnit: React.FC<{
  x: number;
  y: number;
  timerText?: string;
  highlightTimer?: boolean;
}> = ({ x, y, timerText = '00s', highlightTimer = false }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Digital Timer Box mounted on tiled backsplash */}
    <rect
      x="34"
      y="-66"
      width="82"
      height="38"
      rx="10"
      fill={highlightTimer ? '#D9544D' : '#24303C'}
      stroke={INK}
      strokeWidth="3.5"
    />
    <rect x="40" y="-60" width="70" height="26" rx="6" fill="#18222C" />
    <text
      x="75"
      y="-41"
      textAnchor="middle"
      fill={highlightTimer ? '#FFE38E' : '#7FC4D6'}
      fontFamily="JetBrains Mono, monospace"
      fontWeight="700"
      fontSize="16"
    >
      {timerText}
    </text>

    {/* Start / Stop Buttons on Timer */}
    <circle cx="48" cy="-21" r="5" fill="#3E9A4D" stroke={INK} strokeWidth="2.5" />
    <circle cx="102" cy="-21" r="5" fill="#D9544D" stroke={INK} strokeWidth="2.5" />

    {/* Soap Dispenser */}
    <rect x="14" y="6" width="22" height="32" rx="7" fill="#E8A33D" stroke={INK} strokeWidth="3.5" />
    <path d="M25 6 V-4 H35" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Curved Faucet */}
    <path
      d="M75 36 V12 C75 -4 96 -4 96 10"
      stroke={INK}
      strokeWidth="12"
      strokeLinecap="round"
    />
    <path
      d="M75 36 V12 C75 -4 96 -4 96 10"
      stroke="#FFFDF7"
      strokeWidth="5"
      strokeLinecap="round"
    />

    {/* Basin */}
    <path
      d="M8 36 H142 L132 70 C130 78 122 82 114 82 H36 C28 82 20 78 18 70 Z"
      fill="#FFFDF7"
      stroke={INK}
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {/* Pedestal */}
    <rect x="54" y="82" width="42" height="72" rx="8" fill="#FFFDF7" stroke={INK} strokeWidth="4" />
    <rect x="46" y="144" width="58" height="14" rx="7" fill="#A8D8E8" stroke={INK} strokeWidth="4" />
  </g>
);

export const SinkRoomBackground: React.FC<{
  timerLabels?: [string, string, string];
  highlightIndex?: number;
}> = ({ timerLabels = ['20s', '15s', '32s'], highlightIndex = -1 }) => {
  return (
    <svg
      viewBox="0 0 1000 520"
      className="w-full h-full object-cover select-none"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pale blue upper wall */}
      <rect width="1000" height="360" fill="#A8D8E8" />
      <rect x="0" y="0" width="1000" height="42" fill="#7FC4D6" />
      <line x1="0" y1="42" x2="1000" y2="42" stroke={INK} strokeWidth="4" />

      {/* Teal tiled sink backsplash */}
      <rect y="190" width="1000" height="170" fill="#7FC4D6" />
      <line x1="0" y1="190" x2="1000" y2="190" stroke={INK} strokeWidth="4" />
      <g stroke="#64AEC2" strokeWidth="2.5">
        <line x1="0" y1="246" x2="1000" y2="246" />
        <line x1="0" y1="302" x2="1000" y2="302" />
        <line x1="125" y1="190" x2="125" y2="360" />
        <line x1="250" y1="190" x2="250" y2="360" />
        <line x1="375" y1="190" x2="375" y2="360" />
        <line x1="500" y1="190" x2="500" y2="360" />
        <line x1="625" y1="190" x2="625" y2="360" />
        <line x1="750" y1="190" x2="750" y2="360" />
        <line x1="875" y1="190" x2="875" y2="360" />
      </g>

      {/* Cream tiled floor */}
      <rect y="360" width="1000" height="160" fill="#F5EFE0" />
      <line x1="0" y1="360" x2="1000" y2="360" stroke={INK} strokeWidth="4" />
      <g stroke="#E3D9C1" strokeWidth="3">
        <line x1="0" y1="414" x2="1000" y2="414" />
        <line x1="0" y1="472" x2="1000" y2="472" />
        <line x1="200" y1="360" x2="140" y2="520" />
        <line x1="500" y1="360" x2="500" y2="520" />
        <line x1="800" y1="360" x2="860" y2="520" />
      </g>

      {/* Row of Sinks with Digital Timers */}
      <SinkUnit x={290} y={248} timerText={timerLabels[0]} highlightTimer={highlightIndex === 0} />
      <SinkUnit x={490} y={248} timerText={timerLabels[1]} highlightTimer={highlightIndex === 1} />
      <SinkUnit x={690} y={248} timerText={timerLabels[2]} highlightTimer={highlightIndex === 2} />

      {/* Big Green Potted Plant on right */}
      <PottedPlant x={872} y={248} scale={1.04} />
    </svg>
  );
};
