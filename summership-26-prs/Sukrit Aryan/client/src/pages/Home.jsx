import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Brain, BookOpen, BarChart2, Sparkles, Users, Target, Zap,
  CheckCircle2, GraduationCap, Flame, Lightbulb, Code2, ShieldCheck, HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import PublicNavbar from '../components/PublicNavbar.jsx';
import { CURRICULUM } from '../data/curriculum.js';

const UADE_THEMES = [
  { id: 'chai-stall',    emoji: '🍵', title: 'Ramu\'s Chai Stall',    color: '#F59E0B', arc: 'Variables → Lists → Dictionaries', desc: 'Manage 50+ tea items, prices, and daily revenue without breaking a sweat.' },
  { id: 'isro',          emoji: '🚀', title: 'ISRO Chandrayaan',     color: '#3B82F6', arc: 'Loops → Functions → Telemetry',   desc: 'Calculate fuel burn rates and trajectory checks for lunar orbit insertion.' },
  { id: 'instagram',     emoji: '📸', title: 'Insta Filter Engine',   color: '#EC4899', arc: 'Lists → Matrix Manipulation',     desc: 'Apply brightness and color matrix transformations to pixel arrays.' },
  { id: 'food-delivery', emoji: '🍕', title: 'Hostel Eats Startup',   color: '#F97316', arc: 'Conditionals → Search & Filter',  desc: 'Sort late-night delivery orders by distance, price, and preparation time.' },
  { id: 'ai-playlist',   emoji: '🎵', title: 'AI Playlist Curator',   color: '#8B5CF6', arc: 'Sets → Unique Deduplication',     desc: 'Remove duplicate songs, match genres, and build smooth mood transitions.' },
  { id: 'kota',          emoji: '📚', title: 'Kota Coaching Ranks',   color: '#10B981', arc: 'Algorithms → Binary Search',       desc: 'Search 100,000 student test scores in milliseconds using divide-and-conquer.' },
];

