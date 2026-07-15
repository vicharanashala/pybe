/**
 * DiscussionPanel Component Tests
 * ================================
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DiscussionPanel } from '../src/components/DiscussionPanel.js';

const mockApi = {
  getDiscussions: vi.fn(),
  addDiscussion: vi.fn(),
  upvoteDiscussion: vi.fn()
};

vi.mock('../src/lib/api.js', () => ({
  api: mockApi
}));

function createMockThread(overrides = {}) {
  return {
    id: 1,
    author: 'TestUser',
    text: 'This is a test comment',
    python_construct: '',
    domain_connection: '',
    upvotes: 5,
    is_accepted: false,
    timestamp: new Date().toISOString(),
    replies: [],
    ...overrides
  };
}

describe('DiscussionPanel', () => {
  let container;
  let panel;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'discussion-container';
    document.body.appendChild(container);

    mockApi.getDiscussions.mockResolvedValue({ threads: [] });
    mockApi.addDiscussion.mockResolvedValue({});
    mockApi.upvoteDiscussion.mockResolvedValue({});
  });

  afterEach(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create a DiscussionPanel instance', () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      expect(panel).toBeDefined();
    });

    it('should store scenarioId', () => {
      panel = new DiscussionPanel('discussion-container', 'my-scenario');
      expect(panel.scenarioId).toBe('my-scenario');
    });

    it('should initialize with empty threads', () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      expect(panel.threads).toEqual([]);
    });
  });

  describe('init', () => {
    it('should load threads and render', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      expect(mockApi.getDiscussions).toHaveBeenCalledWith('test-scenario');
    });

    it('should render the discussion panel', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      expect(container.querySelector('.discussion-panel')).toBeDefined();
      expect(container.querySelector('#disc-author')).toBeDefined();
      expect(container.querySelector('#disc-construct')).toBeDefined();
      expect(container.querySelector('#disc-domain')).toBeDefined();
      expect(container.querySelector('#disc-text')).toBeDefined();
      expect(container.querySelector('#disc-submit')).toBeDefined();
    });

    it('should render empty state when no threads', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      expect(container.querySelector('.disc-empty')).toBeDefined();
      expect(container.querySelector('.disc-empty').textContent).toContain('No comments yet');
    });
  });

  describe('render', () => {
    it('should create compose section with all form elements', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      expect(container.querySelector('#disc-author')).toBeDefined();
      expect(container.querySelector('#disc-construct')).toBeDefined();
      expect(container.querySelector('#disc-domain')).toBeDefined();
      expect(container.querySelector('#disc-text')).toBeDefined();
      expect(container.querySelector('#disc-submit')).toBeDefined();
    });

    it('should populate construct options', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      const constructSelect = container.querySelector('#disc-construct');
      expect(constructSelect.options.length).toBeGreaterThan(1);
    });

    it('should populate domain options', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      const domainSelect = container.querySelector('#disc-domain');
      expect(domainSelect.options.length).toBeGreaterThan(1);
    });

    it('should render threads section', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      expect(container.querySelector('#disc-threads')).toBeDefined();
    });
  });

  describe('renderThread', () => {
    it('should render a thread with author and text', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ author: 'Alice', text: 'Great insight!' })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('Alice');
      expect(html).toContain('Great insight!');
    });

    it('should show construct tag when present', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ python_construct: 'Recursion' })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('construct-tag');
      expect(html).toContain('Recursion');
    });

    it('should show domain tag when present', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ domain_connection: 'Philosophy' })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('domain-tag');
      expect(html).toContain('Philosophy');
    });

    it('should show accepted badge for exemplary comments', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ is_accepted: true })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('accepted-badge');
      expect(html).toContain('Exemplary');
    });

    it('should render upvote button with count', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ upvotes: 10 })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('disc-upvote');
      expect(html).toContain('10');
    });

    it('should render reply button', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ id: 42 })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('disc-reply-btn');
      expect(html).toContain('data-comment-id="42"');
    });

    it('should escape HTML in author and text', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ author: '<script>alert("xss")</script>', text: 'Test' })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });

    it('should add accepted class to accepted threads', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ is_accepted: true })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('disc-thread accepted');
    });

    it('should render replies when present', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({
        id: 1,
        replies: [
          { id: 2, author: 'Bob', text: 'Reply text', timestamp: new Date().toISOString() }
        ]
      })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).toContain('disc-replies');
      expect(html).toContain('Bob');
      expect(html).toContain('Reply text');
    });

    it('should not render replies section when no replies', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ replies: [] })];

      const html = panel.renderThread(panel.threads[0]);
      expect(html).not.toContain('disc-replies');
    });
  });

  describe('renderReply', () => {
    it('should render reply with author and text', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      const reply = { id: 2, author: 'Carol', text: 'Reply content', timestamp: new Date().toISOString() };

      const html = panel.renderReply(reply);
      expect(html).toContain('Carol');
      expect(html).toContain('Reply content');
    });

    it('should escape HTML in reply', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      const reply = { id: 2, author: '<XSS>', text: 'Test', timestamp: new Date().toISOString() };

      const html = panel.renderReply(reply);
      expect(html).not.toContain('<XSS>');
      expect(html).toContain('&lt;XSS&gt;');
    });
  });

  describe('renderThreads', () => {
    it('should render empty message when no threads', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [];

      const html = panel.renderThreads();
      expect(html).toContain('No comments yet');
    });

    it('should render multiple threads', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [
        createMockThread({ id: 1, author: 'User1' }),
        createMockThread({ id: 2, author: 'User2' })
      ];

      const html = panel.renderThreads();
      expect(html).toContain('User1');
      expect(html).toContain('User2');
    });
  });

  describe('postComment', () => {
    it('should call api.addDiscussion with form values', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      document.getElementById('disc-author').value = 'TestUser';
      document.getElementById('disc-text').value = 'My comment';
      document.getElementById('disc-construct').value = 'Recursion';
      document.getElementById('disc-domain').value = 'Philosophy';

      await panel.postComment();

      expect(mockApi.addDiscussion).toHaveBeenCalledWith(
        'test-scenario', 'TestUser', 'My comment', 'Recursion', 'Philosophy', null
      );
    });

    it('should reload threads after posting', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      mockApi.getDiscussions.mockResolvedValueOnce({ threads: [] });

      document.getElementById('disc-text').value = 'My comment';
      await panel.postComment();

      expect(mockApi.getDiscussions).toHaveBeenCalled();
    });

    it('should not post if text is empty', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      document.getElementById('disc-text').value = '';
      await panel.postComment();

      expect(mockApi.addDiscussion).not.toHaveBeenCalled();
    });
  });

  describe('upvote handling', () => {
    it('should call upvote API on upvote button click', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ id: 5, scenario_id: 'test-scenario' })];
      panel.render();

      const upvoteBtn = container.querySelector('.disc-upvote');
      await upvoteBtn.click();

      expect(mockApi.upvoteDiscussion).toHaveBeenCalledWith('test-scenario', '5');
    });
  });

  describe('reply handling', () => {
    it('should show reply form when reply button clicked', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ id: 10 })];
      panel.render();

      const replyBtn = container.querySelector('.disc-reply-btn');
      replyBtn.click();

      const replyForm = container.querySelector('#reply-form-10');
      expect(replyForm.classList.contains('hidden')).toBe(false);
    });

    it('should hide reply form on cancel', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      panel.threads = [createMockThread({ id: 11 })];
      panel.render();

      const replyBtn = container.querySelector('.disc-reply-btn');
      replyBtn.click();

      const cancelBtn = container.querySelector('.disc-reply-cancel');
      cancelBtn.click();

      const replyForm = container.querySelector('#reply-form-11');
      expect(replyForm.classList.contains('hidden')).toBe(true);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');

      expect(panel.escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(panel.escapeHtml('"quotes"')).toBe('&quot;quotes&quot;');
      expect(panel.escapeHtml("'apostrophe'")).toBe('&#39;apostrophe&#39;');
    });

    it('should handle empty string', () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      expect(panel.escapeHtml('')).toBe('');
    });

    it('should handle null/undefined', () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      expect(panel.escapeHtml(null)).toBe('');
      expect(panel.escapeHtml(undefined)).toBe('');
    });
  });

  describe('loadThreads', () => {
    it('should load threads from API', async () => {
      const mockThreads = [createMockThread({ id: 1 }), createMockThread({ id: 2 })];
      mockApi.getDiscussions.mockResolvedValueOnce({ threads: mockThreads });

      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.loadThreads();

      expect(panel.threads).toEqual(mockThreads);
    });

    it('should handle API errors gracefully', async () => {
      mockApi.getDiscussions.mockRejectedValueOnce(new Error('API error'));

      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.loadThreads();

      expect(panel.threads).toEqual([]);
    });
  });

  describe('postReply', () => {
    it('should post reply with parentId', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();
      mockApi.getDiscussions.mockResolvedValue({ threads: [] });

      await panel.postReply(1, 'ReplyAuthor', 'Reply text');

      expect(mockApi.addDiscussion).toHaveBeenCalledWith(
        'test-scenario', 'ReplyAuthor', 'Reply text', null, null, 1
      );
    });
  });

  describe('destroy', () => {
    it('should remove event listeners', async () => {
      panel = new DiscussionPanel('discussion-container', 'test-scenario');
      await panel.init();

      const removeEventListenerSpy = vi.spyOn(panel._container(), 'removeEventListener');

      panel.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });
});