import React from 'react';
import { X, MapPin } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const SLIDE_TITLES = [
  "1. Kingdom Entrance",
  "2. Treasure Warehouse & Carry",
  "3. Reveal Iterable",
  "4. Who Opens Treasure?",
  "5. Iterator Reveal & Stop Flag",
  "6. Thirsty Hero Dilemma",
  "7. Generator Reveal",
  "8. Memory Meter Comparison",
  "9. Movie Pause (Yield)",
  "10. Super Comparison",
  "11. Boss Level Match Game",
  "12. Concept Memory Card",
  "13. Victory & Code Sandbox"
];

export default function AdventureMapModal({ isOpen, onClose, onSelectSlide }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--duo-gold)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="var(--duo-gold)" /> Kingdom Adventure Map
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} /> Close
          </button>
        </div>

        <div className="toc-grid">
          {SLIDE_TITLES.map((title, idx) => (
            <div
              key={idx}
              className="toc-item"
              onClick={() => {
                soundEngine.playPageTurn();
                onSelectSlide(idx);
                onClose();
              }}
            >
              {title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
