import React, { useState } from "react";
import { motion } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./GuidedPractice.css";

export default function GuidedPractice({ data, onNext, onAddXp, onUpdateMemory }) {
  const { title, subtitle, exercises } = data;
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const ex = exercises[currentExIdx];

  const handleInputChange = (val) => {
    setInputValue(val);
    // Real-time preview in memory
    const codeLine = `${ex.prefix}${val}`;
    const { memoryMap, errors } = parsePythonCodeToMemory(codeLine);
    if (onUpdateMemory) {
      onUpdateMemory(memoryMap, `Guided Practice preview: ${codeLine}`, errors);
    }
  };

  const handleVerify = () => {
    const trimmed = inputValue.trim();
    if (trimmed === ex.expected) {
      setIsCorrect(true);
      setErrorMsg("");
      const fullLine = `${ex.prefix}${trimmed}`;
      const { memoryMap, errors } = parsePythonCodeToMemory(fullLine);
      if (onUpdateMemory) {
        onUpdateMemory(memoryMap, `✨ Variable successfully stored in Poko's Memory!`, errors);
      }
      if (onAddXp) onAddXp(25);
    } else {
      setIsCorrect(false);
      const fullLine = `${ex.prefix}${trimmed}`;
      const { errors } = parsePythonCodeToMemory(fullLine);
      if (errors.length > 0) {
        setErrorMsg(errors[0].message);
      } else {
        setErrorMsg(`Not quite right. Make sure to use quotes like ${ex.expected}!`);
      }
    }
  };

  const handleNextEx = () => {
    setInputValue("");
    setIsCorrect(false);
    setShowHint(false);
    setErrorMsg("");
    if (currentExIdx < exercises.length - 1) {
      setCurrentExIdx(currentExIdx + 1);
    } else {
      onNext();
    }
  };

  return (
    <div className="step-container">
      <motion.div
        className="paper-scroll-panel guided-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="guided-header">
          <span className="guided-badge">✏️ GUIDED CODING PRACTICE</span>
          <span className="ex-counter">
            Exercise {currentExIdx + 1} of {exercises.length}
          </span>
        </div>

        <h2 className="guided-title">{title}</h2>
        <p className="guided-subtitle">{subtitle}</p>

        {/* Exercise Prompt Box */}
        <div className="prompt-card">
          <p className="prompt-text">{ex.prompt}</p>
        </div>

        {/* Interactive Code Fill-in-the-Blank Slot */}
        <div className="code-blank-container">
          <div className="code-editor-row">
            <span className="code-prefix">{ex.prefix}</span>
            <input
              type="text"
              className={`blank-input ${isCorrect ? "blank-success" : ""}`}
              placeholder={ex.placeholder}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
          </div>
        </div>

        {/* Hints and Validation */}
        <div className="feedback-hint-row">
          <button
            className="btn btn-secondary hint-toggle-btn"
            onClick={() => setShowHint(!showHint)}
          >
            💡 {showHint ? "Hide Hint" : "Need a Hint?"}
          </button>

          {!isCorrect && (
            <button className="btn btn-primary check-btn" onClick={handleVerify}>
              Check Answer ✓
            </button>
          )}
        </div>

        {showHint && (
          <motion.div
            className="hint-box"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <p>🔍 <strong>Hint:</strong> {ex.hint}</p>
          </motion.div>
        )}

        {isCorrect && (
          <motion.div
            className="success-box"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p>🎉 Excellent! Variable assigned successfully (+25 XP). Check Poko's Memory Storage on the right!</p>
          </motion.div>
        )}

        {errorMsg && !isCorrect && <p className="error-text">{errorMsg}</p>}

        <div className="guided-footer">
          <button
            className="btn btn-primary button-glow"
            disabled={!isCorrect}
            onClick={handleNextEx}
          >
            {currentExIdx < exercises.length - 1 ? "Next Exercise →" : "Proceed to Case Study →"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
