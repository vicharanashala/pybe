import React from 'react';
import '../styles/characterRigs.css';

export default function BuddyCharacter({
  action = 'idle', // 'idle' | 'walking' | 'waving' | 'looking-around' | 'shocked' | 'dizzy' | 'eating' | 'sleeping' | 'jumping' | 'celebrating'
  mood = 'joyful', // 'joyful' | 'dizzy' | 'curious' | 'superhero' | 'shocked'
  health = 100,
  happiness = 100,
  energy = 100,
  hasCape = false,
  showStats = true,
  scaleX = 1
}) {
  const isDanger = health < 0 || health > 100;
  const isDizzy = action === 'dizzy' || mood === 'dizzy' || isDanger;
  const isShocked = action === 'shocked' || mood === 'shocked';
  const isEating = action === 'eating';
  const isSleeping = action === 'sleeping';

  return (
    <div
      className={`buddy-actor buddy-action-${action} buddy-mood-${mood}`}
      style={{ transform: `scaleX(${scaleX})` }}
    >
      {/* Floating Pet Stats HUD (Pops in dynamically) */}
      {showStats && (
        <div className="pet-stats-hud" style={{ transform: `scaleX(${scaleX})` }}>
          <div className={`pet-stat-chip health ${isDanger ? 'danger' : ''}`}>
            <span>{isDanger ? '💔' : '❤️'}</span>
            <span>{health}</span>
          </div>
          <div className="pet-stat-chip happy">
            <span>⭐</span>
            <span>{happiness}</span>
          </div>
          <div className="pet-stat-chip energy">
            <span>⚡</span>
            <span>{energy}</span>
          </div>
        </div>
      )}

      {/* Sleeping "Zzz" Clouds */}
      {isSleeping && (
        <div style={{ position: 'absolute', top: '-25px', right: '20px', fontSize: '1.4rem', fontFamily: 'Fredoka', color: '#3B82F6', fontWeight: 'bold', animation: 'hudFloat 1.2s infinite' }}>
          Zzz...
        </div>
      )}

      {/* Vector Cartoon Puppy Rig with Articulated Parts */}
      <svg
        className="buddy-svg"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Superhero Cape */}
        {(hasCape || mood === 'superhero' || action === 'celebrating') && (
          <path
            className="buddy-cape"
            d="M80 125 C50 140 30 190 20 210 C50 205 90 200 130 205 C115 170 100 135 95 125 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="4"
          />
        )}

        {/* Tail */}
        <path
          className="buddy-tail"
          d="M60 145 C35 130 20 95 38 75 C45 68 55 75 52 88 C46 110 65 130 65 145"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Back Paws */}
        <ellipse cx="65" cy="188" rx="20" ry="12" fill="#D97706" />
        <ellipse cx="155" cy="188" rx="20" ry="12" fill="#D97706" />

        {/* Puppy Body */}
        <ellipse
          cx="110"
          cy="150"
          rx="52"
          ry="44"
          fill={isDizzy ? "#CBD5E1" : (isShocked ? "#FDE68A" : "#FBBF24")}
          stroke={isDizzy ? "#64748B" : "#D97706"}
          strokeWidth="5"
        />

        {/* Fluffy Tummy Patch */}
        <ellipse
          cx="110"
          cy="156"
          rx="32"
          ry="28"
          fill={isDizzy ? "#E2E8F0" : "#FEF3C7"}
        />

        {/* Front Left Paw (Articulated for Walking) */}
        <g className="paw-front-left">
          <ellipse cx="90" cy="192" rx="16" ry="12" fill="#F59E0B" stroke="#D97706" strokeWidth="4" />
          <circle cx="90" cy="194" r="4" fill="#FEF3C7" />
        </g>

        {/* Front Right Paw (Articulated for Waving & Walking) */}
        <g className="paw-front-right">
          <ellipse cx="130" cy="192" rx="16" ry="12" fill="#F59E0B" stroke="#D97706" strokeWidth="4" />
          <circle cx="130" cy="194" r="4" fill="#FEF3C7" />
        </g>

        {/* Puppy Head Group */}
        <g className="buddy-head">
          {/* Left Ear */}
          <path
            className="buddy-ear-left"
            d="M65 70 C35 60 20 105 45 125 C58 135 72 110 68 85 Z"
            fill="#D97706"
            stroke="#B45309"
            strokeWidth="4"
          />

          {/* Right Ear */}
          <path
            className="buddy-ear-right"
            d="M155 70 C185 60 200 105 175 125 C162 135 148 110 152 85 Z"
            fill="#D97706"
            stroke="#B45309"
            strokeWidth="4"
          />

          {/* Head Base */}
          <circle
            cx="110"
            cy="85"
            r="48"
            fill={isDizzy ? "#94A3B8" : (isShocked ? "#FDE68A" : "#FBBF24")}
            stroke={isDizzy ? "#475569" : "#D97706"}
            strokeWidth="5"
          />

          {/* Golden Star Headband (Superhero) */}
          {(mood === 'superhero' || action === 'celebrating') && (
            <g>
              <rect x="65" y="48" width="90" height="12" rx="6" fill="#EF4444" />
              <polygon points="110,40 114,52 126,52 116,59 120,70 110,63 100,70 104,59 94,52 106,52" fill="#FDE047" />
            </g>
          )}

          {/* Blushing Cheeks */}
          {!isDizzy && !isShocked && (
            <>
              <ellipse cx="78" cy="98" rx="10" ry="6" fill="#F472B6" opacity="0.6" />
              <ellipse cx="142" cy="98" rx="10" ry="6" fill="#F472B6" opacity="0.6" />
            </>
          )}

          {/* Eyes Rig */}
          <g className="buddy-eyes">
            {isDizzy ? (
              // Spiral Dizzy Eyes
              <>
                <circle cx="88" cy="80" r="10" stroke="#1E293B" strokeWidth="3" fill="none" />
                <path d="M84 80 Q88 76 92 80 T90 84" stroke="#1E293B" strokeWidth="2.5" fill="none" />
                <circle cx="132" cy="80" r="10" stroke="#1E293B" strokeWidth="3" fill="none" />
                <path d="M128 80 Q132 76 136 80 T134 84" stroke="#1E293B" strokeWidth="2.5" fill="none" />
              </>
            ) : isShocked ? (
              // Wide Shocked Pupil Eyes
              <>
                <circle cx="88" cy="78" r="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
                <circle cx="88" cy="78" r="5" fill="#EF4444" />
                <circle cx="132" cy="78" r="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3.5" />
                <circle cx="132" cy="78" r="5" fill="#EF4444" />
              </>
            ) : (
              // Big Sparkling Cartoon Eyes
              <>
                <ellipse cx="88" cy="78" rx="11" ry="14" fill="#1E293B" />
                <ellipse cx="132" cy="78" rx="11" ry="14" fill="#1E293B" />
                <circle cx="85" cy="73" r="4.5" fill="#FFFFFF" />
                <circle cx="91" cy="83" r="2.2" fill="#FFFFFF" />
                <circle cx="129" cy="73" r="4.5" fill="#FFFFFF" />
                <circle cx="135" cy="83" r="2.2" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* Snout Area */}
          <ellipse cx="110" cy="98" rx="22" ry="16" fill="#FEF3C7" />

          {/* Heart Nose */}
          <path
            d="M104 92 C104 88 108 86 110 89 C112 86 116 88 116 92 C116 97 110 101 110 101 C110 101 104 97 104 92 Z"
            fill="#1E293B"
          />

          {/* Mouth Rig */}
          <g className="buddy-mouth-chew">
            {isDizzy ? (
              <path d="M98 106 Q104 110 110 106 T122 106" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : isShocked ? (
              // Big Shocked O mouth
              <ellipse cx="110" cy="108" rx="8" ry="11" fill="#1E293B" stroke="#B91C1C" strokeWidth="2" />
            ) : isEating ? (
              // Chewing Open/Close Mouth
              <g>
                <ellipse cx="110" cy="106" rx="9" ry="7" fill="#F43F5E" stroke="#1E293B" strokeWidth="2" />
                <circle cx="110" cy="104" r="4" fill="#FEF08A" />
              </g>
            ) : (
              // Happy Smile & Tongue
              <g>
                <path d="M102 100 Q110 107 118 100" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M106 104 Q110 114 114 104 Z" fill="#F43F5E" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
