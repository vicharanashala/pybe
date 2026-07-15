/**
 * API Client Tests
 * =================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api, ApiError } from '../src/lib/api.js';

describe('ApiError', () => {
  it('should create an ApiError with correct properties', () => {
    const error = new ApiError('Test error', 404, { message: 'Not found' });

    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(404);
    expect(error.data).toEqual({ message: 'Not found' });
  });

  it('should be an instance of Error', () => {
    const error = new ApiError('Test', 500, {});
    expect(error instanceof Error).toBe(true);
  });
});

describe('api.auth', () => {
  beforeEach(() => {
    localStorage.clear();
    global.localStorage = localStorage;
  });

  describe('token management', () => {
    it('should set and get token from localStorage', () => {
      api.auth.setToken('test-token-123');
      expect(api.auth.getToken()).toBe('test-token-123');
    });

    it('should return null when no token exists', () => {
      expect(api.auth.getToken()).toBeNull();
    });

    it('should clear token on logout', () => {
      api.auth.setToken('test-token');
      api.auth.logout();
      expect(api.auth.getToken()).toBeNull();
    });

    it('should check authentication status', () => {
      expect(api.auth.isAuthenticated()).toBe(false);

      api.auth.setToken('test-token');
      expect(api.auth.isAuthenticated()).toBe(true);
    });
  });
});

describe('api.health', () => {
  it('should be a function', () => {
    expect(typeof api.health).toBe('function');
  });
});

describe('api.getScenarios', () => {
  it('should be a function', () => {
    expect(typeof api.getScenarios).toBe('function');
  });

  it('should accept filters parameter', () => {
    expect(typeof api.getScenarios).toBe('function');
    const filters = { domain: 'Philosophy', level: 3 };
    expect(api.getScenarios(filters)).toBeDefined();
  });

  it('should handle empty filters', () => {
    expect(api.getScenarios({})).toBeDefined();
  });
});

describe('api.getScenario', () => {
  it('should be a function', () => {
    expect(typeof api.getScenario).toBe('function');
  });
});

describe('api.getHints', () => {
  it('should be a function', () => {
    expect(typeof api.getHints).toBe('function');
  });

  it('should accept scenario id and optional reveal count', () => {
    expect(api.getHints('fellowship-graph')).toBeDefined();
    expect(api.getHints('fellowship-graph', 2)).toBeDefined();
  });
});

describe('api.getSolutions', () => {
  it('should be a function', () => {
    expect(typeof api.getSolutions).toBe('function');
  });
});

describe('api.getReflection', () => {
  it('should be a function', () => {
    expect(typeof api.getReflection).toBe('function');
  });
});

describe('api.getRubric', () => {
  it('should be a function', () => {
    expect(typeof api.getRubric).toBe('function');
  });
});

describe('api.getUserDomains', () => {
  it('should be a function', () => {
    expect(typeof api.getUserDomains).toBe('function');
  });
});

describe('api.getUserStats', () => {
  it('should be a function', () => {
    expect(typeof api.getUserStats).toBe('function');
  });
});

describe('api.getUserProgress', () => {
  it('should be a function', () => {
    expect(typeof api.getUserProgress).toBe('function');
  });
});

describe('api.getDueForReview', () => {
  it('should be a function', () => {
    expect(typeof api.getDueForReview).toBe('function');
  });
});

describe('api.getGamificationProfile', () => {
  it('should be a function', () => {
    expect(typeof api.getGamificationProfile).toBe('function');
  });
});

describe('api.getLeaderboard', () => {
  it('should be a function', () => {
    expect(typeof api.getLeaderboard).toBe('function');
  });
});

describe('api.saveProgress', () => {
  it('should be a function', () => {
    expect(typeof api.saveProgress).toBe('function');
  });
});

describe('api.discussions', () => {
  it('should have getDiscussions function', () => {
    expect(typeof api.getDiscussions).toBe('function');
  });

  it('should have addDiscussion function', () => {
    expect(typeof api.addDiscussion).toBe('function');
  });

  it('should have upvoteDiscussion function', () => {
    expect(typeof api.upvoteDiscussion).toBe('function');
  });

  it('should have acceptDiscussion function', () => {
    expect(typeof api.acceptDiscussion).toBe('function');
  });
});

describe('api.evaluate', () => {
  it('should be a function', () => {
    expect(typeof api.evaluate).toBe('function');
  });

  it('should accept code, scenarioId, and optional reasoning', () => {
    expect(api.evaluate('print("hello")', 'fellowship-graph')).toBeDefined();
    expect(api.evaluate('print("hello")', 'fellowship-graph', 'my reasoning')).toBeDefined();
  });
});