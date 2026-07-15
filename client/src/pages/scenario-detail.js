/**
 * Scenario Detail Page
 * =====================
 * Full scenario view with 4-pillar tabs, hints, solutions, reflection, rubric.
 */

import { api } from '../lib/api.js';
import { createPillarTabs } from '../components/pillar-tabs.js';
import { createHintPanel } from '../components/hint-panel.js';
import { createCodeViewer } from '../components/code-viewer.js';
import { PythonSandbox } from '../components/PythonSandbox.js';
import { DiscussionPanel } from '../components/DiscussionPanel.js';
import { generateReport } from '../lib/pdf-report.js';

const SOCKETIO_URL = 'http://localhost:5000';

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

export function renderScenarioDetail(appEl, params) {
  const { id } = params;
  
  const main = document.createElement('main');
  main.className = 'page page-detail';

  // Show loading skeleton
  main.innerHTML = `
    <div class="detail-loading">
      <div class="loading-spinner"></div>
      <p>Loading scenario…</p>
    </div>
  `;

  appEl.innerHTML = '';
  appEl.appendChild(main);

  loadScenario(main, id);
}

async function loadScenario(main, id) {
  try {
    // Load all data in parallel
    const [scenario, hintsData, solutionsData, reflectionData, rubricData] = await Promise.all([
      api.getScenario(id),
      api.getHints(id).catch(() => ({ hints: [] })),
      api.getSolutions(id).catch(() => ({ solutions: [] })),
      api.getReflection(id).catch(() => ({ reflection: [] })),
      api.getRubric(id).catch(() => ({ rubric: {} })),
    ]);

    renderScenarioContent(main, scenario, hintsData, solutionsData, reflectionData, rubricData);
  } catch (err) {
    main.innerHTML = `
      <div class="error-page">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2>Scenario Not Found</h2>
        <p>${err.message}</p>
        <a href="#/scenarios" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Scenarios
        </a>
      </div>
    `;
  }
}

