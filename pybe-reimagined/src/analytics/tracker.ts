/**
 * AnalyticsTracker — interface for capturing learner events.
 *
 * INV-A5 (DIP): UI depends on the interface. The production wiring is
 * `LocalStorageTracker` (offline-first) which we can later swap for a
 * Plausible-style HTTP tracker behind the same surface.
 *
 * Privacy contract: NO PII in events. Only an anonymous UUID and the
 * whitelisted event props (see `events.ts`).
 */
import type { AnalyticsEvent, EventName, EventOf, EventPropsByName } from './events.ts';

export interface AnalyticsTracker {
  isSupported(): boolean;
  track<N extends EventName>(event: EventOf<N>): void;
  /** Batch-flush any buffered events. Returns the count flushed. */
  flush(): Promise<number>;
  /** Identify the current learner (anonymous UUID; never PII). */
  identify(learnerId: string): void;
}

/** Noop tracker for SSR or disabled-analytics contexts. */
export class NoopAnalyticsTracker implements AnalyticsTracker {
  isSupported(): boolean {
    return false;
  }
  track(): void {
    /* no-op */
  }
  async flush(): Promise<number> {
    return 0;
  }
  identify(): void {
    /* no-op */
  }
}

/** Local-storage backed. Buffers events in localStorage and exposes a flush(). */
const LS_KEY = 'pybe:analytics:v1';

export class LocalStorageTracker implements AnalyticsTracker {
  private userId: string = '';
  private queue: AnalyticsEvent[] = [];

  isSupported(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  identify(learnerId: string): void {
    this.userId = learnerId;
  }

  track<N extends EventName>(event: EventOf<N>): void {
    if (!this.isSupported()) return;
    this.queue.push({ ...event, userId: event.userId || this.userId });
    if (this.queue.length >= 20) {
      // Auto-persist to localStorage when the buffer grows.
      this.persist();
    }
  }

  flush(): Promise<number> {
    if (!this.isSupported()) return Promise.resolve(0);
    const count = this.queue.length;
    this.persist();
    return Promise.resolve(count);
  }

  /** Returns the events currently buffered (for inspection / tests). */
  list(): readonly AnalyticsEvent[] {
    return this.queue.slice();
  }

  private persist(): void {
    try {
      const existing = this.readPersisted();
      const combined = [...existing, ...this.queue];
      window.localStorage.setItem(LS_KEY, JSON.stringify(combined));
      this.queue = [];
    } catch {
      /* best-effort */
    }
  }

  private readPersisted(): AnalyticsEvent[] {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    } catch {
      return [];
    }
  }

  /** For tests: drain persisted events. */
  resetPersisted(): void {
    if (this.isSupported()) {
      window.localStorage.removeItem(LS_KEY);
    }
    this.queue = [];
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Plausible-shaped HTTP tracker (stub; swap in real fetch in production)
 * ────────────────────────────────────────────────────────────────────────── */
export interface PlausibleConfig {
  endpoint: string;
  site?: string;
  fetchImpl?: typeof fetch;
}

export class PlausibleAnalyticsTracker implements AnalyticsTracker {
  constructor(
    private readonly cfg: PlausibleConfig,
    private readonly inner: AnalyticsTracker = new LocalStorageTracker(),
  ) {}

  isSupported(): boolean {
    return typeof fetch !== 'undefined';
  }

  identify(learnerId: string): void {
    this.inner.identify(learnerId);
  }

  track<N extends EventName>(event: EventOf<N>): void {
    // The inner tracker is the source of truth — durable buffer.
    this.inner.track(event);
    // Fire-and-forget POST. Plausible's real API takes a script tag, but
    // a custom-event POST is acceptable and cookie-less.
    if (typeof fetch === 'undefined' || !this.cfg.endpoint) return;
    const body = JSON.stringify({
      name: event.name,
      url: typeof window !== 'undefined' ? window.location.pathname : '',
      domain: this.cfg.site ?? 'pybe.local',
      props: event.props,
    });
    void (this.cfg.fetchImpl ?? fetch)(this.cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  }

  async flush(): Promise<number> {
    return this.inner.flush();
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Module-level singleton with test seam (mirrors runner.ts / voice.ts)
 * ────────────────────────────────────────────────────────────────────────── */

let tracker: AnalyticsTracker = new LocalStorageTracker();

export function getTracker(): AnalyticsTracker {
  return tracker;
}

export function setTrackerForTesting(t: AnalyticsTracker | null): void {
  tracker = t ?? new LocalStorageTracker();
}

/** Convenience helper: typed `track` for any event name. */
export function trackEvent<N extends EventName>(
  name: N,
  props: EventPropsByName[N],
): void {
  const t = getTracker();
  if (!t.isSupported()) return;
  t.track({
    name,
    userId: '',
    props,
    ts: Date.now(),
  });
}
