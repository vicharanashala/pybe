/**
 * A small in-memory TTL cache. Deliberately simple (a single process-level
 * Map) since PyBe's backend is a single Node process backed by a JSON file
 * store, not a distributed system. Performance Requirements ask to "cache
 * repeated AI responses where appropriate" - "appropriate" here means
 * responses that are expensive to (re)compute and fine to reuse, such as a
 * mastery summary or a recommendation rationale for the same learner state.
 * Tutor chat and "explain this differently" are intentionally never cached,
 * since Feature 7 explicitly asks for fresh wording each time.
 */

const store = new Map();

function buildKey(namespace, params) {
  return `${namespace}::${JSON.stringify(params, Object.keys(params).sort())}`;
}

function get(namespace, params) {
  const entry = store.get(buildKey(namespace, params));
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    store.delete(buildKey(namespace, params));
    return null;
  }
  return entry.value;
}

function set(namespace, params, value, ttlMs = 5 * 60 * 1000) {
  store.set(buildKey(namespace, params), { value, expiresAt: Date.now() + ttlMs });
}

async function withCache(namespace, params, ttlMs, compute) {
  const cached = get(namespace, params);
  if (cached !== null) return { value: cached, cached: true };
  const value = await compute();
  set(namespace, params, value, ttlMs);
  return { value, cached: false };
}

module.exports = { get, set, withCache };
