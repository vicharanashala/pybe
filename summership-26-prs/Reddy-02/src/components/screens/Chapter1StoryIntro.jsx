import React from 'react';
import { sound } from '../../services/soundEngine.js';

export default function Chapter1StoryIntro({ chapter, onContinue }) {
  return (
    <section className="screen screen-story" aria-labelledby="chapter1-heading">
      <div className="pybe-story-layout">
        {/* Left Side: Visual Story Illustration Card */}
        <div className="pybe-illustration-card">
          <div className="illustration-graphic">
            <span className="big-emoji" role="img" aria-label="Festival Lamp">🪔</span>
            <div className="graphic-decorations" aria-hidden="true">
              <span className="sparkle s1">✨</span>
              <span className="sparkle s2">🌸</span>
              <span className="sparkle s3">✨</span>
            </div>
          </div>
          <div className="illustration-caption">
            <span>The Festival Registration Desk</span>
          </div>
        </div>

        {/* Right Side: Simple Beginner Story */}
        <div className="pybe-story-content">
          <h2 id="chapter1-heading" className="pybe-story-title">
            The Festival Registration Desk
          </h2>

          <div className="pybe-story-paragraphs">
            <p>
              A grand festival is underway. Thousands of visitors from all over the country are arriving to celebrate Vijayadashami.
            </p>
            <p>
              At the entrance booth, a computer program helps each visitor: asking how many days they want to attend, and checking available festival events.
            </p>
            <p>
              Everything runs smoothly—until a visitor types something completely unexpected into the system.
            </p>
          </div>

          <div className="pybe-story-cta">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                sound.playSuccess();
                onContinue();
              }}
            >
              I understood the story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
