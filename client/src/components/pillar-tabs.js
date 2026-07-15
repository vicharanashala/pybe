/**
 * Pillar Tabs Component
 * ======================
 * 4-pillar tab system: Theory | Anchor | Trigger | Reality
 */

const PILLAR_ICONS = {
  theory: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>`,
  anchor: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>`,
  trigger: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>`,
  reality: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>`,
};

const PILLAR_LABELS = {
  theory: 'Theory',
  anchor: 'Anchor',
  trigger: 'Trigger',
  reality: 'Reality',
};

const PILLAR_DESCRIPTIONS = {
  theory: 'The philosophical "why" behind this concept',
  anchor: 'Interdisciplinary mapping & cultural connections',
  trigger: 'Case study & narrative challenge',
  reality: 'Software engineering depth & real-world application',
};

/**
 * Create a pillar tabs component
 * @param {Object} data - Object with theory, anchor, trigger, reality keys
 */
export function createPillarTabs(data = {}) {
  const tabs = document.createElement('div');
  tabs.className = 'pillar-tabs';

  const pillars = ['theory', 'anchor', 'trigger', 'reality'];

  // Create tab buttons
  const tabBar = document.createElement('div');
  tabBar.className = 'tab-bar';
  tabBar.innerHTML = `
    <div class="tab-slider"></div>
    ${pillars.map((p, i) => `
      <button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${p}" aria-selected="${i === 0}">
        ${PILLAR_ICONS[p]}
        <span>${PILLAR_LABELS[p]}</span>
      </button>
    `).join('')}
  `;

  // Create tab panels
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  pillars.forEach((p, i) => {
    const panel = document.createElement('div');
    panel.className = `tab-panel ${i === 0 ? 'active' : ''}`;
    panel.dataset.panel = p;
    panel.setAttribute('role', 'tabpanel');

    const content = data[p] || `No ${PILLAR_LABELS[p].toLowerCase()} content available.`;
    
    panel.innerHTML = `
      <div class="panel-header">
        <span class="panel-icon">${PILLAR_ICONS[p]}</span>
        <div>
          <h4 class="panel-title">${PILLAR_LABELS[p]}</h4>
          <p class="panel-subtitle">${PILLAR_DESCRIPTIONS[p]}</p>
        </div>
      </div>
      <div class="panel-body">${formatContent(content)}</div>
    `;

    tabContent.appendChild(panel);
  });

  tabs.appendChild(tabBar);
  tabs.appendChild(tabContent);

  // Tab switching logic
  const slider = tabBar.querySelector('.tab-slider');
  const buttons = tabBar.querySelectorAll('.tab-btn');
  const panels = tabContent.querySelectorAll('.tab-panel');

  // Position slider on first tab
  requestAnimationFrame(() => {
    const activeBtn = tabBar.querySelector('.tab-btn.active');
    if (activeBtn) {
      slider.style.width = `${activeBtn.offsetWidth}px`;
      slider.style.left = `${activeBtn.offsetLeft}px`;
    }
  });

  buttons.forEach((btn, index) => {
    // Stagger button animation on load
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(-10px)';
    requestAnimationFrame(() => {
      btn.style.transition = 'opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      btn.style.transitionDelay = `${index * 60 + 200}ms`;
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    });

    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Move slider with spring easing (handled by CSS)
      slider.style.width = `${btn.offsetWidth}px`;
      slider.style.left = `${btn.offsetLeft}px`;

      // Update panels with crossfade
      panels.forEach(p => {
        if (p.dataset.panel === target) {
          p.classList.add('active');
          // Fade in animation for panel content
          const panelBody = p.querySelector('.panel-body');
          if (panelBody) {
            panelBody.style.opacity = '0';
            panelBody.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              panelBody.style.transition = 'opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
              panelBody.style.opacity = '1';
              panelBody.style.transform = 'translateY(0)';
            });
          }
        } else {
          p.classList.remove('active');
        }
      });
    });
  });

  return tabs;
}

/** Convert markdown-like text to HTML */
function formatContent(text) {
  if (!text) return '<p class="text-muted">No content available.</p>';
  
  // Already HTML
  if (text.includes('<') && text.includes('>')) return text;

  // Basic markdown conversion
  return text
    .split('\n\n')
    .map(para => {
      para = para.trim();
      if (!para) return '';
      // Bold
      para = para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Italic
      para = para.replace(/\*(.+?)\*/g, '<em>$1</em>');
      // Inline code
      para = para.replace(/`(.+?)`/g, '<code>$1</code>');
      return `<p>${para}</p>`;
    })
    .join('');
}
