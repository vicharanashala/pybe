import React from 'react';
import '../styles/characterRigs.css';

export default function CapsuleHero({
  action = 'hover', // 'hover' | 'flying' | 'spinning' | 'bouncing' | 'protecting' | 'celebrating'
  shieldActive = true,
  lockOpen = false
}) {
  return (
    <div className={`capsule-actor capsule-action-${action}`}>
      {/* Outer Rotating Shield Aura */}
      {shieldActive && <div className="capsule-shield-aura" />}

      {/* Vector Capsule Character */}
      <svg
        className="capsule-svg"
        viewBox="0 0 160 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tiny Floating Hands */}
        <ellipse cx="22" cy="105" rx="10" ry="12" fill="#60A5FA" stroke="#2563EB" strokeWidth="3" />
        <ellipse cx="138" cy="105" rx="10" ry="12" fill="#60A5FA" stroke="#2563EB" strokeWidth="3" />

        {/* Capsule Main Pill Body */}
        <rect
          x="35"
          y="20"
          width="90"
          height="145"
          rx="45"
          fill="url(#capsuleGrad)"
          stroke="#2563EB"
          strokeWidth="6"
        />

        {/* Glossy Highlight Streak */}
        <path
          d="M50 35 C50 35 60 28 80 28 C70 45 65 65 65 85"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Big Expressive Cartoon Eyes */}
        <ellipse cx="65" cy="65" rx="9" ry="12" fill="#1E293B" />
        <ellipse cx="95" cy="65" rx="9" ry="12" fill="#1E293B" />
        <circle cx="62" cy="60" r="4" fill="#FFFFFF" />
        <circle cx="92" cy="60" r="4" fill="#FFFFFF" />
        <circle cx="67" cy="68" r="2" fill="#FFFFFF" />
        <circle cx="97" cy="68" r="2" fill="#FFFFFF" />

        {/* Cheerful Smile */}
        <path d="M72 82 Q80 90 88 82" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Blushing Cheeks */}
        <ellipse cx="52" cy="74" rx="6" ry="4" fill="#F472B6" opacity="0.6" />
        <ellipse cx="108" cy="74" rx="6" ry="4" fill="#F472B6" opacity="0.6" />

        {/* Golden Heart-Lock on Belly (Open or Locked) */}
        <g className="capsule-lock">
          <circle cx="80" cy="122" r="22" fill="#FEF08A" stroke="#F59E0B" strokeWidth="4" />
          {/* Lock Arch (Rotated if open) */}
          <path
            d={lockOpen ? "M70 108 C70 98 84 98 84 104" : "M74 112 C74 105 86 105 86 112"}
            stroke="#D97706"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Keyhole */}
          <circle cx="80" cy="120" r="3" fill="#B45309" />
          <polygon points="78,121 82,121 81,128 79,128" fill="#B45309" />
        </g>

        <defs>
          <linearGradient id="capsuleGrad" x1="80" y1="20" x2="80" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93C5FD" />
            <stop offset="0.5" stopColor="#60A5FA" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
