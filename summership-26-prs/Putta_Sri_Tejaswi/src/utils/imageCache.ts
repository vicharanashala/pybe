/**
 * Image caching + preloading for Pollinations.ai portraits.
 * Dual-layer: in-memory Map (fast) + localStorage (survives refresh).
 * All Pollinations URLs pass through getCachedUrl so the same character
 * never triggers a duplicate network request.
 */

const CACHE_KEY = 'pybe-image-cache';
const MAX_ENTRIES = 500;

// --- In-memory cache ---
const mem = new Map<string, string>();

// --- Load persisted URLs on module init ---
try {
  const raw = localStorage.getItem(CACHE_KEY);
  if (raw) {
    const entries: [string, string][] = JSON.parse(raw);
    for (const [k, v] of entries) mem.set(k, v);
  }
} catch { /* corrupt data — ignore */ }

function persist(): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify([...mem.entries()].slice(0, MAX_ENTRIES)));
  } catch { /* storage full — silent */ }
}

/**
 * Return the cached URL for `key`, or generate + cache it.
 * `key` is any stable identifier (e.g. character name, topic+scene).
 * `generate` is a function that builds the Pollinations URL.
 */
export function getCachedUrl(key: string, generate: () => string): string {
  const hit = mem.get(key);
  if (hit) return hit;
  const url = generate();
  mem.set(key, url);
  persist();
  return url;
}

// --- Preloading (browser Image decode) ---

const loaded = new Set<string>();
const pending = new Map<string, Promise<void>>();

export function preloadImage(url: string): Promise<void> {
  if (loaded.has(url)) return Promise.resolve();
  const existing = pending.get(url);
  if (existing) return existing;

  const p = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => { loaded.add(url); pending.delete(url); resolve(); };
    img.onerror = () => { pending.delete(url); reject(new Error(`Failed to load: ${url}`)); };
    img.src = url;
  });
  pending.set(url, p);
  return p;
}

/** Mark a URL as loaded (called by <img> onLoad). */
export function markImageLoaded(url: string): void {
  loaded.add(url);
  pending.delete(url);
}

export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(preloadImage));
}

export function isImageCached(url: string): boolean {
  return loaded.has(url);
}

export function clearImageCache(): void {
  mem.clear();
  loaded.clear();
  pending.clear();
  localStorage.removeItem(CACHE_KEY);
}

// --- Shared React hook for image loading + retry ---

import { useState, useCallback, useEffect, useRef } from 'react';

const MAX_RETRIES = 3;

export function usePollinationsImage(url: string) {
  const [loaded, setLoaded] = useState(() => isImageCached(url));
  const [errored, setErrored] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const urlRef = useRef(url);
  urlRef.current = url;

  useEffect(() => {
    setLoaded(isImageCached(url));
    setErrored(false);
    setAttempts(0);
  }, [url]);

  const handleLoad = useCallback(() => {
    markImageLoaded(url);
    setLoaded(true);
  }, [url]);

  const handleError = useCallback(() => {
    if (attempts < MAX_RETRIES) {
      setAttempts(a => a + 1);
      const delay = 1000 * Math.pow(2, attempts);
      setTimeout(() => {
        preloadImage(urlRef.current).then(() => setLoaded(true)).catch(() => {});
      }, delay);
    } else {
      setErrored(true);
    }
  }, [url, attempts]);

  return { loaded, errored, handleLoad, handleError };
}
