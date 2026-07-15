/**
 * pyBE Learning Dashboard - Redesigned
 * =====================================
 * An impressive, personalized learning dashboard with:
 * - Welcome header with user info and level badge
 * - Stats row (XP, Level Progress, Completion, Streak)
 * - Due Today section with urgency indicators
 * - Learning Velocity chart with trend
 * - Concept Mastery radar chart
 * - Domain Map (D3 force graph)
 * - Recent Activity timeline
 * - Badges earned section
 * - Leaderboard widget
 */

import { api } from '../lib/api.js';
import { Chart, registerables } from 'chart.js';
import { DomainMapper } from '../components/DomainMapper.js';

Chart.register(...registerables);

const LEVEL_COLORS = {
  1: '#78C257',
  2: '#4A90D9',
  3: '#9B59B6',
  4: '#E67E22',
  5: '#E74C3C'
};

const LEVEL_NAMES = {
  1: 'Apprentice',
  2: 'Craftsperson',
  3: 'Scholar',
  4: 'Architect',
  5: 'Pythonista'
};

let velocityChartInstance = null;

export function renderDashboard(container) {
  if (!api.auth.isAuthenticated()) {
    window.location.hash = '#/login';
    return;
  }

  container.innerHTML = `
    <div class="dashboard-page">
      <div class="dashboard-loading" id="dashboard-loading">
        <div class="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
      <div id="dashboard-content" style="display: none;"></div>
    </div>
  `;

  loadDashboardData().then(data => {
    renderDashboardContent(document.getElementById('dashboard-content'), data);
    document.getElementById('dashboard-loading').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'block';
    // Initialize scroll reveal for dashboard content
    setTimeout(initScrollReveal, 100);
  }).catch(err => {
    console.error('Dashboard error:', err);
    const errorMsg = err?.message || err?.reason?.message || String(err);
    document.getElementById('dashboard-loading').innerHTML = `
      <div class="dashboard-error">
        <span class="error-icon">⚠️</span>
        <p>Failed to load dashboard data</p>
        <p style="font-size: 0.75rem; color: var(--text-muted); max-width: 400px; margin: 10px auto;">${errorMsg}</p>
        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `;
  });
}

async function loadDashboardData() {
  const userId = getUserIdFromToken(api.auth.getToken()) || 1;

  const [profile, dueData, userProgress, userStats, userDomains, leaderboard] = await Promise.allSettled([
    api.getGamificationProfile(userId),
    api.getDueForReview(userId),
    api.getUserProgress(userId),
    api.getUserStats(),
    api.getUserDomains(),
    api.getLeaderboard(5)
  ]);

  const result = {
    profile: profile.status === 'fulfilled' ? profile.value : null,
    dueData: dueData.status === 'fulfilled' ? (dueData.value.due || []) : { due: [] },
    userProgress: userProgress.status === 'fulfilled' ? (userProgress.value.progress || []) : { progress: [] },
    userStats: userStats.status === 'fulfilled' ? userStats.value : null,
    userDomains: userDomains.status === 'fulfilled' ? userDomains.value : null,
    leaderboard: leaderboard.status === 'fulfilled' ? Array.isArray(leaderboard.value) ? leaderboard.value : (leaderboard.value.leaderboard || []) : []
  };

  console.log('Dashboard data loaded:', result);

  if (profile.status === 'rejected') {
    console.error('Profile error:', profile.reason);
  }
  if (dueData.status === 'rejected') {
    console.error('Due data error:', dueData.reason);
  }
  if (userProgress.status === 'rejected') {
    console.error('User progress error:', userProgress.reason);
  }
  if (userStats.status === 'rejected') {
    console.error('User stats error:', userStats.reason);
  }
  if (userDomains.status === 'rejected') {
    console.error('User domains error:', userDomains.reason);
  }
  if (leaderboard.status === 'rejected') {
    console.error('Leaderboard error:', leaderboard.reason);
  }

  return result;
}

