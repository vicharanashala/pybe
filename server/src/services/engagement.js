/**
 * Computes total learning time from a list of sessions.
 * Pure function: no I/O, no side effects, easy to unit test.
 *
 * @param {{durationSeconds?: number}[]} sessions
 * @returns {number} total seconds spent across all sessions
 */
function computeTotalTimeSpent(sessions = []) {
  return sessions.reduce((total, session) => {
    const seconds = Number(session.durationSeconds) || 0;
    return total + Math.max(0, seconds);
  }, 0);
}

module.exports = { computeTotalTimeSpent };