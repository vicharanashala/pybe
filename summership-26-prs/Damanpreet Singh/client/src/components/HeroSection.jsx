import React from 'react';

function HeroSection({ analytics }) {
  return (
    <header className="hero-banner-container">
      <div className="hero-banner-overlay">
        <div className="hero-banner-content">
          <span className="hero-badge">AI-NATIVE LEARNING JOURNEY</span>
          <h1 className="hero-title">
            Learn Python by reasoning through real situations first.
          </h1>
        </div>

        <div className="hero-stats-panel">
          <div className="hero-stat-card">
            <span className="stat-number">{analytics?.scenarioCount || 14}</span>
            <span className="stat-label">Scenarios</span>
          </div>
          <div className="hero-stat-card">
            <span className="stat-number">{analytics?.sessionCount || 4}</span>
            <span className="stat-label">Sessions</span>
          </div>
          <div className="hero-stat-card">
            <span className="stat-number">{analytics?.averagePromptScore || 7.25}</span>
            <span className="stat-label">Prompt Talent</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeroSection;
