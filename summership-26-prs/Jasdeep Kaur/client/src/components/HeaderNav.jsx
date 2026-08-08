import React from "react";
import { motion } from "framer-motion";
import "./HeaderNav.css";

/**
 * 🗺️ Forest Journey Map Navigation Header
 * AAA Educational Adventure Game Navigation for Poko Panda & Pip Sparrow
 */
export default function HeaderNav({
  activeChapter = 1,
  currentStep = 0,
  totalSteps,
  stepTitle,
  xp,
  coins,
  onPrev,
  onNext,
  onSelectStep,
  canPrev,
  canNext,
}) {
  const leaves = Math.floor(xp / 10);

  // 1. POKO PANDA'S CHAPTER 1 MILESTONES (13 NODES)
  const POKO_MILESTONES = [
    { icon: "📜", label: "Story", desc: "Poko's Winter Story" },
    { icon: "📦", label: "Intro", desc: "Introduction to Variables" },
    { icon: "🛖", label: "Hut", desc: "Storage Hut Exploration" },
    { icon: "👁️", label: "Observe", desc: "Observe Jar Labels" },
    { icon: "❓", label: "Quiz", desc: "Variable Basics Quiz" },
    { icon: "💡", label: "Pattern", desc: "Pattern Discovery" },
    { icon: "✨", label: "Concept", desc: "Variable Container Concept" },
    { icon: "🐍", label: "Syntax", desc: "Python Assignment Syntax" },
    { icon: "✏️", label: "Practice", desc: "Guided Coding Practice" },
    { icon: "🏥", label: "Case", desc: "Storage Hut Case Study" },
    { icon: "📖", label: "Play", desc: "Code Playground" },
    { icon: "🎯", label: "Mission", desc: "Save Poko's Winter Food" },
    { icon: "🎉", label: "Victory", desc: "Chapter 1 Rewards" },
  ];

  // 2. PIP SPARROW'S CHAPTER 2 INTEGER LEARNING JOURNEY (15 NODES)
  const PIP_INTEGER_MILESTONES = [
    { icon: "🌿", label: "Chapter Introduction", desc: "Start the Integer journey in Seed Valley." },
    { icon: "🐦", label: "Meet Pip Sparrow", desc: "Meet Pip Sparrow, Master Counter of Seed Valley." },
    { icon: "📖", label: "Integer Story", desc: "Read the scattered harvest story." },
    { icon: "💡", label: "What is an Integer?", desc: "Learn whole numbers without decimals." },
    { icon: "👀", label: "Observation", desc: "Observe Integer values in nature." },
    { icon: "🍎", label: "Integer Examples", desc: "Learn where Integer values are used." },
    { icon: "❓", label: "Interactive Quiz", desc: "Test your Integer knowledge." },
    { icon: "🧩", label: "Matching Challenge", desc: "Match Integer values with categories." },
    { icon: "🎮", label: "Mini Games", desc: "Play Seed Counter, Egg Basket, Nut Collector, Apple Catch." },
    { icon: "💻", label: "Coding Practice", desc: "Write Integer variables in Python." },
    { icon: "🧠", label: "Memory Visualization", desc: "Watch Integer values fly into memory boxes." },
    { icon: "⚔️", label: "Boss Mission", desc: "Save Seed Valley from the windstorm." },
    { icon: "🏆", label: "Rewards", desc: "Open the Integer Guardian treasure chest." },
    { icon: "💎", label: "Integer Crystal", desc: "Restore the Integer Crystal to the Temple." },
    { icon: "💧", label: "Float Variables", desc: "Locked until Integer is completed.", isLockedNode: true },
  ];

  const milestones = activeChapter === 2 ? PIP_INTEGER_MILESTONES : POKO_MILESTONES;
  const isAllCompleted = currentStep >= milestones.length - 2;

  return (
    <header className="forest-journey-header">
      {/* Navigation Left (Back Button) */}
      <div className="header-nav-left">
        <button
          className="wooden-signpost-btn prev-sign"
          onClick={onPrev}
          disabled={!canPrev}
          title="Return to Previous Location"
        >
          🪧 🠔 Back
        </button>
      </div>

      {/* Center 🗺️ Forest Trail Journey Map Track */}
      <div className="header-nav-center">
        <div className="journey-map-title">
          <span className="map-badge">📖 Forest Trail:</span>
          <span className="current-location-name">
            {stepTitle || (activeChapter === 2 ? "🔮 Label vs Value" : "🎋 Poko's Variable Journey")}
          </span>
          {isAllCompleted && <span className="chapter-complete-badge">🌾 Journey Section Completed 🎉</span>}
        </div>

        {/* Trail Milestones Track */}
        <div className="journey-trail-track">
          {milestones.map((m, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isLocked = m.isLockedNode || idx > currentStep;

            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div
                    className={`trail-connector-line ${
                      idx <= currentStep ? "line-active" : "line-locked"
                    }`}
                  />
                )}
                <div className="milestone-node-wrapper">
                  <motion.div
                    className={`milestone-node ${
                      isCompleted ? "node-completed" : ""
                    } ${isCurrent ? "node-current" : ""} ${
                      isLocked ? "node-locked" : ""
                    }`}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isLocked && onSelectStep) onSelectStep(idx);
                    }}
                  >
                    <span className="milestone-icon">
                      {isLocked ? (m.isLockedNode ? "🔒 💧" : "🪵") : isCurrent ? (activeChapter === 2 ? "🐦" : "🏮") : isCompleted ? "🍃" : m.icon}
                    </span>

                    {isCurrent && (
                      <motion.div
                        className="current-glowing-ring"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.9, 0.3, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                      />
                    )}

                    {isCompleted && <span className="check-sparkle-badge">✓</span>}
                  </motion.div>

                  {/* Rich Storybook Hover Tooltip */}
                  <div className="milestone-tooltip-box">
                    <div className="tooltip-node-title">{idx + 1}. {m.label}</div>
                    <div className="tooltip-node-desc">{m.desc}</div>
                    {isLocked && <div className="tooltip-lock-tag">🔒 Locked Node</div>}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Right Rewards & Next Bar */}
      <div className="header-nav-right">
        <div className="forest-reward-badge xp-badge" title="Forest Magic XP">
          <span className="reward-icon">⚡</span>
          <span className="reward-val">{xp} XP</span>
        </div>
        <div className="forest-reward-badge coins-badge" title="Forest Gold Coins">
          <span className="reward-icon">🪙</span>
          <span className="reward-val">{coins}</span>
        </div>
        <div className="forest-reward-badge leaves-badge" title="Bamboo Leaves Collected">
          <span className="reward-icon">🍃</span>
          <span className="reward-val">{leaves}</span>
        </div>

        <button
          className="wooden-signpost-btn next-sign"
          onClick={onNext}
          disabled={!canNext}
          title="Proceed to Next Location"
        >
          Next 🠖 🪧
        </button>
      </div>
    </header>
  );
}
