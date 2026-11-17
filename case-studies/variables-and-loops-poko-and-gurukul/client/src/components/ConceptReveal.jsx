import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./ConceptReveal.css";

const POKO_RECORDS = [
  { id: "r1", name: "home", symbol: "=", detail: '"Honey Cave" 🛖', title: "🛖 Home Location", icon: "🛖" },
  { id: "r2", name: "water", symbol: "=", detail: "2.5 Liters 💧", title: "💧 Water Supply", icon: "💧" },
  { id: "r3", name: "coins", symbol: "=", detail: "250 coins 🪙", title: "🪙 Treasure Chest", icon: "🪙" },
  { id: "r4", name: "healthy", symbol: "=", detail: "True ✅", title: "✅ Health Status", icon: "✅" }
];

const DISCOVERY_MEDALLIONS = [
  {
    id: 0,
    tag: "🏷️ LEFT SIDE",
    title: "1. Special Name Plaque",
    icon: "🏷️",
    desc: "The special name always sits on the LEFT of the equal sign (=). It's the wooden label plaque Poko uses to look up or update information.",
    tip: "Example: `home`, `water`, `coins`, `healthy` always go on the left!"
  },
  {
    id: 1,
    tag: "🪄 CENTER",
    title: "2. Magical Equal Seal (=)",
    icon: "🪄",
    desc: "The equal sign (=) is Poko's magical assignment seal in the CENTER! It takes the detail from the right and binds it into the name on the left.",
    tip: "It acts like a one-way magic bridge storing values from Right ➔ Left!"
  },
  {
    id: 2,
    tag: "📦 RIGHT SIDE",
    title: "3. Stored Detail Capsule",
    icon: "📦",
    desc: "The stored detail item sits on the RIGHT side of the equal sign (=). This is the actual value being saved in Poko's memory.",
    tip: "Example: `\"Honey Cave\"`, `2.5`, `250`, `True` always go on the right!"
  }
];

