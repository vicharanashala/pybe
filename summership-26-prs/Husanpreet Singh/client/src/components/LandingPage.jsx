import React, { useEffect, useRef } from 'react';
import './LandingPage.css';

/* ---------- data for the features & topics ---------- */
const features = [
  {
    icon: '📜',
    iconClass: 'feature-icon--story',
    title: 'Story-Driven Learning',
    desc: 'Embark on pirate adventures where every decision teaches you a Python concept. No boring textbooks — just epic tales on the high seas.',
  },
  {
    icon: '⚔️',
    iconClass: 'feature-icon--code',
    title: 'Interactive Challenges',
    desc: 'Write real Python code to navigate through story scenarios. Solve puzzles, outsmart pirates, and watch your code come to life.',
  },
  {
    icon: '🏆',
    iconClass: 'feature-icon--badge',
    title: 'Earn Pirate Badges',
    desc: 'Complete each chapter to unlock badges and climb the ranks from Deckhand to Captain. Track your mastery across every topic.',
  },
];

const topics = [
  {
    number: 'Chapter I',
    icon: '⚓',
    title: 'If-Else Statements',
    desc: 'Navigate the seas by making critical decisions. Learn how conditions control the flow of your Python code.',
    available: true,
  },
  {
    number: 'Chapter II',
    icon: '🔄',
    title: 'Loops',
    desc: 'Patrol the waters and repeat tasks until the mission is done. Master for and while loops.',
    available: false,
  },
  {
    number: 'Chapter III',
    icon: '🗡️',
    title: 'Functions',
    desc: 'Train your crew with reusable battle strategies. Learn to write and call Python functions.',
    available: false,
  },
  {
    number: 'Chapter IV',
    icon: '🗺️',
    title: 'Lists & Dictionaries',
    desc: 'Manage your treasure inventory and crew roster with Python data structures.',
    available: false,
  },
];

/* ---------- helper: generate random star positions ---------- */
function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: `${Math.random() * 4 + 2}s`,
    delay: `${Math.random() * 5}s`,
  }));
}

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 6 + 6}s`,
    delay: `${Math.random() * 8}s`,
    drift: `${(Math.random() - 0.5) * 80}px`,
    type: Math.random() > 0.5 ? 'gold' : 'ember',
  }));
}

const stars = generateStars(80);
const particles = generateParticles(18);

/* ---------- Wave SVG Component ---------- */
function WaveSVG({ color }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
        fill={color}
      />
    </svg>
  );
}

/* =========================================================
   LANDING PAGE COMPONENT
   ========================================================= */
export default function LandingPage({ onStartAdventure }) {
  const revealRefs = useRef([]);

  /* Intersection Observer for scroll-reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="landing-page">
      {/* ====== HERO ====== */}
      <section className="landing-hero" id="hero">
        {/* Star background */}
        <div className="hero-stars">
          {stars.map((s) => (
            <div
              key={s.id}
              className="star"
              style={{
                left: s.left,
                top: s.top,
                width: `${s.size}px`,
                height: `${s.size}px`,
                '--duration': s.duration,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        <div className="hero-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className={`particle particle--${p.type}`}
              style={{
                left: p.left,
                '--duration': p.duration,
                '--drift': p.drift,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* Ship silhouette */}
        <div className="hero-ship" aria-hidden="true">⛵</div>

        {/* Main hero content */}
        <div className="hero-content">
          <div className="hero-badge">⚓ Interactive Python Learning</div>

          <h1 className="hero-title">
            Learn Python
            <span className="hero-title-accent">The Pirate Way</span>
          </h1>

          <p className="hero-subtitle">
            Master Python programming through immersive pirate adventure stories.
            Make decisions, write code, and conquer the seas — one concept at a time.
          </p>

          <div className="hero-cta-group">
            <button
              className="cta-secondary"
              onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
              id="cta-explore-topics"
            >
              Explore Topics ↓
            </button>
          </div>
        </div>

        {/* Animated waves */}
        <div className="hero-waves">
          <div className="wave wave--back">
            <WaveSVG color="rgba(13, 27, 42, 0.5)" />
          </div>
          <div className="wave wave--mid">
            <WaveSVG color="rgba(10, 14, 26, 0.7)" />
          </div>
          <div className="wave wave--front">
            <WaveSVG color="#0a0e1a" />
          </div>
        </div>
      </section>

      {/* ====== ABOUT ====== */}
      <section className="landing-about" id="about">
        <div className="about-inner">
          <div ref={addRevealRef} className="reveal">
            <p className="section-label">Why PyBe?</p>
            <h2 className="section-title">Python Meets Pirate Adventure</h2>
            <p className="section-desc">
              Forget dry tutorials. Each concept unfolds through rich narratives where
              your code determines the outcome of the story. Learn by doing — on the high seas.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                ref={addRevealRef}
                className="feature-card reveal"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TOPICS ====== */}
      <section className="landing-topics" id="topics">
        <div className="topics-inner">
          <div ref={addRevealRef} className="reveal">
            <p className="section-label">Your Journey</p>
            <h2 className="section-title">Choose Your Adventure</h2>
            <p className="section-desc">
              Each chapter is a self-contained pirate quest that teaches a core Python concept.
              Complete them in order or jump to what interests you.
            </p>
          </div>

          <div className="topics-grid">
            {topics.map((t, i) => (
              <div
                key={i}
                ref={addRevealRef}
                className={`topic-card ${t.available ? 'topic-card--active' : 'topic-card--locked'} reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
                onClick={t.available ? onStartAdventure : undefined}
                role={t.available ? 'button' : undefined}
                tabIndex={t.available ? 0 : undefined}
                onKeyDown={t.available ? (e) => { if (e.key === 'Enter') onStartAdventure(); } : undefined}
                id={`topic-${i}`}
              >
                <div className="topic-number">{t.number}</div>
                <span className="topic-icon">{t.icon}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <div className={`topic-status ${t.available ? 'topic-status--available' : 'topic-status--locked'}`}>
                  <span className={`topic-status-dot ${t.available ? 'topic-status-dot--pulse' : 'topic-status-dot--locked'}`} />
                  {t.available ? 'Available Now' : 'Coming Soon'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-logo">⚓ PyBe</div>
          <p className="footer-text">Learn Python the Pirate Way — An Interactive Learning Experience</p>
          <p className="footer-text">© {new Date().getFullYear()} PyBe. Crafted with 🏴‍☠️ by Husanpreet Singh.</p>
        </div>
      </footer>
    </div>
  );
}
