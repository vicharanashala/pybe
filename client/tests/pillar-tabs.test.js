/**
 * Pillar Tabs Tests
 * =================
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createPillarTabs } from '../src/components/pillar-tabs.js';

describe('createPillarTabs', () => {
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

  it('should create a pillar tabs element', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    expect(container.querySelector('.pillar-tabs')).toBeDefined();
  });

  it('should have 4 tab buttons', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const buttons = container.querySelectorAll('.tab-btn');
    expect(buttons.length).toBe(4);
  });

  it('should have theory, anchor, trigger, reality labels', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const buttons = container.querySelectorAll('.tab-btn');
    const labels = Array.from(buttons).map(btn => btn.textContent.trim());
    expect(labels).toContain('Theory');
    expect(labels).toContain('Anchor');
    expect(labels).toContain('Trigger');
    expect(labels).toContain('Reality');
  });

  it('should have 4 tab panels', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const panels = container.querySelectorAll('.tab-panel');
    expect(panels.length).toBe(4);
  });

  it('should display theory content when provided', () => {
    const data = {
      theory: 'The theory content here',
      anchor: '',
      trigger: '',
      reality: ''
    };
    const tabs = createPillarTabs(data);
    container.appendChild(tabs);

    const theoryPanel = container.querySelector('[data-panel="theory"]');
    expect(theoryPanel.innerHTML).toContain('The theory content here');
  });

  it('should display anchor content when provided', () => {
    const data = {
      theory: '',
      anchor: 'The anchor content here',
      trigger: '',
      reality: ''
    };
    const tabs = createPillarTabs(data);
    container.appendChild(tabs);

    const anchorPanel = container.querySelector('[data-panel="anchor"]');
    expect(anchorPanel.innerHTML).toContain('The anchor content here');
  });

  it('should display trigger content when provided', () => {
    const data = {
      theory: '',
      anchor: '',
      trigger: 'The trigger content here',
      reality: ''
    };
    const tabs = createPillarTabs(data);
    container.appendChild(tabs);

    const triggerPanel = container.querySelector('[data-panel="trigger"]');
    expect(triggerPanel.innerHTML).toContain('The trigger content here');
  });

  it('should display reality content when provided', () => {
    const data = {
      theory: '',
      anchor: '',
      trigger: '',
      reality: 'The reality content here'
    };
    const tabs = createPillarTabs(data);
    container.appendChild(tabs);

    const realityPanel = container.querySelector('[data-panel="reality"]');
    expect(realityPanel.innerHTML).toContain('The reality content here');
  });

  it('should show default message for missing pillar content', () => {
    const data = {};
    const tabs = createPillarTabs(data);
    container.appendChild(tabs);

    const theoryPanel = container.querySelector('[data-panel="theory"]');
    expect(theoryPanel.innerHTML).toContain('No theory content available');
  });

  it('should have first tab active by default', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const activeBtn = container.querySelector('.tab-btn.active');
    expect(activeBtn.dataset.tab).toBe('theory');

    const activePanel = container.querySelector('.tab-panel.active');
    expect(activePanel.dataset.panel).toBe('theory');
  });

  it('should switch panels on tab click', () => {
    const tabs = createPillarTabs({
      theory: 'Theory content',
      anchor: 'Anchor content',
      trigger: 'Trigger content',
      reality: 'Reality content'
    });
    container.appendChild(tabs);

    const triggerBtn = container.querySelector('[data-tab="trigger"]');
    triggerBtn.click();

    const activeBtn = container.querySelector('.tab-btn.active');
    expect(activeBtn.dataset.tab).toBe('trigger');

    const activePanel = container.querySelector('.tab-panel.active');
    expect(activePanel.dataset.panel).toBe('trigger');
  });

  it('should have tab-slider element', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    expect(container.querySelector('.tab-slider')).toBeDefined();
  });

  it('should have tab-bar element', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    expect(container.querySelector('.tab-bar')).toBeDefined();
  });

  it('should have tab-content element', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    expect(container.querySelector('.tab-content')).toBeDefined();
  });

  it('should render all four pillar icons', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const icons = container.querySelectorAll('.tab-btn svg');
    expect(icons.length).toBe(4);
  });

  it('should format bold markdown (**text**)', () => {
    const data = {
      theory: 'This has **bold** text',
      anchor: '',
      trigger: '',
      reality: ''
    };
    const tabs = createPillarTabs(data);
    container.appendChild(tabs);

    const theoryPanel = container.querySelector('[data-panel="theory"]');
    expect(theoryPanel.innerHTML).toContain('<strong>bold</strong>');
  });

  it('should format italic markdown (*text*)', () => {
    const data = {
      theory: 'This has *italic* text',
      anchor: '',
      trigger: '',
      reality: ''
    };
    const tabs = createPillarTabs(data);
    container.appendChild(tabs);

    const theoryPanel = container.querySelector('[data-panel="theory"]');
    expect(theoryPanel.innerHTML).toContain('<em>italic</em>');
  });

  it('should switch from theory to anchor tab', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const anchorBtn = container.querySelector('[data-tab="anchor"]');
    anchorBtn.click();

    const activeBtn = container.querySelector('.tab-btn.active');
    expect(activeBtn.dataset.tab).toBe('anchor');
  });

  it('should switch from theory to reality tab', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const realityBtn = container.querySelector('[data-tab="reality"]');
    realityBtn.click();

    const activeBtn = container.querySelector('.tab-btn.active');
    expect(activeBtn.dataset.tab).toBe('reality');
  });

  it('should render panel descriptions', () => {
    const tabs = createPillarTabs({});
    container.appendChild(tabs);

    const panelSubtitles = container.querySelectorAll('.panel-subtitle');
    expect(panelSubtitles.length).toBe(4);
    expect(panelSubtitles[0].textContent).toContain('philosophical');
  });
});