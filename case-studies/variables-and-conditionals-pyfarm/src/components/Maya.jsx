import React from 'react';

// Maya, drawn from scratch as flat SVG shapes — no external art, no third-party
// character, nothing to license. Every mood reuses the same body and changes only
// the face and arms, so she reads as one person throughout the story.
//
// Moods: normal | thinking | worried | happy | celebrating

const SKIN = '#C68642';
const SKIN_SHADE = '#A96C31';
const HAIR = '#2C1810';
const HAT = '#E8B84B';
const HAT_BAND = '#B5762A';
const SHIRT = '#4B9E6A';
const DUNGAREE = '#3E6EA8';

function Face({ mood }) {
  const browY = mood === 'worried' ? 30 : 31;

  return (
    <g>
      {/* eyes */}
      {mood === 'happy' || mood === 'celebrating' ? (
        <>
          <path d="M30 36 q3.5 -4 7 0" fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />
          <path d="M45 36 q3.5 -4 7 0" fill="none" stroke={HAIR} strokeWidth="2" strokeLinecap="round" />
        </>
      ) : mood === 'thinking' ? (
        <>
          {/* looking up and to the side, the way people do when working something out */}
          <circle cx="34.5" cy="35" r="2.4" fill={HAIR} />
          <circle cx="49.5" cy="35" r="2.4" fill={HAIR} />
        </>
      ) : (
        <>
          <circle cx="33.5" cy="36.5" r="2.4" fill={HAIR} />
          <circle cx="48.5" cy="36.5" r="2.4" fill={HAIR} />
        </>
      )}

      {/* brows — the main carrier of mood */}
      {mood === 'worried' && (
        <>
          <path d="M29 31 l7 -2.5" fill="none" stroke={HAIR} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M53 31 l-7 -2.5" fill="none" stroke={HAIR} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {mood === 'thinking' && (
        <>
          <path d="M29 30 l7 1.5" fill="none" stroke={HAIR} strokeWidth="1.8" strokeLinecap="round" />
          <path d={`M46 ${browY - 3} l7 0`} fill="none" stroke={HAIR} strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}

      {/* mouth */}
      {mood === 'celebrating' ? (
        <path d="M34 44 q7 8 14 0 q-7 3 -14 0" fill={HAIR} />
      ) : mood === 'happy' ? (
        <path d="M35 44 q6 5 12 0" fill="none" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      ) : mood === 'worried' ? (
        <path d="M36 46 q5 -4 10 0" fill="none" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      ) : (
        <path d="M36 45 h10" fill="none" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      )}

      {/* cheeks, for the warmer moods */}
      {(mood === 'happy' || mood === 'celebrating') && (
        <>
          <circle cx="27" cy="42" r="3" fill="#D9705A" opacity="0.35" />
          <circle cx="55" cy="42" r="3" fill="#D9705A" opacity="0.35" />
        </>
      )}
    </g>
  );
}

const MOOD_LABEL = {
  normal: 'Maya, looking calm',
  thinking: 'Maya, thinking it over',
  worried: 'Maya, looking worried',
  happy: 'Maya, smiling',
  celebrating: 'Maya, cheering with her arms in the air',
};

export default function Maya({ mood = 'normal', size = 132, className = '' }) {
  const cheering = mood === 'celebrating';

  return (
    <svg
      className={`pf-maya pf-maya-${mood} ${className}`}
      width={size}
      height={size * 1.25}
      viewBox="0 0 82 104"
      role="img"
      aria-label={MOOD_LABEL[mood] ?? MOOD_LABEL.normal}
    >
      {/* legs */}
      <rect x="31" y="82" width="8" height="18" rx="3" fill={DUNGAREE} />
      <rect x="43" y="82" width="8" height="18" rx="3" fill={DUNGAREE} />
      <rect x="29" y="98" width="12" height="5" rx="2.5" fill="#4A3524" />
      <rect x="41" y="98" width="12" height="5" rx="2.5" fill="#4A3524" />

      {/* arms — raised when celebrating, otherwise resting at her sides */}
      {cheering ? (
        <>
          <path d="M24 62 L12 44" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          <path d="M58 62 L70 44" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
        </>
      ) : mood === 'thinking' ? (
        <>
          <path d="M24 62 L18 78" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          {/* a hand brought up to her chin */}
          <path d="M58 62 Q60 50 48 48" stroke={SKIN} strokeWidth="7" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <path d="M24 62 L19 79" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          <path d="M58 62 L63 79" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
        </>
      )}

      {/* torso: shirt under dungarees */}
      <path d="M26 56 h30 v28 a6 6 0 0 1 -6 6 h-18 a6 6 0 0 1 -6 -6 z" fill={SHIRT} />
      <path d="M29 64 h24 v20 a5 5 0 0 1 -5 5 h-14 a5 5 0 0 1 -5 -5 z" fill={DUNGAREE} />
      <rect x="33" y="56" width="4" height="10" rx="2" fill={DUNGAREE} />
      <rect x="45" y="56" width="4" height="10" rx="2" fill={DUNGAREE} />
      <circle cx="35" cy="70" r="1.6" fill={HAT} />
      <circle cx="47" cy="70" r="1.6" fill={HAT} />

      {/* neck */}
      <rect x="37" y="50" width="8" height="8" fill={SKIN_SHADE} />

      {/* hair behind the face */}
      <path d="M22 34 q0 -18 19 -18 q19 0 19 18 v14 q-6 -6 -19 -6 q-13 0 -19 6 z" fill={HAIR} />

      {/* head */}
      <ellipse cx="41" cy="37" rx="18" ry="18.5" fill={SKIN} />
      <Face mood={mood} />

      {/* wide-brimmed straw hat */}
      <ellipse cx="41" cy="20" rx="30" ry="7" fill={HAT} />
      <ellipse cx="41" cy="19" rx="30" ry="6" fill="#F2C963" />
      <path d="M27 20 q0 -13 14 -13 q14 0 14 13 z" fill={HAT} />
      <path d="M27 19 h28 v3 h-28 z" fill={HAT_BAND} />

      {/* celebration sparkles */}
      {cheering && (
        <g className="pf-maya-sparks" fill="#F6C544">
          <path d="M12 30 l1.8 4.4 4.4 1.8 -4.4 1.8 -1.8 4.4 -1.8 -4.4 -4.4 -1.8 4.4 -1.8 z" />
          <path d="M70 32 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4 z" />
        </g>
      )}

      {/* the question mark that goes with a thinking moment */}
      {mood === 'thinking' && (
        <text x="66" y="26" className="pf-maya-think" fontSize="17" fontWeight="700" fill="#7A5C2E">
          ?
        </text>
      )}
    </svg>
  );
}