const FEATURES = [
  { icon: <Brain size={22} />, title: 'First-Principles Discovery', desc: 'You are never lectured on syntax first. You reason through real problems until the current method breaks.' },
  { icon: <Sparkles size={22} />, title: '6 UADE Universes', desc: 'Chai stalls, rocket launches, playlist curators — real Indian stories that bring Python concepts to life.' },
  { icon: <Target size={22} />, title: 'Layman Language', desc: 'Designed specifically for junior students. Zero jargon overload, plain-English explanations.' },
  { icon: <BarChart2 size={22} />, title: 'Metacognitive Feedback', desc: 'Your natural English reasoning is analyzed with educational quality grade levels before code reveal.' },
  { icon: <Zap size={22} />, title: 'Docs-Style Theory Reveal', desc: 'After reasoning, concepts appear in clean documentation with code examples, callouts, and takeaways.' },
  { icon: <ShieldCheck size={22} />, title: 'Research-Backed Pedagogy', desc: 'Grounded in Barrows\' PBL, Kapur\'s Productive Failure, Vygotsky\'s ZPD, and Piagetian cognitive stages.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('getting-started');

  // Interactive Demo Widget State
  const [demoChoice, setDemoChoice] = useState(null);

  // Redirect logged-in users straight to the app dashboard
  useEffect(() => {
    if (user) { navigate('/app', { replace: true }); }
  }, [user, navigate]);

  const selectedSection = CURRICULUM.find(s => s.id === activeTab) || CURRICULUM[0];

  return (
    <div className="landing-page">
      <PublicNavbar />

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="hero">
        {/* Background Aurora Blobs */}
        <div className="aurora-blob aurora-blob--1" style={{ width: 500, height: 500, top: -120, left: -100 }} />
        <div className="aurora-blob aurora-blob--2" style={{ width: 400, height: 400, top: 100, right: -120 }} />
        <div className="aurora-blob aurora-blob--3" style={{ width: 350, height: 350, bottom: -80, left: '30%' }} />

        <div className="container hero__container">
          <div className="hero__badge">
            <GraduationCap size={14} /> IIT Ropar Engineering Education Research Project
          </div>

          <h1 className="hero__title">
            Don't memorize syntax.<br />
            <span className="shimmer-text">Rediscover why Python exists.</span>
          </h1>

          <p className="hero__subtitle">
            PyBe teaches programming through real Indian stories — chai stalls, ISRO rocket missions, and food startups.
            You reason through the problem in plain English first. Python code is the discovery, not the starting lecture.
          </p>

          <div className="hero__ctas">
            <Link to="/signup" className="btn btn-primary btn-lg hero__btn-primary">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>

          {/* ── INTERACTIVE FIRST-PRINCIPLES DEMO WIDGET ──────────────── */}
          <div className="hero__demo card">
            <div className="hero__demo-header">
              <div className="hero__demo-dots">
                <span style={{ background: '#FF5F56' }} />
                <span style={{ background: '#FFBD2E' }} />
                <span style={{ background: '#27C93F' }} />
              </div>
              <span className="hero__demo-title"><Lightbulb size={13} /> Interactive PyBe Method Demo</span>
              <span className="hero__demo-tag">Try it below</span>
            </div>

            <div className="hero__demo-body">
              <p className="hero__demo-problem">
                <strong>📍 The Problem:</strong> Ramu's Chai Stall has 8 tea varieties stored in 8 separate variables (<code>price1=10</code>, <code>price2=15</code>...).
                His menu expands to 50 items. What happens when he wants to update all prices?
              </p>

              <div className="hero__demo-choices">
                <button
                  className={`hero__demo-choice ${demoChoice === 'A' ? 'selected-bad' : ''}`}
                  onClick={() => setDemoChoice('A')}
                >
                  <span className="choice-badge">A</span> Create 42 more variables (<code>price9</code>, <code>price10</code>...)
                </button>
                <button
                  className={`hero__demo-choice ${demoChoice === 'B' ? 'selected-good' : ''}`}
                  onClick={() => setDemoChoice('B')}
                >
                  <span className="choice-badge">B</span> Group all 50 prices in a single ordered container
                </button>
              </div>

              {demoChoice === 'A' && (
                <div className="hero__demo-result bad">
                  ⚠️ <strong>Cluttered code!</strong> 50 separate variables mean 50 lines of duplicate code. Hard to maintain and easy to bug out.
                </div>
              )}

              {demoChoice === 'B' && (
                <div className="hero__demo-result good">
                  🎉 <strong>Boom! You just reinvented a Python List (<code>[]</code>)!</strong>
                  <br />
                  In PyBe, you discover concepts by solving real problems first.
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── 4-STEP METHODOLOGY SECTION ──────────────────────────── */}
      <section id="methodology" className="methodology container">
        <div className="section-header center">
          <div>
            <div className="section-label">Pedagogical Framework</div>
            <h2>How PyBe Teaches First-Principles Thinking</h2>
          </div>
        </div>

        <div className="methodology__grid">
          <div className="methodology__card card">
            <div className="methodology__num">01</div>
            <div className="methodology__icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
              <Flame size={20} />
            </div>
            <h3>1. The Problem Hook</h3>
            <p>You face a scenario (e.g. tracking ISRO rocket telemetry) that grows until your current approach breaks down.</p>
          </div>

          <div className="methodology__card card">
            <div className="methodology__num">02</div>
            <div className="methodology__icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
              <Brain size={20} />
            </div>
            <h3>2. Plain-English Reasoning</h3>
            <p>No syntax pressure. You write your natural solution in everyday words — like explaining your logic to a friend.</p>
          </div>

          <div className="methodology__card card">
            <div className="methodology__num">03</div>
            <div className="methodology__icon" style={{ background: 'rgba(167,139,250,0.12)', color: '#A78BFA' }}>
              <BarChart2 size={20} />
            </div>
            <h3>3. Reasoning Recap</h3>
            <p>Get instant educational analysis of your thinking quality with grade levels (🔥 Excellent, ⚡ Strong, 💡 Good).</p>
          </div>

          <div className="methodology__card card">
            <div className="methodology__num">04</div>
            <div className="methodology__icon" style={{ background: 'rgba(168,255,62,0.12)', color: 'var(--accent)' }}>
              <CheckCircle2 size={20} />
            </div>
            <h3>4. Theory & Code Reveal</h3>
            <p>Discover the official Python construct (e.g. Loops or Dictionaries) as documentation that validates your exact logic.</p>
          </div>
        </div>
      </section>

      {/* ── SYLLABUS EXPLORER ───────────────────────────────────── */}
      <section id="syllabus" className="syllabus container">
        <div className="section-header">
          <div>
            <div className="section-label">Comprehensive Curriculum</div>
            <h2>From Zero to Advanced Python Engineer</h2>
          </div>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        <div className="syllabus__tabs">
          {CURRICULUM.map(s => (
            <button
              key={s.id}
              className={`syllabus__tab ${activeTab === s.id ? 'active' : ''}`}
              onClick={() => setActiveTab(s.id)}
            >
              <span>{s.emoji}</span> {s.title}
            </button>
          ))}
        </div>

        <div className="syllabus__chapters grid-3">
          {selectedSection.chapters.map((ch, idx) => (
            <div key={ch.id} className="syllabus__card card">
              <div className="syllabus__card-top">
                <span className="syllabus__card-emoji">{ch.emoji}</span>
                <span className="syllabus__card-num">Chapter {idx + 1}</span>
              </div>
              <h3 className="syllabus__card-title">{ch.title}</h3>
              <p className="syllabus__card-sub">{ch.subtitle}</p>
              <div className="syllabus__card-concepts">
                {ch.concepts.map(c => (
                  <span key={c} className="concept-tag">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6 UADE CASE STUDY UNIVERSES ──────────────────────────── */}
      <section id="themes" className="case-studies">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Real-World Case Studies</div>
              <h2>Learn Across 6 Culturally-Resonant Universes</h2>
            </div>
          </div>

          <div className="case-studies__grid grid-3">
            {UADE_THEMES.map(t => (
              <div key={t.id} className="case-card card" style={{ '--theme-c': t.color }}>
                <div className="case-card__header">
                  <span className="case-card__emoji">{t.emoji}</span>
                  <span className="case-card__arc">{t.arc}</span>
                </div>
                <h3 className="case-card__title">{t.title}</h3>
                <p className="case-card__desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PYBE / FEATURES SECTION ─────────────────────────── */}
      <section id="features" className="features container">
        <div className="section-header center">
          <div>
            <div className="section-label">Why PyBe</div>
            <h2>Built Specifically for Student Understanding</h2>
          </div>
        </div>

        <div className="grid-3">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card card">
              <div className="feature-card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA BANNER ────────────────────────────────────── */}
      <section className="cta-banner container">
        <div className="cta-banner__card card">
          <div className="aurora-blob aurora-blob--1" style={{ width: 300, height: 300, top: -50, right: -50 }} />
          <h2 className="cta-banner__title">Ready to think like a Python Engineer?</h2>
          <p className="cta-banner__sub">
            Join thousands of junior learners mastering Python through first-principles discovery. Free forever.
          </p>
          <div className="cta-banner__actions">
            <Link to="/signup" className="btn btn-primary btn-lg cta-banner__btn">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand">
            <span className="footer__logo">🐍 PyBe</span>
            <p className="footer__desc">
              Scenario-Driven Python Learning Platform. Grounded in Problem-Based Learning and UADE principles.
            </p>
          </div>
          <div className="footer__meta">
            <span>IIT Ropar Summer Internship 2026 · Sukrit</span>
            <span>Version 2.1.0</span>
          </div>
        </div>
      </footer>

      <style>{`
        .landing-page { padding-top: var(--navbar-h); overflow-x: hidden; }

        /* Scroll margin for section links */
        #methodology, #syllabus, #themes, #features {
          scroll-margin-top: calc(var(--navbar-h) + 24px);
        }

        /* Hero */
        .hero { position: relative; padding: 60px 0 40px; text-align: center; }
        .hero__container { max-width: 900px; position: relative; z-index: 1; }
        .hero__badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--accent);
          background: var(--accent-glow); border: 1px solid var(--border-accent);
          padding: 5px 14px; border-radius: 20px; margin-bottom: 20px;
        }
        .hero__title {
          font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 800;
          line-height: 1.1; margin-bottom: 20px; letter-spacing: -0.03em;
        }
        .hero__subtitle {
          font-size: 1.05rem; color: var(--text-secondary); max-width: 680px;
          margin: 0 auto 32px; line-height: 1.7;
        }
        .hero__ctas { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; margin-bottom: 48px; }
        .hero__btn-primary { padding: 14px 32px; }

        /* Demo widget */
        .hero__demo {
          max-width: 720px; margin: 0 auto; text-align: left;
          background: var(--bg-glass); border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden; box-shadow: var(--shadow-lg);
        }
        [data-theme="light"] .hero__demo { background: #ffffff; }
        .hero__demo-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 18px; background: var(--bg-elevated); border-bottom: 1px solid var(--border);
        }
        .hero__demo-dots { display: flex; gap: 6px; }
        .hero__demo-dots span { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .hero__demo-title { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); }
        .hero__demo-tag { font-size: 0.68rem; font-weight: 700; color: var(--accent); text-transform: uppercase; }
        .hero__demo-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }
        .hero__demo-problem { font-size: 0.92rem; color: var(--text-primary); line-height: 1.65; margin: 0; }
        .hero__demo-choices { display: flex; flex-direction: column; gap: 10px; }
        .hero__demo-choice {
          display: flex; align-items: center; gap: 12px; padding: 12px 16px;
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: 10px; font-size: 0.88rem; color: var(--text-primary);
          cursor: pointer; transition: all 0.2s ease; text-align: left;
        }
        .hero__demo-choice:hover { border-color: var(--border-hover); background: var(--bg-glass-light); }
        .choice-badge {
          width: 22px; height: 22px; border-radius: 50%; background: var(--border);
          font-size: 0.72rem; font-weight: 700; display: grid; place-items: center; flex-shrink: 0;
        }
        .selected-bad { border-color: #EF4444 !important; background: rgba(239,68,68,0.08) !important; }
        .selected-good { border-color: var(--accent) !important; background: var(--accent-glow) !important; }
        .hero__demo-result { padding: 14px 16px; border-radius: 10px; font-size: 0.88rem; line-height: 1.6; }
        .hero__demo-result.bad { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #EF4444; }
        .hero__demo-result.good { background: var(--accent-glow); border: 1px solid var(--border-accent); color: var(--text-primary); }

        /* Methodology */
        .methodology { padding: 80px 0 60px; }
        .section-header.center { text-align: center; justify-content: center; }
        .methodology__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 36px; }
        .methodology__card { padding: 24px 20px; display: flex; flex-direction: column; gap: 12px; position: relative; }
        .methodology__num { position: absolute; top: 16px; right: 18px; font-size: 1.6rem; font-weight: 900; color: var(--text-muted); opacity: 0.25; }
        .methodology__icon { width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center; }
        .methodology__card h3 { font-size: 1rem; margin: 0; }
        .methodology__card p { font-size: 0.84rem; margin: 0; line-height: 1.6; color: var(--text-secondary); }

        /* Syllabus */
        .syllabus { padding: 60px 0 80px; }
        .syllabus__tabs { display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 8px; }
        .syllabus__tab {
          display: flex; align-items: center; gap: 8px; padding: 10px 18px;
          border-radius: 10px; border: 1px solid var(--border); background: var(--bg-elevated);
          color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }
        .syllabus__tab.active { background: var(--accent); color: #0D1117; border-color: var(--accent); }
        [data-theme="light"] .syllabus__tab.active { color: #ffffff; background: #15803D; }
        .syllabus__card { padding: 22px; display: flex; flex-direction: column; gap: 10px; }
        .syllabus__card-top { display: flex; align-items: center; justify-content: space-between; }
        .syllabus__card-emoji { font-size: 1.6rem; }
        .syllabus__card-num { font-size: 0.72rem; font-weight: 700; color: var(--accent); text-transform: uppercase; }
        .syllabus__card-title { font-size: 1.05rem; margin: 0; }
        .syllabus__card-sub { font-size: 0.83rem; color: var(--text-muted); margin: 0; flex: 1; }
        .syllabus__card-concepts { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        .concept-tag { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 6px; background: var(--bg-glass-light); border: 1px solid var(--border); color: var(--text-secondary); }

        /* Case studies */
        .case-studies { padding: 60px 0 80px; background: var(--bg-surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .case-studies__grid { margin-top: 32px; }
        .case-card { padding: 24px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s; }
        .case-card:hover { transform: translateY(-4px); }
        .case-card__header { display: flex; align-items: center; justify-content: space-between; }
        .case-card__emoji { font-size: 2rem; }
        .case-card__arc { font-size: 0.72rem; font-weight: 700; color: var(--theme-c); background: color-mix(in srgb, var(--theme-c) 15%, transparent); padding: 3px 10px; border-radius: 20px; }
        .case-card__title { font-size: 1.1rem; margin: 0; }
        .case-card__desc { font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.65; }

        /* Features */
        .features { padding: 60px 0 80px; }
        .feature-card { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .feature-card__icon { color: var(--accent); }
        .feature-card h3 { font-size: 1rem; margin: 0; color: var(--text-primary); }
        .feature-card p { font-size: 0.85rem; margin: 0; line-height: 1.65; color: var(--text-secondary); }

        /* CTA Banner */
        .cta-banner { padding: 80px 0; }
        .cta-banner__card { padding: 60px 40px; text-align: center; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .cta-banner__title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; margin: 0; }
        .cta-banner__sub { font-size: 1rem; color: var(--text-secondary); max-width: 540px; margin: 0 0 12px; }
        .cta-banner__actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
        .cta-banner__btn { padding: 14px 36px; }

        /* Footer */
        .footer { border-top: 1px solid var(--border); padding: 40px 0; background: var(--bg-base); }
        .footer__inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .footer__brand { display: flex; flex-direction: column; gap: 6px; }
        .footer__logo { font-family: var(--font-heading); font-weight: 800; font-size: 1.1rem; color: var(--text-primary); }
        .footer__desc { font-size: 0.78rem; color: var(--text-muted); max-width: 400px; margin: 0; }
        .footer__meta { display: flex; flex-direction: column; align-items: flex-end; font-size: 0.75rem; color: var(--text-muted); gap: 4px; }

        @media (max-width: 1024px) {
          .methodology__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .methodology__grid { grid-template-columns: 1fr; }
          .footer__inner { flex-direction: column; align-items: flex-start; }
          .footer__meta { align-items: flex-start; }
          .cta-banner__card { padding: 36px 20px; }
        }
      `}</style>
    </div>
  );
}
