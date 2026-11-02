import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { CURRICULUM, ALL_CHAPTERS } from '../data/curriculum.js';
import {
  ArrowRight, CheckCircle2, Flame, BookOpen, Target, Zap,
  Palette, Sparkles, Layers, Wand2, ShieldAlert, Swords, ChevronRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const THEME_OPTIONS = [
  {
    id: 'default',
    title: 'Default Theme',
    subtitle: 'Classic PyBe Dark & Light',
    emoji: '🐍',
    badge: 'Standard',
    color: '#A8FF3E',
    bgGradient: 'linear-gradient(135deg, rgba(168,255,62,0.12), rgba(96,165,250,0.08))',
    desc: 'The original PyBe experience with classic real-world scenarios and universal abstractions.'
  },
  {
    id: 'potterheads',
    title: 'Potterheads',
    subtitle: 'Hogwarts Wizardry & Potions',
    emoji: '🧙‍♂️',
    badge: 'Magical',
    color: '#F59E0B',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(168,85,247,0.12))',
    desc: 'Brew Felix Felicis, decipher the Marauder’s Map, and master Python data structures at Hogwarts.'
  },
  {
    id: 'marvel',
    title: 'Marvel',
    subtitle: 'Avengers AI & Infinity Grid',
    emoji: '🦾',
    badge: 'Heroic',
    color: '#EF4444',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(56,189,248,0.14))',
    desc: 'Build J.A.R.V.I.S. suit diagnostics, harness Vibranium lab tech, and contain Infinity Stone energy.'
  },
  {
    id: 'anime',
    title: 'Anime',
    subtitle: 'Hidden Leaf Jutsu & Cyber Hunter',
    emoji: '⚔️',
    badge: 'Cyber Shinobi',
    color: '#FF2A85',
    bgGradient: 'linear-gradient(135deg, rgba(255,42,133,0.18), rgba(0,245,212,0.14))',
    desc: 'Control Nine-Tails chakra reserves, store jutsu hand signs, and index legendary dungeon rifts.'
  }
];

