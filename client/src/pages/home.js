/**
 * Landing Page Home
 * ====================
 * Hero section, 4-pillar manifesto, CTA, and stats.
 */

export function renderHome(appEl) {
  const main = document.createElement('main');
  main.className = 'page page-home';

  main.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-badge reveal-up">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        A Philosophical Python Platform
      </div>
      <h1 class="hero-title reveal-up" data-delay="100">
        Learn Python Through<br/>
        <span class="gradient-text word-reveal">Philosophy, Culture & Code</span>
      </h1>
      <p class="hero-subtitle reveal-up" data-delay="200">
        pyBE reimagines programming education through four interconnected pillars 
        weaving philosophy, interdisciplinary anchors, narrative triggers, and software engineering 
        reality into each learning scenario.
      </p>
      <div class="hero-actions reveal-up" data-delay="300">
        <a href="#/scenarios" class="btn btn-primary btn-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Explore Scenarios
        </a>
        <a href="#/scenarios" class="btn btn-ghost btn-lg">
          Learn More
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </section>

    <!-- 4 Pillars Section -->
    <section class="pillars-section">
      <div class="section-intro reveal-up">
        <span class="overline">The Manifesto</span>
        <h2>Four Pillars of Learning</h2>
        <p>Each scenario is built upon four interconnected dimensions, creating a rich, multi-layered learning experience.</p>
      </div>
      <div class="pillars-grid">
        <article class="pillar-card reveal-up" style="--pillar-color: hsl(270, 15%, 65%);" data-delay="0">
          <div class="pillar-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h3>Theory</h3>
          <p>The philosophical "why" grounding each concept in deeper understanding through epistemological frameworks.</p>
          <span class="pillar-number">01</span>
        </article>
        <article class="pillar-card reveal-up" style="--pillar-color: hsl(35, 25%, 60%);" data-delay="100">
          <div class="pillar-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
            </svg>
          </div>
          <h3>Anchor</h3>
          <p>Interdisciplinary connections mapping Python concepts to folklore, literature, music, and pop culture.</p>
          <span class="pillar-number">02</span>
        </article>
        <article class="pillar-card reveal-up" style="--pillar-color: hsl(145, 25%, 55%);" data-delay="200">
          <div class="pillar-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <h3>Trigger</h3>
          <p>Narrative case studies immersive scenarios that challenge you to think and code like a software engineer.</p>
          <span class="pillar-number">03</span>
        </article>
        <article class="pillar-card reveal-up" style="--pillar-color: hsl(200, 25%, 60%);" data-delay="300">
          <div class="pillar-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h3>Reality</h3>
          <p>Software engineering depth bridging academic concepts to real-world production patterns and best practices.</p>
          <span class="pillar-number">04</span>
        </article>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section reveal-up">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number" data-target="26">0</span>
          <span class="stat-label">Scenarios</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number" data-target="8">0</span>
          <span class="stat-label">Domains</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">2 – 5</span>
          <span class="stat-label">Difficulty Levels</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number" data-target="4">0</span>
          <span class="stat-label">Pillars</span>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bottom-cta reveal-up">
      <h2>Ready to Begin?</h2>
      <p>Dive into scenarios that blend philosophy with Python mastery.</p>
      <a href="#/scenarios" class="btn btn-primary btn-lg">
        Start Learning
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
    </section>
  `;

  appEl.innerHTML = '';
  appEl.appendChild(main);

  // Animate counters
  animateCounters(main);

  // Setup scroll reveal animations
  initScrollReveal();

  // Animate word reveal for gradient text
  animateWordReveal(main);
}

function animateCounters(container) {
  const counters = container.querySelectorAll('.stat-number[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.ceil(current);
          }
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function setupScrollAnimations(container) {
  const elements = container.querySelectorAll('.fade-in-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

function animateWordReveal(container) {
  const wordRevealEl = container.querySelector('.word-reveal');
  if (!wordRevealEl) return;

  // Make words animate on load
  wordRevealEl.style.opacity = '1';
  wordRevealEl.style.filter = 'blur(0)';
}
