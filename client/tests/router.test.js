/**
 * Router Tests
 * =============
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Router } from '../src/lib/router.js';

describe('Router', () => {
  let container;
  let router;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);

    router = new Router(container);

    window.location.hash = '';
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    window.location.hash = '';
  });

  describe('route registration', () => {
    it('should register a basic route', () => {
      const handler = vi.fn();
      router.on('/', handler);

      expect(router.routes.length).toBe(1);
      expect(router.routes[0].pattern).toBe('/');
    });

    it('should register parameterized routes', () => {
      const handler = vi.fn();
      router.on('/scenario/:id', handler);

      expect(router.routes.length).toBe(1);
      expect(router.routes[0].pattern).toBe('/scenario/:id');
      expect(router.routes[0].paramNames).toContain('id');
    });

    it('should register multiple routes', () => {
      router.on('/', vi.fn());
      router.on('/scenarios', vi.fn());
      router.on('/scenario/:id', vi.fn());

      expect(router.routes.length).toBe(3);
    });

    it('should return router for chaining', () => {
      const result = router.on('/', vi.fn());
      expect(result).toBe(router);
    });
  });

  describe('route matching', () => {
    it('should match exact routes', async () => {
      const handler = vi.fn();
      router.on('/scenarios', handler);

      window.location.hash = '#/scenarios';

      await new Promise(r => setTimeout(r, 100));

      expect(handler).toHaveBeenCalled();
    });

    it('should match parameterized routes', async () => {
      let capturedParams = null;
      const handler = (params) => {
        capturedParams = params;
      };
      router.on('/scenario/:id', handler);

      window.location.hash = '#/scenario/fellowship-graph';

      await new Promise(r => setTimeout(r, 100));

      expect(capturedParams).toEqual({ id: 'fellowship-graph' });
    });

    it('should decode URI components in params', async () => {
      let capturedParams = null;
      const handler = (params) => {
        capturedParams = params;
      };
      router.on('/scenario/:id', handler);

      window.location.hash = '#/scenario/hello%20world';

      await new Promise(r => setTimeout(r, 100));

      expect(capturedParams).toEqual({ id: 'hello world' });
    });

    it('should match multiple params', async () => {
      let capturedParams = null;
      const handler = (params) => {
        capturedParams = params;
      };
      router.on('/users/:userId/scenarios/:scenarioId', handler);

      window.location.hash = '#/users/123/scenarios/abc';

      await new Promise(r => setTimeout(r, 100));

      expect(capturedParams).toEqual({ userId: '123', scenarioId: 'abc' });
    });
  });

  describe('404 handling', () => {
    it('should show 404 page when no route matches', async () => {
      router.on('/exact-route', vi.fn());

      window.location.hash = '#/nonexistent';

      await new Promise(r => setTimeout(r, 100));

      expect(container.innerHTML).toContain('404');
      expect(container.innerHTML).toContain('Page not found');
    });
  });

  describe('navigate', () => {
    it('should have navigate method', () => {
      expect(typeof router.navigate).toBe('function');
    });

    it('should navigate programmatically', async () => {
      const handler = vi.fn();
      router.on('/test', handler);

      router.navigate('/test');

      await new Promise(r => setTimeout(r, 100));

      expect(window.location.hash).toBe('#/test');
    });
  });

  describe('cleanup', () => {
    it('should call previous cleanup when navigating', async () => {
      const cleanup1 = vi.fn();
      const cleanup2 = vi.fn();

      router.on('/page1', () => cleanup1);
      router.on('/page2', () => cleanup2);

      window.location.hash = '#/page1';
      await new Promise(r => setTimeout(r, 150));

      window.location.hash = '#/page2';
      await new Promise(r => setTimeout(r, 150));

      expect(cleanup1).toHaveBeenCalled();
    });
  });
});