import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./QuickIntro.css";

const DEFAULT_BUTTERFLIES = [
  { id: "b1", specialName: "poko_name", carries: "🐼 \"Poko\"", icon: "🦋", color: "#7EF3FF", flower: "🌺 Pink Lotus" },
  { id: "b2", specialName: "poko_age", carries: "🎂 8 years old", icon: "🦋", color: "#FFD8B0", flower: "🌼 Golden Lily" },
  { id: "b3", specialName: "weight", carries: "⚖️ 98.8 kg", icon: "🦋", color: "#FFB7B2", flower: "🌸 Cherry Blossom" },
  { id: "b4", specialName: "height", carries: "📏 1.42 meters", icon: "🦋", color: "#E2F0CB", flower: "🌿 Sun Rose" },
  { id: "b5", specialName: "apples", carries: "🍎 18 apples", icon: "🦋", color: "#FF6B6B", flower: "🌺 Red Dahlia" },
  { id: "b6", specialName: "bamboo", carries: "🎋 42 sticks", icon: "🦋", color: "#2ED573", flower: "🌱 Bamboo Blossom" },
  { id: "b7", specialName: "honey_jars", carries: "🍯 5 jars", icon: "🦋", color: "#FFA502", flower: "🌻 Sunflower" },
  { id: "b8", specialName: "water", carries: "💧 2.5 Liters", icon: "🦋", color: "#1E90FF", flower: "🪷 Blue Water Lily" },
  { id: "b9", specialName: "energy", carries: "⭐ 95 energy", icon: "🦋", color: "#FFD700", flower: "✨ Starlight Orchid" },
  { id: "b10", specialName: "mood", carries: "😊 \"Happy\"", icon: "🦋", color: "#FF9FF3", flower: "🌸 Joy Peony" },
  { id: "b11", specialName: "coins", carries: "🪙 250 coins", icon: "🦋", color: "#FECA57", flower: "🌼 Golden Marigold" },
  { id: "b12", specialName: "favorite_food", carries: "🍱 \"Fresh Bamboo\"", icon: "🦋", color: "#54A0FF", flower: "🌿 Moon Orchid" }
];

/**
 * 70% / 30% Split Screen Concept Intro - Butterfly Memory Garden
 * Left: 70% Disney/Pixar Animated Butterfly Memory Garden
 * Right: 30% Parchment Concept Panel & Forest Mission
 */
export default function QuickIntro({ data, onNext }) {
  const { title, subtitle, description, caption, missionTitle } = data;
  const butterflies = data.butterflies || DEFAULT_BUTTERFLIES;

  const [activeButterfly, setActiveButterfly] = useState(butterflies[0]);

  return (
    <div className="step-container">
      <div className="concept-split-grid">
        {/* LEFT PANEL (70%): Large Animated Butterfly Memory Garden Stage (Cozy Wooden Environment) */}
        <motion.div
          className="concept-visual-stage 70-percent-stage memory-garden-stage"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cozy Pixar Wooden Wall Atmosphere Decor */}
          <div className="sunlight-top-beam" />
          <div className="vines-hanging-overlay">
            <span className="hanging-vine vine-left">🌿</span>
            <span className="hanging-vine vine-right">🍃</span>
            <span className="corner-moss moss-tl">🌱</span>
            <span className="corner-moss moss-tr">🍄</span>
            <span className="plank-flower pf-1">🌸</span>
            <span className="plank-flower pf-2">🌼</span>
            <span className="floating-firefly ff-1">✨</span>
            <span className="floating-firefly ff-2">💫</span>
          </div>

          <div className="visual-stage-header">
            <span className="stage-badge garden-badge">🌸 BUTTERFLY MEMORY GARDEN</span>
            <span className="garden-subtitle-badge">✨ 12 Magical Information Butterflies</span>
          </div>

          {/* Interactive Floating Butterflies Grid */}
          <div className="memory-garden-grid">
            {butterflies.map((b, idx) => {
              const isActive = activeButterfly?.id === b.id;
              return (
                <motion.div
                  key={b.id}
                  className={`butterfly-card ${isActive ? "active-butterfly" : ""}`}
                  style={{
                    "--butterfly-color": b.color
                  }}
                  whileHover={{ scale: 1.08, y: -6 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveButterfly(b)}
                  onMouseEnter={() => setActiveButterfly(b)}
                  animate={{
                    y: isActive ? -4 : [0, -5, 0],
                  }}
                  transition={{
                    y: { duration: 3 + (idx % 3), repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="butterfly-header-row">
                    <span className="butterfly-icon" style={{ textShadow: `0 0 12px ${b.color}` }}>
                      {b.icon}
                    </span>
                    <span className="wooden-special-tag">
                      🏷️ {b.specialName}
                    </span>
                  </div>

                  <div className="flower-landing-bed">
                    <span className="flower-emoji">{b.flower.split(" ")[0]}</span>
                    <span className="carried-info-text">{b.carries}</span>
                  </div>

                  {isActive && (
                    <motion.div
                      className="sparkle-ring"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.25, opacity: [0.8, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Active Flower Inspection & Landing Plaque */}
          <div className="active-inspection-plaque">
            <AnimatePresence mode="wait">
              {activeButterfly ? (
                <motion.div
                  key={activeButterfly.id}
                  className="inspection-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="inspection-left">
                    <span className="big-butterfly-emoji" style={{ filter: `drop-shadow(0 0 12px ${activeButterfly.color})` }}>
                      {activeButterfly.icon}
                    </span>
                    <div>
                      <div className="tag-label-small">Special Name Tag</div>
                      <div className="tag-name-large">🏷️ {activeButterfly.specialName}</div>
                    </div>
                  </div>

                  <div className="inspection-divider">➔</div>

                  <div className="inspection-right">
                    <div className="tag-label-small">Lands on {activeButterfly.flower} & Carries:</div>
                    <div className="carried-value-large">{activeButterfly.carries}</div>
                  </div>
                </motion.div>
              ) : (
                <div className="inspection-placeholder">
                  ✨ Hover or click any butterfly to watch it land on a flower and open its special wooden name tag!
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="stage-caption">
            {caption || "✨ Hover or click any butterfly to watch it land on a flower and open its special wooden name tag!"}
          </div>
        </motion.div>

        {/* RIGHT PANEL (30%): Parchment Concept Panel & Forest Mission */}
        <motion.div
          className="concept-info-panel 30-percent-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* 🎯 Forest Mission Badge */}
          <div className="forest-mission-card">
            <span className="mission-badge-tag">🎯 Forest Mission</span>
            <span className="mission-title-text">{missionTitle || "Explore the Butterfly Memory Garden"}</span>
          </div>

          {/* Carved Title Board */}
          <div className="carved-wooden-board">
            <h2>{title}</h2>
            {subtitle && <p className="subtitle-text">{subtitle}</p>}
          </div>

          {/* Parchment Scroll Description */}
          <div className="paper-scroll-panel">
            {description && description.split("\n\n").map((para, idx) => (
              <p key={idx} className="scroll-body-text" style={{ marginBottom: idx < description.split("\n\n").length - 1 ? "12px" : "0" }}>
                {para}
              </p>
            ))}
          </div>

          <div className="concept-action-area">
            <motion.button
              className="btn btn-primary button-glow full-width-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
            >
              Explore Memory Garden →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
