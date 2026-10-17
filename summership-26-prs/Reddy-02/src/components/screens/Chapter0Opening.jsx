import React from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter0Opening({ chapter, onStart, onStartQuiet }) {
  return (
    <section className="screen screen-hero" aria-labelledby="hero-heading">
      <div className="hero-decorations" aria-hidden="true">
        <div className="glow-orb orb-primary"></div>
        <div className="glow-orb orb-saffron"></div>
        <div className="glow-orb orb-gold"></div>
        <div className="floating-sparks">
          <span className="spark s1">✦</span>
          <span className="spark s2">✧</span>
          <span className="spark s3">✦</span>
          <span className="spark s4">✧</span>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-diya-container">
          <div className="diya-glow"></div>
          <div className="diya-flame"></div>
          <div className="diya-base">🪔</div>
        </div>

        <div className="badge-tag">Interactive Python Learning Lab &bull; Vicharanashala IIT Ropar</div>

        <h1 id="hero-heading" className="hero-title">
          {chapter.title}
        </h1>
        <p className="hero-subtitle">
          {chapter.subtitle}
        </p>

        <div className="hero-description-card">
          <p>
            Dasara — celebrated as Vijayadashami across India — honors the victory of courage, wisdom, and resilience.
            In this interactive laboratory, explore real-world festival software scenarios and discover how Python
            gracefully handles the unexpected through <strong>try</strong>, <strong>except</strong>, <strong>else</strong>, and <strong>finally</strong>.
          </p>
          <div className="hero-meta-strip">
            <span className="meta-item">🎯 <strong>Topic:</strong> Exception Handling (ValueError &amp; KeyError)</span>
            <span className="meta-item">⏱️ <strong>Duration:</strong> ~25–30 mins</span>
            <span className="meta-item">🌿 <strong>Level:</strong> Python Beginner</span>
          </div>
        </div>

        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              sound.playSuccess();
              onStart(true);
            }}
          >
            <span>{chapter.cta}</span>
            <span className="btn-icon-right" aria-hidden="true">🎙️ &rarr;</span>
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => {
              sound.playClick();
              onStartQuiet(false);
            }}
          >
            <span>{chapter.ctaAlt}</span>
            <span className="btn-icon-right" aria-hidden="true">🔇 &rarr;</span>
          </button>
        </div>

        <div className="cultural-disclaimer">
          <span className="disclaimer-icon">🕊️</span>
          <span>
            Presents Durga–Mahishasura and Rama–Ravana traditions respectfully alongside cultural observances including Bommai Kolu, Ayudha Puja, and Mysuru Dasara.
          </span>
        </div>
      </div>
    </section>
  );
}
