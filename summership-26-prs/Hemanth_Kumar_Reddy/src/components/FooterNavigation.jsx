import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function FooterNavigation({ currentSlide, totalSlides, onGoToSlide }) {
  const percentage = Math.round(((currentSlide + 1) / totalSlides) * 100);
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === totalSlides - 1;

  const handlePrev = () => {
    if (!isFirst) {
      soundEngine.playPageTurn();
      onGoToSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    soundEngine.playPageTurn();
    if (isLast) {
      onGoToSlide(0);
    } else {
      onGoToSlide(currentSlide + 1);
    }
  };

  return (
    <footer>
      <div className="progress-header">
        <span>⭐ Chapter 1: Treasure Kingdom • Page {currentSlide + 1} of {totalSlides}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Award size={16} color="var(--duo-gold)" /> Iterator Master Path
        </span>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>

      <div className="nav-controls">
        <button
          className="action-btn"
          disabled={isFirst}
          onClick={handlePrev}
        >
          <ArrowLeft size={18} /> Prev
        </button>

        <div className="step-dots">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              title={`Page ${i + 1}`}
              onClick={() => {
                if (!isFirst || i > 0) {
                  soundEngine.playPageTurn();
                  onGoToSlide(i);
                }
              }}
            />
          ))}
        </div>

        <button
          className={`action-btn ${isLast ? 'btn-gold' : ''}`}
          onClick={handleNext}
        >
          {isLast ? (
            <>
              🏆 Restart Journey <RotateCcw size={18} />
            </>
          ) : (
            <>
              Next <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
