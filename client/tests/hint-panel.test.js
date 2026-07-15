/**
 * Hint Panel Tests
 * ================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createHintPanel } from '../src/components/hint-panel.js';

describe('createHintPanel', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  });

  it('should create a panel element', () => {
    const panel = createHintPanel(container);

    expect(panel).toBeDefined();
    expect(panel.className).toBe('hint-panel');
  });

  it('should display 0 hints initially', () => {
    const panel = createHintPanel(container);
    const badge = panel.querySelector('.hint-count-badge');

    expect(badge.textContent).toBe('0 hints available');
  });

  it('should disable reveal button when no hints', () => {
    const panel = createHintPanel(container);
    const revealBtn = panel.querySelector('.btn-hint');

    expect(revealBtn.disabled).toBe(true);
  });

  it('should set hints via setHints method', () => {
    const panel = createHintPanel(container);
    panel.setHints(['Hint 1', 'Hint 2', 'Hint 3']);

    const badge = panel.querySelector('.hint-count-badge');
    expect(badge.textContent).toBe('3 hints available');
  });

  it('should enable reveal button when hints are set', () => {
    const panel = createHintPanel(container);
    panel.setHints(['Hint 1', 'Hint 2']);

    const revealBtn = panel.querySelector('.btn-hint');
    expect(revealBtn.disabled).toBe(false);
    expect(revealBtn.textContent).toContain('Reveal Hint 1');
  });

  it('should reveal one hint on click', () => {
    const panel = createHintPanel(container);
    panel.setHints(['Hint 1', 'Hint 2', 'Hint 3']);

    const revealBtn = panel.querySelector('.btn-hint');
    revealBtn.click();

    const hintsList = panel.querySelector('.hints-list');
    expect(hintsList.childNodes.length).toBe(1);
    expect(hintsList.innerHTML).toContain('Hint 1');
    expect(panel.querySelector('.hint-count-badge').textContent).toContain('1/3');
  });

  it('should reveal multiple hints on multiple clicks', () => {
    const panel = createHintPanel(container);
    panel.setHints(['Hint 1', 'Hint 2', 'Hint 3']);

    const revealBtn = panel.querySelector('.btn-hint');
    revealBtn.click();
    revealBtn.click();
    revealBtn.click();

    const hintsList = panel.querySelector('.hints-list');
    expect(hintsList.childNodes.length).toBe(3);
  });

  it('should disable button after all hints revealed', () => {
    const panel = createHintPanel(container);
    panel.setHints(['Hint 1', 'Hint 2']);

    const revealBtn = panel.querySelector('.btn-hint');
    revealBtn.click();
    revealBtn.click();

    expect(revealBtn.disabled).toBe(true);
    expect(revealBtn.textContent).toContain('All Hints Revealed');
  });

  it('should toggle collapsed state on header click', () => {
    const panel = createHintPanel(container);
    const header = panel.querySelector('.section-header');
    const body = panel.querySelector('.section-body');

    expect(body.classList.contains('collapsed')).toBe(true);

    header.click();
    expect(body.classList.contains('collapsed')).toBe(false);

    header.click();
    expect(body.classList.contains('collapsed')).toBe(true);
  });

  it('should toggle aria-expanded on header click', () => {
    const panel = createHintPanel(container);
    const header = panel.querySelector('.section-header');

    expect(header.getAttribute('aria-expanded')).toBe('false');

    header.click();
    expect(header.getAttribute('aria-expanded')).toBe('true');

    header.click();
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });

  it('should update button text after revealing hint', () => {
    const panel = createHintPanel(container);
    panel.setHints(['Hint 1', 'Hint 2', 'Hint 3']);

    const revealBtn = panel.querySelector('.btn-hint');
    revealBtn.click();

    expect(revealBtn.textContent).toContain('Reveal Hint 2 of 3');
  });

  it('should display hint number for each hint', () => {
    const panel = createHintPanel(container);
    panel.setHints(['First hint', 'Second hint']);

    const revealBtn = panel.querySelector('.btn-hint');
    revealBtn.click();
    revealBtn.click();

    const hints = panel.querySelectorAll('.hint-item');
    expect(hints[0].querySelector('.hint-number').textContent).toBe('1');
    expect(hints[1].querySelector('.hint-number').textContent).toBe('2');
  });

  it('should handle empty hints array', () => {
    const panel = createHintPanel(container);
    panel.setHints([]);

    const badge = panel.querySelector('.hint-count-badge');
    expect(badge.textContent).toBe('0 hints available');
  });

  it('should update badge count after reveal', () => {
    const panel = createHintPanel(container);
    panel.setHints(['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4', 'Hint 5']);

    const revealBtn = panel.querySelector('.btn-hint');
    revealBtn.click();
    revealBtn.click();

    const badge = panel.querySelector('.hint-count-badge');
    expect(badge.textContent).toContain('2/5');
  });
});