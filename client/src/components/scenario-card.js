/**
 * Scenario Card Component
 * ========================
 * Glassmorphic card for displaying scenario metadata in the browser grid.
 */

/** Map domain names to colors - Muted pastels for readability */
const DOMAIN_COLORS = {
  'Biology': 'hsl(145, 30%, 55%)',
  'Culinary': 'hsl(25, 25%, 60%)',
  'Folklore': 'hsl(25, 25%, 60%)',
  'Literature': 'hsl(200, 25%, 60%)',
  'Music': 'hsl(320, 20%, 65%)',
  'Philosophy': 'hsl(270, 20%, 70%)',
  'Physics': 'hsl(200, 25%, 60%)',
  'Pop Culture': 'hsl(45, 25%, 60%)',
  'Psychology': 'hsl(280, 20%, 60%)',
  'Science': 'hsl(145, 30%, 55%)',
  'Sports': 'hsl(200, 25%, 60%)',
  'Linguistics': 'hsl(170, 25%, 55%)',
  'General': 'hsl(240, 15%, 60%)',
};

function getDomainColor(domain) {
  return DOMAIN_COLORS[domain] || 'hsl(270, 20%, 70%)';
}

/** Generate difficulty dots */
function renderDifficultyDots(level) {
  const maxLevel = 5;
  const lvl = parseInt(level) || 1;
  let dots = '';
  for (let i = 1; i <= maxLevel; i++) {
    dots += `<span class="difficulty-dot ${i <= lvl ? 'filled' : ''}"></span>`;
  }
  return dots;
}

/** Get estimated time from scenario or fallback to difficulty-based estimate */
function getEstimatedTime(scenario) {
  if (scenario.estimatedTime) {
    return scenario.estimatedTime;
  }
  const times = {
    1: '5-10 min',
    2: '10-15 min',
    3: '15-20 min',
    4: '25-30 min',
    5: '30-45 min'
  };
  return times[parseInt(scenario.difficultyLevel)] || '15-20 min';
}

/**
 * Create a scenario card element
 * @param {Object} scenario - Scenario metadata
 * @param {number} index - Card index for stagger animation
 */
export function createScenarioCard(scenario, index = 0) {
  const card = document.createElement('article');
  card.className = 'scenario-card reveal-up card-tilt';
  card.style.animationDelay = `${index * 60}ms`;
  card.style.setProperty('--delay', `${index * 60}ms`);
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');
  card.setAttribute('aria-label', `Open ${scenario.title || 'scenario'}`);

  const domainColor = getDomainColor(scenario.domain);
  const description = scenario.description || scenario.briefDescription || scenario.trigger?.substring(0, 120) || 'Explore this learning scenario...';

  const createdBy = scenario.createdBy;
  const attributionHtml = createdBy ? `
    <div class="card-attribution">
      ${createdBy.avatar
        ? `<img src="${createdBy.avatar}" class="attribution-avatar" alt="${createdBy.username}" />`
        : `<div class="attribution-avatar">${(createdBy.username || 'C')[0].toUpperCase()}</div>`
      }
      <span class="attribution-name">by ${createdBy.username}</span>
    </div>
  ` : '';

  // Hover preview tooltip
  const hoverPreview = scenario.trigger ? `
    <div class="card-preview-tooltip">
      <div class="preview-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        <span>Trigger Preview</span>
      </div>
      <p class="preview-text">${scenario.trigger.substring(0, 200)}${scenario.trigger.length > 200 ? '...' : ''}</p>
    </div>
  ` : '';

  card.innerHTML = `
    <div class="card-glow" style="background: ${domainColor}"></div>
    <div class="card-content">
      <div class="card-badges">
        <span class="badge domain-badge" data-domain="${scenario.domain || 'General'}">
          ${scenario.domain || 'General'}
        </span>
        ${scenario.jonasanType ? `<span class="badge type-badge">${scenario.jonasanType}</span>` : ''}
        <span class="badge time-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          ${getEstimatedTime(scenario)}
        </span>
      </div>
      <h3 class="card-title">${scenario.title || 'Untitled Scenario'}</h3>
      <p class="card-concept">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
        ${scenario.concept || scenario.pythonConcept || 'Python'}
      </p>
      <p class="card-description">${description.length > 100 ? description.substring(0, 100) + '…' : description}</p>
      <div class="card-footer">
        <div class="difficulty">
          <span class="difficulty-label">Level ${scenario.level || scenario.difficultyLevel || '?'}</span>
          <div class="difficulty-dots">
            ${renderDifficultyDots(scenario.level || scenario.difficultyLevel)}
          </div>
        </div>
        <div class="card-actions">
          ${attributionHtml}
          <span class="card-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
    ${hoverPreview}
  `;

  // 3D tilt effect
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.setProperty('--tilt-x', `${rotateX}deg`);
    card.style.setProperty('--tilt-y', `${rotateY}deg`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });

  // Arrow animation on hover
  const arrowIcon = card.querySelector('.arrow-icon');
  if (arrowIcon) {
    card.addEventListener('mouseenter', () => {
      arrowIcon.style.transform = 'translateX(4px)';
      arrowIcon.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      arrowIcon.style.transform = 'translateX(0)';
      arrowIcon.style.opacity = '0.7';
    });
  }

  card.addEventListener('click', () => {
    window.location.hash = `/scenario/${scenario.id}`;
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.hash = `/scenario/${scenario.id}`;
    }
  });

  // Add hover effect for preview
  let hoverTimeout;
  card.addEventListener('mouseenter', () => {
    hoverTimeout = setTimeout(() => {
      card.classList.add('show-preview');
    }, 500);
  });

  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimeout);
    card.classList.remove('show-preview');
  });

  return card;
}

/**
 * Create skeleton loading cards
 */
export function createSkeletonCards(count = 6) {
  const container = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'scenario-card skeleton';
    card.style.animationDelay = `${i * 60}ms`;
    card.innerHTML = `
      <div class="card-content">
        <div class="skeleton-line skeleton-badge"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text short"></div>
        <div class="skeleton-line skeleton-footer"></div>
      </div>
    `;
    container.appendChild(card);
  }
  return container;
}