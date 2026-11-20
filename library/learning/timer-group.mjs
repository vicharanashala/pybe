// A cancellable group for one mounted story interaction.
export function createTimerGroup(clock = globalThis) {
  const timeouts = new Set(),
    intervals = new Set(),
    frames = new Set();
  let disposed = false,
    generation = 0;
  return {
    setTimeout(fn, delay, ...args) {
      if (disposed) return null;
      const epoch = generation;
      const id = clock.setTimeout(() => {
        timeouts.delete(id);
        if (!disposed && epoch === generation) fn(...args);
      }, delay);
      timeouts.add(id);
      return id;
    },
    clearTimeout(id) {
      clock.clearTimeout(id);
      timeouts.delete(id);
    },
    setInterval(fn, delay, ...args) {
      if (disposed) return null;
      const epoch = generation;
      const id = clock.setInterval(() => {
        if (!disposed && epoch === generation) fn(...args);
      }, delay);
      intervals.add(id);
      return id;
    },
    clearInterval(id) {
      clock.clearInterval(id);
      intervals.delete(id);
    },
    requestAnimationFrame(fn) {
      if (disposed) return null;
      const epoch = generation;
      const id = clock.requestAnimationFrame((time) => {
        frames.delete(id);
        if (!disposed && epoch === generation) fn(time);
      });
      frames.add(id);
      return id;
    },
    cancelAnimationFrame(id) {
      clock.cancelAnimationFrame(id);
      frames.delete(id);
    },
    activate() {
      disposed = false;
    },
    dispose() {
      disposed = true;
      generation++;
      for (const id of timeouts) clock.clearTimeout(id);
      for (const id of intervals) clock.clearInterval(id);
      for (const id of frames) clock.cancelAnimationFrame(id);
      timeouts.clear();
      intervals.clear();
      frames.clear();
    },
  };
}
