import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./StoryPlayer.css";

// SVG Artwork renderer for Panda's Winter Storage scenes
const SceneArtwork = ({ bgType }) => {
  switch (bgType) {
    case "bamboo_forest":
      return (
        <svg viewBox="0 0 800 450" className="scene-svg">
          <defs>
            <linearGradient id="skyBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1B2440" />
              <stop offset="50%" stopColor="#232C48" />
              <stop offset="100%" stopColor="#161D32" />
            </linearGradient>
            <linearGradient id="bambooGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2ED573" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#26AF5F" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#skyBg)" />
          {/* Bamboo Stalks */}
          <rect x="50" y="20" width="30" height="380" rx="15" fill="url(#bambooGreen)" />
          <rect x="120" y="0" width="40" height="400" rx="20" fill="url(#bambooGreen)" />
          <rect x="220" y="40" width="25" height="360" rx="12" fill="url(#bambooGreen)" opacity="0.6" />
          <rect x="620" y="10" width="35" height="390" rx="17" fill="url(#bambooGreen)" />
          <rect x="700" y="30" width="30" height="370" rx="15" fill="url(#bambooGreen)" opacity="0.7" />

          {/* Cute Panda Poko Sprite */}
          <g transform="translate(350, 180)">
            {/* Body */}
            <ellipse cx="50" cy="110" rx="60" ry="70" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
            {/* Arms */}
            <ellipse cx="-5" cy="90" rx="20" ry="40" fill="#111827" transform="rotate(20 -5 90)" />
            <ellipse cx="105" cy="90" rx="20" ry="40" fill="#111827" transform="rotate(-20 105 90)" />
            {/* Head */}
            <circle cx="50" cy="30" r="50" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
            {/* Ears */}
            <circle cx="10" cy="-10" r="18" fill="#111827" />
            <circle cx="90" cy="-10" r="18" fill="#111827" />
            {/* Eyes */}
            <ellipse cx="30" cy="25" rx="12" ry="16" fill="#111827" />
            <circle cx="32" cy="22" r="5" fill="#FFFFFF" />
            <ellipse cx="70" cy="25" rx="12" ry="16" fill="#111827" />
            <circle cx="68" cy="22" r="5" fill="#FFFFFF" />
            {/* Nose & Smile */}
            <ellipse cx="50" cy="40" rx="8" ry="6" fill="#111827" />
            <path d="M 42 48 Q 50 56 58 48" stroke="#111827" strokeWidth="3" fill="none" />
          </g>
          <text x="400" y="390" fill="#7EF3FF" fontSize="16" fontFamily="sans-serif" textAnchor="middle" opacity="0.9">MAGICAL BAMBOO FOREST</text>
        </svg>
      );
    case "bamboo_harvest":
      return (
        <svg viewBox="0 0 800 450" className="scene-svg">
          <rect width="800" height="450" fill="#161D32" />
          {/* Panda holding foods */}
          <g transform="translate(350, 160)">
            <ellipse cx="50" cy="110" rx="60" ry="70" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
            <circle cx="50" cy="30" r="50" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
            <circle cx="10" cy="-10" r="18" fill="#111827" />
            <circle cx="90" cy="-10" r="18" fill="#111827" />
            <ellipse cx="30" cy="25" rx="12" ry="16" fill="#111827" />
            <circle cx="32" cy="22" r="5" fill="#FFFFFF" />
            <ellipse cx="70" cy="25" rx="12" ry="16" fill="#111827" />
            <circle cx="68" cy="22" r="5" fill="#FFFFFF" />
            <ellipse cx="50" cy="40" rx="8" ry="6" fill="#111827" />
            <path d="M 40 46 Q 50 58 60 46" stroke="#111827" strokeWidth="3" fill="none" />
          </g>

          {/* Floating Food Icons */}
          <g transform="translate(180, 150)"><text fontSize="40">🍎</text></g>
          <g transform="translate(240, 220)"><text fontSize="40">🍯</text></g>
          <g transform="translate(290, 120)"><text fontSize="40">🥕</text></g>
          <g transform="translate(480, 120)"><text fontSize="40">🌽</text></g>
          <g transform="translate(530, 220)"><text fontSize="40">🍓</text></g>
          <g transform="translate(580, 150)"><text fontSize="40">🥜</text></g>

          <text x="400" y="390" fill="#FFD8B0" fontSize="18" fontWeight="bold" textAnchor="middle">POKO'S WINTER HARVEST</text>
        </svg>
      );
    case "wind_storm":
      return (
        <svg viewBox="0 0 800 450" className="scene-svg">
          <defs>
            <linearGradient id="stormGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A1B30" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#stormGrad)" />
          {/* Wind gusts */}
          <path d="M 50 100 Q 250 50 450 120 T 750 80" stroke="#7EF3FF" strokeWidth="4" fill="none" opacity="0.6" strokeDasharray="20 10" />
          <path d="M 20 250 Q 300 200 550 280 T 780 220" stroke="#7EF3FF" strokeWidth="5" fill="none" opacity="0.7" strokeDasharray="15 10" />

          {/* Flying Food */}
          <g transform="translate(120, 80) rotate(45)"><text fontSize="36">🍎</text></g>
          <g transform="translate(340, 200) rotate(-30)"><text fontSize="36">🍯</text></g>
          <g transform="translate(560, 90) rotate(60)"><text fontSize="36">🥕</text></g>

          <text x="400" y="390" fill="#FF4D4D" fontSize="22" fontWeight="bold" textAnchor="middle">💨 STRONG WINTER WIND STORM!</text>
        </svg>
      );
    case "sad_panda":
      return (
        <svg viewBox="0 0 800 450" className="scene-svg">
          <rect width="800" height="450" fill="#141B2D" />
          {/* Sad Panda */}
          <g transform="translate(350, 180)">
            <ellipse cx="50" cy="110" rx="60" ry="70" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
            <circle cx="50" cy="30" r="50" fill="#FFFFFF" stroke="#111827" strokeWidth="4" />
            <circle cx="10" cy="-10" r="18" fill="#111827" />
            <circle cx="90" cy="-10" r="18" fill="#111827" />
            <ellipse cx="30" cy="30" rx="12" ry="16" fill="#111827" />
            <circle cx="32" cy="34" r="4" fill="#FFFFFF" />
            <ellipse cx="70" cy="30" rx="12" ry="16" fill="#111827" />
            <circle cx="68" cy="34" r="4" fill="#FFFFFF" />
            <ellipse cx="50" cy="42" rx="7" ry="5" fill="#111827" />
            {/* Sad downturned mouth */}
            <path d="M 40 56 Q 50 48 60 56" stroke="#111827" strokeWidth="3" fill="none" />
            {/* Tear drop */}
            <circle cx="75" cy="45" r="4" fill="#7EF3FF" />
          </g>

          <text x="400" y="390" fill="#A6C8FF" fontSize="16" textAnchor="middle">Poko is worried about surviving the winter...</text>
        </svg>
      );
    case "storage_room":
    default:
      return (
        <svg viewBox="0 0 800 450" className="scene-svg">
          <rect width="800" height="450" fill="#162238" />
          {/* Wooden Shelves & Cozy Lighting */}
          <rect x="100" y="80" width="600" height="260" rx="16" fill="rgba(30,42,70,0.8)" stroke="#5B8CFF" strokeWidth="3" />
          <line x1="120" y1="160" x2="680" y2="160" stroke="#5B8CFF" strokeWidth="3" />
          <line x1="120" y1="250" x2="680" y2="250" stroke="#5B8CFF" strokeWidth="3" />

          {/* Labeled Boxes */}
          <rect x="150" y="100" width="120" height="50" rx="10" fill="rgba(91,140,255,0.2)" stroke="#7EF3FF" strokeWidth="2" />
          <text x="210" y="130" fill="#7EF3FF" fontSize="14" fontWeight="bold" textAnchor="middle">Apple Box</text>

          <rect x="340" y="100" width="120" height="50" rx="10" fill="rgba(255,216,176,0.2)" stroke="#FFD8B0" strokeWidth="2" />
          <text x="400" y="130" fill="#FFD8B0" fontSize="14" fontWeight="bold" textAnchor="middle">Honey Box</text>

          <rect x="530" y="100" width="120" height="50" rx="10" fill="rgba(200,150,255,0.2)" stroke="#C896FF" strokeWidth="2" />
          <text x="590" y="130" fill="#C896FF" fontSize="14" fontWeight="bold" textAnchor="middle">Berry Box</text>

          <text x="400" y="390" fill="#2ED573" fontSize="18" fontWeight="bold" textAnchor="middle">WELCOME TO POKO'S WINTER STORAGE ROOM!</text>
        </svg>
      );
  }
};

