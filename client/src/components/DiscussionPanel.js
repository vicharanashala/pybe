/**
 * Discussion Threads Component
 * ============================
 * Peer discussion UI for each scenario with threading, construct tagging, and author attribution.
 */

import { api } from '../lib/api.js';

const CONSTRUCT_OPTIONS = [
    { value: '', label: 'Tag a Python construct (optional)' },
    { value: 'dir()', label: 'dir()' },
    { value: 'getattr()', label: 'getattr()' },
    { value: 'hasattr()', label: 'hasattr()' },
    { value: 'inspect', label: 'inspect module' },
    { value: 'heapq', label: 'heapq' },
    { value: 'yield', label: 'yield/generator' },
    { value: 'with', label: 'with statement' },
    { value: 'lambda', label: 'lambda' },
    { value: 'recursion', label: 'recursion' },
    { value: 'yield from', label: 'yield from' },
    { value: 'context manager', label: 'context manager' },
];

const DOMAIN_OPTIONS = [
    { value: '', label: 'Which domain clicked for you? (optional)' },
    { value: 'Literature', label: 'Literature' },
    { value: 'Folklore', label: 'Folklore' },
    { value: 'Science', label: 'Science' },
    { value: 'Music', label: 'Music' },
    { value: 'Philosophy', label: 'Philosophy' },
    { value: 'Pop Culture', label: 'Pop Culture' },
];

export class DiscussionPanel {
    constructor(containerId, scenarioId) {
        this.container = document.getElementById(containerId);
        this.scenarioId = scenarioId;
        this.threads = [];
        this._boundHandleUpvote = this._handleUpvote.bind(this);
        this._boundHandleReply = this._handleReply.bind(this);
    }

    async init() {
        await this.loadThreads();
        this.render();
        this._container().addEventListener('click', this._boundHandleUpvote);
        this._container().addEventListener('click', this._boundHandleReply);
    }

    _container() {
        return this.container.querySelector('#disc-threads') || this.container;
    }

