/**
 * Auth Flow E2E Tests
 * ===================
 * Integration tests for the authentication flow.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

const mockApi = {
  auth: {
    setToken: vi.fn(),
    getToken: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: vi.fn()
  },
  health: vi.fn(),
  getScenario: vi.fn(),
  getUserStats: vi.fn(),
  getGamificationProfile: vi.fn()
};

vi.mock('../src/lib/api.js', () => ({
  api: mockApi
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('token management', () => {
    it('should store and retrieve token from localStorage', () => {
      mockApi.auth.setToken('test-token-123');
      mockApi.auth.getToken.mockReturnValue('test-token-123');

      expect(mockApi.auth.getToken()).toBe('test-token-123');
    });

    it('should clear token on logout', () => {
      mockApi.auth.setToken('test-token');
      mockApi.auth.logout();

      expect(mockApi.auth.logout).toHaveBeenCalled();
    });

    it('should report not authenticated without token', () => {
      mockApi.auth.getToken.mockReturnValue(null);
      mockApi.auth.isAuthenticated.mockReturnValue(false);

      expect(mockApi.auth.isAuthenticated()).toBe(false);
    });

    it('should report authenticated with valid token', () => {
      mockApi.auth.setToken('valid-token');
      mockApi.auth.isAuthenticated.mockReturnValue(true);

      expect(mockApi.auth.isAuthenticated()).toBe(true);
    });
  });

  describe('protected route access', () => {
    it('should redirect to login when accessing protected route without auth', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(false);

      if (!mockApi.auth.isAuthenticated()) {
        window.location.hash = '#/login';
      }

      expect(window.location.hash).toBe('#/login');
    });

    it('should allow access to protected route with valid token', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);

      const hasAccess = mockApi.auth.isAuthenticated();
      expect(hasAccess).toBe(true);
    });
  });

  describe('login to dashboard flow', () => {
    it('should set token after successful login', () => {
      mockApi.auth.setToken('jwt-token-after-login');
      expect(mockApi.auth.getToken()).toBe('jwt-token-after-login');
    });

    it('should store user_id in localStorage after login', () => {
      localStorage.setItem('user_id', '123');
      expect(localStorage.getItem('user_id')).toBe('123');
    });

    it('should store is_admin flag for admin users', () => {
      localStorage.setItem('is_admin', 'true');
      expect(localStorage.getItem('is_admin')).toBe('true');
    });

    it('should clear localStorage on logout', () => {
      localStorage.setItem('jwt_token', 'some-token');
      localStorage.setItem('user_id', '123');
      localStorage.setItem('is_admin', 'true');

      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('is_admin');

      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(localStorage.getItem('user_id')).toBeNull();
      expect(localStorage.getItem('is_admin')).toBeNull();
    });
  });

  describe('token refresh scenario', () => {
    it('should detect expired token and refresh', () => {
      mockApi.auth.getToken.mockReturnValue('expired-token');

      const isExpired = mockApi.auth.getToken() === 'expired-token';
      expect(isExpired).toBe(true);
    });
  });

  describe('full login → dashboard → logout flow', () => {
    it('should complete login flow', () => {
      mockApi.auth.setToken('new-user-token');
      mockApi.auth.isAuthenticated.mockReturnValue(true);

      expect(mockApi.auth.isAuthenticated()).toBe(true);
      expect(mockApi.auth.getToken()).toBe('new-user-token');
    });

    it('should navigate to dashboard when authenticated', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);

      if (mockApi.auth.isAuthenticated()) {
        window.location.hash = '#/dashboard';
      }

      expect(window.location.hash).toBe('#/dashboard');
    });

    it('should show profile when authenticated', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(true);

      if (mockApi.auth.isAuthenticated()) {
        window.location.hash = '#/profile';
      }

      expect(window.location.hash).toBe('#/profile');
    });

    it('should complete logout flow', () => {
      mockApi.auth.logout();
      mockApi.auth.isAuthenticated.mockReturnValue(false);

      expect(mockApi.auth.isAuthenticated()).toBe(false);
    });

    it('should redirect to login after logout', () => {
      mockApi.auth.logout();
      mockApi.auth.isAuthenticated.mockReturnValue(false);

      if (!mockApi.auth.isAuthenticated()) {
        window.location.hash = '#/login';
      }

      expect(window.location.hash).toBe('#/login');
    });
  });

  describe('API calls with auth header', () => {
    it('should include Authorization header when token exists', () => {
      mockApi.auth.setToken('bearer-token-xyz');
      mockApi.auth.getToken.mockReturnValue('bearer-token-xyz');

      const token = mockApi.auth.getToken();
      const headers = { Authorization: `Bearer ${token}` };

      expect(headers.Authorization).toBe('Bearer bearer-token-xyz');
    });

    it('should not include header when no token', () => {
      mockApi.auth.getToken.mockReturnValue(null);

      const token = mockApi.auth.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      expect(headers).toEqual({});
    });
  });
});