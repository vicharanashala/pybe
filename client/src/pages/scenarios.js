/**
 * Scenario Browser Page
 * ======================
 * Filterable card grid showing all available learning scenarios.
 */

import { api } from '../lib/api.js';
import { createScenarioCard, createSkeletonCards } from '../components/scenario-card.js';

const DOMAIN_FILTERS = ['All', 'Biology', 'Culinary', 'Folklore', 'Literature', 'Music', 'Philosophy', 'Physics', 'Pop Culture', 'Psychology', 'Science'];
const LEVEL_FILTERS = ['All', '1', '2', '3', '4', '5'];

export function renderScenarios(appEl) {
  const main = document.createElement('main');
  main.className = 'page page-scenarios';

  main.innerHTML = `
    <section class="page-header">
      <div class="page-header-content">
        <span class="overline reveal-up">Explore & Learn</span>
        <h1 class="page-title reveal-up" data-delay="100">Learning Scenarios</h1>
        <p class="page-description reveal-up" data-delay="200">
          Choose a scenario to begin your journey through philosophy-driven Python learning.
        </p>
      </div>
    </section>

    <section class="filter-section reveal-up" data-delay="300">
      <div class="search-wrapper">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" id="search-input" class="search-input" placeholder="Search scenarios... (Ctrl+K)" aria-label="Search scenarios">
        <button id="clear-search" class="clear-search" style="display:none" aria-label="Clear search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="filter-group">
        <span class="filter-label">Domain</span>
        <div class="filter-pills" data-filter="domain">
          ${DOMAIN_FILTERS.map(d => `
            <button class="pill ${d === 'All' ? 'active' : ''}" data-value="${d}">${d}</button>
          `).join('')}
        </div>
      </div>
      <div class="filter-group">
        <span class="filter-label">Level</span>
        <div class="filter-pills" data-filter="level">
          ${LEVEL_FILTERS.map(l => `
            <button class="pill ${l === 'All' ? 'active' : ''}" data-value="${l}">${l === 'All' ? 'All' : 'Level ' + l}</button>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="scenarios-grid-section">
      <div class="scenarios-grid" id="scenarios-grid">
        <!-- Cards load here -->
      </div>
      <div class="scenarios-empty" id="scenarios-empty" style="display:none">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>No scenarios found</h3>
        <p>Try adjusting your filters to find scenarios.</p>
      </div>
      <div class="scenarios-error" id="scenarios-error" style="display:none">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>Unable to load scenarios</h3>
        <p id="error-message">Please ensure the backend server is running.</p>
        <button class="btn btn-primary" id="retry-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Retry
        </button>
      </div>
    </section>
  `;

  appEl.innerHTML = '';
  appEl.appendChild(main);

  // Setup scroll animations
  initScrollReveal();

  // State
  let allScenarios = [];
  let activeFilters = { domain: 'All', level: 'All' };
  let searchQuery = '';

  const grid = main.querySelector('#scenarios-grid');
  const emptyState = main.querySelector('#scenarios-empty');
  const errorState = main.querySelector('#scenarios-error');
  const retryBtn = main.querySelector('#retry-btn');
  const searchInput = main.querySelector('#search-input');
  const clearSearchBtn = main.querySelector('#clear-search');

  // Search handlers
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
    renderCards();
  });

  clearSearchBtn?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderCards();
    searchInput.focus();
  });

  // Filter handlers
  main.querySelectorAll('.filter-pills').forEach(group => {
    group.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;

      // Update active pill
      group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Update filter
      const filterType = group.dataset.filter;
      activeFilters[filterType] = pill.dataset.value;

      renderCards();
    });
  });

  retryBtn?.addEventListener('click', loadScenarios);

  function renderCards() {
    grid.innerHTML = '';
    emptyState.style.display = 'none';
    errorState.style.display = 'none';

    let filtered = allScenarios;

    if (activeFilters.domain !== 'All') {
      filtered = filtered.filter(s => s.domain === activeFilters.domain);
    }
    if (activeFilters.level !== 'All') {
      filtered = filtered.filter(s => String(s.difficultyLevel) === activeFilters.level);
    }
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.title?.toLowerCase().includes(searchQuery) ||
        s.briefDescription?.toLowerCase().includes(searchQuery) ||
        s.pythonConcept?.toLowerCase().includes(searchQuery) ||
        s.domain?.toLowerCase().includes(searchQuery)
      );
    }

    if (filtered.length === 0) {
      emptyState.style.display = 'flex';
      if (searchQuery) {
        emptyState.querySelector('h3').textContent = 'No matching scenarios';
        emptyState.querySelector('p').textContent = `No scenarios found for "${searchQuery}". Try a different search term.`;
      } else {
        emptyState.querySelector('h3').textContent = 'No scenarios found';
        emptyState.querySelector('p').textContent = 'Try adjusting your filters to find scenarios.';
      }
      return;
    }

    filtered.forEach((scenario, index) => {
      const card = createScenarioCard(scenario, index);
      grid.appendChild(card);
    });

    // Initialize scroll reveal for new cards
    setTimeout(initScrollReveal, 50);
  }

  async function loadScenarios() {
    grid.innerHTML = '';
    emptyState.style.display = 'none';
    errorState.style.display = 'none';

    // Show skeleton loading
    grid.appendChild(createSkeletonCards(6));

    try {
      const data = await api.getScenarios();
      allScenarios = data.scenarios || [];
      renderCards();
    } catch (err) {
      grid.innerHTML = '';
      errorState.style.display = 'flex';
      const errMsg = main.querySelector('#error-message');
      if (errMsg) errMsg.textContent = err.message;
    }
  }

  loadScenarios();
}
