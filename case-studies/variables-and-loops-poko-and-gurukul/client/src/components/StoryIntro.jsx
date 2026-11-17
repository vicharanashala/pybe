import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./StoryIntro.css";

export default function StoryIntro({ data, onNext }) {
  const scenes = data.scenes || [];
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [typedText, setTypedText] = useState("");

  const currentScene = scenes[currentSceneIdx] || scenes[0];

  // Visual novel line-by-line typing dialogue text effect
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
    }, 22);

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

  const progressPercent = Math.round(((currentSceneIdx + 1) / scenes.length) * 100);

  return (
    <div className="storybook-65-35-container">
      {/* LEFT PANEL (65%): Large Full-Height 3D Pixar Panda Illustration Stage */}
      <div className="storybook-left-illustration-panel">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneIdx}
            className="illustration-stage-container"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            {/* Camera slow scale zoom motion container */}
            <motion.div
              className="camera-zoom-wrapper"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={currentScene.imagePath}
                alt={currentScene.title}
                className="full-height-story-img"
              />
            </motion.div>

            {/* Particle Canvas: Floating Leaves, Butterflies, & Glowing Fireflies */}
            <div className="storybook-particles-overlay">
              <span className="particle firefly f1">✨</span>
              <span className="particle firefly f2">✨</span>
              <span className="particle leaf l1">🍂</span>
              <span className="particle leaf l2">🍁</span>
              <span className="particle butterfly b1">🦋</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* RIGHT PANEL (35%): Premium Cream Paper Story Card with Vintage Wooden Frame */}
      <div className="storybook-right-card-panel">
        <div className="wooden-vintage-frame">
          <div className="cream-paper-texture-card">
            {/* Header badges */}
            <div className="card-top-header">
              <div className="header-tags">
                <span className="chapter-tag">📖 Chapter 1</span>
                <span className="scene-step-tag">Scene {currentSceneIdx + 1} / {scenes.length}</span>
              </div>
              <button className="skip-btn" onClick={onNext} title="Skip Story Intro">
                Skip Story ➔
              </button>
            </div>

            <div className="card-progress-bar-track">
              <div className="card-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <h2 className="story-title">{currentScene.title}</h2>

            <div className="speaker-header">
              <span className="speaker-emoji">🐼</span>
              <span className="speaker-title-text">Poko's Winter Story</span>
            </div>

            {/* Narration line-by-line typing container */}
            <div className="narration-paper-box">
              <p className="typed-narration-text">{typedText}</p>
            </div>

            {/* Controls */}
            <div className="story-controls-column">
              <button
                className="btn btn-primary large-next-btn button-glow"
                onClick={handleNextScene}
              >
                {currentSceneIdx < scenes.length - 1 ? "Next Scene →" : "Learn Variables →"}
              </button>

              <div className="secondary-controls-row">
                <button
                  className="btn btn-secondary prev-scene-btn"
                  onClick={handlePrevScene}
                  disabled={currentSceneIdx === 0}
                >
                  ← Previous
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
