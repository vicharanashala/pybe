import { useEffect, useState } from "react";

/**
 * Reveals `totalLength` characters one at a time.
 *
 * @param {number} totalLength - how many characters to reveal in total
 * @param {string|number} resetKey - changing this restarts the animation
 *   (pass the story card's id so a new card always types from scratch)
 * @param {{speed?: number, startDelay?: number}} [options]
 */
export function useTypewriter(totalLength, resetKey, { speed = 20, startDelay = 150 } = {}) {
  const [revealCount, setRevealCount] = useState(0);
  const [isDone, setIsDone] = useState(totalLength === 0);

  useEffect(() => {
    setRevealCount(0);
    setIsDone(totalLength === 0);

    if (totalLength === 0) return undefined;

    let intervalId;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        setRevealCount((prev) => {
          const next = prev + 1;
          if (next >= totalLength) {
            clearInterval(intervalId);
            setIsDone(true);
            return totalLength;
          }
          return next;
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startId);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, totalLength, speed, startDelay]);

  function skip() {
    setRevealCount(totalLength);
    setIsDone(true);
  }

  return { revealCount, isDone, skip };
}