import React from 'react';
import '../styles/characterRigs.css';
import '../styles/heroAcademy.css';

export default function ZippyCharacter({
  action = 'idle', // 'idle' | 'running' | 'waving' | 'celebrating' | 'shocked'
  scaleX = 1,
  showStats = true,
  health = 100
}) {
  const isRunning = action === 'running';
  const isCelebrating = action === 'celebrating';
  const isShocked = action === 'shocked';
  const isWaving = action === 'waving';

  return (
    <div
      className={`zippy-actor zippy-action-${action}`}
      style={{
        width: '155px',
        height: '215px',
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
        <div className="hero-stat-badge speed-theme">
          <span className="hero-badge-icon">⚡</span>
          <div className="hero-badge-info">
            <span className="hero-badge-name">Zippy</span>
            <div className="hero-hp-bar">
              <div className="hero-hp-fill" style={{ width: `${Math.max(0, Math.min(100, health))}%`, background: '#EAB308' }} />
            </div>
          </div>
        </div>
      )}

      {/* Speed Trail Ghosting effect when running */}
      {isRunning && (
        <div className="zippy-speed-trail">
          <div className="speed-line speed-line-1" />
          <div className="speed-line speed-line-2" />
          <div className="speed-line speed-line-3" />
        </div>
      )}

      <svg
        className="zippy-svg"
        viewBox="0 0 160 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      >
        {/* Speed Wings Cape / Streamer */}
        <path
          d="M45 95 C20 120 15 170 30 185 C40 160 50 130 55 105 Z"
          fill="#FACC15"
          opacity="0.85"
        />
        <path
          d="M115 95 C140 120 145 170 130 185 C120 160 110 130 105 105 Z"
          fill="#FACC15"
          opacity="0.85"
        />

        {/* Legs / Boots */}
        <g className="zippy-legs">
          {/* Left Leg */}
          <path d="M60 140 L50 185 L35 185" stroke="#0284C7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          {/* Left Boot Wing */}
          <polygon points="32,175 42,168 38,180" fill="#FACC15" />

          {/* Right Leg */}
          <path d="M100 140 L110 185 L125 185" stroke="#0284C7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right Boot Wing */}
          <polygon points="128,175 118,168 122,180" fill="#FACC15" />
        </g>

        {/* Hero Torso Suit */}
        <path
          d="M50 95 L45 145 C45 152 115 152 115 145 L110 95 Z"
          fill="#0EA5E9"
          stroke="#0369A1"
          strokeWidth="3.5"
        />
        {/* Belt with Gold Buckle */}
        <rect x="46" y="136" width="68" height="10" fill="#0284C7" />
        <rect x="74" y="134" width="12" height="14" rx="3" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />

        {/* Chest Lightning Bolt Emblem */}
        <polygon
          points="83,102 74,116 82,116 77,130 90,114 82,114"
          fill="#FDE047"
          stroke="#EAB308"
          strokeWidth="1.5"
        />

        {/* Head Group */}
        <g className="zippy-head">
          <circle cx="80" cy="62" r="32" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2.5" />

          {/* Hero Cowl / Mask (Top cyan cover) */}
          <path d="M50 56 C50 30 110 30 110 56 C95 44 65 44 50 56 Z" fill="#0EA5E9" />

          {/* Side Lightning Antennas */}
          <polygon points="46,45 35,32 46,38 40,24 54,36" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
          <polygon points="114,45 125,32 114,38 120,24 106,36" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />

          {/* Golden Hero Visor / Glasses */}
          <path
            d="M54 55 C65 52 95 52 106 55 L102 70 C90 74 70 74 58 70 Z"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="2.5"
          />
          {/* Visor Glint */}
          <line x1="62" y1="58" x2="76" y2="58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="84" y1="58" x2="98" y2="58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

          {/* Eyes (Visible through visor) */}
          <circle cx="68" cy="64" r="3" fill="#0F172A" />
          <circle cx="92" cy="64" r="3" fill="#0F172A" />

          {/* Mouth */}
          {isShocked ? (
            <ellipse cx="80" cy="78" rx="6" ry="7" fill="#0F172A" />
          ) : isCelebrating ? (
            <path d="M72 74 Q80 85 88 74 Z" fill="#BE185D" stroke="#9D174D" strokeWidth="2" />
          ) : (
            <path d="M72 76 Q80 82 88 76" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="58" cy="72" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
          <ellipse cx="102" cy="72" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
        </g>

        {/* Left Arm */}
        {isCelebrating ? (
          <path d="M50 102 C30 80 20 60 15 45" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
        ) : isRunning ? (
          <path d="M50 102 C30 115 15 130 10 145" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
        ) : (
          <path d="M50 102 C35 120 30 135 38 148" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
        )}

        {/* Right Arm */}
        <g className="zippy-arm-right">
          {isCelebrating ? (
            <path d="M110 102 C130 80 140 60 145 45" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
          ) : isWaving ? (
            <g>
              <path d="M110 102 C130 90 140 70 135 50" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
              <circle cx="135" cy="46" r="6" fill="#FED7AA" />
            </g>
          ) : isRunning ? (
            <path d="M110 102 C130 85 145 70 150 55" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
          ) : (
            <path d="M110 102 C125 120 130 135 122 148" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </div>
  );
}
