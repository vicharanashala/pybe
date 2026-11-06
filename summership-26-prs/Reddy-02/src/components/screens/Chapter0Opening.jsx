import React from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter0Opening({ chapter, onStart, onStartQuiet }) {
  return (
    <section className="screen screen-hero" aria-labelledby="hero-heading">
      <div className="pybe-card pybe-hero-card">
        <div className="pybe-brand-pill">PyBe &bull; Discovery Lab</div>

        <h1 id="hero-heading" className="pybe-title">
          {chapter.title}
        </h1>
        
        <p className="pybe-lead">
          A short interactive story is waiting for you. Read it, think it through, and see how Python handles the unexpected.
        </p>

        <div className="pybe-features-row">
          <div className="pybe-mini-feature">
            <span className="feature-icon">🌿</span>
            <span>Beginner Friendly</span>
          </div>
          <div className="pybe-mini-feature">
            <span className="feature-icon">⏱️</span>
            <span>15 Mins</span>
          </div>
          <div className="pybe-mini-feature">
            <span className="feature-icon">🛡️</span>
            <span>try, except, else, finally</span>
          </div>
        </div>

        <div className="pybe-actions-center">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              sound.playSuccess();
              onStart(true);
            }}
          >
            Start Journey
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              sound.playClick();
              onStartQuiet(false);
            }}
          >
            Start without narration
          </button>
        </div>
      </div>
    </section>
  );
}
