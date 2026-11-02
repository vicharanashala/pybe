import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon, ArrowRight } from 'lucide-react';

export default function PublicNavbar() {
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  function scrollToSection(sectionId) {
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="pub-nav">
      <div className="pub-nav__inner container">
        <Link to="/" className="pub-nav__brand">
          <span className="pub-nav__logo">🐍</span>
          <div>
            <span className="pub-nav__name">Py<span>Be</span></span>
            <span className="pub-nav__tag">Discovery Platform</span>
          </div>
        </Link>

        {/* Working smooth-scroll navigation links */}
        <nav className="pub-nav__links">
          <button onClick={() => scrollToSection('methodology')} className="pub-nav__link-btn">
            Methodology
          </button>
          <button onClick={() => scrollToSection('syllabus')} className="pub-nav__link-btn">
            Syllabus
          </button>
          <button onClick={() => scrollToSection('themes')} className="pub-nav__link-btn">
            Case Studies
          </button>
          <button onClick={() => scrollToSection('features')} className="pub-nav__link-btn">
            Why PyBe
          </button>
        </nav>

        <div className="pub-nav__actions">
          <button
            className="pub-nav__theme-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="pub-nav__theme-txt">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          {location.pathname !== '/login' && (
            <Link to="/login" className="btn btn-ghost btn-sm pub-nav__login">
              Sign In
            </Link>
          )}

          {location.pathname !== '/signup' && (
            <Link to="/signup" className="btn btn-primary btn-sm pub-nav__signup">
              Get Started <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .pub-nav {
          position: fixed; top: 0; left: 0; right: 0;
          height: var(--navbar-h); z-index: 100;
          background: var(--bg-glass);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: background-color 0.25s, border-color 0.25s;
        }
        .pub-nav__inner {
          height: 100%; display: flex; align-items: center; justify-content: space-between;
        }
        .pub-nav__brand {
          display: flex; align-items: center; gap: 10px; text-decoration: none;
        }
        .pub-nav__logo { font-size: 1.6rem; line-height: 1; animation: emoji-float 4s ease-in-out infinite; }
        .pub-nav__name {
          font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800;
          color: var(--text-primary); line-height: 1;
        }
        .pub-nav__name span { color: var(--accent); }
        .pub-nav__tag {
          display: block; font-size: 0.6rem; color: var(--text-muted);
          letter-spacing: 0.05em; margin-top: 2px; text-transform: uppercase; font-weight: 600;
        }
        .pub-nav__links { display: flex; align-items: center; gap: 24px; }
        .pub-nav__link-btn {
          background: none; border: none; padding: 0; cursor: pointer;
          font-size: 0.86rem; font-weight: 500; color: var(--text-secondary);
          transition: color 0.15s; font-family: inherit;
        }
        .pub-nav__link-btn:hover { color: var(--text-primary); }
        .pub-nav__actions { display: flex; align-items: center; gap: 12px; }
        .pub-nav__theme-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 20px;
          background: var(--bg-glass-light); border: 1px solid var(--border);
          color: var(--text-secondary); font-size: 0.78rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .pub-nav__theme-btn:hover {
          color: var(--text-primary); border-color: var(--border-hover);
          background: var(--bg-elevated);
        }
        @media (max-width: 768px) {
          .pub-nav__links { display: none; }
          .pub-nav__theme-txt { display: none; }
        }
      `}</style>
    </header>
  );
}
