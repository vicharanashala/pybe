/**
 * Gamification Profile Page
 * ==========================
 * Displays XP, Level, Badges, and progress toward completing all scenarios.
 */

import { api } from '../lib/api.js';

const BADGES_DATA = {
  'first_blood': { 'name': 'First Blood', 'icon': '✅', 'trigger': 'Complete your first scenario' },
  'folklore_explorer': { 'name': 'Panchatantra Path', 'icon': '🐘', 'trigger': 'Complete a Folklore scenario' },
  'biologist': { 'name': 'Protein Thinker', 'icon': '🧬', 'trigger': 'Complete a Science/Biology scenario' },
  'musician': { 'name': 'Taal Master', 'icon': '🎵', 'trigger': 'Complete a Music scenario' },
  'philosopher': { 'name': 'Anicca Seeker', 'icon': '☸️', 'trigger': 'Complete a Philosophy scenario' },
  'literature_scholar': { 'name': 'Fellowship Member', 'icon': '📚', 'trigger': 'Complete a Literature scenario' },
  'hardware_toucher': { 'name': 'Hardware Toucher', 'icon': '⚡', 'trigger': 'Complete a Level 5 scenario' },
  'socratic_thinker': { 'name': 'Socratic Thinker', 'icon': '🧙', 'trigger': 'Complete 5 scenarios without using hints' },
  'deep_thinker': { 'name': 'Deep Thinker', 'icon': '🤔', 'trigger': 'Complete a Dilemma-type scenario' },
  'speed_learner': { 'name': 'Speed Learner', 'icon': '🚀', 'trigger': 'Complete 3 scenarios in one day' },
  'domain_crosser': { 'name': 'Domain Crosser', 'icon': '🌉', 'trigger': 'Complete scenarios from 4 different domains' },
  'recursion_master': { 'name': 'Recursion Master', 'icon': '🔄', 'trigger': 'Complete a recursion scenario' },
  'graph_navigator': { 'name': 'Graph Navigator', 'icon': '🗺️', 'trigger': 'Complete a graph theory scenario' },
  'memory_sage': { 'name': 'Memory Sage', 'icon': '🧘', 'trigger': 'Complete a memory management scenario' },
  'ten_scenarios': { 'name': 'Scholar', 'icon': '📚', 'trigger': 'Complete 10 scenarios' },
  'all_scenarios': { 'name': 'Philosopher King', 'icon': '👑', 'trigger': 'Complete all 26 scenarios' },
  'xp_master': { 'name': 'XP Master', 'icon': '⚡', 'trigger': 'Earn 1000 XP' },
  'level_5_conqueror': { 'name': 'Level 5 Conqueror', 'icon': '🏔️', 'trigger': 'Reach Level 5' },
  'early_bird': { 'name': 'Early Bird', 'icon': '🐦', 'trigger': 'Login first thing in the morning' },
  'night_owl': { 'name': 'Night Owl', 'icon': '🦉', 'trigger': 'Complete a scenario after midnight' },
};

export function renderGamification(container) {
  if (!api.auth.isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }

  container.innerHTML = `
    <main class="page page-gamification">
      <div class="gamification-loading">
        <div class="loading-spinner"></div>
        <p>Loading your profile…</p>
      </div>
    </main>
  `;

  loadGamificationData(container.querySelector('.page-gamification'));
}

async function loadGamificationData(main) {
  let data;
  try {
    const userId = getUserIdFromToken(api.auth.getToken()) || 1;
    data = await api.getGamificationProfile(userId);
  } catch (e) {
    data = getMockData();
  }

  renderProfile(main, data);
}

function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
  } catch {
    return 1;
  }
}

function getMockData() {
  return {
    xp: 0,
    level: 1,
    levelName: 'Apprentice',
    levelColor: '#78C257',
    badges: [],
    lockedBadges: Object.entries(BADGES_DATA).map(([id, b]) => ({ id, ...b })),
    completedCount: 0,
    totalScenarios: 26,
    progressPercent: 0,
    xpToNextLevel: 200,
    nextLevelName: 'Craftsperson'
  };
}

