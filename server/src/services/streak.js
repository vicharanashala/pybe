const DAY_MS = 24 * 60 * 60 * 1000;

function toDateOnly(isoString) {
  return new Date(isoString).toISOString().slice(0, 10);
}

function daysBetween(dateA, dateB) {
  return Math.round((new Date(dateB) - new Date(dateA)) / DAY_MS);
}

/**
 * Computes a learning streak from a list of session timestamps.
 * Pure function: no I/O, no side effects, easy to unit test.
 *
 * @param {string[]} sessionDates - array of ISO timestamps (session.createdAt)
 * @param {string} [todayDateString] - override "today" for deterministic tests, YYYY-MM-DD
 * @returns {{ current: number, longest: number, lastActiveDate: string|null }}
 */
function computeStreak(sessionDates = [], todayDateString) {
  if (!sessionDates.length) {
    return { current: 0, longest: 0, lastActiveDate: null };
  }

  const activeDays = [...new Set(sessionDates.map(toDateOnly))].sort();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < activeDays.length; i += 1) {
    const gap = daysBetween(activeDays[i - 1], activeDays[i]);
    run = gap === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const lastActiveDate = activeDays[activeDays.length - 1];
  const today = todayDateString || toDateOnly(new Date().toISOString());
  const gapFromToday = daysBetween(lastActiveDate, today);

  let current = 0;
  if (gapFromToday <= 1) {
    current = 1;
    for (let i = activeDays.length - 1; i > 0; i -= 1) {
      const gap = daysBetween(activeDays[i - 1], activeDays[i]);
      if (gap === 1) {
        current += 1;
      } else {
        break;
      }
    }
  }

  return { current, longest: Math.max(longest, current), lastActiveDate };
}

module.exports = { computeStreak };
