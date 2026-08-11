import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { CURRICULUM, ALL_CHAPTERS } from '../data/curriculum.js';
import {
  LogOut, ChevronDown, ChevronRight,
  LayoutDashboard, Check, Circle, Sun, Moon,
} from 'lucide-react';

export default function CurriculumSidebar({ onNavigate }) {
  const { user, logout, getChapterStatus, getProgress } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [openSections, setOpenSections] = useState(() =>
    Object.fromEntries(CURRICULUM.map(s => [s.id, true]))
  );

  const progress = getProgress();
  const completedCount = Object.values(progress).filter(p => p.status === 'completed').length;
  const totalChapters = ALL_CHAPTERS.length;
  const pct = Math.round((completedCount / totalChapters) * 100);

  useEffect(() => {
    const items = sidebarRef.current?.querySelectorAll('.sb-chapter-link');
    if (!items?.length) return;
    gsap.from(items, { x: -16, opacity: 0, duration: 0.35, stagger: 0.035, ease: 'power2.out', delay: 0.1 });
  }, []);

  function toggleSection(id) {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const statusIcon = (status) => {
    if (status === 'completed') return <Check size={13} className="sb-status sb-status--done" />;
    return <Circle size={13} className="sb-status sb-status--open" />;
  };

  return (
    <aside className="sidebar" ref={sidebarRef}>

      {/* Brand */}
      <div className="sb-brand">
        <div className="sb-brand__orb">🐍</div>
        <div>
          <div className="sb-brand__name">Py<span>Be</span></div>
          <div className="sb-brand__version">v2.1 · Python Discovery</div>
        </div>
      </div>

      {/* User chip */}
      <div className="sb-user">
        <div className="sb-user__avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
        <div className="sb-user__info">
          <div className="sb-user__name">{user?.name}</div>
          <div className="sb-user__email">{user?.email}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="sb-progress">
        <div className="sb-progress__header">
          <span>Overall Progress</span>
          <span className="sb-progress__pct">{completedCount}/{totalChapters}</span>
        </div>
        <div className="sb-progress__track">
          <div className="sb-progress__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="sb-divider" />

      {/* Dashboard */}
      <NavLink
        to="/app" end
        className={({ isActive }) => `sb-nav-link${isActive ? ' sb-nav-link--active' : ''}`}
        onClick={onNavigate}
      >
        <LayoutDashboard size={15} />
        My Dashboard
      </NavLink>

      <div className="sb-divider" style={{ margin: '6px 0' }} />
      <div className="sb-section-label">Syllabus</div>

      {/* Curriculum */}
      <nav className="sb-curriculum">
        {CURRICULUM.map(section => (
          <div key={section.id} className="sb-section">
            <button
              className="sb-section-header"
              onClick={() => toggleSection(section.id)}
              style={{ '--sec-color': section.color }}
            >
              <span className="sb-section-dot" style={{ background: section.color }} />
              <span className="sb-section-emoji">{section.emoji}</span>
              <span className="sb-section-title">{section.title}</span>
              <span className="sb-section-chevron">
                {openSections[section.id] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </span>
            </button>

            {openSections[section.id] && (
              <div className="sb-chapters">
                {section.chapters.map(chapter => {
                  const status = getChapterStatus(chapter.id);
                  const isDone = status === 'completed';
                  return (
                    <NavLink
                      key={chapter.id}
                      to={`/app/chapter/${chapter.id}`}
                      className={({ isActive }) =>
                        `sb-chapter-link${isActive ? ' sb-chapter-link--active' : ''}${isDone ? ' sb-chapter-link--done' : ''}`
                      }
                      onClick={onNavigate}
                    >
                      <span className="sb-chapter-icon">{chapter.emoji}</span>
                      <span className="sb-chapter-title">{chapter.title}</span>
                      {statusIcon(status)}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="sb-bottom">
        {/* Theme toggle */}
        <button className="sb-theme-btn" onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark
            ? <><Sun size={14} /> Light mode</>
            : <><Moon size={14} /> Dark mode</>
          }
        </button>
        <button className="sb-logout" onClick={handleLogout}>
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px; height: 100vh;
          position: fixed; top: 0; left: 0;
          display: flex; flex-direction: column;
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          overflow-y: auto; overflow-x: hidden;
          z-index: 50;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        /* Brand */
        .sb-brand {
          display: flex; align-items: center; gap: 11px;
          padding: 20px 16px 14px; flex-shrink: 0;
        }
        .sb-brand__orb {
          font-size: 1.65rem; line-height: 1;
          animation: emoji-float 4s ease-in-out infinite;
        }
        .sb-brand__name {
          font-family: var(--font-heading); font-size: 1.15rem;
          font-weight: 800; color: var(--text-primary); line-height: 1;
        }
        .sb-brand__name span { color: var(--accent); }
        .sb-brand__version { font-size: 0.6rem; color: var(--text-muted); margin-top: 3px; letter-spacing: 0.04em; }

        /* User */
        .sb-user {
          display: flex; align-items: center; gap: 10px;
          margin: 0 10px 12px; padding: 10px 12px;
          background: var(--bg-glass-light);
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: background 0.25s ease;
        }
        .sb-user__avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--accent); color: #0D1117;
          font-weight: 800; font-size: 0.8rem;
          display: grid; place-items: center; flex-shrink: 0;
        }
        [data-theme="light"] .sb-user__avatar { color: #fff; }
        .sb-user__info { min-width: 0; }
        .sb-user__name { font-size: 0.84rem; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-user__email { font-size: 0.68rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Progress */
        .sb-progress { padding: 0 14px 12px; flex-shrink: 0; }
        .sb-progress__header { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted); margin-bottom: 7px; }
        .sb-progress__pct { color: var(--accent); font-weight: 700; }
        .sb-progress__track { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
        .sb-progress__fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.7s cubic-bezier(0.4,0,0.2,1); }

        .sb-divider { height: 1px; background: var(--border); margin: 0 14px; flex-shrink: 0; }
        .sb-section-label { padding: 10px 18px 5px; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); }

        /* Nav link */
        .sb-nav-link {
          display: flex; align-items: center; gap: 9px;
          margin: 2px 8px; padding: 8px 10px; border-radius: 8px;
          font-size: 0.84rem; font-weight: 500; color: var(--text-secondary);
          text-decoration: none; transition: background 0.15s, color 0.15s;
        }
        .sb-nav-link:hover { background: var(--bg-glass-light); color: var(--text-primary); opacity: 1; }
        .sb-nav-link--active { background: var(--accent-glow) !important; color: var(--accent) !important; }

        /* Curriculum sections */
        .sb-curriculum { flex: 1; padding-bottom: 8px; }
        .sb-section { margin-bottom: 1px; }
        .sb-section-header {
          width: 100%; display: flex; align-items: center; gap: 7px;
          padding: 7px 16px; background: transparent; border: none; cursor: pointer;
          color: var(--text-secondary); transition: color 0.15s; text-align: left;
        }
        .sb-section-header:hover { color: var(--text-primary); }
        .sb-section-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; opacity: 0.7; }
        .sb-section-emoji { font-size: 0.85rem; }
        .sb-section-title { flex: 1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
        .sb-section-chevron { color: var(--text-muted); }

        /* Chapters */
        .sb-chapters { padding: 1px 0 3px; }
        .sb-chapter-link {
          display: flex; align-items: center; gap: 8px;
          margin: 1px 8px; padding: 7px 10px; border-radius: 8px;
          font-size: 0.83rem; font-weight: 500; color: var(--text-muted);
          text-decoration: none; transition: background 0.15s, color 0.15s;
        }
        .sb-chapter-link:hover { background: var(--bg-glass-light); color: var(--text-secondary); opacity: 1; }
        .sb-chapter-link--active {
          background: var(--accent-glow) !important;
          color: var(--accent) !important;
          font-weight: 600;
        }
        .sb-chapter-link--done { color: var(--text-secondary) !important; }
        .sb-chapter-icon { font-size: 0.85rem; flex-shrink: 0; }
        .sb-chapter-title { flex: 1; line-height: 1.25; }
        .sb-status { flex-shrink: 0; }
        .sb-status--done { color: var(--accent); }
        .sb-status--open { color: var(--border); }

        /* Bottom */
        .sb-bottom {
          flex-shrink: 0; padding: 10px 10px 18px;
          border-top: 1px solid var(--border); margin-top: auto;
          display: flex; flex-direction: column; gap: 2px;
        }
        .sb-theme-btn {
          width: 100%; display: flex; align-items: center; gap: 9px;
          padding: 8px 12px; border-radius: 8px; border: none;
          background: transparent; color: var(--text-muted);
          font-size: 0.83rem; font-weight: 500; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .sb-theme-btn:hover { background: var(--bg-glass-light); color: var(--text-primary); }
        .sb-logout {
          width: 100%; display: flex; align-items: center; gap: 9px;
          padding: 8px 12px; border-radius: 8px; border: none;
          background: transparent; color: var(--text-muted);
          font-size: 0.83rem; font-weight: 500; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .sb-logout:hover { background: rgba(244,114,182,0.08); color: #F472B6; }
      `}</style>
    </aside>
  );
}
