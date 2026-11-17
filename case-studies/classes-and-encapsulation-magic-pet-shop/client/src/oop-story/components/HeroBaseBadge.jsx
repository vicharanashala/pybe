import React from 'react';
import '../styles/heroAcademy.css';

export default function HeroBaseBadge({
  visible = true,
  streamActive = true,
  highlightFeature = null, // 'name' | 'health' | 'fight' | 'all'
  showTreeConduits = true
}) {
  if (!visible) return null;

  return (
    <div className="hero-base-parent-container">
      {/* Floating Parent Class Badge Card */}
      <div className={`hero-base-parent-card ${streamActive ? 'streaming' : ''}`}>
        <div className="parent-badge-header">
          <span className="parent-badge-crown">👑</span>
          <div className="parent-badge-title-group">
            <span className="parent-badge-tag">PARENT (BASE) CLASS</span>
            <h3 className="parent-badge-name">🦸 class Hero:</h3>
          </div>
        </div>

        {/* Inherited Features Box */}
        <div className="parent-features-grid">
          <div className={`parent-feature-pill ${highlightFeature === 'name' || highlightFeature === 'all' ? 'active-glow' : ''}`}>
            <span className="feature-icon">🏷️</span>
            <span className="feature-code">self.name</span>
          </div>

          <div className={`parent-feature-pill ${highlightFeature === 'health' || highlightFeature === 'all' ? 'active-glow' : ''}`}>
            <span className="feature-icon">❤️</span>
            <span className="feature-code">self.health</span>
          </div>

          <div className={`parent-feature-pill method ${highlightFeature === 'fight' || highlightFeature === 'all' ? 'active-glow' : ''}`}>
            <span className="feature-icon">⚔️</span>
            <span className="feature-code">def fight(self):</span>
          </div>
        </div>

        <div className="parent-inheritance-flow-hint">
          <span>⬇️ Shared to all Child Heroes automatically!</span>
        </div>
      </div>

      {/* SVG Animated Energy Conduits / Inheritance Tree Beams */}
      {showTreeConduits && (
        <svg className="inheritance-tree-svg" viewBox="0 0 800 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="1" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Central Stem coming down from Parent */}
          <line x1="400" y1="0" x2="400" y2="45" stroke="#F59E0B" strokeWidth="4" filter="url(#glow)" />

          {/* Horizontal Distribution Rail */}
          <line x1="160" y1="45" x2="640" y2="45" stroke="url(#beamGrad)" strokeWidth="4" filter="url(#glow)" />

          {/* Branch Down to Zippy (Left) */}
          <path
            d="M160 45 L160 160"
            stroke="#0EA5E9"
            strokeWidth="3.5"
            strokeDasharray={streamActive ? "8 6" : "none"}
            className={streamActive ? "beam-stream beam-left" : ""}
            filter="url(#glow)"
          />
          {/* Arrow Head Left */}
          <polygon points="160,160 154,148 166,148" fill="#0EA5E9" />

          {/* Branch Down to Ember (Center) */}
          <path
            d="M400 45 L400 160"
            stroke="#EF4444"
            strokeWidth="3.5"
            strokeDasharray={streamActive ? "8 6" : "none"}
            className={streamActive ? "beam-stream beam-center" : ""}
            filter="url(#glow)"
          />
          {/* Arrow Head Center */}
          <polygon points="400,160 394,148 406,148" fill="#EF4444" />

          {/* Branch Down to Shieldy (Right) */}
          <path
            d="M640 45 L640 160"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeDasharray={streamActive ? "8 6" : "none"}
            className={streamActive ? "beam-stream beam-right" : ""}
            filter="url(#glow)"
          />
          {/* Arrow Head Right */}
          <polygon points="640,160 634,148 646,148" fill="#10B981" />

          {/* Floating Flow Data Packets along beams */}
          {streamActive && (
            <g className="data-packet-group">
              <circle cx="160" cy="90" r="5" fill="#38BDF8" className="data-pulse pulse-1" />
              <circle cx="400" cy="90" r="5" fill="#F97316" className="data-pulse pulse-2" />
              <circle cx="640" cy="90" r="5" fill="#34D399" className="data-pulse pulse-3" />
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
