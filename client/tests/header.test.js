/**
 * Header Component Tests
 * ======================
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createHeader } from '../src/components/header.js';

const mockApi = {
  auth: {
    isAuthenticated: vi.fn(),
    getToken: vi.fn(),
    logout: vi.fn()
  },
  notifications: {
    get: vi.fn()
  }
};

vi.mock('../src/lib/api.js', () => ({
  api: mockApi
}));

describe('createHeader', () => {
  let header;

  beforeEach(() => {
    vi.spyOn(localStorage.__proto__, 'getItem').mockImplementation((key) => {
      const storage = { theme: 'dark' };
      return storage[key];
    });
    vi.spyOn(localStorage.__proto__, 'setItem').mockImplementation(() => {});

    mockApi.auth.isAuthenticated.mockReturnValue(false);
    mockApi.notifications.get.mockResolvedValue({ unreadCount: 0 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (header && header.parentNode) {
      header.parentNode.removeChild(header);
    }
  });

  describe('basic structure', () => {
    it('should create a header element', () => {
      header = createHeader();
      expect(header).toBeDefined();
      expect(header.tagName).toBe('HEADER');
    });

    it('should have site-header class', () => {
      header = createHeader();
      expect(header.className).toContain('site-header');
    });

    it('should have logo with link to home', () => {
      header = createHeader();
      const logo = header.querySelector('.logo');
      expect(logo).toBeDefined();
      expect(logo.getAttribute('href')).toBe('#/');
    });

    it('should have logo text', () => {
      header = createHeader();
      const logoText = header.querySelector('.logo-text');
      expect(logoText).toBeDefined();
      expect(logoText.textContent).toContain('py');
    });
  });

  describe('navigation', () => {
    it('should have nav element', () => {
      header = createHeader();
      const nav = header.querySelector('.header-nav');
      expect(nav).toBeDefined();
    });

    it('should have nav links', () => {
      header = createHeader();
      const navLinks = header.querySelectorAll('.nav-link');
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it('should have link to home', () => {
      header = createHeader();
      const homeLink = header.querySelector('[data-route="/"]');
      expect(homeLink).toBeDefined();
    });

    it('should have link to scenarios', () => {
      header = createHeader();
      const scenariosLink = header.querySelector('[data-route="/scenarios"]');
      expect(scenariosLink).toBeDefined();
    });

    it('should have link to dashboard', () => {
      header = createHeader();
      const dashboardLink = header.querySelector('[data-route="/dashboard"]');
      expect(dashboardLink).toBeDefined();
    });

    it('should have link to profile', () => {
      header = createHeader();
      const profileLink = header.querySelector('[data-route="/profile"]');
      expect(profileLink).toBeDefined();
    });

    it('should have link to scenario builder', () => {
      header = createHeader();
      const builderLink = header.querySelector('[data-route="/scenario-builder"]');
      expect(builderLink).toBeDefined();
    });

    it('should have link to contributors', () => {
      header = createHeader();
      const contributorsLink = header.querySelector('[data-route="/contributors"]');
      expect(contributorsLink).toBeDefined();
    });
  });

  describe('mobile menu', () => {
    it('should have mobile menu button', () => {
      header = createHeader();
      const mobileMenuBtn = header.querySelector('#mobile-menu-btn');
      expect(mobileMenuBtn).toBeDefined();
    });

    it('should have menu icon', () => {
      header = createHeader();
      const menuIcon = header.querySelector('.menu-icon');
      expect(menuIcon).toBeDefined();
    });

    it('should have close icon', () => {
      header = createHeader();
      const closeIcon = header.querySelector('.close-icon');
      expect(closeIcon).toBeDefined();
    });
  });

  describe('theme toggle', () => {
    it('should have theme toggle button', () => {
      header = createHeader();
      const themeToggle = header.querySelector('#theme-toggle');
      expect(themeToggle).toBeDefined();
    });

    it('should have sun icon', () => {
      header = createHeader();
      const sunIcon = header.querySelector('.sun-icon');
      expect(sunIcon).toBeDefined();
    });

    it('should have moon icon', () => {
      header = createHeader();
      const moonIcon = header.querySelector('.moon-icon');
      expect(moonIcon).toBeDefined();
    });
  });

  describe('auth navigation', () => {
    it('should show login link when not authenticated', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(false);
      header = createHeader();

      const loginLink = header.querySelector('a[href="#/login"]');
      expect(loginLink).toBeDefined();
    });

    it('should show notifications button when authenticated', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);
      localStorage.getItem = vi.fn((key) => {
        if (key === 'is_admin') return 'false';
        return null;
      });
      header = createHeader();

      const notificationsBtn = header.querySelector('#notifications-btn');
      expect(notificationsBtn).toBeDefined();
    });

    it('should show logout link when authenticated', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);
      localStorage.getItem = vi.fn((key) => {
        if (key === 'is_admin') return 'false';
        return null;
      });
      header = createHeader();

      const logoutLink = header.querySelector('#logout-link');
      expect(logoutLink).toBeDefined();
    });

    it('should call logout on logout link click', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);
      localStorage.getItem = vi.fn((key) => {
        if (key === 'is_admin') return 'false';
        return null;
      });
      header = createHeader();

      const logoutLink = header.querySelector('#logout-link');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: { closest: () => logoutLink } });
      logoutLink.dispatchEvent(clickEvent);

      expect(mockApi.auth.logout).toHaveBeenCalled();
    });
  });

  describe('notification badge', () => {
    it('should load notification count when authenticated', async () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);
      localStorage.getItem = vi.fn((key) => {
        if (key === 'is_admin') return 'false';
        return null;
      });
      mockApi.notifications.get.mockResolvedValue({ unreadCount: 3 });

      header = createHeader();
      await new Promise(resolve => setTimeout(resolve, 100));

      const badge = header.querySelector('#notification-badge');
      expect(badge).toBeDefined();
    });
  });

  describe('active link highlighting', () => {
    it('should mark active link based on current hash', () => {
      window.location.hash = '#/scenarios';
      header = createHeader();

      const activeLink = header.querySelector('.nav-link.active');
      expect(activeLink).toBeDefined();
    });
  });

  describe('logo structure', () => {
    it('should have logo icon', () => {
      header = createHeader();
      const logoIcon = header.querySelector('.logo-icon');
      expect(logoIcon).toBeDefined();
    });

    it('should have SVG in logo icon', () => {
      header = createHeader();
      const svg = header.querySelector('.logo-icon svg');
      expect(svg).toBeDefined();
    });

    it('should have logo accent span', () => {
      header = createHeader();
      const logoAccent = header.querySelector('.logo-accent');
      expect(logoAccent).toBeDefined();
      expect(logoAccent.textContent).toBe('BE');
    });
  });

  describe('header inner structure', () => {
    it('should have header-inner container', () => {
      header = createHeader();
      const headerInner = header.querySelector('.header-inner');
      expect(headerInner).toBeDefined();
    });

    it('should have header-accent container', () => {
      header = createHeader();
      const headerAccent = header.querySelector('.header-accent');
      expect(headerAccent).toBeDefined();
    });
  });

  describe('admin link', () => {
    it('should show admin link when user is admin', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);
      localStorage.getItem = vi.fn((key) => {
        if (key === 'is_admin') return 'true';
        return null;
      });
      header = createHeader();

      const adminLink = header.querySelector('.admin-link');
      expect(adminLink).toBeDefined();
      expect(adminLink.getAttribute('href')).toBe('#/admin/reviews');
    });
  });
});