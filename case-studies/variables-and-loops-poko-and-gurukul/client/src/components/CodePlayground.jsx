import {createStoryPythonHook} from '../../../../../shared/story-python.mjs';
const useStoryPython=createStoryPythonHook(React);
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./CodePlayground.css";

export default function CodePlayground({ data, onNext, onUpdateMemory }) {
  const {run,running:isRunning}=useStoryPython();
  const { title, subtitle, defaultCode, hints } = data;
  const [code, setCode] = useState(
    defaultCode || `# Help Poko store his food in Python variables!\napple = "Red Apple"\nhoney = "Wild Honey"\ncorn = "Yellow Corn"\n\nprint("Poko's Apple:", apple)\nprint("Poko's Honey:", honey)\nprint("Poko's Corn:", corn)`
  );
  const [output, setOutput] = useState("");
  const [activeHintIdx, setActiveHintIdx] = useState(null);

  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Sync memory on code edit in real-time
  useEffect(() => {
    const { memoryMap, errors } = parsePythonCodeToMemory(code);
    if (onUpdateMemory) {
      onUpdateMemory(memoryMap, "Live code memory updated!", errors);
    }
  }, [code]);

  const handleRun=async()=>{setOutput("Running Poko's Python program…");const result=await run(code);setOutput(result.error||result.output||'(Program finished without printed output)');if(onUpdateMemory){const {memoryMap,errors}=parsePythonCodeToMemory(code);onUpdateMemory(memoryMap,'Python execution complete.',errors);}};

  const handleReset = () => {
    setCode(defaultCode || "");
    setOutput("");
    setActiveHintIdx(null);
  };

  const handleInsertSnippet = (snippet) => {
    setCode((prev) => prev + "\n" + snippet);
  };

  return (
    <div className="step-container">
      <div className="playground-wrapper">
        {/* 🎯 Forest Mission Banner */}
        <div className="forest-mission-card">
          <span className="mission-badge-tag">🎯 Forest Mission</span>
          <span className="mission-title-text">Store Winter Food in Poko's Forest Notebook</span>
        </div>

        <motion.div
          className="wooden-frame-card playground-notebook-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="notebook-header-row">
            <span className="handwritten-badge">📖 Poko's Forest Notebook</span>
            <span className="notebook-file-tag">poko_magic_craft.py</span>
          </div>

          <h2 className="notebook-title-heading">{title}</h2>
          <p className="notebook-subtitle-text">{subtitle}</p>

          {/* Action Toolbar */}
          <div className="pg-toolbar">
            <div className="left-controls">
              <button className="btn btn-primary run-btn button-glow" onClick={handleRun} disabled={isRunning}>
                ▶ Test My Magic
              </button>
              <button className="btn btn-secondary reset-btn" onClick={handleReset}>
                🔄 Start Again
              </button>
            </div>

            <div className="right-snippets">
              <button className="snippet-chip" onClick={() => handleInsertSnippet('berries = "Sweet Berries"')}>
                + String 🍓
              </button>
              <button className="snippet-chip" onClick={() => handleInsertSnippet("coins = 20")}>
                + Integer 🪵
              </button>
              <button className="snippet-chip" onClick={() => handleInsertSnippet("winter = True")}>
                + Boolean 🚪
              </button>
              <button className="snippet-chip" onClick={() => handleInsertSnippet('fruit == "Apple"')}>
                + Error (==)
              </button>
            </div>
          </div>

          {/* Code Editor & Console Output Split Layout */}
          <div className="editor-console-split">
            {/* Lined Notebook Paper Code Editor */}
            <div className="editor-panel notebook-paper-box">
              <div className="panel-header">
                <span className="panel-title">📜 poko_storage.py</span>
              </div>
              <textarea
                className="code-input-textarea"
                aria-label="Poko playground Python program" disabled={isRunning} value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>

            {/* ✨ Forest Magic Output Console */}
            <div className="console-panel magic-moss-console">
              <div className="panel-header">
                <span className="panel-title">✨ Forest Magic Output</span>
              </div>
              <pre className="terminal-output">
                <code>{output || "Press '▶ Test My Magic' to see the forest output!"}</code>
              </pre>
            </div>
          </div>

          {/* Hints Bar */}
          {hints && hints.length > 0 && (
            <div className="hints-bar">
              <span className="hints-label">💡 Forest Whispers:</span>
              {hints.map((h, idx) => (
                <button
                  key={idx}
                  className={`hint-pill ${activeHintIdx === idx ? "hint-pill-active" : ""}`}
                  onClick={() => setActiveHintIdx(idx === activeHintIdx ? null : idx)}
                >
                  Tip {idx + 1}
                </button>
              ))}
            </div>
          )}

          {activeHintIdx !== null && (
            <div className="active-hint-callout">
              <p>💡 {hints[activeHintIdx]}</p>
            </div>
          )}

          <div className="pg-footer">
            <button className="btn btn-primary button-glow" onClick={onNext}>
              Proceed to Final Mission →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
