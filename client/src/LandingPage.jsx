import React from 'react';
import {
  ArrowRight,
  Brain,
  Code2,
  Globe2,
  Map,
  Rocket,
  Trophy,
  TreePine,
  TrendingUp,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LandingPage({ onStartExploring }) {
  return (
    <div className="pybe-landing">
      <div className="landing-glow landing-glow-one"></div>
      <div className="landing-glow landing-glow-two"></div>

      <header className="landing-header">
        <div className="landing-pill">
          <Globe2 size={17} />
          <span>WORLD EXPLORER</span>
        </div>

        <div className="landing-pill python-pill">
          <Sparkles size={16} />
          <span>Learn Python Differently</span>
        </div>
      </header>

      <section className="landing-content">
        <h1>
          Explore the
          <br />
          World.
          <br />
          <span>Think Like a</span>
          <br />
          <span>Python</span>
          <br />
          Developer.
        </h1>

        <p className="landing-description">
          PyBe turns everyday knowledge into Python thinking through
          interactive, scenario-driven learning missions.
        </p>

        <button
          className="start-exploring-btn"
          onClick={onStartExploring}
        >
          <span>Start Exploring</span>
          <ArrowRight size={22} />
        </button>
      </section>

      <section className="landing-visual">
        <div className="visual-card think-card">
          <div className="visual-image">
            <img
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=300&q=80"
              alt="Human brain"
            />
          </div>

          <div>
            <strong>Think</strong>
            <small>Reason first</small>
          </div>
        </div>

        <div className="earth-wrapper earth-visual">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="orbit orbit-three"></div>
          <div className="earth-glow"></div>

          <img
            className="earth-image"
            src="/images/earth-hero.png"
            alt="Earth from space"
          />
        </div>

        <div className="visual-card master-card">
          <div className="visual-icon">
            <TrendingUp size={36} />
          </div>

          <div>
            <strong>Master</strong>
            <small>Grow your skills</small>
          </div>
        </div>

        <div className="visual-card code-card">
          <div className="visual-image laptop-image">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80"
              alt="Programming laptop"
            />
          </div>

          <div>
            <strong>Code</strong>
            <small>Build solutions</small>
          </div>
        </div>
      </section>
    </div>
  );
}
