import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./Challenge.css";

export default function Challenge({ data, onNext, onAddXp, onUpdateMemory }) {
  const { title, subtitle, missionText, starterCode, requiredVars } = data;
  const [userCode, setUserCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [passedChecks, setPassedChecks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Sync Live Memory View in real-time as learner types code
  useEffect(() => {
    const { memoryMap, errors } = parsePythonCodeToMemory(userCode);
    if (onUpdateMemory) {
      onUpdateMemory(memoryMap, "Final Mission: Live Python Memory Updated!", errors);
    }
  }, [userCode]);

  const handleTestMission = () => {
    const lines = userCode.split("\n");
    const detectedVars = new Set();
    const outputLines = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.includes("=") && !trimmed.includes("==")) {
        const [vName] = trimmed.split("=").map((s) => s.trim());
        if (vName && !/^\d/.test(vName)) detectedVars.add(vName);
      }
      if (trimmed.startsWith("print(")) {
        const content = trimmed.slice(6, -1).replaceAll('"', "").replaceAll("'", "");
        outputLines.push(content);
      }
    });

    const passed = (requiredVars || ["apple", "honey", "corn", "carrot", "berries", "nuts"]).filter((v) =>
      detectedVars.has(v)
    );

    setPassedChecks(passed);
    setOutput(outputLines.join("\n") || "(Poko's magic executed smoothly with no print output)");

    const { memoryMap, errors } = parsePythonCodeToMemory(userCode);
    if (onUpdateMemory) {
      onUpdateMemory(memoryMap, "✨ Mission Execution Verified! All 6 wooden storage boxes active.", errors);
    }

    if (passed.length === (requiredVars || []).length) {
      setIsCompleted(true);
      if (onAddXp) onAddXp(50);
    } else {
      setIsCompleted(false);
    }
  };

  return (
    <div className="step-container">
      <div className="challenge-wrapper">
        {/* 🎯 Forest Mission Banner */}
        <div className="forest-mission-card">
          <span className="mission-badge-tag">🎯 Forest Mission</span>
          <span className="mission-title-text">Complete Poko's Final Winter Food Storage Code</span>
        </div>

        <motion.div
          className="wooden-frame-card challenge-notebook-card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="notebook-header-row">
            <span className="handwritten-badge">📖 Poko's Forest Notebook</span>
            <span className="notebook-file-tag">final_winter_mission.py</span>
          </div>

          <h2 className="notebook-title-heading">{title}</h2>
          <p className="notebook-subtitle-text">{subtitle}</p>

          {/* Mission Directives Scroll */}
          <div className="paper-scroll-panel mission-directives-scroll">
            <h4>📜 Cadet Forest Directives:</h4>
            <pre>{missionText}</pre>
          </div>

          {/* Live Code Editor inside Poko's Notebook */}
          <div className="ch-editor-container notebook-paper-box">
            <div className="panel-header">
              <span className="panel-title">📜 poko_winter_mission.py</span>
            </div>
            <textarea
              className="code-input-textarea ch-textarea"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck="false"
            />
          </div>

          {/* Validation Checkmarks */}
          <div className="validation-checks-grid">
            {(requiredVars || ["apple", "honey", "corn", "carrot", "berries", "nuts"]).map((v, idx) => {
              const hasPassed = passedChecks.includes(v);
              return (
                <div key={idx} className={`check-pill ${hasPassed ? "check-passed" : ""}`}>
                  <span>{hasPassed ? "✓" : "○"}</span>
                  <code>📦 {v} box stored</code>
                </div>
              );
            })}
          </div>

          <div className="ch-action-row">
            <button className="btn btn-primary run-mission-btn button-glow" onClick={handleTestMission}>
              ▶ Test My Magic & Verify Mission
            </button>
          </div>

          {/* ✨ Forest Magic Output Console */}
          <div className="console-panel magic-moss-console">
            <div className="panel-header">
              <span className="panel-title">✨ Forest Magic Output</span>
            </div>
            <pre className="terminal-output">
              <code>{output || "Press '▶ Test My Magic' to execute your final winter code!"}</code>
            </pre>
          </div>

          {isCompleted && (
            <motion.div
              className="mission-success-banner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3>🏆 MISSION ACCOMPLISHED!</h3>
              <p>You independently created all 6 winter food storage variables for Poko! Check Poko's Storage Hut on the right to see all wooden boxes illuminated!</p>
            </motion.div>
          )}

          <div className="ch-footer">
            <button
              className="btn btn-primary button-glow"
              disabled={!isCompleted}
              onClick={onNext}
            >
              Claim Mission Rewards →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