    async loadThreads() {
        try {
            const data = await api.getDiscussions(this.scenarioId);
            this.threads = data.threads || [];
        } catch (e) {
            this.threads = [];
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="discussion-panel">
                <h3>Discussion</h3>
                <div class="discussion-compose">
                    <input type="text" id="disc-author" placeholder="Your name" class="disc-input" />
                    <select id="disc-construct" class="disc-input disc-select">
                        ${CONSTRUCT_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
                    </select>
                    <select id="disc-domain" class="disc-input disc-select">
                        ${DOMAIN_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
                    </select>
                    <textarea id="disc-text" placeholder="Share your approach to this scenario..." class="disc-textarea"></textarea>
                    <button id="disc-submit" class="btn btn-primary btn-sm">Post Comment</button>
                </div>
                <div class="discussion-threads" id="disc-threads" data-scenario-id="${this.scenarioId}">
                    ${this.renderThreads()}
                </div>
            </div>
        `;

        document.getElementById('disc-submit')?.addEventListener('click', () => this.postComment());
    }

    renderThreads() {
        if (this.threads.length === 0) {
            return '<p class="disc-empty">No comments yet. Be the first to share your perspective!</p>';
        }
        return this.threads.map(t => this.renderThread(t)).join('');
    }

    renderThread(thread) {
        const constructBadge = thread.python_construct
            ? `<span class="construct-tag">${thread.python_construct}</span>`
            : '';
        const acceptedBadge = thread.is_accepted
            ? '<span class="accepted-badge">★ Exemplary</span>'
            : '';
        const domainBadge = thread.domain_connection
            ? `<span class="domain-tag">${thread.domain_connection}</span>`
            : '';

        return `
            <div class="disc-thread ${thread.is_accepted ? 'accepted' : ''}" data-id="${thread.id}">
                <div class="disc-header">
                    <strong>${this.escapeHtml(thread.author)}</strong>
                    ${constructBadge}
                    ${domainBadge}
                    ${acceptedBadge}
                    <span class="disc-time">${new Date(thread.timestamp).toLocaleString()}</span>
                </div>
                <p class="disc-body">${this.escapeHtml(thread.text)}</p>
                <div class="disc-actions">
                    <button class="disc-upvote" data-comment-id="${thread.id}">👍 ${thread.upvotes}</button>
                    <button class="disc-reply-btn" data-comment-id="${thread.id}" data-author="${this.escapeHtml(thread.author)}">Reply</button>
                </div>
                ${thread.replies && thread.replies.length > 0 ? `
                    <div class="disc-replies">
                        ${thread.replies.map(r => this.renderReply(r)).join('')}
                    </div>
                ` : ''}
                <div class="reply-form hidden" id="reply-form-${thread.id}">
                    <input type="text" class="disc-input reply-author" placeholder="Your name" />
                    <textarea class="disc-textarea reply-text" placeholder="Write your reply..."></textarea>
                    <div class="reply-actions">
                        <button class="btn btn-primary btn-sm disc-reply-submit" data-parent-id="${thread.id}">Submit Reply</button>
                        <button class="btn btn-ghost btn-sm disc-reply-cancel" data-parent-id="${thread.id}">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderReply(reply) {
        return `
            <div class="disc-reply" data-id="${reply.id}">
                <div class="disc-reply-header">
                    <strong>${this.escapeHtml(reply.author)}</strong>
                    <span class="disc-time">${new Date(reply.timestamp).toLocaleString()}</span>
                </div>
                <p class="disc-reply-body">${this.escapeHtml(reply.text)}</p>
            </div>
        `;
    }

    async postComment(parentId = null) {
        const author = document.getElementById('disc-author')?.value || 'Anonymous';
        const text = document.getElementById('disc-text')?.value;
        const construct = document.getElementById('disc-construct')?.value;
        const domain = document.getElementById('disc-domain')?.value;

        if (!text) return;

        try {
            await api.addDiscussion(this.scenarioId, author, text, construct, domain, parentId);
            await this.loadThreads();
            this.render();
        } catch (e) {
            console.error('Failed to post comment', e);
        }
    }

    _handleUpvote(e) {
        const btn = e.target.closest('.disc-upvote');
        if (!btn) return;

        const commentId = btn.dataset.commentId;
        const container = this._container();
        const scenarioId = container.dataset.scenarioId;

        if (!commentId || !scenarioId) return;

        api.upvoteDiscussion(scenarioId, commentId)
            .then(() => this.loadThreads())
            .then(() => this.render())
            .catch(e => console.error('Upvote failed', e));
    }

    _handleReply(e) {
        const replyBtn = e.target.closest('.disc-reply-btn');
        const submitBtn = e.target.closest('.disc-reply-submit');
        const cancelBtn = e.target.closest('.disc-reply-cancel');

        if (replyBtn) {
            const commentId = replyBtn.dataset.commentId;
            const replyForm = document.getElementById(`reply-form-${commentId}`);
            if (replyForm) {
                replyForm.classList.remove('hidden');
            }
        }

        if (submitBtn) {
            const parentId = parseInt(submitBtn.dataset.parentId, 10);
            const replyForm = submitBtn.closest('.reply-form');
            const authorInput = replyForm.querySelector('.reply-author');
            const textInput = replyForm.querySelector('.reply-text');

            const author = authorInput?.value || 'Anonymous';
            const text = textInput?.value;

            if (text) {
                this.postReply(parentId, author, text);
            }
        }

        if (cancelBtn) {
            const parentId = cancelBtn.dataset.parentId;
            const replyForm = document.getElementById(`reply-form-${parentId}`);
            if (replyForm) {
                replyForm.classList.add('hidden');
            }
        }
    }

    async postReply(parentId, author, text) {
        try {
            await api.addDiscussion(this.scenarioId, author, text, null, null, parentId);
            await this.loadThreads();
            this.render();
        } catch (e) {
            console.error('Failed to post reply', e);
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this._container()) {
            this._container().removeEventListener('click', this._boundHandleUpvote);
            this._container().removeEventListener('click', this._boundHandleReply);
        }
    }
}