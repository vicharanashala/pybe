import { api } from '../lib/api.js';
import { ScenarioValidator, validateScenario, formatValidationErrors } from '../lib/scenario-validator.js';

export function renderScenarioBuilder(container) {
  if (!api.auth.isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }

  const STEPS = ['Foundation', 'Case Study', 'Pillars', 'Hints', 'Review'];
  let currentStep = 0;
  let fullValidationResult = null;

  container.innerHTML = `
    <div class="scenario-builder-page">
      <h1>Scenario Builder</h1>
      <p>Create a new philosophical Python learning scenario</p>

      <div class="step-indicator">
        ${STEPS.map((step, i) => `
          <div class="step-dot ${i === 0 ? 'active' : ''}" data-step="${i}">
            <span class="step-number">${i + 1}</span>
            <span class="step-name">${step}</span>
          </div>
        `).join('')}
      </div>

      <form id="scenario-form" class="builder-form">
        <div class="form-step active" data-step="0">
          <h2>Step 1: Foundation</h2>
          <div class="form-group">
            <label for="title">Scenario Title *</label>
            <input type="text" id="title" placeholder="e.g. The Panchatantra Mirror" required />
            <small>The title should be evocative and connect to the domain</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="domain">Domain *</label>
              <select id="domain" required>
                <option value="">Select a domain</option>
                <option value="Folklore">Folklore / Panchatantra</option>
                <option value="Literature">Literature</option>
                <option value="Science">Science / Biology / Physics</option>
                <option value="Music">Music / Rhythm</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Pop Culture">Pop Culture</option>
              </select>
            </div>

            <div class="form-group">
              <label for="python-concept">Python Concept *</label>
              <input type="text" id="python-concept" placeholder="e.g. Reflection, dir(), getattr()" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="level">Difficulty Level</label>
              <select id="level">
                <option value="1">1 Discovery (Approachable)</option>
                <option value="2" selected>2 Foundations (Standard)</option>
                <option value="3">3 Intermediate (Requires Thinking)</option>
                <option value="4">4 Advanced (Deep Engineering)</option>
                <option value="5">5 Hardware/OS Level (Expert)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="jonasan-type">Jonasan Type *</label>
              <select id="jonasan-type" required>
                <option value="Structured Inquiry">Structured Inquiry Guided discovery</option>
                <option value="Dilemma">Dilemma No right answer, tradeoff analysis</option>
                <option value="Design Thinking Problem">Design Thinking Build something</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="philosophical-anchor">Philosophical Anchor *</label>
            <textarea id="philosophical-anchor" rows="4" placeholder="The 'why' why does this concept matter philosophically? Connect it to the domain deeply." required></textarea>
            <small>This is the soul of the scenario. Be rigorous.</small>
          </div>
        </div>

        <div class="form-step" data-step="1">
          <h2>Step 2: The Trigger (Case Study)</h2>
          <div class="form-group">
            <label for="case-study">Case Study Narrative *</label>
            <textarea id="case-study" rows="12" placeholder="Write the complete case study narrative in second person present tense. No Python syntax. No hints. Just the problem. Make it immersive and grounded in the domain." required></textarea>
          </div>

          <div class="form-group">
            <label for="brief-description">Brief Description (for cards)</label>
            <input type="text" id="brief-description" placeholder="One sentence summary for the scenario browser" maxlength="180" />
            <small><span id="desc-count">0</span>/180 characters</small>
          </div>
        </div>

        <div class="form-step" data-step="2">
          <h2>Step 3: The Four Pillars</h2>
          <div class="form-group">
            <label for="theory-pillar">Theory Pillar * (Why)</label>
            <textarea id="theory-pillar" rows="4" placeholder="The philosophical foundation why does this concept matter beyond code?" required></textarea>
          </div>

          <div class="form-group">
            <label for="anchor-pillar">Anchor Pillar * (Interdisciplinary Mapping)</label>
            <textarea id="anchor-pillar" rows="4" placeholder="How does the non-programming domain map to the Python concept? Be specific about the structural parallels." required></textarea>
          </div>

          <div class="form-group">
            <label for="trigger-pillar">Trigger Pillar * (Case Study Connection)</label>
            <textarea id="trigger-pillar" rows="4" placeholder="How does the case study force the learner to discover this concept? What constraint drives the discovery?" required></textarea>
          </div>

          <div class="form-group">
            <label for="reality-pillar">Reality Pillar * (Engineering Depth)</label>
            <textarea id="reality-pillar" rows="4" placeholder="Production patterns, hardware tie-ins, real-world applications. What does this look like in a real codebase?" required></textarea>
          </div>
        </div>

        <div class="form-step" data-step="3">
          <h2>Step 4: Progressive Hints</h2>
          <p class="step-description">Write 5 hints. CRITICAL: Each hint must be a Socratic question that nudges without giving the answer.</p>

          <div id="hints-container">
            ${[1,2,3,4,5].map(i => `
              <div class="form-group hint-group">
                <label for="hint-${i}">Hint ${i} ${i === 1 ? '*' : '(optional)'}</label>
                <textarea id="hint-${i}" rows="2" placeholder="Ask a Socratic question. Don't say 'use dir()'. Instead ask 'Can you ask the object to describe itself?'" ${i === 1 ? 'required' : ''}></textarea>
                <div class="hint-validation" id="hint-${i}-validation"></div>
              </div>
            `).join('')}
          </div>

          <div class="form-group">
            <label for="constructs">Target Python Constructs (what the learner should discover)</label>
            <input type="text" id="constructs" placeholder="e.g. dir(), hasattr(), getattr(), inspect.getmembers()" />
            <small>Comma-separated list</small>
          </div>
        </div>

        <div class="form-step" data-step="4">
          <h2>Step 5: Review & Submit</h2>
          <div id="review-content" class="review-panel"></div>
        </div>

        <div class="form-navigation">
          <button type="button" id="prev-btn" class="btn btn-secondary">← Previous</button>
          <button type="button" id="next-btn" class="btn btn-primary">Next →</button>
          <button type="submit" id="submit-btn" class="btn btn-primary">Create Scenario</button>
        </div>
      </form>
      <p id="builder-message"></p>
    </div>
  `;

  const form = document.getElementById('scenario-form');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const submitBtn = document.getElementById('submit-btn');
  const msg = document.getElementById('builder-message');

  document.getElementById('brief-description')?.addEventListener('input', (e) => {
    const countEl = document.getElementById('desc-count');
    if (countEl) countEl.textContent = e.target.value.length;
  });

  const FORBIDDEN_HINT_PATTERNS = [
    /\buse\s+\w+\(\)/i,
    /\bcall\s+\w+\(\)/i,
    /\btry\s+\w+\.\w+/i,
    /\bthe answer is\b/i,
    /\bsimply\s+/i,
    /\bjust\s+/i,
    /\bdirectly\s+/i,
  ];

  function validateHint(hintText, hintNumber) {
    const validationEl = document.getElementById(`hint-${hintNumber}-validation`);
    if (!hintText || !hintText.trim()) {
      validationEl.innerHTML = '';
      return hintNumber === 1 ? false : true;
    }

    for (const pattern of FORBIDDEN_HINT_PATTERNS) {
      if (pattern.test(hintText)) {
        validationEl.innerHTML = `<span class="hint-error">⚠️ Socratic check: This hint gives too much away. Rephrase as a question.</span>`;
        return false;
      }
    }

    if (!hintText.trim().endsWith('?')) {
      validationEl.innerHTML = `<span class="hint-warning">⚠️ Hints should be Socratic questions (end with ?)</span>`;
      return true;
    } else {
      validationEl.innerHTML = `<span class="hint-ok">✓ Socratic structure good</span>`;
      return true;
    }
  }

  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`hint-${i}`);
    if (el) {
      el.addEventListener('blur', (e) => {
        validateHint(e.target.value, i);
      });
    }
  }

  function showStep(stepIndex) {
    document.querySelectorAll('.form-step').forEach((el, i) => {
      el.style.display = i === stepIndex ? 'block' : 'none';
      el.classList.toggle('active', i === stepIndex);
    });

    document.querySelectorAll('.step-dot').forEach((el, i) => {
      el.classList.toggle('active', i <= stepIndex);
      el.classList.toggle('completed', i < stepIndex);
    });

    prevBtn.style.display = stepIndex > 0 ? 'inline-block' : 'none';
    nextBtn.style.display = stepIndex < STEPS.length - 1 ? 'inline-block' : 'none';
    submitBtn.style.display = stepIndex === STEPS.length - 1 ? 'inline-block' : 'none';

    currentStep = stepIndex;

    if (stepIndex === STEPS.length - 1) {
      renderReview();
    }
  }

  function validateStep(stepIndex) {
    const stepEl = document.querySelector(`.form-step[data-step="${stepIndex}"]`);
    if (!stepEl) return true;

    const requiredFields = stepEl.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
    });

    if (stepIndex === 3) {
      if (!validateHint(document.getElementById('hint-1')?.value, 1)) {
        valid = false;
      }
    }

    return valid;
  }

  function renderReview() {
    const reviewEl = document.getElementById('review-content');
    if (!reviewEl) return;

    const title = document.getElementById('title')?.value || 'Untitled';
    const domain = document.getElementById('domain')?.value || '';
    const pythonConcept = document.getElementById('python-concept')?.value || '';
    const level = document.getElementById('level')?.value || '2';
    const jonasanType = document.getElementById('jonasan-type')?.value || '';
    const philosophicalAnchor = document.getElementById('philosophical-anchor')?.value || '';
    const caseStudy = document.getElementById('case-study')?.value || '';
    const constructs = document.getElementById('constructs')?.value || 'None specified';

    reviewEl.innerHTML = `
      <h3>Review: ${title}</h3>
      <div class="review-grid">
        <div class="review-item">
          <strong>Domain</strong>
          <span>${domain}</span>
        </div>
        <div class="review-item">
          <strong>Python Concept</strong>
          <span>${pythonConcept}</span>
        </div>
        <div class="review-item">
          <strong>Level</strong>
          <span>${level}</span>
        </div>
        <div class="review-item">
          <strong>Type</strong>
          <span>${jonasanType}</span>
        </div>
      </div>
      <h4>Philosophical Anchor</h4>
      <p class="review-text">${philosophicalAnchor.substring(0, 300)}${philosophicalAnchor.length > 300 ? '...' : ''}</p>
      <h4>Case Study (first 200 chars)</h4>
      <p class="review-text">${caseStudy.substring(0, 200)}...</p>
      <h4>Target Constructs</h4>
      <p>${constructs}</p>
    `;
  }

  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      showStep(currentStep + 1);
    }
  });

  prevBtn.addEventListener('click', () => {
    showStep(currentStep - 1);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const title = document.getElementById('title').value;
    const id = title
      .toLowerCase()
      .replace(/^the\s+/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const scenarioData = {
      id,
      title,
      domain: document.getElementById('domain').value,
      pythonConcept: document.getElementById('python-concept').value,
      difficultyLevel: parseInt(document.getElementById('level').value, 10),
      jonasanType: document.getElementById('jonasan-type').value,
      philosophicalAnchor: document.getElementById('philosophical-anchor').value,
      briefDescription: document.getElementById('brief-description').value,
      caseStudy: document.getElementById('case-study').value,
      theoryPillar: document.getElementById('theory-pillar').value,
      anchorPillar: document.getElementById('anchor-pillar').value,
      triggerPillar: document.getElementById('trigger-pillar').value,
      realityPillar: document.getElementById('reality-pillar').value,
      targetConstructs: document.getElementById('constructs').value
        ? document.getElementById('constructs').value.split(',').map(c => c.trim()).filter(Boolean)
        : [],
      hints: [1,2,3,4,5].map(i => ({
        level: i,
        text: document.getElementById(`hint-${i}`).value
      })).filter(h => h.text && h.text.trim())
    };

    const validation = validateScenario(scenarioData);
    fullValidationResult = validation;

    if (!validation.isValid) {
      const errorSummary = validation.errors.map(e => `${e.field}: ${e.message}`).join('\n');
      msg.innerHTML = `<strong>Validation failed:</strong>\n${errorSummary}`;
      msg.className = 'error-msg';

      if (validation.errors.some(e => e.field.startsWith('hints'))) {
        showStep(3);
      } else if (validation.errors.some(e => ['theoryPillar', 'anchorPillar', 'triggerPillar', 'realityPillar'].includes(e.field))) {
        showStep(2);
      } else if (validation.errors.some(e => ['caseStudy'].includes(e.field))) {
        showStep(1);
      } else {
        showStep(0);
      }
      return;
    }

    if (validation.warnings.length > 0) {
      const proceed = confirm(`Warnings found:\n${validation.warnings.map(w => `- ${w.field}: ${w.message}`).join('\n')}\n\nDo you want to proceed anyway?`);
      if (!proceed) return;
    }

    msg.textContent = 'Saving...';
    msg.className = '';

    try {
      await api.createScenario(scenarioData);
      msg.textContent = `Scenario "${title}" created successfully! (ID: ${id})`;
      msg.className = 'success-msg';
      form.reset();
      showStep(0);
    } catch (err) {
      msg.textContent = err.message || 'Failed to create scenario.';
      msg.className = 'error-msg';
    }
  });

  showStep(0);
}