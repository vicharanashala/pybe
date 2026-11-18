/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Artwork: Vector illustrations, MetaMix replicated-note logo, realistic character avatars,
 * unified Teal-themed mood icons, method diagrams, and celebratory decorations.
 * Palette:
 * - Teal: #087F8C
 * - Soft teal: #65B8B0
 * - Pale aqua: #E8F6F3
 * - Cream: #FFFDF7
 * - Dark teal: #243B3A
 */

import React from "react";
import ahaanaPortrait from "./assets/images/portrait_ahaana.jpg";
import reyanshPortrait from "./assets/images/portrait_reyansh.jpg";

/**
 * MetaMix Brand Logo
 * A crisp musical eighth note alongside its replicated/copied twin note,
 * symbolizing music playlists and object copying.
 */
export function MetaMixLogo({ size = 34, className = "" }) {
  return (
    <svg
      viewBox="0 0 44 44"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Rounded Badge */}
      <rect width="44" height="44" rx="11" fill="#243B3A" />
      <rect x="1.2" y="1.2" width="41.6" height="41.6" rx="9.8" stroke="#65B8B0" strokeWidth="1.2" strokeOpacity="0.45" />

      {/* Replicated Copy Note (Offset behind/right, Soft Teal + Dashed Outline) */}
      <g opacity="0.95">
        <ellipse
          cx="28.5"
          cy="31"
          rx="4.8"
          ry="3.6"
          transform="rotate(-18 28.5 31)"
          fill="#087F8C"
          stroke="#65B8B0"
          strokeWidth="1.6"
          strokeDasharray="2.5 1.8"
        />
        <path
          d="M 32.8 30 L 32.8 14.5 L 38.5 16.8"
          stroke="#65B8B0"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 2"
        />
      </g>

      {/* Subtle Copy Link Arc between Original Note and Copy Note */}
      <path
        d="M 18 14 C 22 10.5, 27 10.5, 30.5 13.5"
        stroke="#65B8B0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="31" cy="14" r="1.5" fill="#65B8B0" />

      {/* Original Music Note (Foreground, Crisp Cream #FFFDF7) */}
      <ellipse
        cx="13.5"
        cy="29.5"
        rx="5.2"
        ry="3.9"
        transform="rotate(-18 13.5 29.5)"
        fill="#FFFDF7"
      />
      <path
        d="M 18 28.5 L 18 11.5 L 25.5 14.5 C 26.2 14.8 26.2 15.8 25.3 16.2 L 18 14.2"
        fill="#FFFDF7"
      />
      <path
        d="M 18 28.5 L 18 11.5 L 25.2 14.4"
        stroke="#FFFDF7"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const EchoLogo = MetaMixLogo;

/**
 * Realistic Character Portrait Avatar
 */
export function Avatar({ characterId, size = 48, className = "" }) {
  const isAhaana = characterId?.toLowerCase() === "ahaana";
  const portraitSrc = isAhaana ? ahaanaPortrait : reyanshPortrait;
  const name = isAhaana ? "Ahaana" : "Reyansh";
  const borderColor = isAhaana ? "#243B3A" : "#087F8C";

  return (
    <div
      className={`pp-avatar-wrap ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: `2.5px solid ${borderColor}`,
        boxShadow: "0 2px 8px rgba(36, 59, 58, 0.16)",
        flexShrink: 0,
        backgroundColor: "#E8F6F3",
        position: "relative"
      }}
      title={name}
    >
      <img
        src={portraitSrc}
        alt={name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block"
        }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

/**
 * Method Visualizations for Chapter 4
 */
export function MethodVisualization({ methodId, size = 56 }) {
  if (methodId === "live_sync") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#E8F6F3" stroke="#087F8C" strokeWidth="1.5" />
        {/* Two names (dots) pointing to ONE single shared setlist card */}
        <circle cx="15" cy="14" r="4.5" fill="#243B3A" />
        <circle cx="49" cy="14" r="4.5" fill="#087F8C" />
        <path d="M 18 18 L 28 28" stroke="#243B3A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 46 18 L 36 28" stroke="#087F8C" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="16" y="28" width="32" height="25" rx="6" fill="#243B3A" />
        <rect x="21" y="34" width="22" height="4" rx="2" fill="#FFFDF7" />
        <rect x="21" y="42" width="16" height="4" rx="2" fill="#65B8B0" />
      </svg>
    );
  }

  if (methodId === "remix_link") {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#E8F6F3" stroke="#65B8B0" strokeWidth="1.5" />
        {/* Two separate setlist cards pointing to shared mood bars */}
        <rect x="9" y="10" width="19" height="14" rx="4" fill="#243B3A" />
        <rect x="13" y="15" width="11" height="4" rx="2" fill="#FFFDF7" />
        <rect x="36" y="10" width="19" height="14" rx="4" fill="#087F8C" />
        <rect x="40" y="15" width="11" height="4" rx="2" fill="#FFFDF7" />
        <path d="M 18.5 24 L 27 38" stroke="#243B3A" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 45.5 24 L 37 38" stroke="#087F8C" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="16" y="38" width="32" height="16" rx="5" fill="#65B8B0" stroke="#243B3A" strokeWidth="1.5" />
        <rect x="21" y="44" width="22" height="4" rx="2" fill="#243B3A" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#E8F6F3" stroke="#087F8C" strokeWidth="2" />
      {/* Two completely separate setlist cards with separate mood bars */}
      <rect x="8" y="11" width="20" height="15" rx="4" fill="#243B3A" />
      <rect x="12" y="16.5" width="12" height="4" rx="2" fill="#FFFDF7" />
      <path d="M 18 26 L 18 36" stroke="#243B3A" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="8" y="36" width="20" height="17" rx="4" fill="#243B3A" />
      <rect x="12" y="41" width="12" height="3" rx="1.5" fill="#FFFDF7" />
      <rect x="12" y="46.5" width="9" height="3" rx="1.5" fill="#65B8B0" />

      <rect x="36" y="11" width="20" height="15" rx="4" fill="#087F8C" />
      <rect x="40" y="16.5" width="12" height="4" rx="2" fill="#FFFDF7" />
      <path d="M 46 26 L 46 36" stroke="#087F8C" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="36" y="36" width="20" height="17" rx="4" fill="#087F8C" />
      <rect x="40" y="41" width="12" height="3" rx="1.5" fill="#FFFDF7" />
      <rect x="40" y="46.5" width="9" height="3" rx="1.5" fill="#E8F6F3" />
    </svg>
  );
}

/**
 * Unified Mood Artwork for Intro, Chorus, Outro, and Retro
 * All share the cohesive Teal + Soft Teal + Cream + Dark Teal theme.
 */
export function MoodArtwork({ moodName, width = 48, height = 48, className = "" }) {
  const lower = moodName?.toLowerCase() || "";
  const isIntro = lower.includes("intro") || lower.includes("highway");
  const isChorus = lower.includes("chorus") || lower.includes("dil");
  const isRetro = lower.includes("retro");

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      {/* Unified Dark Teal & Teal badge theme */}
      <rect width="48" height="48" rx="12" fill="#087F8C" />
      <rect x="1.5" y="1.5" width="45" height="45" rx="10.5" fill="none" stroke="#65B8B0" strokeWidth="1.5" strokeOpacity="0.55" />

      {isIntro ? (
        // Intro: Beamed eighth notes + opening melody arc
        <g>
          <path d="M 10 34 Q 24 27 38 34" stroke="#65B8B0" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="16" cy="28" r="3.8" fill="#FFFDF7" />
          <circle cx="30" cy="26" r="3.8" fill="#65B8B0" />
          <path d="M 19.2 28 L 19.2 14 L 33.2 12 L 33.2 26" stroke="#FFFDF7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      ) : isChorus ? (
        // Chorus: Symmetric high-energy harmonic equalizer
        <g>
          <rect x="9" y="20" width="4" height="12" rx="2" fill="#65B8B0" />
          <rect x="15.5" y="13" width="4" height="23" rx="2" fill="#FFFDF7" />
          <rect x="22" y="9" width="4" height="30" rx="2" fill="#FFFDF7" />
          <rect x="28.5" y="13" width="4" height="23" rx="2" fill="#FFFDF7" />
          <rect x="35" y="20" width="4" height="12" rx="2" fill="#65B8B0" />
        </g>
      ) : isRetro ? (
        // Retro: Classic Vinyl Record Disc
        <g>
          <circle cx="24" cy="24" r="14" fill="#243B3A" stroke="#FFFDF7" strokeWidth="1.8" />
          <circle cx="24" cy="24" r="9" fill="none" stroke="#65B8B0" strokeWidth="1.3" strokeDasharray="4 2" />
          <circle cx="24" cy="24" r="4.5" fill="#65B8B0" />
          <circle cx="24" cy="24" r="1.6" fill="#FFFDF7" />
        </g>
      ) : (
        // Outro: Smooth layered closing soundwave
        <g fill="none" strokeLinecap="round">
          <path d="M 9 23 Q 16.5 13 24 23 T 39 23" stroke="#FFFDF7" strokeWidth="2.6" />
          <path d="M 11 30 Q 18.5 22 26 30 T 37 30" stroke="#65B8B0" strokeWidth="2.2" />
          <circle cx="38" cy="15" r="2.3" fill="#FFFDF7" />
        </g>
      )}
    </svg>
  );
}

/**
 * Celebration Confetti strictly using the Teal + Cream + White palette:
 * Teal (#087F8C), Soft teal (#65B8B0), Pale aqua (#E8F6F3), Cream (#FFFDF7), Dark teal (#243B3A)
 */
export function CelebrationConfetti() {
  const pieces = [
    { left: "4%", delay: "0s", duration: "2.6s", color: "#087F8C", size: 11, type: "square" },
    { left: "10%", delay: "0.35s", duration: "3.1s", color: "#FFFDF7", size: 9, type: "circle" },
    { left: "16%", delay: "0.15s", duration: "2.8s", color: "#65B8B0", size: 13, type: "strip" },
    { left: "22%", delay: "0.55s", duration: "2.5s", color: "#E8F6F3", size: 10, type: "square" },
    { left: "28%", delay: "0.2s", duration: "3.0s", color: "#087F8C", size: 12, type: "strip" },
    { left: "34%", delay: "0.65s", duration: "2.7s", color: "#FFFDF7", size: 9, type: "circle" },
    { left: "40%", delay: "0.1s", duration: "2.9s", color: "#65B8B0", size: 11, type: "circle" },
    { left: "46%", delay: "0.45s", duration: "2.4s", color: "#E8F6F3", size: 12, type: "strip" },
    { left: "52%", delay: "0.25s", duration: "3.2s", color: "#243B3A", size: 10, type: "square" },
    { left: "58%", delay: "0.6s", duration: "2.6s", color: "#65B8B0", size: 10, type: "circle" },
    { left: "64%", delay: "0.12s", duration: "2.9s", color: "#FFFDF7", size: 12, type: "strip" },
    { left: "70%", delay: "0.5s", duration: "2.5s", color: "#087F8C", size: 11, type: "square" },
    { left: "76%", delay: "0.3s", duration: "3.1s", color: "#E8F6F3", size: 9, type: "circle" },
    { left: "82%", delay: "0.7s", duration: "2.7s", color: "#243B3A", size: 12, type: "strip" },
    { left: "88%", delay: "0.18s", duration: "2.8s", color: "#FFFDF7", size: 10, type: "square" },
    { left: "94%", delay: "0.4s", duration: "2.6s", color: "#65B8B0", size: 11, type: "circle" }
  ];

  return (
    <div
      className="pp-confetti-layer"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 60
      }}
      aria-hidden="true"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="pp-confetti-piece"
          style={{
            position: "absolute",
            top: "-24px",
            left: p.left,
            width: p.type === "strip" ? p.size * 1.9 : p.size,
            height: p.type === "strip" ? p.size * 0.55 : p.size,
            backgroundColor: p.color,
            border: p.color === "#243B3A" ? "1px solid #FFFDF7" : "none",
            borderRadius: p.type === "circle" ? "50%" : p.type === "strip" ? "2px" : "3px",
            animation: `pp-confetti-fall ${p.duration} linear infinite`,
            animationDelay: p.delay,
            opacity: 0.95
          }}
        />
      ))}
    </div>
  );
}

/**
 * Celebration Decorative Side Graphics (Left & Right)
 */
export function CelebrationSideGraphic({ side = "left" }) {
  const isLeft = side === "left";
  return (
    <svg
      width="64"
      height="180"
      viewBox="0 0 64 180"
      fill="none"
      aria-hidden="true"
      style={{
        transform: isLeft ? "none" : "scaleX(-1)",
        opacity: 0.92
      }}
    >
      <circle cx="24" cy="36" r="6" fill="#087F8C" />
      <path d="M 30 36 L 30 16 L 46 22 L 46 32" stroke="#243B3A" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="34" r="5" fill="#243B3A" />

      <path d="M 8 70 Q 20 60 32 70 T 56 70" stroke="#087F8C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 12 85 Q 24 75 36 85 T 60 85" stroke="#65B8B0" strokeWidth="2" strokeLinecap="round" />

      <rect x="14" y="110" width="5" height="24" rx="2.5" fill="#243B3A" />
      <rect x="24" y="100" width="5" height="34" rx="2.5" fill="#087F8C" />
      <rect x="34" y="115" width="5" height="19" rx="2.5" fill="#65B8B0" />

      <path
        d="M 28 150 L 30 156 L 36 158 L 30 160 L 28 166 L 26 160 L 20 158 L 26 156 Z"
        fill="#087F8C"
      />
    </svg>
  );
}

export function SunIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function MoonIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
