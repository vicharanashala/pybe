import React from 'react';

/* =========================================================
   Flat SVG sprites. They are drawn face-on and then stood
   upright on the tilted sea plane by Stage3D's billboard
   wrapper, which is what gives the scene its depth.
   ========================================================= */

export function ShipArt() {
  return (
    <svg viewBox="0 0 140 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jrHull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a33" />
          <stop offset="100%" stopColor="#4a2c18" />
        </linearGradient>
        <linearGradient id="jrSail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdf6e2" />
          <stop offset="100%" stopColor="#cbb98c" />
        </linearGradient>
      </defs>
      <rect x="67" y="6" width="4" height="56" rx="2" fill="#8a6c33" />
      <polygon points="70,10 70,54 42,49" fill="url(#jrSail)" stroke="#b8a06e" strokeWidth="1.5" />
      <polygon points="70,10 70,50 96,46" fill="#f6eeda" stroke="#b8a06e" strokeWidth="1.5" />
      <polygon className="jr-flag" points="70,4 70,15 86,9" fill="#b0443a" />
      <path d="M14,58 L126,58 L110,80 L30,80 Z" fill="url(#jrHull)" stroke="#2e1c0f" strokeWidth="2" />
      <path d="M14,58 L126,58 L124,63 L16,63 Z" fill="#c8a15a" opacity=".55" />
      <circle cx="40" cy="69" r="2.6" fill="#e3c07f" />
      <circle cx="60" cy="69" r="2.6" fill="#e3c07f" />
      <circle cx="80" cy="69" r="2.6" fill="#e3c07f" />
      <circle cx="100" cy="69" r="2.6" fill="#e3c07f" />
    </svg>
  );
}

export function RowboatArt() {
  return (
    <svg viewBox="0 0 60 34" xmlns="http://www.w3.org/2000/svg">
      <line x1="14" y1="18" x2="2" y2="6" stroke="#8a6c33" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="18" x2="58" y2="6" stroke="#8a6c33" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M4,20 L56,20 L46,32 L14,32 Z" fill="#6b4226" stroke="#3f2716" strokeWidth="1.5" />
    </svg>
  );
}

export function SoldierArt() {
  return (
    <svg viewBox="0 0 40 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="46" width="6" height="20" rx="2" fill="#e8e0c8" />
      <rect x="22" y="46" width="6" height="20" rx="2" fill="#e8e0c8" />
      <rect x="10" y="24" width="20" height="26" rx="4" fill="#16283f" />
      <circle cx="20" cy="30" r="1.6" fill="#c8a15a" />
      <circle cx="20" cy="36" r="1.6" fill="#c8a15a" />
      <circle cx="20" cy="42" r="1.6" fill="#c8a15a" />
      <g className="jr-arm-l">
        <rect x="4" y="26" width="6" height="20" rx="3" fill="#16283f" />
      </g>
      <g className="jr-arm-r">
        <rect x="30" y="26" width="6" height="20" rx="3" fill="#16283f" />
      </g>
      <circle cx="20" cy="14" r="9" fill="#e0b088" />
      <path d="M8,10 Q20,-3 32,10 Q26,5 20,6 Q14,5 8,10 Z" fill="#0c1a2b" />
    </svg>
  );
}

export function PirateArt() {
  return (
    <svg viewBox="0 0 40 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="46" width="6" height="20" rx="2" fill="#5c4632" />
      <rect x="22" y="46" width="6" height="20" rx="2" fill="#5c4632" />
      <rect x="10" y="24" width="20" height="26" rx="4" fill="#fdfaf0" />
      <rect x="10" y="24" width="20" height="6" fill="#b0443a" />
      <rect x="10" y="36" width="20" height="6" fill="#b0443a" />
      <rect x="4" y="26" width="6" height="20" rx="3" fill="#fdfaf0" />
      <rect x="30" y="26" width="6" height="20" rx="3" fill="#fdfaf0" />
      <circle cx="20" cy="14" r="9" fill="#dba374" />
      <path d="M9,14 Q20,2 31,14 L31,8 Q20,3 9,8 Z" fill="#b0443a" />
      <rect x="13" y="12" width="6" height="4" fill="#1a1a1a" />
    </svg>
  );
}

export function CuffsArt() {
  return (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="10" r="7" fill="none" stroke="#c8a15a" strokeWidth="3" />
      <circle cx="21" cy="10" r="7" fill="none" stroke="#c8a15a" strokeWidth="3" />
      <rect x="12" y="8" width="6" height="4" fill="#c8a15a" />
    </svg>
  );
}

