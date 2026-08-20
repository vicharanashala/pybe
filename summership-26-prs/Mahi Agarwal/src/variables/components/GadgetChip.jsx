import React from 'react';

// A single gadget rendered as a rounded chip. Supports being dragged (HTML5
// drag & drop) and/or clicked (so touch users can tap-to-select then
// tap-a-pocket, mirroring how the chip is used across Scenes 2, 4 and 10).
export default function GadgetChip({ emoji, label, selected, draggable = false, onDragStart, onClick, staticChip = false }) {
  return (
    <div
      className={`dm-gadget-chip ${selected ? 'selected' : ''} ${staticChip ? 'static' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="dm-gadget-chip-emoji">{emoji}</span>
      {label && <span>{label}</span>}
    </div>
  );
}
