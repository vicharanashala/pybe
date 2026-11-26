/**
 * The Sorting Investigation - Shared answer randomisation helper
 * ==============================================================
 * Question content, semantic answer keys and explanations stay fixed. Only the
 * presentation order of option buttons changes, independently for each group
 * and each new attempt. The random source is injectable so the test harness can
 * verify distribution and independence deterministically.
 */

const RandomizeModule = (function () {
  const UINT32_RANGE = 0x100000000;
  let customSource = null;

  function nextUint32() {
    if (customSource) {
      const value = Number(customSource());
      const bounded = Number.isFinite(value) ? Math.min(Math.max(value, 0), 0.9999999999999999) : Math.random();
      return Math.floor(bounded * UINT32_RANGE);
    }

    if (typeof window !== "undefined" && window.crypto && typeof window.crypto.getRandomValues === "function") {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      return buffer[0];
    }

    return Math.floor(Math.random() * UINT32_RANGE);
  }

  // Rejection sampling avoids modulo bias. Groups in this project are small,
  // so the rejected tail is negligible and the loop always terminates quickly.
  function randomInt(maxExclusive) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 1) return 0;
    if (maxExclusive > UINT32_RANGE) {
      throw new RangeError("randomInt range is too large for this generator");
    }
    const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
    let value = nextUint32();
    while (value >= limit) value = nextUint32();
    return value % maxExclusive;
  }

  function shuffled(values) {
    const result = Array.from(values || []);
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapWith = randomInt(index + 1);
      if (swapWith === index) continue;
      const current = result[index];
      result[index] = result[swapWith];
      result[swapWith] = current;
    }
    return result;
  }

  function shuffleGroup(selector) {
    const elements = Array.from(document.querySelectorAll(selector));
    const ordered = shuffled(elements);
    ordered.forEach((element) => {
      const parent = element.parentNode;
      if (!parent || typeof parent.removeChild !== "function") return;
      parent.removeChild(element);
      parent.appendChild(element);
    });
    return ordered;
  }

  function setRandomSource(source) {
    customSource = typeof source === "function" ? source : null;
  }

  return { randomInt, shuffled, shuffleGroup, setRandomSource };
})();

window.RandomizeModule = RandomizeModule;
