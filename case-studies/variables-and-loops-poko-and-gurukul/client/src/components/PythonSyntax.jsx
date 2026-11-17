import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./PythonSyntax.css";

/**
 * 📖 POKO'S FOREST NOTEBOOK (PYTHON SYNTAX)
 * Handcrafted lined paper notebook inside a wooden frame
 */
export default function PythonSyntax({ data, onNext, onUpdateMemory, onHighlightTarget }) {
  const { title, subtitle, breakdown, fullCodeExample } = data;

  // Build interactive lines fallback if data.lines is not present
  const lines = data.lines || [
    {
      code: 'home = "Honey Cave"',
      tokens: [
        { text: "home ", type: "name", desc: "Special Name Tag on the LEFT (Variable Name)." },
        { text: "= ", type: "operator", desc: "Magical Assignment Connector (=) in the MIDDLE." },
        { text: '"Honey Cave"', type: "value_str", desc: "Stored Detail on the RIGHT (Text String) wrapped in quotes." }
      ]
    },
    {
      code: 'water = 2.5',
      tokens: [
        { text: "water ", type: "name", desc: "Special Name Tag for Poko's water supply." },
        { text: "= ", type: "operator", desc: "Equal sign (=) connecting 2.5 Liters into water record." },
        { text: "2.5", type: "value_str", desc: "Stored Detail (Float measurement number)." }
      ]
    },
    {
      code: 'coins = 250',
      tokens: [
        { text: "coins ", type: "name", desc: "Special Name Tag for Poko's forest coins." },
        { text: "= ", type: "operator", desc: "Equal sign (=) storing 250 into coins record." },
        { text: "250", type: "value_str", desc: "Stored Detail (Integer whole count number)." }
      ]
    }
  ];

  const [activeToken, setActiveToken] = useState(null);

  // Initialize demo memory
  useEffect(() => {
    const fullCode = fullCodeExample || lines.map((l) => l.code).join("\n");
    const { memoryMap } = parsePythonCodeToMemory(fullCode);
    if (onUpdateMemory) {
      onUpdateMemory(memoryMap, "Poko's Notebook: Python syntax loaded!");
    }
  }, [fullCodeExample, lines]);

  const handleSelectToken = (lineIdx, tokIdx, token) => {
    setActiveToken({ line: lineIdx, tok: tokIdx, ...token });

    if (onHighlightTarget) {
      if (token.type === "name") {
        onHighlightTarget("label");
      } else if (token.type === "operator") {
        onHighlightTarget("operator");
      } else if (token.type === "value_str" || token.type === "value") {
        onHighlightTarget("value");
      } else {
        onHighlightTarget(null);
      }
    }
  };

  return (
    <div className="step-container">
      <div className="syntax-notebook-wrapper">
        {/* 🎯 Forest Mission Banner */}
        <div className="forest-mission-card">
          <span className="mission-badge-tag">🎯 Forest Mission</span>
          <span className="mission-title-text">Inspect Poko's Handwritten Python Notes</span>
        </div>

        {/* Wooden Frame Outer Card */}
        <motion.div
          className="wooden-frame-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Lined Notebook Paper Inner */}
          <div className="notebook-lined-paper">
            {/* Spiral Copper Binder Rings */}
            <div className="copper-spiral-rings">
              <span className="ring"></span>
              <span className="ring"></span>
              <span className="ring"></span>
              <span className="ring"></span>
              <span className="ring"></span>
            </div>

            <div className="notebook-header-row">
              <span className="handwritten-badge">📖 Poko's Forest Notebook</span>
              <span className="notebook-file-tag">poko_storage_notes.py</span>
            </div>

            <h2 className="notebook-title-heading">{title}</h2>
            <p className="notebook-subtitle-text">{subtitle}</p>

            {/* Interactive Code Lines on Lined Paper */}
            <div className="lined-code-board">
              {lines.map((lineObj, lineIdx) => (
                <div key={lineIdx} className="lined-code-row">
                  <span className="margin-line-num">{lineIdx + 1}.</span>
                  <div className="interactive-tokens-group">
                    {lineObj.tokens.map((token, tokIdx) => {
                      const isSel = activeToken?.line === lineIdx && activeToken?.tok === tokIdx;
                      return (
                        <span
                          key={tokIdx}
                          className={`notebook-code-token tok-${token.type} ${
                            isSel ? "token-glowing-active" : ""
                          }`}
                          onClick={() => handleSelectToken(lineIdx, tokIdx, token)}
                        >
                          {token.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Token Inspector Callout Scroll */}
            {activeToken ? (
              <motion.div
                className="paper-scroll-panel token-inspector-scroll"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inspector-tag">
                  TOKEN: <code>{activeToken.text.trim()}</code>
                </div>
                <p className="inspector-desc">{activeToken.desc}</p>
                <p className="inspector-hint">
                  👉 Notice how this code token maps to Poko's wooden storage box!
                </p>
              </motion.div>
            ) : (
              <div className="inspector-placeholder-box">
                👈 Tap any code token above inside Poko's Notebook to inspect how Python processes it!
              </div>
            )}

            <div className="notebook-footer">
              <button
                className="btn btn-primary button-glow"
                onClick={() => {
                  if (onHighlightTarget) onHighlightTarget(null);
                  onNext();
                }}
              >
                Proceed to Guided Practice →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
