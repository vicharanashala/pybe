import React, { useState } from "react";
import { motion } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./CaseStudy.css";

export default function CaseStudy({ data, onNext, onAddXp, onUpdateMemory }) {
  const { title, subtitle, databaseName, slots: initialSlots, capsules } = data;
  const [slots, setSlots] = useState(initialSlots);
  const [selectedCapsule, setSelectedCapsule] = useState(null);

  const handleSelectCapsule = (cap) => {
    setSelectedCapsule(cap);
  };

  const handleAssignToSlot = (slotIdx) => {
    if (!selectedCapsule) return;

    const targetSlot = slots[slotIdx];
    if (selectedCapsule === targetSlot.targetValue) {
      // Correct binding!
      const updated = [...slots];
      updated[slotIdx].currentValue = selectedCapsule;
      setSlots(updated);
      setSelectedCapsule(null);

      // Sync memory
      const activeLines = updated
        .filter((s) => s.currentValue !== null)
        .map((s) => `${s.varName} = ${s.currentValue}`);
      const { memoryMap } = parsePythonCodeToMemory(activeLines.join("\n"));
      if (onUpdateMemory) {
        onUpdateMemory(memoryMap, `Restored box '${targetSlot.varName}' in Poko's Memory!`);
      }

      if (onAddXp) onAddXp(25);
    } else {
      alert(`⚠️ Misaligned binding! ${selectedCapsule} does not match ${targetSlot.varName}. Try matching data items.`);
    }
  };

  const resolvedCount = slots.filter((s) => s.currentValue !== null).length;
  const healthPercent = Math.round((resolvedCount / slots.length) * 100);
  const isFullyRestored = resolvedCount === slots.length;

  return (
    <div className="step-container">
      <motion.div
        className="paper-scroll-panel case-study-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="case-badge">🏥 REAL-WORLD CASE STUDY</div>

        <h2 className="case-title">{title}</h2>
        <p className="case-subtitle">{subtitle}</p>

        {/* Database Diagnostic Header */}
        <div className="db-diagnostic-panel">
          <div className="db-info">
            <span className="db-icon">🗄️</span>
            <span className="db-name">{databaseName}</span>
          </div>

          <div className="system-health-meter">
            <span className="meter-label">SYSTEM RECOVERY: {healthPercent}%</span>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${healthPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Database Schema Slots */}
        <div className="slots-grid">
          {slots.map((slot, idx) => {
            const isFilled = slot.currentValue !== null;
            return (
              <div key={idx} className={`schema-slot ${isFilled ? "slot-restored" : ""}`}>
                <div className="slot-header">
                  <span className="var-icon">🏷️</span>
                  <code>{slot.varName}</code>
                </div>

                <div className="slot-body" onClick={() => !isFilled && handleAssignToSlot(idx)}>
                  {isFilled ? (
                    <motion.div
                      className="filled-value-badge"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      = {slot.currentValue} ✓
                    </motion.div>
                  ) : (
                    <span className="slot-action-hint">
                      {selectedCapsule ? `Click to assign [${selectedCapsule}]` : "[ Empty Variable Container ]"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unbound Capsules Pool */}
        <div className="capsules-pool-container">
          <h4>Unbound Memory Capsules (Click a capsule to select, then click a slot above):</h4>
          <div className="capsules-grid">
            {capsules.map((cap, idx) => {
              const isUsed = slots.some((s) => s.currentValue === cap);
              const isSel = selectedCapsule === cap;

              return (
                <button
                  key={idx}
                  className={`capsule-btn ${isSel ? "capsule-selected" : ""} ${isUsed ? "capsule-used" : ""}`}
                  disabled={isUsed}
                  onClick={() => handleSelectCapsule(cap)}
                >
                  🔮 {cap}
                </button>
              );
            })}
          </div>
        </div>

        {isFullyRestored && (
          <motion.div
            className="case-success-banner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3>🎉 POKO'S INVENTORY FULLY RESTORED!</h3>
            <p>All lost labels have been matched! Check Poko's Memory Storage on the right to see the restored memory boxes.</p>
          </motion.div>
        )}

        <div className="case-footer">
          <button
            className="btn btn-primary button-glow"
            disabled={!isFullyRestored}
            onClick={onNext}
          >
            Proceed to Coding Playground →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
