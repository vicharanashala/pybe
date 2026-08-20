// Wipes all pyBe lesson progress from localStorage, but ONLY when this dev
// server process (`npm run dev`) is a fresh boot — never on a plain browser
// refresh within the same dev session.
//
// How it works: vite.config.js's `define` bakes __PYBE_BOOT_ID__ into the
// bundle as a literal, evaluated once when the Vite dev server process
// starts (see vite.config.js). That value is fixed for the entire life of
// that process — HMR updates and page refreshes don't change it. Only
// stopping and re-running `npm run dev` produces a new value. We compare
// it against whatever boot id was last stored in localStorage:
//   - same value  -> same dev server session, a plain refresh -> leave
//     all progress alone, resume as normal.
//   - different/missing -> the dev server was restarted since the page
//     last loaded -> clear everything and start from the beginning.
//
// Dev-only by design (import.meta.env.DEV guard) — production builds never
// wipe a real learner's progress this way.

const BOOT_ID_KEY = "pybe_boot_id";
const APP_KEY_PREFIX = "pybe_";

export function resetProgressOnDevServerRestart() {
  if (!import.meta.env.DEV) return;

  // eslint-disable-next-line no-undef -- injected by vite.config.js's `define`
  const currentBootId = String(__PYBE_BOOT_ID__);
  const storedBootId = localStorage.getItem(BOOT_ID_KEY);

  if (storedBootId === currentBootId) return; // same dev session, do nothing

  Object.keys(localStorage)
    .filter((key) => key.startsWith(APP_KEY_PREFIX) && key !== BOOT_ID_KEY)
    .forEach((key) => localStorage.removeItem(key));

  localStorage.setItem(BOOT_ID_KEY, currentBootId);
}