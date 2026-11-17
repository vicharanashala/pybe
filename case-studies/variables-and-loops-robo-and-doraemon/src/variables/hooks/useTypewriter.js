import { useEffect, useState } from 'react';

// Self-contained typewriter hook for the Variables module (deliberately not
// shared with other modules so this module has no coupling to Loops).
export function useTypewriter(text, speed = 18) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown('');
    setDone(false);
    if (!text) { setDone(true); return; }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { shown, done };
}
