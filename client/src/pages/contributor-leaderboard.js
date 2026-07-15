import { api } from '../lib/api.js';

export function renderContributorLeaderboard(container) {
    container.innerHTML = `
        <main class="page page-leaderboard">
            <section class="page-header">
                <h1>Contributor Leaderboard</h1>
                <p class="page-description">Philosophers and engineers who built pyBE's learning scenarios</p>
            </section>

            <div class="leaderboard-loading" id="leaderboard-loading">
                <div class="loading-spinner"></div>
                <p>Loading contributors...</p>
            </div>

            <div class="leaderboard-error" id="leaderboard-error" style="display:none">
                <p>Could not load contributors. Is the server running?</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>

            <div class="contributors-grid" id="contributors-grid" style="display:none"></div>
        </main>
    `;

    loadContributors();

    async function loadContributors() {
        try {
            const res = await api.getLeaderboard(50);
            const loading = document.getElementById('leaderboard-loading');
            const error = document.getElementById('leaderboard-error');
            const grid = document.getElementById('contributors-grid');

            loading.style.display = 'none';
            grid.style.display = 'grid';

            if (!res.contributors || res.contributors.length === 0) {
                grid.innerHTML = '<p class="no-contributors">No contributors yet. Be the first to create a scenario!</p>';
                return;
            }

            grid.innerHTML = res.contributors.map((c, i) => `
                <article class="contributor-card">
                    <div class="contributor-rank ${i < 3 ? 'top-' + (i+1) : ''}">#${i + 1}</div>
                    <div class="contributor-info">
                        ${c.avatar
                            ? `<img src="${c.avatar}" class="contributor-avatar" alt="${c.username}" />`
                            : `<div class="contributor-avatar-placeholder">${c.username[0].toUpperCase()}</div>`
                        }
                        <div class="contributor-details">
                            <strong class="contributor-name">${escapeHtml(c.username)}</strong>
                            ${c.github ? `<a href="https://github.com/${c.github}" target="_blank" class="contributor-github">@${c.github}</a>` : ''}
                        </div>
                    </div>
                    <div class="contributor-stats">
                        <div class="contributor-stat">
                            <span class="stat-value">${c.totalImpact || 0}</span>
                            <span class="stat-label">Learners Impacted</span>
                        </div>
                        <div class="contributor-stat">
                            <span class="stat-value">${c.createdScenarios || 0}</span>
                            <span class="stat-label">Scenarios</span>
                        </div>
                    </div>
                    ${c.bio ? `<p class="contributor-bio">"${escapeHtml(c.bio)}"</p>` : ''}
                </article>
            `).join('');

        } catch (e) {
            document.getElementById('leaderboard-loading').style.display = 'none';
            document.getElementById('leaderboard-error').style.display = 'block';
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}