import React from "react";
import { motion } from "framer-motion";
import "./ForestStage.css";

/**
 * Bright Magical Fantasy Learning Environment (Disney / Studio Ghibli Inspired)
 * Peaceful, warm morning sunlight, wooden learning platform, floating butterflies, fireflies, birds & leaves
 */

const LOCATION_THEMES = {
  story_intro: { name: "Sunlit Apple Orchard 🍎", icon: "🍏", bgClass: "bg-apple-orchard" },
  quick_intro: { name: "Bright Bamboo Sanctuary 🎋", icon: "🛖", bgClass: "bg-storage-hut" },
  story: { name: "Warm Sunlit Shelter ☀️", icon: "🛖", bgClass: "bg-storage-hut" },
  observation: { name: "Golden Honey Grove 🍯", icon: "🍯", bgClass: "bg-honey-cave" },
  questions: { name: "Sunlit Apple Orchard 🍎", icon: "🍏", bgClass: "bg-apple-orchard" },
  pattern_discovery: { name: "Enchanted Berry Garden 🍓", icon: "🍓", bgClass: "bg-berry-garden" },
  concept_reveal: { name: "Wisdom Tree Sanctuary 🦉", icon: "🦉", bgClass: "bg-owl-library" },
  integer_vs_float: { name: "Sunlit Math Orchard 🔍", icon: "🔍", bgClass: "bg-apple-orchard" },
  boolean_real_life: { name: "Decision Grove 🌿", icon: "🌍", bgClass: "bg-storage-hut" },
  boolean_memory_game: { name: "Wisdom Sanctuary 🦉", icon: "🦉", bgClass: "bg-owl-library" },
  boolean_forest_decision: { name: "Golden Forest Trail ⚡", icon: "⚡", bgClass: "bg-honey-cave" },
  boolean_boss_challenge: { name: "Sunlit Temple Platform 🏛️", icon: "🏛️", bgClass: "bg-celebration" },
  string_puzzle_adventure: { name: "Sunlit Whispering Bamboo 🦜", icon: "🦜", bgClass: "bg-owl-library" },
  string_final_challenge: { name: "Sunlit Whispering Bamboo 📖", icon: "📖", bgClass: "bg-owl-library" },
  python_syntax: { name: "Wisdom Sanctuary 🦉", icon: "🦉", bgClass: "bg-owl-library" },
  guided_practice: { name: "Crafting Bench 🛖", icon: "🛖", bgClass: "bg-storage-hut" },
  case_study: { name: "Golden Storage Vault 🍯", icon: "🍯", bgClass: "bg-honey-cave" },
  playground: { name: "Poko's Crafting Bench 📖", icon: "📖", bgClass: "bg-storage-hut" },
  challenge: { name: "Sunny Forest Summit ☀️", icon: "☀️", bgClass: "bg-winter-camp" },
  success_screen: { name: "Golden Celebration Forest 🎉", icon: "🎉", bgClass: "bg-celebration" },
};

export default function ForestStage({ stepType, children }) {
  const theme = LOCATION_THEMES[stepType] || LOCATION_THEMES.story_intro;

  return (
    <div className={`forest-stage-environment ${theme.bgClass}`}>
      {/* Volumetric Morning Sunlight Beams */}
      <div className="forest-sunlight-beam" />
      <div className="forest-sunlight-beam-secondary" />
      <div className="forest-canopy-vignette" />

      {/* Atmospheric Forest Flora & Water Stream Details */}
      <div className="forest-ground-decor">
        <span className="decor-flower df-1">🌸</span>
        <span className="decor-flower df-2">🌼</span>
        <span className="decor-flower df-3">🌺</span>
        <span className="decor-shroom ds-1">🍄</span>
        <span className="decor-shroom ds-2">🍄</span>
      </div>

      {/* Environmental Animated Particles Layer */}
      <div className="forest-particles-layer">
        {/* Floating Butterflies */}
        <motion.span
          className="butterfly bf-1"
          animate={{
            x: [0, 80, 160, 80, 0],
            y: [0, -30, -10, -40, 0],
            rotate: [0, 15, -10, 10, 0]
          }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        >
          🦋
        </motion.span>
        <motion.span
          className="butterfly bf-2"
          animate={{
            x: [0, -100, -50, -120, 0],
            y: [0, -50, -20, -60, 0],
            rotate: [0, -15, 10, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 3 }}
        >
          🦋
        </motion.span>

        {/* Flying Birds */}
        <motion.span
          className="bird bd-1"
          animate={{ x: [-100, 1200], y: [0, -20, 10, -15] }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        >
          🐦
        </motion.span>
        <motion.span
          className="bird bd-2"
          animate={{ x: [-150, 1250], y: [-10, 15, -25, 5] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear", delay: 8 }}
        >
          🐤
        </motion.span>

        {/* Gentle Falling Leaves */}
        <motion.span
          className="leaf leaf-1"
          animate={{ y: [0, 700], x: [0, 40, -40, 20], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          🍃
        </motion.span>
        <motion.span
          className="leaf leaf-2"
          animate={{ y: [0, 750], x: [0, -50, 30, -20], rotate: [0, -360] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear", delay: 2 }}
        >
          🍁
        </motion.span>

        {/* Glowing Fireflies */}
        <motion.span
          className="firefly ff-1"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -30, 0], scale: [0.9, 1.2, 0.9] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          ✨
        </motion.span>
        <motion.span
          className="firefly ff-2"
          animate={{ opacity: [0.2, 0.9, 0.2], y: [0, -45, 0], scale: [0.8, 1.1, 0.8] }}
          transition={{ repeat: Infinity, duration: 5, delay: 1.5 }}
        >
          🌟
        </motion.span>
      </div>

      {/* Main Content Area */}
      <div className="forest-stage-content">
        {/* Location Badge Wooden Signboard */}
        <div className="location-sign-wrapper">
          <motion.div
            className="forest-location-sign"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={theme.name}
          >
            <span className="loc-icon">{theme.icon}</span>
            <span className="loc-text">{theme.name}</span>
          </motion.div>
        </div>

        {children}
      </div>
    </div>
  );
}
