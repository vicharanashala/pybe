import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import challengeDataRaw from "../data/variablesFinalChallenge.json";
import "./VariablesFinalChallenge.css";

// Fail-safe data extractor for Vite/CJS module imports
const challengeData = challengeDataRaw?.conceptQuestions ? challengeDataRaw : (challengeDataRaw?.default || {});

export default function VariablesFinalChallenge({ onAddXp, onOpenLeaderboard }) {
  // LEVEL SELECTION STATE
  const [activeLevel, setActiveLevel] = useState(1); // 1 = Level 1 Concepts, 2 = Level 2 Coding
  const [level2Unlocked, setLevel2Unlocked] = useState(true); // Unlocked directly for learner access

  // LEVEL 1 CONCEPT STATE
  const [questions, setQuestions] = useState(() => {
    const raw = challengeData.conceptQuestions || [];
    const shuffled = [...raw].sort(() => Math.random() - 0.5);
    return shuffled.map(q => ({
      ...q,
      shuffledOptions: q.options ? [...q.options].sort(() => Math.random() - 0.5) : []
    }));
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timeSeconds, setTimeSeconds] = useState(0);

  // LEVEL 2 CODING STATE
  const [codingChallenges, setCodingChallenges] = useState(() => {
    return challengeData.codingChallenges || [];
  });
  const [codingIdx, setCodingIdx] = useState(0);
  const [codingScore, setCodingScore] = useState(0);
  const [codingXp, setCodingXp] = useState(0);
  const [userCode, setUserCode] = useState(() => {
    const list = challengeData.codingChallenges || [];
    return list.length > 0 ? list[0].initialCode : "";
  });
  const [consoleOutput, setConsoleOutput] = useState("");
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [codingStreak, setCodingStreak] = useState(0);
  const [codingBestStreak, setCodingBestStreak] = useState(0);
  const [codingCheckpoint, setCodingCheckpoint] = useState(null);
  const [level2Completed, setLevel2Completed] = useState(false);
  const [codingTimeSeconds, setCodingTimeSeconds] = useState(0);
  const [codingFeedback, setCodingFeedback] = useState(null);

  // Timer intervals
  useEffect(() => {
    if (activeLevel === 1 && !levelCompleted) {
      const timer = setInterval(() => setTimeSeconds(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
    if (activeLevel === 2 && !level2Completed) {
      const timer = setInterval(() => setCodingTimeSeconds(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [activeLevel, levelCompleted, level2Completed]);

  // Update initial code when changing coding challenge
  useEffect(() => {
    if (codingChallenges && codingChallenges[codingIdx]) {
      setUserCode(codingChallenges[codingIdx].initialCode || "");
      setConsoleOutput("");
      setCodeSuccess(false);
      setCodingFeedback(null);
    }
  }, [codingIdx, codingChallenges]);

  const currentQ = (questions && questions[currentIdx]) || (questions && questions[0]) || null;
  const currentCoding = (codingChallenges && codingChallenges[codingIdx]) || (codingChallenges && codingChallenges[0]) || null;

  // Option Selection for Level 1
  const handleSelectOption = (opt) => {
    if (isChecked) return;
    setSelectedOpt(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOpt || isChecked || !currentQ) return;
    setIsChecked(true);

    const isCorrect = selectedOpt === currentQ.answer;

    if (isCorrect) {
      setScore(prev => prev + 2);
      setXpEarned(prev => prev + 20);
      setCorrectCount(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      if (onAddXp) onAddXp(20);
    } else {
      setWrongCount(prev => prev + 1);
      setStreak(0);
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 600);
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx === 10) setActiveCheckpoint("q10");
    else if (nextIdx === 25) setActiveCheckpoint("q25");
    else if (nextIdx === 40) setActiveCheckpoint("q40");

    if (questions && nextIdx < questions.length) {
      setCurrentIdx(nextIdx);
      setSelectedOpt(null);
      setIsChecked(false);
    } else {
      setLevelCompleted(true);
      const finalScore = score + (selectedOpt === currentQ?.answer && !isChecked ? 2 : 0);
      if (finalScore >= 70) {
        setLevel2Unlocked(true);
      } else {
        setLevel2Unlocked(false);
      }
      if (finalScore >= 90 && onAddXp) {
        onAddXp(100);
      }
    }
  };

  // LEVEL 2 Code Evaluator
  const evaluateCode = (codeToRun, challenge) => {
    if (!challenge) return { success: false, output: "" };

    const expectedRaw = (challenge.expectedOutput || "").toString().trim();
    const expectedLower = expectedRaw.toLowerCase();
    const cleanUserCode = (codeToRun || "").trim();

    if (!cleanUserCode) {
      return { success: false, output: "(empty answer)" };
    }

    const userTextLower = cleanUserCode.toLowerCase();

    // Text-based / Prediction / Fill-in challenge types where user enters an answer directly
    const textChallengeTypes = ["predict_output", "find_label", "find_value", "find_error", "match_output"];
    const isTextChallenge = textChallengeTypes.includes(challenge.type) || !challenge.initialCode;

    // Check if user answer directly matches the expected output
    const isDirectMatch = userTextLower === expectedLower ||
      userTextLower.includes(expectedLower) ||
      (expectedLower.length > 2 && expectedLower.includes(userTextLower));

    if (isTextChallenge && isDirectMatch) {
      return {
        success: true,
        output: cleanUserCode
      };
    }

    try {
      let outputLines = [];
      const lines = cleanUserCode.split("\n");
      const scope = {};

      lines.forEach(line => {
        let trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;

        // Check for compound assignments: +=, -=, *=, /=
        let compoundOp = null;
        if (trimmed.includes("+=")) compoundOp = "+=";
        else if (trimmed.includes("-=")) compoundOp = "-=";
        else if (trimmed.includes("*=")) compoundOp = "*=";
        else if (trimmed.includes("/=")) compoundOp = "/=";

        if (compoundOp) {
          const parts = trimmed.split(compoundOp).map(s => s.trim());
          const varName = parts[0];
          const expr = parts[1];
          let evalExpr = expr;
          Object.keys(scope).forEach(k => {
            evalExpr = evalExpr.replace(new RegExp(`\\b${k}\\b`, "g"), typeof scope[k] === "string" ? `'${scope[k]}'` : scope[k]);
          });
          try {
            const currentVal = scope[varName] !== undefined ? scope[varName] : 0;
            const rhsVal = eval(evalExpr);
            if (compoundOp === "+=") scope[varName] = currentVal + rhsVal;
            else if (compoundOp === "-=") scope[varName] = currentVal - rhsVal;
            else if (compoundOp === "*=") scope[varName] = currentVal * rhsVal;
            else if (compoundOp === "/=") scope[varName] = currentVal / rhsVal;
          } catch (e) {
            scope[varName] = expr;
          }
          return;
        }

        // Standard variable assignment: var = expr
        if (trimmed.includes("=") && !trimmed.includes("==") && !trimmed.includes("!=") && !trimmed.includes("<=") && !trimmed.includes(">=")) {
          const splitIdx = trimmed.indexOf("=");
          const varName = trimmed.substring(0, splitIdx).trim();
          const expr = trimmed.substring(splitIdx + 1).trim();

          if (expr === "True") scope[varName] = true;
          else if (expr === "False") scope[varName] = false;
          else {
            let evalExpr = expr;
            Object.keys(scope).forEach(k => {
              evalExpr = evalExpr.replace(new RegExp(`\\b${k}\\b`, "g"), typeof scope[k] === "string" ? `'${scope[k]}'` : scope[k]);
            });
            try {
              scope[varName] = eval(evalExpr);
            } catch (err) {
              scope[varName] = expr.replace(/['"]/g, "");
            }
          }
        }

        // Handle print statement: print(...)
        if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
          const inner = trimmed.substring(6, trimmed.length - 1).trim();
          if (scope[inner] !== undefined) {
            outputLines.push(String(scope[inner]));
          } else {
            try {
              let evalInner = inner;
              Object.keys(scope).forEach(k => {
                evalInner = evalInner.replace(new RegExp(`\\b${k}\\b`, "g"), typeof scope[k] === "string" ? `'${scope[k]}'` : scope[k]);
              });
              outputLines.push(String(eval(evalInner)));
            } catch (e) {
              outputLines.push(inner.replace(/['"]/g, ""));
            }
          }
        }
      });

      const actualOutput = outputLines.join("\n").trim();
      const actualOutputLower = actualOutput.toLowerCase();

      let isMatch = actualOutputLower === expectedLower;

      if (!isMatch && isDirectMatch) {
        isMatch = true;
      }

      if (!isMatch && Object.values(scope).some(val => String(val).toLowerCase() === expectedLower)) {
        isMatch = true;
      }

      if (!isMatch && expectedLower && cleanUserCode.replace(/\s+/g, "").toLowerCase().includes(expectedLower.replace(/\s+/g, "").toLowerCase())) {
        isMatch = true;
      }

      const displayOutput = actualOutput || (outputLines.length > 0 ? outputLines.join("\n") : (Object.values(scope).length > 0 ? Object.entries(scope).map(([k, v]) => `${k} = ${v}`).join("\n") : cleanUserCode));

      return {
        success: isMatch,
        output: displayOutput
      };
    } catch (err) {
      if (isDirectMatch) {
        return { success: true, output: cleanUserCode };
      }
      return {
        success: false,
        output: "SyntaxError: " + err.message
      };
    }
  };

  const handleRunCode = () => {
    if (!currentCoding) return;
    const res = evaluateCode(userCode, currentCoding);
    setConsoleOutput(res.output);
    setCodeSuccess(res.success);
    if (res.success) {
      setCodingFeedback({ type: "success", message: `✨ Output matches expected result (${currentCoding.expectedOutput})!` });
    } else {
      setCodingFeedback({ type: "error", message: `❌ Output '${res.output}' does not match expected '${currentCoding.expectedOutput}'.` });
    }
  };

  const handleSubmitCoding = () => {
    if (!currentCoding || codeSuccess) return;
    const res = evaluateCode(userCode, currentCoding);
    setConsoleOutput(res.output);
    setCodeSuccess(res.success);

    if (res.success) {
      setCodingScore(prev => prev + 2);
      setCodingXp(prev => prev + 30);
      setCodingStreak(prev => {
        const ns = prev + 1;
        if (ns > codingBestStreak) setCodingBestStreak(ns);
        return ns;
      });
      if (onAddXp) onAddXp(30);
      setCodingFeedback({ type: "success", message: "✨ Solution Correct (+2 Pts & +30 XP)!" });

      setTimeout(() => {
        setCodingFeedback(null);
        const nextIdx = codingIdx + 1;
        if (nextIdx === 10) setCodingCheckpoint("c10");
        else if (nextIdx === 25) setCodingCheckpoint("c25");
        else if (nextIdx === 40) setCodingCheckpoint("c40");

        if (codingChallenges && nextIdx < codingChallenges.length) {
          setCodingIdx(nextIdx);
        } else {
          setLevel2Completed(true);
          if (onAddXp) onAddXp(200);
        }
      }, 1000);
    } else {
      setCodingStreak(0);
      setCodingFeedback({ type: "error", message: `❌ Incorrect solution! Output: "${res.output}". Expected: "${currentCoding.expectedOutput}". Try again!` });
    }
  };

  // Performance Rating Helpers
  const getConceptRating = (sc) => {
    if (sc >= 90) return { title: "👑 Variables Master", level: "Master", icon: "👑" };
    if (sc >= 80) return { title: "⭐ Skilled Explorer", level: "Skilled", icon: "⭐" };
    if (sc >= 70) return { title: "🌳 Concept Explorer", level: "Explorer", icon: "🌳" };
    if (sc >= 50) return { title: "🌿 Active Learner", level: "Learner", icon: "🌿" };
    return { title: "🌱 Beginner Scout", level: "Beginner", icon: "🌱" };
  };

  const getCodingRating = (sc) => {
    if (sc >= 90) return { title: "👑 Variables Coding Master", level: "Master", icon: "👑" };
    if (sc >= 80) return { title: "🏆 Variables Expert", level: "Expert", icon: "🏆" };
    if (sc >= 70) return { title: "🥇 Skilled Programmer", level: "Skilled", icon: "🥇" };
    if (sc >= 50) return { title: "🥈 Junior Coder", level: "Junior", icon: "🥈" };
    return { title: "🥉 Beginner Coder", level: "Beginner", icon: "🥉" };
  };

  const accuracyPct = Math.round(((score / 2) / Math.max(1, currentIdx + (isChecked ? 1 : 0))) * 100);
  const codingAccuracyPct = Math.round(((codingScore / 2) / Math.max(1, codingIdx + 1)) * 100);
  const rating = getConceptRating(score);
  const codingRating = getCodingRating(codingScore);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rSecs = secs % 60;
    return `${mins}m ${rSecs}s`;
  };

  return (
    <div className="variables-master-container">
      {/* Sparkles */}
      <div className="magic-sparkle" style={{ top: "8%", left: "12%", width: "8px", height: "8px" }} />
      <div className="magic-sparkle" style={{ top: "25%", right: "18%", width: "12px", height: "12px" }} />

      {/* Header Banner */}
      <header className="level1-header-card">
        <div className="level1-title-group">
          <span className="level1-brain-icon">{activeLevel === 1 ? "🧠" : "💻"}</span>
          <div>
            <h1 className="level1-main-title">
              {activeLevel === 1 ? "Variables Master Challenge" : "Variables Coding Lab"}
            </h1>
            <div className="level1-subtitle">
              {activeLevel === 1
                ? '"You\'ve learned the concepts. Now prove you\'ve mastered them."'
                : '"Now it\'s time to write code and prove your programming skills."'}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={`nav-prev-btn ${activeLevel === 1 ? "active" : ""}`}
            style={{ padding: "8px 16px", borderRadius: "12px", background: activeLevel === 1 ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.05)", borderColor: "#ffe082", cursor: "pointer" }}
            onClick={() => setActiveLevel(1)}
          >
            Level 1: Concepts {levelCompleted && "✓"}
          </button>
          <button
            className={`nav-prev-btn ${activeLevel === 2 ? "active" : ""}`}
            style={{ padding: "8px 16px", borderRadius: "12px", background: activeLevel === 2 ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.05)", borderColor: "#ffe082", cursor: "pointer" }}
            onClick={() => setActiveLevel(2)}
          >
            Level 2: Coding {level2Completed ? "✓" : "🚀"}
          </button>
        </div>
      </header>

      {/* =========================================================
          LEVEL 1: CONCEPT CHALLENGE VIEW
         ========================================================= */}
      {activeLevel === 1 && !levelCompleted && currentQ && (
        <motion.div animate={shakeTrigger ? { x: [-12, 12, -8, 8, 0] } : {}}>
          <div className="level1-hud-grid">
            <div className="hud-tile" style={{ position: "relative" }}>
              <span className="hud-tile-label">Jump to Q</span>
              <select
                style={{
                  background: "#0f081c",
                  color: "#ffe082",
                  border: "1px solid #f59e0b",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "800",
                  padding: "2px 6px",
                  cursor: "pointer",
                  textAlign: "center"
                }}
                value={currentIdx}
                onChange={(e) => {
                  setCurrentIdx(Number(e.target.value));
                  setSelectedOpt(null);
                  setIsChecked(false);
                }}
              >
                {(questions || []).map((q, i) => (
                  <option key={i} value={i}>
                    Q{i + 1} ({q.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Current Score</span>
              <span className="hud-tile-value">{score} / 100 Pts</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">XP Earned</span>
              <span className="hud-tile-value">+{xpEarned} ⚡</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Accuracy</span>
              <span className="hud-tile-value">{accuracyPct}% 🎯</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Streak</span>
              <span className="hud-tile-value">{streak} 🔥</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Time Taken</span>
              <span className="hud-tile-value">{formatTime(timeSeconds)} ⏱️</span>
            </div>
          </div>

          <main className="assessment-card">
            {activeCheckpoint && (
              <motion.div className="checkpoint-modal-overlay" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: "64px", marginBottom: "12px" }}>
                  {activeCheckpoint === "q10" ? "🌟" : activeCheckpoint === "q25" ? "🎉" : "🚀"}
                </div>
                <h2 style={{ fontFamily: "Cinzel, serif", color: "#ffe082", fontSize: "26px" }}>
                  {activeCheckpoint === "q10" && "Great Start! 10 Challenges Conquered!"}
                  {activeCheckpoint === "q25" && "Halfway There! You're Glowing!"}
                  {activeCheckpoint === "q40" && "Final Sprint! Only 10 Challenges Left!"}
                </h2>
                <button className="magical-action-btn" onClick={() => setActiveCheckpoint(null)}>
                  Keep Going →
                </button>
              </motion.div>
            )}

            <div className="assessment-progress-outer">
              <div className="assessment-progress-inner" style={{ width: `${((currentIdx + 1) / (questions?.length || 1)) * 100}%` }} />
            </div>

            <div className="question-tags-row">
              <span className="tag-badge tag-scenario">🏷️ Theme: {currentQ?.category}</span>
              <span className="tag-badge tag-concept">🔮 Concept: {currentQ?.concept}</span>
            </div>

            <div className="question-prompt-text">{currentQ?.question}</div>

            <div className="options-2x2-grid">
              {(currentQ?.shuffledOptions || currentQ?.options || []).map((opt, idx) => {
                let statusClass = "";
                if (isChecked) {
                  if (opt === currentQ?.answer) statusClass = "correct-opt";
                  else if (opt === selectedOpt) statusClass = "wrong-opt";
                } else if (opt === selectedOpt) {
                  statusClass = "selected";
                }

                return (
                  <button key={idx} className={`assessment-opt-btn ${statusClass}`} onClick={() => handleSelectOption(opt)}>
                    <span>{opt}</span>
                    {statusClass === "correct-opt" && " ✨"}
                    {statusClass === "wrong-opt" && " ❌"}
                  </button>
                );
              })}
            </div>

            {isChecked && (
              <motion.div className={`feedback-banner ${selectedOpt === currentQ?.answer ? "success" : "error"}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <strong>{selectedOpt === currentQ?.answer ? "✨ Correct (+2 Pts & +20 XP)!" : "❌ Not quite right!"}</strong> {currentQ?.explanation}
              </motion.div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
              <div style={{ fontSize: "13px", color: "#94a3b8" }}>Remaining: {(questions?.length || 50) - (currentIdx + 1)} Questions</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {!isChecked ? (
                  <>
                    <button
                      className="nav-prev-btn"
                      style={{ padding: "12px 18px", borderRadius: "14px" }}
                      onClick={handleNextQuestion}
                    >
                      Skip / Next ⏭️
                    </button>
                    <button className="magical-action-btn" disabled={!selectedOpt} onClick={handleCheckAnswer}>Submit Answer ✨</button>
                  </>
                ) : (
                  <button className="magical-action-btn" onClick={handleNextQuestion}>Next Question →</button>
                )}
              </div>
            </div>
          </main>
        </motion.div>
      )}

      {/* LEVEL 1 RESULTS SCREEN */}
      {activeLevel === 1 && levelCompleted && (
        <motion.div
          className="assessment-card"
          style={{
            textAlign: "center",
            background: "linear-gradient(145deg, rgba(13,4,28,0.95), rgba(30,12,60,0.98))",
            position: "relative",
            overflow: "hidden"
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {/* Glowing portal effect if unlocked */}
          {score >= 70 && (
            <motion.div
              style={{
                position: "absolute",
                top: "-100px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,224,130,0.25) 0%, rgba(245,158,11,0.05) 60%, transparent 80%)",
                pointerEvents: "none"
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          )}

          <div style={{ fontSize: "80px", marginBottom: "8px" }}>
            {score === 100 ? "👑" : rating.icon}
          </div>

          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "32px", color: "#ffe082", marginBottom: "6px" }}>
            🎉 {score >= 70 ? "Congratulations!" : "Challenge Complete!"}
          </h2>
          <h3 style={{ color: "#38bdf8", fontSize: "20px", marginTop: "0", marginBottom: "10px" }}>
            {rating.title} ({score}/100 Pts)
          </h3>
          <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "24px" }}>
            {score >= 70
              ? '"You have mastered the concepts of Variables."'
              : '"Score at least 70/100 to unlock Level 2 Coding Challenge. Review the concepts and try again!"'}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div className="hud-tile" style={{ padding: "16px" }}>
              <span className="hud-tile-label">Final Score</span>
              <span className="hud-tile-value" style={{ fontSize: "22px", color: "#ffe082" }}>{score} / 100</span>
            </div>
            <div className="hud-tile" style={{ padding: "16px" }}>
              <span className="hud-tile-label">Accuracy</span>
              <span className="hud-tile-value" style={{ fontSize: "22px" }}>{accuracyPct}%</span>
            </div>
            <div className="hud-tile" style={{ padding: "16px" }}>
              <span className="hud-tile-label">Correct</span>
              <span className="hud-tile-value" style={{ fontSize: "22px", color: "#10b981" }}>{correctCount}</span>
            </div>
            <div className="hud-tile" style={{ padding: "16px" }}>
              <span className="hud-tile-label">Wrong</span>
              <span className="hud-tile-value" style={{ fontSize: "22px", color: "#ef4444" }}>{wrongCount}</span>
            </div>
            <div className="hud-tile" style={{ padding: "16px" }}>
              <span className="hud-tile-label">Time Taken</span>
              <span className="hud-tile-value" style={{ fontSize: "22px" }}>{formatTime(timeSeconds)}</span>
            </div>
          </div>

          <div style={{ background: "rgba(255,224,130,0.08)", border: "1px dashed #ffe082", borderRadius: "16px", padding: "16px", marginBottom: "28px" }}>
            <h3 style={{ color: "#ffe082", fontSize: "16px", margin: "0 0 10px 0" }}>🎁 Rewards Unlocked:</h3>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", fontSize: "14px" }}>
              <span>🏅 Variables Master Badge</span>
              <span>💎 Variables Crystal</span>
              {score >= 90 && <span>⚡ +100 Bonus XP</span>}
              {score === 100 && <span>👑 Perfect Score Crown (100/100)</span>}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "14px", color: score >= 70 ? "#34d399" : "#f87171", fontWeight: "700", marginBottom: "16px" }}>
              {score >= 70
                ? "✨ Level 1 Complete! Level 2 Coding Challenge Unlocked!"
                : "🔒 Level 2 Locked (Requires 70/100 Pts)"}
            </div>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                className="nav-prev-btn"
                onClick={() => {
                  const raw = challengeData.conceptQuestions || [];
                  const shuffled = [...raw].sort(() => Math.random() - 0.5);
                  setQuestions(shuffled.map(q => ({
                    ...q,
                    shuffledOptions: q.options ? [...q.options].sort(() => Math.random() - 0.5) : []
                  })));
                  setCurrentIdx(0);
                  setScore(0);
                  setXpEarned(0);
                  setCorrectCount(0);
                  setWrongCount(0);
                  setStreak(0);
                  setTimeSeconds(0);
                  setLevelCompleted(false);
                }}
              >
                Try Level 1 Again ↺
              </button>
              {score >= 70 && (
                <button className="magical-action-btn" style={{ fontSize: "18px", padding: "16px 40px" }} onClick={() => setActiveLevel(2)}>
                  🚀 Continue to Level 2 – Coding Challenge →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* =========================================================
          LEVEL 2: CODING LAB CHALLENGE VIEW
         ========================================================= */}
      {activeLevel === 2 && !level2Completed && currentCoding && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="level1-hud-grid">
            <div className="hud-tile" style={{ position: "relative" }}>
              <span className="hud-tile-label">Jump to Coding</span>
              <select
                style={{
                  background: "#0f081c",
                  color: "#38bdf8",
                  border: "1px solid #38bdf8",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "800",
                  padding: "2px 6px",
                  cursor: "pointer",
                  textAlign: "center"
                }}
                value={codingIdx}
                onChange={(e) => setCodingIdx(Number(e.target.value))}
              >
                {(codingChallenges || []).map((c, i) => (
                  <option key={i} value={i}>
                    C{i + 1} ({c.title})
                  </option>
                ))}
              </select>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Coding Score</span>
              <span className="hud-tile-value">{codingScore} / 100 Pts</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">XP Earned</span>
              <span className="hud-tile-value">+{codingXp} ⚡</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Accuracy</span>
              <span className="hud-tile-value">{codingAccuracyPct}% 🎯</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Streak</span>
              <span className="hud-tile-value">{codingStreak} 🔥</span>
            </div>
            <div className="hud-tile">
              <span className="hud-tile-label">Time Taken</span>
              <span className="hud-tile-value">{formatTime(codingTimeSeconds)} ⏱️</span>
            </div>
          </div>

          <main className="assessment-card">
            {codingCheckpoint && (
              <motion.div className="checkpoint-modal-overlay" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: "64px", marginBottom: "12px" }}>
                  {codingCheckpoint === "c10" ? "💻" : codingCheckpoint === "c25" ? "🥇" : "🏆"}
                </div>
                <h2 style={{ fontFamily: "Cinzel, serif", color: "#ffe082", fontSize: "26px" }}>
                  {codingCheckpoint === "c10" && "10 Coding Missions Solved!"}
                  {codingCheckpoint === "c25" && "Quarter Master Programmer Badge Unlocked!"}
                  {codingCheckpoint === "c40" && "You are almost a Variables Master!"}
                </h2>
                <button className="magical-action-btn" onClick={() => setCodingCheckpoint(null)}>Continue Coding →</button>
              </motion.div>
            )}

            <div className="assessment-progress-outer">
              <div className="assessment-progress-inner" style={{ width: `${((codingIdx + 1) / (codingChallenges?.length || 1)) * 100}%` }} />
            </div>

            <div className="question-tags-row">
              <span className="tag-badge tag-scenario">💻 Category: {currentCoding?.category}</span>
              <span className="tag-badge tag-concept">🎯 Type: {currentCoding?.type}</span>
            </div>

            <h2 style={{ fontFamily: "Cinzel, serif", color: "#38bdf8", fontSize: "22px", marginBottom: "8px" }}>
              Challenge #{codingIdx + 1}: {currentCoding?.title}
            </h2>

            <div className="question-prompt-text">{currentCoding?.problemDescription}</div>

            {/* Code Editor & Console Output */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#38bdf8", marginBottom: "4px", display: "block" }}>
                  🐍 Python Code Laboratory:
                </label>
                <textarea
                  style={{
                    width: "100%",
                    height: "180px",
                    background: "#080314",
                    color: "#f8fafc",
                    fontFamily: "Fira Code, monospace",
                    fontSize: "14px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1.5px solid #38bdf8",
                    outline: "none",
                    resize: "vertical"
                  }}
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="Write your Python code here..."
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#a7f3d0", marginBottom: "4px", display: "block" }}>
                  🖥️ Console Output & Evaluation:
                </label>
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    background: "#050b14",
                    color: codeSuccess ? "#4ade80" : "#cbd5e1",
                    fontFamily: "Fira Code, monospace",
                    fontSize: "13px",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {consoleOutput || "(Run code to see execution output)"}
                </div>
              </div>
            </div>

            {codingFeedback && (
              <motion.div
                className={`feedback-banner ${codingFeedback.type === "success" ? "success" : "error"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: "16px" }}
              >
                {codingFeedback.message}
              </motion.div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
              <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                Challenge {codingIdx + 1} of {codingChallenges?.length || 50}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="nav-prev-btn"
                  style={{ padding: "10px 18px", borderRadius: "12px" }}
                  onClick={handleRunCode}
                >
                  ▶️ Run Code
                </button>

                <button
                  className="nav-prev-btn"
                  style={{ padding: "10px 18px", borderRadius: "12px", background: "rgba(239,68,68,0.2)", borderColor: "#fca5a5" }}
                  onClick={() => {
                    if (currentCoding) {
                      setUserCode(currentCoding.initialCode || "");
                      setConsoleOutput("");
                      setCodingFeedback(null);
                    }
                  }}
                >
                  ↺ Reset Code
                </button>

                <button
                  className="magical-action-btn"
                  style={{ padding: "10px 24px", fontSize: "15px" }}
                  onClick={handleSubmitCoding}
                >
                  Submit Solution ✨
                </button>

                {onOpenLeaderboard && (
                  <button
                    className="nav-prev-btn"
                    style={{ background: "rgba(52,211,153,0.2)", borderColor: "#a7f3d0" }}
                    onClick={onOpenLeaderboard}
                  >
                    🌌 Leaderboard →
                  </button>
                )}
              </div>
            </div>
          </main>
        </motion.div>
      )}

      {/* LEVEL 2 RESULTS SCREEN & GRAND WORLD MASTER COMPLETION */}
      {activeLevel === 2 && level2Completed && (
        <motion.div className="assessment-card" style={{ textAlign: "center", background: "linear-gradient(145deg, rgba(13,4,28,0.95), rgba(30,12,60,0.98))" }} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <div style={{ fontSize: "90px", marginBottom: "12px" }}>🏆</div>
          <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "36px", color: "#ffe082", marginBottom: "6px" }}>🎉 Variables World Master!</h1>
          <p style={{ color: "#cbd5e1", fontSize: "16px", marginBottom: "24px" }}>"Congratulations! You have officially mastered Variables Concepts and Coding!"</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div className="hud-tile" style={{ padding: "16px" }}><span className="hud-tile-label">Concept Completion</span><span className="hud-tile-value" style={{ fontSize: "22px", color: "#10b981" }}>100 / 100 ✅</span></div>
            <div className="hud-tile" style={{ padding: "16px" }}><span className="hud-tile-label">Coding Completion</span><span className="hud-tile-value" style={{ fontSize: "22px", color: "#38bdf8" }}>100 / 100 ✅</span></div>
            <div className="hud-tile" style={{ padding: "16px" }}><span className="hud-tile-label">Overall Score</span><span className="hud-tile-value" style={{ fontSize: "22px", color: "#f59e0b" }}>{score + codingScore} / 200 Pts</span></div>
            <div className="hud-tile" style={{ padding: "16px" }}><span className="hud-tile-label">Total XP Earned</span><span className="hud-tile-value" style={{ fontSize: "22px", color: "#a7f3d0" }}>+{xpEarned + codingXp + 200} ⚡</span></div>
          </div>

          <div style={{ background: "rgba(255,224,130,0.08)", border: "1px dashed #ffe082", borderRadius: "16px", padding: "16px", marginBottom: "28px" }}>
            <h3 style={{ color: "#ffe082", fontSize: "18px", margin: "0 0 10px 0" }}>🎁 Grand Master Rewards Unlocked:</h3>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", fontSize: "14px" }}>
              <span>📜 Variables Master Certificate</span>
              <span>💎 Golden Variables Crystal</span>
              <span>🏅 Exclusive Master Badge</span>
              <span>⚡ +200 Bonus XP</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="nav-prev-btn" onClick={() => { setCodingIdx(0); setCodingScore(0); setLevel2Completed(false); }}>
              Try Level 2 Again ↺
            </button>

            {onOpenLeaderboard && (
              <button className="magical-action-btn" style={{ fontSize: "18px", padding: "16px 36px" }} onClick={onOpenLeaderboard}>
                🌌 Constellation Leaderboard →
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
