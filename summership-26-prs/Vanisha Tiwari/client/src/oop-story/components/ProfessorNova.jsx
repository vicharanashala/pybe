import React from 'react';
import '../styles/characterRigs.css';
import '../styles/heroAcademy.css';

export default function ProfessorNova({
  action = 'talking', // 'idle' | 'waving' | 'typing' | 'thinking' | 'frustrated' | 'eureka' | 'celebrating'
  scaleX = 1
}) {
  const isFrustrated = action === 'frustrated';
  const isThinking = action === 'thinking';
  const isEureka = action === 'eureka';
  const isCelebrating = action === 'celebrating';
  const isTyping = action === 'typing';

  return (
    <div
      className={`nova-actor nova-action-${action}`}
      style={{
        width: '175px',
        height: '245px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        transform: `scaleX(${scaleX})`
      }}
    >
      <svg
        className="nova-svg"
        viewBox="0 0 180 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      >
        {/* Lab Coat / Futuristic Jacket Back */}
        <path
          d="M55 130 L40 230 C40 238 140 238 140 230 L125 130 Z"
          fill="#1E293B"
          stroke="#0EA5E9"
          strokeWidth="3.5"
        />

        {/* Cyan Energy Stripes on Coat */}
        <path d="M52 140 L45 220" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 3" />
        <path d="M128 140 L135 220" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 3" />

        {/* Inner Shirt / Cyber Vest */}
        <path d="M72 135 L90 190 L108 135 Z" fill="#0284C7" />
        {/* Hologram Emblem on Chest */}
        <circle cx="90" cy="165" r="9" fill="#38BDF8" opacity="0.8" />
        <polygon points="90,159 95,168 85,168" fill="#FFFFFF" />

        {/* Neck */}
        <rect x="82" y="112" width="16" height="25" fill="#FBBF24" opacity="0.9" />

        {/* Head Group */}
        <g className="nova-head">
          {/* Back Hair (High Bun) */}
          <circle cx="90" cy="45" r="26" fill="#475569" />
          {/* Hair Bun Tech Pin */}
          <line x1="68" y1="36" x2="112" y2="36" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
          <circle cx="112" cy="36" r="4" fill="#38BDF8" />

          {/* Face Base */}
          <circle cx="90" cy="85" r="38" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2.5" />

          {/* Front Hair Bangs */}
          <path d="M52 75 C60 46 120 46 128 75 C115 58 65 58 52 75 Z" fill="#334155" />
          <path d="M52 75 C48 95 56 108 60 112 C54 94 60 82 66 76 Z" fill="#334155" />

          {/* Futuristic Tech Glasses */}
          <rect x="62" y="74" width="25" height="18" rx="5" fill="rgba(14, 165, 233, 0.25)" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="93" y="74" width="25" height="18" rx="5" fill="rgba(14, 165, 233, 0.25)" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="87" y1="83" x2="93" y2="83" stroke="#0284C7" strokeWidth="3" />
          {/* HUD scanline in glasses */}
          <line x1="65" y1="80" x2="84" y2="80" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />
          <line x1="96" y1="80" x2="115" y2="80" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />

          {/* Eyes */}
          {isFrustrated ? (
            // Dizzy X eyes or stressed eyes
            <g>
              <line x1="70" y1="80" x2="78" y2="86" stroke="#DC2626" strokeWidth="2.5" />
              <line x1="78" y1="80" x2="70" y2="86" stroke="#DC2626" strokeWidth="2.5" />
              <line x1="102" y1="80" x2="110" y2="86" stroke="#DC2626" strokeWidth="2.5" />
              <line x1="110" y1="80" x2="102" y2="86" stroke="#DC2626" strokeWidth="2.5" />
            </g>
          ) : (
            // Smart bright eyes
            <g>
              <circle cx="74" cy="83" r={isEureka ? 5.5 : 4.5} fill="#0F172A" />
              <circle cx="72.5" cy="81.5" r="1.8" fill="#FFFFFF" />
              <circle cx="106" cy="83" r={isEureka ? 5.5 : 4.5} fill="#0F172A" />
              <circle cx="104.5" cy="81.5" r="1.8" fill="#FFFFFF" />
            </g>
          )}

          {/* Eyebrows */}
          {isFrustrated ? (
            <path d="M68 70 L80 74 M112 70 L100 74" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          ) : isThinking ? (
            <path d="M68 71 Q74 68 80 72 M100 74 Q106 70 112 68" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M68 72 Q74 69 80 72 M100 72 Q106 69 112 72" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Mouth */}
          {isFrustrated ? (
            // Wavy frustrated mouth
            <path d="M80 106 Q85 102 90 106 Q95 110 100 106" stroke="#DC2626" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : isEureka || isCelebrating ? (
            // Big open happy smile
            <path d="M80 102 Q90 116 100 102 Z" fill="#BE185D" stroke="#9D174D" strokeWidth="2" />
          ) : isThinking ? (
            // Small pursed mouth
            <ellipse cx="94" cy="105" rx="4" ry="2.5" fill="#BE185D" />
          ) : (
            // Friendly teaching smile
            <path d="M82 103 Q90 112 98 103" stroke="#BE185D" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}

          {/* Cheeks */}
          <ellipse cx="64" cy="95" rx="5" ry="3" fill="#F472B6" opacity="0.6" />
          <ellipse cx="116" cy="95" rx="5" ry="3" fill="#F472B6" opacity="0.6" />

          {/* Eureka Lightbulb Effect */}
          {isEureka && (
            <g className="nova-eureka-bulb" transform="translate(90, 10)">
              <circle cx="0" cy="0" r="14" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontSize="14">💡</text>
              <line x1="-18" y1="0" x2="-26" y2="0" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="18" y1="0" x2="26" y2="0" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="-18" x2="0" y2="-26" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {/* Frustrated Stress Swirls */}
          {isFrustrated && (
            <g className="nova-stress-marks">
              <text x="50" y="45" fontSize="18" fill="#EF4444">💢</text>
              <text x="120" y="45" fontSize="18" fill="#EF4444">❓</text>
            </g>
          )}
        </g>

        {/* Left Arm */}
        {isFrustrated ? (
          // Hands clutching head
          <path d="M55 140 C40 110 50 85 64 78" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        ) : isCelebrating || isEureka ? (
          // Left hand high in air
          <path d="M55 140 C35 110 25 80 20 60" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        ) : isTyping ? (
          // Holding holographic pad
          <g>
            <path d="M55 140 C40 160 50 180 65 185" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
            {/* Tablet */}
            <rect x="55" y="165" width="40" height="28" rx="4" fill="rgba(14, 165, 233, 0.85)" stroke="#38BDF8" strokeWidth="2" />
            <line x1="60" y1="174" x2="88" y2="174" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="60" y1="180" x2="80" y2="180" stroke="#BAE6FD" strokeWidth="1.5" />
          </g>
        ) : (
          // Natural resting/gesturing arm
          <path d="M55 140 C38 165 35 185 45 200" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        )}

        {/* Right Arm */}
        <g className="nova-arm-right">
          {isFrustrated ? (
            // Hands clutching head
            <path d="M125 140 C140 110 130 85 116 78" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
          ) : isThinking ? (
            // Finger tapping tech glasses/chin
            <path d="M125 140 C145 125 130 100 98 102" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
          ) : isCelebrating || isEureka ? (
            // High five celebratory pose
            <g>
              <path d="M125 140 C145 110 155 80 160 60" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              <circle cx="162" cy="55" r="8" fill="#FDE047" opacity="0.8" />
            </g>
          ) : isTyping ? (
            // Typing finger on tablet
            <path d="M125 140 C130 165 105 180 88 178" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
          ) : (
            // Waving / explaining hand
            <g>
              <path d="M125 140 C145 135 155 115 150 95" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
              <circle cx="152" cy="90" r="7" fill="#FED7AA" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