export default function StoryPlayer({ data, onNext }) {
  const scenes = data.scenes || [];
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [typedText, setTypedText] = useState("");

  const currentScene = scenes[currentSceneIdx] || scenes[0];

  useEffect(() => {
    setTypedText("");
    const fullText = currentScene?.text || "";
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= fullText.length) {
        setTypedText(fullText.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [currentSceneIdx, currentScene]);

  const handleNextScene = () => {
    if (currentSceneIdx < scenes.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
    } else {
      onNext();
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(currentSceneIdx - 1);
    }
  };

  return (
    <div className="story-container">
      <div className="story-header-bar">
        <div className="story-scene-indicator">
          SCENE {currentSceneIdx + 1} / {scenes.length}
        </div>
        <div className="scene-dots">
          {scenes.map((_, i) => (
            <span
              key={i}
              className={`scene-dot ${i === currentSceneIdx ? "active" : ""}`}
              onClick={() => setCurrentSceneIdx(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSceneIdx}
          className="cinematic-stage"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6 }}
        >
          <div className="particle-layer">
            <span className="story-particle p1">🍃</span>
            <span className="story-particle p2">🍃</span>
            <span className="story-particle p3">❄️</span>
          </div>

          <SceneArtwork bgType={currentScene.bgType} />

          <div className="speaker-badge">
            <span className="speaker-avatar">🐼</span>
            <span className="speaker-name">{currentScene.speaker}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="dialogue-box glass-card">
        <h3 className="scene-heading">{currentScene.title}</h3>
        <p className="typed-dialogue">{typedText}</p>

        <div className="story-controls">
          <button
            className="btn btn-secondary scene-btn"
            onClick={handlePrevScene}
            disabled={currentSceneIdx === 0}
          >
            ← Previous
          </button>

          <button
            className="btn btn-primary scene-btn button-glow"
            onClick={handleNextScene}
          >
            {currentSceneIdx < scenes.length - 1 ? "Next Scene →" : "Proceed to Observation →"}
          </button>
        </div>
      </div>
    </div>
  );
}
