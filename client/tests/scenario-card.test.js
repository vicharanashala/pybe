/**
 * Scenario Card Tests
 * ====================
 */

import { describe, it, expect } from 'vitest';
import {
  createScenarioCard,
  createSkeletonCards
} from '../src/components/scenario-card.js';

describe('createScenarioCard', () => {
  it('should create a card element', () => {
    const scenario = {
      id: 'test-scenario',
      title: 'Test Scenario',
      domain: 'Philosophy',
      concept: 'Context Managers',
      level: 3
    };

    const card = createScenarioCard(scenario);

    expect(card).toBeDefined();
    expect(card.tagName).toBe('ARTICLE');
    expect(card.className).toBe('scenario-card');
  });

  it('should display scenario title', () => {
    const scenario = {
      title: 'The Fellowship Graph',
      domain: 'Literature',
      concept: 'Graph Theory',
      level: 4
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('The Fellowship Graph');
  });

  it('should display domain badge', () => {
    const scenario = {
      title: 'Test',
      domain: 'Science',
      concept: 'DNA',
      level: 2
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('Science');
    expect(card.innerHTML).toContain('domain-badge');
  });

  it('should display difficulty level', () => {
    const scenario = {
      title: 'Test',
      domain: 'Philosophy',
      concept: 'Testing',
      level: 5
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('Level 5');
  });

  it('should render difficulty dots', () => {
    const scenario = {
      title: 'Test',
      domain: 'Music',
      concept: 'Rhythm',
      level: 3
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('difficulty-dot');
    expect(card.innerHTML).toContain('filled');
  });

  it('should handle missing description gracefully', () => {
    const scenario = {
      title: 'Test',
      domain: 'Philosophy',
      level: 1
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('Explore this learning scenario');
  });

  it('should truncate long descriptions', () => {
    const longDesc = 'A'.repeat(200);
    const scenario = {
      title: 'Test',
      domain: 'Philosophy',
      description: longDesc,
      level: 1
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('…');
  });

  it('should show contributor attribution when present', () => {
    const scenario = {
      title: 'Test',
      domain: 'Philosophy',
      concept: 'Testing',
      level: 1,
      createdBy: {
        username: 'testuser',
        avatar: null
      }
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('testuser');
    expect(card.innerHTML).toContain('card-attribution');
  });

  it('should navigate on click', () => {
    const scenario = {
      id: 'test-scenario',
      title: 'Test',
      domain: 'Philosophy',
      level: 1
    };

    const card = createScenarioCard(scenario);
    card.click();

    expect(window.location.hash).toBe('#/scenario/test-scenario');
  });

  it('should handle fallback concept field', () => {
    const scenario = {
      title: 'Test',
      domain: 'Philosophy',
      pythonConcept: 'Recursion',
      level: 1
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('Recursion');
  });

  it('should handle fallback level field', () => {
    const scenario = {
      title: 'Test',
      domain: 'Philosophy',
      concept: 'Testing',
      difficultyLevel: 4
    };

    const card = createScenarioCard(scenario);

    expect(card.innerHTML).toContain('Level 4');
  });
});

describe('createSkeletonCards', () => {
  it('should create skeleton cards', () => {
    const skeletons = createSkeletonCards(3);

    expect(skeletons.childNodes.length).toBe(3);
  });

  it('should create skeleton cards with proper class', () => {
    const skeletons = createSkeletonCards(1);
    const card = skeletons.childNodes[0];

    expect(card.className).toBe('scenario-card skeleton');
  });

  it('should create 6 cards by default', () => {
    const skeletons = createSkeletonCards();
    expect(skeletons.childNodes.length).toBe(6);
  });
});