// Animated counter hook
function useCounter(target, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function AppHome() {
  const { user, getChapterStatus, getProgress } = useAuth();
  const { dashboardTheme, setDashboardTheme } = useTheme();
  const pageRef = useRef(null);

  const [themedCaseStudies, setThemedCaseStudies] = useState([]);
  const [themedScenarios, setThemedScenarios] = useState([]);
  const [loadingThemed, setLoadingThemed] = useState(true);

  const progress = getProgress();
  const completed = ALL_CHAPTERS.filter(c => getChapterStatus(c.id) === 'completed');
  const nextChapter = ALL_CHAPTERS.find(c => getChapterStatus(c.id) !== 'completed') || null;
  const totalChapters = ALL_CHAPTERS.length;
  const pct = Math.round((completed.length / totalChapters) * 100);

  const countCompleted = useCounter(completed.length, 800);
  const countTotal = useCounter(totalChapters, 600);
  const countPct = useCounter(pct, 1000);

  useEffect(() => {
    if (!pageRef.current) return;
    gsap.from(pageRef.current.children, {
      y: 22, opacity: 0, duration: 0.45, stagger: 0.09, ease: 'power3.out',
    });
  }, []);

  useEffect(() => {
    setLoadingThemed(true);
    const themeQuery = dashboardTheme ? `?theme=${encodeURIComponent(dashboardTheme)}` : '';
    Promise.all([
      fetch(`${API_URL}/casestudies${themeQuery}`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/scenarios${themeQuery}`).then(r => r.ok ? r.json() : [])
    ])
      .then(([csData, scData]) => {
        setThemedCaseStudies(csData || []);
        setThemedScenarios((scData || []).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoadingThemed(false));
  }, [dashboardTheme]);

  const firstName = user?.name?.split(' ')[0] || 'Learner';
  const activeOption = THEME_OPTIONS.find(t => t.id === dashboardTheme) || THEME_OPTIONS[0];

  return (
    <div className="ha" ref={pageRef}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="ha-hero">
        {/* Aurora blobs */}
        <div className="aurora-blob aurora-blob--1" style={{ width: 340, height: 340, top: -80, left: -60 }} />
        <div className="aurora-blob aurora-blob--2" style={{ width: 260, height: 260, top: 20, right: -40 }} />

        <div className="ha-hero__inner">
          <p className="ha-hero__eyebrow">Welcome back 👋</p>
          <h1 className="ha-hero__name shimmer-text">{firstName}</h1>
          <p className="ha-hero__message">
            {completed.length === 0
              ? 'You\'re all set to start learning. Pick a chapter below — or just hit "Let\'s go".'
              : completed.length === totalChapters
              ? '🎉 You\'ve mastered all chapters! Seriously impressive work.'
              : `${totalChapters - completed.length} chapter${totalChapters - completed.length !== 1 ? 's' : ''} left. You're doing great — keep the streak alive!`
            }
          </p>

          {nextChapter && (
            <Link to={`/app/chapter/${nextChapter.id}`} id="continue-btn" className="ha-hero__cta">
              {completed.length === 0 ? 'Start learning' : 'Continue'}
              <span className="ha-hero__cta-chapter">{nextChapter.emoji} {nextChapter.title}</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Dashboard Theme Selector ─────────────────────────── */}
      <div className="ha-theme-selector">
        <div className="ha-theme-selector__header">
          <div>
            <div className="ha-theme-selector__label">
              <Palette size={14} /> Dashboard Theme & Scenario World
            </div>
            <h2 className="ha-theme-selector__title">Choose Your Theme</h2>
            <p className="ha-theme-selector__sub">
              Select a world to customize your dashboard UI styling and switch case studies & scenarios!
            </p>
          </div>
          <div className="ha-active-badge" style={{ borderColor: activeOption.color + '40', background: activeOption.color + '15', color: activeOption.color }}>
            <span>{activeOption.emoji} Active: {activeOption.title}</span>
          </div>
        </div>

        <div className="ha-theme-grid">
          {THEME_OPTIONS.map(option => {
            const isActive = dashboardTheme === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setDashboardTheme(option.id)}
                className={`ha-theme-card${isActive ? ' ha-theme-card--active' : ''}`}
                style={{
                  '--theme-color': option.color,
                  background: isActive ? option.bgGradient : 'var(--bg-glass)',
                  borderColor: isActive ? option.color : 'var(--border)'
                }}
              >
                <div className="ha-theme-card__top">
                  <span className="ha-theme-card__emoji">{option.emoji}</span>
                  <span className="ha-theme-card__badge" style={{ background: option.color + '20', color: option.color }}>
                    {option.badge}
                  </span>
                </div>
                <h3 className="ha-theme-card__name" style={isActive ? { color: option.color } : {}}>
                  {option.title}
                </h3>
                <p className="ha-theme-card__subtitle">{option.subtitle}</p>
                <p className="ha-theme-card__desc">{option.desc}</p>
                <button className="ha-theme-card__select-btn" style={isActive ? { background: option.color, color: option.id === 'default' ? '#0F1318' : '#ffffff' } : {}}>
                  {isActive ? 'Active Theme ✓' : 'Select Theme'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active Theme Case Studies & Scenarios Showcase ───── */}
      <div className="ha-themed-showcase" style={{ borderColor: activeOption.color + '30' }}>
        <div className="ha-themed-showcase__header">
          <div>
            <div className="section-label" style={{ color: activeOption.color }}>
              <Sparkles size={13} /> {activeOption.emoji} {activeOption.title} World
            </div>
            <h2>Active Case Studies & Scenarios</h2>
            <p className="ha-themed-showcase__sub">
              These case study arcs and scenarios adapt to your chosen <strong>{activeOption.title}</strong> theme.
            </p>
          </div>
        </div>

        {loadingThemed ? (
          <div className="ha-themed-showcase__grid">
            <div className="skeleton" style={{ height: 160, borderRadius: 12 }} />
            <div className="skeleton" style={{ height: 160, borderRadius: 12 }} />
          </div>
        ) : (
          <div className="ha-themed-showcase__content">
            {/* Case Studies Arc Cards */}
            {themedCaseStudies.length > 0 && (
              <div className="ha-cs-list">
                {themedCaseStudies.map(cs => (
                  <div key={cs.id} className="ha-cs-card" style={{ borderColor: (cs.color || activeOption.color) + '30' }}>
                    <div className="ha-cs-card__head">
                      <span className="ha-cs-card__emoji">{cs.emoji}</span>
                      <div>
                        <h4 className="ha-cs-card__title" style={{ color: cs.color || activeOption.color }}>{cs.title}</h4>
                        <span className="ha-cs-card__tagline">{cs.tagline}</span>
                      </div>
                    </div>
                    <p className="ha-cs-card__desc">{cs.description}</p>
                    <div className="ha-cs-card__arc">
                      <span>Arc: <strong>{cs.arc}</strong></span>
                      <span className="ha-cs-card__diff">{cs.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Matching Scenarios Preview */}
            {themedScenarios.length > 0 && (
              <div className="ha-sc-preview">
                <div className="ha-sc-preview__label">Featured Scenarios in this Theme:</div>
                <div className="ha-sc-grid">
                  {themedScenarios.map(sc => (
                    <div key={sc._id} className="ha-sc-card">
                      <div className="ha-sc-card__top">
                        <span className="ha-sc-card__title">{sc.themeEmoji || activeOption.emoji} {sc.title}</span>
                        <span className="ha-sc-card__level">{sc.difficulty}</span>
                      </div>
                      <p className="ha-sc-card__prompt">{sc.prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div className="ha-stats">
        <div className="ha-stat">
          <div className="ha-stat__icon" style={{ background: 'rgba(168,255,62,0.12)', color: 'var(--accent)' }}>
            <CheckCircle2 size={18} />
          </div>
          <div className="ha-stat__num">{countCompleted}</div>
          <div className="ha-stat__label">Completed</div>
        </div>
        <div className="ha-stat">
          <div className="ha-stat__icon" style={{ background: 'rgba(96,165,250,0.12)', color: '#60A5FA' }}>
            <BookOpen size={18} />
          </div>
          <div className="ha-stat__num">{countTotal}</div>
          <div className="ha-stat__label">Total chapters</div>
        </div>
        <div className="ha-stat">
          <div className="ha-stat__icon" style={{ background: 'rgba(251,191,36,0.12)', color: '#FBB524' }}>
            <Flame size={18} />
          </div>
          <div className="ha-stat__num">{countPct}<span className="ha-stat__pct-sign">%</span></div>
          <div className="ha-stat__label">Progress</div>
        </div>
        <div className="ha-stat">
          <div className="ha-stat__icon" style={{ background: 'rgba(167,139,250,0.12)', color: '#A78BFA' }}>
            <Zap size={18} />
          </div>
          <div className="ha-stat__num">{countTotal - countCompleted}</div>
          <div className="ha-stat__label">Left to go</div>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────── */}
      <div className="ha-progress">
        <div className="ha-progress__top">
          <span className="ha-progress__label">Course completion</span>
          <span className="ha-progress__pct">{pct}%</span>
        </div>
        <div className="ha-progress__track">
          <div className="ha-progress__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ── Curriculum sections ───────────────────────────────── */}
      <div className="ha-sections">
        {CURRICULUM.map(section => {
          const secDone = section.chapters.filter(c => getChapterStatus(c.id) === 'completed').length;
          const secPct = Math.round((secDone / section.chapters.length) * 100);

          return (
            <div key={section.id} className="ha-section">
              <div className="ha-section__head">
                <div className="ha-section__icon" style={{ background: section.color + '20', color: section.color }}>
                  {section.emoji}
                </div>
                <div className="ha-section__meta">
                  <div className="ha-section__title" style={{ color: section.color }}>{section.title}</div>
                  <div className="ha-section__sub">{secDone} / {section.chapters.length} chapters done</div>
                </div>
                <div className="ha-section__ring">
                  <svg width="36" height="36" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="3"/>
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={section.color} strokeWidth="3"
                      strokeDasharray={`${secPct * 0.88} 88`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <span className="ha-section__ring-pct" style={{ color: section.color }}>{secPct}%</span>
                </div>
              </div>

              <div className="ha-chapter-list">
                {section.chapters.map((chapter, i) => {
                  const status = getChapterStatus(chapter.id);
                  const isDone = status === 'completed';
                  return (
                    <Link
                      key={chapter.id}
                      to={`/app/chapter/${chapter.id}`}
                      className={`ha-chapter${isDone ? ' ha-chapter--done' : ''}`}
                    >
                      <div className="ha-chapter__num" style={isDone ? { background: section.color, color: '#fff', border: 'none' } : { borderColor: section.color + '40' }}>
                        {isDone ? <CheckCircle2 size={11} /> : i + 1}
                      </div>
                      <div className="ha-chapter__body">
                        <div className="ha-chapter__name">{chapter.emoji} {chapter.title}</div>
                        <div className="ha-chapter__sub">{chapter.subtitle}</div>
                      </div>
                      <ArrowRight size={14} className="ha-chapter__arrow" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .ha { display: flex; flex-direction: column; gap: 32px; }

        /* Hero */
        .ha-hero {
          position: relative; overflow: hidden;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--bg-glass);
          backdrop-filter: blur(12px);
          padding: 36px 40px;
        }
        [data-theme="light"] .ha-hero { background: rgba(255,255,255,0.9); }
        .ha-hero__inner { position: relative; z-index: 1; }
        .ha-hero__eyebrow { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px; }
        .ha-hero__name {
          font-family: var(--font-heading); font-size: clamp(2.4rem, 6vw, 3.6rem);
          font-weight: 900; line-height: 1; margin-bottom: 14px; letter-spacing: -0.03em;
        }
        .ha-hero__message { font-size: 0.95rem; color: var(--text-secondary); max-width: 500px; margin-bottom: 28px; line-height: 1.65; }
        .ha-hero__cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 20px; border-radius: 10px;
          background: var(--accent); color: #0D1117; font-weight: 700; font-size: 0.9rem;
          text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
        }
        [data-theme="light"] .ha-hero__cta { color: #fff; }
        .ha-hero__cta:hover { transform: translateY(-2px); box-shadow: var(--shadow-glow); opacity: 1; }
        .ha-hero__cta-chapter {
          padding: 3px 10px; border-radius: 20px;
          background: rgba(0,0,0,0.2); font-size: 0.8rem; font-weight: 600;
        }
        [data-theme="light"] .ha-hero__cta-chapter { background: rgba(255,255,255,0.2); }

        /* Theme Selector Section */
        .ha-theme-selector {
          display: flex; flex-direction: column; gap: 18px;
          padding: 24px; border-radius: 16px;
          background: var(--bg-glass); border: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }
        .ha-theme-selector__header {
          display: flex; justify-content: space-between; align-items: flex-start;
          flex-wrap: wrap; gap: 12px;
        }
        .ha-theme-selector__label {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--accent); margin-bottom: 4px;
        }
        .ha-theme-selector__title { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
        .ha-theme-selector__sub { font-size: 0.84rem; color: var(--text-secondary); margin: 0; }
        .ha-active-badge {
          padding: 6px 14px; border-radius: 20px; border: 1px solid;
          font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;
        }

        .ha-theme-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
        }
        .ha-theme-card {
          padding: 16px; border-radius: 12px; border: 1px solid var(--border);
          cursor: pointer; display: flex; flex-direction: column; gap: 8px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ha-theme-card:hover { transform: translateY(-3px); border-color: var(--theme-color); }
        .ha-theme-card--active { box-shadow: 0 0 20px rgba(0,0,0,0.3); }
        .ha-theme-card__top { display: flex; justify-content: space-between; align-items: center; }
        .ha-theme-card__emoji { font-size: 1.8rem; line-height: 1; }
        .ha-theme-card__badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 12px; }
        .ha-theme-card__name { font-size: 1rem; font-weight: 800; color: var(--text-primary); margin: 2px 0 0; }
        .ha-theme-card__subtitle { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; margin: 0; }
        .ha-theme-card__desc { font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45; margin: 4px 0 8px; flex: 1; }
        .ha-theme-card__select-btn {
          width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border);
          background: rgba(255,255,255,0.05); color: var(--text-primary);
          font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }

        /* Showcase Section */
        .ha-themed-showcase {
          padding: 24px; border-radius: 16px;
          background: var(--bg-glass); border: 1px solid var(--border);
          backdrop-filter: blur(12px); display: flex; flex-direction: column; gap: 20px;
        }
        .ha-themed-showcase__header h2 { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-top: 2px; }
        .ha-themed-showcase__sub { font-size: 0.84rem; color: var(--text-secondary); margin: 4px 0 0; }
        .ha-cs-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .ha-cs-card {
          padding: 16px; border-radius: 12px; border: 1px solid var(--border);
          background: var(--bg-glass-light); display: flex; flex-direction: column; gap: 8px;
        }
        .ha-cs-card__head { display: flex; align-items: flex-start; gap: 12px; }
        .ha-cs-card__emoji { font-size: 1.6rem; flex-shrink: 0; }
        .ha-cs-card__title { font-size: 0.95rem; font-weight: 800; margin: 0 0 2px; }
        .ha-cs-card__tagline { font-size: 0.76rem; color: var(--text-muted); font-style: italic; }
        .ha-cs-card__desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }
        .ha-cs-card__arc { display: flex; justify-content: space-between; font-size: 0.74rem; color: var(--text-muted); margin-top: 4px; padding-top: 8px; border-top: 1px solid var(--border); }
        .ha-cs-card__diff { color: var(--accent); font-weight: 600; }

        .ha-sc-preview { display: flex; flex-direction: column; gap: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
        .ha-sc-preview__label { font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
        .ha-sc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .ha-sc-card { padding: 12px; border-radius: 10px; background: var(--bg-glass-light); border: 1px solid var(--border); }
        .ha-sc-card__top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .ha-sc-card__title { font-size: 0.84rem; font-weight: 700; color: var(--text-primary); }
        .ha-sc-card__level { font-size: 0.68rem; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: var(--bg-elevated); color: var(--text-muted); }
        .ha-sc-card__prompt { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45; margin: 0; }

        /* Stats */
        .ha-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .ha-stat {
          padding: 18px 16px; border-radius: 12px;
          border: 1px solid var(--border); background: var(--bg-glass);
          display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .ha-stat:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .ha-stat__icon { width: 36px; height: 36px; border-radius: 9px; display: grid; place-items: center; flex-shrink: 0; }
        .ha-stat__num { font-family: var(--font-heading); font-size: 1.9rem; font-weight: 800; color: var(--text-primary); line-height: 1; }
        .ha-stat__pct-sign { font-size: 1.1rem; }
        .ha-stat__label { font-size: 0.74rem; color: var(--text-muted); font-weight: 500; }

        /* Progress bar */
        .ha-progress { display: flex; flex-direction: column; gap: 8px; }
        .ha-progress__top { display: flex; justify-content: space-between; align-items: baseline; }
        .ha-progress__label { font-size: 0.8rem; color: var(--text-secondary); font-weight: 500; }
        .ha-progress__pct { font-size: 0.8rem; color: var(--accent); font-weight: 700; }
        .ha-progress__track { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
        .ha-progress__fill {
          height: 100%; border-radius: 3px;
          background: linear-gradient(90deg, var(--accent), #5BFFB0);
          transition: width 1s cubic-bezier(0.4,0,0.2,1);
        }

        /* Sections */
        .ha-sections { display: flex; flex-direction: column; gap: 28px; }
        .ha-section { display: flex; flex-direction: column; gap: 0; }
        .ha-section__head {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 12px; padding: 0 4px;
        }
        .ha-section__icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: grid; place-items: center; font-size: 1.2rem; flex-shrink: 0;
        }
        .ha-section__meta { flex: 1; }
        .ha-section__title { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; }
        .ha-section__sub { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
        .ha-section__ring { position: relative; display: grid; place-items: center; flex-shrink: 0; }
        .ha-section__ring-pct { position: absolute; font-size: 0.55rem; font-weight: 700; }

        /* Chapter list */
        .ha-chapter-list {
          border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
          transition: border-color 0.2s;
        }
        .ha-chapter {
          display: flex; align-items: center; gap: 14px; padding: 13px 16px;
          text-decoration: none; border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .ha-chapter:last-child { border-bottom: none; }
        .ha-chapter:hover { background: var(--bg-glass-light); }
        .ha-chapter--done { opacity: 0.8; }
        .ha-chapter__num {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: transparent; border: 1px solid var(--border);
          color: var(--text-muted); font-size: 0.68rem; font-weight: 700;
          display: grid; place-items: center; transition: all 0.2s;
        }
        .ha-chapter__body { flex: 1; min-width: 0; }
        .ha-chapter__name { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
        .ha-chapter__sub { font-size: 0.76rem; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ha-chapter__arrow { color: var(--text-muted); flex-shrink: 0; opacity: 0; transition: opacity 0.15s, transform 0.15s; }
        .ha-chapter:hover .ha-chapter__arrow { opacity: 1; transform: translateX(3px); }

        @media (max-width: 900px) {
          .ha-theme-grid { grid-template-columns: repeat(2, 1fr); }
          .ha-cs-list { grid-template-columns: 1fr; }
          .ha-sc-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .ha-stats { grid-template-columns: repeat(2,1fr); }
          .ha-hero { padding: 24px 20px; }
          .ha-theme-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
