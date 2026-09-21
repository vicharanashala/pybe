import React from 'react';
import '../styles/characterRigs.css';
import '../styles/heroAcademy.css';

export default function EmberCharacter({
  action = 'idle', // 'idle' | 'floating' | 'fire-blast' | 'waving' | 'celebrating'
  scaleX = 1,
  showStats = true,
  health = 100
}) {
  const isFireBlast = action === 'fire-blast';
  const isCelebrating = action === 'celebrating';
  const isFloating = action === 'floating';
  const isWaving = action === 'waving';

  return (
    <div
      className={`ember-actor ember-action-${action}`}
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
        <div className="hero-stat-badge fire-theme">
          <span className="hero-badge-icon">🔥</span>
          <div className="hero-badge-info">
            <span className="hero-badge-name">Ember</span>
            <div className="hero-hp-bar">
              <div className="hero-hp-fill" style={{ width: `${Math.max(0, Math.min(100, health))}%`, background: '#EF4444' }} />
            </div>
          </div>
        </div>
      )}

      {/* Floating Sparkles & Embers */}
      <div className="ember-particles">
        <div className="ember-spark spark-1">✨</div>
        <div className="ember-spark spark-2">🔥</div>
        <div className="ember-spark spark-3">✨</div>
      </div>

      <svg
        className="ember-svg"
        viewBox="0 0 160 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      >
        {/* Fiery Warmth Aura (Back) */}
        <circle cx="80" cy="110" r="70" fill="url(#emberGlowGrad)" opacity="0.4" />

        <defs>
          <radialGradient id="emberGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#EF4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fiery Cape */}
        <path
          d="M50 95 C25 125 30 185 45 195 C65 175 60 135 60 105 Z"
          fill="#DC2626"
        />
        <path
          d="M110 95 C135 125 130 185 115 195 C95 175 100 135 100 105 Z"
          fill="#DC2626"
        />

        {/* Legs / Boots */}
        <g className="ember-legs">
          <path d="M60 140 L52 185 L38 185" stroke="#991B1B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M100 140 L108 185 L122 185" stroke="#991B1B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          {/* Flame Boot Trim */}
          <polygon points="40,172 48,166 45,178" fill="#F97316" />
          <polygon points="120,172 112,166 115,178" fill="#F97316" />
        </g>

        {/* Hero Torso Suit */}
        <path
          d="M50 95 L46 145 C46 152 114 152 114 145 L110 95 Z"
          fill="#EA580C"
          stroke="#C2410C"
          strokeWidth="3.5"
        />
        {/* Amber Armor Plate */}
        <path d="M62 98 L80 130 L98 98 Z" fill="#F97316" stroke="#FB923C" strokeWidth="1.5" />
        {/* Chest Flame Emblem */}
        <path
          d="M80 102 C74 112 70 118 74 125 C78 128 82 128 86 125 C90 118 86 112 80 102 Z"
          fill="#FEF08A"
        />

        {/* Head Group */}
        <g className="ember-head">
          {/* Hair Back Flame Crest */}
          <path
            d="M52 50 C40 20 60 5 70 20 C76 0 94 0 98 18 C110 5 128 20 112 50 Z"
            fill="#EF4444"
          />
          <path
            d="M60 45 C52 25 65 15 72 26 C78 12 90 12 92 24 C100 15 110 25 102 45 Z"
            fill="#FBBF24"
          />

          {/* Face Base */}
          <circle cx="80" cy="65" r="30" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2.5" />

          {/* Eyes */}
          <circle cx="70" cy="65" r="4.5" fill="#7C2D12" />
          <circle cx="68.5" cy="63.5" r="1.8" fill="#FFFFFF" />
          <circle cx="90" cy="65" r="4.5" fill="#7C2D12" />
          <circle cx="88.5" cy="63.5" r="1.8" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M64 57 Q70 54 76 57 M84 57 Q90 54 96 57" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cheerful / Confident Smile */}
          {isCelebrating ? (
            <path d="M72 75 Q80 86 88 75 Z" fill="#BE185D" stroke="#9D174D" strokeWidth="2" />
          ) : (
            <path d="M72 76 Q80 83 88 76" stroke="#9D174D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}

          {/* Golden Tiara / Headband */}
          <path d="M52 58 C65 52 95 52 108 58" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="80,50 84,56 76,56" fill="#FDE047" />

          {/* Cheeks */}
          <ellipse cx="60" cy="73" rx="4" ry="2.5" fill="#F87171" opacity="0.6" />
          <ellipse cx="100" cy="73" rx="4" ry="2.5" fill="#F87171" opacity="0.6" />
        </g>

        {/* Left Arm */}
        {isCelebrating ? (
          <path d="M50 102 C30 80 20 60 15 45" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
        ) : isFireBlast ? (
          // Casting fire stance
          <g>
            <path d="M50 102 C30 100 20 110 15 120" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
            <circle cx="10" cy="122" r="12" fill="#F97316" opacity="0.8" />
            <circle cx="10" cy="122" r="7" fill="#FEF08A" />
          </g>
        ) : (
          <path d="M50 102 C35 120 30 135 38 148" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
        )}

        {/* Right Arm & Fire Orb */}
        <g className="ember-arm-right">
          {isCelebrating ? (
            <g>
              <path d="M110 102 C130 80 140 60 145 45" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
              <text x="145" y="40" fontSize="18">🔥</text>
            </g>
          ) : isFireBlast ? (
            // Big Fire Blast Burst
            <g className="ember-blast-burst">
              <path d="M110 102 C135 98 150 105 165 110" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
              <circle cx="175" cy="112" r="22" fill="url(#blastGrad)" />
              <defs>
                <radialGradient id="blastGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="50%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </radialGradient>
              </defs>
              <text x="175" y="118" textAnchor="middle" fontSize="20">🔥</text>
            </g>
          ) : isWaving ? (
            <g>
              <path d="M110 102 C130 90 140 70 135 50" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
              <circle cx="138" cy="46" r="6" fill="#F97316" />
            </g>
          ) : (
            // Holding subtle floating magical flame in palm
            <g>
              <path d="M110 102 C125 115 130 128 128 138" stroke="#FED7AA" strokeWidth="10" strokeLinecap="round" />
              <circle cx="132" cy="132" r="7" fill="#F97316" opacity="0.9" />
              <circle cx="132" cy="132" r="4" fill="#FEF08A" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