function renderScenarioContent(main, scenario, hintsData, solutionsData, reflectionData, rubricData) {
  const domainColor = DOMAIN_COLORS[scenario.domain] || 'hsl(270, 20%, 70%)';

  main.innerHTML = `
    <!-- Reading Progress Bar -->
    <div class="reading-progress" id="reading-progress">
      <div class="reading-progress-bar" id="reading-progress-bar"></div>
    </div>

    <!-- Breadcrumbs -->
    <nav class="breadcrumbs fade-in-up" aria-label="Breadcrumb">
      <a href="#/" class="breadcrumb-item">Home</a>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
      <a href="#/scenarios" class="breadcrumb-item">Scenarios</a>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
      <span class="breadcrumb-item current">${scenario.title || 'Untitled'}</span>
    </nav>

    <!-- Back button -->
    <div class="back-nav fade-in-up">
      <a href="#/scenarios" class="back-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        All Scenarios
      </a>
    </div>

    <!-- Hero Header -->
    <section class="detail-hero fade-in-up delay-1">
      <div class="detail-badges">
<span class="badge domain-badge" data-domain="${scenario.domain || 'General'}">
                ${scenario.domain || 'General'}
              </span>
        <span class="badge level-badge">Level ${scenario.difficultyLevel || '?'}</span>
        <span class="badge time-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          ${scenario.estimatedTime || '15-20 min'}
        </span>
        ${scenario.jonasanType ? `<span class="badge type-badge">${scenario.jonasanType}</span>` : ''}
      </div>
      <h1 class="detail-title">${scenario.title || 'Untitled'}</h1>
      <p class="detail-concept">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
        ${scenario.pythonConcept || 'Python'}
      </p>
    </section>

    <!-- Philosophical Anchor Quote -->
    ${scenario.philosophicalAnchor ? `
    <section class="anchor-quote-section fade-in-up delay-2">
      <blockquote class="anchor-quote" style="--accent-color: ${domainColor}">
        <svg class="quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.15">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p>${scenario.philosophicalAnchor}</p>
      </blockquote>
    </section>
    ` : ''}

    <!-- Pillar Tabs -->
    <section class="pillar-section fade-in-up delay-3" id="pillar-section">
    </section>

    <!-- Python Sandbox -->
    <section class="sandbox-section fade-in-up delay-4">
      <div class="section-header">
        <div class="section-header-left">
          <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <h3>Python Environment</h3>
        </div>
        <button id="evaluate-btn" class="btn btn-secondary btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Get AI Feedback
        </button>
      </div>
      <div id="evaluation-panel" class="evaluation-panel hidden">
        <div class="evaluation-header">
          <h4>AI Evaluation Results</h4>
          <div class="evaluation-score" id="evaluation-score"></div>
        </div>
        <div class="evaluation-breakdown" id="evaluation-breakdown"></div>
        <div class="evaluation-feedback" id="evaluation-feedback"></div>
        <div class="evaluation-next-step hidden" id="evaluation-next-step"></div>
        <button id="close-evaluation-btn" class="btn btn-ghost btn-sm">Close</button>
      </div>
      <div id="sandbox-container"></div>
    </section>

    <!-- AI Code Review -->
    <section class="ai-review-section fade-in-up">
        <div class="section-header">
            <div class="section-header-left">
                <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <h3>AI Code Review</h3>
            </div>
        </div>
        <div id="ai-review-container">
            <button id="get-ai-feedback-btn" class="btn btn-secondary">
                Get AI Feedback on My Code
            </button>
            <div id="ai-feedback-output" style="display:none; margin-top: 16px;"></div>
        </div>
    </section>

    <!-- Hints Section -->
    <section class="hints-section fade-in-up" id="hints-section">
    </section>

    <!-- Target Constructs -->
    ${scenario.targetConstructs && scenario.targetConstructs.length > 0 ? `
    <section class="constructs-section fade-in-up">
      <div class="section-header">
        <div class="section-header-left">
          <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <h3>Target Constructs</h3>
        </div>
      </div>
      <div class="constructs-pills">
        ${scenario.targetConstructs.map(c => `<span class="construct-pill">${c}</span>`).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Solutions Section -->
    <section class="solutions-section fade-in-up" id="solutions-section">
      <div class="section-header collapsible" role="button" tabindex="0" aria-expanded="false">
        <div class="section-header-left">
          <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          <h3>Solutions</h3>
          <span class="hint-count-badge">${solutionsData.solutions?.length || 0} files</span>
        </div>
        <svg class="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <div class="section-body collapsed" id="solutions-body">
      </div>
    </section>

    <!-- Reflection Prompts -->
    ${reflectionData.reflection && reflectionData.reflection.length > 0 ? `
    <section class="reflection-section fade-in-up">
      <div class="section-header">
        <div class="section-header-left">
          <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <h3>Reflection Prompts</h3>
        </div>
      </div>
      <div class="reflection-grid">
        ${reflectionData.reflection.map((prompt, i) => `
          <div class="reflection-card" style="animation-delay: ${i * 80}ms">
            <span class="reflection-number">${i + 1}</span>
            <p>${prompt}</p>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Scoring Rubric -->
    ${rubricData.rubric && Object.keys(rubricData.rubric).length > 0 ? `
    <section class="rubric-section fade-in-up">
      <div class="section-header">
        <div class="section-header-left">
          <svg class="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
          </svg>
          <h3>Scoring Rubric</h3>
        </div>
      </div>
      <div class="rubric-chart" id="rubric-chart">
        ${renderRubric(rubricData.rubric)}
      </div>
    </section>
    ` : ''}

    <!-- Actions Bar -->
    <section class="actions-bar fade-in-up">
      <button id="download-report-btn" class="btn btn-ghost btn-sm">
        📄 Download PDF Report
      </button>
    </section>

    <!-- Discussion Threads -->
    <section class="discussion-section fade-in-up">
      <div id="discussion-container"></div>
    </section>
  `;

  // Setup scroll animations
  const fadeEls = main.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
  fadeEls.forEach(el => observer.observe(el));

  // Setup reading progress bar
  const progressBar = main.querySelector('#reading-progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, progress)}%`;
    });
  }

  // Mount pillar tabs
  const pillarSection = main.querySelector('#pillar-section');
  const pillarData = {
    theory: scenario.theoryPillar || null,
    anchor: scenario.philosophicalAnchor || null,
    trigger: scenario.triggerPillar || null,
    reality: scenario.realityPillar || null,
  };
  const pillarTabs = createPillarTabs(pillarData);
  pillarSection.appendChild(pillarTabs);

  // Mount python sandbox
  const sandbox = new PythonSandbox('sandbox-container');
  sandbox.init();

  // Mount hints panel
  const hintsSection = main.querySelector('#hints-section');
  const hintPanel = createHintPanel(hintsSection);
  hintPanel.setHints(hintsData.hints || []);

  // Mount solutions
  const solutionsHeader = main.querySelector('#solutions-section .section-header');
  const solutionsBody = main.querySelector('#solutions-body');

  solutionsHeader.addEventListener('click', () => {
    const isExpanded = solutionsHeader.getAttribute('aria-expanded') === 'true';
    solutionsHeader.setAttribute('aria-expanded', String(!isExpanded));
    solutionsBody.classList.toggle('collapsed');
    solutionsHeader.querySelector('.chevron').classList.toggle('rotated');
  });

  if (solutionsData.solutions && solutionsData.solutions.length > 0) {
    solutionsData.solutions.forEach(sol => {
      const filename = sol.filename || sol.name || 'solution.py';
      const code = sol.content || sol.code || '# No code available';
      const viewer = createCodeViewer(code, filename, 'python');
      solutionsBody.appendChild(viewer);
    });
  } else {
    solutionsBody.innerHTML = '<p class="text-muted" style="padding: 1.5rem">No solutions available yet.</p>';
  }

  // Animate rubric bars
  requestAnimationFrame(() => {
    setTimeout(() => {
      main.querySelectorAll('.rubric-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 500);
  });

  // Mount discussion panel
  const discussion = new DiscussionPanel('discussion-container', scenario.id);
  discussion.init();

  // PDF Report button
  const reportBtn = main.querySelector('#download-report-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      const token = localStorage.getItem('jwt_token');
      let userId = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.user_id;
        } catch {}
      }
      generateReport(scenario.id, scenario.title, userId);
    });
  }

  // AI Code Review button handler
  const aiFeedbackBtn = document.getElementById('get-ai-feedback-btn');
  const aiOutput = document.getElementById('ai-feedback-output');

  if (aiFeedbackBtn) {
    aiFeedbackBtn.addEventListener('click', async () => {
      const code = document.getElementById('python-code')?.value;
      if (!code || !code.trim()) {
        aiOutput.innerHTML = '<p class="text-muted">Write some code first, then click "Get AI Feedback".</p>';
        aiOutput.style.display = 'block';
        return;
      }

      aiFeedbackBtn.disabled = true;
      aiFeedbackBtn.textContent = 'Analyzing...';
      aiOutput.innerHTML = '<div class="loading-spinner"></div><p>AI is reviewing your code...</p>';
      aiOutput.style.display = 'block';

      try {
        const result = await api.evaluate(code, scenario.id);
        const score = result.totalScore || result.score || 0;
        const scores = result.scores || result.breakdown || {};
        const feedbackByPillar = result.feedbackByPillar || {};

        aiOutput.innerHTML = `
          <div class="ai-feedback-card">
            <div class="ai-score">
              <span class="score-value">${score}</span>
              <span class="score-label">/ 100</span>
            </div>
            <div class="ai-breakdown">
              <div>Reasoning: ${scores.reasoning || 0}%</div>
              <div>Code: ${scores.code || 0}%</div>
              <div>Reflection: ${scores.reflection || 0}%</div>
            </div>
            ${Object.keys(feedbackByPillar).length > 0 ? `
              <div class="ai-feedback-by-pillar">
                ${feedbackByPillar.reasoning ? `<div><strong>Reasoning:</strong> ${feedbackByPillar.reasoning}</div>` : ''}
                ${feedbackByPillar.code ? `<div><strong>Code:</strong> ${feedbackByPillar.code}</div>` : ''}
                ${feedbackByPillar.reflection ? `<div><strong>Reflection:</strong> ${feedbackByPillar.reflection}</div>` : ''}
              </div>
            ` : `<div class="ai-feedback-text">${result.feedback || 'No feedback available'}</div>`}
            ${result.nextStepSuggestion ? `<div class="ai-next-step"><strong>Next step:</strong> ${result.nextStepSuggestion}</div>` : ''}
            ${result.praisePoint ? `<div class="ai-praise"><span class="praise-icon">✨</span> ${result.praisePoint}</div>` : ''}
            ${result.misconceptionsDetected && result.misconceptionsDetected.length > 0 ? `
              <div class="ai-misconceptions">
                <strong>Misconceptions to address:</strong>
                <ul>${result.misconceptionsDetected.map(m => `<li>${m}</li>`).join('')}</ul>
              </div>
            ` : ''}
          </div>
        `;
      } catch (err) {
        aiOutput.innerHTML = `<p class="error-msg">Failed to get AI feedback: ${err.message}</p>`;
      }

      aiFeedbackBtn.disabled = false;
      aiFeedbackBtn.textContent = 'Get AI Feedback on My Code';
    });
  }

  // Initialize AI evaluation
  initEvaluation(scenario.id);
}

