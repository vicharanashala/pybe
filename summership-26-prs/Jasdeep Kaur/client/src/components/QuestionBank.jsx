import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./QuestionBank.css";

export default function QuestionBank({ data, onNext, onAddXp, onUpdateMemory }) {
  const { title, subtitle, bank } = data;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shake, setShake] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [droppedVal, setDroppedVal] = useState(null);
  const [arrangedItems, setArrangedItems] = useState([]);
  const [flipStates, setFlipStates] = useState({});

  // Interactive Pair Matching State
  const [selectedMatchKey, setSelectedMatchKey] = useState(null);
  const [matchedPairKeys, setMatchedPairKeys] = useState([]);
  const [pairShakeId, setPairShakeId] = useState(null);

  const q = bank[currentIdx];

  useEffect(() => {
    // Reset state on question change
    setSelectedOpt(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShake(false);
    setDroppedVal(null);
    setSelectedMatchKey(null);
    setMatchedPairKeys([]);
    setPairShakeId(null);
    if (q?.items) setArrangedItems(q.items);
  }, [currentIdx, q]);

  // Shuffled right-side values for match_pairs to make it a true jumbled matching activity
  const shuffledPairsRight = useMemo(() => {
    if (!q?.pairs) return [];
    // Jumble values deterministically
    const values = q.pairs.map((p) => ({ key: p.key, val: p.val }));
    // Reverse/shift so items are not directly opposite
    return [...values].reverse();
  }, [q]);

  const triggerMemoryUpdate = (customCode, message) => {
    if (onUpdateMemory && customCode) {
      const { memoryMap, errors } = parsePythonCodeToMemory(customCode);
      onUpdateMemory(memoryMap, message || "Live Memory updated!", errors);
    }
  };

  const handleMcqSelect = (optIdx, optVal) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx !== undefined ? optIdx : optVal);
    let correct = false;

    if (q.type === "mcq") {
      correct = optIdx === q.answer;
    } else if (q.type === "choose_label") {
      correct = optVal === q.answer;
    } else if (q.type === "true_false") {
      correct = optVal === q.answer;
    }

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      if (q.type === "choose_label") {
        const varName = String(optVal).replace(" Box", "").replace(" ✅", "").toLowerCase();
        triggerMemoryUpdate(`${varName} = "${optVal}"`, `Stored box '${varName}' in Poko's Memory!`);
      }
      if (onAddXp) onAddXp(20);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleDragDropSubmit = (val) => {
    setDroppedVal(val);
    const correct = val === q.correctValue;
    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      const varName = String(q.targetContainer || "honey").replace(" Box", "").toLowerCase();
      triggerMemoryUpdate(`${varName} = ${val}`, `Stored ${val} in ${varName} box!`);
      if (onAddXp) onAddXp(25);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleImageSelect = (card) => {
    setSelectedOpt(card.id);
    setIsAnswered(true);
    setIsCorrect(card.correct);
    if (card.correct) {
      triggerMemoryUpdate(`berries = "Sweet Berries"`, `Stored Sweet Berries in Poko's Memory!`);
      if (onAddXp) onAddXp(25);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // Interactive Pair Match Handler
  const handleMatchLeftClick = (pairObj) => {
    if (isAnswered) return;
    setSelectedMatchKey(pairObj);
    setPairShakeId(null);
  };

  const handleMatchRightClick = (targetValObj) => {
    if (isAnswered || !selectedMatchKey) return;

    if (selectedMatchKey.key === targetValObj.key) {
      // Correct match!
      const nextMatched = [...matchedPairKeys, targetValObj.key];
      setMatchedPairKeys(nextMatched);
      setSelectedMatchKey(null);
      setPairShakeId(null);

      if (nextMatched.length === q.pairs.length) {
        setIsAnswered(true);
        setIsCorrect(true);
        triggerMemoryUpdate(
          `carrot = "Crunchy Carrot"\ncorn = "Golden Corn"\nnuts = "Crisp Nuts"`,
          "Matched pairs in Poko's Memory!"
        );
        if (onAddXp) onAddXp(30);
      }
    } else {
      // Wrong match
      setPairShakeId(targetValObj.val);
      setTimeout(() => setPairShakeId(null), 500);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < bank.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      if (onNext) onNext();
    }
  };

  return (
    <div className="step-container">
      <div className="question-bank-wrapper">
        {/* 🎯 Forest Mission Banner */}
        <div className="forest-mission-card">
          <span className="mission-badge-tag">🎯 Forest Mission</span>
          <span className="mission-title-text">Solve 10 Interactive Forest Storage Challenges</span>
        </div>

        <motion.div
          className={`wooden-frame-card question-bank-card ${shake ? "shake-anim" : ""}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          key={currentIdx}
        >
          <div className="qb-header">
            <span className="qb-badge">{q.title || `QUESTION ${currentIdx + 1}`}</span>
            <span className="qb-progress-counter">
              {currentIdx + 1} of {bank.length}
            </span>
          </div>

          <h3 className="qb-question-text">{q.question}</h3>

          {/* Question Type 1: MCQ */}
          {q.type === "mcq" && (
            <div className="options-grid">
              {q.options.map((opt, idx) => {
                const isSel = selectedOpt === idx;
                let btnClass = "opt-btn";
                if (isAnswered && isSel) {
                  btnClass += isCorrect ? " opt-correct" : " opt-wrong";
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    disabled={isAnswered}
                    onClick={() => handleMcqSelect(idx, opt)}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Type 2: Choose Label */}
          {q.type === "choose_label" && (
            <div className="options-grid">
              {q.options.map((opt, idx) => {
                const isSel = selectedOpt === opt;
                let btnClass = "opt-btn";
                if (isAnswered && isSel) {
                  btnClass += isCorrect ? " opt-correct" : " opt-wrong";
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    disabled={isAnswered}
                    onClick={() => handleMcqSelect(undefined, opt)}
                  >
                    <span className="opt-letter">🏷️</span>
                    <span className="opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Type 3: True / False */}
          {q.type === "true_false" && (
            <div className="options-grid tf-grid">
              {q.options.map((opt, idx) => {
                const isSel = selectedOpt === opt;
                let btnClass = "opt-btn tf-btn";
                if (isAnswered && isSel) {
                  btnClass += isCorrect ? " opt-correct" : " opt-wrong";
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    disabled={isAnswered}
                    onClick={() => handleMcqSelect(undefined, opt)}
                  >
                    <span className="opt-text">{opt === "True" ? "✓ True" : "✗ False"}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Question Type 4: Drag & Drop */}
          {q.type === "drag_drop" && (
            <div className="drag-drop-stage">
              <div className="target-container-box">
                <span className="box-title">📦 Container: {q.targetContainer}</span>
                <div className="drop-slot">
                  {droppedVal ? (
                    <span className="dropped-item">{droppedVal}</span>
                  ) : (
                    <span className="drop-placeholder">Drop correct food item here 👇</span>
                  )}
                </div>
              </div>

              <div className="available-items-pool">
                {q.availableValues.map((val, idx) => (
                  <button
                    key={idx}
                    className="draggable-pill"
                    disabled={isAnswered}
                    onClick={() => handleDragDropSubmit(val)}
                  >
                    🍎 {val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Question Type 5: Image Select */}
          {q.type === "image_select" && (
            <div className="cards-selection-grid">
              {q.cards.map((card) => {
                const isSel = selectedOpt === card.id;
                let cardClass = "visual-card";
                if (isAnswered && isSel) {
                  cardClass += card.correct ? " card-correct" : " card-wrong";
                }

                return (
                  <div
                    key={card.id}
                    className={cardClass}
                    onClick={() => !isAnswered && handleImageSelect(card)}
                  >
                    <div className="card-tag">Option {card.id}</div>
                    <p className="card-label">{card.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Question Type 6: Arrange */}
          {q.type === "arrange" && (
            <div className="arrange-stage">
              <p className="arrange-hint">Order the items correctly:</p>
              <div className="arrange-list">
                {arrangedItems.map((item, idx) => (
                  <div key={idx} className="arrange-item-chip">
                    <span className="step-num">{idx + 1}.</span> {item}
                  </div>
                ))}
              </div>
              {!isAnswered && (
                <button
                  className="btn btn-primary arrange-check-btn button-glow"
                  onClick={() => {
                    setIsAnswered(true);
                    setIsCorrect(true);
                    if (onAddXp) onAddXp(25);
                  }}
                >
                  Confirm Sequence Order ✓
                </button>
              )}
            </div>
          )}

          {/* Question Type 7: INTERACTIVE MATCH PAIRS */}
          {q.type === "match_pairs" && (
            <div className="match-pairs-interactive-stage">
              <p className="match-hint-text">
                Tap a <strong>Storage Label</strong> on the left, then tap its matching <strong>Food Item</strong> on the right:
              </p>

              <div className="match-pairs-columns-grid">
                {/* Left Column: Storage Labels */}
                <div className="match-column left-match-col">
                  <h4>🏷️ Storage Label</h4>
                  {q.pairs.map((p, idx) => {
                    const isMatched = matchedPairKeys.includes(p.key);
                    const isSelected = selectedMatchKey?.key === p.key;

                    return (
                      <button
                        key={idx}
                        className={`match-node-btn left-node ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""}`}
                        disabled={isMatched || isAnswered}
                        onClick={() => handleMatchLeftClick(p)}
                      >
                        <span>🏷️ {p.key}</span>
                        {isMatched && <span className="match-check">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Shuffled Food Items */}
                <div className="match-column right-match-col">
                  <h4>📦 Food Item</h4>
                  {shuffledPairsRight.map((itemObj, idx) => {
                    const isMatched = matchedPairKeys.includes(itemObj.key);
                    const isShaking = pairShakeId === itemObj.val;

                    return (
                      <button
                        key={idx}
                        className={`match-node-btn right-node ${isMatched ? "matched" : ""} ${isShaking ? "shake-anim" : ""}`}
                        disabled={isMatched || isAnswered}
                        onClick={() => handleMatchRightClick(itemObj)}
                      >
                        <span>📦 {itemObj.val}</span>
                        {isMatched && <span className="match-check">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Explanation Card */}
          {isAnswered && (
            <motion.div
              className={`explanation-card ${isCorrect ? "exp-success" : "exp-error"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4>{isCorrect ? "🎉 Correct!" : "❌ Try Again!"}</h4>
              <p>{q.explanation || (isCorrect ? "Great job!" : "Review Poko's storage rules and try again.")}</p>
            </motion.div>
          )}

          <div className="qb-footer">
            <button
              className="btn btn-primary button-glow"
              disabled={!isAnswered}
              onClick={handleNextQuestion}
            >
              {currentIdx < bank.length - 1 ? "Next Question →" : "Proceed to Pattern Discovery →"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
