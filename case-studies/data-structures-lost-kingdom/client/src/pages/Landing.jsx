import React from 'react';

// 13 Adventure Missions — framed purely around story missions and leveling up
const ADVENTURE_LEVELS = [
  {
    num: 1,
    icon: '🎒',
    title: 'The Trailhead',
    missionLabel: 'Mission 1',
    desc: 'Setting out into the unknown with two simple supplies in your pack.'
  },
  {
    num: 2,
    icon: '💥',
    title: 'The Outpost Chaos',
    missionLabel: 'Mission 2',
    desc: 'Experience the mess of stuffing 10 supplies into 10 separate pockets all over your jacket.'
  },
  {
    num: 3,
    icon: '📦',
    title: 'The Ordered Pack',
    missionLabel: 'Mission 3',
    desc: 'Discover the solution: one single bag keeping all supplies together in a neat, ordered row.'
  },
  {
    num: 4,
    icon: '🧭',
    title: 'Trailside Compass',
    missionLabel: 'Mission 4',
    desc: 'A shiny compass is spotted! See how naturally a new item attaches to the very end of your line.'
  },
  {
    num: 5,
    icon: '🗑️',
    title: 'Discarding Ruined Gear',
    missionLabel: 'Mission 5',
    desc: 'A soaked map is ruined in the stream. Discard it by name to keep your pack neat and light.'
  },
  {
    num: 6,
    icon: '📏',
    title: 'Distance from the Start',
    missionLabel: 'Mission 6',
    desc: 'The Forest Guardian counts items by measuring steps from the bag opening (starting at 0!).'
  },
  {
    num: 7,
    icon: '🔄',
    title: 'The Canteen Swap',
    missionLabel: 'Mission 7',
    desc: 'Your water bottle springs a leak. Swap it in place with a sturdy flask without buying a new pack.'
  },
  {
    num: 8,
    icon: '🔢',
    title: 'The Toll Bridge Tally',
    missionLabel: 'Mission 8',
    desc: 'A mountain bridge troll demands an accurate total item count before letting you cross.'
  },
  {
    num: 9,
    icon: '🔍',
    title: 'Dusk in the Woods',
    missionLabel: 'Mission 9',
    desc: 'Night falls fast in the woods. Check whether the torch is inside your bag in one quick check.'
  },
  {
    num: 10,
    icon: '✂️',
    title: 'Sharing Provisions',
    missionLabel: 'Mission 10',
    desc: 'A fellow explorer needs provisions. Grab a bunch of items together from start to finish to share.'
  },
  {
    num: 11,
    icon: '🔥',
    title: 'Campfire Roll-Call',
    missionLabel: 'Mission 11',
    desc: 'Gather around the campfire and show each item one by one from first to last without missing a thing.'
  },
  {
    num: 12,
    icon: '✨',
    title: 'The Grand Reveal',
    missionLabel: 'Mission 12',
    desc: 'The master summary: connect every single backpack action directly to real Python code!'
  },
  {
    num: 13,
    icon: '🧙‍♂️',
    title: 'Code Mastery Hub',
    missionLabel: 'Mission 13',
    desc: 'Decode every Python command one piece at a time with zero fear and 100% confidence!'
  },
  {
    num: 14,
    icon: '⚡',
    title: 'Explorer Trials',
    missionLabel: 'Mission 14',
    desc: 'Put your Python skills to the test with interactive matching, quizzes, and code challenges.'
  },
];

const JOURNEY_STEPS = [
  {
    icon: '📖',
    step: 'Stage 1',
    title: 'Live the Story',
    desc: 'Encounter real survival situations with Pyra on an expedition through the Lost Forest.'
  },
  {
    icon: '🎒',
    step: 'Stage 2',
    title: 'Interactive Missions',
    desc: 'Pack, organize, search, and swap items in your backpack through hands-on assignments.'
  },
  {
    icon: '💡',
    step: 'Stage 3',
    title: 'Uncover the Concepts',
    desc: 'See how each intuitive backpack puzzle directly connects to powerful programming ideas.'
  },
  {
    icon: '🚀',
    step: 'Stage 4',
    title: 'Mission Up & Code',
    desc: 'Solve interactive code challenges and connect each command to your story.'
  }
];