export function ChestArt() {
  return (
    <svg viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jrGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="100%" stopColor="#c8a15a" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="14" rx="18" ry="7" fill="url(#jrGold)" opacity=".85" />
      <circle cx="16" cy="13" r="3" fill="#ffe9a8" />
      <circle cx="26" cy="11" r="3.4" fill="#fff3c4" />
      <circle cx="33" cy="14" r="2.6" fill="#ffe9a8" />
      <rect x="6" y="16" width="36" height="18" rx="3" fill="#6b4226" stroke="#3f2716" strokeWidth="2" />
      <path d="M6,18 Q24,6 42,18 Z" fill="#7d4f2c" stroke="#3f2716" strokeWidth="2" />
      <rect x="6" y="22" width="36" height="4" fill="#c8a15a" />
      <rect x="21" y="20" width="6" height="9" rx="1.5" fill="#e3c07f" stroke="#8a6c33" strokeWidth="1" />
    </svg>
  );
}

/* Four island silhouettes so a seven-island chain does not look copy-pasted. */
export function IslandArt({ variant = 0 }) {
  if (variant === 1) {
    return (
      <svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="70" cy="94" rx="58" ry="22" fill="#b8965020" />
        <path d="M12,96 L44,42 L70,68 L96,30 L128,96 Z" fill="#5d5346" />
        <path d="M44,42 L58,66 L70,68 Z" fill="#7b6f5e" />
        <path d="M96,30 L110,60 L128,96 L96,96 Z" fill="#4b4238" />
        <path d="M88,40 L96,30 L104,44 Z" fill="#e8e2d0" />
        <ellipse cx="70" cy="96" rx="60" ry="14" fill="#c9a55c" />
        <ellipse cx="70" cy="94" rx="46" ry="10" fill="#e3cf8f" />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="70" cy="94" rx="62" ry="24" fill="#c9a55c" />
        <ellipse cx="70" cy="90" rx="50" ry="18" fill="#e3cf8f" />
        <ellipse cx="46" cy="80" rx="26" ry="14" fill="#3f6a45" />
        <ellipse cx="86" cy="78" rx="30" ry="16" fill="#4c7a52" />
        <ellipse cx="66" cy="70" rx="22" ry="12" fill="#345a3a" />
        <path d="M104,88 C104,66 112,52 120,44" stroke="#6b4226" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="122" cy="42" rx="14" ry="6" fill="#4c7a52" transform="rotate(18 122 42)" />
        <ellipse cx="110" cy="38" rx="14" ry="6" fill="#3f6a45" transform="rotate(-16 110 38)" />
        <circle cx="30" cy="88" r="6" fill="#9b8f6a" />
      </svg>
    );
  }
  if (variant === 3) {
    return (
      <svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="70" cy="96" rx="56" ry="20" fill="#c9a55c" />
        <ellipse cx="70" cy="92" rx="42" ry="15" fill="#e3cf8f" />
        <path d="M52,92 L58,44 L70,50 L74,92 Z" fill="#4b4238" />
        <path d="M58,44 L64,30 L70,50 Z" fill="#5d5346" />
        <rect x="60" y="24" width="3" height="12" fill="#3f2716" />
        <path d="M63,25 L63,33 L76,29 Z" fill="#b0443a" />
        <path d="M96,92 C96,72 104,62 112,54" stroke="#6b4226" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="114" cy="52" rx="12" ry="5" fill="#3f6a45" transform="rotate(20 114 52)" />
        <circle cx="34" cy="90" r="7" fill="#a89b74" />
        <circle cx="24" cy="95" r="4" fill="#9b8f6a" />
      </svg>
    );
  }
  /* variant 0 — the classic twin-palm island from the original module */
  return (
    <svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="70" cy="92" rx="60" ry="24" fill="#c9a55c" />
      <ellipse cx="70" cy="88" rx="48" ry="18" fill="#e3cf8f" />
      <path d="M60,88 C56,60 40,44 28,36" stroke="#6b4226" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M75,88 C80,50 95,30 110,20" stroke="#6b4226" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="20" cy="32" rx="18" ry="8" fill="#3f6a45" transform="rotate(-20 20 32)" />
      <ellipse cx="32" cy="24" rx="18" ry="8" fill="#4c7a52" transform="rotate(10 32 24)" />
      <ellipse cx="16" cy="44" rx="16" ry="7" fill="#345a3a" transform="rotate(-45 16 44)" />
      <ellipse cx="110" cy="20" rx="15" ry="7" fill="#3f6a45" transform="rotate(15 110 20)" />
      <ellipse cx="95" cy="15" rx="15" ry="7" fill="#4c7a52" transform="rotate(-15 95 15)" />
      <circle cx="100" cy="84" r="8" fill="#9b8f6a" />
      <circle cx="40" cy="95" r="5" fill="#a89b74" />
    </svg>
  );
}