export default function ConceptReveal({ data, onNext, onUpdateMemory, onHighlightTarget }) {
  const { title, subtitle } = data;
  const [activeRecord, setActiveRecord] = useState(POKO_RECORDS[0]);
  const [activeMedallion, setActiveMedallion] = useState(1);
  const [isBinding, setIsBinding] = useState(false);

  useEffect(() => {
    const code = `${activeRecord.name} = ${activeRecord.detail.includes('"') ? activeRecord.detail : `"${activeRecord.detail}"`}`;
    const { memoryMap } = parsePythonCodeToMemory(code);
    if (onUpdateMemory) {
      onUpdateMemory(memoryMap, `⚡ Workbench Bound: ${activeRecord.name} = ${activeRecord.detail}`);
    }
  }, [activeRecord]);

  const handleBindClick = () => {
    setIsBinding(true);
    setTimeout(() => setIsBinding(false), 1200);
  };

  const handleSelectMedallion = (idx) => {
    setActiveMedallion(idx);
    if (onHighlightTarget) {
      if (idx === 0) onHighlightTarget("label");
      else if (idx === 1) onHighlightTarget("operator");
      else if (idx === 2) onHighlightTarget("value");
    }
  };

  const med = DISCOVERY_MEDALLIONS[activeMedallion];

  return (
    <div className="step-container">
      <div className="rule-book-wrapper">
        {/* 🎯 Forest Mission Banner */}
        <div className="forest-mission-card">
          <span className="mission-badge-tag">🎯 Forest Workbench</span>
          <span className="mission-title-text">Poko's Memory Binding Workbench</span>
        </div>

        <motion.div
          className="forest-rule-book workbench-container"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Workbench Title Header */}
          <div className="rule-book-spine workbench-spine">
            <span className="book-icon">🛠️</span>
            <div className="book-heading-text">
              <h2>{title || "🛠️ Poko's Memory Binding Workbench"}</h2>
              <p>{subtitle || "Test how Poko binds special names to details using the magical equal seal (=)"}</p>
            </div>
          </div>

          {/* Interactive Pixar Workbench Stage */}
          <div className="parchment-page-content workbench-parchment">
            <div className="workbench-stage">
              {/* Left Pedestal: Name Plaque */}
              <motion.div
                className={`pedestal-card ${activeMedallion === 0 ? "pedestal-glow" : ""}`}
                onClick={() => handleSelectMedallion(0)}
                whileHover={{ scale: 1.04 }}
              >
                <span className="pedestal-tag">🏷️ LEFT SIDE</span>
                <div className="pedestal-content">
                  <span className="var-plaque">{activeRecord.name}</span>
                </div>
                <span className="pedestal-sub">Name Plaque</span>
              </motion.div>

              {/* Center Altar: Magical Equal Seal (=) */}
              <div className="connector-beam-zone">
                {isBinding && (
                  <motion.div
                    className="laser-magic-beam"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <motion.div
                  className={`pedestal-card seal-altar ${activeMedallion === 1 ? "pedestal-glow" : ""}`}
                  onClick={() => {
                    handleSelectMedallion(1);
                    handleBindClick();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="pedestal-tag">🪄 EQUAL SEAL</span>
                  <div className="equal-orb">
                    <span className="orb-sparkle">✨</span>
                    <span className="orb-equal">=</span>
                    <span className="orb-sparkle">✨</span>
                  </div>
                  <span className="pedestal-sub">Click to Bind</span>
                </motion.div>
              </div>

              {/* Right Pedestal: Stored Detail */}
              <motion.div
                className={`pedestal-card ${activeMedallion === 2 ? "pedestal-glow" : ""}`}
                onClick={() => handleSelectMedallion(2)}
                whileHover={{ scale: 1.04 }}
              >
                <span className="pedestal-tag">📦 RIGHT SIDE</span>
                <div className="pedestal-content">
                  <span className="val-capsule">{activeRecord.detail}</span>
                </div>
                <span className="pedestal-sub">Stored Detail</span>
              </motion.div>
            </div>

            {/* Live Statement Display Pill */}
            <div className="workbench-statement-banner">
              <span className="banner-icon">📜 Result:</span>
              <code className="code-statement">
                {activeRecord.name} = {activeRecord.detail}
              </code>
              <button className="btn-bind-action" onClick={handleBindClick}>
                ⚡ Bind Into Memory
              </button>
            </div>

            {/* Select Record to Load onto Workbench */}
            <div className="workbench-records-picker">
              <span className="picker-title">Pick a Record to Test:</span>
              <div className="picker-buttons">
                {POKO_RECORDS.map((rec) => (
                  <button
                    key={rec.id}
                    className={`rec-btn ${activeRecord.id === rec.id ? "rec-active" : ""}`}
                    onClick={() => setActiveRecord(rec)}
                  >
                    {rec.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Medallions for Exploring Formula Parts */}
            <div className="medallions-row">
              {DISCOVERY_MEDALLIONS.map((m, idx) => (
                <button
                  key={m.id}
                  className={`medallion-card ${activeMedallion === idx ? "medallion-active" : ""}`}
                  onClick={() => handleSelectMedallion(idx)}
                >
                  <span className="med-icon">{m.icon}</span>
                  <span className="med-title">{m.title}</span>
                </button>
              ))}
            </div>

            {/* Active Medallion Explanation Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMedallion}
                className="medallion-info-box"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="info-header">
                  <span className="info-tag">{med.tag}</span>
                  <h4>{med.title}</h4>
                </div>
                <p className="info-desc">{med.desc}</p>
                <div className="info-tip">💡 <strong>Pro Tip:</strong> {med.tip}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Workbench Footer Action */}
          <div className="rule-book-footer single-footer">
            <button className="btn btn-primary button-glow full-next-btn" onClick={onNext}>
              Proceed to Python Connection →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
