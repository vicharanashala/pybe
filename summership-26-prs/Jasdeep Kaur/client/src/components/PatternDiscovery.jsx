import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { parsePythonCodeToMemory } from "../utils/pythonInterpreter";
import "./PatternDiscovery.css";

export default function PatternDiscovery({ data, onNext, onAddXp, onUpdateMemory }) {
  const { title, subtitle, description, connections, leftHeader, rightHeader, missionTitle, successTitle, successText } = data;
  const [activeConnections, setActiveConnections] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [shakeId, setShakeId] = useState(null);

  // Shuffle right side values so items are NOT aligned directly across from left labels
  const shuffledValues = useMemo(() => {
    const orderMap = [2, 0, 4, 1, 3];
    return orderMap.map((idx) => connections[idx % connections.length]);
  }, [connections]);

  const handleKeyClick = (item) => {
    setSelectedKey(item);
    setShakeId(null);
  };

  const handleValueClick = (valItem) => {
    if (!selectedKey) return;

    if (selectedKey.id === valItem.id) {
      if (!activeConnections.includes(valItem.id)) {
        const nextConn = [...activeConnections, valItem.id];
        setActiveConnections(nextConn);
        setSelectedKey(null);
        setShakeId(null);

        // Update live memory panel
        const codeLines = nextConn.map((id) => {
          const conn = connections.find((c) => c.id === id);
          const varName = conn.name.toLowerCase().replace(" box", "");
          return `${varName} = ${conn.value.includes('"') ? conn.value : `"${conn.value}"`}`;
        });
        const { memoryMap } = parsePythonCodeToMemory(codeLines.join("\n"));
        if (onUpdateMemory) {
          onUpdateMemory(memoryMap, `Linked '${valItem.name}' in Poko's Memory!`);
        }

        if (onAddXp) onAddXp(20);
      }
    } else {
      // Incorrect match attempt: shake item
      setShakeId(valItem.id);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  const isCompleted = activeConnections.length === connections.length;

  return (
    <div className="step-container">
      <div className="pattern-discovery-wrapper">
        {/* 🎯 Forest Mission Banner */}
        <div className="forest-mission-card">
          <span className="mission-badge-tag">🎯 Forest Mission</span>
          <span className="mission-title-text">{missionTitle || "Match Poko's Special Name Tags to Stored Information"}</span>
        </div>

        <motion.div
          className="wooden-frame-card pattern-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pattern-badge">💡 DISCOVER THE PATTERN</div>

          <h2 className="pattern-title">{title}</h2>
          <p className="pattern-subtitle">{subtitle}</p>
          <p className="pattern-desc">{description}</p>

          {/* Interactive Pattern Grid */}
          <div className="pattern-grid-container">
            {/* Left Column: Container Label Names */}
            <div className="pattern-column keys-column">
              <h3>{leftHeader || "🏷️ Special Name Tag"}</h3>
              {connections.map((item) => {
                const isConnected = activeConnections.includes(item.id);
                const isSel = selectedKey?.id === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className={`pattern-node key-node ${isConnected ? "connected" : ""} ${isSel ? "selected" : ""}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleKeyClick(item)}
                  >
                    <span className="node-icon">🏷️</span>
                    <span className="node-text">{item.name}</span>
                    {isConnected && <span className="conn-status">✓ Linked</span>}
                  </motion.div>
                );
              })}
            </div>

            {/* Center Connector Lines */}
            <div className="connector-lines-column">
              {connections.map((item) => {
                const isConn = activeConnections.includes(item.id);
                return (
                  <div key={item.id} className={`connector-beam ${isConn ? "active-beam" : ""}`}>
                    {isConn && (
                      <motion.div
                        className="pulse-energy-dot"
                        animate={{ x: [0, 60, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Shuffled Food Values */}
            <div className="pattern-column values-column">
              <h3>{rightHeader || "📦 Stored Information"}</h3>
              {shuffledValues.map((item) => {
                const isConnected = activeConnections.includes(item.id);
                const isShaking = shakeId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className={`pattern-node val-node ${isConnected ? "connected" : ""} ${isShaking ? "shake-anim" : ""}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleValueClick(item)}
                  >
                    <span className="node-icon">📦</span>
                    <span className="node-text">{item.value}</span>
                    {isConnected && <span className="conn-status">✓ Linked</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Discovery Insight */}
          {isCompleted && (
            <motion.div
              className="discovery-success-box"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3>{successTitle || "🎉 Amazing Discovery!"}</h3>
              <p>{successText || "You connected every Special Name tag to its matching Information for Poko!"}</p>
            </motion.div>
          )}

          <div className="pattern-footer">
            <button
              className="btn btn-primary button-glow"
              disabled={!isCompleted}
              onClick={onNext}
            >
              Proceed to Next Mission →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
