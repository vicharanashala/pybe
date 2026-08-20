import React, { useState, useEffect } from 'react';

export default function TypewriterText({ text = '', speed = 25, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        if (onComplete) onComplete();
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  const handleSkip = () => {
    setDisplayedText(text);
    setIsComplete(true);
    if (onComplete) onComplete();
  };

  return (
    <span onClick={handleSkip} className="cursor-pointer select-none" title="Click to reveal full message">
      {displayedText}
      {!isComplete && <span className="animate-pulse text-amber-400 font-bold ml-0.5">|</span>}
    </span>
  );
}
