/**
 * pyBE Main Application Entry Point
 * =====================================
 * Bootstraps the SPA: mounts header, initializes router, sets up routes.
 */

import './style.css';
import './new-features.css';
import './animations.css';
import 'prismjs/themes/prism-tomorrow.css';

import { Router } from './lib/router.js';
import { createHeader } from './components/header.js';
import { showIntro, initIntroStyles } from './components/IntroScreen.js';
import { renderHome } from './pages/home.js';
import { renderScenarios } from './pages/scenarios.js';
import { renderScenarioDetail } from './pages/scenario-detail.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderScenarioBuilder } from './pages/scenario-builder.js';
import { renderGamification } from './pages/gamification.js';
import { renderAdminReviewDashboard } from './pages/admin-review.js';

// ---------------------------------------------------------------------------
// Toast Notification System
// ---------------------------------------------------------------------------

const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
toastContainer.style.cssText = `
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
`;
document.body.appendChild(toastContainer);

export function showToast(message, type = 'info', duration = 4000) {
  const toast = document.createElement('div');
  const colors = {
    success: 'hsl(140, 30%, 55%)',
    error: 'hsl(0, 20%, 60%)',
    warning: 'hsl(35, 25%, 55%)',
    info: 'hsl(270, 20%, 65%)'
  };
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.style.cssText = `
    background: var(--bg-surface-elevated);
    border: 1px solid ${colors[type]};
    border-left: 4px solid ${colors[type]};
    color: var(--text-primary);
    padding: 12px 16px;
    border-radius: var(--radius-md);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastIn 0.3s ease-out;
    font-size: 0.875rem;
  `;

  toast.innerHTML = `
    <span style="color: ${colors[type]}; font-weight: 700; font-size: 1rem;">${icons[type]}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100px); }
  }
`;
document.head.appendChild(toastStyle);

// Make showToast globally available
window.showToast = showToast;

// ---------------------------------------------------------------------------
// Skip to Content Link (Accessibility)
// ---------------------------------------------------------------------------

const skipLink = document.createElement('a');
skipLink.href = '#page-mount';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
  position: fixed;
  top: -100px;
  left: 20px;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  z-index: 10000;
  font-weight: 600;
  font-size: 0.875rem;
  transition: top 0.3s;
`;
skipLink.addEventListener('focus', () => {
  skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-100px';
});
document.body.prepend(skipLink);

// ---------------------------------------------------------------------------
// App shell
// ---------------------------------------------------------------------------

const app = document.getElementById('app');

// Create the layout structure
app.innerHTML = `
  <div id="header-mount"></div>
  <div id="page-mount"></div>
  <footer class="site-footer">
    <div class="footer-inner">
      <p>py<span class="logo-accent">BE</span> Philosophy × Python × Code</p>
      <p class="footer-sub">A philosophical learning platform</p>
    </div>
  </footer>
`;

// Mount the header
const headerMount = document.getElementById('header-mount');
const header = createHeader();
headerMount.appendChild(header);

// Page mount target
const pageMount = document.getElementById('page-mount');

// ---------------------------------------------------------------------------
// Page Transitions
// ---------------------------------------------------------------------------

let isNavigating = false;

function transitionPage(callback) {
  if (isNavigating) return;
  isNavigating = true;

  // Exit animation - fade out with slight blur
  pageMount.style.opacity = '0';
  pageMount.style.transform = 'translateY(-10px) scale(0.98)';
  pageMount.style.filter = 'blur(4px)';
  pageMount.style.transition = 'opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out';

  setTimeout(() => {
    callback();

    // Enter animation - fade in with scale and blur clear
    pageMount.style.opacity = '1';
    pageMount.style.transform = 'translateY(0) scale(1)';
    pageMount.style.filter = 'blur(0)';
    pageMount.style.transition = 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1), filter 300ms ease-out';

    isNavigating = false;

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Initialize scroll reveal for new content
    setTimeout(initScrollReveal, 100);

    // Announce page change for screen readers
    announcePageChange();
  }, 150);
}

// Accessibility: Announce page changes
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); border: 0;';
document.body.appendChild(liveRegion);

function announcePageChange() {
  const pageTitle = document.querySelector('.page-title, .hero-title, h1');
  if (pageTitle) {
    liveRegion.textContent = `Navigated to ${pageTitle.textContent}`;
  }
}

// ---------------------------------------------------------------------------
// Keyboard Shortcuts
// ---------------------------------------------------------------------------

document.addEventListener('keydown', (e) => {
  // ESC to close modals/dropdowns
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal, .dropdown, .notification-dropdown').forEach(el => {
      el.remove();
    });
    document.getElementById('header-nav')?.classList.remove('open');
  }

  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    window.location.hash = '#/scenarios';
    setTimeout(() => {
      document.querySelector('.search-input, #search-input')?.focus();
    }, 300);
  }

  // Ctrl/Cmd + / for keyboard shortcuts help
  if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    showToast('Keyboard shortcuts: Ctrl+K = Search, ESC = Close, Tab = Navigate', 'info');
  }
});

// Focus trap for modals
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });

  firstFocusable?.focus();
}

// Make trapFocus globally available
window.trapFocus = trapFocus;

// ---------------------------------------------------------------------------
// Scroll Reveal System
// ---------------------------------------------------------------------------

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-fade, .reveal-left');

  if (revealElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Make initScrollReveal globally available
window.initScrollReveal = initScrollReveal;

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const router = new Router(pageMount);

router
  .on('/', () => {
    transitionPage(() => renderHome(pageMount));
  })
  .on('/scenarios', () => {
    transitionPage(() => renderScenarios(pageMount));
  })
  .on('/scenario/:id', (params) => {
    transitionPage(() => renderScenarioDetail(pageMount, params));
  })
  .on('/login', () => {
    transitionPage(() => renderLogin(pageMount));
  })
  .on('/register', () => {
    transitionPage(() => renderRegister(pageMount));
  })
  .on('/dashboard', () => {
    transitionPage(() => renderDashboard(pageMount));
  })
  .on('/scenario-builder', () => {
    transitionPage(() => renderScenarioBuilder(pageMount));
  })
  .on('/profile', () => {
    transitionPage(() => renderGamification(pageMount));
  })
  .on('/contributors', () => {
    transitionPage(() => {
      import('./pages/contributor-leaderboard.js').then(m => {
        m.renderContributorLeaderboard(pageMount);
      });
    });
  })
  .on('/admin/reviews', () => {
    transitionPage(() => renderAdminReviewDashboard(pageMount));
  });

// Trigger initial route resolution
if (!window.location.hash) {
  window.location.hash = '#/';
}

// ---------------------------------------------------------------------------
// Mobile Menu Backdrop
// ---------------------------------------------------------------------------

const menuBackdrop = document.createElement('div');
menuBackdrop.id = 'menu-backdrop';
menuBackdrop.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 98;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
`;
document.body.appendChild(menuBackdrop);

// Get the already-mounted header and attach mobile menu handlers
const headerEl = headerMount.firstElementChild;
const menuBtn = headerEl?.querySelector('#mobile-menu-btn');
const nav = headerEl?.querySelector('#header-nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    menuBackdrop.style.opacity = isOpen ? '0' : '1';
    menuBackdrop.style.pointerEvents = isOpen ? 'none' : 'auto';
  });
}

