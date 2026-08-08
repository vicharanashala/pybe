import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "./SuccessScreen.css";

export default function SuccessScreen({ data, xp, coins, onNext, onNextChapter, onRestart }) {
  const { title, subtitle, missionName, badgeUnlocked, rewards, message, nextChapterId, nextChapterTitle } = data;

  return (
    <div className="step-container">
      <motion.div
        className="glass-card success-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="success-confetti-bg">
          <span className="confetti c1">🎉</span>
          <span className="confetti c2">✨</span>
          <span className="confetti c3">⭐</span>
          <span className="confetti c4">⚡</span>
          <span className="confetti c5">🪙</span>
        </div>

        <motion.div
          className="eva-thank-avatar"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🐼
        </motion.div>

        <h1 className="success-title">{title}</h1>
        <p className="success-subtitle">{subtitle || missionName}</p>

        {/* Story Message */}
        <div className="eva-dialogue-card">
          <p>
            {message || "Poko smiles happily! You have mastered this concept in Poko's Forest!"}
          </p>
        </div>

        {/* Unlocked Badge */}
        {badgeUnlocked && (
          <motion.div
            className="badge-unlocked-card"
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="badge-glow-ring">
              <span className="badge-icon-large">{badgeUnlocked.icon}</span>
            </div>
            <div className="badge-details">
              <span className="badge-header-tag">UNLOCKED ACHIEVEMENT BADGE</span>
              <h3 className="badge-title-text">{badgeUnlocked.title}</h3>
              <p className="badge-desc-text">{badgeUnlocked.description}</p>
            </div>
          </motion.div>
        )}

        {/* Rewards Summary Bar */}
        <div className="rewards-summary-bar">
          <div className="reward-stat">
            <span className="stat-label">TOTAL XP</span>
            <span className="stat-val xp-color">+{xp || rewards?.xp || 250} XP</span>
          </div>
          <div className="reward-stat">
            <span className="stat-label">CREDITS EARNED</span>
            <span className="stat-val coin-color">+{coins || rewards?.coins || 50} COINS</span>
          </div>
          <div className="reward-stat">
            <span className="stat-label">RANK UNLOCKED</span>
            <span className="stat-val rank-color">{rewards?.rank || "Forest Hero"}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="success-actions">
          {onRestart && (
            <button className="btn btn-secondary" onClick={onRestart}>
              🔄 Replay Chapter
            </button>
          )}
          {nextChapterId && onNextChapter ? (
            <button className="btn btn-primary button-glow" onClick={() => onNextChapter(nextChapterId)}>
              Unlock {nextChapterTitle || `Chapter ${nextChapterId}`} ➔
            </button>
          ) : onNext ? (
            <button className="btn btn-primary button-glow" onClick={onNext}>
              Next Step ➔
            </button>
          ) : (
            <button className="btn btn-primary button-glow" onClick={() => alert("🎉 Course Completed! You are a Python Variables Master!")}>
              Course Complete! 🎉
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
