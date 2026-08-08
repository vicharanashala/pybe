import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Observation.css";

export default function Observation({ data, onNext, onAddXp }) {
  const { title, subtitle, questions } = data;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shake, setShake] = useState(false);

  const q = questions[currentIdx];

  const handleOptionClick = (opt) => {
    setSelectedOpt(opt);
    if (opt === q.answer) {
      setIsCorrect(true);
      if (onAddXp) onAddXp(25);
    } else {
      setIsCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsCorrect(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="step-container">
      <div className="observation-wrapper">
        {/* 🎯 Forest Mission Banner */}
        <div className="forest-mission-card">
          <span className="mission-badge-tag">🎯 Forest Mission</span>
          <span className="mission-title-text">What do you notice inside Poko's Storage Room?</span>
        </div>

        <motion.div
          className={`wooden-frame-card observation-card ${shake ? "shake-anim" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="obs-header">
            <span className="obs-badge">👁️ OBSERVATION CHECKPOINT</span>
            <span className="obs-counter">
              {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <h2 className="obs-title">{title}</h2>
          <p className="obs-subtitle">{subtitle}</p>

          <div className="paper-scroll-panel obs-prompt-box">
            <p className="obs-prompt-text">{q.prompt}</p>
          </div>

          <div className="obs-options-grid">
            {q.options.map((opt, idx) => {
              const isSel = selectedOpt === opt;
              let statusClass = "";
              if (isSel) {
                statusClass = isCorrect ? "correct-card" : "wrong-card";
              }

              return (
                <motion.button
                  key={idx}
                  className={`obs-option-card ${statusClass}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOptionClick(opt)}
                >
                  <span className="opt-number">{String.fromCharCode(65 + idx)}</span>
                  <span className="obs-opt-text">{opt}</span>
                  {isSel && isCorrect && <span className="feedback-icon">✓ +25 XP</span>}
                  {isSel && !isCorrect && <span className="feedback-icon">✗ Try again</span>}
                </motion.button>
              );
            })}
          </div>

          {isCorrect && (
            <motion.div
              className="explanation-box"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <p>💡 {q.explanation}</p>
            </motion.div>
          )}

          <div className="obs-footer">
            <button
              className="btn btn-primary button-glow"
              disabled={!isCorrect}
              onClick={handleNext}
            >
              {currentIdx < questions.length - 1 ? "Next Observation →" : "Continue to Questions →"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