function renderDashboardContent(container, data) {
  try {
  const { profile, dueData, userProgress, userStats, userDomains, leaderboard } = data;

  const profileData = profile || {};
  const username = profileData.username || 'Learner';
  const level = profileData.level || 1;
  const levelName = profileData.levelName || LEVEL_NAMES[level];
  const levelColor = LEVEL_COLORS[level];
  const xp = profileData.xp || 0;
  const xpToNext = profileData.xpToNextLevel || 200;
  const completedCount = profileData.completedCount || 0;
  const totalScenarios = profileData.totalScenarios || 26;
  const progressPercent = profileData.progressPercent || 0;
  const badges = profileData.badges || [];

  // Time-of-day greeting
  const hour = new Date().getHours();
  let greeting = 'Welcome back';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  const dueScenarios = Array.isArray(dueData) ? dueData : (dueData?.due || []);
  const overdueCount = dueScenarios.filter(s => s.overdue).length;

  const userProgressData = Array.isArray(userProgress) ? userProgress : (userProgress?.progress || []);
  const recentActivity = userProgressData
    .filter(p => p.status === 'completed')
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  const currentUserId = getUserIdFromToken(api.auth.getToken()) || 1;
  const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
  const currentUserRank = safeLeaderboard.findIndex(u => u.user_id === currentUserId) + 1 || null;
  const nearbyUsers = safeLeaderboard.slice(0, 5);

  const streak = calculateStreak(userProgressData);

  container.innerHTML = `
    <div class="dashboard-container">

      <!-- Header Section -->
      <header class="dashboard-header reveal-up">
        <div class="header-left">
          <h1 class="welcome-title">${greeting}, <span class="username">${escapeHtml(username)}</span></h1>
          <p class="welcome-subtitle">${getGreetingMessage(completedCount, streak, dueScenarios.length)}</p>
        </div>
        <div class="header-right">
          <div class="level-badge" style="--level-color: ${levelColor}">
            <span class="level-badge-number">${level}</span>
            <span class="level-badge-name">${levelName}</span>
          </div>
        </div>
      </header>

      <!-- Streak Calendar -->
      <section class="streak-calendar-section reveal-up" data-delay="100">
        <div class="streak-calendar-wrapper">
          <span class="streak-calendar-label">This Week</span>
          <div class="streak-calendar" id="streak-calendar"></div>
        </div>
      </section>

      <!-- Stats Row -->
      <section class="stats-row">
        <div class="stat-card xp-stat">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <span class="stat-value">${xp}</span>
            <span class="stat-label">Experience Points</span>
          </div>
          <div class="stat-next">${xpToNext > 0 ? `${xpToNext} XP to ${profileData.nextLevelName || 'next level'}` : 'Max level reached!'}</div>
        </div>

        <div class="stat-card level-stat">
          <div class="stat-icon">
            <div class="level-circle-small" style="--level-color: ${levelColor}">
              <span>${level}</span>
            </div>
          </div>
          <div class="stat-content">
            <span class="stat-value">${levelName}</span>
            <span class="stat-label">Current Level</span>
          </div>
          <div class="level-progress-mini">
            <div class="level-progress-bar" style="width: ${Math.min(100, (xp / (xp + xpToNext)) * 100)}%"></div>
          </div>
        </div>

        <div class="stat-card completion-stat">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <span class="stat-value">${completedCount}<span class="stat-total">/${totalScenarios}</span></span>
            <span class="stat-label">Scenarios Completed</span>
          </div>
          <div class="completion-percent">${progressPercent.toFixed(0)}% complete</div>
        </div>

        <div class="stat-card streak-stat">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <span class="stat-value">${streak}<span class="stat-unit">days</span></span>
            <span class="stat-label">Learning Streak</span>
          </div>
          <div class="streak-message">${streak > 0 ? 'Keep it up!' : 'Start today!'}</div>
        </div>
      </section>

      <!-- Due Today Section -->
      ${dueScenarios.length > 0 ? `
      <section class="due-today-section reveal-up" data-delay="200">
        <div class="section-header-row">
          <div class="section-title-group">
            <span class="section-icon">📅</span>
            <h2 class="section-title">Due for Review</h2>
            ${overdueCount > 0 ? `<span class="overdue-badge">${overdueCount} overdue</span>` : ''}
          </div>
          <span class="due-count">${dueScenarios.length} scenario${dueScenarios.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="due-cards-grid">
          ${dueScenarios.map(scenario => `
            <div class="due-card ${scenario.overdue ? 'overdue' : ''}" onclick="window.location.hash='#/scenario/${scenario.scenario_id || scenario.id}'">
              <div class="due-card-main">
                <div class="due-card-title">${escapeHtml(scenario.scenario_title || scenario.title)}</div>
                <div class="due-card-meta">
                  <span class="due-domain-badge" data-domain="${scenario.domain}">${scenario.domain}</span>
                  <span class="due-interval">Interval: ${scenario.interval || 1} day${(scenario.interval || 1) !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div class="due-card-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Charts Row -->
      <section class="charts-row reveal-up" data-delay="300">
        <div class="chart-card velocity-chart-card" style="grid-column: 1 / -1;">
          <div class="chart-header">
            <h3 class="chart-title">Learning Velocity</h3>
            <span class="chart-subtitle">Scenarios completed per week</span>
          </div>
          <div class="chart-container" style="height: 220px;">
            <canvas id="velocity-chart"></canvas>
          </div>
        </div>
      </section>

      <!-- Domain Map Section -->
      <section class="domain-map-section reveal-up" data-delay="400">
        <div class="section-header-row">
          <div class="section-title-group">
            <span class="section-icon">🗺️</span>
            <h2 class="section-title">Your Learning Map</h2>
          </div>
          ${userDomains?.stats ? `
          <div class="domain-stats-inline">
            <span>${userDomains.stats.domainsExplored || 0} domains</span>
            <span class="stat-divider-dot">•</span>
            <span>${userDomains.stats.conceptsLearned || 0} concepts</span>
          </div>
          ` : ''}
        </div>
        <div class="domain-map-container" id="domain-mapper-container">
          <div class="domain-mapper-empty">
            <p>Complete scenarios to build your learning graph!</p>
          </div>
        </div>
      </section>

      <!-- Bottom Row -->
      <section class="bottom-row">
        <!-- Recent Activity -->
        <div class="bottom-card recent-activity-card">
          <div class="card-header">
            <h3 class="card-title">Recent Activity</h3>
          </div>
          <div class="activity-timeline">
            ${recentActivity.length > 0 ? recentActivity.map(activity => `
              <div class="activity-item" onclick="window.location.hash='#/scenario/${activity.scenario_id}'">
                <div class="activity-dot"></div>
                <div class="activity-content">
                  <div class="activity-text">
                    <strong>${escapeHtml(activity.scenario_title || activity.scenario_id)}</strong>
                    <span class="activity-domain">${activity.domain}</span>
                  </div>
                  <div class="activity-time">${formatTimeAgo(activity.updated_at)}</div>
                </div>
              </div>
            `).join('') : `
              <div class="activity-empty">
                <p>No completed scenarios yet. Start learning!</p>
              </div>
            `}
          </div>
        </div>

        <!-- Badges Section -->
        <div class="bottom-card badges-card">
          <div class="card-header">
            <h3 class="card-title">Badges Earned</h3>
            <span class="badge-count-label">${badges.length}</span>
          </div>
          <div class="badges-scroll-container">
            ${badges.length > 0 ? `
              <div class="badges-scroll">
                ${badges.map(badge => `
                  <div class="earned-badge" title="${badge.description || badge.trigger || ''}">
                    <span class="badge-emoji">${badge.icon}</span>
                    <span class="badge-name">${badge.name}</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="badges-empty">
                <p>Complete scenarios to earn badges! 🏅</p>
              </div>
            `}
          </div>
          <a href="#/gamification" class="view-all-link">View all badges →</a>
        </div>
      </section>

      <!-- Leaderboard Widget -->
      ${nearbyUsers.length > 0 ? `
      <section class="leaderboard-widget">
        <div class="section-header-row">
          <div class="section-title-group">
            <span class="section-icon">🏆</span>
            <h2 class="section-title">Leaderboard</h2>
          </div>
          ${currentUserRank ? `<span class="your-rank">Your rank: #${currentUserRank}</span>` : ''}
        </div>
        <div class="leaderboard-list">
          ${nearbyUsers.map((user, index) => `
            <div class="leaderboard-item ${user.user_id === currentUserId ? 'current-user' : ''}">
              <div class="rank-number ${index < 3 ? `rank-top-${index + 1}` : ''}">#${index + 1}</div>
              <div class="leaderboard-user">
                <div class="user-avatar-small" style="background: ${LEVEL_COLORS[user.level] || LEVEL_COLORS[1]}">
                  ${user.username.charAt(0).toUpperCase()}
                </div>
                <span class="user-name">${escapeHtml(user.username)}</span>
              </div>
              <div class="leaderboard-stats">
                <span class="leaderboard-xp">${user.xp} XP</span>
                <span class="leaderboard-level" style="color: ${LEVEL_COLORS[user.level] || LEVEL_COLORS[1]}">${user.levelName}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}
    </div>
  `;

  initCharts(data);
  initDomainMapper(data);
  } catch (err) {
    console.error('Render dashboard error:', err);
    container.innerHTML = `
      <div class="dashboard-container">
        <div class="dashboard-error">
          <span class="error-icon">⚠️</span>
          <p>Error rendering dashboard</p>
          <p style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(err.message)}</p>
        </div>
      </div>
    `;
  }
}

function initCharts(data) {
  const progress = Array.isArray(data.userProgress) ? data.userProgress : (data.userProgress?.progress || []);
  renderVelocityChart(progress);
  renderStreakCalendar(progress);
}

function renderVelocityChart(progress) {
  const ctx = document.getElementById('velocity-chart')?.getContext('2d');
  if (!ctx) return;

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const gridColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';
  const tickColor = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';

  const now = new Date();
  const weeks = 8;
  const weekLabels = [];
  const weekData = [];
  let totalCompleted = 0;

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = progress.filter(p => {
      if (!p.updated_at || p.status !== 'completed') return false;
      const updated = new Date(p.updated_at);
      return updated >= weekStart && updated < weekEnd;
    }).length;

    totalCompleted += count;
    const label = i === 0 ? 'This Week' : `Week ${weeks - i}`;
    weekLabels.push(label);
    weekData.push(count);
  }

  const avgCompleted = totalCompleted / weeks;

  if (velocityChartInstance) {
    velocityChartInstance.destroy();
  }
  velocityChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weekLabels,
      datasets: [{
        label: 'Completed',
        data: weekData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isLight ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
          titleColor: isLight ? '#000' : '#000',
          bodyColor: isLight ? '#333' : '#333',
          padding: 12,
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: tickColor,
            font: { size: 11 }
          },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: tickColor, font: { size: 10 } },
          grid: { display: false }
        }
      }
    }
  });
  velocityChartInstance = velocityChartInstance || null;
}

function initDomainMapper(data) {
  const { userDomains } = data;
  const container = document.getElementById('domain-mapper-container');

  if (!container || !userDomains?.nodes || userDomains.nodes.length <= 1) {
    return;
  }

  const mapper = new DomainMapper('domain-mapper-container');
  mapper.render(userDomains);
}

function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
  } catch {
    return null;
  }
}

