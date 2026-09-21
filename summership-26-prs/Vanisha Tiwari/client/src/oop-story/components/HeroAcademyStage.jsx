import React from 'react';
import ProfessorNova from './ProfessorNova';
import ZippyCharacter from './ZippyCharacter';
import EmberCharacter from './EmberCharacter';
import ShieldyCharacter from './ShieldyCharacter';
import HeroBaseBadge from './HeroBaseBadge';
import '../styles/characterRigs.css';
import '../styles/heroAcademy.css';

export default function HeroAcademyStage({
  theme = 'academy-gates',
  doorsOpen = true,
  nova = {},
  zippy = {},
  ember = {},
  shieldy = {},
  heroParentBadge = { visible: false, streamActive: false, highlightFeature: null },
  tamperEvent = null,
  customHero = null
}) {
  const isGatesTheme = theme === 'academy-gates';

  return (
    <div className={`hero-stage theme-${theme}`}>
      {/* Sci-Fi Hologram Background Pillars */}
      <div className="holo-pillar pillar-left" />
      <div className="holo-pillar pillar-right" />

      {/* Grid Floor */}
      <div className="hero-stage-floor">
        <div className="hero-floor-grid" />
      </div>

      {/* Futuristic Academy Blast Doors (Only in Episode 1 Gates Scene) */}
      {isGatesTheme && (
        <div className="academy-blast-doors">
          <div className={`door-left ${doorsOpen ? 'open' : ''}`}>
            <span className="door-crest">⚡</span>
          </div>
          <div className={`door-right ${doorsOpen ? 'open' : ''}`}>
            <span className="door-crest">🦸</span>
          </div>
        </div>
      )}

      {/* Tamper / Duplicate Code Warning Banner (Episode 4) */}
      {tamperEvent && (
        <div className="hero-tamper-box">
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <span style={{ fontFamily: 'JetBrains Mono', color: '#FEE2E2', fontWeight: 700, fontSize: '1.1rem' }}>
            {tamperEvent.text}
          </span>
        </div>
      )}

      {/* Parent Class Floating Badge & Inheritance Stream Beams (Episode 6-10) */}
      {heroParentBadge && heroParentBadge.visible && (
        <HeroBaseBadge
          visible={heroParentBadge.visible}
          streamActive={heroParentBadge.streamActive}
          highlightFeature={heroParentBadge.highlightFeature}
          showTreeConduits={heroParentBadge.showTreeConduits !== false}
        />
      )}

      {/* Stage Actors with Physical Dynamic Coordinates */}

      {/* 1. Professor Nova */}
      {nova && nova.visible !== false && (
        <div
          className="hero-stage-actor"
          style={{
            position: 'absolute',
            left: `${nova.x !== undefined ? nova.x : 76}%`,
            bottom: `${nova.y !== undefined ? nova.y : 25}px`,
            opacity: nova.opacity !== undefined ? nova.opacity : 1,
            zIndex: 25
          }}
        >
          <ProfessorNova
            action={nova.action || 'talking'}
            scaleX={nova.scaleX !== undefined ? nova.scaleX : -1}
          />
        </div>
      )}

      {/* 2. Zippy (Speed Hero) */}
      {zippy && zippy.visible !== false && (
        <div
          className="hero-stage-actor"
          style={{
            position: 'absolute',
            left: `${zippy.x !== undefined ? zippy.x : 16}%`,
            bottom: `${zippy.y !== undefined ? zippy.y : 25}px`,
            opacity: zippy.opacity !== undefined ? zippy.opacity : 1,
            zIndex: 25
          }}
        >
          <ZippyCharacter
            action={zippy.action || 'idle'}
            scaleX={zippy.scaleX !== undefined ? zippy.scaleX : 1}
            showStats={zippy.showStats !== false}
            health={zippy.health !== undefined ? zippy.health : 100}
          />
        </div>
      )}

      {/* 3. Ember (Fire Hero) */}
      {ember && ember.visible !== false && (
        <div
          className="hero-stage-actor"
          style={{
            position: 'absolute',
            left: `${ember.x !== undefined ? ember.x : 36}%`,
            bottom: `${ember.y !== undefined ? ember.y : 25}px`,
            opacity: ember.opacity !== undefined ? ember.opacity : 1,
            zIndex: 25
          }}
        >
          <EmberCharacter
            action={ember.action || 'idle'}
            scaleX={ember.scaleX !== undefined ? ember.scaleX : 1}
            showStats={ember.showStats !== false}
            health={ember.health !== undefined ? ember.health : 100}
          />
        </div>
      )}

      {/* 4. Shieldy (Defense Hero) */}
      {shieldy && shieldy.visible !== false && (
        <div
          className="hero-stage-actor"
          style={{
            position: 'absolute',
            left: `${shieldy.x !== undefined ? shieldy.x : 56}%`,
            bottom: `${shieldy.y !== undefined ? shieldy.y : 25}px`,
            opacity: shieldy.opacity !== undefined ? shieldy.opacity : 1,
            zIndex: 25
          }}
        >
          <ShieldyCharacter
            action={shieldy.action || 'idle'}
            scaleX={shieldy.scaleX !== undefined ? shieldy.scaleX : 1}
            showStats={shieldy.showStats !== false}
            health={shieldy.health !== undefined ? shieldy.health : 100}
          />
        </div>
      )}

      {/* 5. Custom Hero (Created by user in Episode 12) */}
      {customHero && customHero.visible && (
        <div
          className="hero-stage-actor"
          style={{
            position: 'absolute',
            left: `${customHero.x || 50}%`,
            bottom: `${customHero.y || 25}px`,
            zIndex: 30
          }}
        >
          <div className="hero-stat-badge" style={{ background: customHero.color || '#8B5CF6' }}>
            <span className="hero-badge-icon">{customHero.icon || '✨'}</span>
            <div className="hero-badge-info">
              <span className="hero-badge-name">{customHero.name || 'StarHero'}</span>
              <div className="hero-hp-bar">
                <div className="hero-hp-fill" style={{ width: '100%', background: '#FDE047' }} />
              </div>
            </div>
          </div>
          <div style={{ fontSize: '3.6rem', textAlign: 'center', animation: 'floatSpark 2s infinite' }}>
            {customHero.avatarEmoji || '🦸'}
          </div>
        </div>
      )}
    </div>
  );
}
