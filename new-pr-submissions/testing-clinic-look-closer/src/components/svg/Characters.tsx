import React from 'react';
import { KidProfile } from '../../types/story';

const INK = '#24303C';

interface DrMeeraProps {
  className?: string;
  mood?: 'happy' | 'curious' | 'serious';
  waving?: boolean;
  holdingMagnifier?: boolean;
}

export const DrMeera: React.FC<DrMeeraProps> = ({
  className = '',
  mood = 'happy',
  waving = false,
  holdingMagnifier = false,
}) => {
  return (
    <svg
      viewBox="0 0 220 310"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dr. Meera"
    >
      {/* Ground shadow */}
      <ellipse cx="110" cy="296" rx="56" ry="10" fill="#24303C" fillOpacity="0.12" />

      {/* Shoes */}
      <rect x="74" y="274" width="28" height="18" rx="9" fill="#D9544D" stroke={INK} strokeWidth="4" />
      <rect x="118" y="274" width="28" height="18" rx="9" fill="#D9544D" stroke={INK} strokeWidth="4" />

      {/* Legs / Trousers */}
      <rect x="80" y="232" width="18" height="46" rx="8" fill="#467A8C" stroke={INK} strokeWidth="4" />
      <rect x="122" y="232" width="18" height="46" rx="8" fill="#467A8C" stroke={INK} strokeWidth="4" />

      {/* Inner Teal Top */}
      <path
        d="M74 148 C74 134 146 134 146 148 L152 210 L68 210 Z"
        fill="#7FC4D6"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* White Doctor Coat */}
      <path
        d="M68 144 C56 148 50 175 50 238 C50 245 55 248 62 248 L103 248 L103 152 L84 142 Z"
        fill="#FFFDF7"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M152 144 C164 148 170 175 170 238 C170 245 165 248 158 248 L117 248 L117 152 L136 142 Z"
        fill="#FFFDF7"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Coat Pockets */}
      <rect x="62" y="204" width="26" height="24" rx="6" fill="#F5EFE0" stroke={INK} strokeWidth="3.5" />
      <rect x="132" y="204" width="26" height="24" rx="6" fill="#F5EFE0" stroke={INK} strokeWidth="3.5" />
      {/* Little coral pen in pocket */}
      <rect x="142" y="194" width="6" height="14" rx="3" fill="#E8A33D" stroke={INK} strokeWidth="2.5" />

      {/* Left Arm */}
      {waving ? (
        <g>
          <path
            d="M64 152 C42 144 30 122 36 102"
            stroke="#FFFDF7"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M64 152 C42 144 30 122 36 102"
            stroke={INK}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="36" cy="98" r="12" fill="#D89A6D" stroke={INK} strokeWidth="4" />
        </g>
      ) : (
        <g>
          <path
            d="M64 150 C48 164 46 190 54 208"
            stroke={INK}
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M64 150 C48 164 46 190 54 208"
            stroke="#FFFDF7"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle cx="55" cy="212" r="11" fill="#D89A6D" stroke={INK} strokeWidth="4" />
        </g>
      )}

      {/* Right Arm */}
      {holdingMagnifier ? (
        <g>
          <path
            d="M156 150 C178 156 188 140 184 120"
            stroke={INK}
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M156 150 C178 156 188 140 184 120"
            stroke="#FFFDF7"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle cx="183" cy="116" r="11" fill="#D89A6D" stroke={INK} strokeWidth="4" />
        </g>
      ) : (
        <g>
          <path
            d="M156 150 C172 164 174 190 166 208"
            stroke={INK}
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M156 150 C172 164 174 190 166 208"
            stroke="#FFFDF7"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <circle cx="165" cy="212" r="11" fill="#D89A6D" stroke={INK} strokeWidth="4" />
        </g>
      )}

      {/* Stethoscope */}
      <path
        d="M84 136 C78 168 92 184 110 184 C128 184 142 168 136 136"
        stroke={INK}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M84 136 C78 168 92 184 110 184 C128 184 142 168 136 136"
        stroke="#D9544D"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="110" cy="186" r="9" fill="#E8A33D" stroke={INK} strokeWidth="3.5" />

      {/* Neck */}
      <rect x="98" y="122" width="24" height="22" rx="10" fill="#D89A6D" stroke={INK} strokeWidth="4" />

      {/* Hair Bun (behind head) */}
      <circle cx="110" cy="28" r="24" fill="#24303C" stroke={INK} strokeWidth="4" />
      <rect x="94" y="34" width="32" height="10" rx="5" fill="#D9544D" stroke={INK} strokeWidth="3" />

      {/* Big Picture-Book Head */}
      <circle cx="110" cy="82" r="48" fill="#D89A6D" stroke={INK} strokeWidth="4" />

      {/* Hair Bangs */}
      <path
        d="M62 76 C62 42 86 30 110 30 C134 30 158 42 158 76 C144 58 126 52 110 56 C94 52 76 58 62 76 Z"
        fill="#24303C"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />



      {/* Cheeks */}
      <ellipse cx="78" cy="96" rx="8" ry="5" fill="#D9544D" fillOpacity="0.35" />
      <ellipse cx="142" cy="96" rx="8" ry="5" fill="#D9544D" fillOpacity="0.35" />

      {/* Friendly Eyes & Glasses */}
      <circle cx="90" cy="82" r="5" fill={INK} />
      <circle cx="130" cy="82" r="5" fill={INK} />
      <circle cx="92" cy="80" r="1.6" fill="#FFFDF7" />
      <circle cx="132" cy="80" r="1.6" fill="#FFFDF7" />

      <circle cx="90" cy="82" r="14" stroke={INK} strokeWidth="3.5" fill="#A8D8E8" fillOpacity="0.18" />
      <circle cx="130" cy="82" r="14" stroke={INK} strokeWidth="3.5" fill="#A8D8E8" fillOpacity="0.18" />
      <line x1="104" y1="82" x2="116" y2="82" stroke={INK} strokeWidth="3.5" />

      {/* Eyebrows */}
      {mood === 'curious' ? (
        <>
          <path d="M78 64 Q90 58 100 64" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M120 62 Q130 54 142 60" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M79 64 Q90 60 100 64" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M120 64 Q130 60 141 64" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}

      {/* Mouth */}
      {mood === 'happy' && (
        <path
          d="M96 102 Q110 116 124 102"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
      {mood === 'curious' && (
        <path
          d="M100 106 Q110 102 121 106"
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
      {mood === 'serious' && (
        <ellipse cx="110" cy="107" rx="6" ry="5" fill="#D9544D" stroke={INK} strokeWidth="3.5" />
      )}
    </svg>
  );
};

interface KidCharacterProps {
  kid: KidProfile;
  className?: string;
  pose?: 'standing' | 'hands-up';
}

export const KidCharacter: React.FC<KidCharacterProps> = ({
  kid,
  className = '',
  pose = 'standing',
}) => {
  const showMudOnHands = kid.appearance === 'muddy';
  const showSmudgeOnHands = kid.appearance === 'smudged';

  return (
    <svg
      viewBox="0 0 180 260"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={kid.name}
    >
      {/* Ground shadow */}
      <ellipse cx="90" cy="246" rx="44" ry="8" fill="#24303C" fillOpacity="0.12" />

      {/* Shoes */}
      <rect x="58" y="226" width="24" height="16" rx="8" fill={kid.accentColor} stroke={INK} strokeWidth="4" />
      <rect x="98" y="226" width="24" height="16" rx="8" fill={kid.accentColor} stroke={INK} strokeWidth="4" />

      {/* Legs */}
      <rect x="64" y="186" width="16" height="42" rx="8" fill="#3B5B6D" stroke={INK} strokeWidth="4" />
      <rect x="100" y="186" width="16" height="42" rx="8" fill="#3B5B6D" stroke={INK} strokeWidth="4" />

      {/* Arms */}
      {pose === 'hands-up' ? (
        <>
          {/* Raised arms showing hands forward */}
          <path d="M56 140 C38 134 26 114 30 96" stroke={INK} strokeWidth="18" strokeLinecap="round" />
          <path d="M56 140 C38 134 26 114 30 96" stroke={kid.shirtColor} strokeWidth="10" strokeLinecap="round" />
          <circle cx="30" cy="92" r="13" fill={kid.skinColor} stroke={INK} strokeWidth="4" />

          <path d="M124 140 C142 134 154 114 150 96" stroke={INK} strokeWidth="18" strokeLinecap="round" />
          <path d="M124 140 C142 134 154 114 150 96" stroke={kid.shirtColor} strokeWidth="10" strokeLinecap="round" />
          <circle cx="150" cy="92" r="13" fill={kid.skinColor} stroke={INK} strokeWidth="4" />

          {showMudOnHands && (
            <>
              <circle cx="28" cy="90" r="5" fill="#6E472B" />
              <circle cx="34" cy="95" r="3.5" fill="#5A371E" />
              <circle cx="148" cy="92" r="5.5" fill="#6E472B" />
              <circle cx="154" cy="87" r="3" fill="#5A371E" />
            </>
          )}
          {showSmudgeOnHands && (
            <>
              <ellipse cx="30" cy="92" rx="5" ry="3.5" fill="#7D7268" fillOpacity="0.65" />
              <ellipse cx="150" cy="92" rx="5" ry="3.5" fill="#7D7268" fillOpacity="0.65" />
            </>
          )}
        </>
      ) : (
        <>
          <path d="M58 138 C42 150 40 168 46 182" stroke={INK} strokeWidth="18" strokeLinecap="round" />
          <path d="M58 138 C42 150 40 168 46 182" stroke={kid.shirtColor} strokeWidth="10" strokeLinecap="round" />
          <circle cx="46" cy="184" r="9" fill={kid.skinColor} stroke={INK} strokeWidth="3.5" />

          <path d="M122 138 C138 150 140 168 134 182" stroke={INK} strokeWidth="18" strokeLinecap="round" />
          <path d="M122 138 C138 150 140 168 134 182" stroke={kid.shirtColor} strokeWidth="10" strokeLinecap="round" />
          <circle cx="134" cy="184" r="9" fill={kid.skinColor} stroke={INK} strokeWidth="3.5" />
        </>
      )}

      {/* Shirt / Torso */}
      <path
        d="M58 132 C58 122 122 122 122 132 L128 192 C128 197 124 200 118 200 L62 200 C56 200 52 197 52 192 Z"
        fill={kid.shirtColor}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Shirt Collar / Detail */}
      <path d="M74 128 Q90 142 106 128" stroke={kid.accentColor} strokeWidth="6" strokeLinecap="round" />
      <circle cx="90" cy="160" r="10" fill={kid.accentColor} fillOpacity="0.9" stroke={INK} strokeWidth="3" />

      {/* Hair Back Styles */}
      {kid.hairStyle === 'pigtails' && (
        <>
          <circle cx="42" cy="72" r="18" fill={kid.hairColor} stroke={INK} strokeWidth="4" />
          <circle cx="138" cy="72" r="18" fill={kid.hairColor} stroke={INK} strokeWidth="4" />
          <circle cx="52" cy="64" r="5" fill="#E8A33D" stroke={INK} strokeWidth="2.5" />
          <circle cx="128" cy="64" r="5" fill="#E8A33D" stroke={INK} strokeWidth="2.5" />
        </>
      )}
      {kid.hairStyle === 'bob' && (
        <path
          d="M44 74 C42 40 62 24 90 24 C118 24 138 40 136 74 L138 108 C130 112 122 108 120 100 L60 100 C58 108 50 112 42 108 Z"
          fill={kid.hairColor}
          stroke={INK}
          strokeWidth="4"
        />
      )}

      {/* Neck */}
      <rect x="81" y="110" width="18" height="18" rx="8" fill={kid.skinColor} stroke={INK} strokeWidth="4" />

      {/* Big Kid Head */}
      <circle cx="90" cy="76" r="42" fill={kid.skinColor} stroke={INK} strokeWidth="4" />



      {/* Hair Front Styles */}
      {kid.hairStyle === 'tousled' && (
        <path
          d="M48 68 C48 34 72 22 96 24 C116 26 132 42 132 68 C122 52 112 48 102 56 C92 44 78 48 68 58 C60 50 54 58 48 68 Z"
          fill={kid.hairColor}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )}
      {kid.hairStyle === 'pigtails' && (
        <path
          d="M48 70 C50 38 70 28 90 28 C110 28 130 38 132 70 C116 54 100 48 90 52 C80 48 64 54 48 70 Z"
          fill={kid.hairColor}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )}
      {kid.hairStyle === 'neat' && (
        <path
          d="M48 68 C48 36 68 24 90 24 C112 24 132 36 132 68 C120 48 102 44 82 48 C66 50 56 58 48 68 Z"
          fill={kid.hairColor}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )}
      {kid.hairStyle === 'bob' && (
        <>
          <path
            d="M48 68 C52 36 72 28 90 28 C108 28 128 36 132 68 C116 54 102 52 90 52 C78 52 64 54 48 68 Z"
            fill={kid.hairColor}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Cute orange headband */}
          <path d="M54 52 Q90 34 126 52" stroke="#E8A33D" strokeWidth="7" strokeLinecap="round" />
          <path d="M54 52 Q90 34 126 52" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </>
      )}
      {kid.hairStyle === 'curly' && (
        <g fill={kid.hairColor} stroke={INK} strokeWidth="4">
          <circle cx="58" cy="46" r="14" />
          <circle cx="76" cy="34" r="16" />
          <circle cx="96" cy="32" r="16" />
          <circle cx="116" cy="40" r="15" />
          <circle cx="126" cy="56" r="12" />
          <circle cx="52" cy="60" r="11" />
        </g>
      )}

      {/* Simple Picture-Book Face */}
      <ellipse cx="64" cy="88" rx="7" ry="4" fill="#D9544D" fillOpacity="0.35" />
      <ellipse cx="116" cy="88" rx="7" ry="4" fill="#D9544D" fillOpacity="0.35" />

      <circle cx="74" cy="78" r="4.5" fill={INK} />
      <circle cx="106" cy="78" r="4.5" fill={INK} />
      <circle cx="75.5" cy="76.5" r="1.5" fill="#FFFDF7" />
      <circle cx="107.5" cy="76.5" r="1.5" fill="#FFFDF7" />

      <path d="M78 96 Q90 108 102 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};
