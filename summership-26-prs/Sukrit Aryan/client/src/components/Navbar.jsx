import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Brain, BookOpen, LayoutDashboard, Map, Sparkles, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',            label: 'Home',         icon: Brain       },
  { to: '/scenarios',   label: 'Scenarios',    icon: BookOpen    },
  { to: '/case-studies',label: 'Case Studies', icon: Sparkles    },
  { to: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/roadmap',     label: 'Roadmap',      icon: Map         },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar__inner container">
          {/* Brand */}
          <NavLink to="/" className="navbar__brand">
            <div className="navbar__logo">
              <Brain size={20} strokeWidth={2.5} />
            </div>
            <span className="navbar__wordmark">
              Py<span className="navbar__accent">Be</span>
            </span>
            <span className="navbar__version">v2.0</span>
          </NavLink>

          {/* Desktop links */}
          <ul className="navbar__links">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA + burger */}
          <div className="navbar__actions">
            <NavLink to="/scenarios" className="btn btn-primary btn-sm">
              Start Learning
            </NavLink>
            <button
              className="navbar__burger btn btn-ghost btn-sm"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="navbar__drawer">
          <ul className="navbar__drawer-links">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `navbar__drawer-link${isActive ? ' navbar__drawer-link--active' : ''}`}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: var(--navbar-h);
          display: flex;
          align-items: center;
          border-bottom: 1px solid transparent;
          transition: background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
        }
        .navbar--scrolled {
          background: rgba(13,17,23,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-color: var(--border);
        }
        .navbar__inner {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--sp-6);
        }
        .navbar__brand {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar__logo {
          width: 34px; height: 34px;
          background: var(--accent-glow);
          border: 1px solid var(--border-accent);
          border-radius: var(--r-sm);
          display: grid;
          place-items: center;
          color: var(--accent);
        }
        .navbar__wordmark {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .navbar__accent { color: var(--accent); }
        .navbar__version {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--text-muted);
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 2px 6px;
          border-radius: var(--r-full);
        }
        .navbar__links {
          display: flex;
          list-style: none;
          gap: 4px;
          flex: 1;
        }
        .navbar__link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--r-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--t-fast), background var(--t-fast);
        }
        .navbar__link:hover { color: var(--text-primary); background: var(--bg-glass-light); }
        .navbar__link--active { color: var(--accent); background: var(--accent-glow); }
        .navbar__actions { display: flex; align-items: center; gap: var(--sp-2); margin-left: auto; }
        .navbar__burger { display: none; }

        /* Mobile drawer */
        .navbar__drawer {
          position: fixed;
          top: var(--navbar-h);
          left: 0; right: 0;
          background: rgba(13,17,23,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          z-index: 99;
          animation: fadeIn 0.2s ease;
        }
        .navbar__drawer-links {
          list-style: none;
          padding: var(--sp-4) var(--sp-6);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .navbar__drawer-link {
          display: flex;
          align-items: center;
          gap: var(--sp-3);
          padding: 10px 12px;
          border-radius: var(--r-sm);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--t-fast), background var(--t-fast);
        }
        .navbar__drawer-link:hover { color: var(--text-primary); background: var(--bg-glass-light); }
        .navbar__drawer-link--active { color: var(--accent); background: var(--accent-glow); }

        @media (max-width: 768px) {
          .navbar__links { display: none; }
          .navbar__burger { display: flex; }
          .navbar__actions .btn-primary { display: none; }
        }
      `}</style>
    </>
  );
}
