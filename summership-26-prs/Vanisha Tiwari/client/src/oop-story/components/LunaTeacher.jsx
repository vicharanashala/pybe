import React from 'react';
import '../styles/characterRigs.css';

export default function LunaTeacher({
  action = 'waving', // 'idle' | 'walking' | 'waving' | 'pointing' | 'thinking' | 'shocked' | 'celebrating'
  scaleX = 1
}) {
  const isShocked = action === 'shocked';
  const isThinking = action === 'thinking';
  const isPointing = action === 'pointing';
  const isCelebrating = action === 'celebrating';

  return (
    <div
      className={`luna-actor luna-action-${action}`}
      style={{ transform: `scaleX(${scaleX})` }}
    >
      <svg
        className="luna-svg"
        viewBox="0 0 180 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hair Back */}
        <path
          d="M40 70 C30 110 35 170 50 190 C65 170 60 120 60 80 Z"
          fill="#475569"
        />
        <path
          d="M140 70 C150 110 145 170 130 190 C115 170 120 120 120 80 Z"
          fill="#475569"
        />

        {/* Teacher Dress / Apron */}
        <path
          d="M60 140 L45 225 C45 235 135 235 135 225 L120 140 Z"
          fill="#A855F7"
          stroke="#7E22CE"
          strokeWidth="4"
        />
        {/* Apron Pocket */}
        <rect x="72" y="175" width="36" height="30" rx="8" fill="#F3E8FF" stroke="#9333EA" strokeWidth="2.5" />
        <text x="90" y="196" textAnchor="middle" fontSize="16" fill="#9333EA">✨</text>

        {/* Neck */}
        <rect x="82" y="115" width="16" height="25" fill="#FED7AA" />

        {/* Head Group */}
        <g className="luna-head">
          <circle cx="90" cy="85" r="40" fill="#FED7AA" stroke="#FDBA74" strokeWidth="3" />

          {/* Hair Front */}
          <path d="M50 75 C60 40 120 40 130 75 C120 55 60 55 50 75 Z" fill="#334155" />
          <path d="M50 75 C45 95 55 110 58 115 C52 95 60 80 65 75 Z" fill="#334155" />

          {/* Glasses */}
          <circle cx="75" cy="85" r="14" fill="rgba(255,255,255,0.4)" stroke="#7C3AED" strokeWidth="3.5" />
          <circle cx="105" cy="85" r="14" fill="rgba(255,255,255,0.4)" stroke="#7C3AED" strokeWidth="3.5" />
          <line x1="89" y1="85" x2="91" y2="85" stroke="#7C3AED" strokeWidth="3.5" />

          {/* Eyes */}
          <circle cx="75" cy="85" r={isShocked ? 7 : 5} fill={isShocked ? "#EF4444" : "#1E293B"} />
          <circle cx="73" cy="83" r="2" fill="#FFFFFF" />
          <circle cx="105" cy="85" r={isShocked ? 7 : 5} fill={isShocked ? "#EF4444" : "#1E293B"} />
          <circle cx="103" cy="83" r="2" fill="#FFFFFF" />

          {/* Mouth */}
          {isShocked ? (
            // Gasping mouth
            <ellipse cx="90" cy="106" rx="7" ry="9" fill="#1E293B" stroke="#BE185D" strokeWidth="2" />
          ) : isThinking ? (
            // Small pursed thinking mouth
            <ellipse cx="94" cy="105" rx="4" ry="3" fill="#BE185D" />
          ) : (
            // Cheerful smile
            <path d="M82 104 Q90 114 98 104" stroke="#BE185D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          )}

          {/* Cheeks */}
          <ellipse cx="64" cy="96" rx="6" ry="4" fill="#F472B6" opacity="0.6" />
          <ellipse cx="116" cy="96" rx="6" ry="4" fill="#F472B6" opacity="0.6" />
        </g>

        {/* Left Arm */}
        {isShocked ? (
          // Hands to cheeks gasp
          <path d="M58 145 C48 120 60 100 66 95" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        ) : isCelebrating ? (
          // Arm up in air
          <path d="M58 145 C40 120 25 95 20 80" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        ) : (
          // Natural resting arm
          <path d="M58 145 C40 165 35 180 42 195" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        )}

        {/* Right Arm & Magic Wand */}
        <g className="luna-arm-right">
          {isShocked ? (
            // Hands to cheeks gasp
            <path d="M122 145 C132 120 120 100 114 95" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
          ) : isThinking ? (
            // Hand tapping chin
            <path d="M122 145 C140 125 125 105 95 108" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
          ) : isPointing ? (
            // Pointing wand forward
            <g>
              <path d="M122 145 C150 140 170 130 185 120" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              <line x1="185" y1="120" x2="215" y2="100" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              <polygon points="215,90 219,102 231,102 221,109 225,121 215,114 205,121 209,109 199,102 211,102" fill="#FBBF24" />
            </g>
          ) : isCelebrating ? (
            // Both hands up
            <g>
              <path d="M122 145 C140 120 155 95 160 80" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              <line x1="160" y1="80" x2="180" y2="45" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              <polygon points="180,35 184,47 196,47 186,54 190,66 180,59 170,66 174,54 164,47 176,47" fill="#FBBF24" />
            </g>
          ) : (
            // Waving Wand
            <g>
              <path d="M122 145 C140 135 150 115 145 95" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              <line x1="145" y1="95" x2="162" y2="60" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
              <g className="luna-wand-star">
                <polygon
                  points="162,45 166,57 178,57 168,64 172,76 162,69 152,76 156,64 146,57 158,57"
                  fill="#FBBF24"
                  stroke="#D97706"
                  strokeWidth="2"
                />
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
