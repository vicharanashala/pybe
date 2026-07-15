import { api } from '../lib/api.js';

export function renderAdminReviewDashboard(container) {
  if (!api.auth.isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }

  container.innerHTML = `
    <div class="admin-review-page">
      <div class="admin-header">
        <h1>Mentor Review Dashboard</h1>
        <div class="admin-filters">
          <button class="filter-btn active" data-filter="pending">Pending Review</button>
          <button class="filter-btn" data-filter="approved">Approved</button>
          <button class="filter-btn" data-filter="needs_changes">Changes Requested</button>
          <button class="filter-btn" data-filter="rejected">Rejected</button>
          <button class="filter-btn" data-filter="all">All</button>
        </div>
      </div>

      <div id="review-queue" class="review-queue">
        <div class="loading-spinner">Loading reviews...</div>
      </div>

      <div id="review-detail-modal" class="review-modal" style="display:none;">
        <div class="review-modal-content">
          <button class="modal-close" id="close-modal">&times;</button>
          <div id="modal-body"></div>
        </div>
      </div>
    </div>
  `;

  initEventListeners();
  loadReviews('pending');

  return () => {};
}

function initEventListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.dataset.filter;
      loadReviews(filter === 'all' ? null : filter);
    });
  });

  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('review-detail-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'review-detail-modal') closeModal();
  });
}

async function loadReviews(status) {
  const queue = document.getElementById('review-queue');
  queue.innerHTML = '<div class="loading-spinner">Loading reviews...</div>';

  try {
    const data = status
      ? await api.reviews.getAll(status)
      : await api.reviews.getAll();

    if (data.reviews && data.reviews.length > 0) {
      queue.innerHTML = data.reviews.map(review => renderReviewCard(review)).join('');
      attachReviewCardListeners();
    } else {
      queue.innerHTML = '<div class="empty-state"><p>No reviews found.</p></div>';
    }
  } catch (err) {
    queue.innerHTML = `<div class="error-state"><p>Failed to load reviews: ${err.message}</p></div>`;
  }
}

function renderReviewCard(review) {
  const statusColors = {
    'pending': '#F39C12',
    'approved': '#27AE60',
    'needs_changes': '#3498DB',
    'rejected': '#E74C3C'
  };
  const statusColor = statusColors[review.status] || '#95A5A6';
  const submittedDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown';

  return `
    <div class="review-card" data-review-id="${review.id}">
      <div class="review-card-header">
        <span class="review-status" style="background:${statusColor}">${review.status.replace('_', ' ')}</span>
        <span class="review-date">${submittedDate}</span>
      </div>
      <h3 class="review-title">${review.scenarioId}</h3>
      <p class="review-submitter">Submitted by: <strong>${review.submitterName}</strong></p>
      ${review.antiSuperficialityScore ? `<p class="review-score">Anti-Superficiality Score: ${review.antiSuperficialityScore}/100</p>` : ''}
      <button class="btn btn-primary review-action-btn" data-action="view">Review</button>
    </div>
  `;
}

function attachReviewCardListeners() {
  document.querySelectorAll('.review-card').forEach(card => {
    card.querySelector('.review-action-btn')?.addEventListener('click', (e) => {
      const reviewId = parseInt(card.dataset.reviewId);
      openReviewDetail(reviewId);
    });
  });
}

async function openReviewDetail(reviewId) {
  const modal = document.getElementById('review-detail-modal');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = '<div class="loading-spinner">Loading review details...</div>';
  modal.style.display = 'flex';

  try {
    const review = await api.reviews.getById(reviewId);
    renderReviewDetailModal(modalBody, review);
  } catch (err) {
    modalBody.innerHTML = `<div class="error-state"><p>Failed to load review: ${err.message}</p></div>`;
  }
}

