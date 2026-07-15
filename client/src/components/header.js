/**
 * Navigation Header Component
 */

import { api } from '../lib/api.js';

const THEME_KEY = 'pybe_theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem(THEME_KEY, 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(THEME_KEY, 'dark');
  }
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark && !stored) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
}

export function createHeader() {
  initTheme();

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="header-capsule header-logo-capsule">
      <a href="#/" class="logo" aria-label="pyBE Home">
        <span class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#logo-grad)"/>
            <text x="16" y="22" text-anchor="middle" font-size="18" font-family="JetBrains Mono, monospace" font-weight="700" fill="white">py</text>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="hsl(270, 20%, 70%)"/>
                <stop offset="100%" stop-color="hsl(290, 20%, 60%)"/>
              </linearGradient>
            </defs>
          </svg>
        </span>
        <span class="logo-text">py<span class="logo-accent">BE</span></span>
      </a>
    </div>

    <div class="header-capsule header-nav-capsule">
      <nav class="header-nav" id="header-nav">
        <a href="#/" class="nav-link" data-route="/">Home</a>
        <a href="#/scenarios" class="nav-link" data-route="/scenarios">Scenarios</a>
        <a href="#/dashboard" class="nav-link" data-route="/dashboard">Dashboard</a>
        <a href="#/profile" class="nav-link" data-route="/profile">Profile</a>
        <a href="#/scenario-builder" class="nav-link" data-route="/scenario-builder">Builder</a>
        <a href="#/contributors" class="nav-link" data-route="/contributors">Contributors</a>
      </nav>
    </div>

    <div class="header-capsule header-actions-capsule">
      <button id="theme-toggle" class="header-icon-btn" title="Toggle theme" aria-label="Toggle dark/light mode">
        <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <div id="auth-nav-container"></div>

      <button id="mobile-menu-btn" class="header-icon-btn mobile-menu-btn" aria-label="Toggle menu">
        <svg class="menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <svg class="close-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  `;

  initHeaderLogic(header);

  return header;
}

function initHeaderLogic(header) {
  const mobileMenuBtn = header.querySelector('#mobile-menu-btn');
  const nav = header.querySelector('#header-nav');
  const menuIcon = header.querySelector('.menu-icon');
  const closeIcon = header.querySelector('.close-icon');
  const themeToggle = header.querySelector('#theme-toggle');
  const sunIcon = header.querySelector('.sun-icon');
  const moonIcon = header.querySelector('.moon-icon');

  function updateThemeIcon() {
    const isDark = !document.documentElement.hasAttribute('data-theme') ||
                   document.documentElement.getAttribute('data-theme') === 'dark';
    sunIcon.style.display = isDark ? 'block' : 'none';
    moonIcon.style.display = isDark ? 'none' : 'block';
  }

  updateThemeIcon();

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    nav.classList.toggle('open');
    menuIcon.style.display = isOpen ? 'block' : 'none';
    closeIcon.style.display = isOpen ? 'none' : 'block';
  });

  themeToggle?.addEventListener('click', () => {
    const isDark = !document.documentElement.hasAttribute('data-theme') ||
                   document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
    updateThemeIcon();
  });

  nav?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    });
  });

  function renderAuthNav() {
    const authContainer = header.querySelector('#auth-nav-container');
    if (api.auth.isAuthenticated()) {
      const isAdmin = localStorage.getItem('is_admin') === 'true';
      authContainer.innerHTML = `
        ${isAdmin ? '<a href="#/admin/reviews" class="header-auth-link admin-link">Admin</a>' : ''}
        <button id="notifications-btn" class="header-icon-btn notifications-btn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span id="notification-badge" class="notification-badge" style="display:none;">0</span>
        </button>
        <a href="#/" id="logout-link" class="header-auth-link" title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </a>
      `;
      authContainer.querySelector('#logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        api.auth.logout();
        localStorage.removeItem('user_id');
        localStorage.removeItem('is_admin');
        window.location.hash = '#/login';
      });

      loadNotificationCount();

      const oldDropdown = document.getElementById('notification-dropdown');
      if (oldDropdown) {
        oldDropdown.remove();
      }

      const notificationsBtn = document.getElementById('notifications-btn');
      if (notificationsBtn) {
        import('./NotificationDropdown.js').then(m => {
          m.createNotificationDropdown(notificationsBtn);
        });
      }
    } else {
      authContainer.innerHTML = `
        <a href="#/login" class="header-auth-link">Login</a>
      `;
    }
  }

  async function loadNotificationCount() {
    try {
      const data = await api.notifications.get(true);
      const badge = document.getElementById('notification-badge');
      if (badge && data && data.unreadCount > 0) {
        badge.textContent = data.unreadCount > 9 ? '9+' : data.unreadCount;
        badge.style.display = 'flex';
      }
    } catch (e) {
      // Silently fail - notifications are not critical
    }
  }

  function updateActiveLink() {
    const hash = window.location.hash.slice(1) || '/';
    header.querySelectorAll('.nav-link').forEach(link => {
      const route = link.dataset.route;
      if (hash === route || (route === '/scenarios' && hash.startsWith('/scenario'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('hashchange', () => {
    updateActiveLink();
    renderAuthNav();
  });

  requestAnimationFrame(() => {
    updateActiveLink();
    renderAuthNav();
  });
}
