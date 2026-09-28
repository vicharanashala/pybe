import React from 'react';
import '../styles/characterRigs.css';
import '../styles/heroAcademy.css';

export default function ShieldyCharacter({
  action = 'idle', // 'idle' | 'shield-block' | 'stomping' | 'flexing' | 'celebrating'
  scaleX = 1,
  showStats = true,
  health = 100
}) {
  const isShieldBlock = action === 'shield-block';
  const isCelebrating = action === 'celebrating';
  const isFlexing = action === 'flexing';
  const isStomping = action === 'stomping';

  return (
    <div
      className={`shieldy-actor shieldy-action-${action}`}
      style={{
        width: '165px',
        height: '220px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        transform: `scaleX(${scaleX})`
      }}
    >
      {/* Super Stat Badge */}
      {showStats && (
        <div className="hero-stat-badge shield-theme">
          <span className="hero-badge-icon">🛡️</span>
          <div className="hero-badge-info">
            <span className="hero-badge-name">Shieldy</span>
            <div className="hero-hp-bar">
              <div className="hero-hp-fill" style={{ width: `${Math.max(0, Math.min(100, health))}%`, background: '#10B981' }} />
            </div>
          </div>
        </div>
      )}

      {/* Hexagonal Shield Energy Barrier when active */}
      {isShieldBlock && (
        <div className="shield-energy-dome">
          <div className="energy-hex hex-1" />
          <div className="energy-hex hex-2" />
        </div>
      )}

      <svg
        className="shieldy-svg"
        viewBox="0 0 170 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      >
        {/* Armored Cape Back */}
        <path
          d="M48 95 C25 125 20 185 35 195 C55 175 55 135 55 105 Z"
          fill="#1E3A8A"
        />
        <path
          d="M112 95 C135 125 140 185 125 195 C105 175 105 135 105 105 Z"
          fill="#1E3A8A"
        />

        {/* Heavy Armored Legs / Boots */}
        <g className="shieldy-legs">
          <path d="M58 140 L50 185 L32 185" stroke="#047857" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M102 140 L110 185 L128 185" stroke="#047857" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          {/* Armor Knee Plates */}
          <rect x="42" y="152" width="16" height="12" rx="3" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
          <rect x="102" y="152" width="16" height="12" rx="3" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />
        </g>

        {/* Heavy Armored Torso */}
        <path
          d="M46 92 L42 145 C42 154 118 154 118 145 L114 92 Z"
          fill="#059669"
          stroke="#065F46"
          strokeWidth="3.5"
        />
        {/* Chest Heavy Armor Plate */}
        <path d="M54 94 L80 132 L106 94 Z" fill="#10B981" stroke="#34D399" strokeWidth="2" />
        <rect x="72" y="105" width="16" height="16" rx="4" fill="#047857" />
        <polygon points="80,108 84,115 76,115" fill="#6EE7B7" />

        {/* Head Group with Armored Helmet */}
        <g className="shieldy-head">
          <circle cx="80" cy="62" r="32" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2.5" />

          {/* Helmet Top / Armor */}
          <path d="M48 58 C48 26 112 26 112 58 C96 46 64 46 48 58 Z" fill="#047857" />
          {/* Helmet Crest Fin */}
          <path d="M76 22 L84 22 L82 48 L78 48 Z" fill="#10B981" stroke="#065F46" strokeWidth="1.5" />

          {/* Eyes */}
          <circle cx="68" cy="63" r="4.5" fill="#064E3B" />
          <circle cx="66.5" cy="61.5" r="1.8" fill="#FFFFFF" />
          <circle cx="92" cy="63" r="4.5" fill="#064E3B" />
          <circle cx="90.5" cy="61.5" r="1.8" fill="#FFFFFF" />

          {/* Bold Confident Eyebrows */}
          <path d="M62 55 L74 57 M98 55 L86 57" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" />

          {/* Sturdy Smile */}
          {isCelebrating || isFlexing ? (
            <path d="M72 74 Q80 85 88 74 Z" fill="#BE185D" stroke="#9D174D" strokeWidth="2" />
          ) : (
            <path d="M72 75 Q80 81 88 75" stroke="#065F46" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}

          {/* Cheeks */}
          <ellipse cx="58" cy="72" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
          <ellipse cx="102" cy="72" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
        </g>

        {/* Left Arm / Flexing Arm */}
        {isFlexing || isCelebrating ? (
          // Flexing bicep
          <g>
            <path d="M46 100 C30 85 22 70 28 55" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
            <circle cx="30" cy="52" r="7" fill="#10B981" />
          </g>
        ) : (
          <path d="M46 100 C30 118 28 135 36 148" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        )}

        {/* Right Arm & Energy Shield */}
        <g className="shieldy-arm-right">
          {isShieldBlock ? (
            // Holding shield forward firmly
            <g>
              <path d="M114 100 C130 95 142 98 150 102" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              {/* Massive Hexagonal Energy Shield */}
              <polygon
                points="150,55 175,75 175,135 150,155 125,135 125,75"
                fill="rgba(16, 185, 129, 0.85)"
                stroke="#6EE7B7"
                strokeWidth="4"
              />
              {/* Inner Shield Insignia */}
              <polygon
                points="150,75 163,88 163,122 150,135 137,122 137,88"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text x="150" y="112" textAnchor="middle" fontSize="18" fill="#FFFFFF">🛡️</text>
            </g>
          ) : isFlexing || isCelebrating ? (
            // Shield slung high on back or shoulder
            <g>
              <path d="M114 100 C130 85 138 70 132 55" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              <polygon
                points="135,45 152,58 152,98 135,110 118,98 118,58"
                fill="#10B981"
                stroke="#065F46"
                strokeWidth="3"
              />
            </g>
          ) : (
            // Shield held at side in relaxed guardian stance
            <g>
              <path d="M114 100 C128 115 130 128 126 142" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              <polygon
                points="136,88 158,102 158,142 136,156 114,142 114,102"
                fill="#10B981"
                stroke="#065F46"
                strokeWidth="3.5"
              />
              <circle cx="136" cy="122" r="8" fill="#047857" />
              <text x="136" y="128" textAnchor="middle" fontSize="12" fill="#FFFFFF">🛡️</text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
