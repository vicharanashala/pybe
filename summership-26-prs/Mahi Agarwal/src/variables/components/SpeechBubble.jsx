import React from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

// A single line of dialogue from Doraemon or Nobita, typed out letter by
// letter. Shows a "Continue" (or custom label) button once typing finishes,
// and lets the caller supply its own button instead when it needs custom
// timing (e.g. waiting on an animation to finish first).
export default function SpeechBubble({ speaker, text, onContinue, ctaLabel = 'Continue', hideButton = false, speed = 20 }) {
  const { shown, done } = useTypewriter(text, speed);
  const name = speaker === 'doraemon' ? 'Doraemon' : speaker === 'nobita' ? 'Nobita' : '';

  return (
    <div className="dm-dialogue-row">
      <span className={`dm-avatar dm-avatar-${speaker}`} aria-hidden="true">
        {speaker === 'doraemon' ? '🐱' : speaker === 'nobita' ? '🧒' : '✨'}
      </span>
      <div className="dm-speech-bubble">
        {name && <span className={`dm-speech-name ${speaker}`}>{name}</span>}
        <p>{shown}{!done && <span className="dm-cursor">|</span>}</p>
        {done && !hideButton && onContinue && (
          <button className="dm-btn dm-cta" style={{ marginTop: 10 }} onClick={onContinue}>{ctaLabel} {'→'}</button>
        )}
      </div>
    </div>
  );
}
