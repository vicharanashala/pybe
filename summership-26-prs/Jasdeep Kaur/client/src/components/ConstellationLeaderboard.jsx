import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ConstellationLeaderboard.css";

export default function ConstellationLeaderboard({ xp = 3500, coins = 150, accuracy = 96, streak = 7, onBackToChallenge }) {
  // LEARNERS DATASET
  const learners = [
    {
      id: 1,
      rank: 1,
      name: "Aarav The North Star",
      xp: 24500,
      coins: 980,
      accuracy: 99,
      streak: 28,
      starTitle: "The North Star 👑",
      badge: "🥇 CHAMPION",
      avatar: "👑"
    },
    {
      id: 2,
      rank: 2,
      name: "Kavya Blue Giant",
      xp: 18200,
      coins: 740,
      accuracy: 98,
      streak: 21,
      starTitle: "Blue Giant Star 🟦",
      badge: "🥈 RUNNER UP",
      avatar: "👩‍🚀"
    },
    {
      id: 3,
      rank: 3,
      name: "Reyansh Nebula Star",
      xp: 14800,
      coins: 610,
      accuracy: 96,
      streak: 16,
      starTitle: "Purple Nebula Star 🟣",
      badge: "🥉 3RD PLACE",
      avatar: "🥷"
    },
    {
      id: 4,
      rank: 4,
      name: "Ananya Cosmic Spark",
      xp: 11400,
      coins: 480,
      accuracy: 95,
      streak: 14,
      starTitle: "Cosmic Star 🌌",
      avatar: "🧝‍♀️"
    },
    {
      id: 5,
      rank: 5,
      name: "Vihaan Golden Ray",
      xp: 9200,
      coins: 390,
      accuracy: 94,
      streak: 11,
      starTitle: "Golden Star ☀️",
      avatar: "🦸‍♂️"
    },
    {
      id: 6,
      rank: 6,
      name: "Isha Glowing Ember",
      xp: 7600,
      coins: 310,
      accuracy: 93,
      streak: 9,
      starTitle: "Glowing Star 💫",
      avatar: "👩‍🔬"
    },
    {
      id: 7,
      rank: 7,
      name: "You (Cosmic Apprentice)",
      isUser: true,
      xp: xp,
      coins: coins,
      accuracy: accuracy,
      streak: streak,
      starTitle: "Bright Apprentice 🌟",
      avatar: "🧙‍♂️"
    },
    {
      id: 8,
      rank: 8,
      name: "Aditya Tiny Spark",
      xp: 1200,
      coins: 80,
      accuracy: 88,
      streak: 3,
      starTitle: "Young Star ⭐",
      avatar: "👶"
    }
  ];

  const topThree = learners.slice(0, 3);
  const remainingLearners = learners.slice(3);

  return (
    <div className="constellation-container">
      {/* HEADER CARD */}
      <header className="galaxy-header-card">
        <div className="galaxy-header-left">
          <span className="galaxy-header-icon">🏆</span>
          <div>
            <h1 className="galaxy-header-title">Constellation Leaderboard</h1>
            <div className="galaxy-header-subtitle">"Poko's Forest Coder Hall of Fame"</div>
          </div>
        </div>

        {onBackToChallenge && (
          <button
            className="magical-action-btn"
            style={{ fontSize: "14px", padding: "10px 20px" }}
            onClick={onBackToChallenge}
          >
            🧠 Back to Challenge →
          </button>
        )}
      </header>

      {/* LEADERBOARD MAIN BOARD */}
      <div className="leaderboard-main-card">
        {/* TOP 3 PODIUM SECTION */}
        <div className="podium-grid">
          {/* Rank 2 (Left) */}
          <motion.div
            className="podium-card rank-2-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="podium-crown-tag">🥈 RANK 2</div>
            <div className="podium-avatar">{topThree[1].avatar}</div>
            <h3 className="podium-name">{topThree[1].name}</h3>
            <div className="podium-title-tag">{topThree[1].starTitle}</div>
            <div className="podium-xp">{topThree[1].xp} XP</div>
          </motion.div>

          {/* Rank 1 (Center Apex) */}
          <motion.div
            className="podium-card rank-1-card"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1.05 }}
            transition={{ delay: 0.2 }}
          >
            <div className="podium-crown-tag rank-1-tag">🥇 APEX CHAMPION</div>
            <div className="podium-avatar rank-1-avatar">{topThree[0].avatar}</div>
            <h2 className="podium-name rank-1-name">{topThree[0].name}</h2>
            <div className="podium-title-tag">{topThree[0].starTitle}</div>
            <div className="podium-xp rank-1-xp">{topThree[0].xp} XP</div>
          </motion.div>

          {/* Rank 3 (Right) */}
          <motion.div
            className="podium-card rank-3-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="podium-crown-tag">🥉 RANK 3</div>
            <div className="podium-avatar">{topThree[2].avatar}</div>
            <h3 className="podium-name">{topThree[2].name}</h3>
            <div className="podium-title-tag">{topThree[2].starTitle}</div>
            <div className="podium-xp">{topThree[2].xp} XP</div>
          </motion.div>
        </div>

        {/* RANKS #4 TO #8 TABLE LIST */}
        <div className="leaderboard-list">
          <div className="list-header-row">
            <span className="col-rank">RANK</span>
            <span className="col-user">CODER</span>
            <span className="col-title">STAR TITLE</span>
            <span className="col-acc">ACCURACY</span>
            <span className="col-streak">STREAK</span>
            <span className="col-xp">TOTAL XP</span>
          </div>

          {remainingLearners.map((learner) => (
            <motion.div
              key={learner.id}
              className={`leaderboard-row ${learner.isUser ? "user-row-highlight" : ""}`}
              whileHover={{ scale: 1.015 }}
            >
              <div className="col-rank">
                <span className={`rank-badge ${learner.isUser ? "user-badge" : ""}`}>
                  #{learner.rank}
                </span>
              </div>
              <div className="col-user">
                <span className="row-avatar">{learner.avatar}</span>
                <span className="row-name">{learner.name}</span>
                {learner.isUser && <span className="you-pill-tag">YOU</span>}
              </div>
              <div className="col-title">{learner.starTitle}</div>
              <div className="col-acc">{learner.accuracy}%</div>
              <div className="col-streak">🔥 {learner.streak}d</div>
              <div className="col-xp">{learner.xp} XP</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