// Close menu on backdrop click
menuBackdrop.addEventListener('click', () => {
  nav?.classList.remove('open');
  menuBackdrop.style.opacity = '0';
  menuBackdrop.style.pointerEvents = 'none';
});

// ---------------------------------------------------------------------------
// Celebration System (Confetti)
// ---------------------------------------------------------------------------

function showConfetti(options = {}) {
  const {
    x = window.innerWidth / 2,
    y = window.innerHeight / 3,
    count = 30,
    colors = ['hsl(270, 20%, 72%)', 'hsl(200, 18%, 65%)', 'hsl(140, 30%, 60%)', 'hsl(35, 25%, 65%)'],
    duration = 1500
  } = options;

  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${x + (Math.random() - 0.5) * 200}px;
      top: ${y}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      transform: rotate(${Math.random() * 360}deg);
      animation-delay: ${Math.random() * 300}ms;
      animation-duration: ${duration}ms;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), duration + 500);
}

// Make showConfetti globally available
window.showConfetti = showConfetti;

// ---------------------------------------------------------------------------
// XP Float Animation
// ---------------------------------------------------------------------------

function showXpFloat(element, amount) {
  const rect = element.getBoundingClientRect();
  const float = document.createElement('span');
  float.className = 'xp-float';
  float.textContent = `+${amount} XP`;
  float.style.left = `${rect.left + rect.width / 2}px`;
  float.style.top = `${rect.top}px`;
  document.body.appendChild(float);

  setTimeout(() => float.remove(), 1000);
}

// Make showXpFloat globally available
window.showXpFloat = showXpFloat;

// ---------------------------------------------------------------------------
// Initialize scroll reveal on first load
// ---------------------------------------------------------------------------

let appReady = false;

function init() {
  // Mark app as ready
  appReady = true;

  // Show intro if not shown
  const introShown = sessionStorage.getItem('pybe_intro_shown');

  if (!introShown) {
    sessionStorage.setItem('pybe_intro_shown', 'true');
    showIntro(() => {
      navigateToHome();
    });
  } else {
    navigateToHome();
  }
}

function navigateToHome() {
  if (!window.location.hash) {
    window.location.hash = '#/';
  }
  window.dispatchEvent(new Event('hashchange'));
}

// Run immediately when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}