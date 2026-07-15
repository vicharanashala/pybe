/**
 * Scenario Builder Page Tests
 * ============================
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderScenarioBuilder } from '../src/pages/scenario-builder.js';

const mockApi = {
  auth: {
    isAuthenticated: vi.fn(),
    getToken: vi.fn()
  },
  scenarios: {
    create: vi.fn(),
    validate: vi.fn()
  }
};

vi.mock('../src/lib/api.js', () => ({
  api: mockApi
}));

describe('renderScenarioBuilder', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    mockApi.auth.isAuthenticated.mockReturnValue(true);
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  describe('authentication check', () => {
    it('should redirect to login if not authenticated', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(false);

      renderScenarioBuilder(container);

      expect(window.location.hash).toBe('#/login');
    });

    it('should not render form if not authenticated', () => {
      mockApi.auth.isAuthenticated.mockReturnValue(false);

      renderScenarioBuilder(container);

      expect(container.querySelector('.scenario-builder-page')).toBeNull();
    });
  });

  describe('initial render', () => {
    it('should render the builder page when authenticated', () => {
      renderScenarioBuilder(container);

      expect(container.querySelector('.scenario-builder-page')).toBeDefined();
    });

    it('should render step indicator with 5 steps', () => {
      renderScenarioBuilder(container);

      const stepDots = container.querySelectorAll('.step-dot');
      expect(stepDots.length).toBe(5);
    });

    it('should render form with first step active', () => {
      renderScenarioBuilder(container);

      const activeStep = container.querySelector('.form-step.active');
      expect(activeStep.dataset.step).toBe('0');
    });

    it('should render step names', () => {
      renderScenarioBuilder(container);

      const stepNames = container.querySelectorAll('.step-name');
      expect(stepNames[0].textContent).toBe('Foundation');
      expect(stepNames[1].textContent).toBe('Case Study');
      expect(stepNames[2].textContent).toBe('Pillars');
      expect(stepNames[3].textContent).toBe('Hints');
      expect(stepNames[4].textContent).toBe('Review');
    });

    it('should render form with all step sections', () => {
      renderScenarioBuilder(container);

      const formSteps = container.querySelectorAll('.form-step');
      expect(formSteps.length).toBe(5);
    });
  });

  describe('step indicator', () => {
    it('should have first step marked as active', () => {
      renderScenarioBuilder(container);

      const firstStepDot = container.querySelector('.step-dot.active');
      expect(firstStepDot.dataset.step).toBe('0');
    });

    it('should show step numbers', () => {
      renderScenarioBuilder(container);

      const stepNumbers = container.querySelectorAll('.step-number');
      expect(stepNumbers.length).toBe(5);
      expect(stepNumbers[0].textContent).toBe('1');
      expect(stepNumbers[4].textContent).toBe('5');
    });
  });

  describe('step 1 - Foundation', () => {
    it('should render title input', () => {
      renderScenarioBuilder(container);

      const titleInput = container.querySelector('#title');
      expect(titleInput).toBeDefined();
      expect(titleInput.placeholder).toContain('Panchatantra');
    });

    it('should render domain select', () => {
      renderScenarioBuilder(container);

      const domainSelect = container.querySelector('#domain');
      expect(domainSelect).toBeDefined();
      expect(domainSelect.options.length).toBeGreaterThan(1);
    });

    it('should render python concept input', () => {
      renderScenarioBuilder(container);

      const conceptInput = container.querySelector('#python-concept');
      expect(conceptInput).toBeDefined();
    });

    it('should render difficulty level select', () => {
      renderScenarioBuilder(container);

      const levelSelect = container.querySelector('#level');
      expect(levelSelect).toBeDefined();
      expect(levelSelect.options.length).toBe(5);
    });

    it('should render jonasan type select', () => {
      renderScenarioBuilder(container);

      const jonasanSelect = container.querySelector('#jonasan-type');
      expect(jonasanSelect).toBeDefined();
      expect(jonasanSelect.options.length).toBe(3);
    });

    it('should render philosophical anchor textarea', () => {
      renderScenarioBuilder(container);

      const anchorTextarea = container.querySelector('#philosophical-anchor');
      expect(anchorTextarea).toBeDefined();
    });
  });

  describe('step 2 - Case Study', () => {
    it('should have case study textarea', () => {
      renderScenarioBuilder(container);

      const caseStudyTextarea = container.querySelector('#case-study');
      expect(caseStudyTextarea).toBeDefined();
    });

    it('should have brief description input', () => {
      renderScenarioBuilder(container);

      const briefDescInput = container.querySelector('#brief-description');
      expect(briefDescInput).toBeDefined();
    });

    it('should show character count for brief description', () => {
      renderScenarioBuilder(container);

      const descCount = container.querySelector('#desc-count');
      expect(descCount).toBeDefined();
      expect(descCount.textContent).toBe('0');
    });
  });

  describe('step 3 - Pillars', () => {
    it('should have theory pillar textarea', () => {
      renderScenarioBuilder(container);

      const theoryPillar = container.querySelector('#theory-pillar');
      expect(theoryPillar).toBeDefined();
    });

    it('should have anchor pillar textarea', () => {
      renderScenarioBuilder(container);

      const anchorPillar = container.querySelector('#anchor-pillar');
      expect(anchorPillar).toBeDefined();
    });

    it('should have trigger pillar textarea', () => {
      renderScenarioBuilder(container);

      const triggerPillar = container.querySelector('#trigger-pillar');
      expect(triggerPillar).toBeDefined();
    });

    it('should have reality pillar textarea', () => {
      renderScenarioBuilder(container);

      const realityPillar = container.querySelector('#reality-pillar');
      expect(realityPillar).toBeDefined();
    });
  });

  describe('step 4 - Hints', () => {
    it('should have hints container', () => {
      renderScenarioBuilder(container);

      const hintsContainer = container.querySelector('#hints-container');
      expect(hintsContainer).toBeDefined();
    });

    it('should have add hint button', () => {
      renderScenarioBuilder(container);

      const addHintBtn = container.querySelector('#add-hint-btn');
      expect(addHintBtn).toBeDefined();
    });

    it('should show Socratic validation info', () => {
      renderScenarioBuilder(container);

      const socraticInfo = container.querySelector('.socratic-info');
      expect(socraticInfo).toBeDefined();
    });
  });

  describe('step 5 - Review', () => {
    it('should have submit button', () => {
      renderScenarioBuilder(container);

      const submitBtn = container.querySelector('#submit-scenario');
      expect(submitBtn).toBeDefined();
    });

    it('should have preview section', () => {
      renderScenarioBuilder(container);

      const previewSection = container.querySelector('.preview-section');
      expect(previewSection).toBeDefined();
    });
  });

  describe('navigation buttons', () => {
    it('should have next button on step 1', () => {
      renderScenarioBuilder(container);

      const nextBtn = container.querySelector('.btn-next');
      expect(nextBtn).toBeDefined();
      expect(nextBtn.textContent).toContain('Next');
    });

    it('should have back button on step 2+', () => {
      renderScenarioBuilder(container);

      const backBtn = container.querySelector('.btn-back');
      expect(backBtn).toBeDefined();
      expect(backBtn.textContent).toContain('Back');
    });
  });

  describe('form structure', () => {
    it('should have scenario-form form element', () => {
      renderScenarioBuilder(container);

      const form = container.querySelector('#scenario-form');
      expect(form).toBeDefined();
    });

    it('should have all required field labels', () => {
      renderScenarioBuilder(container);

      const labels = container.querySelectorAll('label');
      const labelTexts = Array.from(labels).map(l => l.textContent);
      expect(labelTexts.some(t => t.includes('Title'))).toBe(true);
      expect(labelTexts.some(t => t.includes('Domain'))).toBe(true);
      expect(labelTexts.some(t => t.includes('Python Concept'))).toBe(true);
    });
  });

  describe('hint management', () => {
    it('should start with zero hints in UI', () => {
      renderScenarioBuilder(container);

      const hintItems = container.querySelectorAll('.hint-item');
      expect(hintItems.length).toBe(0);
    });

    it('should have level input in hint form', () => {
      renderScenarioBuilder(container);

      const hintLevelInput = container.querySelector('.hint-level-input');
      expect(hintLevelInput).toBeDefined();
    });

    it('should have text input in hint form', () => {
      renderScenarioBuilder(container);

      const hintTextInput = container.querySelector('.hint-text-input');
      expect(hintTextInput).toBeDefined();
    });
  });
});