function initEvaluation(scenarioId) {
  const evaluateBtn = document.getElementById('evaluate-btn');
  const closeBtn = document.getElementById('close-evaluation-btn');
  const evaluationPanel = document.getElementById('evaluation-panel');

  if (!evaluateBtn) return;

  let socket = null;
  let isEvaluating = false;

  evaluateBtn.addEventListener('click', async () => {
    if (isEvaluating) return;

    const code = window.getPythonCode ? window.getPythonCode() : '';
    const codeInput = document.querySelector('#python-code') || document.querySelector('.code-input');
    const codeText = codeInput ? codeInput.value || codeInput.textContent || '' : code;

    if (!codeText.trim()) {
      showEvaluationFeedback('Please write some code first!');
      return;
    }

    isEvaluating = true;
    evaluateBtn.disabled = true;
    evaluateBtn.innerHTML = `
      <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
      Evaluating...
    `;

    try {
      socket = io(SOCKETIO_URL, { transports: ['websocket', 'polling'] });

      socket.on('connect', () => {
        socket.emit('evaluate_code', {
          code: codeText,
          scenario_id: scenarioId
        });
      });

      socket.on('evaluation_status', (data) => {
        showEvaluationFeedback(data.message || 'Evaluating...');
      });

      socket.on('evaluation_chunk', (data) => {
        if (data.type === 'feedback') {
          appendEvaluationFeedback(data.chunk);
        } else if (data.type === 'breakdown') {
          updateBreakdownScore(data.key, data.value);
        }
      });

      socket.on('evaluation_complete', (data) => {
        finishEvaluation(data);
        cleanup();
      });

      socket.on('evaluation_error', (data) => {
        showEvaluationFeedback('Error: ' + (data.error || 'Evaluation failed'));
        cleanup();
      });

      socket.on('connect_error', () => {
        // Fallback to REST API
        socket.disconnect();
        socket = null;
        runRestEvaluation(codeText, scenarioId);
      });

    } catch (err) {
      // Fallback to REST API
      runRestEvaluation(codeText, scenarioId);
    }
  });

  closeBtn?.addEventListener('click', () => {
    evaluationPanel?.classList.add('hidden');
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  });

  async function runRestEvaluation(code, scenarioId) {
    try {
      const result = await api.evaluate(code, scenarioId);
      finishEvaluation({
        score: result.totalScore || result.score,
        scores: result.scores || result.breakdown || {},
        feedback: result.feedback || result.feedbackByPillar || {},
        feedbackByPillar: result.feedbackByPillar || {},
        next_step: result.nextStepSuggestion || result.next_step || '',
        constructs: result.constructs_demonstrated || result.constructs || [],
        misconceptions: result.misconceptionsDetected || result.misconceptions || [],
        praisePoint: result.praisePoint || ''
      });
    } catch (err) {
      showEvaluationFeedback('Error: ' + (err.message || 'Evaluation failed. Make sure the server is running.'));
    } finally {
      cleanup();
    }
  }

  function cleanup() {
    isEvaluating = false;
    evaluateBtn.disabled = false;
    evaluateBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Get AI Feedback
    `;
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  function showEvaluationFeedback(message) {
    const panel = document.getElementById('evaluation-panel');
    const feedbackEl = document.getElementById('evaluation-feedback');
    if (panel) panel.classList.remove('hidden');
    if (feedbackEl) feedbackEl.textContent = message;
  }

  function appendEvaluationFeedback(chunk) {
    const feedbackEl = document.getElementById('evaluation-feedback');
    if (feedbackEl) feedbackEl.textContent += chunk;
  }

  function updateBreakdownScore(key, value) {
    const breakdownEl = document.getElementById('evaluation-breakdown');
    if (!breakdownEl) return;

    const existingRow = breakdownEl.querySelector(`[data-key="${key}"]`);
    if (existingRow) {
      existingRow.querySelector('.score-value').textContent = `${value}%`;
      existingRow.querySelector('.score-bar-fill').style.width = `${value}%`;
    } else {
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      row.dataset.key = key;
      row.innerHTML = `
        <span class="score-label">${key}</span>
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${value}%"></div>
        </div>
        <span class="score-value">${value}%</span>
      `;
      breakdownEl.appendChild(row);
    }
  }

  function finishEvaluation(data) {
    const panel = document.getElementById('evaluation-panel');
    const scoreEl = document.getElementById('evaluation-score');
    const nextStepEl = document.getElementById('evaluation-next-step');

    if (panel) panel.classList.remove('hidden');

    if (scoreEl) {
      const score = data.score || 0;
      scoreEl.innerHTML = `
        <span class="score-number">${score}</span>
        <span class="score-label">/100</span>
      `;
      scoreEl.className = `evaluation-score score-${score >= 70 ? 'good' : score >= 50 ? 'ok' : 'needs-work'}`;
    }

    if (nextStepEl) {
      let nextStepHTML = '';
      if (data.next_step) {
        nextStepHTML += `<div class="next-step-item"><strong>Next step:</strong> ${data.next_step}</div>`;
      }
      if (data.praisePoint) {
        nextStepHTML += `<div class="praise-point"><span class="praise-icon">✨</span> ${data.praisePoint}</div>`;
      }
      if (data.misconceptions && data.misconceptions.length > 0) {
        nextStepHTML += `<div class="misconceptions-section">
          <strong>Misconceptions to address:</strong>
          <ul>${data.misconceptions.map(m => `<li>${m}</li>`).join('')}</ul>
        </div>`;
      }
      if (nextStepHTML) {
        nextStepEl.classList.remove('hidden');
        nextStepEl.innerHTML = nextStepHTML;
      }
    }

    const feedbackEl = document.getElementById('evaluation-feedback');
    if (feedbackEl && data.feedbackByPillar) {
      const fbp = data.feedbackByPillar;
      let feedbackHTML = '';
      if (fbp.reasoning) feedbackHTML += `<div class="feedback-pillar"><strong>Reasoning:</strong> ${fbp.reasoning}</div>`;
      if (fbp.code) feedbackHTML += `<div class="feedback-pillar"><strong>Code:</strong> ${fbp.code}</div>`;
      if (fbp.reflection) feedbackHTML += `<div class="feedback-pillar"><strong>Reflection:</strong> ${fbp.reflection}</div>`;
      if (feedbackHTML) {
        feedbackEl.innerHTML = feedbackHTML;
      }
    }
  }
}

function renderRubric(rubric) {
  if (!rubric || typeof rubric !== 'object') return '<p class="text-muted">No rubric data.</p>';

  let entries = [];
  if (Array.isArray(rubric)) {
    entries = rubric.map(item => ({
      label: item.criterion || item.name || item.label || 'Unknown',
      weight: item.weight || item.value || item.score || 0,
      description: item.description || '',
    }));
  } else {
    entries = Object.entries(rubric).map(([key, value]) => ({
      label: key,
      weight: typeof value === 'number' ? value : (value.weight || value.value || 0),
      description: typeof value === 'object' ? (value.description || '') : '',
    }));
  }

  const maxWeight = Math.max(...entries.map(e => e.weight), 1);

  const colors = [
    'hsl(270, 20%, 70%)',
    'hsl(35, 25%, 60%)',
    'hsl(145, 30%, 55%)',
    'hsl(200, 25%, 60%)',
    'hsl(320, 20%, 65%)',
    'hsl(45, 25%, 60%)',
  ];

  return entries.map((entry, i) => {
    const pct = Math.round((entry.weight / maxWeight) * 100);
    const color = colors[i % colors.length];
    const labelCapitalized = entry.label.charAt(0).toUpperCase() + entry.label.slice(1);
    return `
      <div class="rubric-row">
        <div class="rubric-label">${labelCapitalized}</div>
        <div class="rubric-bar">
          <div class="rubric-bar-fill" data-width="${pct}%" style="--bar-color: ${color}; width: 0%"></div>
        </div>
        <div class="rubric-weight">${entry.weight}%</div>
      </div>
      ${entry.description ? `<div class="rubric-description">${entry.description}</div>` : ''}
    `;
  }).join('');
}