function renderProfile(main, data) {
  const earnedBadgeIds = data.badges.map(b => b.id);
  const lockedBadges = data.lockedBadges || Object.entries(BADGES_DATA)
    .filter(([id, _]) => !earnedBadgeIds.includes(id))
    .slice(0, 8)
    .map(([id, b]) => ({ id, ...b }));

  // Calculate progress hints for locked badges
  const getProgressHint = (badgeId) => {
    const hints = {
      'ten_scenarios': { progress: data.completedCount, target: 10 },
      'xp_master': { progress: data.xp, target: 1000 },
      'level_5_conqueror': { progress: data.level, target: 5 },
      'all_scenarios': { progress: data.completedCount, target: 26 },
      'first_blood': { progress: data.completedCount >= 1 ? 1 : 0, target: 1 },
    };
    return hints[badgeId] || null;
  };

  main.innerHTML = `
    <section class="gamification-header">
      <h1>Your Journey</h1>
      <p class="subtitle">Track your philosophical Python mastery</p>
    </section>

    <section class="gamification-stats">
      <div class="xp-card glass-card">
        <div class="xp-icon">⚡</div>
        <div class="xp-info">
          <span class="xp-value">${data.xp}</span>
          <span class="xp-label">Experience Points</span>
          ${data.xpToNextLevel > 0 ? `<span class="xp-next">${data.xpToNextLevel} XP to ${data.nextLevelName || 'next level'}</span>` : '<span class="xp-next">Max level reached!</span>'}
        </div>
      </div>

      <div class="level-card glass-card">
        <div class="level-circle" style="--level-color: ${data.levelColor || '#78C257'}">
          <span class="level-number">${data.level}</span>
        </div>
        <span class="level-label">${data.levelName || 'Apprentice'}</span>
      </div>

      <div class="progress-card glass-card">
        <div class="progress-info">
          <span>${data.completedCount} / ${data.totalScenarios} Scenarios</span>
          <span>${data.progressPercent || 0}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${data.progressPercent || 0}%"></div>
        </div>
      </div>
    </section>

    <section class="badges-section">
      <h2>Badges Earned <span class="badge-count">${data.badges.length}</span></h2>
      <div class="badges-grid">
        ${data.badges.length > 0
          ? data.badges.map(b => `
              <div class="badge-card glass-card earned badge-hover-lift">
                <span class="badge-icon">${b.icon}</span>
                <span class="badge-name">${b.name}</span>
                <span class="badge-desc">${b.description || ''}</span>
                <div class="badge-earned-date">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Earned
                </div>
              </div>
            `).join('')
          : `
            <div class="badges-empty-state">
              <div class="empty-state-illustration">🏅</div>
              <p>Complete scenarios to earn badges!</p>
              <a href="#/scenarios" class="btn btn-primary">Start Learning</a>
            </div>
          `
        }
      </div>
    </section>

    <section class="badges-locked-section">
      <h2>Badges to Earn <span class="badge-count">${lockedBadges.length} remaining</span></h2>
      <div class="badges-grid">
        ${lockedBadges.map(b => {
          const progressHint = getProgressHint(b.id);
          return `
            <div class="badge-card glass-card locked">
              <span class="badge-icon">🔒</span>
              <span class="badge-name">${b.name || b.description || 'Unknown Badge'}</span>
              <span class="badge-desc">${b.description || b.trigger || ''}</span>
              ${progressHint ? `
                <div class="badge-progress">
                  <div class="badge-progress-bar">
                    <div class="badge-progress-fill" style="width: ${Math.min(100, (progressHint.progress / progressHint.target) * 100)}%"></div>
                  </div>
                  <span class="badge-progress-text">${progressHint.progress}/${progressHint.target}</span>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}