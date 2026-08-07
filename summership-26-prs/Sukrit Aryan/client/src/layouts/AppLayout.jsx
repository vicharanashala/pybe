import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import CurriculumSidebar from '../components/CurriculumSidebar.jsx';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dashboardTheme } = useTheme();

  useEffect(() => {
    const themeToApply = dashboardTheme || 'default';
    document.documentElement.setAttribute('data-dashboard-theme', themeToApply);
    return () => {
      document.documentElement.removeAttribute('data-dashboard-theme');
    };
  }, [dashboardTheme]);

  return (
    <div className="app-layout">
      {/* Desktop sidebar */}
      <div className="app-layout__sidebar">
        <CurriculumSidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="app-layout__mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="app-layout__mobile-sidebar" onClick={e => e.stopPropagation()}>
            <CurriculumSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="app-layout__main">
        {/* Mobile header bar */}
        <div className="app-layout__mobile-bar">
          <button
            className="app-layout__burger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="app-layout__mobile-brand">🐍 Py<span>Be</span></div>
        </div>

        <div className="app-layout__content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
        }
        .app-layout__sidebar {
          width: 260px;
          flex-shrink: 0;
        }
        .app-layout__main {
          flex: 1;
          min-width: 0;
          margin-left: 260px;
          min-height: 100vh;
          background: var(--bg-base);
        }
        .app-layout__content {
          max-width: 800px;
          margin: 0;
          padding: 36px 48px 80px 44px;
        }
        @keyframes cp-spin { to { transform: rotate(360deg); } }

        /* Mobile */
        .app-layout__mobile-bar {
          display: none;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          background: rgba(13,17,23,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: sticky; top: 0; z-index: 40;
        }
        .app-layout__burger {
          background: none; border: none; color: var(--text-secondary);
          cursor: pointer; display: flex; padding: 4px;
        }
        .app-layout__mobile-brand {
          font-family: var(--font-heading);
          font-size: 1rem; font-weight: 800; color: var(--text-primary);
        }
        .app-layout__mobile-brand span { color: var(--accent); }
        .app-layout__mobile-overlay {
          position: fixed; inset: 0; z-index: 60;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
        .app-layout__mobile-sidebar {
          position: absolute; top: 0; left: 0; bottom: 0;
          width: 280px;
          background: #0F1318;
        }

        @media (max-width: 768px) {
          .app-layout__sidebar { display: none; }
          .app-layout__main { margin-left: 0; }
          .app-layout__mobile-bar { display: flex; }
          .app-layout__content { padding: 20px 18px 60px; max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