function getGreetingMessage(completedCount, streak, dueCount) {
  if (completedCount === 0) {
    return 'Begin your philosophical Python journey today';
  }
  if (dueCount > 3) {
    return `You have ${dueCount} scenarios waiting for review. Time to practice!`;
  }
  if (streak > 7) {
    return `Amazing! ${streak}-day learning streak! Keep the momentum going!`;
  }
  if (streak > 0) {
    return `${streak}-day streak! Small steps lead to big achievements.`;
  }
  return 'Continue your philosophical Python journey';
}

function renderStreakCalendar(progress) {
  const calendar = document.getElementById('streak-calendar');
  if (!calendar) return;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOfWeek + i);
    dates.push(d);
  }

  const completedDates = new Set(
    progress
      .filter(p => p.status === 'completed' && p.updated_at)
      .map(p => new Date(p.updated_at).toDateString())
  );

  calendar.innerHTML = dates.map((d, i) => {
    const isCompleted = completedDates.has(d.toDateString());
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return `
      <div class="streak-day-wrapper" title="${d.toLocaleDateString()}">
        <span class="streak-day-label">${dayNames[i]}</span>
        <div class="streak-day ${isCompleted ? 'active' : ''}"></div>
      </div>
    `;
  }).join('');
}

function calculateStreak(progressRecords) {
  if (!progressRecords || progressRecords.length === 0) return 0;

  const completedDates = progressRecords
    .filter(p => p.status === 'completed' && p.updated_at)
    .map(p => new Date(p.updated_at).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));

  if (completedDates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (completedDates[0] !== today && completedDates[0] !== yesterday) {
    return 0;
  }

  let checkDate = new Date(completedDates[0]);
  for (const dateStr of completedDates) {
    const currentDate = new Date(dateStr);
    const diffDays = Math.floor((checkDate - currentDate) / 86400000);

    if (diffDays <= 1) {
      streak++;
      checkDate = currentDate;
    } else {
      break;
    }
  }

  return streak;
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return 'Unknown';

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}