function renderReviewDetailModal(container, review) {
  const scenarioData = review.scenarioData || {};
  const createdDate = review.createdAt ? new Date(review.createdAt).toLocaleString() : 'Unknown';

  container.innerHTML = `
    <div class="detail-modal-header">
      <h2>Review: ${review.scenarioId}</h2>
      <span class="status-badge status-${review.status}">${review.status.replace('_', ' ')}</span>
    </div>

    <div class="detail-meta">
      <p><strong>Submitted by:</strong> ${review.submitterName}</p>
      <p><strong>Date:</strong> ${createdDate}</p>
      ${review.reviewerName ? `<p><strong>Reviewed by:</strong> ${review.reviewerName}</p>` : ''}
      ${review.reviewedAt ? `<p><strong>Reviewed at:</strong> ${new Date(review.reviewedAt).toLocaleString()}</p>` : ''}
    </div>

    ${review.antiSuperficialityScore ? `
    <div class="detail-section">
      <h3>Anti-Superficiality Score</h3>
      <div class="score-bar">
        <div class="score-fill" style="width:${review.antiSuperficialityScore}%"></div>
        <span class="score-label">${review.antiSuperficialityScore}/100</span>
      </div>
    </div>
    ` : ''}

    <div class="detail-section">
      <h3>Scenario Details</h3>
      <div class="scenario-preview">
        <p><strong>Title:</strong> ${scenarioData.title || review.scenarioId}</p>
        <p><strong>Domain:</strong> ${scenarioData.domain || 'N/A'}</p>
        <p><strong>Python Concept:</strong> ${scenarioData.pythonConcept || 'N/A'}</p>
        <p><strong>Difficulty:</strong> Level ${scenarioData.difficultyLevel || 'N/A'}</p>
        <p><strong>Jonasan Type:</strong> ${scenarioData.jonasanType || 'N/A'}</p>
      </div>
    </div>

    <div class="detail-section">
      <h3>Theory (Philosophical Anchor)</h3>
      <div class="pillar-content">${escapeHtml(scenarioData.philosophicalAnchor || scenarioData.theoryPillar || '')}</div>
    </div>

    <div class="detail-section">
      <h3>Four Pillars</h3>
      <div class="pillars-grid">
        <div class="pillar-box">
          <h4>Theory</h4>
          <p>${escapeHtml(scenarioData.theoryPillar || '')}</p>
        </div>
        <div class="pillar-box">
          <h4>Anchor</h4>
          <p>${escapeHtml(scenarioData.anchorPillar || '')}</p>
        </div>
        <div class="pillar-box">
          <h4>Trigger</h4>
          <p>${escapeHtml(scenarioData.triggerPillar || '')}</p>
        </div>
        <div class="pillar-box">
          <h4>Reality</h4>
          <p>${escapeHtml(scenarioData.realityPillar || '')}</p>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h3>Case Study</h3>
      <div class="case-study-preview">${escapeHtml(scenarioData.caseStudy || '')}</div>
    </div>

    <div class="detail-section">
      <h3>Target Constructs</h3>
      <p>${(scenarioData.targetConstructs || []).join(', ') || 'None specified'}</p>
    </div>

    ${review.mentorComments ? `
    <div class="detail-section mentor-comments">
      <h3>Mentor Comments</h3>
      <p>${escapeHtml(review.mentorComments)}</p>
    </div>
    ` : ''}

    ${review.changeRequests ? `
    <div class="detail-section change-requests">
      <h3>Change Requests</h3>
      <p>${escapeHtml(review.changeRequests)}</p>
    </div>
    ` : ''}

    ${review.status === 'pending' ? `
    <div class="detail-section review-actions">
      <h3>Actions</h3>

      <div class="action-form">
        <label>Mentor Comments (visible to contributor):</label>
        <textarea id="mentor-comments" rows="3" placeholder="Add your feedback here..."></textarea>
      </div>

      <div class="action-buttons">
        <button class="btn btn-success" data-action="approve" data-review-id="${review.id}">
          ✓ Approve
        </button>
        <button class="btn btn-warning" data-action="request-changes" data-review-id="${review.id}">
          ⟳ Request Changes
        </button>
        <button class="btn btn-danger" data-action="reject" data-review-id="${review.id}">
          ✗ Reject
        </button>
      </div>
    </div>
    ` : ''}

    <div class="detail-section">
      <h3>Preview Mode</h3>
      <button class="btn btn-secondary" id="preview-full">Preview Full Scenario</button>
    </div>
  `;

  attachModalActionListeners(review);
}

function attachModalActionListeners(review) {
  document.querySelectorAll('[data-action="approve"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const comments = document.getElementById('mentor-comments')?.value || '';
      if (confirm('Are you sure you want to APPROVE this scenario? It will be published.')) {
        try {
          await api.reviews.approve(parseInt(btn.dataset.reviewId), comments);
          alert('Scenario approved successfully!');
          closeModal();
          loadReviews('pending');
        } catch (err) {
          alert(`Failed to approve: ${err.message}`);
        }
      }
    });
  });

  document.querySelectorAll('[data-action="request-changes"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const comments = document.getElementById('mentor-comments')?.value || '';
      const changeRequests = prompt('What specific changes are needed?');
      if (!changeRequests) return;
      try {
        await api.reviews.requestChanges(parseInt(btn.dataset.reviewId), comments, changeRequests);
        alert('Change requests sent to contributor.');
        closeModal();
        loadReviews('needs_changes');
      } catch (err) {
        alert(`Failed to request changes: ${err.message}`);
      }
    });
  });

  document.querySelectorAll('[data-action="reject"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const comments = document.getElementById('mentor-comments')?.value || '';
      if (confirm('Are you sure you want to REJECT this scenario? This cannot be undone.')) {
        try {
          await api.reviews.reject(parseInt(btn.dataset.reviewId), comments);
          alert('Scenario rejected.');
          closeModal();
          loadReviews('rejected');
        } catch (err) {
          alert(`Failed to reject: ${err.message}`);
        }
      }
    });
  });

  document.getElementById('preview-full')?.addEventListener('click', () => {
    window.location.hash = `#/scenario/${review.scenarioId}`;
  });
}

function closeModal() {
  document.getElementById('review-detail-modal').style.display = 'none';
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}