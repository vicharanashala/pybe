/**
 * NotificationDropdown Component
 * ===============================
 * Dropdown panel showing all notifications with read/unread state.
 */

import { api } from '../lib/api.js';

export class NotificationDropdown {
  constructor(triggerElement) {
    this.trigger = triggerElement;
    this.isOpen = false;
    this.notifications = [];
    this.unreadCount = 0;
    this.pollInterval = null;
    this.POLL_INTERVAL_MS = 60000;
  }

  async init() {
    this.createDropdown();
    this.attachEventListeners();
    this.startPolling();
  }

  createDropdown() {
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'notification-dropdown';
    this.dropdown.id = 'notification-dropdown';
    this.dropdown.innerHTML = this.getDropdownHTML();
    document.body.appendChild(this.dropdown);
  }

  getDropdownHTML() {
    return `
      <div class="dropdown-header">
        <h3>Notifications</h3>
        <button id="mark-all-read" class="btn-ghost btn-sm" title="Mark all as read">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Mark all read
        </button>
      </div>
      <div class="dropdown-body" id="notification-list">
        <div class="notification-loading">
          <div class="loading-spinner small"></div>
          <span>Loading...</span>
        </div>
      </div>
      <div class="dropdown-footer">
        <a href="#/dashboard" class="view-all-link">View all in Dashboard</a>
      </div>
    `;
  }

  attachEventListeners() {
    // Use document-level delegation for more reliable click handling
    document.addEventListener('click', (e) => {
      const notificationsBtn = e.target.closest('#notifications-btn');

      if (notificationsBtn === this.trigger) {
        e.stopPropagation();
        this.toggle();
        return;
      }

      if (this.isOpen && !this.dropdown.contains(e.target)) {
        this.close();
      }
    });

    this.dropdown.addEventListener('click', async (e) => {
      const markAllBtn = e.target.closest('#mark-all-read');
      if (markAllBtn) {
        e.stopPropagation();
        await this.markAllAsRead();
        return;
      }

      const viewAllLink = e.target.closest('.view-all-link');
      if (viewAllLink) {
        this.close();
        return;
      }

      const notificationItem = e.target.closest('.notification-item');
      if (notificationItem && !notificationItem.classList.contains('loading')) {
        await this.handleNotificationClick(notificationItem);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  async toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  async open() {
    this.isOpen = true;
    this.dropdown.classList.add('open');
    this.trigger.classList.add('active');
    this.updatePosition();
    await this.loadNotifications();
  }

  close() {
    this.isOpen = false;
    this.dropdown.classList.remove('open');
    this.trigger.classList.remove('active');
  }

  updatePosition() {
    const rect = this.trigger.getBoundingClientRect();
    const dropdownRect = this.dropdown.getBoundingClientRect();

    let top = rect.bottom + 8;
    let left = rect.right - dropdownRect.width;

    if (left < 8) left = 8;
    if (left + dropdownRect.width > window.innerWidth - 8) {
      left = window.innerWidth - dropdownRect.width - 8;
    }

    if (top + dropdownRect.height > window.innerHeight - 8) {
      top = rect.top - dropdownRect.height - 8;
    }

    this.dropdown.style.top = `${top}px`;
    this.dropdown.style.left = `${left}px`;
  }

  async loadNotifications() {
    const listEl = this.dropdown.querySelector('#notification-list');
    listEl.innerHTML = `
      <div class="notification-loading">
        <div class="loading-spinner small"></div>
        <span>Loading...</span>
      </div>
    `;

    try {
      const data = await api.notifications.get(false);
      this.notifications = data.notifications || [];
      this.unreadCount = data.unreadCount || 0;
      this.renderNotifications();
    } catch (e) {
      listEl.innerHTML = `
        <div class="notification-empty">
          <span>Unable to load notifications</span>
        </div>
      `;
    }
  }

  renderNotifications() {
    const listEl = this.dropdown.querySelector('#notification-list');

    if (this.notifications.length === 0) {
      listEl.innerHTML = `
        <div class="notification-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span>No notifications yet</span>
        </div>
      `;
      return;
    }

    listEl.innerHTML = this.notifications.map(n => this.renderNotificationItem(n)).join('');

    this.updateBadgeCount();
  }

  renderNotificationItem(notification) {
    const icon = this.getTypeIcon(notification.type);
    const timeAgo = this.getRelativeTime(notification.createdAt);
    const unreadClass = notification.isRead ? '' : 'unread';

    return `
      <div class="notification-item ${unreadClass}" data-id="${notification.id}" data-link="${notification.link}">
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
          <div class="notification-title">${this.escapeHtml(notification.title)}</div>
          <div class="notification-message">${this.escapeHtml(notification.message)}</div>
          <div class="notification-time">${timeAgo}</div>
        </div>
        ${!notification.isRead ? '<div class="unread-dot"></div>' : ''}
      </div>
    `;
  }

  getTypeIcon(type) {
    switch (type) {
      case 'review_approved':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>`;
      case 'review_changes':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>`;
      case 'review_rejected':
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>`;
      default:
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>`;
    }
  }

  getRelativeTime(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }

  async handleNotificationClick(item) {
    const notificationId = parseInt(item.dataset.id, 10);
    const link = item.dataset.link;

    if (item.classList.contains('unread')) {
      try {
        await api.notifications.markRead(notificationId);
        item.classList.remove('unread');
        const unreadDot = item.querySelector('.unread-dot');
        if (unreadDot) unreadDot.remove();
        this.updateBadgeCount();
      } catch (e) {
        console.error('Failed to mark notification as read:', e);
      }
    }

    if (link) {
      this.close();
      window.location.hash = `#${link}`;
    }
  }

  async markAllAsRead() {
    try {
      await api.notifications.markAllRead();
      const items = this.dropdown.querySelectorAll('.notification-item.unread');
      items.forEach(item => {
        item.classList.remove('unread');
        item.classList.add('read');
        const unreadDot = item.querySelector('.unread-dot');
        if (unreadDot) unreadDot.remove();
      });
      this.unreadCount = 0;
      this.updateBadgeCount();
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  }

  updateBadgeCount() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const badge = header.querySelector('#notification-badge');
    if (!badge) return;

    if (this.unreadCount > 0) {
      badge.textContent = this.unreadCount > 9 ? '9+' : this.unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  startPolling() {
    this.stopPolling();
    this.pollInterval = setInterval(() => {
      if (this.isOpen) {
        this.loadNotifications();
      }
    }, this.POLL_INTERVAL_MS);
  }

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  destroy() {
    this.stopPolling();
    if (this.dropdown && this.dropdown.parentNode) {
      this.dropdown.parentNode.removeChild(this.dropdown);
    }
  }
}

export function createNotificationDropdown(triggerElement) {
  const dropdown = new NotificationDropdown(triggerElement);
  dropdown.init();
  return dropdown;
}