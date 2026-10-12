import { describe, it, expect, beforeEach } from 'vitest';
import {
  LocalStorageTracker,
  NoopAnalyticsTracker,
  PlausibleAnalyticsTracker,
  setTrackerForTesting,
  getTracker,
  trackEvent,
} from '../../src/analytics/tracker.ts';
import { EVENTS } from '../../src/analytics/events.ts';

describe('LocalStorageTracker (Phase 9 analytics)', () => {
  let tracker: LocalStorageTracker;
  beforeEach(() => {
    window.localStorage.clear();
    tracker = new LocalStorageTracker();
    setTrackerForTesting(tracker);
  });

  it('is supported in the browser', () => {
    expect(tracker.isSupported()).toBe(true);
  });

  it('identifies the learner', () => {
    tracker.identify('anon-uuid-123');
    // Identification alone doesn't queue an event.
    expect(tracker.list().length).toBe(0);
  });

  it('tracks case_started with whitelisted props', () => {
    trackEvent('case_started', {
      caseStudyId: 'cs_001',
      piagetStage: 'concrete',
    });
    const events = tracker.list();
    expect(events.length).toBe(1);
    expect(events[0]?.name).toBe('case_started');
    expect(events[0]?.props.caseStudyId).toBe('cs_001');
  });

  it('persists events to localStorage on flush()', async () => {
    trackEvent('reasoning_submitted', { caseStudyId: 'cs_001', length: 80 });
    trackEvent('reveal_unlocked', { caseStudyId: 'cs_001', constructs: 'list,for' });
    const flushed = await tracker.flush();
    expect(flushed).toBe(2);
    expect(tracker.list().length).toBe(0);
    const raw = window.localStorage.getItem('pybe:analytics:v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as { name: string }[];
    expect(parsed.length).toBe(2);
    expect(parsed[0]?.name).toBe('reasoning_submitted');
  });

  it('auto-persists when the buffer reaches 20 events', () => {
    for (let i = 0; i < 20; i++) {
      trackEvent('feedback_submitted', { score: 5, hasComment: false });
    }
    // After the 20th event, the buffer is auto-persisted.
    expect(tracker.list().length).toBe(0);
    const raw = window.localStorage.getItem('pybe:analytics:v1');
    const parsed = JSON.parse(raw!) as unknown[];
    expect(parsed.length).toBe(20);
  });

  it('produces the documented event taxonomy (no PII allowed)', () => {
    expect(EVENTS.case_started).toBe('case_started');
    expect(EVENTS.reasoning_submitted).toBe('reasoning_submitted');
    expect(EVENTS.reveal_unlocked).toBe('reveal_unlocked');
    expect(EVENTS.run_code_success).toBe('run_code_success');
    expect(EVENTS.run_code_failure).toBe('run_code_failure');
    expect(EVENTS.level_unlocked).toBe('level_unlocked');
    expect(EVENTS.feedback_submitted).toBe('feedback_submitted');
  });
});

describe('NoopAnalyticsTracker', () => {
  it('reports unsupported and is a safe fallback', () => {
    const t = new NoopAnalyticsTracker();
    expect(t.isSupported()).toBe(false);
    expect(async () => {
      await t.flush();
    }).not.toThrow();
  });
});

describe('PlausibleAnalyticsTracker', () => {
  it('forwards events to the inner tracker (offline-first)', () => {
    let captured: { url: string; body: string; method?: string } | null = null;
    const fakeFetch: typeof fetch = (async (input, init) => {
      captured = {
        url: String(input),
        body: (init?.body as string) ?? '',
        method: init?.method,
      };
      return new Response('ok', { status: 200 });
    }) as typeof fetch;
    const inner = new LocalStorageTracker();
    const outer = new PlausibleAnalyticsTracker(
      { endpoint: 'http://example.test/api/event', site: 'pybe.local', fetchImpl: fakeFetch },
      inner,
    );
    outer.identify('anon-uuid');
    outer.track({
      name: 'case_started',
      userId: 'anon-uuid',
      ts: Date.now(),
      props: { caseStudyId: 'cs_001', piagetStage: 'concrete' },
    });
    // Inner retains the event for durability.
    expect(inner.list().length).toBe(1);
    // Fire-and-forget POST happened.
    expect(captured).toBeTruthy();
    expect(captured!.method).toBe('POST');
    expect(captured!.body).toContain('"name":"case_started"');
    expect(captured!.url).toBe('http://example.test/api/event');
  });

  it('does not crash when fetch is missing', () => {
    const inner = new LocalStorageTracker();
    const outer = new PlausibleAnalyticsTracker(
      // No fetchImpl, no endpoint.
      { endpoint: '' },
      inner,
    );
    expect(() => {
      outer.track({
        name: 'feedback_submitted',
        userId: 'anon',
        ts: 0,
        props: { score: 5, hasComment: false },
      });
    }).not.toThrow();
  });
});

describe('module-level singleton + test seam', () => {
  it('returns the active tracker; setTrackerForTesting swaps it; null resets', () => {
    expect(getTracker()).toBeDefined();
    setTrackerForTesting(new LocalStorageTracker());
    expect(getTracker()).toBeInstanceOf(LocalStorageTracker);
    setTrackerForTesting(null);
    expect(getTracker()).toBeDefined();
  });
});