export default function Landing({ progress, onNavigate }) {
  const missions = React.useRef(null);
  const isCompleted = progress.chapter1?.completed;

  return (
    <div className="page">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="dot" />
            Story-Driven Python Adventure
          </div>

          <h1 className="hero-title">
            The Lost Forest &<br />The Magical Backpack
          </h1>

          <p className="hero-subtitle">
            Embark on an immersive journey where every survival mission leads to a new discovery.
            Solve problems hands-on, complete assignments, and practise Python.
          </p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('chapter1')}
              id="start-adventure-btn"
              style={{
                boxShadow: '0 0 30px rgba(57, 211, 83, 0.4)',
                fontSize: '1.05rem',
                padding: '14px 32px'
              }}
            >
              {isCompleted ? '↻ Revisit Backpack Adventure' : '🎒 Start Adventure'}
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => missions.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              🗺️ View Adventure Missions
            </button>
          </div>

          {isCompleted && <p className="story-explored">✓ Backpack journey explored</p>}

          {/* Stats Bar */}
          <div className="hero-stats" style={{ marginTop: '36px', paddingTop: '28px' }}>
            <div className="hero-stat">
              <span className="hero-stat-value" style={{ color: 'var(--green)' }}>13</span>
              <span className="hero-stat-label">Story Parts</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">5</span>
              <span className="hero-stat-label">Coding Missions</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── 13 Adventure Missions Grid ──────────────────────────────────────── */}
      <section className="section" id="levels-section" ref={missions}>
        <div className="section-header">
          <div className="section-label">Mission Path</div>
          <h2 className="section-title">13 Adventure Missions</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '8px auto 0', fontSize: '0.95rem' }}>
            Travel through the Lost Forest. Overcome each obstacle with your pack,
            discover the superpower of ordered data, and connect intuition to code!
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
          marginTop: '32px'
        }}>
          {ADVENTURE_LEVELS.map((level) => (
            <div
              key={level.num}
              onClick={() => onNavigate('chapter1', { sceneIdx: level.num - 1 })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('chapter1', { sceneIdx: level.num - 1 })}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(57, 211, 83, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(57, 211, 83, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Level Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{
                    fontSize: '1.6rem',
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(57, 211, 83, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {level.icon}
                  </span>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--green)',
                    letterSpacing: '0.04em'
                  }}>
                    {level.missionLabel}
                  </span>
                </div>


              </div>

              {/* Title & Description */}
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {level.title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: 0,
                flexGrow: 1
              }}>
                {level.desc}
              </p>

              {/* Action Link */}
              <div style={{
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--green)'
              }}>
                <span>Play Mission</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey Progression (Story → Mission → Concept → Level Up) ─────── */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div className="section-header">
          <div className="section-label">How the Story Unfolds</div>
          <h2 className="section-title">The Explorer Progression</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '8px auto 0', fontSize: '0.95rem' }}>
            No boring lectures or syntax memorization. We start with storytelling, hand you real missions,
            and connect the story to Python.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
          marginTop: '28px'
        }}>
          {JOURNEY_STEPS.map((step) => (
            <div
              key={step.step}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.8rem' }}>{step.icon}</span>
                <span style={{
                  fontSize: '0.74rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(57, 211, 83, 0.1)',
                  color: 'var(--green)',
                  fontWeight: 700
                }}>
                  {step.step}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.05rem',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                margin: 0
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Row ─────────────────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {[
            { icon: '📖', label: 'Story-First Missions', desc: 'Encounter genuine adventure situations before writing any code' },
            { icon: '🎒', label: 'Interactive Backpack', desc: 'Watch your supplies dynamically respond as you solve problems' },
            { icon: '⚡', label: 'Coding Assignments', desc: 'Apply what you discover in real code editors with live test feedback' },
            { icon: '💾', label: 'Saved Journey', desc: 'Your completed backpack journey is saved in this browser' }
          ].map((feat) => (
            <div
              key={feat.label}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{feat.icon}</span>
              <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {feat.label}
              </strong>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {feat.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center',
        padding: '36px 24px',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-faint)',
        fontSize: '0.82rem'
      }}>
        🎒 <strong>PyBe</strong> · Python Adventure Quest · Story → Mission → Discover → Level Up
      </footer>
    </div>
  );
}
