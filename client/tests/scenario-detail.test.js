/**
 * Scenario Detail Page Tests
 * ==========================
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderScenarioDetail } from '../src/pages/scenario-detail.js';

const mockApi = {
  getScenario: vi.fn(),
  getHints: vi.fn(),
  getSolutions: vi.fn(),
  getReflection: vi.fn(),
  getRubric: vi.fn(),
  getDiscussions: vi.fn()
};

vi.mock('../src/lib/api.js', () => ({
  api: mockApi
}));

function getMockScenario(overrides = {}) {
  return {
    id: 'fellowship-graph',
    title: 'The Fellowship Graph',
    domain: 'Literature',
    domainCategory: 'LOTR',
    pythonConcept: 'Graph Traversal',
    difficultyLevel: 3,
    jonasanType: 'Structured Inquiry',
    briefDescription: 'Navigate the fellowship as a graph',
    theoryPillar: 'The theory pillar content here that is at least thirty characters long.',
    anchorPillar: 'The anchor pillar content connecting to interdisciplinary mapping.',
    triggerPillar: 'The trigger pillar with case study narrative content.',
    realityPillar: 'The reality pillar with engineering depth and production patterns.',
    caseStudy: 'The case study narrative that is at least one hundred characters long describing the scenario.',
    createdBy: { username: 'testuser' }
  };
}

function getMockHints() {
  return {
    hints: [
      { level: 1, text: 'Consider how nodes are connected' },
      { level: 2, text: 'Think about traversal order' },
      { level: 3, text: 'How do you avoid revisiting nodes?' }
    ]
  };
}

describe('renderScenarioDetail', () => {
  let appEl;

  beforeEach(() => {
    appEl = document.createElement('div');
    appEl.id = 'app';
    document.body.appendChild(appEl);

    vi.clearAllMocks();
    mockApi.getScenario.mockResolvedValue(getMockScenario());
    mockApi.getHints.mockResolvedValue(getMockHints());
    mockApi.getSolutions.mockResolvedValue({ solutions: [] });
    mockApi.getReflection.mockResolvedValue({ reflection: [] });
    mockApi.getRubric.mockResolvedValue({ rubric: {} });
    mockApi.getDiscussions.mockResolvedValue({ threads: [] });
  });

  afterEach(() => {
    if (document.body.contains(appEl)) {
      document.body.removeChild(appEl);
    }
    vi.restoreAllMocks();
  });

  describe('initial loading state', () => {
    it('should show loading skeleton initially', () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      const loadingEl = appEl.querySelector('.detail-loading');
      expect(loadingEl).toBeDefined();
      expect(loadingEl.textContent).toContain('Loading scenario');
    });

    it('should show loading spinner', () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      const spinner = appEl.querySelector('.loading-spinner');
      expect(spinner).toBeDefined();
    });

    it('should have page-detail class', () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      const main = appEl.querySelector('main');
      expect(main.className).toContain('page-detail');
    });

    it('should have ambient glow elements', () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      const glows = appEl.querySelectorAll('.ambient-glow');
      expect(glows.length).toBe(2);
    });
  });

  describe('error state', () => {
    it('should show error page when scenario not found', async () => {
      mockApi.getScenario.mockRejectedValue(new Error('Scenario not found'));

      renderScenarioDetail(appEl, { id: 'nonexistent' });
      await new Promise(resolve => setTimeout(resolve, 50));

      const errorPage = appEl.querySelector('.error-page');
      expect(errorPage).toBeDefined();
      expect(errorPage.textContent).toContain('Scenario Not Found');
    });

    it('should show back to scenarios link on error', async () => {
      mockApi.getScenario.mockRejectedValue(new Error('Not found'));

      renderScenarioDetail(appEl, { id: 'nonexistent' });
      await new Promise(resolve => setTimeout(resolve, 50));

      const backLink = appEl.querySelector('.error-page a');
      expect(backLink).toBeDefined();
      expect(backLink.getAttribute('href')).toBe('#/scenarios');
    });
  });

  describe('successful load', () => {
    it('should call all API methods', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockApi.getScenario).toHaveBeenCalledWith('fellowship-graph');
      expect(mockApi.getHints).toHaveBeenCalledWith('fellowship-graph');
      expect(mockApi.getSolutions).toHaveBeenCalledWith('fellowship-graph');
      expect(mockApi.getReflection).toHaveBeenCalledWith('fellowship-graph');
      expect(mockApi.getRubric).toHaveBeenCalledWith('fellowship-graph');
    });

    it('should render scenario content after load', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const errorPage = appEl.querySelector('.error-page');
      expect(errorPage).toBeNull();
    });

    it('should render back navigation', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const backNav = appEl.querySelector('.back-nav');
      expect(backNav).toBeDefined();
      expect(backNav.querySelector('.back-link').getAttribute('href')).toBe('#/scenarios');
    });
  });

  describe('domain color mapping', () => {
    it('should use correct color for Literature domain', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const domainBadge = appEl.querySelector('.domain-badge');
      expect(domainBadge).toBeDefined();
      const style = domainBadge.style.cssText;
      expect(style).toContain('Literature');
    });

    it('should use default color for unknown domain', async () => {
      mockApi.getScenario.mockResolvedValue({
        ...getMockScenario(),
        domain: 'UnknownDomain'
      });

      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const domainBadge = appEl.querySelector('.domain-badge');
      expect(domainBadge).toBeDefined();
    });
  });

  describe('hero section', () => {
    it('should render scenario title in hero', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const heroTitle = appEl.querySelector('.detail-title');
      expect(heroTitle).toBeDefined();
    });

    it('should render domain badge', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const domainBadge = appEl.querySelector('.domain-badge');
      expect(domainBadge).toBeDefined();
      expect(domainBadge.textContent).toBe('Literature');
    });

    it('should render difficulty indicator', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const difficultyDots = appEl.querySelectorAll('.difficulty-dot');
      expect(difficultyDots.length).toBeGreaterThan(0);
    });

    it('should render python concept tag', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const conceptTag = appEl.querySelector('.concept-tag');
      expect(conceptTag).toBeDefined();
    });
  });

  describe('content sections', () => {
    it('should render pillar tabs section', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const pillarTabs = appEl.querySelector('.pillar-tabs');
      expect(pillarTabs).toBeDefined();
    });

    it('should render hint panel section', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const hintPanel = appEl.querySelector('.hint-panel');
      expect(hintPanel).toBeDefined();
    });

    it('should render code sandbox section', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const pythonSandbox = appEl.querySelector('.python-sandbox');
      expect(pythonSandbox).toBeDefined();
    });

    it('should render discussion panel section', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const discussionPanel = appEl.querySelector('.discussion-panel');
      expect(discussionPanel).toBeDefined();
    });
  });

  describe('navigation buttons', () => {
    it('should render PDF download button', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const pdfBtn = appEl.querySelector('.btn-pdf');
      expect(pdfBtn).toBeDefined();
    });

    it('should render AI evaluate button', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const evaluateBtn = appEl.querySelector('.btn-evaluate');
      expect(evaluateBtn).toBeDefined();
    });
  });

  describe('animation classes', () => {
    it('should apply fade-in-up animation to back nav', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const backNav = appEl.querySelector('.back-nav');
      expect(backNav.className).toContain('fade-in-up');
    });

    it('should apply delayed animation to hero', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const hero = appEl.querySelector('.detail-hero');
      expect(hero.className).toContain('delay-1');
    });
  });

  describe('scenario not found handling', () => {
    it('should handle getHints failure gracefully', async () => {
      mockApi.getHints.mockRejectedValue(new Error('Failed'));

      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const errorPage = appEl.querySelector('.error-page');
      expect(errorPage).toBeNull();
    });

    it('should handle getSolutions failure gracefully', async () => {
      mockApi.getSolutions.mockRejectedValue(new Error('Failed'));

      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockApi.getScenario).toHaveBeenCalled();
    });
  });

  describe('created by attribution', () => {
    it('should render created by badge when scenario has creator', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const createdByBadge = appEl.querySelector('.created-by-badge');
      expect(createdByBadge).toBeDefined();
    });
  });

  describe('brief description', () => {
    it('should render brief description in hero', async () => {
      renderScenarioDetail(appEl, { id: 'fellowship-graph' });

      await new Promise(resolve => setTimeout(resolve, 100));

      const briefDesc = appEl.querySelector('.brief-description');
      expect(briefDesc).toBeDefined();
    });
  });
});